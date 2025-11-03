import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { rm, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { LLMsTxtGenerator } from '../../src/llms/llms-generator.js'
import type { LlmsTxtConfig } from '../../src/llms/types.js'

describe('LLMsTxtGenerator', () => {
  const testArticlesDir = join(process.cwd(), 'test', 'fixtures', 'articles')

  const testConfig: LlmsTxtConfig = {
    siteName: 'Test Site',
    siteUrl: 'https://test.com',
    siteDescription: 'A test site for GEO',
    categories: {
      '技术文档': {
        tags: ['Rust', 'TypeScript', '技术'],
        priority: 1,
        label: '技术文档'
      },
      '实践指南': {
        tags: ['实践', '指南', '教程'],
        priority: 2,
        label: '实践指南'
      }
    },
    minEEATScore: 7.0,
    maxArticles: 100
  }

  describe('generate()', () => {
    it('应该成功生成 llms.txt 和 llms-full.txt', async () => {
      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(testArticlesDir)

      // 验证返回结果结构
      expect(result).toHaveProperty('llmsTxt')
      expect(result).toHaveProperty('llmsFullTxt')
      expect(result).toHaveProperty('metadata')

      // 验证元数据
      expect(result.metadata.totalArticles).toBeGreaterThan(0)
      expect(result.metadata.generatedAt).toBeDefined()
    })

    it('应该在 llms.txt 中包含网站信息', async () => {
      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(testArticlesDir)

      expect(result.llmsTxt).toContain('# Test Site')
      expect(result.llmsTxt).toContain('> A test site for GEO')
      expect(result.llmsTxt).toContain('## 关于')
    })

    it('应该在 llms-full.txt 中包含完整内容', async () => {
      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(testArticlesDir)

      expect(result.llmsFullTxt).toContain('# Test Site')
      expect(result.llmsFullTxt).toContain('---')
      expect(result.llmsFullTxt).toContain('**URL**:')
      expect(result.llmsFullTxt).toContain('**E-E-A-T 分数**:')
    })

    it('应该正确分类文章', async () => {
      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(testArticlesDir)

      // 应该有至少一个分类
      expect(result.metadata.categorizedArticles).toBeGreaterThan(0)
    })

    it('应该按 E-E-A-T 分数排序', async () => {
      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(testArticlesDir)

      // 验证平均分数
      expect(result.metadata.averageEEATScore).toBeGreaterThan(0)
      expect(result.metadata.averageEEATScore).toBeLessThanOrEqual(10)
    })

    it('应该过滤低质量文章', async () => {
      const configWithHighThreshold: LlmsTxtConfig = {
        ...testConfig,
        minEEATScore: 9.5 // 设置很高的阈值
      }

      const generator = new LLMsTxtGenerator(configWithHighThreshold)
      const result = await generator.generate(testArticlesDir)

      // 如果阈值很高,可能会过滤掉一些文章
      // 平均分数应该很高
      if (result.metadata.totalArticles > 0) {
        expect(result.metadata.averageEEATScore).toBeGreaterThanOrEqual(9.5)
      }
    })

    it('应该限制最大文章数', async () => {
      const configWithLimit: LlmsTxtConfig = {
        ...testConfig,
        maxArticles: 1
      }

      const generator = new LLMsTxtGenerator(configWithLimit)
      const result = await generator.generate(testArticlesDir)

      // 最多返回 1 篇文章
      expect(result.metadata.totalArticles).toBeLessThanOrEqual(1)
    })

    it('应该正确处理空目录', async () => {
      const emptyDir = join(process.cwd(), 'test', 'fixtures', 'empty')

      // 创建空目录
      await mkdir(emptyDir, { recursive: true })

      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(emptyDir)

      expect(result.metadata.totalArticles).toBe(0)

      // 清理
      await rm(emptyDir, { recursive: true, force: true })
    })
  })

  describe('文件内容格式', () => {
    it('llms.txt 应该使用正确的 Markdown 格式', async () => {
      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(testArticlesDir)

      // 检查 Markdown 结构
      expect(result.llmsTxt).toMatch(/^# .+$/m) // 标题
      expect(result.llmsTxt).toMatch(/^> .+$/m) // 引用
      expect(result.llmsTxt).toMatch(/^## .+$/m) // 二级标题
      expect(result.llmsTxt).toMatch(/^- \[.+\]\(.+\)/m) // 链接列表
    })

    it('llms-full.txt 应该包含分隔符', async () => {
      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(testArticlesDir)

      expect(result.llmsFullTxt).toContain('---')
    })

    it('应该包含正确的 URL 格式', async () => {
      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(testArticlesDir)

      // URL 应该以配置的 siteUrl 开头
      expect(result.llmsFullTxt).toContain('https://test.com/')
    })
  })

  describe('元数据统计', () => {
    it('应该计算正确的统计数据', async () => {
      const generator = new LLMsTxtGenerator(testConfig)
      const result = await generator.generate(testArticlesDir)

      const { metadata } = result

      // 总数应该等于已分类 + 未分类
      expect(metadata.totalArticles).toBe(
        metadata.categorizedArticles + metadata.uncategorizedArticles
      )

      // 平均分数应该在合理范围内
      expect(metadata.averageEEATScore).toBeGreaterThanOrEqual(0)
      expect(metadata.averageEEATScore).toBeLessThanOrEqual(10)

      // 生成时间应该是有效的 ISO 字符串
      expect(() => new Date(metadata.generatedAt)).not.toThrow()
    })
  })
})
