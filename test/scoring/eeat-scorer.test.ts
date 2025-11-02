import { describe, it, expect } from 'vitest'
import { EEATScorer } from '../../src/scoring/eeat-scorer.js'

describe('EEATScorer', () => {
  const scorer = new EEATScorer()

  describe('score', () => {
    it('should score a high-quality article highly', () => {
      const markdown = `---
title: My Technical Journey
author: John Doe
jobTitle: Senior Engineer
credentials: 10 years experience
email: john@example.com
date: 2024-01-15
updated: 2024-01-20
---

# My Technical Journey

## My Experience

I spent 3 years developing this system. In 2022, we achieved 8x performance improvement.

\`\`\`javascript
function optimize() {
  return performance.now()
}
\`\`\`

## Technical Details

We used advanced algorithms including binary search and hash maps.

## References

[1] Official Documentation - https://docs.example.com
[2] Research Paper - https://arxiv.org/abs/123456
[3] Stack Overflow Guide - https://stackoverflow.com/questions/123
      `

      const result = scorer.score(markdown)

      expect(result.overall).toBeGreaterThanOrEqual(6)
      expect(result.breakdown.experience).toBeGreaterThan(0)
      expect(result.breakdown.expertise).toBeGreaterThan(0)
      expect(result.breakdown.authoritativeness).toBeGreaterThan(0)
      expect(result.breakdown.trustworthiness).toBeGreaterThan(0)
      expect(result.details).toBeDefined()
      expect(result.recommendations).toBeDefined()
      expect(result.timestamp).toBeDefined()
    })

    it('should score a low-quality article lowly', () => {
      const markdown = `
# Some Article

This is a vague article without specific details.
Maybe it's good, possibly useful.
      `

      const result = scorer.score(markdown)

      expect(result.overall).toBeLessThan(6)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    it('should detect first-person experience', () => {
      const markdown = `
I have been working on this for 5 years.
My team achieved 10x performance improvement.
      `

      const result = scorer.score(markdown)
      expect(result.details.experience.checks.hasFirstPerson.passed).toBe(true)
    })

    it('should detect lack of first-person experience', () => {
      const markdown = `
This article describes a generic approach.
The system works well.
      `

      const result = scorer.score(markdown)
      expect(result.details.experience.checks.hasFirstPerson.passed).toBe(false)
    })

    it('should detect technical expertise from code blocks', () => {
      const markdown = `
\`\`\`javascript
const advanced = () => {
  return complexAlgorithm()
}
\`\`\`
      `

      const result = scorer.score(markdown)
      expect(result.details.expertise.checks.hasTechnicalDetails.score).toBeGreaterThan(0)
    })

    it('should detect citations', () => {
      const markdown = `
According to research [1], this approach is effective.

[1] Paper - https://arxiv.org/abs/123
      `

      const result = scorer.score(markdown)
      expect(result.details.authoritativeness.checks.hasCitations.passed).toBe(true)
    })

    it('should detect missing author information', () => {
      const markdown = `# Article without author info`

      const result = scorer.score(markdown)
      expect(result.details.authoritativeness.checks.hasAuthorCredentials.passed).toBe(false)
    })

    it('should detect presence of contact information', () => {
      const markdown = `---
email: author@example.com
---

# Article
      `

      const result = scorer.score(markdown)
      expect(result.details.trustworthiness.checks.hasContactInfo.passed).toBe(true)
    })

    it('should generate recommendations for improvements', () => {
      const markdown = `# Simple Article

This is basic content.
      `

      const result = scorer.score(markdown)
      expect(result.recommendations.length).toBeGreaterThan(0)
      expect(result.recommendations[0]).toHaveProperty('dimension')
      expect(result.recommendations[0]).toHaveProperty('message')
      expect(result.recommendations[0]).toHaveProperty('priority')
    })

    it('should prioritize recommendations correctly', () => {
      const markdown = `# Article`

      const result = scorer.score(markdown, {
        target: {
          experience: 9,
          expertise: 9,
          authoritativeness: 9,
          trustworthiness: 9
        }
      })

      const highPriority = result.recommendations.filter(r => r.priority === 'high')
      const mediumPriority = result.recommendations.filter(r => r.priority === 'medium')

      // Should have recommendations
      expect(result.recommendations.length).toBeGreaterThan(0)

      // High priority items should come first
      if (highPriority.length > 0 && mediumPriority.length > 0) {
        const firstHighIndex = result.recommendations.findIndex(r => r.priority === 'high')
        const firstMediumIndex = result.recommendations.findIndex(r => r.priority === 'medium')
        expect(firstHighIndex).toBeLessThan(firstMediumIndex)
      }
    })

    it('should apply custom target scores', () => {
      const markdown = `---
title: Article
author: Test
---

# Article

Content here.
      `

      const resultLowTarget = scorer.score(markdown, {
        target: { experience: 5, expertise: 5, authoritativeness: 5, trustworthiness: 5 }
      })

      const resultHighTarget = scorer.score(markdown, {
        target: { experience: 10, expertise: 10, authoritativeness: 10, trustworthiness: 10 }
      })

      // High target should generate more recommendations
      expect(resultHighTarget.recommendations.length).toBeGreaterThanOrEqual(
        resultLowTarget.recommendations.length
      )
    })
  })

  describe('weighted scoring', () => {
    it('should weight all dimensions equally (25% each)', () => {
      const markdown = `---
title: Test
author: Author
jobTitle: Engineer
credentials: 5 years
email: test@example.com
date: 2024-01-01
updated: 2024-01-02
---

# Test Article

I have 5 years of experience in this field.

\`\`\`javascript
const code = () => 'example'
\`\`\`

See [Reference](https://example.com) for details.
      `

      const result = scorer.score(markdown)

      const { experience, expertise, authoritativeness, trustworthiness } = result.breakdown

      // Calculate manual weighted average
      const manualAverage = (experience + expertise + authoritativeness + trustworthiness) / 4

      // Should match (with small rounding tolerance)
      expect(Math.abs(result.overall - manualAverage)).toBeLessThan(0.1)
    })
  })
})
