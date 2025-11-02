# Geoify - AI 引用优化工具

> Optimize for AI Citation, Not Just Search Ranking

**Geoify** 是一款专注于 GEO (Generative Engine Optimization) 的 AI 内容工具,帮助你的内容成为 ChatGPT、Perplexity、Claude 等 AI 引擎的引用来源。

## 什么是 GEO?

GEO (Generative Engine Optimization / 生成引擎优化) 是一种新兴的内容优化策略:

- **SEO**: 优化内容在搜索引擎(Google/百度)中的**排名**
- **GEO**: 优化内容使其成为 AI 引擎的**引用来源**

### 典型场景

```
用户向 ChatGPT 提问: "2024年最值得学习的编程语言是什么?"

传统搜索 (SEO):
→ 返回 10 个网页链接
→ 用户需要点击并阅读

AI 搜索 (GEO):
→ AI 直接生成答案
→ 在答案中引用你的内容 ⭐
→ 示例: "根据 XXX 网站的数据,Python 在 2024 年..."
```

## 核心特性

### ✅ 继承 scriptify (article-writer)

- 🎓 **多模式写作** - 教练/快速/混合模式,确保内容真实性
- 📚 **素材库管理** - 导入真实数据/案例,建立可信来源
- ✨ **真实性审校** - 三遍审校,降低 AI 味
- 💻 **斜杠命令系统** - 支持 13 个 AI 平台(Claude/Cursor/Gemini 等)

### 🆕 GEO 专属功能

- 📊 **E-E-A-T 评分** - Google 质量标准评估
- 🔗 **引用格式优化** - 结构化数据、权威引用
- 📈 **AI 引用跟踪** - 监测在各 AI 平台的引用情况
- 🎯 **竞争分析** - 分析竞品在 AI 答案中的表现

## 快速开始

### 安装

```bash
npm install -g geoify@alpha
```

### 1. 初始化项目

```bash
# 创建新项目
geoify init my-article

# 进入项目目录
cd my-article
```

### 2. 审校文章 (CLI 命令)

```bash
# 评估文章的 E-E-A-T 得分
geoify review article/draft.md

# 自定义目标分数
geoify review article/draft.md \
  --target-experience 9 \
  --target-trustworthiness 10
```

### 3. 生成 Schema.org 标记

```bash
# 生成结构化数据
geoify schema article/final.md \
  --url "https://example.com/article" \
  --site-name "My Blog"

# 仅生成 JSON
geoify schema article/final.md --format json
```

### 4. 使用工作流

在 AI 助手(Claude/Cursor/Gemini)中使用斜杠命令:

```
1. /geo-analyze  → 分析目标话题的 GEO 现状
2. /specify      → 定义内容目标和 E-E-A-T 要求
3. /research     → 研究竞争对手和权威来源
4. /collect      → 收集真实数据和案例
5. /geo-write    → 生成符合 E-E-A-T 标准的内容
6. /geo-review   → GEO 专项审校
7. /geo-schema   → 生成结构化数据标记
8. /geo-publish  → 发布并提交到 AI 索引
9. /geo-track    → 跟踪 AI 引用情况
```

## E-E-A-T 原则

Geoify 遵循 Google 的 E-E-A-T 质量标准:

| 维度 | 全称 | GEO 要求 |
|-----|------|---------|
| **E** | Experience | 内容基于**亲身经历**,非编造 |
| **E** | Expertise | 展示**专业知识**和技能 |
| **A** | Authoritativeness | 引用**权威来源**,有外部认可 |
| **T** | Trustworthiness | 数据**可验证**,透明联系方式 |

## 支持的 AI 平台

### 目标 AI 引擎

- ✅ **ChatGPT** (OpenAI)
- ✅ **Perplexity** (答案引擎)
- ✅ **Claude** (Anthropic)
- ✅ **Gemini** (Google)
- ✅ **文心一言** (百度)
- ✅ **通义千问** (阿里)

### 支持的 AI 工具(斜杠命令)

| AI 工具 | 命令格式 | 示例 |
|---------|----------|------|
| **Claude Code** | `/geo.命令名` | `/geo.write` |
| **Gemini CLI** | `/geo:命令名` | `/geo:write` |
| **Cursor** | `/命令名` | `/geo-write` |
| **其他平台** | `/命令名` | `/geo-write` |

## 项目结构

```
my-article/
├── .geoify/              # 配置与脚本
│   ├── config.yaml       # 项目配置
│   └── templates/        # 命令模板
├── .claude/commands/     # Claude 命令
├── .cursor/commands/     # Cursor 命令
├── _analysis/            # GEO 分析报告
├── _tracking/            # AI 引用跟踪数据
├── _knowledge_base/      # 调研结果
├── materials/            # 素材库
│   ├── raw/              # 原始数据
│   ├── indexed/          # 主题索引
│   └── archive/          # 历史文章
├── profile/              # 内容配置
│   └── schema/           # Schema.org 标记
└── articles/             # 文章输出
    └── 001-topic/
        ├── draft.md
        └── final.md
```

## 示例

### 生成符合 GEO 标准的文章

```bash
# 1. 初始化项目
geoify init best-programming-languages-2024

# 2. 在 Claude Code 中使用命令
/geo-analyze "2024年最值得学习的编程语言"
# → AI 分析竞争对手和内容缺口

/specify
# → 定义 E-E-A-T 目标

/geo-write
# → 选择写作模式,生成内容

/geo-review
# → E-E-A-T 审校,获得评分报告

/geo-schema
# → 生成 Schema.org 标记

/geo-publish
# → 发布到网站

/geo-track
# → 开始跟踪 AI 引用情况
```

### 预期效果

- ✅ E-E-A-T 评分: 8.5/10
- ✅ AI 引用概率: 75%+
- ✅ 被 Perplexity 引用: 2 周内
- ✅ 被 ChatGPT 引用: 4 周内

## 文档

- [完整 PRD](docs/PRD.md) - 产品需求文档
- [实施路线图](docs/ROADMAP.md) - 开发计划
- [技术架构](docs/ARCHITECTURE.md) - 架构设计

## 与 scriptify 的关系

Geoify 基于 [scriptify (article-writer)](https://github.com/wordflowlab/scriptify) 的架构开发,专注于 GEO 优化:

| 项目 | 定位 | 核心功能 |
|-----|------|---------|
| **scriptify** | 自媒体写作工具 | 多模式写作 + 降 AI 味 |
| **geoify** | GEO 优化工具 | E-E-A-T 评分 + AI 引用跟踪 |

## 路线图

### v0.1.0-alpha.3 (当前版本) ✨

- [x] 项目初始化
- [x] E-E-A-T 评分系统
- [x] `geoify review` - E-E-A-T 审校命令
- [x] `geoify schema` - Schema.org 生成命令
- [ ] 示例项目和完整文档

### v0.1.0 (MVP)

- [ ] `/geo-write` 命令实现
- [ ] 引用格式优化
- [ ] 完整测试覆盖

### v0.2.0 (Beta) - 3 周

- [ ] AI 引用跟踪
- [ ] 竞争分析
- [ ] `/geo-track` 命令
- [ ] `/geo-analyze` 命令

### v0.3.0 (正式版) - 3 周

- [ ] API 集成
- [ ] 数据看板
- [ ] 多行业模板

## 贡献

欢迎提交 Issue 和 Pull Request!

## 许可证

MIT License

## 致谢

- 基于 [scriptify (article-writer)](https://github.com/wordflowlab/scriptify) 架构
- 灵感来自论文: [GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735)

---

**让你的内容成为 AI 时代的权威来源!** ✨
