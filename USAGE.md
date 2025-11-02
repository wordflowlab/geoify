# Geoify 使用指南

## 快速开始

### 1. 安装 Geoify

```bash
npm install -g geoify
```

### 2. 创建新项目

```bash
# 创建新项目
geoify init my-article

# 进入项目目录
cd my-article
```

### 3. 在 AI 助手中使用

在 Claude Code 或其他 AI 助手中,使用斜杠命令开始 GEO 优化工作流:

```
/geo-analyze "你的话题"
```

## 完整工作流示例

### 场景: 创建一篇关于 "2024年最值得学习的编程语言" 的 GEO 优化文章

#### 第 1 步: 初始化项目

```bash
geoify init best-programming-languages-2024
cd best-programming-languages-2024
```

#### 第 2 步: 分析 GEO 现状

在 Claude Code 中:
```
/geo.analyze "2024年最值得学习的编程语言"
```

AI 会帮你:
- 测试 ChatGPT/Perplexity 当前的回答
- 识别被引用的内容来源
- 分析 Top 5 竞争对手
- 识别内容缺口

输出: `_analysis/best-programming-languages-2024-geo-analysis.md`

#### 第 3 步: 定义内容目标

```
/specify
```

AI 会询问:
- 目标受众 (例如: "编程初学者")
- 你的经验 (例如: "5年全栈开发经验")
- 你的专业背景 (例如: "资深工程师")
- 可用的真实数据 (例如: "团队技术选型案例")

输出: `profile/content-spec.json`

#### 第 4 步: 研究竞争对手

```
/research
```

AI 会帮你:
- 分析 Top 5-10 竞争对手
- 收集权威来源 (Stack Overflow, GitHub, etc.)
- 识别内容缺口

输出: `_knowledge_base/competitors-analysis.md`

#### 第 5 步: 收集真实素材

```
/collect
```

AI 会指导你:
- 收集数据统计 (Stack Overflow Survey, TIOBE Index)
- 整理真实案例 (你的项目经验)
- 收集专家观点
- 收集用户反馈

输出: `materials/indexed/python-vs-javascript/sources.json`

#### 第 6 步: 开始写作

```
/geo.write
```

AI 会让你选择模式:
1. **教练模式** (推荐): AI 提问,你提供真实经历
2. **快速模式**: AI 生成,你审校
3. **混合模式**: AI 框架 + 你填充内容

输出: `articles/best-programming-languages-2024/draft.md`

#### 第 7 步: GEO 审校

```
/geo.review
```

AI 会进行三遍审校:
- 第 1 遍: 事实核查
- 第 2 遍: E-E-A-T 评分
- 第 3 遍: GEO 格式优化

输出:
- `articles/best-programming-languages-2024/final.md`
- `articles/best-programming-languages-2024/eeat-score.json`
- `articles/best-programming-languages-2024/review-report.md`

E-E-A-T 评分示例:
```json
{
  "overall": 8.3,
  "breakdown": {
    "experience": 8,
    "expertise": 8,
    "authoritativeness": 8,
    "trustworthiness": 9
  }
}
```

#### 第 8 步: 生成结构化数据

```
/geo.schema
```

AI 会生成 Schema.org 标记:

输出: `profile/schema/best-programming-languages-2024-schema.json`

示例:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "2024年最值得学习的编程语言",
  "author": {
    "@type": "Person",
    "name": "你的名字",
    "jobTitle": "资深工程师"
  },
  "datePublished": "2024-01-15",
  "citation": [...]
}
```

#### 第 9 步: 发布准备

```
/geo.publish
```

AI 会生成:
- 发布检查清单
- 元数据优化建议
- 提交索引指南

输出: `articles/best-programming-languages-2024/publish-checklist.md`

#### 第 10 步: 跟踪引用

发布后 2-4 周:
```
/geo.track
```

AI 会指导你:
- 在 ChatGPT/Perplexity 测试问题
- 记录引用情况
- 生成引用报告

输出: `_tracking/best-programming-languages-2024/tracking-log.json`

## 命令参考

### 初始化命令

```bash
# 基础初始化
geoify init my-project

# 在当前目录初始化
geoify init . --here

# 指定 AI 平台
geoify init my-project --ai gemini

# 生成所有 AI 平台配置
geoify init my-project --all
```

### AI 平台命令格式

| 平台 | 命令格式 | 示例 |
|------|----------|------|
| Claude Code | `/geo.命令名` | `/geo.analyze` |
| Gemini CLI | `/geo:命令名` | `/geo:analyze` |
| Cursor | `/geo-命令名` | `/geo-analyze` |
| Windsurf | `/geo-命令名` | `/geo-analyze` |

### 核心命令

1. **`/geo-analyze`** - 分析 GEO 现状
   - 测试 AI 引擎当前回答
   - 分析竞争对手
   - 识别内容缺口

2. **`/specify`** - 定义内容目标
   - 设定 E-E-A-T 目标
   - 明确受众和定位
   - 规划内容策略

3. **`/research`** - 竞争研究
   - Top 5-10 竞争对手分析
   - 权威来源收集
   - 内容缺口识别

4. **`/collect`** - 素材收集
   - 数据统计
   - 真实案例
   - 专家观点
   - 测试结果

5. **`/geo-write`** - GEO 写作
   - 教练模式 (最高真实性)
   - 快速模式 (AI 生成)
   - 混合模式 (平衡效率)

6. **`/geo-review`** - GEO 审校
   - 事实核查
   - E-E-A-T 评分
   - 格式优化

7. **`/geo-schema`** - 结构化数据
   - Schema.org 标记生成
   - Article/HowTo/Review 等类型

8. **`/geo-publish`** - 发布准备
   - 检查清单
   - 元数据优化
   - 索引提交指南

9. **`/geo-track`** - 引用跟踪
   - 测试 AI 平台
   - 记录引用情况
   - 生成跟踪报告

## 项目结构说明

```
my-article/
├── .geoify/              # 配置文件
│   └── config.json       # 项目配置
│
├── .claude/commands/     # Claude 命令 (如果选择 --ai claude)
├── .gemini/commands/     # Gemini 命令 (如果选择 --ai gemini)
├── .cursor/commands/     # Cursor 命令 (如果选择 --all)
│
├── _analysis/            # GEO 分析报告
│   └── topic-geo-analysis.md
│
├── _tracking/            # AI 引用跟踪
│   └── topic/
│       ├── tracking-log.json
│       └── citations-report.md
│
├── _knowledge_base/      # 调研资料
│   └── topic/
│       ├── competitors-analysis.md
│       ├── authority-sources.md
│       └── citations.json
│
├── materials/            # 素材库
│   ├── raw/              # 原始素材
│   │   ├── data/
│   │   ├── cases/
│   │   └── expert-quotes/
│   ├── indexed/          # 主题索引
│   │   └── topic/sources.json
│   └── archive/          # 历史素材
│
├── profile/              # 内容配置
│   ├── content-spec.json # 内容目标配置
│   └── schema/           # Schema.org 标记
│       └── topic-schema.json
│
└── articles/             # 文章输出
    └── topic/
        ├── draft.md              # 初稿
        ├── final.md              # 终稿
        ├── eeat-score.json       # E-E-A-T 评分
        ├── review-report.md      # 审校报告
        └── publish-checklist.md  # 发布检查清单
```

## E-E-A-T 原则详解

### Experience (体验) - 8/10
**要求**: 内容基于真实经历
**示例**:
- ✅ "我在过去 3 个项目中都使用了 Python..."
- ❌ "据说 Python 很适合初学者..."

### Expertise (专业性) - 8/10
**要求**: 展示专业知识
**示例**:
- ✅ "Python 的 GIL (全局解释器锁) 在 CPU 密集型任务中会成为瓶颈..."
- ❌ "Python 比较慢..."

### Authoritativeness (权威性) - 8/10
**要求**: 引用权威来源
**示例**:
- ✅ "根据 Stack Overflow 2024 年开发者调查 [1],Python 被 49.3% 的开发者使用..."
- ❌ "很多人都在用 Python..."

### Trustworthiness (可信度) - 9/10
**要求**: 数据可验证
**示例**:
- ✅ "测试环境: MacBook Pro M1, Python 3.11, Node.js 18"
- ❌ "我测试了性能..."

## 常见问题

### Q: 我必须按顺序执行所有命令吗?

不是必须的。你可以根据需要选择命令:
- 如果已经有素材,可以跳过 `/collect`
- 如果已经了解竞争对手,可以跳过 `/research`
- 但推荐按顺序执行以获得最佳效果

### Q: 命令可以重复执行吗?

可以!例如:
- `/geo-review` 可以多次审校
- `/collect` 可以持续补充素材
- `/geo-track` 需要定期执行

### Q: 支持哪些 AI 助手?

目前支持:
- ✅ Claude Code
- ✅ Gemini CLI
- ✅ Cursor
- ✅ Windsurf
- ✅ Roo Code
- ✅ GitHub Copilot
- 其他支持斜杠命令的 AI 助手

### Q: 如何提高 E-E-A-T 评分?

1. **Experience**: 添加更多真实案例和数据
2. **Expertise**: 深入技术细节,避免常识性内容
3. **Authoritativeness**: 引用权威来源,添加作者资质
4. **Trustworthiness**: 确保所有数据可验证,添加联系方式

### Q: 多久能被 AI 引擎引用?

根据经验:
- Perplexity: 2-4 周
- ChatGPT: 4-8 周
- Claude: 4-8 周
- Gemini: 4-8 周

前提:
- E-E-A-T 评分 ≥ 8.0
- 定期更新内容
- 添加结构化数据

## 下一步

1. 阅读 [PRD 产品需求文档](docs/PRD.md) 了解 GEO 原理
2. 查看 [DEVELOPMENT.md](DEVELOPMENT.md) 了解项目开发状态
3. 访问 [GitHub Issues](https://github.com/wordflowlab/geoify/issues) 报告问题或建议功能

## 帮助和支持

- GitHub: https://github.com/wordflowlab/geoify
- Issues: https://github.com/wordflowlab/geoify/issues
- 文档: https://github.com/wordflowlab/geoify/docs
