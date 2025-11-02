import type { TrustworthinessDetails, CheckResult } from '../types.js'

/**
 * Trustworthiness (可信度) 评分规则
 * 评估内容的可信度和透明度
 */
export class TrustworthinessRules {
  /**
   * 评估 Trustworthiness 维度
   */
  evaluate(content: string, frontmatter?: Record<string, any>): TrustworthinessDetails {
    const checks = {
      allDataSourced: this.checkDataSources(content),
      hasPublishDate: this.checkPublishDate(frontmatter),
      hasUpdateDate: this.checkUpdateDate(frontmatter),
      hasContactInfo: this.checkContactInfo(content, frontmatter)
    }

    const score = Object.values(checks).reduce((sum, check) => sum + check.score * 2.5, 0)

    return {
      score: Math.round(score * 10) / 10,
      checks
    }
  }

  /**
   * 检查数据是否有来源
   */
  private checkDataSources(content: string): CheckResult {
    // 查找数字声明
    const dataStatements = content.match(/(\d+[%个件次人]|\d+\s*(users|items|cases|people))/gi) || []

    if (dataStatements.length === 0) {
      return {
        passed: true,
        score: 1,
        message: '✓ 无需验证数据'
      }
    }

    // 查找引用标记
    const citations = content.match(/\[\d+\]|\([A-Z][a-z]+,\s*\d{4}\)/g) || []

    // 理想情况:每个数据声明都有引用
    // 实际要求:至少 60% 的数据有引用
    const sourcedRatio = citations.length / dataStatements.length

    return {
      passed: sourcedRatio >= 0.6,
      score: Math.min(sourcedRatio, 1),
      message: sourcedRatio >= 0.6
        ? `✓ 数据有来源引用 (${citations.length}/${dataStatements.length})`
        : `✗ 数据缺少来源 (${citations.length}/${dataStatements.length},建议 ≥${Math.ceil(dataStatements.length * 0.6)})`,
      data: {
        dataStatements: dataStatements.length,
        citations: citations.length,
        sourcedRatio: Math.round(sourcedRatio * 100)
      }
    }
  }

  /**
   * 检查是否有发布时间
   */
  private checkPublishDate(frontmatter?: Record<string, any>): CheckResult {
    if (!frontmatter) {
      return {
        passed: false,
        score: 0,
        message: '✗ 缺少 frontmatter (建议添加发布时间)'
      }
    }

    const hasDate = Boolean(
      frontmatter.date ||
      frontmatter.publishDate ||
      frontmatter.published ||
      frontmatter.发布时间 ||
      frontmatter.日期
    )

    return {
      passed: hasDate,
      score: hasDate ? 1 : 0,
      message: hasDate
        ? '✓ 包含发布时间'
        : '✗ 缺少发布时间 (建议在 frontmatter 中添加 date)'
    }
  }

  /**
   * 检查是否有更新时间
   */
  private checkUpdateDate(frontmatter?: Record<string, any>): CheckResult {
    if (!frontmatter) {
      return {
        passed: false,
        score: 0.5, // 没有更新时间不是严重问题
        message: '- 无更新时间记录'
      }
    }

    const hasUpdate = Boolean(
      frontmatter.updated ||
      frontmatter.updateDate ||
      frontmatter.lastModified ||
      frontmatter.更新时间 ||
      frontmatter.修改时间
    )

    return {
      passed: hasUpdate,
      score: hasUpdate ? 1 : 0.5,
      message: hasUpdate
        ? '✓ 包含更新时间'
        : '- 无更新时间 (建议定期更新并记录)'
    }
  }

  /**
   * 检查是否有联系方式
   */
  private checkContactInfo(content: string, frontmatter?: Record<string, any>): CheckResult {
    // 在 frontmatter 中查找
    const frontmatterContact = frontmatter && Boolean(
      frontmatter.email ||
      frontmatter.contact ||
      frontmatter.twitter ||
      frontmatter.github ||
      frontmatter.website ||
      frontmatter.联系方式 ||
      frontmatter.邮箱
    )

    // 在内容中查找
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    const socialPattern = /(@[a-zA-Z0-9_]{1,15}|github\.com\/[a-zA-Z0-9-]+|twitter\.com\/[a-zA-Z0-9_]+)/i

    const hasEmailInContent = emailPattern.test(content)
    const hasSocialInContent = socialPattern.test(content)

    const hasContact = frontmatterContact || hasEmailInContent || hasSocialInContent

    return {
      passed: hasContact,
      score: hasContact ? 1 : 0.3,
      message: hasContact
        ? '✓ 包含联系方式'
        : '✗ 缺少联系方式 (建议添加邮箱或社交媒体)',
      data: {
        frontmatterContact,
        hasEmailInContent,
        hasSocialInContent
      }
    }
  }
}
