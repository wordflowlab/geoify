#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings'
import chalk from 'chalk'
import { initCommand } from './commands/init.js'

const program = new Command()

program
  .name('geoify')
  .description('GEO (Generative Engine Optimization) - 优化内容使其成为 AI 引擎的引用来源')
  .version('0.1.0')

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
