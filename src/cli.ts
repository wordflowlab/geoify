#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings'
import chalk from 'chalk'
import { initCommand } from './commands/init.js'
import { reviewCommand } from './commands/review.js'
import { schemaCommand } from './commands/schema.js'

const program = new Command()

program
  .name('geoify')
  .description('GEO (Generative Engine Optimization) - 优化内容使其成为 AI 引擎的引用来源')
  .version('0.1.0') // GEO MVP - E-E-A-T scoring + Schema.org generation

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

// Review 命令
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
      await reviewCommand(article, {
        verbose: options.verbose,
        target: {
          experience: parseFloat(options.targetExperience),
          expertise: parseFloat(options.targetExpertise),
          authoritativeness: parseFloat(options.targetAuthoritativeness),
          trustworthiness: parseFloat(options.targetTrustworthiness)
        }
      })
    } catch (error) {
      console.error(chalk.red('审校失败:'), error)
      process.exit(1)
    }
  })

// Schema 命令
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
      await schemaCommand(article, {
        url: options.url,
        siteName: options.siteName,
        siteLogo: options.siteLogo,
        language: options.language,
        output: options.output,
        format: options.format as 'json' | 'html' | 'both'
      })
    } catch (error) {
      console.error(chalk.red('Schema 生成失败:'), error)
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
