# E-E-A-T 深度指南:如何达到 9+ 分

## 目录

- [E-E-A-T 框架概述](#e-e-a-t-框架概述)
- [维度 1: Experience (经验)](#维度-1-experience-经验)
- [维度 2: Expertise (专业性)](#维度-2-expertise-专业性)
- [维度 3: Authoritativeness (权威性)](#维度-3-authoritativeness-权威性)
- [维度 4: Trustworthiness (可信度)](#维度-4-trustworthiness-可信度)
- [评分算法详解](#评分算法详解)
- [如何达到 9+ 分](#如何达到-9-分)
- [常见误区](#常见误区)
- [实战检查清单](#实战检查清单)

---

## E-E-A-T 框架概述

### 历史背景

**E-E-A-T** 来自 Google 的搜索质量评估指南(Search Quality Rater Guidelines),最初为 E-A-T(Expertise, Authoritativeness, Trustworthiness),2022 年 Google 添加第一个 E - **Experience**(经验),强调内容应基于**亲身经历**。

**为什么 GEO 需要 E-E-A-T?**

AI 引擎(ChatGPT、Perplexity、Claude)在选择引用源时,遵循与 Google 相似的质量标准:
- ✅ 真实的、基于经验的内容更可信
- ✅ 专业的、有深度的内容更有价值
- ✅ 权威的、有引用的内容更准确
- ✅ 可验证的、透明的内容更安全

### E-E-A-T 的四个维度

| 维度 | 英文 | 核心问题 | 权重 |
|-----|------|---------|------|
| **第一个 E** | Experience | 是否基于亲身经历? | 25% |
| **第二个 E** | Expertise | 是否展示专业知识? | 25% |
| **A** | Authoritativeness | 是否引用权威来源? | 25% |
| **T** | Trustworthiness | 是否可信且可验证? | 25% |

**评分范围**: 0-10 分(每个维度 0-10 分,加权平均得总分)

**目标分数**:
- 🥉 **7.0-7.9** - 合格(有一定引用概率)
- 🥈 **8.0-8.9** - 良好(中等引用概率)
- 🥇 **9.0-10** - 优秀(高引用概率)

---

## 维度 1: Experience (经验)

### 核心理念

**Experience** 评估内容是否基于**真实的、第一手的经验**,而非编造或转述。

### 4 个检查项

#### 1. 第一人称叙述

**检查标准**: 使用"我"、"我们"、"咱们"等第一人称代词,分享亲身经历

**正面示例**:
```markdown
我在过去 2 年的 Rust 开发中,经历了从入门到生产环境部署的完整过程。
最初我花了 3 个月时间理解所有权系统...
```

**反面示例**:
```markdown
Rust 是一门系统编程语言。开发者需要学习所有权系统...
(❌ 第三人称,像教科书)
```

**评分标准**:
- 10 分: 全文都是第一人称,真实感强
- 7 分: 部分第一人称,有一定真实感
- 4 分: 极少第一人称
- 0 分: 完全第三人称

**Geoify 检测**:
```typescript
// src/scoring/content-analyzer.ts
hasFirstPerson(content: string): boolean {
  const patterns = [
    /我([^们]|$)/,  // "我" but not "我们"
    /咱们/,
    /\bI\b/,
    /\bwe\b/i,
    /我的/,
    /我们的/
  ]
  return patterns.some(p => p.test(content))
}
```

#### 2. 具体项目经历

**检查标准**: 描述具体的项目、任务或经历,包含时间、地点、过程

**正面示例**:
```markdown
## 项目 1: CLI 工具开发

2023 年 6 月,我用 Rust 开发了一个命令行工具,用于批量处理图像。
团队需要每天处理 10000+ 张产品图片,原来的 Python 脚本耗时 2 小时。

我选择 Rust 重写,使用了 rayon 做并行处理,最终耗时降到 15 分钟。

[完整代码示例...]
```

**反面示例**:
```markdown
Rust 适合开发 CLI 工具。它性能很好,可以提升效率。
(❌ 模糊、没有具体项目)
```

**评分标准**:
- 10 分: 3+ 个具体项目,包含时间、场景、结果
- 7 分: 1-2 个具体项目
- 4 分: 提到项目但不具体
- 0 分: 没有项目经历

#### 3. 真实挑战和解决方案

**检查标准**: 分享遇到的真实问题、思考过程、解决方案

**正面示例**:
```markdown
## 遇到的最大挑战:生命周期困惑

在开发图像处理模块时,我遇到了典型的生命周期错误:

\`\`\`
error[E0597]: `img` does not live long enough
\`\`\`

我花了 2 天时间理解这个错误。最初我尝试用 `clone()` 解决,
但性能下降了 40%。后来我在 Rust 官方论坛找到了 `Cow` 类型...

最终方案:
\`\`\`rust
use std::borrow::Cow;

fn process<'a>(img: Cow<'a, Image>) -> Result<Image> {
  // 使用 Cow 避免不必要的克隆
}
\`\`\`

性能提升了 3 倍,还解决了生命周期问题。
```

**反面示例**:
```markdown
Rust 的生命周期系统可能会遇到一些问题,但可以通过学习官方文档解决。
(❌ 模糊、没有真实场景)
```

**评分标准**:
- 10 分: 详细的问题描述 + 思考过程 + 具体解决方案
- 7 分: 提到问题和解决方案,但不够详细
- 4 分: 仅提到问题,无解决方案
- 0 分: 无真实挑战

#### 4. 时间跨度和演进

**检查标准**: 展示学习或实践的时间跨度,体现成长过程

**正面示例**:
```markdown
## 我的 Rust 学习时间线

**2022 年 3 月**: 开始学习 Rust,完成《The Book》前 10 章
**2022 年 6 月**: 完成第一个 CLI 项目(600 行代码)
**2022 年 9 月**: 尝试 WASM,开发了一个浏览器图像处理库
**2023 年 3 月**: 在生产环境部署 Rust 微服务,QPS 达 5000+
**2024 年至今**: 维护 3 个 Rust 开源项目,累计 2000+ stars
```

**反面示例**:
```markdown
学习 Rust 需要时间和实践。
(❌ 无时间线,无演进)
```

**评分标准**:
- 10 分: 6 个月+ 的时间跨度,清晰的成长轨迹
- 7 分: 3-6 个月时间跨度
- 4 分: 提到时间但不具体
- 0 分: 无时间信息

---

## 维度 2: Expertise (专业性)

### 核心理念

**Expertise** 评估内容是否展示**专业知识和技能**,包括技术深度、术语使用、代码质量。

### 4 个检查项

#### 1. 专业术语使用

**检查标准**: 适度使用行业术语,展示专业性(非堆砌)

**正面示例**:
```markdown
Rust 的所有权系统(ownership system)通过三个核心概念实现内存安全:
1. **所有权** (ownership) - 每个值都有唯一的所有者
2. **借用** (borrowing) - 通过引用临时访问值
3. **生命周期** (lifetime) - 确保引用的有效性

这种设计避免了常见的内存问题:
- 悬垂指针 (dangling pointers)
- 双重释放 (double free)
- 数据竞争 (data races)
```

**反面示例**:
```markdown
Rust 很安全,不会出错。它使用一些特殊的机制保证安全。
(❌ 无专业术语,不够专业)
```

**评分标准**:
- 10 分: 15+ 个专业术语,使用准确
- 7 分: 8-14 个术语
- 4 分: 1-7 个术语
- 0 分: 无术语

**Geoify 检测**:
```typescript
countTechnicalTerms(content: string): number {
  const patterns = [
    /\b[A-Z][a-z]+[A-Z]\w+/g,  // CamelCase
    /\b\w+[_-]\w+\b/g,          // snake_case, kebab-case
    /【.*?】/g,                  // 中文术语标记
  ]
  // 统计匹配数量
}
```

#### 2. 代码示例质量

**检查标准**: 提供实际可运行的代码,非伪代码或简单示例

**正面示例**:
```markdown
## 完整的并行图像处理示例

\`\`\`rust
use rayon::prelude::*;
use image::{DynamicImage, ImageBuffer};

fn process_images(paths: Vec<PathBuf>) -> Result<Vec<Image>> {
  paths
    .par_iter()
    .map(|path| {
      let img = image::open(path)?;
      let resized = img.resize(800, 600, FilterType::Lanczos3);
      Ok(resized)
    })
    .collect()
}

// 性能对比
// 单线程: 120 秒
// 8 核并行: 18 秒 (6.7x 提升)
\`\`\`
```

**反面示例**:
```python
# 伪代码
def process_images():
  for img in images:
    resize(img)
```

**评分标准**:
- 10 分: 6+ 个完整代码块,可直接运行
- 7 分: 3-5 个代码块
- 4 分: 1-2 个代码块
- 0 分: 无代码或仅伪代码

#### 3. 深度分析

**检查标准**: 超越表面,提供深层次的技术分析或原理解释

**正面示例**:
```markdown
## Rust 为何如此高效?

### 零成本抽象

Rust 的"零成本抽象"意味着高级抽象在编译后与手写的低级代码性能相同。

以迭代器为例:

\`\`\`rust
// 高级写法
let sum: i32 = vec.iter().filter(|x| x % 2 == 0).sum();

// 编译后等价于:
let mut sum = 0;
for x in &vec {
  if x % 2 == 0 {
    sum += x;
  }
}
\`\`\`

**LLVM 优化后的汇编**:
\`\`\`asm
  mov eax, 0
.loop:
  test DWORD PTR [rcx], 1
  jnz .next
  add eax, DWORD PTR [rcx]
.next:
  add rcx, 4
  cmp rcx, rdx
  jne .loop
\`\`\`

没有任何额外开销,完全是原生循环的性能。
```

**反面示例**:
```markdown
Rust 很快,因为它编译成机器码。
(❌ 表面分析)
```

**评分标准**:
- 10 分: 深入原理,有技术细节分析
- 7 分: 有一定深度分析
- 4 分: 浅层分析
- 0 分: 无分析

#### 4. 最佳实践

**检查标准**: 分享经验总结、最佳实践、避坑指南

**正面示例**:
```markdown
## Rust 开发的 5 个最佳实践

### 1. 优先使用 `&str` 而非 `String`

在函数参数中,除非需要所有权,否则使用 `&str`:

\`\`\`rust
// ✅ 推荐
fn print_name(name: &str) {
  println!("{}", name);
}

// ❌ 不推荐(除非需要所有权)
fn print_name(name: String) {
  println!("{}", name);
}
\`\`\`

**理由**: `&str` 更灵活,可以接受 `String`、`&String`、字面量。

### 2. 使用 `?` 简化错误处理

\`\`\`rust
// ✅ 简洁
fn read_file(path: &str) -> Result<String> {
  let content = fs::read_to_string(path)?;
  Ok(content)
}

// ❌ 冗长
fn read_file(path: &str) -> Result<String> {
  match fs::read_to_string(path) {
    Ok(content) => Ok(content),
    Err(e) => Err(e),
  }
}
\`\`\`

[继续 3-5 个实践...]
```

**评分标准**:
- 10 分: 5+ 个实践,有代码对比
- 7 分: 3-4 个实践
- 4 分: 1-2 个实践
- 0 分: 无实践总结

---

## 维度 3: Authoritativeness (权威性)

### 核心理念

**Authoritativeness** 评估内容是否引用**权威来源**,是否得到外部认可。

### 4 个检查项

#### 1. 权威来源引用

**检查标准**: 引用官方文档、学术论文、权威网站

**权威来源分类**:

| 级别 | 来源类型 | 示例 |
|-----|---------|------|
| ⭐⭐⭐⭐⭐ | 官方文档 | Rust 官方文档、MDN |
| ⭐⭐⭐⭐ | 学术论文 | ACM、IEEE 论文 |
| ⭐⭐⭐ | 权威调查 | Stack Overflow Survey |
| ⭐⭐ | 技术博客 | Mozilla Blog, AWS Blog |
| ⭐ | 个人博客 | 知名开发者博客 |

**正面示例**:
```markdown
## 参考资料

1. **Rust 官方文档**: [The Rust Programming Language](https://doc.rust-lang.org/book/)
2. **所有权系统论文**: Ownership Types for Safe Programming (ACM 2003)
3. **性能对比**: [Stack Overflow Developer Survey 2024](https://survey.stackoverflow.co/2024)
4. **WASM 最佳实践**: [Mozilla WebAssembly Guide](https://developer.mozilla.org/en-US/docs/WebAssembly)
5. **并发编程**: Fearless Concurrency in Rust (OOPSLA 2017)
```

**反面示例**:
```markdown
## 参考资料

1. 百度百科 - Rust
2. 某博客 - Rust 入门
(❌ 非权威来源)
```

**评分标准**:
- 10 分: 5+ 个权威引用(官方文档 + 论文)
- 7 分: 3-4 个权威引用
- 4 分: 1-2 个权威引用
- 0 分: 无引用或非权威引用

**引用格式要求**:
```markdown
> 根据 Stack Overflow 2024 调查,Rust 连续 9 年被评为"最受喜爱的编程语言"[1]。

[1] Stack Overflow Developer Survey 2024: https://survey.stackoverflow.co/2024
```

#### 2. 数据和统计

**检查标准**: 使用真实的、可验证的数据支持观点

**正面示例**:
```markdown
## Rust 的市场趋势

根据权威数据:

- **GitHub 统计**: Rust 仓库数量从 2020 年的 10 万增长到 2024 年的 50 万,增长 400% [1]
- **Stack Overflow 调查**: 87% 的 Rust 开发者表示愿意继续使用 [2]
- **Linux 内核**: 2024 年,Linux 6.1 版本正式支持 Rust,有 230+ 个 Rust 提交 [3]
- **企业采用**: Microsoft、Amazon、Meta、Cloudflare 等在生产环境大规模使用 [4]

[数据来源...]
```

**反面示例**:
```markdown
Rust 很流行,很多公司在用,增长很快。
(❌ 无具体数据)
```

**评分标准**:
- 10 分: 5+ 个具体数据,有来源
- 7 分: 3-4 个数据
- 4 分: 1-2 个数据
- 0 分: 无数据

#### 3. 外部链接质量

**检查标准**: 链接到高质量的外部资源

**正面示例**:
```markdown
## 延伸阅读

- [Rust 异步编程](https://rust-lang.github.io/async-book/) - 官方异步编程指南
- [tokio 文档](https://tokio.rs/tokio/tutorial) - Rust 异步运行时
- [Rust 性能分析](https://nnethercote.github.io/perf-book/) - 性能优化手册
```

**评分标准**:
- 10 分: 5+ 个高质量外链
- 7 分: 3-4 个外链
- 4 分: 1-2 个外链
- 0 分: 无外链或低质量链接

#### 4. 作者背景

**检查标准**: 展示作者的专业背景和资质

**正面示例**:
```markdown
---
## 关于作者

**张华** - 高级软件工程师
- 6 年后端开发经验,2 年 Rust 实践
- 曾在 XX 科技负责高性能服务开发(QPS 5000+)
- 开源贡献者,维护 3 个 Rust 项目(累计 2000+ stars)
- GitHub: github.com/zhanghua
- 技术博客: blog.zhanghua.dev

联系方式: zhanghua@example.com
---
```

**反面示例**:
```markdown
作者:某某
(❌ 无背景信息)
```

**评分标准**:
- 10 分: 完整的作者信息(姓名 + 职位 + 经验 + 联系方式)
- 7 分: 部分信息(姓名 + 职位)
- 4 分: 仅姓名
- 0 分: 无作者信息

---

## 维度 4: Trustworthiness (可信度)

### 核心理念

**Trustworthiness** 评估内容的**可信性和可验证性**。

### 4 个检查项

#### 1. 准确的事实陈述

**检查标准**: 避免夸大、错误或误导性陈述

**正面示例**:
```markdown
Rust 在某些场景下性能优于 C++,但不是所有情况。

**基准测试结果**:
- 图像处理: Rust 快 7-8%(使用 SIMD 优化)
- 字符串处理: C++ 快 5%(更成熟的库)
- 并发任务: Rust 快 15%(零成本抽象 + 安全性)

结论:性能相近,Rust 优势在于内存安全 + 无数据竞争。
```

**反面示例**:
```markdown
Rust 比 C++ 快 10 倍!绝对是最快的语言!
(❌ 夸大,无数据支持)
```

**评分标准**:
- 10 分: 准确、客观、有数据支持
- 7 分: 基本准确,偶有夸大
- 4 分: 部分不准确
- 0 分: 明显错误或误导

#### 2. 透明的更新日期

**检查标准**: 明确标注发布和更新时间

**正面示例**:
```markdown
---
title: Rust 学习指南
author: 张华
published: 2024-03-15
updated: 2024-10-20
version: 1.2
---

**更新记录**:
- 2024-10-20: 新增 Rust 1.80 新特性
- 2024-06-15: 更新异步编程章节
- 2024-03-15: 初版发布
```

**反面示例**:
```markdown
# Rust 学习指南
(❌ 无日期)
```

**评分标准**:
- 10 分: 发布日期 + 更新日期 + 版本号
- 7 分: 发布日期 + 更新日期
- 4 分: 仅发布日期
- 0 分: 无日期

#### 3. 联系方式和反馈渠道

**检查标准**: 提供真实的联系方式,接受反馈

**正面示例**:
```markdown
## 问题反馈

如果你发现文章中有任何错误或疑问,欢迎通过以下方式联系:

- **Email**: zhanghua@example.com
- **GitHub Issues**: github.com/zhanghua/rust-guide/issues
- **Twitter**: @zhanghua_dev
- **微信公众号**: 张华的技术笔记

我会在 48 小时内回复。
```

**反面示例**:
```markdown
有问题请留言。
(❌ 无具体联系方式)
```

**评分标准**:
- 10 分: 多渠道联系方式(邮箱 + 社交媒体)
- 7 分: 1-2 个联系方式
- 4 分: 仅提示可联系,无具体方式
- 0 分: 无联系方式

#### 4. 透明的局限性说明

**检查标准**: 诚实说明内容的局限性和不足

**正面示例**:
```markdown
## 本文的局限性

本文基于我 2 年的 Rust 实践,主要聚焦 Web 后端开发。
因此:

- ✅ **适用场景**: Web 服务、CLI 工具、API 开发
- ⚠️ **部分适用**: 嵌入式开发(我经验有限)
- ❌ **不适用**: 游戏引擎、操作系统开发(我没有实践经验)

如果你从事嵌入式或游戏开发,建议参考:
- [Embedded Rust Book](https://rust-embedded.github.io/book/)
- [Bevy 游戏引擎文档](https://bevyengine.org/)
```

**反面示例**:
```markdown
本文适用于所有 Rust 场景。
(❌ 不诚实,无局限性说明)
```

**评分标准**:
- 10 分: 明确说明适用范围和局限性
- 7 分: 简单说明局限性
- 4 分: 隐含提到局限性
- 0 分: 无局限性说明

---

## 评分算法详解

### 加权平均计算

Geoify 使用**加权平均**计算总分:

```typescript
// src/scoring/eeat-scorer.ts
score(content: string): EEATScore {
  const experience = this.calculateExperience(analysis)      // 0-10
  const expertise = this.calculateExpertise(analysis)        // 0-10
  const authoritativeness = this.calculateAuth(analysis)     // 0-10
  const trustworthiness = this.calculateTrust(analysis)      // 0-10

  // 加权平均(各 25%)
  const overall = (
    experience * 0.25 +
    expertise * 0.25 +
    authoritativeness * 0.25 +
    trustworthiness * 0.25
  )

  return { overall, experience, expertise, authoritativeness, trustworthiness }
}
```

### 单个维度评分逻辑

每个维度由 4 个检查项组成,采用**阈值评分**:

```typescript
// 示例: Experience 维度
calculateExperience(analysis: ContentMetrics): number {
  let score = 0

  // 检查项 1: 第一人称(0-3 分)
  if (analysis.hasFirstPerson) score += 3

  // 检查项 2: 具体项目(0-3 分)
  if (analysis.hasSpecificDetails) score += 3

  // 检查项 3: 真实挑战(0-2 分)
  if (analysis.wordCount > 1000) score += 2

  // 检查项 4: 时间跨度(0-2 分)
  if (analysis.hasTemporal) score += 2

  return Math.min(score, 10)  // 最高 10 分
}
```

### 实际案例分析

**示例文章**: Rust 学习指南(1597 字)

#### Experience: 9.2/10

| 检查项 | 得分 | 说明 |
|-------|-----|------|
| 第一人称 | 3.0 | ✅ 多处"我在...""我的..." |
| 具体项目 | 3.0 | ✅ 3 个完整项目(CLI、WASM、图像) |
| 真实挑战 | 2.0 | ✅ 详细描述生命周期问题 |
| 时间跨度 | 1.2 | ⚠️ 2 年时间线,略简略 |
| **总分** | **9.2** | |

#### Expertise: 9.4/10

| 检查项 | 得分 | 说明 |
|-------|-----|------|
| 专业术语 | 2.5 | ✅ 18 个术语(ownership, borrowing...) |
| 代码示例 | 3.0 | ✅ 6 个完整代码块 |
| 深度分析 | 2.4 | ✅ 有原理分析(零成本抽象) |
| 最佳实践 | 1.5 | ⚠️ 5 个实践,略简略 |
| **总分** | **9.4** | |

#### Authoritativeness: 10/10

| 检查项 | 得分 | 说明 |
|-------|-----|------|
| 权威引用 | 3.0 | ✅ 10 个权威来源(官方文档 + 论文) |
| 数据统计 | 3.0 | ✅ 具体性能数据(7-8 倍) |
| 外部链接 | 2.0 | ✅ 5 个高质量外链 |
| 作者背景 | 2.0 | ✅ 完整作者信息 |
| **总分** | **10** | |

#### Trustworthiness: 10/10

| 检查项 | 得分 | 说明 |
|-------|-----|------|
| 准确陈述 | 3.0 | ✅ 客观、有数据支持 |
| 更新日期 | 2.0 | ✅ 发布日期 + 更新日期 |
| 联系方式 | 3.0 | ✅ 邮箱 + GitHub + 微信 |
| 局限性说明 | 2.0 | ✅ 明确说明适用范围 |
| **总分** | **10** | |

#### 总分: 9.7/10

```
Overall = (9.2 + 9.4 + 10 + 10) / 4 = 9.65 ≈ 9.7
```

---

## 如何达到 9+ 分

### 必要条件(缺一不可)

- [ ] **字数 ≥ 1500 字** - 深度内容的基础
- [ ] **第一人称** - 至少 5 处第一人称叙述
- [ ] **具体项目** - 至少 2 个完整项目经历
- [ ] **代码示例** - 至少 5 个完整代码块
- [ ] **权威引用** - 至少 5 个权威来源
- [ ] **作者信息** - 完整的作者背景和联系方式

### 优化策略

#### 策略 1: 用故事化的方式分享经验

**之前**(7 分):
```markdown
Rust 适合开发高性能应用。它的所有权系统保证内存安全。
```

**优化后**(9 分):
```markdown
2023 年 6 月,我接到一个紧急任务:优化图像处理服务。

原来的 Python 脚本每天处理 10000 张图片要 2 小时,
客户要求降到 30 分钟内。我评估了几个方案:

1. **Go** - 并发好,但 GC 导致延迟不稳定
2. **C++** - 性能强,但内存安全是隐患
3. **Rust** - 性能 + 安全,值得尝试

最终选择 Rust。用 rayon 做并行处理,2 周后上线,
处理时间降到 15 分钟,性能提升 8 倍,零崩溃。

[完整代码...]
```

#### 策略 2: 数据量化你的成果

**之前**(7 分):
```markdown
性能有明显提升。
```

**优化后**(9 分):
```markdown
**性能对比**(处理 10000 张 5MB 图片):

| 实现 | 耗时 | 内存峰值 | CPU 使用率 |
|-----|------|---------|----------|
| Python | 120 分钟 | 2.5 GB | 25% |
| Rust(单线程) | 45 分钟 | 800 MB | 100% |
| Rust(8 核并行) | **15 分钟** | **1.2 GB** | **800%** |

**提升**:
- 耗时减少 **87.5%**
- 内存减少 **52%**
- 吞吐量提升 **8 倍**
```

#### 策略 3: 引用权威来源支持观点

**之前**(7 分):
```markdown
Rust 很流行,很多公司在用。
```

**优化后**(9 分):
```markdown
根据权威数据,Rust 在企业中的采用正快速增长:

- **Stack Overflow 2024 调查**: Rust 连续 9 年蝉联"最受喜爱语言"[1]
- **Linux 内核**: 2024 年正式支持 Rust,230+ 提交[2]
- **CNCF 报告**: 33% 的云原生项目考虑使用 Rust[3]

**企业案例**:
- **Microsoft**: Windows 使用 Rust 重写部分内核组件[4]
- **Amazon**: Firecracker(用 Rust)支撑 AWS Lambda[5]
- **Cloudflare**: 全部边缘服务迁移到 Rust[6]

[1] Stack Overflow Survey: https://survey.stackoverflow.co/2024
[2] Linux Kernel Rust Support: https://lwn.net/Articles/...
[...]
```

#### 策略 4: 展示完整的作者资质

**之前**(7 分):
```markdown
作者:张华
```

**优化后**(9 分):
```markdown
---
## 关于作者

<img src="/author.jpg" width="120" style="border-radius: 50%">

**张华** - 高级软件工程师 @ XX 科技

**专业背景**:
- 6 年后端开发经验(Python → Go → Rust)
- 2 年 Rust 生产环境实践(QPS 5000+)
- 计算机科学硕士(XX 大学,2018)

**开源贡献**:
- `rust-image-processor` - 高性能图像处理库(1200 stars)
- `tokio-utils` - Tokio 实用工具集(800 stars)
- Rust 官方贡献者(10+ merged PRs)

**技术分享**:
- GitHub: [github.com/zhanghua](https://github.com/zhanghua)
- 博客: [blog.zhanghua.dev](https://blog.zhanghua.dev) (50+ 篇技术文章)
- Twitter: [@zhanghua_dev](https://twitter.com/zhanghua_dev) (5K followers)

**联系方式**:
- 邮箱: zhanghua@example.com
- 微信公众号: 张华的技术笔记
- LinkedIn: linkedin.com/in/zhanghua

我乐意回答 Rust 相关问题,欢迎交流!
---
```

---

## 常见误区

### 误区 1: 堆砌关键词就能提高分数

**错误做法**:
```markdown
Rust ownership borrowing lifetime zero-cost abstraction memory safety
thread safety data race ...
(❌ 关键词堆砌,无上下文)
```

**正确做法**:
在自然的叙述中使用专业术语,并解释其含义。

### 误区 2: 只要有引用就有权威性

**错误引用**:
```markdown
[1] 百度百科 - Rust
[2] 某博客 - Rust 很好
(❌ 非权威来源)
```

**正确引用**:
```markdown
[1] The Rust Programming Language (官方文档): https://doc.rust-lang.org/book/
[2] Fearless Concurrency (论文): https://dl.acm.org/doi/...
```

### 误区 3: 夸大宣传增加可信度

**错误做法**:
```markdown
Rust 是世界上最好的语言!性能比 C++ 快 10 倍!
(❌ 夸大,无数据)
```

**正确做法**:
```markdown
在我的图像处理项目中,Rust 比原 Python 实现快 8 倍,
与 C++ 实现性能相近(±5%),但内存安全性更好。
```

### 误区 4: AI 生成内容直接使用

**AI 生成的典型问题**:
- ❌ 第三人称,像教科书
- ❌ 模糊的描述("可能"、"也许"、"通常")
- ❌ 无具体数据和时间
- ❌ 无真实项目经历

**解决方案**:
AI 生成内容仅作为草稿,必须添加:
- ✅ 真实的个人经历
- ✅ 具体的项目数据
- ✅ 权威引用来源
- ✅ 作者信息

---

## 实战检查清单

使用这个清单在发布前自检:

### Experience 检查清单

- [ ] 至少 5 处第一人称叙述
- [ ] 至少 2 个具体项目(包含时间、场景、结果)
- [ ] 至少 1 个真实挑战 + 详细解决方案
- [ ] 明确的时间跨度(3 个月以上)

### Expertise 检查清单

- [ ] 至少 10 个专业术语(在上下文中使用)
- [ ] 至少 5 个完整代码块(可运行)
- [ ] 至少 1 处深度分析(原理/机制)
- [ ] 至少 3 个最佳实践(有代码对比)

### Authoritativeness 检查清单

- [ ] 至少 5 个权威引用(官方文档/论文/权威调查)
- [ ] 至少 3 个具体数据(有来源)
- [ ] 至少 3 个外部高质量链接
- [ ] 完整的作者信息(姓名 + 职位 + 背景 + 联系方式)

### Trustworthiness 检查清单

- [ ] 所有陈述准确,无夸大
- [ ] 明确标注发布和更新日期
- [ ] 提供至少 2 个联系方式
- [ ] 说明内容的适用范围和局限性

### 使用 Geoify 检查

```bash
# 1. 评估当前得分
geoify review article.md

# 2. 查看详细报告
geoify review article.md --format markdown

# 3. 设定目标分数
geoify review article.md \
  --target-experience 9 \
  --target-authoritativeness 9

# 4. 输出 JSON(用于程序化处理)
geoify review article.md --format json > score.json
```

---

## 延伸阅读

- [GEO 核心概念](./GEO_CONCEPTS.md) - 理解 E-E-A-T 在 GEO 中的作用
- [GEO 写作最佳实践](./WRITING_BEST_PRACTICES.md) - 真实性写作技巧
- [案例研究](./CASE_STUDIES.md) - 9.7 分文章深度解析
- [API 参考](./API_REFERENCE.md) - EEATScorer 详细文档

---

**让每一篇内容都值得被 AI 引用!** ✨

*最后更新: 2025-11-03*
