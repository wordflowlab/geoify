import type { AuthoritativenessDetails, CheckResult, ContentAnalysis } from '../types.js'
import { ContentAnalyzer } from '../content-analyzer.js'

/**
 * Authoritativeness (权威性) 评分规则
 * 评估内容的权威性和可信来源
 */
export class AuthoritativenessRules {
  private analyzer: ContentAnalyzer

  constructor() {
    this.analyzer = new ContentAnalyzer()
  }

  /**
   * 评估 Authoritativeness 维度
   */
  evaluate(content: string, analysis: ContentAnalysis, frontmatter?: Record<string, any>): AuthoritativenessDetails {
    const checks = {
      hasCitations: this.checkCitations(content, analysis),
      citationCount: this.checkCitationCount(content, analysis),
      hasAuthorCredentials: this.checkAuthorCredentials(frontmatter),
      hasExternalLinks: this.checkExternalLinks(content)
    }

    const score = Object.values(checks).reduce((sum, check) => sum + check.score * 2.5, 0)

    return {
      score: Math.round(score * 10) / 10,
      checks
    }
  }

  /**
   * 检查是否有引用
   */
  private checkCitations(_content: string, analysis: ContentAnalysis): CheckResult {
    const hasCitations = analysis.citationCount > 0

    return {
      passed: hasCitations,
      score: hasCitations ? 1 : 0,
      message: hasCitations
        ? `✓ 包含引用 (${analysis.citationCount} 处)`
        : '✗ 缺少引用 (建议引用权威来源)'
    }
  }

  /**
   * 检查引用数量是否充足
   */
  private checkCitationCount(content: string, _analysis: ContentAnalysis): CheckResult {
    const citations = this.analyzer.extractCitations(content)
    const count = citations.length

    // 权威来源域名
    const authoritativeDomains = [
      'wikipedia.org',
      'github.com',
      'stackoverflow.com',
      'mdn.mozilla.org',
      '.edu',
      '.gov',
      'arxiv.org',
      'ieee.org',
      'acm.org'
    ]

    // 统计权威来源数量
    const authoritativeCount = citations.filter(url =>
      authoritativeDomains.some(domain => url.includes(domain))
    ).length

    const score = Math.min((count >= 3 ? 0.6 : count / 5) + (authoritativeCount >= 1 ? 0.4 : 0), 1)

    return {
      passed: count >= 3 && authoritativeCount >= 1,
      score,
      message: count >= 3 && authoritativeCount >= 1
        ? `✓ 引用充足 (${count} 个来源, ${authoritativeCount} 个权威来源)`
        : `✗ 引用不足 (${count} 个来源,建议 ≥3 个,其中至少 1 个权威来源)`,
      data: {
        totalCitations: count,
        authoritativeCitations: authoritativeCount,
        citations
      }
    }
  }

  /**
   * 检查是否有作者资质说明
   */
  private checkAuthorCredentials(frontmatter?: Record<string, any>): CheckResult {
    if (!frontmatter) {
      return {
        passed: false,
        score: 0,
        message: '✗ 缺少 frontmatter (建议添加作者信息)'
      }
    }

    const hasAuthor = Boolean(frontmatter.author || frontmatter.作者)
    const hasTitle = Boolean(frontmatter.jobTitle || frontmatter.title || frontmatter.职位)
    const hasCredentials = Boolean(frontmatter.credentials || frontmatter.资质)
    const hasContact = Boolean(frontmatter.email || frontmatter.contact || frontmatter.联系方式)

    const score = (
      (hasAuthor ? 0.4 : 0) +
      (hasTitle ? 0.2 : 0) +
      (hasCredentials ? 0.2 : 0) +
      (hasContact ? 0.2 : 0)
    )

    return {
      passed: hasAuthor && (hasTitle || hasCredentials),
      score,
      message: score >= 0.6
        ? '✓ 包含作者资质信息'
        : '✗ 作者资质不完整 (建议在 frontmatter 中添加 author, title, credentials)',
      data: {
        hasAuthor,
        hasTitle,
        hasCredentials,
        hasContact
      }
    }
  }

  /**
   * 检查是否有外部链接
   */
  private checkExternalLinks(content: string): CheckResult {
    const citations = this.analyzer.extractCitations(content)
    const externalLinks = citations.filter(url => url.startsWith('http'))

    return {
      passed: externalLinks.length >= 2,
      score: Math.min(externalLinks.length / 3, 1),
      message: externalLinks.length >= 2
        ? `✓ 包含外部链接 (${externalLinks.length} 个)`
        : `✗ 外部链接较少 (${externalLinks.length} 个,建议 ≥2 个)`,
      data: { externalLinks }
    }
  }
}
