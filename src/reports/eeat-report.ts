import type { EEATScore } from '../scoring/types.js'
import fs from 'fs-extra'
import path from 'path'

/**
 * E-E-A-T 报告生成器
 */
export class EEATReport {
  /**
   * 生成 Markdown 格式报告
   */
  generateMarkdown(score: EEATScore, articlePath: string): string {
    const lines: string[] = []

    // 标题
    lines.push('# E-E-A-T 评分报告\n')
    lines.push(`> 文章: \`${path.basename(articlePath)}\``)
    lines.push(`> 评分时间: ${new Date(score.timestamp).toLocaleString('zh-CN')}\n`)

    // 总分
    lines.push('## 总体评分\n')
    lines.push(this.getScoreBar(score.overall))
    lines.push(`**${score.overall}/10** ${this.getScoreLevel(score.overall)}\n`)

    // 各维度得分
    lines.push('## 维度得分\n')
    lines.push('| 维度 | 得分 | 评级 |')
    lines.push('|------|------|------|')
    lines.push(`| Experience (体验) | ${score.breakdown.experience}/10 | ${this.getScoreLevel(score.breakdown.experience)} |`)
    lines.push(`| Expertise (专业性) | ${score.breakdown.expertise}/10 | ${this.getScoreLevel(score.breakdown.expertise)} |`)
    lines.push(`| Authoritativeness (权威性) | ${score.breakdown.authoritativeness}/10 | ${this.getScoreLevel(score.breakdown.authoritativeness)} |`)
    lines.push(`| Trustworthiness (可信度) | ${score.breakdown.trustworthiness}/10 | ${this.getScoreLevel(score.breakdown.trustworthiness)} |\n`)

    // 详细检查结果
    lines.push('## 详细评估\n')

    // Experience
    lines.push('### 1. Experience (体验) - 内容基于真实经历\n')
    lines.push(`**得分: ${score.details.experience.score}/10**\n`)
    Object.entries(score.details.experience.checks).forEach(([_key, check]) => {
      lines.push(`- ${check.message}`)
    })
    lines.push('')

    // Expertise
    lines.push('### 2. Expertise (专业性) - 展示专业知识\n')
    lines.push(`**得分: ${score.details.expertise.score}/10**\n`)
    Object.entries(score.details.expertise.checks).forEach(([_key, check]) => {
      lines.push(`- ${check.message}`)
    })
    lines.push('')

    // Authoritativeness
    lines.push('### 3. Authoritativeness (权威性) - 引用权威来源\n')
    lines.push(`**得分: ${score.details.authoritativeness.score}/10**\n`)
    Object.entries(score.details.authoritativeness.checks).forEach(([_key, check]) => {
      lines.push(`- ${check.message}`)
    })
    lines.push('')

    // Trustworthiness
    lines.push('### 4. Trustworthiness (可信度) - 数据可验证\n')
    lines.push(`**得分: ${score.details.trustworthiness.score}/10**\n`)
    Object.entries(score.details.trustworthiness.checks).forEach(([_key, check]) => {
      lines.push(`- ${check.message}`)
    })
    lines.push('')

    // 优化建议
    if (score.recommendations.length > 0) {
      lines.push('## 优化建议\n')
      lines.push(`发现 ${score.recommendations.length} 个可优化项:\n`)

      const highPriority = score.recommendations.filter(r => r.priority === 'high')
      const mediumPriority = score.recommendations.filter(r => r.priority === 'medium')
      const lowPriority = score.recommendations.filter(r => r.priority === 'low')

      if (highPriority.length > 0) {
        lines.push('### 🔴 高优先级\n')
        highPriority.forEach((rec, i) => {
          lines.push(`${i + 1}. **[${this.getDimensionName(rec.dimension)}]** ${rec.message}`)
        })
        lines.push('')
      }

      if (mediumPriority.length > 0) {
        lines.push('### 🟡 中优先级\n')
        mediumPriority.forEach((rec, i) => {
          lines.push(`${i + 1}. **[${this.getDimensionName(rec.dimension)}]** ${rec.message}`)
        })
        lines.push('')
      }

      if (lowPriority.length > 0) {
        lines.push('### 🟢 低优先级\n')
        lowPriority.forEach((rec, i) => {
          lines.push(`${i + 1}. **[${this.getDimensionName(rec.dimension)}]** ${rec.message}`)
        })
        lines.push('')
      }
    } else {
      lines.push('## 优化建议\n')
      lines.push('✅ 内容质量优秀,无需优化!\n')
    }

    // 下一步
    lines.push('## 下一步\n')
    if (score.overall >= 8) {
      lines.push('1. 使用 `/geo-schema` 生成结构化数据')
      lines.push('2. 使用 `/geo-publish` 准备发布')
      lines.push('3. 使用 `/geo-track` 开始跟踪引用')
    } else {
      lines.push('1. 根据上述建议优化内容')
      lines.push('2. 重新运行 `/geo-review` 检查评分')
      lines.push('3. 评分达到 8.0+ 后继续发布流程')
    }

    return lines.join('\n')
  }

  /**
   * 保存 JSON 格式报告
   */
  async saveJSON(score: EEATScore, outputPath: string): Promise<void> {
    await fs.ensureDir(path.dirname(outputPath))
    await fs.writeJSON(outputPath, score, { spaces: 2 })
  }

  /**
   * 保存 Markdown 格式报告
   */
  async saveMarkdown(score: EEATScore, articlePath: string, outputPath: string): Promise<void> {
    const markdown = this.generateMarkdown(score, articlePath)
    await fs.ensureDir(path.dirname(outputPath))
    await fs.writeFile(outputPath, markdown)
  }

  /**
   * 生成评分条
   */
  private getScoreBar(score: number): string {
    const filled = Math.round(score)
    const empty = 10 - filled
    return '█'.repeat(filled) + '░'.repeat(empty)
  }

  /**
   * 获取评分等级
   */
  private getScoreLevel(score: number): string {
    if (score >= 9) return '🌟 优秀'
    if (score >= 8) return '✅ 良好'
    if (score >= 7) return '👍 合格'
    if (score >= 6) return '⚠️  待改进'
    return '❌ 需重写'
  }

  /**
   * 获取维度中文名
   */
  private getDimensionName(dimension: string): string {
    const names: Record<string, string> = {
      experience: '体验',
      expertise: '专业性',
      authoritativeness: '权威性',
      trustworthiness: '可信度'
    }
    return names[dimension] || dimension
  }
}
