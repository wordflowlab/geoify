#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings'
import chalk from 'chalk'
import fs from 'fs-extra'
import { initCommand } from './commands/init.js'
import { executeBashScript, parseCommandTemplate } from './utils/bash-runner.js'

const program = new Command()

program
  .name('geoify')
  .description('GEO (Generative Engine Optimization) - 优化内容使其成为 AI 引擎的引用来源')
  .version('0.2.0') // GEO v0.2.0 - E-E-A-T + Schema.org + llms.txt

// Init 命令
program
  .command('init')
  .description('初始化 Geoify 项目')
  .argument('[name]', '项目名称', '.')
  .option('--here', '在当前目录初始化')
  .option('--ai <type>', '选择 AI 平台 (claude, gemini, cursor, windsurf, 等)', 'claude')
  .option('--all', '生成所有 AI 平台配置')
  .action(async (name, options) => {
    try {
      await initCommand(name, options)
    } catch (error) {
      console.error(chalk.red('初始化失败:'), error)
      process.exit(1)
    }
  })

// Track 命令 (未来实现)
program
  .command('track')
  .description('跟踪 AI 引用情况')
  .option('--platform <type>', 'AI 平台 (chatgpt, perplexity, claude, gemini)', 'all')
  .action(() => {
    console.log(chalk.yellow('⚠️  /geo-track 命令将在 v0.2.0 实现'))
    console.log(chalk.gray('敬请期待!'))
  })

// Review 命令 - 重构为调用 bash 脚本
program
  .command('review')
  .description('GEO 专项审校,评估 E-E-A-T 得分')
  .argument('<article>', '文章路径 (Markdown 文件)')
  .option('-v, --verbose', '详细输出')
  .option('--target-experience <score>', '目标体验分数', '8')
  .option('--target-expertise <score>', '目标专业性分数', '8')
  .option('--target-authoritativeness <score>', '目标权威性分数', '8')
  .option('--target-trustworthiness <score>', '目标可信度分数', '9')
  .action(async (article, options) => {
    try {
      // 1. 调用 bash 脚本分析文章
      const result = await executeBashScript('review', [article])

      if (result.status === 'success') {
        console.log(chalk.green('✓ 文章分析完成'))
        console.log('')

        // 2. 读取并展示命令模板
        const templatePath = 'templates/commands/geo-review.md'
        if (await fs.pathExists(templatePath)) {
          const { content } = await parseCommandTemplate(templatePath)
          console.log(chalk.dim('─'.repeat(60)))
          console.log(content)
          console.log(chalk.dim('─'.repeat(60)))
          console.log('')
        }

        // 3. 展示脚本输出的数据 (供 AI 使用)
        console.log(chalk.dim('## 脚本输出信息\n'))
        console.log('```json')
        console.log(JSON.stringify(result, null, 2))
        console.log('```')
        console.log('')

        // 4. 显示目标分数
        console.log(chalk.dim('## 目标分数\n'))
        console.log('```json')
        console.log(JSON.stringify({
          experience: parseFloat(options.targetExperience),
          expertise: parseFloat(options.targetExpertise),
          authoritativeness: parseFloat(options.targetAuthoritativeness),
          trustworthiness: parseFloat(options.targetTrustworthiness)
        }, null, 2))
        console.log('```')
      } else {
        console.error(chalk.red('审校失败:'), result.message)
        process.exit(1)
      }
    } catch (error) {
      console.error(chalk.red('审校失败:'), error)
      process.exit(1)
    }
  })

// Schema 命令 - 重构为调用 bash 脚本
program
  .command('schema')
  .description('生成 Schema.org 结构化数据')
  .argument('<article>', '文章路径 (Markdown 文件)')
  .option('--url <url>', '文章 URL')
  .option('--site-name <name>', '网站名称')
  .option('--site-logo <url>', '网站 Logo URL')
  .option('--language <lang>', '语言代码 (如 zh-CN, en-US)', 'zh-CN')
  .option('--output <dir>', '输出目录 (默认为文章所在目录)')
  .option('--format <type>', '输出格式: json, html, both', 'both')
  .action(async (article, options) => {
    try {
      // 1. 调用 bash 脚本分析文章
      const result = await executeBashScript('schema', [article])

      if (result.status === 'success') {
        console.log(chalk.green('✓ 文章分析完成'))
        console.log(chalk.cyan(`  检测到类型: ${result.content_type}`))
        console.log('')

        // 2. 读取并展示命令模板
        const templatePath = 'templates/commands/geo-schema.md'
        if (await fs.pathExists(templatePath)) {
          const { content } = await parseCommandTemplate(templatePath)
          console.log(chalk.dim('─'.repeat(60)))
          console.log(content)
          console.log(chalk.dim('─'.repeat(60)))
          console.log('')
        }

        // 3. 展示脚本输出的数据 (供 AI 使用)
        console.log(chalk.dim('## 脚本输出信息\n'))
        console.log('```json')
        console.log(JSON.stringify(result, null, 2))
        console.log('```')
        console.log('')

        // 4. 显示配置选项
        console.log(chalk.dim('## 配置选项\n'))
        console.log('```json')
        console.log(JSON.stringify({
          url: options.url,
          siteName: options.siteName,
          siteLogo: options.siteLogo,
          language: options.language,
          output: options.output,
          format: options.format
        }, null, 2))
        console.log('```')
      } else {
        console.error(chalk.red('Schema 生成失败:'), result.message)
        process.exit(1)
      }
    } catch (error) {
      console.error(chalk.red('Schema 生成失败:'), error)
      process.exit(1)
    }
  })

// Generate LLMs 命令 - 重构为调用 bash 脚本
program
  .command('generate-llms')
  .description('生成 llms.txt 和 llms-full.txt 文件')
  .option('--articles <dir>', '文章目录', 'articles')
  .option('--output <dir>', '输出目录', 'public')
  .option('--site-name <name>', '网站名称')
  .option('--site-url <url>', '网站 URL')
  .option('--site-description <desc>', '网站描述')
  .option('--config <path>', '配置文件路径 (.geoify/config.json)')
  .option('--min-score <score>', '最低 E-E-A-T 分数', '7.0')
  .option('--max-articles <num>', '最大文章数', '100')
  .action(async (options) => {
    try {
      // 1. 调用 bash 脚本扫描文章
      const args = [
        '--articles', options.articles,
        '--output', options.output,
        '--min-score', options.minScore,
        '--max-articles', options.maxArticles
      ]

      const result = await executeBashScript('generate-llms', args)

      if (result.status === 'success') {
        console.log(chalk.green('✓ 文章扫描完成'))
        console.log(chalk.cyan(`  找到 ${result.stats.total_articles} 篇文章`))
        console.log('')

        // 2. 读取并展示命令模板(如果有)
        const templatePath = 'templates/commands/geo-generate-llms.md'
        if (await fs.pathExists(templatePath)) {
          const { content } = await parseCommandTemplate(templatePath)
          console.log(chalk.dim('─'.repeat(60)))
          console.log(content)
          console.log(chalk.dim('─'.repeat(60)))
          console.log('')
        }

        // 3. 展示脚本输出的数据 (供 AI 使用)
        console.log(chalk.dim('## 脚本输出信息\n'))
        console.log('```json')
        // 由于文章列表可能很大,只显示统计和配置信息
        const summaryResult = {
          status: result.status,
          config: result.config,
          stats: result.stats,
          articles_preview: result.articles.slice(0, 3), // 只显示前3篇
          total_articles: result.articles.length
        }
        console.log(JSON.stringify(summaryResult, null, 2))
        console.log('```')
        console.log('')

        // 4. 显示配置选项
        console.log(chalk.dim('## 配置选项\n'))
        console.log('```json')
        console.log(JSON.stringify({
          siteName: options.siteName,
          siteUrl: options.siteUrl,
          siteDescription: options.siteDescription
        }, null, 2))
        console.log('```')
      } else {
        console.error(chalk.red('llms.txt 生成失败:'), result.message)
        process.exit(1)
      }
    } catch (error) {
      console.error(chalk.red('llms.txt 生成失败:'), error)
      process.exit(1)
    }
  })

// Analyze 命令 (未来实现)
program
  .command('analyze')
  .description('分析目标话题的 GEO 现状')
  .argument('[topic]', '目标话题')
  .action(() => {
    console.log(chalk.yellow('⚠️  /geo-analyze 命令将在 v0.2.0 实现'))
    console.log(chalk.gray('敬请期待!'))
  })

// 解析命令
program.parse()
