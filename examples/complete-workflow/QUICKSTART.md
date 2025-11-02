# 5 分钟快速入门 Geoify

## 目标

在 5 分钟内体验 Geoify 的核心功能:
1. ✅ 评估一篇文章的 E-E-A-T 分数
2. ✅ 获得优化建议
3. ✅ 生成 Schema.org 标记

## 前置条件

```bash
# 安装 Node.js 18+
node --version  # 确保 >= 18.0.0

# 安装 Geoify
npm install -g geoify@alpha
```

## 步骤 1: 下载示例文章 (30 秒)

```bash
# 创建工作目录
mkdir my-geoify-test
cd my-geoify-test

# 下载示例文章
curl -o draft.md https://raw.githubusercontent.com/wordflowlab/geoify/main/examples/complete-workflow/draft.md
```

或者手动创建一个简单的 Markdown 文件:

```markdown
---
title: 我的技术分享
author: 张三
jobTitle: 软件工程师
email: zhangsan@example.com
date: 2024-01-15
---

# 我的技术分享

## 我的经历

我在过去 3 年的工作中,使用 Python 开发了多个数据分析项目...

[1] Python 官方文档 - https://docs.python.org/
```

## 步骤 2: 运行 E-E-A-T 审校 (1 分钟)

```bash
geoify review draft.md
```

**输出示例**:

```
==================================================
  E-E-A-T 评分结果
==================================================

总分: 6.8/10 ⚠️

各维度得分:
  Experience:         7.2/10
  Expertise:          6.5/10
  Authoritativeness:  5.8/10 ⚠️
  Trustworthiness:    7.5/10

🔥 高优先级建议 (2):
  • 添加更多权威来源引用
  • 增加技术细节和代码示例
```

## 步骤 3: 查看详细报告 (1 分钟)

```bash
# 查看 Markdown 报告
cat draft-review-report.md

# 或查看 JSON 数据
cat draft-eeat-score.json
```

**报告内容**:
- ✅ 4 个维度的详细评分
- ✅ 每个维度的检查项通过情况
- ✅ 按优先级排序的优化建议
- ✅ 下一步行动指南

## 步骤 4: 生成 Schema.org 标记 (1 分钟)

```bash
geoify schema draft.md \
  --url "https://example.com/my-article" \
  --site-name "我的博客"
```

**输出示例**:

```
==================================================
  Schema.org 生成结果
==================================================

内容类型: ARTICLE
Schema 类型: Article

✓ JSON 文件: draft-schema.json
✓ HTML 标签: draft-schema.html

📋 Schema 信息:
  标题: 我的技术分享
  作者: 张三
  发布: 2024/1/15
```

## 步骤 5: 使用生成的 Schema (1 分钟)

### 方式 1: 复制 HTML 标签

```bash
cat draft-schema.html
```

将输出的 `<script type="application/ld+json">` 标签复制到网页的 `<head>` 中。

### 方式 2: 使用 JSON-LD

```bash
cat draft-schema.json
```

将 JSON 内容嵌入到网页中。

## 下一步

### 选项 A: 优化文章(推荐)

根据审校报告的建议,优化你的文章:

1. **提升体验分数**:
   - 添加更多第一人称经历
   - 增加具体的时间、数字、案例

2. **提升专业性**:
   - 添加代码示例
   - 增加技术深度
   - 提供独特见解

3. **提升权威性**:
   - 引用 5-10 个权威来源
   - 添加作者资质信息
   - 增加外部链接

4. **提升可信度**:
   - 为所有数据添加来源
   - 添加联系方式
   - 标注发布和更新时间

### 选项 B: 使用完整工作流

```bash
# 1. 初始化新项目
geoify init my-article

# 2. 进入项目目录
cd my-article

# 3. 在 articles/ 下撰写文章

# 4. 审校文章
geoify review articles/001-topic/draft.md

# 5. 优化后再次审校
geoify review articles/001-topic/final.md

# 6. 生成 Schema
geoify schema articles/001-topic/final.md \
  --url "https://example.com/topic"

# 7. 发布到网站
```

### 选项 C: 查看完整示例

```bash
# 克隆 Geoify 仓库
git clone https://github.com/wordflowlab/geoify.git

# 查看完整示例
cd geoify/examples/complete-workflow
cat README.md        # 完整工作流说明
cat draft.md         # 高分示例文章(9.7/10)
cat ANALYSIS.md      # 深度分析报告
```

## 常见问题

### Q: 我的分数只有 5-6 分,怎么办?

**A**: 检查以下几点:
1. 是否使用第一人称分享真实经历?
2. 是否包含具体的数据和案例?
3. 是否引用了权威来源?
4. frontmatter 中是否填写了完整信息?

### Q: 什么样的分数才算好?

**A**: 参考标准:
- **8.5-10 分**: 优秀,AI 引用概率 75%+
- **7.0-8.4 分**: 良好,AI 引用概率 50-75%
- **6.0-6.9 分**: 及格,AI 引用概率 30-50%
- **< 6.0 分**: 需要优化,AI 引用概率 < 30%

### Q: 生成的 Schema 如何验证?

**A**: 使用 Google 工具验证:
1. 访问 [Google Rich Results Test](https://search.google.com/test/rich-results)
2. 粘贴你的文章 URL 或 Schema 代码
3. 查看验证结果

### Q: 多久能看到 AI 引用效果?

**A**: 时间线参考:
- **Perplexity**: 2-4 周
- **ChatGPT**: 4-6 周
- **Claude**: 4-6 周
- **长期效果**: 6 个月内累计 500-1000 次引用

### Q: 我可以批量处理多篇文章吗?

**A**: 可以使用脚本:
```bash
#!/bin/bash
for file in articles/**/*.md; do
  echo "处理: $file"
  geoify review "$file"
  geoify schema "$file" --url "https://example.com/$(basename $file .md)"
done
```

## 设置目标分数

如果你想要更高的标准:

```bash
geoify review draft.md \
  --target-experience 9 \
  --target-expertise 9 \
  --target-authoritativeness 9 \
  --target-trustworthiness 10
```

报告会标注未达标的项目。

## 自定义输出格式

```bash
# 只生成 JSON Schema
geoify schema draft.md --format json

# 只生成 HTML 标签
geoify schema draft.md --format html

# 同时生成(默认)
geoify schema draft.md --format both
```

## 指定输出目录

```bash
# 将报告和 Schema 保存到指定目录
geoify review draft.md
geoify schema draft.md --output ./schema-output/
```

---

## 下一步学习资源

1. **完整示例**: [examples/complete-workflow/](https://github.com/wordflowlab/geoify/tree/main/examples/complete-workflow)
2. **使用手册**: [USAGE.md](https://github.com/wordflowlab/geoify/blob/main/USAGE.md)
3. **PRD 文档**: [docs/PRD.md](https://github.com/wordflowlab/geoify/blob/main/docs/PRD.md)
4. **GitHub 仓库**: https://github.com/wordflowlab/geoify

---

**恭喜!你已经完成了 Geoify 的快速入门。** 🎉

现在开始优化你的内容,让它成为 AI 时代的权威来源吧! ✨
