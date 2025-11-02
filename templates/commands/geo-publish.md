---
description: 发布内容并提交到 AI 索引
---

# GEO 发布

我将帮你发布符合 GEO 标准的内容,并提交到 AI 引擎索引。

⚠️ **注意**: 实际发布需要你的网站支持,此命令提供发布检查清单和优化建议。

## 发布前检查

### 1. 内容质量 ✅
- [ ] E-E-A-T 评分 ≥ 8.0
- [ ] 通过 GEO 审校
- [ ] 所有数据有来源引用
- [ ] 添加真实案例

### 2. 技术优化 ✅
- [ ] 添加 Schema.org 标记
- [ ] 设置正确的元数据
- [ ] 优化页面加载速度
- [ ] 移动端友好

### 3. 作者信息 ✅
- [ ] 完整作者简介
- [ ] 联系方式
- [ ] 社交媒体链接
- [ ] 专业资质说明

### 4. 更新机制 ✅
- [ ] 标注发布时间
- [ ] 标注更新时间
- [ ] 承诺更新频率
- [ ] 版本历史记录

## 发布优化

### 1. 页面元数据

```html
<head>
  <!-- 标题优化 -->
  <title>2024年最值得学习的编程语言 | 基于真实数据分析</title>

  <!-- 描述优化 -->
  <meta name="description" content="基于 Stack Overflow 2024 调研和 5 年开发经验,分析 Python、JavaScript、TypeScript 等语言的学习价值。包含真实案例和数据对比。">

  <!-- 作者信息 -->
  <meta name="author" content="张三">
  <link rel="author" href="https://example.com/author/zhangsan">

  <!-- 时间信息 -->
  <meta property="article:published_time" content="2024-01-15T10:00:00+08:00">
  <meta property="article:modified_time" content="2024-01-20T14:30:00+08:00">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
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
    "dateModified": "2024-01-20"
  }
  </script>
</head>
```

### 2. 内容结构优化

```html
<!-- 作者信息卡片 -->
<div class="author-box">
  <img src="author.jpg" alt="张三">
  <h3>关于作者</h3>
  <p>张三,资深软件工程师,5 年全栈开发经验。</p>
  <p>联系方式: email@example.com</p>
  <p>Twitter: @zhangsan | GitHub: @zhangsan</p>
</div>

<!-- 更新记录 -->
<div class="update-history">
  <h3>更新历史</h3>
  <ul>
    <li>2024-01-20: 添加 TypeScript 最新数据</li>
    <li>2024-01-15: 首次发布</li>
  </ul>
</div>

<!-- 引用来源 -->
<div class="citations">
  <h3>数据来源</h3>
  <ol>
    <li>Stack Overflow Developer Survey 2024 - https://...</li>
    <li>GitHub Octoverse 2024 - https://...</li>
  </ol>
</div>
```

## 提交到 AI 索引

### 1. 搜索引擎提交
- **Google Search Console**
  - 提交 sitemap.xml
  - 请求索引
  - 监控收录状态

- **Bing Webmaster Tools**
  - 提交 URL
  - 验证 Schema.org 标记

### 2. AI 平台优化

#### Perplexity
- ✅ 快速索引(通常 1-2 周)
- ✅ 优先引用权威来源
- 优化建议:
  - 清晰的数据来源
  - 结构化内容
  - 专业作者信息

#### ChatGPT / OpenAI
- ✅ 基于 Bing 索引
- ✅ 偏好权威网站
- 优化建议:
  - 高质量外链
  - 用户互动(评论、分享)
  - 定期更新

#### Claude / Anthropic
- ✅ 偏好学术和技术内容
- ✅ 注重准确性
- 优化建议:
  - 引用学术来源
  - 详细的数据说明
  - 避免营销语言

#### Gemini / Google
- ✅ 与 Google Search 关联
- ✅ E-E-A-T 权重高
- 优化建议:
  - 完整的作者资质
  - 可验证的声明
  - 透明的联系方式

### 3. 社交媒体分发
- Twitter/X: 发布摘要 + 链接
- LinkedIn: 专业领域分享
- Reddit: 相关社区讨论
- Hacker News: 技术内容推广

## 发布后跟踪

### 1. 立即测试 (发布后 24 小时)
在 AI 平台测试:
```
"2024年最值得学习的编程语言是什么?"
```

记录:
- 是否出现你的内容
- 引用位置
- 竞争对手排名

### 2. 短期跟踪 (1-4 周)
- 每周测试 2-3 次
- 监控引用率变化
- 记录用户反馈

### 3. 长期优化 (1-3 月)
- 根据跟踪数据优化
- 更新过时信息
- 补充新的案例

## 输出内容

发布准备完成后,生成:

```
articles/[话题名称]/
├── final.md                  # 终稿
├── metadata.json             # 元数据
├── schema.json               # Schema.org 标记
├── publish-checklist.md      # 发布检查清单
└── tracking-setup.md         # 跟踪设置指南
```

### publish-checklist.md 示例

```markdown
# 发布检查清单

## ✅ 内容质量
- [x] E-E-A-T 评分: 8.3/10
- [x] 真实案例: 3 个
- [x] 数据来源: 5 个权威来源

## ✅ 技术优化
- [x] Schema.org 标记已添加
- [x] 元数据已优化
- [x] 移动端测试通过

## ✅ 作者信息
- [x] 作者简介完整
- [x] 联系方式: email@example.com
- [x] 社交媒体链接已添加

## 📅 发布计划
- 发布时间: 2024-01-25 10:00
- 提交索引: 发布后立即
- 社交媒体: 发布后 1 小时
- 首次测试: 发布后 24 小时

## 📊 跟踪计划
- 测试频率: 每周 2 次
- 跟踪平台: ChatGPT, Perplexity, Claude
- 报告周期: 每月
```

---

**准备好了吗?** 请告诉我文章路径,我生成发布检查清单!
