import matter from 'gray-matter'
import type { BaseSchema, SchemaOptions, ContentType } from './types/base.js'
import { ContentDetector } from './content-detector.js'
import { ArticleGenerator } from './generators/article-generator.js'

/**
 * Schema.org 生成器
 * 根据内容类型自动生成对应的 Schema
 */
export class SchemaGenerator {
  private detector: ContentDetector
  private articleGenerator: ArticleGenerator

  constructor() {
    this.detector = new ContentDetector()
    this.articleGenerator = new ArticleGenerator()
  }

  /**
   * 生成 Schema
   */
  generate(markdown: string, options: SchemaOptions = {}): {
    type: ContentType
    schema: BaseSchema
  } {
    // 解析 frontmatter
    const { data: frontmatter, content } = matter(markdown)

    // 检测内容类型
    const type = this.detector.detect(content, frontmatter)

    // 根据类型生成 Schema
    let schema: BaseSchema

    switch (type) {
      case 'article':
        schema = this.articleGenerator.generate(content, frontmatter, options)
        break

      case 'howto':
        // HowTo 暂时使用 Article
        schema = this.articleGenerator.generate(content, frontmatter, options)
        schema['@type'] = 'HowTo'
        break

      case 'review':
        // Review 暂时使用 Article
        schema = this.articleGenerator.generate(content, frontmatter, options)
        schema['@type'] = 'Review'
        break

      case 'faq':
        // FAQ 暂时使用 Article
        schema = this.articleGenerator.generate(content, frontmatter, options)
        schema['@type'] = 'FAQPage'
        break

      case 'person':
        // Person 暂时使用 Article
        schema = this.articleGenerator.generate(content, frontmatter, options)
        schema['@type'] = 'Person'
        break

      default:
        schema = this.articleGenerator.generate(content, frontmatter, options)
    }

    return { type, schema }
  }

  /**
   * 生成 JSON-LD 字符串
   */
  generateJSONLD(markdown: string, options: SchemaOptions = {}): string {
    const { schema } = this.generate(markdown, options)
    return JSON.stringify(schema, null, 2)
  }

  /**
   * 生成 HTML script 标签
   */
  generateHTMLTag(markdown: string, options: SchemaOptions = {}): string {
    const jsonld = this.generateJSONLD(markdown, options)
    return `<script type="application/ld+json">\n${jsonld}\n</script>`
  }

  /**
   * 验证 Schema (基础验证)
   */
  validate(schema: BaseSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // 检查必需字段
    if (!schema['@context']) {
      errors.push('Missing required field: @context')
    }

    if (!schema['@type']) {
      errors.push('Missing required field: @type')
    }

    // Article 特定验证
    if (schema['@type'] === 'Article' || schema['@type'].includes('Article')) {
      if (!schema.headline) {
        errors.push('Article missing required field: headline')
      }
      if (!schema.author) {
        errors.push('Article missing required field: author')
      }
      if (!schema.datePublished) {
        errors.push('Article missing required field: datePublished')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}
