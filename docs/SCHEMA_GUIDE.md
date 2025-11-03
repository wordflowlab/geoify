# Schema.org 实践指南

## 目录

- [什么是 Schema.org?](#什么是-schemaorg)
- [为什么 GEO 需要 Schema.org?](#为什么-geo-需要-schemaorg)
- [支持的内容类型](#支持的内容类型)
- [JSON-LD vs HTML 格式](#json-ld-vs-html-格式)
- [自动检测逻辑](#自动检测逻辑)
- [实战示例](#实战示例)
- [验证和测试](#验证和测试)
- [常见问题](#常见问题)

---

## 什么是 Schema.org?

### 核心定义

**Schema.org** 是一个由 Google、Microsoft、Yahoo、Yandex 联合创建的**结构化数据标准**,用于描述网页内容的类型、属性和关系。

**官方网站**: [schema.org](https://schema.org)

### 设计目的

帮助搜索引擎和 AI 引擎**准确理解**网页内容:

- ✅ 这是一篇文章还是产品评测?
- ✅ 作者是谁?何时发布?
- ✅ 文章主题是什么?
- ✅ 是否包含评分、价格等结构化信息?

### 在 GEO 中的作用

AI 引擎在生成答案时,**优先引用**包含 Schema.org 标记的内容:

**原因**:
1. **准确性** - 结构化数据减少误解
2. **完整性** - 元数据(作者、日期)增强可信度
3. **可追溯性** - 明确的发布信息
4. **优先级** - AI 引擎将其视为"高质量"信号

---

## 为什么 GEO 需要 Schema.org?

### 问题:AI 引擎的内容理解困境

当 AI 引擎抓取网页时,面临:

```html
<div class="article">
  <h1>Rust 学习指南</h1>
  <p class="author">张华</p>
  <p class="date">2024-03-15</p>
  ...
</div>
```

**AI 的困惑**:
- ❓ "张华" 是作者还是编辑?
- ❓ "2024-03-15" 是发布日期还是更新日期?
- ❓ 这是教程、评论还是新闻?

### 解决方案:Schema.org 明确语义

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Rust 学习指南",
  "author": {
    "@type": "Person",
    "name": "张华",
    "jobTitle": "高级软件工程师"
  },
  "datePublished": "2024-03-15",
  "articleSection": "Tutorial"
}
```

**AI 现在清楚**:
- ✅ 这是一篇**文章**(Article)
- ✅ 作者是**张华**,职位是**高级软件工程师**
- ✅ **发布日期**是 2024-03-15
- ✅ 类型是**教程**(Tutorial)

### 实际效果

**Perplexity 引用示例**:

> 根据**张华**(高级软件工程师)在 2024 年 3 月发表的教程,Rust 的所有权系统...
>
> [1] Rust 学习指南 - TechBlog (2024-03-15)

**关键信息来自 Schema.org**:
- 作者姓名和职位
- 发布日期
- 文章类型

---

## 支持的内容类型

Geoify 支持 5 种 Schema.org 类型:

### 1. Article - 文章

**适用场景**:
- 博客文章
- 技术教程
- 深度分析
- 观点评论

**核心属性**:

| 属性 | 类型 | 说明 | 必需 |
|-----|------|------|------|
| `headline` | Text | 标题 | ✅ |
| `author` | Person | 作者信息 | ✅ |
| `datePublished` | Date | 发布日期 | ✅ |
| `dateModified` | Date | 更新日期 | ⚠️ |
| `articleBody` | Text | 文章正文 | ⚠️ |
| `image` | URL | 特色图片 | ⚠️ |
| `publisher` | Organization | 发布组织 | ⚠️ |

**完整示例**:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Rust 语言入门到实战",
  "author": {
    "@type": "Person",
    "name": "张华",
    "jobTitle": "高级软件工程师",
    "url": "https://example.com/author/zhanghua"
  },
  "datePublished": "2024-03-15",
  "dateModified": "2024-10-20",
  "publisher": {
    "@type": "Organization",
    "name": "TechBlog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "image": "https://example.com/rust-guide-cover.jpg",
  "articleSection": "Tutorial",
  "keywords": ["Rust", "编程语言", "系统编程"]
}
```

### 2. HowTo - 操作指南

**适用场景**:
- 分步教程
- 操作手册
- 配置指南
- 安装说明

**核心属性**:

| 属性 | 类型 | 说明 | 必需 |
|-----|------|------|------|
| `name` | Text | 指南标题 | ✅ |
| `step` | HowToStep[] | 操作步骤 | ✅ |
| `totalTime` | Duration | 总耗时 | ⚠️ |
| `estimatedCost` | MonetaryAmount | 预估成本 | ⚠️ |
| `tool` | Text[] | 所需工具 | ⚠️ |

**完整示例**:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "如何安装 Rust 开发环境",
  "description": "在 macOS/Linux/Windows 上安装 Rust",
  "totalTime": "PT15M",
  "tool": ["Terminal", "curl", "Text Editor"],
  "step": [
    {
      "@type": "HowToStep",
      "name": "安装 rustup",
      "text": "在终端运行: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
      "url": "https://example.com/install-rust#step1"
    },
    {
      "@type": "HowToStep",
      "name": "验证安装",
      "text": "运行 rustc --version 检查版本",
      "url": "https://example.com/install-rust#step2"
    },
    {
      "@type": "HowToStep",
      "name": "配置编辑器",
      "text": "安装 rust-analyzer 插件",
      "url": "https://example.com/install-rust#step3"
    }
  ]
}
```

### 3. Review - 评测/评论

**适用场景**:
- 产品评测
- 书评/影评
- 工具对比
- 服务评价

**核心属性**:

| 属性 | 类型 | 说明 | 必需 |
|-----|------|------|------|
| `itemReviewed` | Thing | 评测对象 | ✅ |
| `reviewRating` | Rating | 评分 | ✅ |
| `author` | Person | 评测者 | ✅ |
| `reviewBody` | Text | 评测内容 | ⚠️ |
| `datePublished` | Date | 发布日期 | ⚠️ |

**完整示例**:

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "SoftwareApplication",
    "name": "Rust Programming Language",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Cross-platform"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "9.5",
    "bestRating": "10",
    "worstRating": "0"
  },
  "author": {
    "@type": "Person",
    "name": "张华"
  },
  "reviewBody": "Rust 是我用过最安全的系统编程语言...",
  "datePublished": "2024-03-15"
}
```

### 4. FAQPage - 常见问题

**适用场景**:
- FAQ 页面
- Q&A 内容
- 帮助中心

**核心属性**:

| 属性 | 类型 | 说明 | 必需 |
|-----|------|------|------|
| `mainEntity` | Question[] | 问题列表 | ✅ |

**完整示例**:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Rust 适合初学者吗?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rust 学习曲线较陡,但如果你有其他编程语言基础,完全可以学习。建议先掌握所有权系统..."
      }
    },
    {
      "@type": "Question",
      "name": "Rust 和 C++ 哪个更快?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "性能相近(±5%)。Rust 的优势在于内存安全,无需手动管理内存..."
      }
    }
  ]
}
```

### 5. Person - 作者/专家档案

**适用场景**:
- 关于我
- 作者简介
- 团队成员

**核心属性**:

| 属性 | 类型 | 说明 | 必需 |
|-----|------|------|------|
| `name` | Text | 姓名 | ✅ |
| `jobTitle` | Text | 职位 | ⚠️ |
| `url` | URL | 个人网站 | ⚠️ |
| `sameAs` | URL[] | 社交媒体 | ⚠️ |

**完整示例**:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "张华",
  "jobTitle": "高级软件工程师",
  "worksFor": {
    "@type": "Organization",
    "name": "XX 科技"
  },
  "url": "https://example.com/author/zhanghua",
  "sameAs": [
    "https://github.com/zhanghua",
    "https://twitter.com/zhanghua_dev",
    "https://linkedin.com/in/zhanghua"
  ],
  "knowsAbout": ["Rust", "系统编程", "Web 开发"],
  "alumniOf": {
    "@type": "Organization",
    "name": "XX 大学"
  }
}
```

---

## JSON-LD vs HTML 格式

Schema.org 支持 3 种格式:

### 1. JSON-LD (推荐)

**优点**:
- ✅ 清晰易读
- ✅ 独立于 HTML 结构
- ✅ 易于生成和维护
- ✅ Google 推荐

**位置**: 放在 `<head>` 或 `<body>` 中的 `<script>` 标签

```html
<!DOCTYPE html>
<html>
<head>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Rust 学习指南",
    "author": {
      "@type": "Person",
      "name": "张华"
    }
  }
  </script>
</head>
<body>
  ...
</body>
</html>
```

### 2. Microdata (不推荐)

**缺点**:
- ❌ 与 HTML 结构耦合
- ❌ 难以维护
- ❌ 冗长

```html
<article itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">Rust 学习指南</h1>
  <div itemprop="author" itemscope itemtype="https://schema.org/Person">
    <span itemprop="name">张华</span>
  </div>
</article>
```

### 3. RDFa (不推荐)

**缺点**:
- ❌ 复杂
- ❌ 不直观

```html
<article vocab="https://schema.org/" typeof="Article">
  <h1 property="headline">Rust 学习指南</h1>
  <div property="author" typeof="Person">
    <span property="name">张华</span>
  </div>
</article>
```

**Geoify 选择**: JSON-LD(唯一支持)

---

## 自动检测逻辑

Geoify 的 `SchemaGenerator` 会自动检测内容类型:

### 检测规则

```typescript
// src/schema/content-detector.ts

export class ContentDetector {
  detectType(content: string): SchemaType {
    // 1. HowTo: 包含步骤或操作指南
    if (this.isHowTo(content)) return 'HowTo'

    // 2. FAQ: 包含问答格式
    if (this.isFAQ(content)) return 'FAQPage'

    // 3. Review: 包含评分或评测
    if (this.isReview(content)) return 'Review'

    // 4. Person: 个人简介
    if (this.isPerson(content)) return 'Person'

    // 5. 默认: Article
    return 'Article'
  }

  private isHowTo(content: string): boolean {
    const indicators = [
      /## 步骤/i,
      /## Step/i,
      /如何/,
      /How to/i,
      /教程/,
      /Tutorial/i,
    ]
    return indicators.some(pattern => pattern.test(content))
  }

  private isFAQ(content: string): boolean {
    const indicators = [
      /## 常见问题/i,
      /## FAQ/i,
      /问:/,
      /Q:/i,
      /答:/,
      /A:/i,
    ]
    const matches = content.match(/问:|Q:/gi) || []
    return matches.length >= 3  // 至少 3 个问题
  }

  private isReview(content: string): boolean {
    const indicators = [
      /评分[::]?\s*\d/,
      /Rating[::]?\s*\d/i,
      /评测/,
      /Review/i,
      /打分/,
    ]
    return indicators.some(pattern => pattern.test(content))
  }
}
```

### 检测示例

**示例 1: 检测为 HowTo**

```markdown
# 如何配置 Rust 开发环境

## 步骤 1: 安装 rustup
...

## 步骤 2: 配置编辑器
...
```

**检测结果**: `HowTo` (包含"如何"和"步骤")

**示例 2: 检测为 Article**

```markdown
# Rust 所有权系统详解

所有权是 Rust 最独特的特性...
```

**检测结果**: `Article` (默认类型)

---

## 实战示例

### 使用 Geoify CLI

```bash
# 自动检测并生成 Schema
geoify schema article.md \
  --url "https://example.com/rust-guide" \
  --site-name "TechBlog"

# 输出 JSON-LD 格式
geoify schema article.md --format json

# 输出 HTML 格式
geoify schema article.md --format html
```

### 输出示例

**JSON 格式**:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Rust 语言入门到实战:一位前端工程师的学习之旅",
  "author": {
    "@type": "Person",
    "name": "张华",
    "jobTitle": "高级软件工程师"
  },
  "datePublished": "2024-03-15",
  "publisher": {
    "@type": "Organization",
    "name": "TechBlog"
  },
  "url": "https://example.com/rust-guide",
  "mainEntityOfPage": "https://example.com/rust-guide"
}
```

**HTML 格式**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Rust 语言入门到实战:一位前端工程师的学习之旅",
  "author": {
    "@type": "Person",
    "name": "张华",
    "jobTitle": "高级软件工程师"
  },
  "datePublished": "2024-03-15",
  "publisher": {
    "@type": "Organization",
    "name": "TechBlog"
  },
  "url": "https://example.com/rust-guide"
}
</script>
```

### 嵌入 HTML

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Rust 学习指南</title>

  <!-- Schema.org 标记 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Rust 语言入门到实战",
    "author": {
      "@type": "Person",
      "name": "张华",
      "jobTitle": "高级软件工程师"
    },
    "datePublished": "2024-03-15",
    "publisher": {
      "@type": "Organization",
      "name": "TechBlog"
    }
  }
  </script>
</head>
<body>
  <article>
    <h1>Rust 语言入门到实战</h1>
    ...
  </article>
</body>
</html>
```

---

## 验证和测试

### 方法 1: Google Rich Results Test

**URL**: https://search.google.com/test/rich-results

**步骤**:
1. 访问工具网站
2. 输入页面 URL 或粘贴代码
3. 点击"测试"
4. 查看结果

**示例结果**:

```
✅ Article detected
  - Headline: "Rust 语言入门到实战"
  - Author: "张华"
  - Date: "2024-03-15"
  - Publisher: "TechBlog"
```

### 方法 2: Schema.org Validator

**URL**: https://validator.schema.org/

**步骤**:
1. 粘贴 JSON-LD 代码
2. 点击"Validate"
3. 检查错误和警告

**示例输出**:

```
✅ Valid Schema.org markup
  Type: Article
  Properties: 7 detected
  Warnings: 0
  Errors: 0
```

### 方法 3: Geoify 内置验证

```bash
# 验证 Schema 标记
geoify validate-schema article.html

# 输出:
# ✅ Valid Article schema
# ✅ All required properties present
# ⚠️  Warning: Missing 'image' property (recommended)
# ⚠️  Warning: Missing 'dateModified' property (recommended)
```

---

## 常见问题

### Q1: 必须包含所有属性吗?

**答**: 不必须,但推荐

**必需属性**(标记为 ✅):
- Article: `headline`, `author`, `datePublished`
- HowTo: `name`, `step`
- Review: `itemReviewed`, `reviewRating`, `author`

**推荐属性**(标记为 ⚠️):
- `image` - 提高视觉吸引力
- `publisher` - 增强可信度
- `dateModified` - 展示内容更新

**策略**: 先实现必需属性,再逐步添加推荐属性

### Q2: 多个 Schema 类型可以并存吗?

**答**: 可以

**示例**: 文章 + 作者

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Rust 学习指南",
    "author": {
      "@id": "#author"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "#author",
    "name": "张华",
    "jobTitle": "高级软件工程师"
  }
]
```

### Q3: Schema.org 会影响 SEO 吗?

**答**: 间接影响

**直接**: Google 不使用 Schema.org 作为排名因素
**间接**: Rich Snippets 提高点击率 → 提升排名

**GEO 影响**: 直接影响,AI 引擎优先引用包含 Schema 的内容

### Q4: 如何处理中文内容?

**答**: 直接使用中文,无需翻译

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Rust 学习指南",
  "inLanguage": "zh-CN",
  "author": {
    "@type": "Person",
    "name": "张华"
  }
}
```

**建议**: 添加 `inLanguage` 属性明确语言

### Q5: Schema 生成后需要手动维护吗?

**答**: 推荐自动化

**方法**:
1. **构建时生成**: 每次发布时自动生成
2. **Git Hook**: 提交前自动更新
3. **CI/CD**: 部署流程中生成

**Geoify 集成**:

```bash
# package.json
{
  "scripts": {
    "build": "geoify schema articles/**/*.md --output dist/"
  }
}
```

---

## 延伸阅读

### 官方资源

- [Schema.org 官方文档](https://schema.org)
- [Google 结构化数据指南](https://developers.google.com/search/docs/appearance/structured-data)
- [JSON-LD 规范](https://json-ld.org/)

### Geoify 文档

- [GEO 核心概念](./GEO_CONCEPTS.md) - Schema.org 在 GEO 中的作用
- [E-E-A-T 指南](./EEAT_GUIDE.md) - 内容质量标准
- [llms.txt 指南](./LLMS_TXT_GUIDE.md) - AI 可读格式优化
- [API 参考](./API_REFERENCE.md) - SchemaGenerator API 详解

### 工具和验证器

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [JSON-LD Playground](https://json-ld.org/playground/)

---

**让 AI 准确理解你的内容!** ✨

*最后更新: 2025-11-03*
