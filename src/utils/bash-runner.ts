import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import fs from 'fs-extra'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 检测当前操作系统并返回默认脚本类型
 * @returns 'bash' (macOS/Linux) 或 'powershell' (Windows)
 */
function getDefaultScriptType(): 'bash' | 'powershell' {
  return process.platform === 'win32' ? 'powershell' : 'bash'
}

/**
 * 执行 Bash 或 PowerShell 脚本并返回 JSON 结果
 * @param scriptName 脚本名称(不包含后缀)
 * @param args 传递给脚本的参数数组
 * @param scriptType 脚本类型: 'bash' (默认) 或 'powershell'
 * @returns 解析后的 JSON 对象
 */
export async function executeBashScript(
  scriptName: string,
  args: string[] = [],
  scriptType?: 'bash' | 'powershell'
): Promise<any> {
  // 如果未指定脚本类型,自动检测操作系统
  const actualScriptType = scriptType || getDefaultScriptType()
  try {
    let scriptPath: string
    let command: string

    if (actualScriptType === 'powershell') {
      // PowerShell 脚本路径
      scriptPath = path.resolve(
        __dirname,
        '../..',
        'scripts',
        'powershell',
        `${scriptName}.ps1`
      )

      // 构建 PowerShell 命令
      const escapedArgs = args.map(arg => `"${arg.replace(/"/g, '""')}"`).join(' ')
      command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" ${escapedArgs}`
    } else {
      // Bash 脚本路径
      scriptPath = path.resolve(
        __dirname,
        '../..',
        'scripts',
        'bash',
        `${scriptName}.sh`
      )

      // 构建 Bash 命令
      command = `bash "${scriptPath}" ${args.map(arg => `"${arg}"`).join(' ')}`
    }

    // 执行脚本
    const output = execSync(command, {
      encoding: 'utf-8',
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    })

    // 解析 JSON 输出
    try {
      const result = JSON.parse(output.trim())
      return result
    } catch (parseError) {
      // 如果解析失败,返回原始输出
      console.error(chalk.yellow('⚠️  脚本输出不是有效的 JSON:'))
      console.error(output)
      return {
        status: 'error',
        message: '脚本输出格式错误',
        raw_output: output
      }
    }
  } catch (error: any) {
    // 捕获执行错误
    const errorMessage = error.message || String(error)
    const stderr = error.stderr?.toString() || ''

    return {
      status: 'error',
      message: `执行脚本失败: ${scriptName}`,
      error: errorMessage,
      stderr: stderr
    }
  }
}

/**
 * 解析命令模板文件 (Markdown + YAML frontmatter)
 * @param templatePath 模板文件路径
 * @returns { metadata, content }
 */
export async function parseCommandTemplate(templatePath: string): Promise<{
  metadata: Record<string, any>
  content: string
}> {
  if (!(await fs.pathExists(templatePath))) {
    return {
      metadata: {},
      content: ''
    }
  }

  const fileContent = await fs.readFile(templatePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    metadata: data,
    content: content.trim()
  }
}
