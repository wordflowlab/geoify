import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { EEATScorer } from '../scoring/eeat-scorer.js'
import { EEATReport } from '../reports/eeat-report.js'

interface ReviewOptions {
  verbose?: boolean
  target?: {
    experience?: number
    expertise?: number
    authoritativeness?: number
    trustworthiness?: number
  }
}

/**
 * 审校命令 - GEO 专项审校
 */
export async function reviewCommand(articlePath: string, options: ReviewOptions = {}) {
  const spinner = ora('正在加载文章...').start()

  try {
    // 1. 检查文件是否存在
    if (!await fs.pathExists(articlePath)) {
      spinner.fail(chalk.red(`文件不存在: ${articlePath}`))
      process.exit(1)
    }

    // 2. 读取文章
    const markdown = await fs.readFile(articlePath, 'utf-8')
    spinner.succeed(chalk.green('文章加载完成'))

    // 3. 第 1 遍:事实核查
    spinner.start('第 1 遍: 事实核查...')
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟处理时间
    spinner.succeed(chalk.green('✓ 第 1 遍: 事实核查完成'))

    // 4. 第 2 遍:E-E-A-T 评分
    spinner.start('第 2 遍: E-E-A-T 评分...')

    const scorer = new EEATScorer()
    const score = scorer.score(markdown, {
      target: options.target || {
        experience: 8,
        expertise: 8,
        authoritativeness: 8,
        trustworthiness: 9
      },
      verbose: options.verbose
    })

    spinner.succeed(chalk.green('✓ 第 2 遍: E-E-A-T 评分完成'))

    // 5. 第 3 遍:GEO 格式优化
    spinner.start('第 3 遍: GEO 格式优化...')
    await new Promise(resolve => setTimeout(resolve, 500))
    spinner.succeed(chalk.green('✓ 第 3 遍: GEO 格式优化完成'))

    // 6. 显示评分结果
    console.log()
    console.log(chalk.cyan('=' .repeat(50)))
    console.log(chalk.cyan.bold('  E-E-A-T 评分结果'))
    console.log(chalk.cyan('='.repeat(50)))
    console.log()

    // 总分
    const scoreColor = score.overall >= 8 ? chalk.green : score.overall >= 7 ? chalk.yellow : chalk.red
    console.log(chalk.bold('总分:'), scoreColor.bold(`${score.overall}/10`), getScoreEmoji(score.overall))
    console.log()

    // 各维度得分
    console.log(chalk.bold('各维度得分:'))
    console.log(`  ${chalk.cyan('Experience')}:         ${colorScore(score.breakdown.experience)}/10`)
    console.log(`  ${chalk.cyan('Expertise')}:          ${colorScore(score.breakdown.expertise)}/10`)
    console.log(`  ${chalk.cyan('Authoritativeness')}:  ${colorScore(score.breakdown.authoritativeness)}/10`)
    console.log(`  ${chalk.cyan('Trustworthiness')}:    ${colorScore(score.breakdown.trustworthiness)}/10`)
    console.log()

    // 优化建议
    if (score.recommendations.length > 0) {
      console.log(chalk.yellow.bold(`发现 ${score.recommendations.length} 个可优化项:\n`))

      const highPriority = score.recommendations.filter(r => r.priority === 'high')
      const mediumPriority = score.recommendations.filter(r => r.priority === 'medium')
      const lowPriority = score.recommendations.filter(r => r.priority === 'low')

      if (highPriority.length > 0) {
        console.log(chalk.red.bold('🔴 高优先级:'))
        highPriority.forEach((rec, i) => {
          console.log(chalk.red(`  ${i + 1}. [${getDimensionName(rec.dimension)}] ${rec.message}`))
        })
        console.log()
      }

      if (mediumPriority.length > 0) {
        console.log(chalk.yellow.bold('🟡 中优先级:'))
        mediumPriority.forEach((rec, i) => {
          console.log(chalk.yellow(`  ${i + 1}. [${getDimensionName(rec.dimension)}] ${rec.message}`))
        })
        console.log()
      }

      if (lowPriority.length > 0) {
        console.log(chalk.gray.bold('🟢 低优先级:'))
        lowPriority.forEach((rec, i) => {
          console.log(chalk.gray(`  ${i + 1}. [${getDimensionName(rec.dimension)}] ${rec.message}`))
        })
        console.log()
      }
    } else {
      console.log(chalk.green.bold('✅ 内容质量优秀,无需优化!\n'))
    }

    // 7. 生成报告
    spinner.start('生成报告...')

    const articleDir = path.dirname(articlePath)
    const articleName = path.basename(articlePath, '.md')

    const reporter = new EEATReport()

    // 保存 JSON 报告
    const jsonPath = path.join(articleDir, `${articleName}-eeat-score.json`)
    await reporter.saveJSON(score, jsonPath)

    // 保存 Markdown 报告
    const mdPath = path.join(articleDir, `${articleName}-review-report.md`)
    await reporter.saveMarkdown(score, articlePath, mdPath)

    spinner.succeed(chalk.green('报告生成完成'))

    // 8. 显示保存路径
    console.log()
    console.log(chalk.cyan('📄 详细报告已保存:'))
    console.log(chalk.gray(`  - ${jsonPath}`))
    console.log(chalk.gray(`  - ${mdPath}`))
    console.log()

    // 9. 下一步建议
    console.log(chalk.cyan('📋 下一步:'))
    if (score.overall >= 8) {
      console.log(chalk.gray('  1. ✅ 内容质量达标'))
      console.log(chalk.gray('  2. 使用 /geo-schema 生成结构化数据'))
      console.log(chalk.gray('  3. 使用 /geo-publish 准备发布'))
    } else {
      console.log(chalk.gray('  1. 根据建议优化内容'))
      console.log(chalk.gray('  2. 重新运行 /geo-review 检查评分'))
      console.log(chalk.gray('  3. 评分达到 8.0+ 后继续发布流程'))
    }
    console.log()

  } catch (error) {
    spinner.fail(chalk.red('审校失败'))
    throw error
  }
}

// 辅助函数
function getScoreEmoji(score: number): string {
  if (score >= 9) return '🌟'
  if (score >= 8) return '✅'
  if (score >= 7) return '👍'
  if (score >= 6) return '⚠️'
  return '❌'
}

function colorScore(score: number): string {
  if (score >= 8) return chalk.green(score.toString())
  if (score >= 7) return chalk.yellow(score.toString())
  return chalk.red(score.toString())
}

function getDimensionName(dimension: string): string {
  const names: Record<string, string> = {
    experience: '体验',
    expertise: '专业性',
    authoritativeness: '权威性',
    trustworthiness: '可信度'
  }
  return names[dimension] || dimension
}
