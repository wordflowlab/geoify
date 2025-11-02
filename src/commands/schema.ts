import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { SchemaGenerator } from '../schema/schema-generator.js'
import type { SchemaOptions } from '../schema/types/base.js'

interface SchemaCommandOptions {
  url?: string
  siteName?: string
  siteLogo?: string
  language?: string
  output?: string
  format?: 'json' | 'html' | 'both'
}

/**
 * Schema 生成命令
 */
export async function schemaCommand(articlePath: string, options: SchemaCommandOptions = {}) {
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

    // 3. 生成 Schema
    spinner.start('生成 Schema.org 标记...')

    const generator = new SchemaGenerator()

    const schemaOptions: SchemaOptions = {
      url: options.url,
      siteName: options.siteName,
      siteLogo: options.siteLogo,
      language: options.language
    }

    const { type, schema } = generator.generate(markdown, schemaOptions)

    spinner.succeed(chalk.green('Schema 生成完成'))

    // 4. 验证 Schema
    spinner.start('验证 Schema...')
    const validation = generator.validate(schema)

    if (!validation.valid) {
      spinner.warn(chalk.yellow('Schema 验证发现问题'))
      console.log()
      console.log(chalk.yellow('⚠️  验证警告:'))
      validation.errors.forEach(error => {
        console.log(chalk.yellow(`  - ${error}`))
      })
      console.log()
    } else {
      spinner.succeed(chalk.green('✓ Schema 验证通过'))
    }

    // 5. 显示结果
    console.log()
    console.log(chalk.cyan('='.repeat(50)))
    console.log(chalk.cyan.bold('  Schema.org 生成结果'))
    console.log(chalk.cyan('='.repeat(50)))
    console.log()

    console.log(chalk.bold('内容类型:'), chalk.green(type.toUpperCase()))
    console.log(chalk.bold('Schema 类型:'), chalk.green(schema['@type']))
    console.log()

    // 6. 保存文件
    const articleDir = path.dirname(articlePath)
    const articleName = path.basename(articlePath, '.md')

    const format = options.format || 'both'
    const outputDir = options.output || articleDir

    await fs.ensureDir(outputDir)

    if (format === 'json' || format === 'both') {
      const jsonPath = path.join(outputDir, `${articleName}-schema.json`)
      await fs.writeJSON(jsonPath, schema, { spaces: 2 })
      console.log(chalk.green('✓'), 'JSON 文件:', chalk.gray(jsonPath))
    }

    if (format === 'html' || format === 'both') {
      const htmlTag = generator.generateHTMLTag(markdown, schemaOptions)
      const htmlPath = path.join(outputDir, `${articleName}-schema.html`)
      await fs.writeFile(htmlPath, htmlTag)
      console.log(chalk.green('✓'), 'HTML 标签:', chalk.gray(htmlPath))
    }

    console.log()

    // 7. 显示关键信息
    console.log(chalk.cyan('📋 Schema 信息:'))
    if (schema.headline) {
      console.log(chalk.gray(`  标题: ${schema.headline}`))
    }
    if (schema.author) {
      const authorName = typeof schema.author === 'object' ? schema.author.name : schema.author
      console.log(chalk.gray(`  作者: ${authorName}`))
    }
    if (schema.datePublished) {
      const date = new Date(schema.datePublished).toLocaleDateString('zh-CN')
      console.log(chalk.gray(`  发布: ${date}`))
    }
    if (schema.keywords) {
      console.log(chalk.gray(`  关键词: ${schema.keywords.join(', ')}`))
    }
    console.log()

    // 8. 使用说明
    console.log(chalk.cyan('💡 如何使用:'))
    console.log(chalk.gray('  1. 将生成的 JSON-LD 代码添加到 HTML <head> 中'))
    console.log(chalk.gray('  2. 使用 Google Rich Results Test 验证:'))
    console.log(chalk.gray('     https://search.google.com/test/rich-results'))
    console.log(chalk.gray('  3. 部署后等待 Google 重新抓取'))
    console.log()

    // 9. 下一步
    console.log(chalk.cyan('📋 下一步:'))
    console.log(chalk.gray('  1. 检查生成的 Schema 是否准确'))
    console.log(chalk.gray('  2. 使用 /geo-publish 准备发布'))
    console.log(chalk.gray('  3. 使用 /geo-track 开始跟踪引用'))
    console.log()

  } catch (error) {
    spinner.fail(chalk.red('Schema 生成失败'))
    throw error
  }
}
