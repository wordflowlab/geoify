import type { ArticleSchema, PersonSchema, SchemaOptions } from '../types/base.js'
import { SCHEMA_CONTEXT } from '../types/base.js'

/**
 * Article Schema 生成器
 */
export class ArticleGenerator {
  /**
   * 生成 Article Schema
   */
  generate(
    content: string,
    frontmatter: Record<string, any>,
    options: SchemaOptions = {}
  ): ArticleSchema {
    const schema: ArticleSchema = {
      '@context': SCHEMA_CONTEXT,
      '@type': this.detectArticleType(content, frontmatter),
      headline: this.extractHeadline(content, frontmatter),
      author: this.generateAuthor(frontmatter, options),
      datePublished: this.extractDate(frontmatter, 'date', 'publishDate', 'published'),
      inLanguage: options.language || this.detectLanguage(content)
    }

    // 可选字段
    const description = this.extractDescription(content, frontmatter)
    if (description) schema.description = description

    const dateModified = this.extractDate(frontmatter, 'updated', 'updateDate', 'modified', 'lastModified')
    if (dateModified) schema.dateModified = dateModified

    const image = this.extractImage(frontmatter)
    if (image) schema.image = image

    const keywords = this.extractKeywords(content, frontmatter)
    if (keywords.length > 0) schema.keywords = keywords

    const wordCount = this.countWords(content)
    if (wordCount > 0) schema.wordCount = wordCount

    if (options.url) {
      schema.mainEntityOfPage = options.url
    }

    // Publisher
    if (options.siteName) {
      schema.publisher = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'Organization',
        name: options.siteName,
        ...(options.siteLogo && { logo: options.siteLogo })
      }
    }

    // Citations
    const citations = this.extractCitations(content)
    if (citations.length > 0) {
      schema.citation = citations
    }

    return schema
  }

  /**
   * 检测文章类型
   */
  private detectArticleType(content: string, frontmatter: Record<string, any>): ArticleSchema['@type'] {
    // 显式指定
    if (frontmatter.articleType) {
      return frontmatter.articleType
    }

    // 基于内容检测
    if (/\b(news|新闻|快讯)\b/i.test(content)) return 'NewsArticle'
    if (/\b(tech|技术|代码|programming)\b/i.test(content)) return 'TechArticle'
    if (/\b(blog|博客)\b/i.test(content)) return 'BlogPosting'

    return 'Article'
  }

  /**
   * 提取标题
   */
  private extractHeadline(content: string, frontmatter: Record<string, any>): string {
    // 优先使用 frontmatter
    if (frontmatter.title || frontmatter.headline) {
      return frontmatter.title || frontmatter.headline
    }

    // 从内容中提取第一个一级标题
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) {
      return h1Match[1].trim()
    }

    return 'Untitled Article'
  }

  /**
   * 提取描述
   */
  private extractDescription(content: string, frontmatter: Record<string, any>): string | undefined {
    if (frontmatter.description || frontmatter.summary) {
      return frontmatter.description || frontmatter.summary
    }

    // 提取第一段
    const firstParagraph = content
      .replace(/^---[\s\S]*?---/, '') // 移除 frontmatter
      .replace(/^#.+$/gm, '') // 移除标题
      .trim()
      .split('\n\n')[0]

    if (firstParagraph && firstParagraph.length > 50) {
      return firstParagraph.substring(0, 200) + (firstParagraph.length > 200 ? '...' : '')
    }

    return undefined
  }

  /**
   * 生成作者信息
   */
  private generateAuthor(frontmatter: Record<string, any>, options: SchemaOptions): PersonSchema {
    const author: PersonSchema = {
      '@context': SCHEMA_CONTEXT,
      '@type': 'Person',
      name: frontmatter.author || options.authorOverride?.name || 'Anonymous'
    }

    // 从 frontmatter 或 options 获取额外信息
    const jobTitle = frontmatter.jobTitle || frontmatter.title || options.authorOverride?.jobTitle
    if (jobTitle) author.jobTitle = jobTitle

    const email = frontmatter.email || options.authorOverride?.email
    if (email) author.email = email

    const url = frontmatter.authorUrl || frontmatter.website || options.authorOverride?.url
    if (url) author.url = url

    // 社交媒体
    const sameAs: string[] = []
    if (frontmatter.twitter) sameAs.push(`https://twitter.com/${frontmatter.twitter.replace('@', '')}`)
    if (frontmatter.github) sameAs.push(`https://github.com/${frontmatter.github}`)
    if (frontmatter.linkedin) sameAs.push(frontmatter.linkedin)
    if (options.authorOverride?.sameAs) sameAs.push(...options.authorOverride.sameAs)

    if (sameAs.length > 0) author.sameAs = sameAs

    return author
  }

  /**
   * 提取日期
   */
  private extractDate(frontmatter: Record<string, any>, ...keys: string[]): string {
    for (const key of keys) {
      if (frontmatter[key]) {
        const date = new Date(frontmatter[key])
        if (!isNaN(date.getTime())) {
          return date.toISOString()
        }
      }
    }
    return new Date().toISOString()
  }

  /**
   * 提取图片
   */
  private extractImage(frontmatter: Record<string, any>): string | string[] | undefined {
    if (frontmatter.image) return frontmatter.image
    if (frontmatter.images) return frontmatter.images
    if (frontmatter.thumbnail) return frontmatter.thumbnail
    return undefined
  }

  /**
   * 提取关键词
   */
  private extractKeywords(content: string, frontmatter: Record<string, any>): string[] {
    if (frontmatter.keywords) {
      return Array.isArray(frontmatter.keywords) ? frontmatter.keywords : [frontmatter.keywords]
    }
    if (frontmatter.tags) {
      return Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags]
    }
    return []
  }

  /**
   * 统计词数
   */
  private countWords(content: string): number {
    const withoutCode = content.replace(/```[\s\S]*?```/g, '')
    const chineseChars = (withoutCode.match(/[\u4e00-\u9fa5]/g) || []).length
    const englishWords = (withoutCode.match(/[a-zA-Z]+/g) || []).length
    return chineseChars + englishWords
  }

  /**
   * 检测语言
   */
  private detectLanguage(content: string): string {
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
    const totalChars = content.length
    return chineseChars / totalChars > 0.3 ? 'zh-CN' : 'en-US'
  }

  /**
   * 提取引用
   */
  private extractCitations(content: string): Array<{ '@type': 'CreativeWork'; name: string; url: string }> {
    const citations: Array<{ '@type': 'CreativeWork'; name: string; url: string }> = []

    // 匹配引用格式: [1] Name - URL
    const citationPattern = /\[(\d+)\]\s*(.+?)\s*-\s*(https?:\/\/[^\s]+)/g
    let match

    while ((match = citationPattern.exec(content)) !== null) {
      citations.push({
        '@type': 'CreativeWork',
        name: match[2].trim(),
        url: match[3].trim()
      })
    }

    return citations
  }
}
