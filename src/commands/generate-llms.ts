import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora, { type Ora } from 'ora'
import { LLMsTxtGenerator } from '../llms/llms-generator.js'
import type { LlmsTxtConfig } from '../llms/types.js'

interface GenerateLlmsOptions {
  articles?: string
  output?: string
  siteName?: string
  siteUrl?: string
  siteDescription?: string
  config?: string
  minScore?: number
  maxArticles?: number
}

/**
 * 生成 llms.txt 和 llms-full.txt 命令
 */
export async function generateLlmsCommand(options: GenerateLlmsOptions = {}) {
  const spinner = ora('正在初始化...').start()

  try {
    // 1. 读取配置文件或使用命令行参数
    const config = await loadConfig(options, spinner)

    // 2. 验证配置
    if (!config.siteName || !config.siteUrl || !config.siteDescription) {
      spinner.fail(chalk.red('缺少必需配置'))
      console.log()
      console.log(chalk.yellow('请提供以下配置:'))
      console.log(chalk.gray('  --site-name        网站名称'))
      console.log(chalk.gray('  --site-url         网站 URL'))
      console.log(chalk.gray('  --site-description 网站描述'))
      console.log()
      console.log(chalk.yellow('或使用配置文件:'))
      console.log(chalk.gray('  --config .geoify/config.yaml'))
      console.log()
      process.exit(1)
    }

    // 3. 确定文章目录和输出目录
    const articlesDir = path.resolve(options.articles || 'articles')
    const outputDir = path.resolve(options.output || 'public')

    spinner.text = '检查目录...'

    // 检查文章目录是否存在
    if (!await fs.pathExists(articlesDir)) {
      spinner.fail(chalk.red(`文章目录不存在: ${articlesDir}`))
      process.exit(1)
    }

    // 确保输出目录存在
    await fs.ensureDir(outputDir)

    spinner.succeed(chalk.green('目录检查完成'))

    // 4. 生成 llms.txt
    spinner.start('正在扫描文章...')

    const generator = new LLMsTxtGenerator(config)
    const result = await generator.generate(articlesDir)

    spinner.succeed(chalk.green(`扫描完成: 共 ${result.metadata.totalArticles} 篇文章`))

    // 5. 保存文件
    spinner.start('正在生成文件...')

    const llmsTxtPath = path.join(outputDir, 'llms.txt')
    const llmsFullTxtPath = path.join(outputDir, 'llms-full.txt')

    await fs.writeFile(llmsTxtPath, result.llmsTxt, 'utf-8')
    await fs.writeFile(llmsFullTxtPath, result.llmsFullTxt, 'utf-8')

    spinner.succeed(chalk.green('文件生成完成'))

    // 6. 显示统计信息
    console.log()
    console.log(chalk.cyan('=' .repeat(50)))
    console.log(chalk.cyan.bold('  llms.txt 生成结果'))
    console.log(chalk.cyan('='.repeat(50)))
    console.log()

    console.log(chalk.bold('文章统计:'))
    console.log(`  总文章数:     ${chalk.green(result.metadata.totalArticles)}`)
    console.log(`  已分类:       ${chalk.green(result.metadata.categorizedArticles)}`)
    console.log(`  未分类:       ${chalk.yellow(result.metadata.uncategorizedArticles)}`)
    console.log(`  平均 E-E-A-T: ${colorScore(result.metadata.averageEEATScore)}/10`)
    console.log()

    console.log(chalk.bold('生成文件:'))
    console.log(`  ${chalk.cyan('llms.txt')}:      ${chalk.gray(llmsTxtPath)}`)
    console.log(`  ${chalk.cyan('llms-full.txt')}: ${chalk.gray(llmsFullTxtPath)}`)
    console.log()

    // 7. 文件大小统计
    const llmsTxtSize = (await fs.stat(llmsTxtPath)).size
    const llmsFullTxtSize = (await fs.stat(llmsFullTxtPath)).size

    console.log(chalk.bold('文件大小:'))
    console.log(`  ${chalk.cyan('llms.txt')}:      ${formatBytes(llmsTxtSize)}`)
    console.log(`  ${chalk.cyan('llms-full.txt')}: ${formatBytes(llmsFullTxtSize)}`)
    console.log()

    // 8. 下一步建议
    console.log(chalk.cyan('📋 下一步:'))
    console.log(chalk.gray('  1. 将文件部署到网站根目录'))
    console.log(chalk.gray('  2. 确保文件可通过以下 URL 访问:'))
    console.log(chalk.gray(`     - ${config.siteUrl}/llms.txt`))
    console.log(chalk.gray(`     - ${config.siteUrl}/llms-full.txt`))
    console.log(chalk.gray('  3. 验证文件: geoify validate-llms --url <your-site-url>'))
    console.log()

    // 9. 性能提示
    if (result.metadata.totalArticles > 50) {
      console.log(chalk.yellow('💡 性能提示:'))
      console.log(chalk.gray('  - 考虑设置 --min-score 过滤低质量文章'))
      console.log(chalk.gray('  - 考虑设置 --max-articles 限制文章数量'))
      console.log(chalk.gray('  - 大型项目建议使用配置文件管理'))
      console.log()
    }

  } catch (error) {
    spinner.fail(chalk.red('生成失败'))
    console.error()
    console.error(chalk.red('错误详情:'), error)
    process.exit(1)
  }
}

/**
 * 加载配置
 */
async function loadConfig(
  options: GenerateLlmsOptions,
  spinner: Ora
): Promise<LlmsTxtConfig> {
  let config: Partial<LlmsTxtConfig> = {}

  // 1. 从配置文件加载
  if (options.config) {
    const configPath = path.resolve(options.config)

    if (await fs.pathExists(configPath)) {
      spinner.text = '加载配置文件...'

      try {
        // 支持 JSON 配置
        if (configPath.endsWith('.json')) {
          config = await fs.readJSON(configPath)
        }
        // 支持 YAML 配置 (未来实现)
        else if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
          spinner.warn(chalk.yellow('YAML 配置支持即将推出,请使用 JSON 格式'))
        }
      } catch (error) {
        spinner.warn(chalk.yellow(`配置文件加载失败: ${error}`))
      }
    }
  }

  // 2. 从命令行参数覆盖
  const finalConfig: LlmsTxtConfig = {
    siteName: options.siteName || config.siteName || '',
    siteUrl: options.siteUrl || config.siteUrl || '',
    siteDescription: options.siteDescription || config.siteDescription || '',
    categories: config.categories,
    minEEATScore: options.minScore || config.minEEATScore,
    maxArticles: options.maxArticles || config.maxArticles
  }

  return finalConfig
}

/**
 * 格式化字节大小
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * 根据分数着色
 */
function colorScore(score: number): string {
  if (score >= 8) return chalk.green(score.toString())
  if (score >= 7) return chalk.yellow(score.toString())
  return chalk.red(score.toString())
}
