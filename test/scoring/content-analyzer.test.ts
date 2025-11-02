import { describe, it, expect } from 'vitest'
import { ContentAnalyzer } from '../../src/scoring/content-analyzer.js'

describe('ContentAnalyzer', () => {
  const analyzer = new ContentAnalyzer()

  describe('analyze', () => {
    it('should count Chinese characters correctly', () => {
      const markdown = '这是一个测试文章,包含中文字符。'
      const result = analyzer.analyze(markdown)
      expect(result.wordCount).toBe(14)
    })

    it('should count English words correctly', () => {
      const markdown = 'This is a test article with English words.'
      const result = analyzer.analyze(markdown)
      expect(result.wordCount).toBe(8)
    })

    it('should count mixed Chinese and English', () => {
      const markdown = '这是 a mixed 测试 article 文章'
      const result = analyzer.analyze(markdown)
      expect(result.wordCount).toBe(9)
    })

    it('should return 0 for empty string', () => {
      const result = analyzer.analyze('')
      expect(result.wordCount).toBe(0)
    })
  })

  describe('hasFirstPerson', () => {
    it('should detect Chinese first-person pronouns', () => {
      expect(analyzer.hasFirstPerson('我认为这很好')).toBe(true)
      expect(analyzer.hasFirstPerson('我的经历是...')).toBe(true)
      expect(analyzer.hasFirstPerson('咱们一起做了这个项目')).toBe(true)
    })

    it('should detect English first-person pronouns', () => {
      expect(analyzer.hasFirstPerson('I think this is good')).toBe(true)
      expect(analyzer.hasFirstPerson('My experience was...')).toBe(true)
      expect(analyzer.hasFirstPerson('We worked together')).toBe(true)
    })

    it('should return false when no first-person pronouns', () => {
      expect(analyzer.hasFirstPerson('这是一个客观的描述')).toBe(false)
      expect(analyzer.hasFirstPerson('This is an objective description')).toBe(false)
    })
  })

  describe('hasSpecificDetails', () => {
    it('should detect specific numbers with quantity', () => {
      expect(analyzer.hasSpecificDetails('性能提升了 8 倍')).toBe(false) // 无时间词
      expect(analyzer.hasSpecificDetails('处理了 10000 items')).toBe(true) // 有items
    })

    it('should detect specific dates', () => {
      expect(analyzer.hasSpecificDetails('2024年1月15日发布')).toBe(true)
      expect(analyzer.hasSpecificDetails('在 2023 年完成')).toBe(true)
    })

    it('should require both numbers and time/quantity', () => {
      expect(analyzer.hasSpecificDetails('在北京召开的会议')).toBe(false) // 无数字
      expect(analyzer.hasSpecificDetails('处理了 100 times')).toBe(true) // 有数字和times
    })

    it('should return false for vague content', () => {
      expect(analyzer.hasSpecificDetails('性能有所提升')).toBe(false)
      expect(analyzer.hasSpecificDetails('效果很好')).toBe(false)
    })
  })

  describe('avoidsVagueTerms', () => {
    it('should detect vague terms in Chinese', () => {
      // 非常短的文本(<20字),包含2个模糊词
      const result = analyzer.avoidsVagueTerms('可能也许')
      expect(result.vagueTermsCount).toBe(2)
      // 阈值: ceil(2/1000) * 3 = 3, 所以2个词应该通过
      // 需要更多模糊词才能失败
      const result2 = analyzer.avoidsVagueTerms('可能也许大概似乎')
      expect(result2.vagueTermsCount).toBe(4)
      expect(result2.passed).toBe(false)
    })

    it('should pass when no vague terms', () => {
      const result = analyzer.avoidsVagueTerms('性能提升了 8 倍')
      expect(result.passed).toBe(true)
      expect(result.vagueTermsCount).toBe(0)
    })

    it('should allow some vague terms in long content', () => {
      // 生成大约1000字的内容,包含2个模糊词(在阈值内)
      const longContent = '这是一段很长的内容。'.repeat(150) + '可能会有好处。'
      const result = analyzer.avoidsVagueTerms(longContent)
      // 1个模糊词,在阈值内应该通过
      expect(result.vagueTermsCount).toBe(1)
      expect(result.passed).toBe(true)
    })
  })

  describe('extractCitations', () => {
    it('should extract URLs from markdown links', () => {
      const content = 'See [Google](https://google.com) and [GitHub](https://github.com)'
      const citations = analyzer.extractCitations(content)
      expect(citations).toHaveLength(2)
      expect(citations).toContain('https://google.com')
      expect(citations).toContain('https://github.com')
    })

    it('should extract URLs from blockquotes', () => {
      const content = `
> [1] Documentation https://docs.example.com
> [2] Research Paper https://arxiv.org/paper
      `
      const citations = analyzer.extractCitations(content)
      expect(citations.length).toBeGreaterThanOrEqual(1)
    })

    it('should return empty array when no citations', () => {
      const content = 'This is content without any URLs'
      const citations = analyzer.extractCitations(content)
      expect(citations).toHaveLength(0)
    })

    it('should deduplicate URLs', () => {
      const content = `
[Link](https://example.com)
[Same link](https://example.com)
      `
      const citations = analyzer.extractCitations(content)
      expect(citations).toHaveLength(1)
    })
  })

  describe('analyze - detailed tests', () => {
    it('should analyze complete markdown content', () => {
      const markdown = `
# Test Article

I have been working on this project for 2 years.

\`\`\`javascript
const test = () => console.log('test')
\`\`\`

See [Documentation](https://docs.example.com) for details.
      `
      const analysis = analyzer.analyze(markdown)

      expect(analysis.content).toBeDefined()
      expect(analysis.wordCount).toBeGreaterThan(0)
      expect(analysis.codeBlockCount).toBe(1)
      expect(analysis.linkCount).toBe(1)
      expect(analysis.headingCount).toBe(1)
    })

    it('should count multiple code blocks', () => {
      const markdown = `
\`\`\`js
code1
\`\`\`

\`\`\`python
code2
\`\`\`
      `
      const analysis = analyzer.analyze(markdown)
      expect(analysis.codeBlockCount).toBe(2)
    })

    it('should count multiple headings', () => {
      const markdown = `
# Heading 1
## Heading 2
### Heading 3
      `
      const analysis = analyzer.analyze(markdown)
      expect(analysis.headingCount).toBe(3)
    })
  })
})
