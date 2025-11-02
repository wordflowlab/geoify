import type { ExpertiseDetails, CheckResult, ContentAnalysis } from '../types.js'

/**
 * Expertise (专业性) 评分规则
 * 评估内容是否展示专业知识
 */
export class ExpertiseRules {
  /**
   * 评估 Expertise 维度
   */
  evaluate(content: string, analysis: ContentAnalysis): ExpertiseDetails {
    const checks = {
      hasTechnicalDetails: this.checkTechnicalDetails(content, analysis),
      hasDeepAnalysis: this.checkDeepAnalysis(content, analysis),
      avoidsCommonKnowledge: this.checkCommonKnowledge(content),
      hasUniqueInsights: this.checkUniqueInsights(content)
    }

    const score = Object.values(checks).reduce((sum, check) => sum + check.score * 2.5, 0)

    return {
      score: Math.round(score * 10) / 10,
      checks
    }
  }

  /**
   * 检查是否有技术细节
   */
  private checkTechnicalDetails(content: string, analysis: ContentAnalysis): CheckResult {
    // 代码块是技术内容的标志
    const hasCode = analysis.codeBlockCount > 0

    // 检测专业术语 (英文专业词汇、技术名词)
    const technicalTerms = content.match(/[A-Z]{2,}|[A-Z][a-z]+([A-Z][a-z]+)+/g) || []
    const uniqueTerms = new Set(technicalTerms).size

    // 检测括号中的解释 (专业术语通常需要解释)
    const explanations = (content.match(/\([^)]{10,}\)/g) || []).length

    const score = (
      (hasCode ? 0.4 : 0) +
      (uniqueTerms >= 5 ? 0.4 : uniqueTerms / 12.5) +
      (explanations >= 3 ? 0.2 : explanations / 15)
    )

    return {
      passed: score >= 0.6,
      score,
      message: score >= 0.6
        ? `✓ 包含技术细节 (代码: ${analysis.codeBlockCount}, 术语: ${uniqueTerms})`
        : `✗ 技术细节不足 (建议添加代码示例和专业术语解释)`,
      data: {
        codeBlockCount: analysis.codeBlockCount,
        uniqueTerms,
        explanations
      }
    }
  }

  /**
   * 检查是否有深度分析
   */
  private checkDeepAnalysis(content: string, analysis: ContentAnalysis): CheckResult {
    // 深度分析特征:
    // 1. 长内容 (≥1000 字)
    // 2. 多层级结构 (多个标题)
    // 3. 有列表 (说明详细分类)
    // 4. 分析性词汇

    const analysisKeywords = [
      /原因是/, /因为/, /导致/, /影响/, /结果/,
      /优势/, /劣势/, /优点/, /缺点/, /对比/,
      /\bbecause\b/i, /\bdue to\b/i, /\bresult\b/i,
      /\badvantage\b/i, /\bdisadvantage\b/i, /\bcomparison\b/i,
      /为什么/, /怎么/, /如何/
    ]

    const analysisCount = analysisKeywords.filter(pattern => pattern.test(content)).length

    const score = Math.min(
      (analysis.wordCount >= 1000 ? 0.3 : analysis.wordCount / 3333) +
      (analysis.headingCount >= 5 ? 0.3 : analysis.headingCount / 16.7) +
      (analysis.listCount >= 3 ? 0.2 : analysis.listCount / 15) +
      (analysisCount >= 3 ? 0.2 : analysisCount / 15),
      1
    )

    return {
      passed: score >= 0.7,
      score,
      message: score >= 0.7
        ? `✓ 包含深度分析 (${analysis.wordCount} 字, ${analysis.headingCount} 个标题)`
        : `✗ 分析深度不足 (建议增加内容深度和结构层次)`,
      data: {
        wordCount: analysis.wordCount,
        headingCount: analysis.headingCount,
        listCount: analysis.listCount,
        analysisCount
      }
    }
  }

  /**
   * 检查是否避免常识性内容
   */
  private checkCommonKnowledge(content: string): CheckResult {
    // 检测常识性表述
    const commonPhrases = [
      /众所周知/, /大家都知道/, /显而易见/, /不言而喻/,
      /\bas we (all )?know\b/i, /\bof course\b/i, /\bobviously\b/i,
      /基本上/, /简单来说/, /简而言之/
    ]

    const commonCount = commonPhrases.filter(pattern => pattern.test(content)).length

    // 每 1000 字允许 2 个常识性表述
    const wordCount = content.length
    const threshold = Math.ceil(wordCount / 1000) * 2

    return {
      passed: commonCount <= threshold,
      score: Math.max(0, 1 - commonCount * 0.15),
      message: commonCount <= threshold
        ? '✓ 避免常识性内容'
        : `✗ 常识性表述较多 (${commonCount} 处,建议减少)`,
      data: { commonCount }
    }
  }

  /**
   * 检查是否有独特见解
   */
  private checkUniqueInsights(content: string): CheckResult {
    // 独特见解的标志:
    // 1. 个人观点表达
    // 2. 对比分析
    // 3. 预测或建议

    const insightKeywords = [
      /我认为/, /我发现/, /我的看法/, /我的经验/,
      /值得注意的是/, /有意思的是/, /关键在于/,
      /\bI (think|believe|found)\b/i, /\bin my (view|opinion|experience)\b/i,
      /\bkey (point|insight)\b/i, /\binteresting(ly)?\b/i,
      /建议/, /推荐/, /最佳实践/, /\brecommend\b/i, /\bsuggest\b/i
    ]

    const insightCount = insightKeywords.filter(pattern => pattern.test(content)).length

    return {
      passed: insightCount >= 3,
      score: Math.min(insightCount / 4, 1),
      message: insightCount >= 3
        ? `✓ 包含独特见解 (${insightCount} 处)`
        : `✗ 独特见解较少 (${insightCount} 处,建议 ≥3 处)`,
      data: { insightCount }
    }
  }
}
