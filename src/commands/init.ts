import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface InitOptions {
  here?: boolean
  ai?: string
  all?: boolean
}

export async function initCommand(name: string, options: InitOptions) {
  const spinner = ora('初始化 Geoify 项目...').start()

  try {
    // 1. 确定项目目录
    const projectDir = options.here ? process.cwd() : path.join(process.cwd(), name)
    const projectName = path.basename(projectDir)

    // 2. 创建目录结构
    await fs.ensureDir(projectDir)

    // 检查目录是否为空
    const existingFiles = await fs.readdir(projectDir)
    if (existingFiles.length > 0 && !options.here) {
      spinner.fail(`目录 ${projectName} 已存在且不为空`)
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: '是否覆盖现有文件?',
          default: false
        }
      ])
      if (!overwrite) {
        process.exit(0)
      }
    }

    spinner.text = '创建项目结构...'

    // 3. 创建目录结构
    const dirs = [
      '.geoify',
      '.geoify/templates',
      '.geoify/scripts',
      '_analysis',
      '_tracking',
      '_knowledge_base',
      '_briefs',
      'materials/raw',
      'materials/indexed',
      'materials/archive',
      'profile/schema',
      'articles'
    ]

    for (const dir of dirs) {
      await fs.ensureDir(path.join(projectDir, dir))
    }

    // 4. 创建配置文件
    const config = {
      name: projectName,
      version: '0.1.0',
      created: new Date().toISOString(),
      eeat: {
        target: {
          experience: 8,
          expertise: 8,
          authoritativeness: 8,
          trustworthiness: 9
        }
      },
      aiPlatforms: {
        chatgpt: { enabled: true, priority: 'high' },
        perplexity: { enabled: true, priority: 'high' },
        claude: { enabled: true, priority: 'medium' },
        gemini: { enabled: true, priority: 'medium' }
      }
    }

    await fs.writeJSON(path.join(projectDir, '.geoify/config.json'), config, { spaces: 2 })

    // 5. 创建 README
    const readme = `# ${projectName}

> Geoify 项目 - GEO 优化内容

## 项目信息

- 创建时间: ${new Date().toLocaleDateString('zh-CN')}
- Geoify 版本: 0.1.0

## E-E-A-T 目标

- Experience (体验): 8/10
- Expertise (专业性): 8/10
- Authoritativeness (权威性): 8/10
- Trustworthiness (可信度): 9/10

## 使用工作流

在 AI 助手中使用斜杠命令:

\`\`\`
1. /geo-analyze  → 分析目标话题的 GEO 现状
2. /specify      → 定义内容目标
3. /research     → 研究竞争对手
4. /collect      → 收集真实素材
5. /geo-write    → 生成内容
6. /geo-review   → GEO 审校
7. /geo-schema   → 生成结构化数据
8. /geo-publish  → 发布
9. /geo-track    → 跟踪引用
\`\`\`

## 目录结构

- \`.geoify/\` - 配置文件
- \`_analysis/\` - GEO 分析报告
- \`_tracking/\` - AI 引用跟踪
- \`_knowledge_base/\` - 调研资料
- \`materials/\` - 素材库
- \`profile/\` - 内容配置
- \`articles/\` - 文章输出
`

    await fs.writeFile(path.join(projectDir, 'README.md'), readme)

    // 6. 生成 AI 平台命令 (简化版,后续完善)
    const aiPlatforms = options.all
      ? ['claude', 'gemini', 'cursor', 'windsurf', 'roocode', 'copilot']
      : [options.ai || 'claude']

    for (const platform of aiPlatforms) {
      await createPlatformCommands(projectDir, platform)
    }

    spinner.succeed(chalk.green('✅ Geoify 项目初始化完成!'))

    // 7. 显示下一步提示
    console.log()
    console.log(chalk.cyan('📂 项目目录:'), projectDir)
    console.log()
    console.log(chalk.yellow('下一步:'))
    console.log(chalk.gray('  1. cd ' + (options.here ? projectName : name)))
    console.log(chalk.gray('  2. 在 AI 助手中使用命令:'))
    console.log(chalk.gray('     /geo-analyze "你的话题"'))
    console.log()
    console.log(chalk.cyan('💡 提示:'))
    console.log(chalk.gray('  - 命令格式因平台而异:'))
    console.log(chalk.gray('    Claude Code: /geo.analyze'))
    console.log(chalk.gray('    Gemini CLI: /geo:analyze'))
    console.log(chalk.gray('    其他平台: /geo-analyze'))
    console.log()

  } catch (error) {
    spinner.fail('初始化失败')
    throw error
  }
}

async function createPlatformCommands(projectDir: string, platform: string) {
  const commandsDir = path.join(projectDir, `.${platform}/commands`)
  await fs.ensureDir(commandsDir)

  // 命令列表
  const commands = [
    'geo-analyze',
    'geo-write',
    'geo-review',
    'geo-schema',
    'geo-publish',
    'geo-track',
    'specify',
    'research',
    'collect'
  ]

  // 从 geoify 安装目录获取模板路径
  const geoifyRoot = path.join(__dirname, '../..')
  const templatesDir = path.join(geoifyRoot, 'templates/commands')

  // 复制每个命令模板
  for (const cmd of commands) {
    const templateFile = path.join(templatesDir, `${cmd}.md`)

    // 检查模板是否存在
    if (!await fs.pathExists(templateFile)) {
      console.log(`  ⚠️  模板不存在: ${cmd}.md`)
      continue
    }

    // 根据平台调整命令名
    let cmdName = cmd
    if (platform === 'claude') {
      cmdName = cmd.replace(/-/g, '.')
    } else if (platform === 'gemini') {
      cmdName = cmd.replace(/-/g, ':')
    }

    const outputFile = path.join(commandsDir, `${cmdName}.md`)
    await fs.copy(templateFile, outputFile)
  }

  // 创建 README
  const readme = `# ${platform.charAt(0).toUpperCase() + platform.slice(1)} 命令

## Geoify GEO 优化工作流

### 核心命令

1. \`/geo-analyze\` - 分析目标话题的 GEO 现状
2. \`/specify\` - 定义内容目标和 E-E-A-T 要求
3. \`/research\` - 研究竞争对手和权威来源
4. \`/collect\` - 收集真实数据和案例
5. \`/geo-write\` - 生成符合 E-E-A-T 标准的内容
6. \`/geo-review\` - GEO 专项审校
7. \`/geo-schema\` - 生成结构化数据标记
8. \`/geo-publish\` - 发布并提交到 AI 索引
9. \`/geo-track\` - 跟踪 AI 引用情况

## E-E-A-T 原则

- **Experience (体验)**: 内容基于真实经历
- **Expertise (专业性)**: 展示专业知识
- **Authoritativeness (权威性)**: 引用权威来源
- **Trustworthiness (可信度)**: 数据可验证

## 了解更多

- [Geoify 项目](https://github.com/wordflowlab/geoify)
`

  await fs.writeFile(path.join(commandsDir, 'README.md'), readme)
}
