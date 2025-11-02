import type { EEATScore, ScorerOptions, Recommendation } from './types.js'
import { ContentAnalyzer } from './content-analyzer.js'
import { ExperienceRules } from './rules/experience-rules.js'
import { ExpertiseRules } from './rules/expertise-rules.js'
import { AuthoritativenessRules } from './rules/authoritativeness-rules.js'
import { TrustworthinessRules } from './rules/trustworthiness-rules.js'

/**
 * E-E-A-T 评分器
 * 综合评估内容的 E-E-A-T 得分
 */
export class EEATScorer {
  private analyzer: ContentAnalyzer
  private experienceRules: ExperienceRules
  private expertiseRules: ExpertiseRules
  private authoritativenessRules: AuthoritativenessRules
  private trustworthinessRules: TrustworthinessRules

  constructor() {
    this.analyzer = new ContentAnalyzer()
    this.experienceRules = new ExperienceRules()
    this.expertiseRules = new ExpertiseRules()
    this.authoritativenessRules = new AuthoritativenessRules()
    this.trustworthinessRules = new TrustworthinessRules()
  }

  /**
   * 评估文章的 E-E-A-T 得分
   */
  score(markdown: string, options: ScorerOptions = {}): EEATScore {
    // 分析内容
    const analysis = this.analyzer.analyze(markdown)

    // 各维度评分
    const experience = this.experienceRules.evaluate(analysis.content)
    const expertise = this.expertiseRules.evaluate(analysis.content, analysis)
    const authoritativeness = this.authoritativenessRules.evaluate(
      analysis.content,
      analysis,
      analysis.frontmatter
    )
    const trustworthiness = this.trustworthinessRules.evaluate(
      analysis.content,
      analysis.frontmatter
    )

    // 计算总分 (加权平均)
    const overall = (
      experience.score * 0.25 +
      expertise.score * 0.25 +
      authoritativeness.score * 0.25 +
      trustworthiness.score * 0.25
    )

    // 生成优化建议
    const recommendations = this.generateRecommendations({
      experience,
      expertise,
      authoritativeness,
      trustworthiness
    }, options.target)

    return {
      overall: Math.round(overall * 10) / 10,
      breakdown: {
        experience: experience.score,
        expertise: expertise.score,
        authoritativeness: authoritativeness.score,
        trustworthiness: trustworthiness.score
      },
      details: {
        experience,
        expertise,
        authoritativeness,
        trustworthiness
      },
      recommendations,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * 生成优化建议
   */
  private generateRecommendations(
    details: EEATScore['details'],
    target?: ScorerOptions['target']
  ): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Experience 建议
    const experienceTarget = target?.experience ?? 8
    if (details.experience.score < experienceTarget) {
      const gap = experienceTarget - details.experience.score

      Object.entries(details.experience.checks).forEach(([key, check]) => {
        if (!check.passed) {
          recommendations.push({
            dimension: 'experience',
            priority: gap > 2 ? 'high' : 'medium',
            message: check.message.replace('✗ ', ''),
            impact: check.score * 2.5
          })
        }
      })
    }

    // Expertise 建议
    const expertiseTarget = target?.expertise ?? 8
    if (details.expertise.score < expertiseTarget) {
      const gap = expertiseTarget - details.expertise.score

      Object.entries(details.expertise.checks).forEach(([key, check]) => {
        if (!check.passed) {
          recommendations.push({
            dimension: 'expertise',
            priority: gap > 2 ? 'high' : 'medium',
            message: check.message.replace('✗ ', ''),
            impact: check.score * 2.5
          })
        }
      })
    }

    // Authoritativeness 建议
    const authoritativenessTarget = target?.authoritativeness ?? 8
    if (details.authoritativeness.score < authoritativenessTarget) {
      const gap = authoritativenessTarget - details.authoritativeness.score

      Object.entries(details.authoritativeness.checks).forEach(([key, check]) => {
        if (!check.passed) {
          recommendations.push({
            dimension: 'authoritativeness',
            priority: gap > 2 ? 'high' : gap > 1 ? 'medium' : 'low',
            message: check.message.replace('✗ ', ''),
            impact: check.score * 2.5
          })
        }
      })
    }

    // Trustworthiness 建议
    const trustworthinessTarget = target?.trustworthiness ?? 9
    if (details.trustworthiness.score < trustworthinessTarget) {
      const gap = trustworthinessTarget - details.trustworthiness.score

      Object.entries(details.trustworthiness.checks).forEach(([key, check]) => {
        if (!check.passed && check.score < 1) {
          recommendations.push({
            dimension: 'trustworthiness',
            priority: gap > 2 ? 'high' : gap > 1 ? 'medium' : 'low',
            message: check.message.replace('✗ ', '').replace('- ', ''),
            impact: check.score * 2.5
          })
        }
      })
    }

    // 按优先级和影响排序
    return recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.impact - a.impact
    })
  }
}
