# Changelog

本文档记录 Geoify 的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 计划中
- AI 引用跟踪功能 (`/geo-track`) - v0.2.0
- 竞争分析功能 (`/geo-analyze`) - v0.2.0
- 多语言支持(英文、日文) - v0.3.0
- Web 可视化看板 - v0.3.0

## [0.1.0] - 2025-11-02

### 重要里程碑 🎉

**v0.1.0 正式版发布** - GEO (Generative Engine Optimization) MVP 版本

这是 Geoify 的第一个正式版本,包含完整的 E-E-A-T 评分系统和 Schema.org 生成功能。

### 核心功能

1. **E-E-A-T 评分系统** ✅
   - 4 个评分维度,16 个检查项
   - 智能内容分析和建议
   - JSON + Markdown 双格式报告

2. **Schema.org 生成** ✅
   - 自动内容类型检测
   - 完整元数据提取
   - JSON-LD + HTML 双格式输出

3. **CLI 工具** ✅
   - `geoify init` - 项目初始化
   - `geoify review` - E-E-A-T 审校
   - `geoify schema` - Schema.org 生成

### 文档和示例

- ✅ 完整工作流示例(examples/complete-workflow/)
- ✅ 5 分钟快速入门指南(QUICKSTART.md)
- ✅ 高分文章范例(9.7/10)
- ✅ 深度分析文档(ANALYSIS.md)
- ✅ 更新日志(CHANGELOG.md)

### 测试验证

- ✅ E-E-A-T 评分测试(示例文章得分 9.7/10)
- ✅ Schema.org 生成测试(自动检测为 HowTo)
- ✅ CLI 命令功能测试

### 已知限制

- 仅支持中文内容分析
- 暂无 AI 引用跟踪功能
- 暂无可视化看板

### 升级说明

从 alpha 版本升级:

```bash
npm install -g geoify
```

无破坏性变更,所有 alpha 版本的功能保持兼容。

## [0.1.0-alpha.3] - 2025-11-02

### 新增
- **Schema.org 生成系统**
  - 自动检测内容类型(Article, HowTo, Review, FAQ, Person)
  - 完整的元数据提取(作者、日期、关键词等)
  - 自动提取引用信息
  - JSON-LD 和 HTML 双格式输出
  - Schema 验证功能
- **CLI 命令**: `geoify schema`
  - 支持自定义文章 URL、网站名称、Logo
  - 支持自定义输出目录和格式
  - 支持语言代码配置

### 文档
- 添加 Schema 命令使用说明到 README.md
- 更新路线图状态

### 修复
- 修复 GitHub URL 提取时重复添加 https:// 的问题

## [0.1.0-alpha.2] - 2025-11-02

### 新增
- **E-E-A-T 审校命令** (`geoify review`)
  - 3 遍审校流程(事实核查 → 评分 → 格式优化)
  - 彩色终端输出,提升用户体验
  - 详细的维度评分和建议
  - 自动生成 JSON 和 Markdown 报告
  - 支持自定义目标分数
- **审校报告**
  - JSON 格式:包含完整评分数据
  - Markdown 格式:可读性强的详细报告

### 改进
- 优化 CLI 参数命名(`--target-experience` 等)
- 添加 emoji 和颜色,提升报告可读性
- 改进建议的优先级排序算法

### 文档
- 添加 review 命令使用示例到 README.md
- 更新 CLI 命令列表

### 技术优化
- 修复 TypeScript `this` 隐式 any 类型错误
- 将辅助函数移到函数外部,提升代码质量

## [0.1.0-alpha.1] - 2025-11-02

### 新增
- **E-E-A-T 评分系统**
  - 4 个评分维度:Experience, Expertise, Authoritativeness, Trustworthiness
  - 每个维度 4 个检查项
  - 加权平均算法
  - 详细的评分细节和建议
- **内容分析器**
  - 字数统计
  - 第一人称检测
  - 具体细节识别
  - 模糊词汇检测
  - 引用提取
  - 代码块统计
- **评分规则模块**
  - `experience-rules.ts` - 体验维度
  - `expertise-rules.ts` - 专业性维度
  - `authoritativeness-rules.ts` - 权威性维度
  - `trustworthiness-rules.ts` - 可信度维度
- **报告生成器**
  - JSON 格式报告
  - Markdown 格式报告
  - 优化建议按优先级排序

### 基础设施
- 项目初始化
- TypeScript + ES2022 模块配置
- CLI 框架(Commander.js)
- `geoify init` 命令
- npm 包发布配置
- MIT 许可证

### 文档
- README.md - 项目介绍和快速开始
- USAGE.md - 详细使用手册
- 实施计划(已完成,已移除)

### 依赖
- `gray-matter` - Markdown frontmatter 解析
- `chalk` - 终端颜色输出
- `ora` - 终端 spinner
- `inquirer` - 交互式命令行
- `fs-extra` - 文件系统增强
- `js-yaml` - YAML 解析

## [0.0.1] - 初始版本

### 新增
- 项目结构
- 基础 CLI 框架
- `geoify init` 命令

---

## 版本说明

### Alpha 版本 (0.1.0-alpha.x)
- 核心功能开发中
- API 可能变更
- 仅供测试使用

### Beta 版本 (0.2.0-beta.x)
- 功能基本完整
- API 趋于稳定
- 广泛测试阶段

### 正式版本 (1.0.0+)
- 功能完整
- API 稳定
- 生产环境可用

---

## 升级指南

### 从 0.1.0-alpha.2 升级到 0.1.0-alpha.3

无破坏性变更,直接升级:

```bash
npm install -g geoify@alpha
```

新功能:
- 使用 `geoify schema` 命令生成 Schema.org 标记

### 从 0.1.0-alpha.1 升级到 0.1.0-alpha.2

无破坏性变更,直接升级:

```bash
npm install -g geoify@alpha
```

新功能:
- 使用 `geoify review` 命令进行 E-E-A-T 审校

---

## 贡献

欢迎贡献代码或报告问题:
- GitHub Issues: https://github.com/wordflowlab/geoify/issues
- Pull Requests: https://github.com/wordflowlab/geoify/pulls

---

[Unreleased]: https://github.com/wordflowlab/geoify/compare/v0.1.0-alpha.3...HEAD
[0.1.0-alpha.3]: https://github.com/wordflowlab/geoify/compare/v0.1.0-alpha.2...v0.1.0-alpha.3
[0.1.0-alpha.2]: https://github.com/wordflowlab/geoify/compare/v0.1.0-alpha.1...v0.1.0-alpha.2
[0.1.0-alpha.1]: https://github.com/wordflowlab/geoify/releases/tag/v0.1.0-alpha.1
