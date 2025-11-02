---
description: 跟踪内容在 AI 引擎中的引用情况
---

# GEO 引用跟踪

我将帮你监测内容在各大 AI 引擎中的引用情况。

⚠️ **注意**: 此功能需要定期手动测试 AI 平台,v0.2.0 将提供自动化跟踪。

## 跟踪目标

### 1. 目标 AI 平台
- ✅ ChatGPT (OpenAI)
- ✅ Perplexity (答案引擎)
- ✅ Claude (Anthropic)
- ✅ Gemini (Google)
- 文心一言 (百度)
- 通义千问 (阿里)

### 2. 跟踪指标
- **引用次数**: 被引用的频率
- **引用位置**: 首次引用 vs 补充引用
- **引用上下文**: 完整引用 vs 部分引用
- **竞争排名**: 与其他来源对比

## 跟踪方法

### 方法 1: 主动测试 (当前版本)

**步骤**:
1. 准备测试问题列表
2. 在各 AI 平台提问
3. 记录引用情况
4. 更新跟踪数据

**示例测试问题**:
```
"2024年最值得学习的编程语言是什么?"
"如何选择合适的项目管理工具?"
"Python 和 JavaScript 哪个更适合初学者?"
```

### 方法 2: 用户反馈收集

**设置**:
- 在文章底部添加反馈表单
- 询问:"你从 AI 引擎(ChatGPT/Perplexity 等)找到这篇文章吗?"
- 记录来源渠道

### 方法 3: 网站分析 (v0.2.0)

**计划功能**:
- 分析 Referrer 数据
- 识别来自 AI 平台的流量
- 自动生成引用报告

## 跟踪数据记录

我会在 `_tracking/` 目录创建跟踪记录:

```
_tracking/
└── [文章名称]/
    ├── tracking-log.json     # 引用记录
    ├── test-questions.md     # 测试问题列表
    └── citations-report.md   # 引用分析报告
```

### tracking-log.json 示例

```json
{
  "article": "2024年最值得学习的编程语言",
  "url": "https://example.com/articles/best-programming-languages-2024",
  "tracking_period": {
    "start": "2024-01-15",
    "last_updated": "2024-02-15"
  },
  "citations": [
    {
      "platform": "ChatGPT",
      "date": "2024-01-20",
      "query": "2024年最值得学习的编程语言",
      "cited": true,
      "position": "primary",
      "context": "完整引用",
      "screenshot": "_tracking/screenshots/chatgpt-2024-01-20.png"
    },
    {
      "platform": "Perplexity",
      "date": "2024-01-25",
      "query": "编程语言推荐 2024",
      "cited": true,
      "position": "supplementary",
      "context": "部分引用"
    }
  ],
  "summary": {
    "total_tests": 12,
    "citations_count": 8,
    "citation_rate": "66.7%",
    "platforms": {
      "ChatGPT": 3,
      "Perplexity": 4,
      "Claude": 1,
      "Gemini": 0
    }
  }
}
```

## 跟踪流程

### 第 1 步:设置跟踪
告诉我:
1. 要跟踪的文章 URL
2. 目标 AI 平台
3. 测试问题列表 (3-5 个)

### 第 2 步:执行测试
我会指导你:
1. 在各平台提问
2. 记录引用情况
3. 截图保存证据

### 第 3 步:分析结果
生成报告:
- 引用率统计
- 平台对比
- 优化建议

### 第 4 步:持续优化
根据数据:
- 调整内容策略
- 优化 E-E-A-T 得分
- 更新过时信息

## 预期效果

**优秀 GEO 内容的引用指标**:
- 引用率: 60%+
- 首次引用时间: 发布后 2-4 周
- 多平台引用: 3+ 平台
- 持续引用: 3+ 个月

---

**准备好了吗?** 请告诉我要跟踪的文章 URL 和测试问题,我们开始监测!
