---
description: 生成 Schema.org 结构化数据标记
---

# GEO Schema 生成

我将为你的内容生成 Schema.org 结构化数据标记,帮助 AI 引擎更好地理解和引用你的内容。

## Schema.org 是什么?

结构化数据是一种标准化格式,用于向搜索引擎和 AI 引擎明确描述你的内容:
- 文章类型
- 作者信息
- 发布时间
- 引用来源
- 评分数据

## 支持的内容类型

### 1. Article (文章)
适用于:博客文章、新闻报道、研究报告

**包含信息**:
- 标题、作者、发布时间
- 文章摘要
- 引用来源
- 更新历史

### 2. HowTo (教程)
适用于:操作指南、教程、步骤说明

**包含信息**:
- 步骤列表
- 所需工具/材料
- 预计时间
- 难度级别

### 3. Review (评测)
适用于:产品评测、服务评价、对比分析

**包含信息**:
- 评测对象
- 评分(1-5 星)
- 优缺点
- 推荐指数

### 4. FAQPage (常见问题)
适用于:问答、FAQ、知识库

**包含信息**:
- 问题列表
- 详细答案
- 相关链接

### 5. Person (作者信息)
适用于:个人简介、专家资质

**包含信息**:
- 姓名、职位
- 专业领域
- 联系方式
- 社交媒体

## 生成流程

### 第 1 步:分析内容类型
我会读取你的文章,自动识别最适合的 Schema 类型

### 第 2 步:提取关键信息
从文章中提取:
- 元数据(标题、作者、时间)
- 结构化内容(步骤、问答、评分)
- 引用来源

### 第 3 步:生成 JSON-LD
生成符合 Schema.org 标准的 JSON-LD 代码

### 第 4 步:验证与优化
- 使用 Google Rich Results Test 验证
- 优化以提高 AI 引用概率

## 输出内容

```
profile/schema/
└── [文章名称]-schema.json
```

### 示例:Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "2024年最值得学习的编程语言",
  "author": {
    "@type": "Person",
    "name": "张三",
    "jobTitle": "资深工程师",
    "url": "https://example.com/author/zhangsan"
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20",
  "description": "基于真实数据分析...",
  "citation": [
    {
      "@type": "CreativeWork",
      "name": "Stack Overflow Developer Survey 2024",
      "url": "https://survey.stackoverflow.co/2024"
    }
  ]
}
```

## 如何使用

将生成的 JSON-LD 代码添加到 HTML 页面的 `<head>` 部分:

```html
<script type="application/ld+json">
{生成的 JSON 代码}
</script>
```

---

**准备好了吗?** 请告诉我要生成 Schema 的文章路径,我们开始!
