import type { ExperienceDetails, CheckResult } from '../types.js'
import { ContentAnalyzer } from '../content-analyzer.js'

/**
 * Experience (体验) 评分规则
 * 评估内容是否基于真实经历
 */
export class ExperienceRules {
  private analyzer: ContentAnalyzer

  constructor() {
    this.analyzer = new ContentAnalyzer()
  }

  /**
   * 评估 Experience 维度
   */
  evaluate(content: string): ExperienceDetails {
    const checks = {
      hasFirstPerson: this.checkFirstPerson(content),
      hasSpecificDetails: this.checkSpecificDetails(content),
      hasRealCases: this.checkRealCases(content),
      avoidsVagueTerms: this.checkVagueTerms(content)
    }

    // 计算总分 (每项 0-2.5 分,总计 10 分)
    const score = Object.values(checks).reduce((sum, check) => sum + check.score * 2.5, 0)

    return {
      score: Math.round(score * 10) / 10, // 保留一位小数
      checks
    }
  }

  /**
   * 检查是否有第一人称叙述
   */
  private checkFirstPerson(content: string): CheckResult {
    const hasIt = this.analyzer.hasFirstPerson(content)

    return {
      passed: hasIt,
      score: hasIt ? 1 : 0,
      message: hasIt
        ? '✓ 包含第一人称叙述'
        : '✗ 缺少第一人称叙述 (建议添加 "我", "我们" 等)'
    }
  }

  /**
   * 检查是否有具体细节
   */
  private checkSpecificDetails(content: string): CheckResult {
    const hasIt = this.analyzer.hasSpecificDetails(content)

    return {
      passed: hasIt,
      score: hasIt ? 1 : 0.3,
      message: hasIt
        ? '✓ 包含具体时间/数字/地点等细节'
        : '✗ 缺少具体细节 (建议添加时间、数量、地点等)'
    }
  }

  /**
   * 检查是否有真实案例
   */
  private checkRealCases(content: string): CheckResult {
    // 检测案例相关关键词
    const caseKeywords = [
      /案例[::]/, /例如[::]/, /比如[::]/, /实践中/,
      /\bcase\b/i, /\bexample\b/i, /\binstance\b/i,
      /我在.{0,50}(项目|工作|实践|测试)/, /我们.{0,50}(使用|采用|实现)/,
      /具体来说/, /举个例子/
    ]

    const caseCount = caseKeywords.filter(pattern => pattern.test(content)).length

    return {
      passed: caseCount >= 2,
      score: Math.min(caseCount / 3, 1), // 3 个或以上案例得满分
      message: caseCount >= 2
        ? `✓ 包含 ${caseCount} 个真实案例/示例`
        : `✗ 案例较少 (${caseCount} 个,建议 ≥2 个)`,
      data: { caseCount }
    }
  }

  /**
   * 检查是否避免模糊表述
   */
  private checkVagueTerms(content: string): CheckResult {
    const { passed, vagueTermsCount } = this.analyzer.avoidsVagueTerms(content)

    return {
      passed,
      score: passed ? 1 : Math.max(0, 1 - vagueTermsCount * 0.1),
      message: passed
        ? '✓ 避免使用模糊表述'
        : `✗ 包含 ${vagueTermsCount} 个模糊词 (如 "据说", "可能", "也许")`,
      data: { vagueTermsCount }
    }
  }
}
