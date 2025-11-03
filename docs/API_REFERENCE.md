# API 参考文档

## 目录

- [CLI 命令](#cli-命令)
- [EEATScorer API](#eeatscorer-api)
- [SchemaGenerator API](#schemagenerator-api)
- [ContentAnalyzer API](#contentanalyzer-api)
- [LLMsTxtGenerator API](#llmstxtgenerator-api-✅ 已实现)
- [配置文件](#配置文件)

---

## CLI 命令

### `geoify init`

初始化新的 GEO 项目。

**语法**:
```bash
geoify init <project-name> [options]
```

**参数**:
- `<project-name>`: 项目名称(必需)

**选项**:
- `--template <name>`: 使用指定模板(默认:`standard`)
- `--no-git`: 不初始化 Git 仓库

**示例**:
```bash
# 基本使用
geoify init my-article

# 使用自定义模板
geoify init my-article --template technical

# 不初始化 Git
geoify init my-article --no-git
```

**输出结构**:
```
my-article/
├── .geoify/
│   ├── config.yaml
│   └── templates/
├── materials/
├── profile/
├── articles/
└── README.md
```

---

### `geoify review`

评估文章的 E-E-A-T 得分。

**语法**:
```bash
geoify review <file> [options]
```

**参数**:
- `<file>`: Markdown 文件路径(必需)

**选项**:
- `--format <type>`: 输出格式(`text`/`json`/`markdown`,默认:`text`)
- `--target-experience <score>`: Experience 目标分数(0-10)
- `--target-expertise <score>`: Expertise 目标分数(0-10)
- `--target-authoritativeness <score>`: Authoritativeness 目标分数(0-10)
- `--target-trustworthiness <score>`: Trustworthiness 目标分数(0-10)
- `--output <file>`: 保存报告到文件

**示例**:
```bash
# 基本评分
geoify review article.md

# 输出 JSON 格式
geoify review article.md --format json

# 设定目标分数
geoify review article.md \
  --target-experience 9 \
  --target-authoritativeness 9

# 保存报告
geoify review article.md \
  --format markdown \
  --output report.md
```

**输出示例** (text 格式):
```
📊 E-E-A-T 评分报告

Overall Score: 9.7/10 ✨

Experience: 9.2/10 ✅
  ✅ Has first-person narration
  ✅ Has specific details
  ✅ Has temporal information
  ✅ Word count: 1597 (sufficient)

Expertise: 9.4/10 ✅
  ✅ Technical terms: 18 found
  ✅ Code examples: 6 (excellent)
  ✅ Has depth analysis
  ✅ Has best practices

Authoritativeness: 10/10 ✅
  ✅ Citations: 10 (excellent)
  ✅ Has specific data
  ✅ Has external links
  ✅ Complete author info

Trustworthiness: 10/10 ✅
  ✅ Accurate statements
  ✅ Has publication date
  ✅ Has contact information
  ✅ Has limitations statement

🎉 文章已达到高质量标准!
```

**JSON 输出示例**:
```json
{
  "overall": 9.7,
  "dimensions": {
    "experience": {
      "score": 9.2,
      "checks": {
        "hasFirstPerson": true,
        "hasSpecificDetails": true,
        "hasTemporalInfo": true,
        "sufficientWordCount": true
      }
    },
    "expertise": {
      "score": 9.4,
      "checks": {
        "technicalTerms": 18,
        "codeExamples": 6,
        "hasDepthAnalysis": true,
        "hasBestPractices": true
      }
    },
    "authoritativeness": {
      "score": 10,
      "checks": {
        "citationCount": 10,
        "hasSpecificData": true,
        "hasExternalLinks": true,
        "hasAuthorInfo": true
      }
    },
    "trustworthiness": {
      "score": 10,
      "checks": {
        "accurateStatements": true,
        "hasPublicationDate": true,
        "hasContactInfo": true,
        "hasLimitations": true
      }
    }
  },
  "suggestions": []
}
```

---

### `geoify schema`

生成 Schema.org 结构化数据标记。

**语法**:
```bash
geoify schema <file> [options]
```

**参数**:
- `<file>`: Markdown 文件路径(必需)

**选项**:
- `--url <url>`: 文章 URL(必需)
- `--site-name <name>`: 网站名称(必需)
- `--format <type>`: 输出格式(`json`/`html`,默认:`json`)
- `--output <file>`: 保存到文件
- `--type <schema-type>`: 强制指定 Schema 类型

**示例**:
```bash
# 基本使用(输出 JSON)
geoify schema article.md \
  --url "https://example.com/article" \
  --site-name "My Blog"

# 输出 HTML 格式
geoify schema article.md \
  --url "https://example.com/article" \
  --site-name "My Blog" \
  --format html

# 保存到文件
geoify schema article.md \
  --url "https://example.com/article" \
  --site-name "My Blog" \
  --output schema.json

# 强制指定 Schema 类型
geoify schema article.md \
  --url "https://example.com/article" \
  --site-name "My Blog" \
  --type HowTo
```

**支持的 Schema 类型**:
- `Article`(默认)
- `HowTo`
- `Review`
- `FAQPage`
- `Person`

---

### `geoify generate-llms` 

生成 llms.txt 和 llms-full.txt 文件。

**语法**:
```bash
geoify generate-llms [options]
```

**选项**:
- `--articles <dir>`: 文章目录(默认:`articles/`)
- `--output <dir>`: 输出目录(默认:`public/`)
- `--site-name <name>`: 网站名称(必需)
- `--site-url <url>`: 网站 URL(必需)
- `--site-description <text>`: 网站描述

**示例**:
```bash
geoify generate-llms \
  --articles articles/ \
  --output public/ \
  --site-name "TechBlog" \
  --site-url "https://example.com" \
  --site-description "A blog about Rust and web development"
```

**输出**:
- `public/llms.txt`
- `public/llms-full.txt`

---

### `geoify track` (v0.2.0+)

跟踪 AI 引用情况。

**语法**:
```bash
geoify track [options]
```

**选项**:
- `--url <url>`: 文章 URL(必需)
- `--engines <list>`: AI 引擎列表(默认:`all`)
- `--output <file>`: 保存报告

**示例**:
```bash
# 跟踪所有 AI 引擎
geoify track --url "https://example.com/article"

# 只跟踪特定引擎
geoify track \
  --url "https://example.com/article" \
  --engines chatgpt,perplexity

# 保存报告
geoify track \
  --url "https://example.com/article" \
  --output tracking-report.json
```

---

## EEATScorer API

### 类: `EEATScorer`

评估内容的 E-E-A-T 得分。

**位置**: `src/scoring/eeat-scorer.ts`

#### 构造函数

```typescript
constructor()
```

**示例**:
```typescript
import { EEATScorer } from './scoring/eeat-scorer.js'

const scorer = new EEATScorer()
```

#### 方法: `score()`

评估文章的 E-E-A-T 得分。

**签名**:
```typescript
score(content: string): EEATScore
```

**参数**:
- `content`: Markdown 内容(string)

**返回值**: `EEATScore`
```typescript
interface EEATScore {
  overall: number              // 总分 (0-10)
  experience: number           // Experience 分数 (0-10)
  expertise: number            // Expertise 分数 (0-10)
  authoritativeness: number    // Authoritativeness 分数 (0-10)
  trustworthiness: number      // Trustworthiness 分数 (0-10)
  suggestions: string[]        // 优化建议
}
```

**示例**:
```typescript
import fs from 'fs'
import { EEATScorer } from './scoring/eeat-scorer.js'

const content = fs.readFileSync('article.md', 'utf-8')
const scorer = new EEATScorer()
const result = scorer.score(content)

console.log(`Overall Score: ${result.overall}/10`)
console.log(`Experience: ${result.experience}/10`)
console.log(`Expertise: ${result.expertise}/10`)
console.log(`Authoritativeness: ${result.authoritativeness}/10`)
console.log(`Trustworthiness: ${result.trustworthiness}/10`)

if (result.suggestions.length > 0) {
  console.log('\n建议:')
  result.suggestions.forEach(s => console.log(`- ${s}`))
}
```

#### 方法: `generateSuggestions()`

生成优化建议。

**签名**:
```typescript
generateSuggestions(
  score: EEATScore,
  targets?: TargetScores
): string[]
```

**参数**:
- `score`: 当前得分
- `targets`: 目标分数(可选)

**返回值**: string[] - 建议列表

---

## SchemaGenerator API

### 类: `SchemaGenerator`

生成 Schema.org 结构化数据。

**位置**: `src/schema/schema-generator.ts`

#### 构造函数

```typescript
constructor()
```

#### 方法: `generate()`

生成 Schema.org 标记。

**签名**:
```typescript
generate(content: string, options: SchemaOptions): SchemaResult
```

**参数**:
- `content`: Markdown 内容
- `options`: 配置选项

```typescript
interface SchemaOptions {
  url: string           // 文章 URL(必需)
  siteName: string      // 网站名称(必需)
  type?: SchemaType     // Schema 类型(可选,自动检测)
}

type SchemaType = 'Article' | 'HowTo' | 'Review' | 'FAQPage' | 'Person'
```

**返回值**: `SchemaResult`
```typescript
interface SchemaResult {
  type: SchemaType      // 检测到的类型
  jsonLD: object        // JSON-LD 对象
  html: string          // HTML <script> 标签
}
```

**示例**:
```typescript
import fs from 'fs'
import { SchemaGenerator } from './schema/schema-generator.js'

const content = fs.readFileSync('article.md', 'utf-8')
const generator = new SchemaGenerator()

const result = generator.generate(content, {
  url: 'https://example.com/article',
  siteName: 'My Blog',
})

console.log('Detected Type:', result.type)
console.log('\nJSON-LD:')
console.log(JSON.stringify(result.jsonLD, null, 2))

console.log('\nHTML:')
console.log(result.html)
```

**输出示例**:
```
Detected Type: Article

JSON-LD:
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Rust 学习指南",
  "author": {
    "@type": "Person",
    "name": "李明",
    "jobTitle": "全栈开发工程师"
  },
  "datePublished": "2024-01-15",
  "publisher": {
    "@type": "Organization",
    "name": "My Blog"
  },
  "url": "https://example.com/article"
}

HTML:
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  ...
}
</script>
```

---

## ContentAnalyzer API

### 类: `ContentAnalyzer`

分析内容的基本指标。

**位置**: `src/scoring/content-analyzer.ts`

#### 构造函数

```typescript
constructor()
```

#### 方法: `analyze()`

分析内容并返回指标。

**签名**:
```typescript
analyze(content: string): ContentMetrics
```

**返回值**: `ContentMetrics`
```typescript
interface ContentMetrics {
  wordCount: number              // 总字数
  headingCount: number           // 标题数量
  codeBlockCount: number         // 代码块数量
  linkCount: number              // 链接数量
  hasFirstPerson: boolean        // 是否有第一人称
  hasSpecificDetails: boolean    // 是否有具体细节
  avoidsVagueTerms: {            // 是否避免模糊词汇
    passed: boolean
    vagueTermsCount: number
  }
  extractCitations: Citation[]   // 引用列表
}

interface Citation {
  number: number
  text: string
  url?: string
}
```

**示例**:
```typescript
import { ContentAnalyzer } from './scoring/content-analyzer.js'

const analyzer = new ContentAnalyzer()
const metrics = analyzer.analyze(content)

console.log(`字数: ${metrics.wordCount}`)
console.log(`标题: ${metrics.headingCount}`)
console.log(`代码块: ${metrics.codeBlockCount}`)
console.log(`链接: ${metrics.linkCount}`)
console.log(`第一人称: ${metrics.hasFirstPerson}`)
console.log(`具体细节: ${metrics.hasSpecificDetails}`)
console.log(`避免模糊词汇: ${metrics.avoidsVagueTerms.passed}`)
console.log(`引用数量: ${metrics.extractCitations.length}`)
```

---

## LLMsTxtGenerator API 

### 类: `LLMsTxtGenerator`

生成 llms.txt 和 llms-full.txt 文件。

**位置**: `src/llms/llms-generator.ts`

#### 构造函数

```typescript
constructor(config: LlmsTxtConfig)
```

**配置**:
```typescript
interface LlmsTxtConfig {
  siteName: string              // 网站名称
  siteUrl: string               // 网站 URL
  siteDescription: string       // 网站描述
  categories?: {                // 分类规则
    [key: string]: {
      tags: string[]
      priority: number
    }
  }
}
```

#### 方法: `generate()`

生成 llms.txt 文件。

**签名**:
```typescript
async generate(articlesDir: string): Promise<LlmsTxtOutput>
```

**返回值**:
```typescript
interface LlmsTxtOutput {
  llmsTxt: string           // llms.txt 内容
  llmsFullTxt: string       // llms-full.txt 内容
}
```

**示例**:
```typescript
import { LLMsTxtGenerator } from './llms/llms-generator.js'

const generator = new LLMsTxtGenerator({
  siteName: 'TechBlog',
  siteUrl: 'https://example.com',
  siteDescription: 'A blog about Rust and web development',
})

const result = await generator.generate('articles/')

// 保存文件
fs.writeFileSync('public/llms.txt', result.llmsTxt)
fs.writeFileSync('public/llms-full.txt', result.llmsFullTxt)
```

---

## 配置文件

### `.geoify/config.yaml`

项目配置文件。

**位置**: `.geoify/config.yaml`

**示例**:
```yaml
# 站点信息
site:
  name: "TechBlog"
  url: "https://example.com"
  description: "专注于 Rust 和 Web 开发的技术博客"

# E-E-A-T 目标
targets:
  experience: 9.0
  expertise: 9.0
  authoritativeness: 9.0
  trustworthiness: 9.0

# llms.txt 配置
llms:
  enabled: true
  categories:
    "Core Concepts":
      tags: ["concept", "fundamentals"]
      priority: 1
    "Guides":
      tags: ["guide", "tutorial"]
      priority: 2
    "Examples":
      tags: ["example", "case-study"]
      priority: 3
    "Optional":
      tags: ["about", "misc"]
      priority: 4
  full:
    enabled: true
    max_size_mb: 5
    exclude_tags: ["draft", "private"]

# Schema.org 配置
schema:
  default_type: "Article"
  publisher:
    name: "TechBlog"
    logo: "https://example.com/logo.png"
```

### `profile/author.yaml`

作者信息配置。

**位置**: `profile/author.yaml`

**示例**:
```yaml
name: "张华"
job_title: "高级软件工程师"
company: "XX 科技"
bio: "6 年后端开发经验,2 年 Rust 实践"

contact:
  email: "zhanghua@example.com"
  github: "https://github.com/zhanghua"
  twitter: "@zhanghua_dev"
  linkedin: "https://linkedin.com/in/zhanghua"
  website: "https://blog.zhanghua.dev"

skills:
  - Rust
  - 系统编程
  - Web 开发
  - 性能优化

education:
  - degree: "硕士"
    school: "XX 大学"
    field: "计算机科学"
    year: 2018
```

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|-------|------|---------|
| `ENOENT` | 文件不存在 | 检查文件路径 |
| `INVALID_FRONTMATTER` | frontmatter 格式错误 | 检查 YAML 语法 |
| `MISSING_REQUIRED_OPTION` | 缺少必需选项 | 提供所有必需参数 |
| `INVALID_SCHEMA_TYPE` | 无效的 Schema 类型 | 使用支持的类型 |

### 错误示例

```bash
$ geoify schema article.md

❌ Error: Missing required option: --url

Usage: geoify schema <file> --url <url> --site-name <name>
```

---

## 延伸阅读

- [GEO 核心概念](./GEO_CONCEPTS.md) - 了解 Geoify 的设计理念
- [完整工作流](./WORKFLOW_TUTORIAL.md) - 学习如何使用 CLI 命令
- [E-E-A-T 指南](./EEAT_GUIDE.md) - 理解评分标准
- [Schema 指南](./SCHEMA_GUIDE.md) - 深入了解 Schema.org

---

**完整的 API 文档,助力开发和集成!** ✨

*最后更新: 2025-11-03*
