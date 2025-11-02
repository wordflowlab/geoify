import matter from 'gray-matter'
import type { ContentAnalysis } from './types.js'

/**
 * 内容分析器
 * 分析 Markdown 文章的结构和元数据
 */
export class ContentAnalyzer {
  /**
   * 分析文章内容
   */
  analyze(markdown: string): ContentAnalysis {
    // 解析 frontmatter
    const { data: frontmatter, content } = matter(markdown)

    // 基础统计
    const wordCount = this.countWords(content)
    const paragraphCount = this.countParagraphs(content)
    const headingCount = this.countHeadings(content)
    const linkCount = this.countLinks(content)
    const citationCount = this.countCitations(content)
    const codeBlockCount = this.countCodeBlocks(content)
    const listCount = this.countLists(content)
    const imageCount = this.countImages(content)

    return {
      content,
      frontmatter,
      wordCount,
      paragraphCount,
      headingCount,
      linkCount,
      citationCount,
      codeBlockCount,
      listCount,
      imageCount
    }
  }

  /**
   * 统计词数
   */
  private countWords(content: string): number {
    // 移除代码块
    const withoutCode = content.replace(/```[\s\S]*?```/g, '')
    // 移除链接
    const withoutLinks = withoutCode.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 统计中英文词数
    const chineseChars = (withoutLinks.match(/[\u4e00-\u9fa5]/g) || []).length
    const englishWords = (withoutLinks.match(/[a-zA-Z]+/g) || []).length

    return chineseChars + englishWords
  }

  /**
   * 统计段落数
   */
  private countParagraphs(content: string): number {
    return content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
  }

  /**
   * 统计标题数
   */
  private countHeadings(content: string): number {
    return (content.match(/^#{1,6}\s+.+$/gm) || []).length
  }

  /**
   * 统计链接数
   */
  private countLinks(content: string): number {
    return (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length
  }

  /**
   * 统计引用数
   */
  private countCitations(content: string): number {
    // 匹配 [1], [2] 或 (Smith, 2024) 格式
    const numbered = (content.match(/\[\d+\]/g) || []).length
    const apa = (content.match(/\([A-Z][a-z]+,\s*\d{4}\)/g) || []).length

    return numbered + apa
  }

  /**
   * 统计代码块数
   */
  private countCodeBlocks(content: string): number {
    return (content.match(/```[\s\S]*?```/g) || []).length
  }

  /**
   * 统计列表数
   */
  private countLists(content: string): number {
    const unordered = (content.match(/^[\s]*[-*+]\s+.+$/gm) || []).length
    const ordered = (content.match(/^[\s]*\d+\.\s+.+$/gm) || []).length

    return unordered + ordered
  }

  /**
   * 统计图片数
   */
  private countImages(content: string): number {
    return (content.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || []).length
  }

  /**
   * 检查是否包含第一人称
   */
  hasFirstPerson(content: string): boolean {
    const firstPersonPatterns = [
      /我([^们]|$)/,
      /咱们/,
      /\bI\b/,
      /\bwe\b/i,
      /我的/,
      /我们的/,
      /\bmy\b/i,
      /\bour\b/i
    ]

    return firstPersonPatterns.some(pattern => pattern.test(content))
  }

  /**
   * 检查是否包含具体细节
   */
  hasSpecificDetails(content: string): boolean {
    // 检查是否有数字、时间、地点等具体信息
    const hasNumbers = /\d+/.test(content)
    const hasTime = /(年|月|日|时|分|hour|minute|day|month|year)/i.test(content)
    const hasQuantity = /(\d+[%个件次]|\d+\s*(users|items|cases|times))/i.test(content)

    return hasNumbers && (hasTime || hasQuantity)
  }

  /**
   * 检查是否避免模糊表述
   */
  avoidsVagueTerms(content: string): { passed: boolean; vagueTermsCount: number } {
    const vaguePatterns = [
      /据说/g,
      /可能/g,
      /大概/g,
      /也许/g,
      /似乎/g,
      /\bmaybe\b/gi,
      /\bprobably\b/gi,
      /\bpossibly\b/gi,
      /\bseemingly\b/gi
    ]

    let vagueTermsCount = 0
    vaguePatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        vagueTermsCount += matches.length
      }
    })

    // 每 1000 字允许 3 个模糊词
    const wordCount = this.countWords(content)
    const threshold = Math.ceil(wordCount / 1000) * 3

    return {
      passed: vagueTermsCount <= threshold,
      vagueTermsCount
    }
  }

  /**
   * 提取引用来源
   */
  extractCitations(content: string): string[] {
    const citations: string[] = []

    // 提取 Markdown 链接
    const linkMatches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)
    for (const match of linkMatches) {
      if (match[2].startsWith('http')) {
        citations.push(match[2])
      }
    }

    // 提取引用区块中的链接
    const refMatches = content.matchAll(/^>\s*\[?\d*\]?\s*(.+)$/gm)
    for (const match of refMatches) {
      const urlMatch = match[1].match(/https?:\/\/[^\s]+/)
      if (urlMatch) {
        citations.push(urlMatch[0])
      }
    }

    return [...new Set(citations)] // 去重
  }
}
