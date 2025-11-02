import type { ContentType } from './types/base.js'

/**
 * 内容类型检测器
 * 自动识别文章属于哪种类型
 */
export class ContentDetector {
  /**
   * 检测内容类型
   */
  detect(content: string, frontmatter?: Record<string, any>): ContentType {
    // 1. 检查 frontmatter 中的显式类型
    if (frontmatter?.type || frontmatter?.schema) {
      const explicitType = (frontmatter.type || frontmatter.schema).toLowerCase()
      if (this.isValidType(explicitType)) {
        return explicitType as ContentType
      }
    }

    // 2. 基于内容特征自动检测
    const scores = {
      article: this.scoreArticle(content),
      howto: this.scoreHowTo(content),
      review: this.scoreReview(content),
      faq: this.scoreFAQ(content),
      person: this.scorePerson(content, frontmatter)
    }

    // 返回得分最高的类型
    return Object.entries(scores).reduce((a, b) =>
      scores[a[0] as ContentType] > scores[b[0] as ContentType] ? a : b
    )[0] as ContentType
  }

  /**
   * Article 评分
   */
  private scoreArticle(content: string): number {
    let score = 0

    // 基础分 - 如果没有其他明显特征,默认为文章
    score += 3

    // 有标题和段落
    if (/^#{1,6}\s+.+$/m.test(content)) score += 2

    // 有引用
    if (/\[\d+\]/.test(content)) score += 1

    // 有代码示例
    if (/```[\s\S]*?```/.test(content)) score += 1

    return score
  }

  /**
   * HowTo 评分
   */
  private scoreHowTo(content: string): number {
    let score = 0

    // 关键词匹配
    const howtoKeywords = [
      /如何/g, /怎么/g, /步骤/g, /教程/g,
      /\bhow to\b/gi, /\bsteps\b/gi, /\btutorial\b/gi, /\bguide\b/gi
    ]
    howtoKeywords.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) score += matches.length * 2
    })

    // 有编号步骤
    const numberedSteps = content.match(/^(\d+\.|\d+\))\s+/gm)
    if (numberedSteps && numberedSteps.length >= 3) {
      score += numberedSteps.length
    }

    // 有"所需材料"、"准备工作"等
    if (/所需|材料|工具|准备|requirements?|tools?|materials?/i.test(content)) {
      score += 3
    }

    return score
  }

  /**
   * Review 评分
   */
  private scoreReview(content: string): number {
    let score = 0

    // 关键词匹配
    const reviewKeywords = [
      /评测/g, /评价/g, /体验/g, /优缺点/g,
      /\breview\b/gi, /\bpros?\b/gi, /\bcons?\b/gi, /\brating\b/gi
    ]
    reviewKeywords.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) score += matches.length * 2
    })

    // 有评分/星级
    if (/[★⭐✨]{1,5}|(\d+\/\d+|\d+分)/.test(content)) {
      score += 3
    }

    // 有"优点"、"缺点"章节
    if (/(优点|优势|pros?)[:：]/i.test(content) &&
        /(缺点|劣势|cons?)[:：]/i.test(content)) {
      score += 5
    }

    // 有对比
    if (/(vs|对比|比较|versus)/i.test(content)) {
      score += 2
    }

    return score
  }

  /**
   * FAQ 评分
   */
  private scoreFAQ(content: string): number {
    let score = 0

    // 问答格式
    const questions = content.match(/^(问|Q|Question)[:：]/gim)
    const answers = content.match(/^(答|A|Answer)[:：]/gim)

    if (questions && questions.length >= 3) {
      score += questions.length * 3
    }

    if (answers && answers.length >= 3) {
      score += answers.length * 2
    }

    // 问号密度
    const questionMarks = (content.match(/\?/g) || []).length
    if (questionMarks >= 5) {
      score += Math.min(questionMarks, 10)
    }

    // 标题是问句
    const headingQuestions = content.match(/^#{2,6}\s+.+\?$/gm)
    if (headingQuestions && headingQuestions.length >= 3) {
      score += headingQuestions.length * 2
    }

    return score
  }

  /**
   * Person 评分
   */
  private scorePerson(content: string, frontmatter?: Record<string, any>): number {
    let score = 0

    // frontmatter 中有 bio/about
    if (frontmatter?.bio || frontmatter?.about || frontmatter?.biography) {
      score += 10
    }

    // 内容关键词
    const personKeywords = [
      /个人简介/g, /关于我/g, /作者介绍/g,
      /\babout me\b/gi, /\bbiography\b/gi, /\bprofile\b/gi
    ]
    personKeywords.forEach(pattern => {
      if (pattern.test(content)) score += 3
    })

    // 有社交媒体链接
    const socialLinks = content.match(/(twitter|github|linkedin|facebook)\.com/gi)
    if (socialLinks && socialLinks.length >= 2) {
      score += 5
    }

    return score
  }

  /**
   * 检查是否是有效类型
   */
  private isValidType(type: string): boolean {
    return ['article', 'howto', 'review', 'faq', 'person'].includes(type)
  }
}
