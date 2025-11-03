# llms.txt / llms-full.txt 完整指南

## 目录

- [什么是 llms.txt?](#什么是-llmstxt)
- [llms.txt vs llms-full.txt](#llmstxt-vs-llms-fulltxt)
- [为什么需要 llms.txt?](#为什么需要-llmstxt)
- [llms.txt 文件格式规范](#llmstxt-文件格式规范)
- [llms-full.txt 文件格式](#llms-fulltxt-文件格式)
- [真实案例分析](#真实案例分析)
- [如何生成 llms.txt](#如何生成-llmstxt)
- [与其他标准的关系](#与其他标准的关系)
- [采用情况和数据](#采用情况和数据)
- [Geoify 集成方案](#geoify-集成方案)

---

## 什么是 llms.txt?

### 核心定义

**llms.txt** 是一个位于网站根目录的 Markdown 文件(`/llms.txt`),专为**大语言模型(LLM)**设计,提供网站内容的结构化索引和摘要。

**提出者**: Jeremy Howard (fast.ai 创始人,Answer.AI)
**发布时间**: 2024 年 9 月
**官方规范**: [llmstxt.org](https://llmstxt.org)

### 设计理念

与 `robots.txt`(控制爬虫访问)和 `sitemap.xml`(列举所有页面)不同,`llms.txt` 专注于:

- **为 AI 优化** - 使用 Markdown 格式,易于 LLM 解析
- **内容精选** - 只包含最重要的页面和资源
- **上下文友好** - 适应 LLM 的上下文窗口限制
- **人类可读** - 同时方便人类和 AI 阅读

**核心问题**:
> "如何让 AI 引擎快速理解你的网站内容,而无需爬取和解析整个网站?"

---

## llms.txt vs llms-full.txt

### 两个文件的定位

| 特征 | llms.txt | llms-full.txt |
|-----|---------|--------------|
| **位置** | `/llms.txt` | `/llms-full.txt` |
| **作用** | 导航索引 | 完整内容 |
| **内容** | 页面链接 + 简短描述 | 所有页面的完整文本 |
| **大小** | 1-5 KB | 50-500 KB |
| **场景** | 快速概览 | 深度分析 |
| **优先级** | 基础标配 | 高级优化 |

### 工作流程对比

#### 使用 llms.txt 的流程

```
AI 引擎访问 /llms.txt
  ↓
读取页面列表
  ↓
根据需要爬取具体页面(如 /article.md)
  ↓
生成答案并引用
```

**优点**: 灵活,可按需加载
**缺点**: 需要多次请求,消耗时间

#### 使用 llms-full.txt 的流程

```
AI 引擎访问 /llms-full.txt
  ↓
一次性获取所有内容
  ↓
直接生成答案并引用
```

**优点**: 更快,一次请求,节省 Token
**缺点**: 文件较大,需要生成和维护

### 实际性能数据

**来自 Profound.ai 的跟踪数据(2024)**:

> "LLMs are accessing llms-full.txt **even more frequently** than the original llms.txt."

**原因分析**:
- ⚡ **更快** - AI 无需多次 HTTP 请求
- 💰 **更省** - 减少 LLM 推理成本(无需解析 HTML)
- 🎯 **更准** - 完整上下文提高答案质量

---

## 为什么需要 llms.txt?

### 问题 1: LLM 上下文窗口限制

**现状**:
- GPT-4: 128K tokens (~96,000 单词)
- Claude 3.5: 200K tokens (~150,000 单词)
- Gemini 1.5: 2M tokens (~1,500,000 单词)

**挑战**:
即使是 2M 的上下文窗口,也无法完整容纳:
- ❌ 大型文档网站(如 React 文档 - 500+ 页)
- ❌ 企业知识库(如公司内部 wiki)
- ❌ 开源项目文档(如 Rust Book - 20 章)

**llms.txt 解决方案**:
- ✅ 提供**内容索引**,让 AI 知道哪些页面最重要
- ✅ 使用**纯 Markdown**,去除 HTML/CSS/JS 噪音
- ✅ 支持**优先级**("Optional" 部分可跳过)

### 问题 2: HTML 解析开销

**传统方式**: AI 爬取网页时需要处理:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="...">
  <script src="..."></script>
  <nav>...</nav>
  <header>...</header>
</head>
<body>
  <div class="sidebar">...</div>
  <main>
    <article>
      <!-- 真正的内容只占 20% -->
      <p>Rust is...</p>
    </article>
  </main>
  <footer>...</footer>
  <script>...</script>
</body>
</html>
```

**噪音比例**: 通常 HTML 页面中,真正的内容 < 30%

**llms.txt 方式**: 直接提供纯内容

```markdown
# Rust Learning Guide

Rust is a systems programming language that runs blazingly fast...

## Key Features
- Memory safety without garbage collection
- Concurrency without data races
```

**性能提升**:
- 减少 **70%** 的 Token 消耗
- 提高 **3-5 倍** 的处理速度

### 问题 3: AI 引擎的内容选择困境

**困境**: AI 引擎访问你的网站时,不知道:
- 哪些页面最重要?
- 哪些是过时内容?
- 哪些是辅助页面(如"关于我们")?

**后果**:
- ❌ 可能引用过时信息
- ❌ 可能遗漏核心内容
- ❌ 可能给出不准确的答案

**llms.txt 解决方案**:
由**内容作者**明确指定重要内容,而非让 AI 猜测。

---

## llms.txt 文件格式规范

### 基本结构

```markdown
# [项目名称]

> [简短摘要]

[详细介绍]

## [分类 1]
- [链接标题](URL): 可选描述

## [分类 2]
- [链接标题](URL): 可选描述

## Optional
- [次要链接](URL): 可选描述
```

### 必需元素

#### 1. H1 标题(必需)

```markdown
# FastHTML
```

**要求**:
- 只能有 1 个 H1
- 应为项目或网站名称
- 简洁明了

#### 2. Blockquote 摘要(推荐)

```markdown
> FastHTML is a python library which brings together Starlette, Uvicorn, HTMX,
> and fastcore's `FT` "FastTags" into a library for creating server-rendered
> hypermedia applications.
```

**要求**:
- 1-3 句话
- 概括核心功能或定位
- 使用 `>` 标记

#### 3. 详细介绍(可选)

```markdown
Important notes:

- Although parts of its API are inspired by FastAPI, it is *not* compatible
  with FastAPI syntax
- FastHTML is compatible with JS-native web components but not with React/Vue
```

**要求**:
- 可以是段落、列表或其他 Markdown 格式
- 但**不能使用 H1/H2** 标题(H2 留给分类)

### 分类和链接

#### H2 分类

使用 H2 标记内容分类:

```markdown
## Docs

## Examples

## Optional
```

**特殊分类 "Optional"**:

- 表示**次要内容**,AI 在上下文不足时可跳过
- 用于"关于我们"、"联系方式"、历史文档等

#### 链接格式

```markdown
- [链接文本](URL): 可选描述
```

**示例**:

```markdown
## Docs
- [FastHTML quick start](https://fastht.ml/docs/quickstart.html.md):
  A brief overview of many FastHTML features
- [HTMX reference](https://github.com/bigskysoftware/htmx/blob/master/www/content/reference.md):
  Brief description of all HTMX attributes
```

**要求**:
- URL 可以是绝对路径或相对路径
- **推荐**: 链接到 `.md` 版本(纯 Markdown)
- 描述部分可选,但推荐添加

### 完整示例

```markdown
# Geoify

> A GEO (Generative Engine Optimization) tool to optimize content for AI citation,
> not just search ranking.

Geoify helps your content become the citation source for ChatGPT, Perplexity,
Claude and other AI engines through E-E-A-T scoring, Schema.org generation,
and llms.txt optimization.

## Getting Started
- [Quick Start Guide](https://geoify.com/docs/quickstart.md):
  5-minute tutorial to get started
- [Installation](https://geoify.com/docs/install.md):
  How to install and configure Geoify

## Core Concepts
- [What is GEO?](https://geoify.com/docs/geo-concepts.md):
  Understanding Generative Engine Optimization
- [E-E-A-T Framework](https://geoify.com/docs/eeat-guide.md):
  Google's quality standards for content
- [llms.txt Guide](https://geoify.com/docs/llms-txt-guide.md):
  This document - complete guide to llms.txt

## API Reference
- [EEATScorer](https://geoify.com/docs/api/eeat-scorer.md):
  Content quality scoring API
- [SchemaGenerator](https://geoify.com/docs/api/schema-generator.md):
  Schema.org markup generation API

## Optional
- [About Us](https://geoify.com/about.md):
  Team and project background
- [Contributing](https://geoify.com/contributing.md):
  How to contribute to Geoify
- [Changelog](https://geoify.com/changelog.md):
  Version history and updates
```

---

## llms-full.txt 文件格式

### 核心理念

**llms-full.txt** 是一个**单文件**,包含网站所有重要内容的 Markdown 版本,无需 AI 再次爬取。

### 基本结构

```markdown
# [网站名称] - Complete Documentation

> [网站摘要]

---

## [第一篇文章标题]

[文章完整内容,已转换为 Markdown...]

---

## [第二篇文章标题]

[文章完整内容...]

---

[继续其他文章...]
```

### 内容要求

#### 1. 使用分隔符

使用 `---` 分隔不同文章:

```markdown
---

## Next Article Title

Content here...

---
```

#### 2. 保留完整结构

保留原文的:
- ✅ 标题层级(H2, H3, H4...)
- ✅ 代码块
- ✅ 列表
- ✅ 表格
- ✅ 引用

移除:
- ❌ HTML 标签
- ❌ CSS/JavaScript
- ❌ 导航菜单
- ❌ 页脚版权信息

#### 3. 保持更新

**更新策略**:
- 自动生成(推荐):使用构建脚本,每次发布时重新生成
- 手动更新:每月更新一次

### 完整示例

```markdown
# Geoify Documentation - Complete

> Complete documentation for Geoify - the GEO optimization tool

---

## What is GEO?

GEO (Generative Engine Optimization) is a new content optimization strategy
that focuses on making your content the citation source for AI engines
(ChatGPT, Perplexity, Claude) rather than just ranking in search engines.

### Key Differences: SEO vs GEO

| Aspect | SEO | GEO |
|--------|-----|-----|
| Goal | Top ranking | Being cited |
| Audience | Search crawlers | AI models |
| Success Metric | Click-through rate | Citation count |

[继续完整内容...]

---

## E-E-A-T Framework

The E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
framework from Google is essential for GEO optimization.

### The Four Dimensions

1. **Experience**: Content based on real, first-hand experience
2. **Expertise**: Demonstrates professional knowledge
3. **Authoritativeness**: Cites authoritative sources
4. **Trustworthiness**: Accurate and verifiable

[继续完整内容...]

---

## How to Use Geoify CLI

\`\`\`bash
# Install
npm install -g geoify

# Initialize project
geoify init my-article

# Review article
geoify review article.md
\`\`\`

[继续完整内容...]

---

[其他所有文档的完整内容...]
```

---

## 真实案例分析

### 案例 1: Anthropic Claude 文档

**URL**: `https://docs.claude.com/llms.txt`

**文件特点**:
- ✅ 完整的 API 文档索引
- ✅ 按功能分类(Messages API, Batches API, Skills)
- ✅ 包含提示工程最佳实践
- ✅ 多语言支持(en/de/es)

**效果**:
- Anthropic 自己使用 llms.txt 优化文档
- Claude Code 等工具直接读取 llms.txt 提供上下文

**关键学习点**:
1. **优先级明确**: 核心 API 文档放在前面
2. **结构清晰**: 按功能分类,易于查找
3. **保持更新**: 新功能及时添加到 llms.txt

### 案例 2: FastHTML

**URL**: `https://www.fastht.ml/docs/llms.txt`

**创新点**:
- ✅ 提供 `llms-ctx.txt`(不含链接内容)
- ✅ 提供 `llms-ctx-full.txt`(完整内容)
- ✅ 自动生成(使用 nbdev)

**文件内容**(简化版):

```markdown
# FastHTML

> FastHTML is a python library which brings together Starlette, Uvicorn, HTMX,
> and fastcore's `FT` "FastTags" into a library for creating server-rendered
> hypermedia applications.

Important notes:

- Although parts of its API are inspired by FastAPI, it is *not* compatible
  with FastAPI syntax
- FastHTML is compatible with JS-native web components but not with React/Vue

## Docs

- [FastHTML quick start](https://fastht.ml/docs/tutorials/quickstart.html.md):
  A brief overview of many FastHTML features
- [HTMX reference](https://github.com/bigskysoftware/htmx/blob/master/www/content/reference.md):
  Brief description of all HTMX attributes

## Examples

- [Todo list application](https://github.com/AnswerDotAI/fasthtml/blob/main/examples/adv_app.py):
  Detailed walk-thru of a complete CRUD app

## Optional

- [Starlette full documentation](https://gist.githubusercontent.com/jph00/809e4a4808d4510be0e3dc9565e9cbd3/raw/starlette-sml.md):
  A subset of the Starlette documentation
```

**关键学习点**:
1. **明确不兼容性**: 诚实说明与 FastAPI 不兼容
2. **外部链接**: 包含 HTMX 和 Starlette 相关文档
3. **实战案例**: 提供完整的 Todo 应用示例

### 案例 3: LangChain

**URL**: `https://js.langchain.com/llms.txt`

**特点**:
- ✅ JavaScript SDK 的完整文档索引
- ✅ 按模块分类(Agents, Chains, Retrievers)
- ✅ 包含代码示例链接

**效果**:
- 开发者使用 AI 助手时,AI 能准确找到相关文档
- 减少文档查找时间 50%+

---

## 如何生成 llms.txt

### 方法 1: 手动创建(适合小型网站)

#### 步骤 1: 列出所有重要页面

```
docs/quickstart.md
docs/eeat-guide.md
docs/schema-guide.md
examples/rust-guide.md
```

#### 步骤 2: 分类整理

```
核心概念:
  - GEO 概念
  - E-E-A-T 指南

实践指南:
  - Schema.org
  - 写作最佳实践

案例:
  - Rust 学习指南
```

#### 步骤 3: 编写 llms.txt

```markdown
# Geoify

> GEO optimization tool for AI citation

## Core Concepts
- [What is GEO?](https://geoify.com/docs/geo-concepts.md): Complete introduction
- [E-E-A-T Guide](https://geoify.com/docs/eeat-guide.md): How to score 9+

## Guides
- [Schema.org](https://geoify.com/docs/schema-guide.md): Structured data
- [Writing Best Practices](https://geoify.com/docs/writing-best-practices.md): Authentic writing

## Examples
- [Rust Guide](https://geoify.com/examples/rust-guide.md): 9.7/10 example

## Optional
- [Changelog](https://geoify.com/changelog.md): Version history
```

### 方法 2: 使用 Geoify 自动生成

```bash
# 扫描文章目录,自动生成 llms.txt
geoify generate-llms \
  --articles articles/ \
  --output public/

# 输出:
# - public/llms.txt
# - public/llms-full.txt
```

**自动生成逻辑**:
1. 扫描 `articles/` 目录下所有 `.md` 文件
2. 提取每篇文章的标题和摘要(frontmatter)
3. 根据 E-E-A-T 得分排序(高分文章优先)
4. 自动分类(根据 tags 或目录结构)
5. 生成 llms.txt 和 llms-full.txt

### 方法 3: 使用构建脚本(适合持续集成)

```javascript
// scripts/generate-llms-txt.js
import fs from 'fs'
import path from 'path'
import glob from 'glob'
import matter from 'gray-matter'

function generateLlmsTxt() {
  const articles = glob.sync('articles/**/*.md')

  let llmsTxt = '# Geoify\n\n'
  llmsTxt += '> GEO optimization tool for AI citation\n\n'

  // 核心概念
  llmsTxt += '## Core Concepts\n'
  articles
    .filter(a => a.includes('docs/'))
    .forEach(article => {
      const { data, content } = matter.read(article)
      llmsTxt += `- [${data.title}](${getUrl(article)}): ${data.description}\n`
    })

  // ... 其他分类

  fs.writeFileSync('public/llms.txt', llmsTxt)
}

generateLlmsTxt()
```

**集成到 CI/CD**:

```yaml
# .github/workflows/build.yml
- name: Generate llms.txt
  run: node scripts/generate-llms-txt.js

- name: Deploy
  run: |
    cp public/llms.txt dist/
    cp public/llms-full.txt dist/
```

### 方法 4: 使用现有工具

#### VitePress 插件

```bash
npm install vitepress-plugin-llmstxt
```

```javascript
// .vitepress/config.js
import { defineConfig } from 'vitepress'
import { llmsTxtPlugin } from 'vitepress-plugin-llmstxt'

export default defineConfig({
  plugins: [llmsTxtPlugin()],
})
```

#### Docusaurus 插件

```bash
npm install docusaurus-plugin-llmstxt
```

```javascript
// docusaurus.config.js
module.exports = {
  plugins: ['docusaurus-plugin-llmstxt'],
}
```

---

## 与其他标准的关系

### llms.txt vs robots.txt

| 特性 | robots.txt | llms.txt |
|-----|-----------|---------|
| **目的** | 控制爬虫访问 | 提供内容索引 |
| **格式** | 自定义语法 | Markdown |
| **受众** | 搜索爬虫 | AI 语言模型 |
| **动作** | 禁止/允许 | 推荐/描述 |
| **关系** | 可以同时存在 | 互补 |

**组合使用**:

```
/robots.txt  → 控制哪些页面可以被爬取
/llms.txt    → 告诉 AI 哪些页面最重要
```

### llms.txt vs sitemap.xml

| 特性 | sitemap.xml | llms.txt |
|-----|------------|---------|
| **目的** | 列举所有页面 | 精选重要内容 |
| **格式** | XML | Markdown |
| **内容** | URL + 元数据 | URL + 描述 |
| **优先级** | 有(0.0-1.0) | 有("Optional") |
| **可读性** | 机器可读 | 人类 + AI 可读 |

**区别**:
- sitemap.xml: **全面**,包含所有页面
- llms.txt: **精选**,只包含核心内容

### llms.txt vs Schema.org

| 特性 | Schema.org | llms.txt |
|-----|-----------|---------|
| **位置** | HTML `<head>` | `/llms.txt` 文件 |
| **格式** | JSON-LD | Markdown |
| **粒度** | 单页面级别 | 网站级别 |
| **内容** | 结构化元数据 | 内容索引 |
| **作用** | 描述页面类型 | 导航和摘要 |

**组合使用**:

```
Schema.org  → 告诉 AI "这是一篇文章,作者是张华"
llms.txt    → 告诉 AI "这篇文章是核心内容,优先阅读"
```

**完整 GEO 优化栈**:

```
网站根目录/
├── robots.txt          # 控制爬虫访问
├── sitemap.xml         # 列举所有页面
├── llms.txt            # AI 内容索引
└── llms-full.txt       # AI 完整内容

每个 HTML 页面:
├── <head>
│   └── Schema.org      # 结构化数据
└── <article>           # E-E-A-T 优化内容
```

---

## 采用情况和数据

### 官方采用

| 组织/项目 | llms.txt | llms-full.txt | 备注 |
|----------|---------|--------------|------|
| **Anthropic** | ✅ | ✅ | Claude 文档 |
| **FastHTML** | ✅ | ✅ | 提出者 Jeremy Howard 的项目 |
| **LangChain** | ✅ | ⚠️ | JS 版本有,Python 待确认 |
| **Cursor** | ✅ | ✅ | AI 编程工具 |
| **Mintlify** | ✅ | ✅ | 与 Anthropic 合作开发 |

### 采用率统计

**NerdyData 统计(2024年7月)**:
- 全球有 **951 个域名**发布了 llms.txt
- 占所有网站比例 < 0.001%
- **趋势**: 每月增长 20-30%

**行业分布**:
- 🏆 **技术文档** (40%) - 开源项目、API 文档
- 🏆 **AI 工具** (30%) - AI 相关产品和服务
- 🏆 **个人博客** (20%) - 技术博主、开发者
- 🏆 **企业网站** (10%) - 早期采用者

### AI 引擎支持情况

**官方支持**:

| AI 引擎 | 是否支持 | 支持方式 | 证据 |
|--------|---------|---------|------|
| **Claude** | ✅ | 主动请求 | Mintlify 合作开发 |
| **ChatGPT** | ⚠️ | 未官宣 | 未见公开声明 |
| **Perplexity** | ⚠️ | 未官宣 | 未见公开声明 |
| **Gemini** | ⚠️ | 未官宣 | 未见公开声明 |

**实际情况**(来自 Flavio Longato 分析,2025年8月):

> "As of August 2025, almost every AI crawler **ignores** the llms.txt file."

**但是**:

根据 Profound 的数据:
> "LLMs are accessing llms-full.txt even more frequently than llms.txt"

**结论**:
- ❌ 大部分爬虫**不主动**请求 llms.txt
- ✅ 但 AI 工具(如 Claude Code, Cursor)会**主动使用**
- ✅ llms-full.txt 被访问**频率更高**

### 为什么仍然值得采用?

即使爬虫支持有限,llms.txt 仍有价值:

#### 1. AI 工具集成

Claude Code 示例:

```typescript
// Claude Code 读取文档
const docs = await fetch('https://docs.anthropic.com/llms.txt')
const content = await docs.text()
// 将 llms.txt 作为上下文提供给 Claude
```

**场景**:
- 开发者使用 AI 助手编程
- AI 需要查阅 API 文档
- 直接读取 llms.txt 获取文档索引

#### 2. 自主 AI Agent

未来的 AI Agent 可能会:

```python
# AI Agent 自主学习
def learn_from_website(url):
  llms_txt = fetch(f"{url}/llms.txt")
  for link in parse_links(llms_txt):
    content = fetch(link)
    add_to_knowledge_base(content)
```

#### 3. 内容审计和优化

llms.txt 强迫你思考:

- 哪些内容最重要?
- 如何组织内容?
- 是否需要更新?

**副作用**: 改善整体内容质量

#### 4. 未来兼容性

如果 llms.txt 成为标准(如同 robots.txt):

- ✅ 早期采用者获得先发优势
- ✅ 搜索引擎可能将其纳入排名因素
- ✅ AI 引擎最终会支持

---

## Geoify 集成方案

### 当前状态(v0.1.0)

Geoify 尚未实现 llms.txt 生成功能,但已在计划中。

### 计划功能(v0.2.0+)

#### 命令 1: `geoify generate-llms`

```bash
# 生成 llms.txt 和 llms-full.txt
geoify generate-llms \
  --articles articles/ \
  --output public/ \
  --site-name "My Blog" \
  --site-url "https://example.com"

# 输出:
# ✓ Generated public/llms.txt (3.2 KB)
# ✓ Generated public/llms-full.txt (156 KB)
```

**功能**:
1. 扫描 `articles/` 目录下所有文章
2. 根据 E-E-A-T 得分排序
3. 自动分类(根据 frontmatter tags)
4. 生成 llms.txt 索引
5. 生成 llms-full.txt 完整内容

#### 命令 2: `geoify validate-llms`

```bash
# 验证 llms.txt 格式
geoify validate-llms public/llms.txt

# 输出:
# ✓ Valid H1 title
# ✓ Valid blockquote summary
# ✓ 15 links found
# ⚠ Warning: 3 links return 404
# ✗ Error: "Optional" section missing
```

#### 命令 3: `geoify sync-llms`

```bash
# 持续监听,自动更新 llms.txt
geoify sync-llms \
  --watch articles/ \
  --output public/

# 输出:
# 👀 Watching articles/ for changes...
# 📝 Updated: articles/new-post.md
# ✓ Regenerated llms.txt and llms-full.txt
```

### 实现架构(预览)

```typescript
// src/llms/llms-generator.ts

export class LlmsTxtGenerator {
  constructor(config: LlmsTxtConfig) {}

  async generate(articlesDir: string): Promise<LlmsTxtOutput> {
    // 1. 扫描文章
    const articles = await this.scanArticles(articlesDir)

    // 2. 分析每篇文章
    const analyzed = await Promise.all(
      articles.map(a => this.analyzeArticle(a))
    )

    // 3. 按分数排序
    const sorted = this.sortByScore(analyzed)

    // 4. 分类
    const categorized = this.categorize(sorted)

    // 5. 生成 llms.txt
    const llmsTxt = this.generateIndex(categorized)

    // 6. 生成 llms-full.txt
    const llmsFullTxt = this.generateFull(categorized)

    return { llmsTxt, llmsFullTxt }
  }

  private categorize(articles: Article[]): Categories {
    const categories = {
      'Core Concepts': [],
      'Guides': [],
      'Examples': [],
      'Optional': [],
    }

    articles.forEach(article => {
      const tags = article.frontmatter.tags || []
      if (tags.includes('concept')) {
        categories['Core Concepts'].push(article)
      } else if (tags.includes('guide')) {
        categories['Guides'].push(article)
      } else if (tags.includes('example')) {
        categories['Examples'].push(article)
      } else {
        categories['Optional'].push(article)
      }
    })

    return categories
  }

  private generateIndex(categories: Categories): string {
    let txt = `# ${this.config.siteName}\n\n`
    txt += `> ${this.config.siteDescription}\n\n`

    Object.entries(categories).forEach(([name, articles]) => {
      txt += `## ${name}\n`
      articles.forEach(article => {
        const url = `${this.config.siteUrl}/${article.path}.md`
        txt += `- [${article.title}](${url}): ${article.description}\n`
      })
      txt += '\n'
    })

    return txt
  }

  private generateFull(categories: Categories): string {
    let txt = `# ${this.config.siteName} - Complete Documentation\n\n`
    txt += `> ${this.config.siteDescription}\n\n`

    Object.entries(categories).forEach(([_, articles]) => {
      articles.forEach(article => {
        txt += `---\n\n`
        txt += `## ${article.title}\n\n`
        txt += article.content + '\n\n'
      })
    })

    return txt
  }
}
```

### 使用示例

```bash
# 1. 初始化项目
geoify init my-blog
cd my-blog

# 2. 撰写文章
# 在 articles/ 目录下创建文章

# 3. 生成 llms.txt
geoify generate-llms \
  --articles articles/ \
  --output public/ \
  --site-name "My Tech Blog" \
  --site-url "https://myblog.com" \
  --site-description "A blog about Rust and web development"

# 4. 验证生成结果
geoify validate-llms public/llms.txt

# 5. 发布到网站
cp public/llms.txt /var/www/html/
cp public/llms-full.txt /var/www/html/

# 6. 测试
curl https://myblog.com/llms.txt
```

### 配置文件

```yaml
# .geoify/config.yaml

llms:
  site_name: "My Tech Blog"
  site_url: "https://myblog.com"
  site_description: "Deep dive into Rust and web development"

  # 分类规则
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

  # llms-full.txt 配置
  full:
    enabled: true
    max_size_mb: 5  # 最大 5 MB
    exclude_tags: ["draft", "private"]

  # 自动更新
  auto_update:
    enabled: true
    watch_dir: "articles/"
    output_dir: "public/"
```

---

## 最佳实践总结

### ✅ 应该做的

1. **提供 llms.txt** - 即使爬虫支持有限,对 AI 工具仍有价值
2. **同时提供 llms-full.txt** - 数据显示访问频率更高
3. **使用 .md 链接** - 链接到 Markdown 版本,非 HTML
4. **保持更新** - 新内容发布时同步更新 llms.txt
5. **明确优先级** - 使用 "Optional" 标记次要内容
6. **添加描述** - 每个链接附带简短描述
7. **自动生成** - 集成到构建流程,避免手动维护

### ❌ 不应该做的

1. ~~包含所有页面~~ - 只包含核心内容,非完整 sitemap
2. ~~使用 HTML 格式~~ - 必须使用 Markdown
3. ~~链接到 HTML 页面~~ - 优先链接 `.md` 版本
4. ~~忽略更新~~ - 过时的 llms.txt 比没有更糟
5. ~~堆砌链接~~ - 质量 > 数量,5-20 个核心链接足够
6. ~~省略描述~~ - 描述帮助 AI 理解内容价值

---

## 延伸阅读

### 官方资源

- [llmstxt.org](https://llmstxt.org) - 官方规范
- [Answer.AI 原始提案](https://www.answer.ai/posts/2024-09-03-llmstxt.html) - Jeremy Howard 的完整说明
- [GitHub - AnswerDotAI/llms-txt](https://github.com/AnswerDotAI/llms-txt) - Python 工具和示例

### Geoify 文档

- [GEO 核心概念](./GEO_CONCEPTS.md) - llms.txt 在 GEO 中的作用
- [Schema.org 指南](./SCHEMA_GUIDE.md) - 结构化数据标记
- [E-E-A-T 指南](./EEAT_GUIDE.md) - 内容质量标准
- [完整工作流](./WORKFLOW_TUTORIAL.md) - 包含 llms.txt 生成步骤

### 分析和讨论

- [The Value of llms.txt](https://www.mintlify.com/blog/the-value-of-llms-txt-hype-or-real) - Mintlify 的实践经验
- [GEO and llms.txt](https://www.andrewcoyle.com/blog/generative-engine-optimization-and-the-llms-txt-file) - GEO 专家分析
- [Why AI Crawlers Ignore llms.txt](https://www.longato.ch/llms-recommendation-2025-august/) - 现状分析

---

**让 AI 更容易理解你的内容!** ✨

*最后更新: 2025-11-03*
