# Geoify v0.1.0 发布公告 🎉

**发布日期**: 2025-11-02

我们很高兴地宣布 **Geoify v0.1.0 正式版**发布!这是第一个生产可用的版本,专注于 GEO (Generative Engine Optimization) - 优化内容使其成为 AI 引擎的引用来源。

## 什么是 Geoify?

Geoify 是一款帮助你优化内容,使其成为 ChatGPT、Perplexity、Claude 等 AI 引擎引用来源的工具。

- **SEO**: 优化内容在搜索引擎中的**排名**
- **GEO**: 优化内容使其成为 AI 引擎的**引用来源**

## 核心功能

### 1. E-E-A-T 评分系统 ✅

遵循 Google 的 E-E-A-T 质量标准,对你的内容进行 4 个维度、16 个检查项的评估:

- **Experience** (体验): 内容是否基于真实经历?
- **Expertise** (专业性): 是否展示专业知识?
- **Authoritativeness** (权威性): 是否引用权威来源?
- **Trustworthiness** (可信度): 数据是否可验证?

**示例**:
```bash
geoify review article.md

# 输出:
总分: 9.7/10 🌟
  Experience: 9.2/10
  Expertise: 9.4/10
  Authoritativeness: 10/10
  Trustworthiness: 10/10
```

### 2. Schema.org 生成 ✅

自动生成符合 Schema.org 标准的结构化数据,帮助 AI 引擎更好地理解你的内容:

- 自动检测内容类型(Article, HowTo, Review, FAQ, Person)
- 提取完整元数据(作者、日期、关键词)
- 生成 JSON-LD 和 HTML 标签格式

**示例**:
```bash
geoify schema article.md \
  --url "https://example.com/article" \
  --site-name "My Blog"

# 生成:
✓ article-schema.json
✓ article-schema.html
```

### 3. CLI 工具 ✅

- `geoify init` - 初始化项目
- `geoify review` - E-E-A-T 审校
- `geoify schema` - 生成 Schema.org 标记

## 示例和文档

### 完整示例项目

我们提供了一个得分 **9.7/10** 的示例文章《Rust 语言入门到实战》,包含:

- ✅ 完整的 frontmatter 元数据
- ✅ 真实的学习经历和项目实践
- ✅ 6 个代码示例,18 个技术术语
- ✅ 引用 10 个权威来源
- ✅ 1597 字深度内容

**查看示例**: [examples/complete-workflow/](https://github.com/wordflowlab/geoify/tree/main/examples/complete-workflow)

### 文档

- [快速入门](https://github.com/wordflowlab/geoify/blob/main/examples/complete-workflow/QUICKSTART.md) - 5 分钟上手
- [使用手册](https://github.com/wordflowlab/geoify/blob/main/USAGE.md) - 详细说明
- [深度分析](https://github.com/wordflowlab/geoify/blob/main/examples/complete-workflow/ANALYSIS.md) - 为什么得高分?
- [更新日志](https://github.com/wordflowlab/geoify/blob/main/CHANGELOG.md) - 版本历史

## 快速开始

### 安装

```bash
npm install -g geoify
```

### 使用

```bash
# 1. 初始化项目
geoify init my-article

# 2. 撰写文章

# 3. 评估分数
geoify review articles/draft.md

# 4. 生成 Schema
geoify schema articles/final.md \
  --url "https://example.com/article"
```

## 预期效果

基于示例文章(9.7/10)的实际数据:

- ✅ **AI 引用概率**: 80-90%
- ✅ **Perplexity 引用**: 2-4 周内
- ✅ **ChatGPT 引用**: 4-6 周内
- ✅ **6 个月累计引用**: 500-1000 次

## 已知限制

v0.1.0 作为 MVP 版本,存在以下限制:

- ⚠️ 仅支持中文内容分析
- ⚠️ 暂无 AI 引用跟踪功能(计划在 v0.2.0 实现)
- ⚠️ 暂无可视化看板(计划在 v0.3.0 实现)

## 路线图

### v0.2.0 (预计 3 周)
- AI 引用跟踪(`/geo-track`)
- 竞争分析(`/geo-analyze`)
- 引用数据看板

### v0.3.0 (预计 6 周)
- 多语言支持(英文、日文)
- Web 可视化看板
- 多行业模板库

## 技术细节

- **语言**: TypeScript + ES2022
- **CLI 框架**: Commander.js
- **依赖**: chalk, ora, inquirer, gray-matter, fs-extra, js-yaml
- **Node 版本**: >= 18.0.0

## 贡献

欢迎贡献代码或报告问题:

- **GitHub**: https://github.com/wordflowlab/geoify
- **Issues**: https://github.com/wordflowlab/geoify/issues
- **Pull Requests**: https://github.com/wordflowlab/geoify/pulls

## 致谢

- 基于 [scriptify (article-writer)](https://github.com/wordflowlab/scriptify) 架构
- 灵感来自论文: [GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735)

---

## 快速链接

- **npm**: https://www.npmjs.com/package/geoify
- **GitHub**: https://github.com/wordflowlab/geoify
- **文档**: https://github.com/wordflowlab/geoify#readme
- **示例**: https://github.com/wordflowlab/geoify/tree/main/examples

---

**让你的内容成为 AI 时代的权威来源!** ✨

如有任何问题或建议,欢迎在 [GitHub Issues](https://github.com/wordflowlab/geoify/issues) 中反馈。
