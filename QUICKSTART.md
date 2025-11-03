# Geoify 10 分钟快速体验

## 目标

10 分钟内体验完整的 GEO 优化流程,从分析到发布。

## 前置准备 (1 分钟)

### 1. 安装 Geoify

```bash
npm install -g geoify
```

### 2. 初始化项目

```bash
# 创建项目
geoify init my-geoify-test
cd my-geoify-test

# 在 AI 助手中打开项目
# Claude Code / Cursor / Windsurf / Gemini 等
```

---

## 完整流程 (9 步)

### 步骤 1: GEO 分析 (2 分钟)

**在 AI 助手中运行**:
```
/geo.analyze
```

**输入**: 告诉 AI 你要分析的话题
- 例如: "如何学习 Rust 语言"
- 例如: "2024年最佳项目管理工具"

**输出**: `_analysis/[话题]-geo-analysis.md`

**完成标志**:
- ✅ 看到"分析完成"
- ✅ 报告包含 AI 引用现状
- ✅ 列出了 Top 5 竞争对手
- ✅ 识别出内容缺口

---

### 步骤 2: 定义目标 (2 分钟)

**命令**: `/geo.specify`

**输入**: 回答 AI 的问题
- 你的作者信息 (姓名、职位、资质)
- 目标受众定义
- 你拥有的真实数据/案例

**输出**: `profile/content-spec.json`

**完成标志**:
- ✅ 生成了配置文件
- ✅ 包含 E-E-A-T 目标分数
- ✅ 包含作者资质

---

### 步骤 3: 竞争研究 (可选,2 分钟)

**命令**: `/geo.research`

**输入**: 确认要研究的话题

**输出**: `_knowledge_base/[话题]/competitors-analysis.md`

**完成标志**:
- ✅ Top 5-10 竞争对手分析
- ✅ 权威来源列表
- ✅ 内容缺口识别

**提示**: 如果时间紧张,可以跳过此步,直接到步骤 4

---

### 步骤 4: 收集素材 (2 分钟)

**命令**: `/geo.collect`

**输入**: 提供你的真实数据和案例
- 你的亲身经历
- 项目案例和数据
- 权威来源引用

**输出**: `materials/indexed/[话题]/sources.json`

**完成标志**:
- ✅ 素材库已建立
- ✅ 真实数据已收集
- ✅ 引用来源已整理

---

### 步骤 5: 生成内容 (2 分钟)

**命令**: `/geo.write`

**输入**: 选择写作模式 (推荐模式 2: 教练模式)

**输出**: `articles/001-[话题]/draft.md`

**完成标志**:
- ✅ 生成完整的文章草稿
- ✅ 基于真实素材
- ✅ 符合 E-E-A-T 结构

---

### 步骤 6: GEO 审校 (1 分钟)

**在终端运行**:
```bash
geoify review articles/001-[话题]/draft.md
```

**输出**:
- E-E-A-T 评分报告 (总分和 4 个维度)
- `draft-review-report.md`
- `draft-eeat-score.json`

**完成标志**:
- ✅ 看到总分 (目标 ≥ 8.5/10)
- ✅ 获得优化建议

**如果分数 < 8.5**:
根据建议修改文章,重新运行 review

---

### 步骤 7: 生成 Schema (< 1 分钟)

**在终端运行**:
```bash
geoify schema articles/001-[话题]/draft.md \
  --url "https://你的网站/文章URL" \
  --site-name "你的网站名称"
```

**输出**:
- `draft-schema.json` - JSON-LD 格式
- `draft-schema.html` - HTML 标签格式

**完成标志**:
- ✅ 生成两个文件
- ✅ 包含完整的 Schema.org 标记

---

### 步骤 8: 发布准备 (2 分钟)

**命令**: `/geo.publish`

**输入**: 文章路径

**输出**: 发布检查清单 `articles/001-[话题]/publish-checklist.md`

**完成标志**:
- ✅ SEO 检查清单完成
- ✅ Schema 标记已验证
- ✅ 发布计划已制定

---

### 步骤 9: 跟踪引用 (发布 2-4 周后)

**命令**: `/geo.track`

**输入**: 文章 URL 和测试问题

**输出**: `_tracking/[话题]/tracking-report.md`

**完成标志**:
- ✅ 测试了 3+ AI 平台
- ✅ 记录了引用情况
- ✅ 获得了优化建议

---

## 完成!你已经:

- ✅ 分析了 GEO 机会
- ✅ 生成了高质量内容
- ✅ 获得了 E-E-A-T 评分 (目标 ≥ 8.5/10)
- ✅ 生成了 Schema.org 标记
- ✅ 准备好发布和跟踪

---

## 快速参考:完整命令列表

### AI 助手命令 (在 Claude Code / Cursor 等中使用)

```
/geo.analyze   - 分析 GEO 现状和机会
/geo.specify   - 定义内容目标
/geo.research  - 研究竞争对手 (可选)
/geo.collect   - 收集真实素材
/geo.write     - 生成内容草稿
/geo.publish   - 发布准备
/geo.track     - 跟踪 AI 引用
```

### CLI 命令 (在终端中使用)

```bash
geoify init [项目名]          # 初始化项目
geoify review [文章路径]       # E-E-A-T 评分
geoify schema [文章路径]       # 生成 Schema.org
```

---

## 评分标准参考

| 总分 | 评级 | AI 引用概率 | 行动 |
|------|------|-----------|------|
| **9.0-10** | 优秀 | 80-95% | 发布! |
| **8.5-8.9** | 良好 | 70-80% | 发布! |
| **8.0-8.4** | 及格 | 60-70% | 可发布,建议优化 |
| **7.0-7.9** | 需优化 | 45-60% | 建议优化后发布 |
| **< 7.0** | 不达标 | < 45% | 必须优化 |

---

## 常见问题

### Q: 我的分数只有 6.5,怎么办?

**A**: 检查以下几点:
1. 是否使用第一人称分享真实经历?
2. 是否包含具体的数据和案例?
3. 是否引用了 5+ 权威来源?
4. frontmatter 中是否填写了完整的作者信息?

根据 review 报告的建议,重点优化分数最低的维度。

### Q: 我可以跳过某些步骤吗?

**A**: 可以,但不推荐:
- **可以跳过**: `geo.research` (如果已有调研)
- **不建议跳过**: `geo.analyze`, `geo.specify`, `geo.collect`, `geo.review`
- **必须执行**: `geo.write`, `geoify review`, `geoify schema`

### Q: 生成的内容需要手动修改吗?

**A**: 需要!AI 生成的是草稿,你应该:
1. 检查事实准确性
2. 添加更多个人见解
3. 补充具体案例和数据
4. 调整语气和风格

### Q: 多久能看到 AI 引用效果?

**A**: 时间线参考:
- **Perplexity**: 2-4 周
- **ChatGPT**: 4-6 周
- **Claude**: 4-6 周
- **长期效果**: 6 个月内累计 500-1000 次引用 (8.5+ 分内容)

### Q: 可以批量处理多篇文章吗?

**A**: CLI 命令支持批量处理:

```bash
#!/bin/bash
for file in articles/**/*.md; do
  echo "处理: $file"
  geoify review "$file"
  geoify schema "$file" --url "https://example.com/$(basename $file .md)"
done
```

---

## 下一步学习资源

1. **完整使用手册**: [USAGE.md](USAGE.md) - 详细的使用说明
2. **E-E-A-T 原则**: [README.md#eeat-原则](README.md#eeat-原则)
3. **更新日志**: [CHANGELOG.md](CHANGELOG.md) - 版本变更记录
4. **GitHub 仓库**: https://github.com/wordflowlab/geoify

---

**开始创作高质量 GEO 内容!** ✨
