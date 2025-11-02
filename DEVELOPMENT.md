# Geoify 开发文档

## 项目状态

**当前版本**: v0.1.0-alpha
**开发阶段**: MVP 实施中

## 已完成功能

### ✅ 核心 CLI 工具 (v0.1.0)

#### 1. 项目初始化
- `geoify init [name]` - 初始化新项目
- `--here` - 在当前目录初始化
- `--ai <platform>` - 指定 AI 平台 (默认 claude)
- `--all` - 生成所有 AI 平台配置

#### 2. 目录结构
自动创建完整的 GEO 项目结构:
```
project/
├── .geoify/          # 配置文件
├── .claude/          # Claude Code 命令
├── .gemini/          # Gemini CLI 命令
├── .cursor/          # Cursor 命令
├── _analysis/        # GEO 分析报告
├── _tracking/        # AI 引用跟踪
├── _knowledge_base/  # 调研资料
├── _briefs/          # 内容简报
├── materials/        # 素材库
│   ├── raw/
│   ├── indexed/
│   └── archive/
├── profile/          # 内容配置
│   └── schema/       # Schema.org 标记
└── articles/         # 文章输出
```

#### 3. 斜杠命令系统
已创建 9 个核心命令模板:

**GEO 工作流命令**:
1. `/geo-analyze` - 分析目标话题的 GEO 现状
2. `/specify` - 定义内容目标和 E-E-A-T 要求
3. `/research` - 研究竞争对手和权威来源
4. `/collect` - 收集真实数据和案例
5. `/geo-write` - 生成符合 E-E-A-T 标准的内容
6. `/geo-review` - GEO 专项审校
7. `/geo-schema` - 生成结构化数据标记
8. `/geo-publish` - 发布并提交到 AI 索引
9. `/geo-track` - 跟踪 AI 引用情况

**多平台支持**:
- Claude Code: `/geo.analyze`
- Gemini CLI: `/geo:analyze`
- Cursor/其他: `/geo-analyze`

#### 4. 配置文件
自动生成 `.geoify/config.json`:
```json
{
  "name": "项目名称",
  "version": "0.1.0",
  "eeat": {
    "target": {
      "experience": 8,
      "expertise": 8,
      "authoritativeness": 8,
      "trustworthiness": 9
    }
  },
  "aiPlatforms": {
    "chatgpt": { "enabled": true, "priority": "high" },
    "perplexity": { "enabled": true, "priority": "high" }
  }
}
```

## 技术架构

### 技术栈
- **语言**: TypeScript (ES2022)
- **CLI 框架**: Commander.js
- **文件操作**: fs-extra
- **交互界面**: inquirer, ora, chalk
- **包管理**: npm

### 项目结构
```
geoify/
├── src/
│   ├── cli.ts              # CLI 入口
│   └── commands/
│       └── init.ts         # init 命令实现
├── templates/
│   └── commands/           # 命令模板
│       ├── geo-analyze.md
│       ├── geo-write.md
│       └── ...
├── scripts/
│   └── build/
│       └── generate-commands.sh  # 命令生成脚本
├── dist/                   # 编译输出
├── docs/
│   └── PRD.md             # 产品需求文档
├── package.json
├── tsconfig.json
└── README.md
```

### 构建流程
```bash
npm run build        # TypeScript 编译
npm run dev          # 开发模式运行
npm test            # 运行测试 (待实现)
```

## 测试验证

### 已验证功能
- ✅ 基础项目初始化
- ✅ 单平台命令生成 (`--ai claude`)
- ✅ 多平台命令生成 (`--all`)
- ✅ 命令名称转换 (Claude: `.`, Gemini: `:`, 其他: `-`)
- ✅ 配置文件生成
- ✅ 目录结构创建

### 测试命令
```bash
# 测试单平台初始化
geoify init my-project --ai claude

# 测试多平台初始化
geoify init my-project --all

# 测试当前目录初始化
geoify init . --here
```

## 待实现功能

### v0.1.0 (MVP) - 剩余任务

#### 1. E-E-A-T 评分系统
- [ ] 实现内容评分算法
- [ ] 创建评分报告生成器
- [ ] 集成到 `/geo-review` 命令

#### 2. 命令实现
当前命令只是模板,需要实现具体功能:
- [ ] `/geo-analyze` - AI 引用分析功能
- [ ] `/geo-review` - E-E-A-T 评分实现
- [ ] `/geo-schema` - Schema.org 生成器
- [ ] `/geo-track` - 引用跟踪功能

#### 3. 文档和测试
- [ ] 编写使用文档
- [ ] 添加单元测试
- [ ] 创建示例项目

### v0.2.0 (Beta) - 计划功能

#### 1. AI 引用跟踪
- [ ] 自动化跟踪系统
- [ ] 数据可视化
- [ ] 引用报告生成

#### 2. 竞争分析
- [ ] 竞争对手识别
- [ ] 内容缺口分析
- [ ] GEO 机会建议

#### 3. 命令优化
- [ ] `/geo-analyze` 自动化分析
- [ ] `/geo-track` 自动化跟踪
- [ ] 集成 AI API (可选)

### v0.3.0 (正式版) - 高级功能

- [ ] API 集成
- [ ] 数据看板
- [ ] 多行业模板
- [ ] Chrome 扩展 (引用验证)

## 开发指南

### 添加新命令

1. 在 `templates/commands/` 创建 Markdown 模板:
```markdown
---
description: 命令描述
---

# 命令标题

命令内容...
```

2. 在 `src/commands/init.ts` 的 `commands` 数组中添加命令名:
```typescript
const commands = [
  'geo-analyze',
  'new-command',  // 新命令
  // ...
]
```

3. 重新构建:
```bash
npm run build
```

### 添加 AI 平台支持

在 `src/commands/init.ts` 的 `createPlatformCommands` 函数中添加平台逻辑:
```typescript
if (platform === 'new-platform') {
  cmdName = cmd.replace(/-/g, '_')  // 自定义分隔符
}
```

## 问题和解决方案

### 1. ES Modules 中的 __dirname
**问题**: ES modules 不支持 `__dirname`
**解决**:
```typescript
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
```

### 2. TypeScript 类型定义
**问题**: fs-extra, inquirer 缺少类型定义
**解决**:
```bash
npm install --save-dev @types/fs-extra @types/inquirer @types/js-yaml
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 相关资源

- [PRD 产品需求文档](docs/PRD.md)
- [GEO 论文](https://arxiv.org/abs/2311.09735)
- [scriptify 项目](https://github.com/wordflowlab/scriptify)
- [E-E-A-T 指南](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

## 许可证

MIT License
