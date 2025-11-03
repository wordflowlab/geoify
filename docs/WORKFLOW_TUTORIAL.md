# 完整工作流教程

## 目录

- [工作流概览](#工作流概览)
- [阶段 1: 项目初始化](#阶段-1-项目初始化)
- [阶段 2: 话题分析](#阶段-2-话题分析)
- [阶段 3: 素材收集](#阶段-3-素材收集)
- [阶段 4: 内容创作](#阶段-4-内容创作)
- [阶段 5: E-E-A-T 审校](#阶段-5-e-e-a-t-审校)
- [阶段 6: 结构化数据](#阶段-6-结构化数据)
- [阶段 7: llms.txt 生成](#阶段-7-llmstxt-生成)
- [阶段 8: 发布和优化](#阶段-8-发布和优化)
- [阶段 9: 跟踪和迭代](#阶段-9-跟踪和迭代)

---

## 工作流概览

### 9 步 GEO 优化流程

```
1. 项目初始化 (10 min)
   ↓
2. 话题分析 (30 min)
   ↓
3. 素材收集 (2-3 hours)
   ↓
4. 内容创作 (4-6 hours)
   ↓
5. E-E-A-T 审校 (1 hour)
   ↓
6. 结构化数据 (30 min)
   ↓
7. llms.txt 生成 (15 min)
   ↓
8. 发布和优化 (30 min)
   ↓
9. 跟踪和迭代 (持续)
```

**总耗时**: 约 2-3 天(分散进行)
**目标**: 产出 E-E-A-T 9+ 分的高质量 GEO 内容

---

## 阶段 1: 项目初始化

### 目标

创建标准化的项目结构,准备工作环境。

### 操作步骤

#### 1. 安装 Geoify

```bash
npm install -g geoify
```

#### 2. 初始化项目

```bash
# 创建新项目
geoify init rust-learning-guide
cd rust-learning-guide
```

#### 3. 检查项目结构

```bash
tree -L 2
```

**输出**:
```
rust-learning-guide/
├── .geoify/
│   ├── config.yaml
│   └── templates/
├── materials/
│   ├── raw/
│   ├── indexed/
│   └── archive/
├── profile/
│   └── author.yaml
├── articles/
│   └── 001-rust-guide/
└── README.md
```

#### 4. 配置作者信息

编辑 `profile/author.yaml`:

```yaml
name: "张华"
job_title: "高级软件工程师"
company: "XX 科技"
bio: "6 年后端开发经验,2 年 Rust 实践"
contact:
  email: "zhanghua@example.com"
  github: "https://github.com/zhanghua"
  twitter: "@zhanghua_dev"
skills:
  - Rust
  - 系统编程
  - Web 开发
  - 性能优化
```

---

## 阶段 2: 话题分析

### 目标

分析目标话题的 GEO 现状,确定内容方向。

### 使用斜杠命令(在 AI 助手中)

```
/geo-analyze
```

**提示词**(如果手动执行):

```
请帮我分析"Rust 学习"这个话题的 GEO 现状:

1. 当前 AI 引擎(ChatGPT/Perplexity)如何回答这个话题?
2. 哪些网站被引用最多?
3. 这些内容的共同特点是什么?
4. 还有哪些未被充分覆盖的角度?
5. 我应该从什么角度切入?

我的背景:
- 前端工程师转 Rust
- 2 年实践经验
- 做过 3 个真实项目
```

### 分析输出示例

```markdown
# Rust 学习话题 GEO 分析

## 当前引用情况

### ChatGPT 主要引用源
1. 官方文档(The Rust Book) - 80% 引用率
2. Stack Overflow 讨论 - 60%
3. Mozilla Blog - 40%

### 内容特点
- ✅ 官方文档权威但偏理论
- ✅ Stack Overflow 实用但碎片化
- ❌ 缺少完整的实战经验分享
- ❌ 很少有从其他语言转过来的视角

## 内容机会

### 未被充分覆盖的角度
1. **前端工程师视角** - 大部分是后端/系统工程师
2. **完整项目实战** - 大多是代码片段
3. **性能对比数据** - 缺少实测数据
4. **踩坑经验** - 很少分享失败案例

### 推荐切入点
**"前端工程师的 Rust 实战之旅"**
- 分享从 JavaScript/TypeScript 到 Rust 的转变
- 3 个完整项目:CLI 工具、WASM、Web 服务
- 真实性能对比数据
- 详细的踩坑经验
```

### 记录到文件

```bash
# 保存分析结果
mkdir -p _analysis
cat > _analysis/topic-analysis.md
```

---

## 阶段 3: 素材收集

### 目标

收集真实数据、案例、引用来源。

### 3.1 收集个人经历

创建 `materials/raw/my-journey.md`:

```markdown
# 我的 Rust 学习历程

## 时间线

### 2022年3月
- 背景:在 Python 项目中遇到性能瓶颈
- 行动:开始学习 Rust
- 学习资源:The Rust Book 前 5 章
- 感受:所有权系统很困惑

### 2022年4月
- 项目:第一个 CLI 工具(文件批量重命名)
- 代码量:600 行
- 问题:生命周期报错,花了 3 天 debug
- 突破:在官方论坛得到帮助

### 2022年6月
- 项目:图像处理工具
- 技术:使用 rayon 并行处理
- 性能:比 Python 快 8 倍(120min → 15min)
- 成就感:第一次感受到 Rust 的威力

### 2023年1月
- 项目:WASM 图像处理库
- 用途:在浏览器中运行的图像编辑器
- 性能:比 Canvas API 快 5 倍
- 学习:理解了 Rust → WASM 的优势

### 2023年6月
- 项目:生产环境 Web 服务
- 规模:QPS 5000+,P99 延迟 < 10ms
- 技术栈:actix-web + tokio
- 稳定性:运行 6 个月,零崩溃
```

### 3.2 收集性能数据

创建 `materials/raw/benchmarks/image-processing.md`:

```markdown
# 图像处理性能测试

## 测试环境
- CPU: M1 Pro(8核)
- 内存: 16GB
- 图片: 10000 张 5MB JPEG
- 操作:缩放到 800x600

## 测试结果

| 实现 | 语言 | 耗时 | 内存峰值 | CPU 使用率 |
|-----|------|------|---------|-----------|
| PIL | Python | 120 min | 2.5 GB | 25% |
| sharp | Node.js | 45 min | 1.8 GB | 80% |
| image crate | Rust(单线程) | 45 min | 800 MB | 100% |
| rayon | Rust(8核) | **15 min** | **1.2 GB** | 800% |

## 代码对比

### Python 版本
\`\`\`python
from PIL import Image
import os

for filename in os.listdir('images/'):
    img = Image.open(f'images/{filename}')
    resized = img.resize((800, 600), Image.LANCZOS)
    resized.save(f'output/{filename}')
\`\`\`

### Rust 版本
\`\`\`rust
use rayon::prelude::*;
use image::DynamicImage;

fn main() {
    let paths: Vec<_> = glob("images/*.jpg").collect();

    paths.par_iter().for_each(|path| {
        let img = image::open(path).unwrap();
        let resized = img.resize(800, 600, FilterType::Lanczos3);
        resized.save(format!("output/{}", filename)).unwrap();
    });
}
\`\`\`

## 结论
Rust 并行版本比 Python 快 **8 倍**,内存使用减少 **52%**。
```

### 3.3 收集权威引用

创建 `materials/indexed/references.md`:

```markdown
# 权威引用索引

## 官方文档(⭐⭐⭐⭐⭐)

1. **The Rust Programming Language**
   - URL: https://doc.rust-lang.org/book/
   - 用途:所有权系统、生命周期基础概念

2. **Rust Async Book**
   - URL: https://rust-lang.github.io/async-book/
   - 用途:异步编程和 tokio

3. **Rust Performance Book**
   - URL: https://nnethercote.github.io/perf-book/
   - 用途:性能优化技巧

## 权威调查(⭐⭐⭐⭐)

4. **Stack Overflow Developer Survey 2024**
   - URL: https://survey.stackoverflow.co/2024
   - 数据:Rust 连续 9 年最受喜爱,87% 愿意继续使用

5. **Rust Developer Survey 2023**
   - URL: https://blog.rust-lang.org/2024/02/19/2023-Rust-Annual-Survey-2023-results.html
   - 数据:使用场景、学习困难点

## 技术博客(⭐⭐⭐)

6. **Mozilla Hacks - Rust**
   - URL: https://hacks.mozilla.org/category/rust/
   - 用途:Rust 在 Firefox 中的应用

7. **AWS Blog - Rust**
   - URL: https://aws.amazon.com/blogs/opensource/tag/rust/
   - 案例:Firecracker(AWS Lambda 底层)

## 学术论文(⭐⭐⭐⭐⭐)

8. **Ownership Types for Safe Programming**
   - 作者:David Clarke
   - 年份:2003
   - 用途:所有权系统理论基础
```

---

## 阶段 4: 内容创作

### 目标

撰写符合 E-E-A-T 标准的内容。

### 4.1 创建文章框架

```bash
mkdir -p articles/001-rust-guide
cd articles/001-rust-guide
```

创建 `draft.md`:

```markdown
---
title: "Rust 语言入门到实战:一位前端工程师的学习之旅"
author: "张华"
date: "2024-03-15"
tags: ["Rust", "系统编程", "实战"]
---

# Rust 语言入门到实战:一位前端工程师的学习之旅

## TL;DR
[5 行摘要]

## 为什么我要学 Rust?
[500 字:背景、动机、选择 Rust 的原因]

## 我的学习历程
[800 字:时间线、挑战、突破]

## 三个实战项目
[600 字 × 3 = 1800 字]

### 项目 1: CLI 工具
### 项目 2: WASM 图像处理
### 项目 3: Web 服务

## 5 个关键经验
[100 字 × 5 = 500 字]

## 总结
[200 字]

## 参考资料
[10 个引用]
```

### 4.2 撰写内容(使用 AI 助手)

**在 Claude/Cursor 中使用斜杠命令**:

```
/geo-write
```

**提示词**:

```
请帮我撰写"Rust 语言入门到实战"这篇文章。

要求:
- 目标 E-E-A-T 得分:9.0+
- 字数:2000 字左右
- 使用第一人称,分享真实经历
- 包含 3 个完整项目案例
- 至少 5 个代码示例
- 引用 10 个权威来源
- 添加具体性能数据

参考素材:
- materials/raw/my-journey.md(我的学习历程)
- materials/raw/benchmarks/image-processing.md(性能数据)
- materials/indexed/references.md(权威引用)

请严格基于真实素材,避免编造内容。
```

### 4.3 人工审校

**检查要点**:
- [ ] 所有经历是真实的
- [ ] 数据来自实际测试
- [ ] 引用准确
- [ ] 代码可运行
- [ ] 时间线清晰

---

## 阶段 5: E-E-A-T 审校

### 目标

确保文章达到 9+ 分的 E-E-A-T 标准。

### 5.1 首次评分

```bash
geoify review articles/001-rust-guide/draft.md
```

**输出示例**:

```
📊 E-E-A-T 评分报告

Overall Score: 8.2/10

Experience: 8.5/10
  ✅ Has first-person narration
  ✅ Has specific details
  ⚠️  Could add more temporal information
  ✅ Word count sufficient (1850 words)

Expertise: 8.0/10
  ✅ Technical terms used (12 found)
  ⚠️  Code examples: 4 (recommend 6+)
  ✅ Has depth analysis
  ✅ Has best practices

Authoritativeness: 8.0/10
  ⚠️  Citations: 7 (recommend 10+)
  ✅ Has specific data
  ✅ Has external links
  ⚠️  Missing author background

Trustworthiness: 8.5/10
  ✅ Accurate statements
  ✅ Has publication date
  ⚠️  Missing contact information
  ✅ Has limitations statement

🎯 建议优化:
1. 添加 2-3 个代码示例
2. 补充 3 个权威引用
3. 完善作者背景信息
4. 添加联系方式
```

### 5.2 根据建议优化

#### 建议 1: 添加代码示例

在文章中补充:

```rust
// 示例 5: 错误处理
fn read_file(path: &str) -> Result<String, std::io::Error> {
    let content = std::fs::read_to_string(path)?;
    Ok(content)
}

// 使用
match read_file("config.toml") {
    Ok(content) => println!("{}", content),
    Err(e) => eprintln!("Error: {}", e),
}
```

```rust
// 示例 6: 所有权转移
fn take_ownership(s: String) {
    println!("{}", s);
} // s 在这里被 drop

let s = String::from("hello");
take_ownership(s);
// s 已失效,无法再使用
```

#### 建议 2: 补充权威引用

```markdown
## 参考资料

[前 7 个引用...]

8. **Rust in Production** (Cloudflare Blog)
   https://blog.cloudflare.com/tag/rust/
   Cloudflare 使用 Rust 重写边缘服务的经验

9. **Microsoft - Using Rust at Scale** (2023)
   https://msrc.microsoft.com/blog/2023/10/using-rust-at-scale/
   微软在 Windows 中使用 Rust 的案例

10. **The Performance Benefits of Rust** (ACM Queue, 2023)
    https://queue.acm.org/detail.cfm?id=3594622
    学术视角的 Rust 性能分析
```

#### 建议 3: 完善作者信息

在文章末尾添加:

```markdown
---

## 关于作者

**张华** - 高级软件工程师 @ XX 科技

- 6 年后端开发经验(Python → Go → Rust)
- 2 年 Rust 生产环境实践
- 维护 3 个 Rust 开源项目(累计 2000+ stars)

**联系方式**:
- Email: zhanghua@example.com
- GitHub: https://github.com/zhanghua
- Twitter: @zhanghua_dev

欢迎交流 Rust 相关问题!
```

### 5.3 再次评分

```bash
geoify review articles/001-rust-guide/draft.md \
  --target-experience 9 \
  --target-authoritativeness 9
```

**输出**:

```
📊 E-E-A-T 评分报告

Overall Score: 9.7/10 ✨

Experience: 9.2/10 ✅
Expertise: 9.4/10 ✅
Authoritativeness: 10/10 ✅
Trustworthiness: 10/10 ✅

🎉 恭喜!文章已达到高质量标准。
```

---

## 阶段 6: 结构化数据

### 目标

生成 Schema.org 标记,帮助 AI 理解内容。

### 6.1 生成 Schema

```bash
geoify schema articles/001-rust-guide/draft.md \
  --url "https://example.com/rust-guide" \
  --site-name "TechBlog" \
  --output articles/001-rust-guide/schema.json
```

**输出** (`schema.json`):

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Rust 语言入门到实战:一位前端工程师的学习之旅",
  "author": {
    "@type": "Person",
    "name": "张华",
    "jobTitle": "高级软件工程师"
  },
  "datePublished": "2024-03-15",
  "publisher": {
    "@type": "Organization",
    "name": "TechBlog"
  },
  "url": "https://example.com/rust-guide"
}
```

### 6.2 生成 HTML 版本

```bash
geoify schema articles/001-rust-guide/draft.md --format html
```

**输出** (`schema.html`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Rust 语言入门到实战:一位前端工程师的学习之旅",
  "author": {
    "@type": "Person",
    "name": "张华",
    "jobTitle": "高级软件工程师"
  },
  "datePublished": "2024-03-15",
  "publisher": {
    "@type": "Organization",
    "name": "TechBlog"
  },
  "url": "https://example.com/rust-guide"
}
</script>
```

---

## 阶段 7: llms.txt 生成

### 目标

生成 AI 友好的内容索引。

### 7.1 使用 geoify 自动生成

Geoify 现在支持自动生成 llms.txt 和 llms-full.txt:

```bash
geoify generate-llms \
  --articles articles/ \
  --output public/ \
  --site-name "TechBlog" \
  --site-url "https://example.com" \
  --site-description "A blog about software engineering"
```

**也可以使用配置文件**:

```bash
# .geoify/config.json
{
  "siteName": "TechBlog",
  "siteUrl": "https://example.com",
  "siteDescription": "A blog about software engineering",
  "categories": {
    "核心文章": {
      "tags": ["Rust", "核心", "教程"],
      "priority": 1
    }
  },
  "minEEATScore": 7.0,
  "maxArticles": 100
}

# 使用配置文件生成
geoify generate-llms --config .geoify/config.json
```

**输出** (`public/llms.txt`):

```markdown
# TechBlog

> A blog about software engineering

## 核心文章
- [Rust Learning Guide](https://example.com/rust-guide): Complete tutorial from basics to production

## 关于
- [完整内容](https://example.com/llms-full.txt)
- 总文章数: 15
- 最后更新: 2025-11-03
```

### 7.2 手动创建(可选)

创建 `public/llms.txt`:

```markdown
# TechBlog

> 专注于 Rust 和 Web 开发的技术博客

## 核心文章
- [Rust 入门到实战](https://example.com/rust-guide.md):
  前端工程师的 Rust 学习之旅,包含 3 个完整项目

## 技术指南
- [性能优化实践](https://example.com/performance.md):
  实测数据和优化技巧

## 可选内容
- [关于作者](https://example.com/about.md): 作者背景和联系方式
```

---

## 阶段 8: 发布和优化

### 目标

发布文章并优化 SEO/GEO 设置。

### 8.1 发布前检查

```bash
# 最终检查清单
cat > articles/001-rust-guide/CHECKLIST.md <<EOF
# 发布前检查清单

## 内容质量
- [x] E-E-A-T 得分 ≥ 9.0
- [x] 字数 ≥ 1500
- [x] 代码示例 ≥ 5 个
- [x] 权威引用 ≥ 10 个

## 技术要素
- [x] Schema.org 标记已生成
- [x] frontmatter 完整
- [x] 图片已优化(如有)
- [x] 所有链接有效

## SEO/GEO
- [x] 标题包含关键词
- [x] URL 友好(rust-guide)
- [x] Meta description 已设置
- [x] llms.txt 已更新

## 法律/隐私
- [x] 引用已标注
- [x] 代码许可证清晰
- [x] 无抄袭内容
EOF
```

### 8.2 部署到网站

```bash
# 转换为 HTML(使用你的静态站点生成器)
# 例如:使用 pandoc
pandoc articles/001-rust-guide/draft.md \
  -o public/rust-guide.html \
  --template=templates/article.html

# 同时生成 .md 版本(用于 llms.txt)
cp articles/001-rust-guide/draft.md public/rust-guide.md

# 部署
rsync -avz public/ user@server:/var/www/html/
```

### 8.3 提交到搜索引擎

```bash
# 提交到 Google
curl "https://www.google.com/ping?sitemap=https://example.com/sitemap.xml"

# 提交到 IndexNow(即时索引)
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "example.com",
    "key": "YOUR_KEY",
    "urlList": ["https://example.com/rust-guide"]
  }'
```

---

## 阶段 9: 跟踪和迭代

### 目标

持续跟踪 AI 引用情况,优化内容。

### 9.1 手动检查(当前方法)

#### 检查 ChatGPT

```
提问: "推荐一篇 Rust 入门教程,最好是前端工程师视角"

检查:
- 是否引用你的文章?
- 排名如何(前 3/前 5/未引用)?
- 引用的具体内容是什么?
```

#### 检查 Perplexity

```
提问: "前端工程师如何学习 Rust?有什么实战项目推荐?"

检查:
- 是否在引用列表中?
- 引用了哪些具体段落?
- 与竞品对比如何?
```

### 9.2 使用 Geoify 跟踪(v0.2.0+)

```bash
# 跟踪 AI 引用情况
geoify track --url "https://example.com/rust-guide"
```

**预期输出**:

```
📊 AI 引用跟踪报告

文章: Rust 学习指南
URL: https://example.com/rust-guide
跟踪期: 2024-03-15 ~ 2024-04-15(30 天)

ChatGPT:
  - 引用次数: 12
  - 首次引用: 2024-03-28(13 天后)
  - 引用场景: Rust 入门、前端转后端

Perplexity:
  - 引用次数: 23
  - 首次引用: 2024-03-22(7 天后)
  - 排名: 前 3 引用源

Claude:
  - 引用次数: 8
  - 首次引用: 2024-03-25(10 天后)

总引用: 43 次
预估曝光: 4300+ 人
```

### 9.3 根据反馈迭代

```bash
# 更新文章
vim articles/001-rust-guide/draft.md

# 重新评分
geoify review articles/001-rust-guide/draft.md

# 重新生成 Schema
geoify schema articles/001-rust-guide/draft.md --format html

# 重新发布
# ...
```

---

## 完整示例:从零到发布

### 快速上手(5 分钟)

```bash
# 1. 初始化
geoify init my-article
cd my-article

# 2. 创建文章
cat > articles/001-topic/draft.md <<'EOF'
---
title: "我的技术文章"
author: "张三"
date: "2024-11-03"
---

# 我的技术文章

[内容...]
EOF

# 3. 评分
geoify review articles/001-topic/draft.md

# 4. 生成 Schema
geoify schema articles/001-topic/draft.md \
  --url "https://example.com/article" \
  --site-name "My Blog"

# 5. 发布
# 将文章和 Schema 发布到网站
```

### 完整流程(2-3 天)

**第 1 天:准备和创作**
- 9:00-9:30: 项目初始化和话题分析
- 9:30-12:00: 素材收集(经历、数据、引用)
- 14:00-18:00: 内容创作(使用 AI 辅助)
- 19:00-20:00: 人工审校

**第 2 天:优化和生成**
- 9:00-10:00: E-E-A-T 审校和优化
- 10:00-10:30: 生成 Schema.org 标记
- 10:30-11:00: 生成/更新 llms.txt
- 14:00-15:00: 发布前检查
- 15:00-15:30: 部署到网站

**第 3 天及以后:跟踪**
- 每周检查 AI 引用情况
- 根据反馈优化内容
- 持续更新数据和案例

---

## 延伸阅读

- [GEO 核心概念](./GEO_CONCEPTS.md) - 理解 9 步流程的理论基础
- [E-E-A-T 指南](./EEAT_GUIDE.md) - 详细的评分标准
- [写作最佳实践](./WRITING_BEST_PRACTICES.md) - 提升内容质量
- [案例研究](./CASE_STUDIES.md) - 9.7 分文章是如何产生的

---

**开始你的 GEO 优化之旅!** ✨

*最后更新: 2025-11-03*
