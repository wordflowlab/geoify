import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import matter from 'gray-matter'
import type {
  LlmsTxtConfig,
  LlmsTxtOutput,
  ArticleMetadata,
  CategorizedArticles
} from './types.js'
import { EEATScorer } from '../scoring/eeat-scorer.js'

/**
 * llms.txt 和 llms-full.txt 生成器
 *
 * 核心功能:
 * 1. 扫描文章目录,解析 frontmatter
 * 2. 计算 E-E-A-T 分数
 * 3. 基于标签自动分类
 * 4. 生成 llms.txt (导航索引)
 * 5. 生成 llms-full.txt (完整内容)
 */
export class LLMsTxtGenerator {
  private config: LlmsTxtConfig
  private scorer: EEATScorer

  constructor(config: LlmsTxtConfig) {
    this.config = {
      minEEATScore: 7.0,
      maxArticles: 100,
      ...config
    }
    this.scorer = new EEATScorer()
  }

  /**
   * 生成 llms.txt 和 llms-full.txt
   */
  async generate(articlesDir: string): Promise<LlmsTxtOutput> {
    // 1. 扫描和解析所有文章
    const articles = await this.scanArticles(articlesDir)

    // 2. 过滤低质量文章
    const qualityArticles = this.filterByQuality(articles)

    // 3. 按 E-E-A-T 分数排序
    const sortedArticles = this.sortByEEAT(qualityArticles)

    // 4. 按标签分类
    const categorized = this.categorizeArticles(sortedArticles)

    // 5. 生成 llms.txt
    const llmsTxt = this.generateLlmsTxt(categorized, sortedArticles)

    // 6. 生成 llms-full.txt
    const llmsFullTxt = await this.generateLlmsFullTxt(categorized, sortedArticles, articlesDir)

    // 7. 生成元数据
    const metadata = this.generateMetadata(sortedArticles, categorized)

    return {
      llmsTxt,
      llmsFullTxt,
      metadata
    }
  }

  /**
   * 扫描文章目录,提取元数据
   */
  private async scanArticles(articlesDir: string): Promise<ArticleMetadata[]> {
    const articles: ArticleMetadata[] = []

    try {
      const files = await this.getAllMarkdownFiles(articlesDir)

      for (const filePath of files) {
        try {
          const content = await readFile(filePath, 'utf-8')
          const { data: frontmatter, content: markdownContent } = matter(content)

          // 计算 E-E-A-T 分数
          const score = this.scorer.score(content)

          // 生成 URL (相对路径转 URL)
          const relativePath = relative(articlesDir, filePath)
          const url = this.config.siteUrl + '/' + relativePath.replace(/\.md$/, '')

          articles.push({
            title: frontmatter.title || this.extractTitle(markdownContent),
            description: frontmatter.description || this.extractDescription(markdownContent),
            url,
            tags: frontmatter.tags || [],
            category: frontmatter.category,
            publishDate: frontmatter.publishDate || frontmatter.date,
            author: frontmatter.author,
            eeatlScore: score.overall,
            filePath
          })
        } catch (error) {
          console.warn(`解析文章失败: ${filePath}`, error)
        }
      }
    } catch (error) {
      throw new Error(`扫描文章目录失败: ${error}`)
    }

    return articles
  }

  /**
   * 递归获取所有 Markdown 文件
   */
  private async getAllMarkdownFiles(dir: string): Promise<string[]> {
    const files: string[] = []
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        const subFiles = await this.getAllMarkdownFiles(fullPath)
        files.push(...subFiles)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }

    return files
  }

  /**
   * 从内容中提取标题
   */
  private extractTitle(content: string): string {
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : 'Untitled'
  }

  /**
   * 从内容中提取描述
   */
  private extractDescription(content: string): string {
    // 去除标题后的第一段
    const withoutTitle = content.replace(/^#\s+.+$/m, '').trim()
    const firstParagraph = withoutTitle.split('\n\n')[0]
    return firstParagraph.substring(0, 200).trim()
  }

  /**
   * 按质量过滤文章
   */
  private filterByQuality(articles: ArticleMetadata[]): ArticleMetadata[] {
    return articles.filter(article => {
      if (article.eeatlScore === undefined) return false
      return article.eeatlScore >= (this.config.minEEATScore || 7.0)
    })
  }

  /**
   * 按 E-E-A-T 分数排序并限制数量
   */
  private sortByEEAT(articles: ArticleMetadata[]): ArticleMetadata[] {
    return [...articles]
      .sort((a, b) => {
        const scoreA = a.eeatlScore || 0
        const scoreB = b.eeatlScore || 0
        return scoreB - scoreA
      })
      .slice(0, this.config.maxArticles || 100)
  }

  /**
   * 按标签分类文章
   */
  private categorizeArticles(articles: ArticleMetadata[]): CategorizedArticles {
    const categorized: CategorizedArticles = {}
    const categories = this.config.categories || {}

    // 初始化分类
    Object.keys(categories).forEach(category => {
      categorized[category] = []
    })

    // 未分类的文章
    categorized['其他'] = []

    for (const article of articles) {
      let assigned = false

      // 如果文章已指定分类
      if (article.category && categorized[article.category]) {
        categorized[article.category].push(article)
        assigned = true
        continue
      }

      // 根据标签自动分类
      const articleTags = article.tags || []

      for (const [categoryName, config] of Object.entries(categories)) {
        const categoryTags = config.tags || []
        const hasMatchingTag = articleTags.some(tag =>
          categoryTags.includes(tag)
        )

        if (hasMatchingTag) {
          categorized[categoryName].push(article)
          assigned = true
          break
        }
      }

      if (!assigned) {
        categorized['其他'].push(article)
      }
    }

    // 移除空分类
    Object.keys(categorized).forEach(category => {
      if (categorized[category].length === 0) {
        delete categorized[category]
      }
    })

    return categorized
  }

  /**
   * 生成 llms.txt 内容 (导航索引)
   */
  private generateLlmsTxt(categorized: CategorizedArticles, allArticles: ArticleMetadata[]): string {
    const lines: string[] = []

    // 网站头部
    lines.push(`# ${this.config.siteName}`)
    lines.push('')
    lines.push(`> ${this.config.siteDescription}`)
    lines.push('')

    // 主要内容分类
    const categories = this.config.categories || {}
    const sortedCategories = Object.keys(categorized).sort((a, b) => {
      const priorityA = categories[a]?.priority || 999
      const priorityB = categories[b]?.priority || 999
      return priorityA - priorityB
    })

    for (const category of sortedCategories) {
      const articles = categorized[category]
      if (articles.length === 0) continue

      const categoryLabel = categories[category]?.label || category
      lines.push(`## ${categoryLabel}`)
      lines.push('')

      for (const article of articles) {
        const description = article.description
          ? `: ${article.description.substring(0, 100)}`
          : ''
        lines.push(`- [${article.title}](${article.url})${description}`)
      }

      lines.push('')
    }

    // 网站元信息
    lines.push('## 关于')
    lines.push('')
    lines.push(`- [完整内容](${this.config.siteUrl}/llms-full.txt)`)
    lines.push(`- 总文章数: ${allArticles.length}`)
    lines.push(`- 最后更新: ${new Date().toISOString().split('T')[0]}`)
    lines.push('')

    return lines.join('\n')
  }

  /**
   * 生成 llms-full.txt 内容 (完整内容)
   */
  private async generateLlmsFullTxt(
    categorized: CategorizedArticles,
    allArticles: ArticleMetadata[],
    articlesDir: string
  ): Promise<string> {
    const lines: string[] = []

    // 网站头部
    lines.push(`# ${this.config.siteName}`)
    lines.push('')
    lines.push(`> ${this.config.siteDescription}`)
    lines.push('')
    lines.push('---')
    lines.push('')

    // 按分类输出完整内容
    const categories = this.config.categories || {}
    const sortedCategories = Object.keys(categorized).sort((a, b) => {
      const priorityA = categories[a]?.priority || 999
      const priorityB = categories[b]?.priority || 999
      return priorityA - priorityB
    })

    for (const category of sortedCategories) {
      const articles = categorized[category]
      if (articles.length === 0) continue

      const categoryLabel = categories[category]?.label || category
      lines.push(`## ${categoryLabel}`)
      lines.push('')

      for (const article of articles) {
        // 读取文章完整内容
        try {
          const content = await readFile(article.filePath, 'utf-8')
          const { content: markdownContent } = matter(content)

          lines.push(`### ${article.title}`)
          lines.push('')
          if (article.description) {
            lines.push(`> ${article.description}`)
            lines.push('')
          }
          lines.push(`**URL**: ${article.url}`)
          if (article.author) {
            lines.push(`**作者**: ${article.author}`)
          }
          if (article.publishDate) {
            lines.push(`**发布日期**: ${article.publishDate}`)
          }
          if (article.eeatlScore) {
            lines.push(`**E-E-A-T 分数**: ${article.eeatlScore}/10`)
          }
          lines.push('')
          lines.push(markdownContent.trim())
          lines.push('')
          lines.push('---')
          lines.push('')
        } catch (error) {
          console.warn(`读取文章内容失败: ${article.filePath}`, error)
        }
      }
    }

    // 网站元信息
    lines.push('## 关于本站')
    lines.push('')
    lines.push(`- 网站: ${this.config.siteUrl}`)
    lines.push(`- 总文章数: ${allArticles.length}`)
    lines.push(`- 最后更新: ${new Date().toISOString().split('T')[0]}`)
    lines.push('')

    return lines.join('\n')
  }

  /**
   * 生成元数据
   */
  private generateMetadata(
    allArticles: ArticleMetadata[],
    categorized: CategorizedArticles
  ) {
    const categorizedCount = Object.values(categorized)
      .filter(articles => articles.length > 0)
      .reduce((sum, articles) => sum + articles.length, 0)

    const uncategorizedCount = categorized['其他']?.length || 0

    const totalScore = allArticles.reduce((sum, article) =>
      sum + (article.eeatlScore || 0), 0
    )
    const averageScore = allArticles.length > 0
      ? totalScore / allArticles.length
      : 0

    return {
      totalArticles: allArticles.length,
      categorizedArticles: categorizedCount - uncategorizedCount,
      uncategorizedArticles: uncategorizedCount,
      averageEEATScore: Math.round(averageScore * 10) / 10,
      generatedAt: new Date().toISOString()
    }
  }
}
