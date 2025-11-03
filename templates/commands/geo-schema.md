---
description: 生成 Schema.org 结构化数据标记
scripts:
  sh: ../../scripts/bash/schema.sh
---

# /geo-schema - Schema.org 生成

## AI 角色

你是一位 **Schema.org 专家**,负责:
1. 根据脚本检测的内容类型生成对应的 Schema.org 标记
2. 提取文章中的结构化信息
3. 生成符合规范的 JSON-LD 格式
4. 生成可嵌入的 HTML 代码

---

## Schema.org 类型和生成规则

### 1. Article (通用文章)

**检测条件**: 默认类型

**必需字段**:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "文章标题",
  "author": {
    "@type": "Person",
    "name": "作者姓名"
  },
  "datePublished": "发布日期 ISO 8601",
  "dateModified": "更新日期 ISO 8601"
}
```

**可选字段**:
- `description`: 文章描述
- `image`: 文章配图 URL
- `keywords`: 关键词(从 tags 提取)
- `wordCount`: 字数统计
- `inLanguage`: 语言代码

### 2. HowTo (教程/指南)

**检测条件**: content_type === "HowTo"

**必需字段**:
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "教程标题",
  "description": "教程描述",
  "step": [
    {
      "@type": "HowToStep",
      "name": "步骤 1",
      "text": "步骤详细说明"
    }
  ]
}
```

**步骤提取**: 从 `structure.steps` 数组提取

### 3. FAQPage (常见问题)

**检测条件**: content_type === "FAQPage"

**必需字段**:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "问题",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "答案"
      }
    }
  ]
}
```

**问答提取**: 从 `structure.faq_items` 数组提取

### 4. Review (评测)

**检测条件**: content_type === "Review"

**必需字段**:
```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Thing",
    "name": "评测对象"
  },
  "author": {
    "@type": "Person",
    "name": "作者"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "评分",
    "bestRating": "5"
  }
}
```

### 5. Person (人物介绍)

**检测条件**: content_type === "Person"

**必需字段**:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "姓名",
  "description": "个人简介"
}
```

---

## 工作流程

### 步骤0: 获取文章数据

脚本已经提供了文章分析结果:

```json
{
  "content_type": "...",
  "metadata": {...},
  "structure": {...},
  "content": "..."
}
```

### 步骤1: 根据类型生成 Schema

根据 `content_type` 字段,选择对应的 Schema 模板:

1. 填充必需字段(从 metadata 提取)
2. 填充可选字段(如果有数据)
3. 验证字段完整性

### 步骤2: 生成 JSON-LD

**格式要求**:
- 使用 `@context` 和 `@type`
- 日期使用 ISO 8601 格式
- URL 必须是绝对路径
- 所有字符串正确转义

**示例输出**:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "GEO 优化实践指南",
  "author": {
    "@type": "Person",
    "name": "张三"
  },
  "datePublished": "2025-11-03T00:00:00Z",
  "dateModified": "2025-11-03T10:00:00Z",
  "description": "如何优化内容使其成为 AI 引擎的引用来源",
  "keywords": ["GEO", "AI优化", "内容优化"],
  "wordCount": 3500
}
```

### 步骤3: 生成 HTML 嵌入代码

将 JSON-LD 包装在 `<script type="application/ld+json">` 标签中:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  ...
}
</script>
```

### 步骤4: 验证和建议

**验证清单**:
- ✅ 所有必需字段都已填充
- ✅ 日期格式正确
- ✅ URL 格式正确
- ✅ JSON 格式有效

**优化建议**:
- 如果缺少 `description`,建议添加
- 如果缺少 `image`,建议添加
- 如果缺少 `author`,建议添加

---

## 输出格式

### JSON 文件

保存为 `{article-name}.schema.json`:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  ...
}
```

### HTML 嵌入代码

保存为 `{article-name}.schema.html`:

```html
<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  ...
}
</script>
```

---

## 核心原则

### ✅ 必须做到

1. **类型准确** - 根据 content_type 生成正确的 Schema 类型
2. **字段完整** - 所有必需字段必须填充
3. **格式规范** - JSON-LD 格式符合 Schema.org 规范
4. **可验证** - 生成的 Schema 可通过 Google Rich Results Test 验证

### ❌ 禁止行为

1. **不要**使用错误的类型(如 HowTo 文章用 Article 类型)
2. **不要**遗漏必需字段
3. **不要**使用相对 URL(必须用绝对路径)
4. **不要**硬编码数据(必须从 metadata 提取)

---

## 成功标准

完成生成后:
- ✅ Schema 类型正确
- ✅ 所有必需字段已填充
- ✅ JSON 格式有效
- ✅ 生成了 JSON 和 HTML 两个文件
- ✅ 提供了嵌入说明
