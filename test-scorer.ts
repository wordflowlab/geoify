import { EEATScorer } from './src/scoring/eeat-scorer.js'
import { EEATReport } from './src/reports/eeat-report.js'
import fs from 'fs-extra'

async function testScorer() {
  console.log('🧪 测试 E-E-A-T 评分系统\n')

  // 读取测试文章
  const articlePath = 'test-article.md'
  const markdown = await fs.readFile(articlePath, 'utf-8')

  // 创建评分器
  const scorer = new EEATScorer()

  // 评分
  console.log('📊 正在评分...\n')
  const score = scorer.score(markdown, {
    target: {
      experience: 8,
      expertise: 8,
      authoritativeness: 8,
      trustworthiness: 9
    }
  })

  // 显示结果
  console.log('='.repeat(50))
  console.log('总分:', score.overall, '/10')
  console.log('='.repeat(50))
  console.log('\n各维度得分:')
  console.log('  Experience:        ', score.breakdown.experience, '/10')
  console.log('  Expertise:         ', score.breakdown.expertise, '/10')
  console.log('  Authoritativeness: ', score.breakdown.authoritativeness, '/10')
  console.log('  Trustworthiness:   ', score.breakdown.trustworthiness, '/10')

  // 优化建议
  console.log('\n优化建议 (' + score.recommendations.length + ' 项):')
  score.recommendations.forEach((rec, i) => {
    const priority = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    }[rec.priority]
    console.log(`  ${i + 1}. ${priority} [${rec.dimension}] ${rec.message}`)
  })

  // 生成报告
  console.log('\n📝 生成报告...')
  const reporter = new EEATReport()

  await reporter.saveJSON(score, 'test-score.json')
  console.log('✓ JSON 报告: test-score.json')

  await reporter.saveMarkdown(score, articlePath, 'test-report.md')
  console.log('✓ Markdown 报告: test-report.md')

  console.log('\n✅ 测试完成!')
}

testScorer().catch(console.error)
