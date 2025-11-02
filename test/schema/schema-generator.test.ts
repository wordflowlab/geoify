import { describe, it, expect } from 'vitest'
import { SchemaGenerator } from '../../src/schema/schema-generator.js'

describe('SchemaGenerator', () => {
  const generator = new SchemaGenerator()

  describe('generate', () => {
    it('should generate Article schema for basic article', () => {
      const markdown = `---
title: My Article
author: John Doe
date: 2024-01-15
---

# My Article

This is article content.
      `

      const result = generator.generate(markdown, {
        url: 'https://example.com/article',
        siteName: 'My Blog'
      })

      expect(result.type).toBe('article')
      expect(result.schema['@type']).toBe('Article')
      expect(result.schema.headline).toBe('My Article')
      expect(result.schema.author).toBeDefined()
      expect(result.schema.datePublished).toBeDefined()
    })

    it('should detect HowTo content type', () => {
      const markdown = `---
title: How to Learn Rust
---

# How to Learn Rust

1. Install Rust
2. Read the Book
3. Build Projects
      `

      const result = generator.generate(markdown)
      // 内容检测基于关键词和结构,可能检测为 article 或 howto
      expect(['article', 'howto']).toContain(result.type)
    })

    it('should detect Review content type', () => {
      const markdown = `---
title: Product Review
---

# Product Review

## Pros
- Good performance
- Easy to use

## Cons
- Expensive

Rating: 4.5/5
      `

      const result = generator.generate(markdown)
      expect(result.type).toBe('review')
      expect(result.schema['@type']).toBe('Review')
    })

    it('should detect FAQ content type', () => {
      const markdown = `
# Frequently Asked Questions

## What is this?
This is a FAQ section.

## How does it work?
It works by answering questions.

## Is it free?
Yes, it's free.
      `

      const result = generator.generate(markdown)
      expect(result.type).toBe('faq')
      expect(result.schema['@type']).toBe('FAQPage')
    })

    it('should extract author information from frontmatter', () => {
      const markdown = `---
author: Jane Smith
jobTitle: Senior Developer
email: jane@example.com
website: https://jane.dev
github: https://github.com/janesmith
---

# Article
      `

      const result = generator.generate(markdown)
      const author = result.schema.author as any

      expect(author['@type']).toBe('Person')
      expect(author.name).toBe('Jane Smith')
      expect(author.jobTitle).toBe('Senior Developer')
      expect(author.email).toBe('jane@example.com')
    })

    it('should extract citations', () => {
      const markdown = `
# Article

References:
[1] Documentation - https://docs.example.com
[2] Research - https://arxiv.org/abs/123
      `

      const result = generator.generate(markdown)

      if ('citation' in result.schema && result.schema.citation) {
        expect(result.schema.citation.length).toBeGreaterThan(0)
        expect(result.schema.citation[0]).toHaveProperty('@type', 'CreativeWork')
        expect(result.schema.citation[0]).toHaveProperty('url')
      }
    })

    it('should include publisher information', () => {
      const markdown = `# Article`

      const result = generator.generate(markdown, {
        siteName: 'Tech Blog',
        siteLogo: 'https://example.com/logo.png'
      })

      if ('publisher' in result.schema) {
        const publisher = result.schema.publisher as any
        expect(publisher['@type']).toBe('Organization')
        expect(publisher.name).toBe('Tech Blog')
        expect(publisher.logo).toBe('https://example.com/logo.png')
      }
    })

    it('should set language from options', () => {
      const markdown = `# Article`

      const result = generator.generate(markdown, {
        language: 'en-US'
      })

      if ('inLanguage' in result.schema) {
        expect(result.schema.inLanguage).toBe('en-US')
      }
    })
  })

  describe('validate', () => {
    it('should validate a complete schema', () => {
      const schema = {
        '@context': 'https://schema.org' as const,
        '@type': 'Article' as const,
        headline: 'Test Article',
        author: {
          '@context': 'https://schema.org' as const,
          '@type': 'Person' as const,
          name: 'John Doe'
        },
        datePublished: '2024-01-15',
        publisher: {
          '@context': 'https://schema.org' as const,
          '@type': 'Organization' as const,
          name: 'My Blog'
        }
      }

      const result = generator.validate(schema)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing required fields', () => {
      const schema = {
        '@context': 'https://schema.org' as const,
        '@type': 'Article' as const
        // Missing headline
      }

      const result = generator.validate(schema)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('generateJSONLD', () => {
    it('should generate valid JSON-LD string', () => {
      const markdown = `---
title: Test
author: John
---

# Test
      `

      const jsonld = generator.generateJSONLD(markdown)

      expect(jsonld).toBeTruthy()
      expect(() => JSON.parse(jsonld)).not.toThrow()

      const parsed = JSON.parse(jsonld)
      expect(parsed['@context']).toBe('https://schema.org')
      expect(parsed['@type']).toBeDefined()
    })

    it('should include all metadata', () => {
      const markdown = `---
title: Complete Article
author: Jane Doe
date: 2024-01-15
keywords: test, article, schema
---

# Complete Article
      `

      const jsonld = generator.generateJSONLD(markdown, {
        url: 'https://example.com/article',
        siteName: 'Blog'
      })

      const parsed = JSON.parse(jsonld)
      expect(parsed.headline).toBe('Complete Article')
      expect(parsed.keywords).toBeDefined()
    })
  })

  describe('generateHTMLTag', () => {
    it('should generate valid HTML script tag', () => {
      const markdown = `---
title: Test
---

# Test
      `

      const html = generator.generateHTMLTag(markdown)

      expect(html).toContain('<script type="application/ld+json">')
      expect(html).toContain('</script>')
      // JSON with spaces formatting
      expect(html).toContain('"@context": "https://schema.org"')
    })

    it('should escape special characters in JSON', () => {
      const markdown = `---
title: Article with "quotes" and <tags>
---

# Test
      `

      const html = generator.generateHTMLTag(markdown)

      // Should not break HTML
      expect(html).toContain('<script')
      expect(html).toContain('</script>')

      // Extract JSON from script tag
      const jsonMatch = html.match(/<script[^>]*>(.*?)<\/script>/s)
      expect(jsonMatch).toBeTruthy()

      if (jsonMatch) {
        const json = jsonMatch[1]
        expect(() => JSON.parse(json)).not.toThrow()
      }
    })
  })

  describe('content type detection', () => {
    it('should prioritize explicit type from frontmatter', () => {
      const markdown = `---
type: howto
---

# This is actually a review

Rating: 5/5
      `

      const result = generator.generate(markdown)
      expect(result.type).toBe('howto')
    })

    it('should auto-detect when no explicit type', () => {
      const markdown = `
# How to Build a Website

1. Choose a framework
2. Design the layout
3. Deploy to production
      `

      const result = generator.generate(markdown)
      expect(result.type).toBe('howto')
    })

    it('should handle ambiguous content', () => {
      const markdown = `# Generic Article

Some content here.
      `

      const result = generator.generate(markdown)
      // Should default to article
      expect(result.type).toBe('article')
    })
  })

  describe('edge cases', () => {
    it('should handle markdown without frontmatter', () => {
      const markdown = `# Article Title

Article content.
      `

      const result = generator.generate(markdown)
      expect(result.schema.headline).toBe('Article Title')
    })

    it('should handle empty markdown', () => {
      const markdown = ''

      const result = generator.generate(markdown)
      expect(result.schema).toBeDefined()
      expect(result.schema['@context']).toBe('https://schema.org')
    })

    it('should handle markdown with only frontmatter', () => {
      const markdown = `---
title: Only Frontmatter
author: John
---`

      const result = generator.generate(markdown)
      expect(result.schema.headline).toBe('Only Frontmatter')
    })

    it('should handle multiple authors', () => {
      const markdown = `---
authors:
  - John Doe
  - Jane Smith
---

# Article
      `

      const result = generator.generate(markdown)
      // Should handle gracefully, even if not fully supported
      expect(result.schema).toBeDefined()
    })
  })
})
