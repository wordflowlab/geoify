# GEO 写作最佳实践

## 目录

- [核心原则](#核心原则)
- [真实性写作](#真实性写作)
- [如何避免 AI 味](#如何避免-ai-味)
- [权威引用技巧](#权威引用技巧)
- [数据和案例收集](#数据和案例收集)
- [为 llms.txt 优化内容结构](#为-llmstxt-优化内容结构)
- [写作流程](#写作流程)
- [内容检查清单](#内容检查清单)

---

## 核心原则

### GEO 写作的 3 个黄金法则

#### 1. 真实性 > 完美性

**错误思维**: 追求完美的表达,使用华丽的辞藻
**正确思维**: 分享真实的经历,即使不完美

**对比**:

❌ **过度润色**(AI 味重):
```markdown
Rust 是一门令人惊叹的编程语言,其革命性的所有权系统为系统编程
领域带来了前所未有的创新,完美地平衡了性能与安全性。
```

✅ **真实叙述**:
```markdown
我最初学 Rust 时,所有权系统让我很困惑。花了 2 周才理解借用检查器
在说什么。但当我理解后,发现它确实能防止我犯以前在 C++ 中常犯的错误。
```

#### 2. 具体性 > 抽象性

**错误思维**: 使用模糊的、抽象的描述
**正确思维**: 提供具体的数字、时间、案例

**对比**:

❌ **模糊描述**:
```markdown
Rust 性能很好,能显著提升效率。
```

✅ **具体数据**:
```markdown
我用 Rust 重写了图像处理服务:
- 原 Python 版本:处理 10000 张图片耗时 120 分钟
- Rust 版本:15 分钟完成,提升 8 倍
- 内存使用从 2.5GB 降到 1.2GB,减少 52%
```

#### 3. 可验证性 > 权威性

**错误思维**: 声称自己是专家,强调资历
**正确思维**: 提供可验证的证据和引用

**对比**:

❌ **自我吹嘘**:
```markdown
作为资深 Rust 专家,我可以肯定地说...
```

✅ **提供证据**:
```markdown
根据 Stack Overflow 2024 调查[1],Rust 连续 9 年被评为最受喜爱的语言。
我在 2 年的实践中也有同感...

[1] Stack Overflow Developer Survey 2024: https://survey.stackoverflow.co/2024
```

---

## 真实性写作

### 使用第一人称

**为什么**: AI 生成的内容通常是第三人称,第一人称是真实性的强信号

**技巧**:

#### 1. 分享个人经历

```markdown
## 我的 Rust 学习历程

**2022 年 3 月**,我在 Hacker News 上看到 Rust 的讨论,决定尝试。

第一周我完成了《The Rust Programming Language》的前 5 章。老实说,
所有权系统让我很困惑,特别是生命周期标注。

**转折点**: 第 3 周,我尝试写一个简单的 Web 服务器。遇到了这个错误:

\`\`\`
error[E0597]: `data` does not live long enough
\`\`\`

我花了整整 2 天 debug。在 Rust 官方论坛得到帮助后,突然开窍了。
```

#### 2. 承认失败和困难

```markdown
## 我犯过的 3 个错误

### 错误 1: 过度使用 `clone()`

最初我遇到借用检查器错误,就到处加 `clone()`。结果:

- 内存使用增加 40%
- 性能下降明显
- 代码难以维护

**教训**: 理解所有权,而非回避它。

### 错误 2: 忽略 `Result` 类型

我习惯了 JavaScript 的 try-catch,忽略了 Rust 的 `Result`。
导致程序在生产环境 panic。

**解决方案**: 使用 `?` 运算符和 `match` 正确处理错误。
```

#### 3. 展示思考过程

```markdown
## 为什么选择 Rust 而非 Go?

我评估了 3 个方案:

**Go**:
- ✅ 并发模型简单(goroutine)
- ✅ 编译快,开发体验好
- ❌ GC 导致延迟不稳定(P99 达 50ms)
- ❌ 无法避免 nil 指针

**C++**:
- ✅ 性能最强
- ✅ 成熟生态
- ❌ 内存安全靠人工保证
- ❌ 编译慢,开发效率低

**Rust**:
- ✅ 性能接近 C++(±5%)
- ✅ 编译期保证内存安全
- ✅ 无 GC,延迟可控
- ❌ 学习曲线陡峭

**最终选择**: Rust,因为性能和安全性对我们的场景最重要。
```

### 具体化抽象概念

**技巧**: 每个抽象概念都用具体例子说明

**示例**:

❌ **抽象描述**:
```markdown
Rust 的类型系统很强大,能在编译期发现很多错误。
```

✅ **具体例子**:
```markdown
Rust 的类型系统在编译期就能发现错误。举个例子:

\`\`\`rust
fn divide(a: i32, b: i32) -> i32 {
  a / b  // 如果 b 是 0 会 panic
}
\`\`\`

编译器不会报错,但运行时会 panic。改进:

\`\`\`rust
fn divide(a: i32, b: i32) -> Option<i32> {
  if b == 0 {
    None
  } else {
    Some(a / b)
  }
}
\`\`\`

现在类型系统强制你处理除零情况:

\`\`\`rust
match divide(10, 0) {
  Some(result) => println!("{}", result),
  None => println!("Cannot divide by zero"),
}
\`\`\`

编译期就知道可能返回 `None`,不处理就无法编译通过。
```

---

## 如何避免 AI 味

### AI 生成内容的典型特征

| 特征 | 示例 | 影响 |
|-----|------|------|
| **模糊词汇** | "可能"、"通常"、"一般来说" | 降低可信度 |
| **陈述式** | "X 是一个..." | 缺乏个人色彩 |
| **完美主义** | 从不提失败或困难 | 不真实 |
| **列表化** | 大量使用列表,缺少叙述 | 机械感强 |
| **无具体数据** | "性能很好"、"很快" | 无法验证 |

### 去 AI 味技巧

#### 1. 加入个人语气词

**对比**:

❌ **AI 味**:
```markdown
Rust 在系统编程中具有显著优势。其所有权系统确保内存安全。
```

✅ **人类味**:
```markdown
老实说,我最初对 Rust 的所有权系统很抵触。但用了半年后,
我发现它确实能避免很多愚蠢的错误——特别是那种凌晨 3 点
在生产环境调试的内存泄漏问题。
```

**语气词**:
- 老实说
- 坦白讲
- 说实话
- 在我看来
- 我的感受是

#### 2. 使用口语化表达

**对比**:

❌ **书面语**:
```markdown
经过充分的评估和深入的研究,我们最终选择了 Rust 作为
主要的开发语言。
```

✅ **口语化**:
```markdown
我们折腾了 2 个月,试了 Go、C++、Rust。最后选 Rust,
主要是因为它不用担心内存问题,而且性能也够快。
```

#### 3. 添加时间细节

**技巧**: 具体到天、周、月

**示例**:

```markdown
## 我的学习时间线

**第 1 周**(2022年3月1日-7日):
- 读完《The Book》前 5 章
- 写了第一个"Hello World"
- 遇到 20+ 个编译错误,很沮丧

**第 2-3 周**(3月8日-21日):
- 尝试写 CLI 工具
- 卡在生命周期问题上整整 3 天
- 在论坛得到帮助,开始理解借用

**第 4-8 周**(3月22日-4月30日):
- 完成第一个真实项目:图像处理工具
- 600 行代码,性能比 Python 快 8 倍
- 信心大增

**第 3-6 个月**(5月-8月):
- 学习 async/await 和 tokio
- 写了一个 Web 服务,QPS 达 5000
- 开始给 Rust 开源项目贡献代码
```

#### 4. 使用对话式标题

**对比**:

❌ **学术式**:
```markdown
## Rust 所有权系统的实现机制
```

✅ **对话式**:
```markdown
## 所有权系统到底在干什么?
## 为什么借用检查器总是报错?
## 我花了 2 周才理解的 3 个概念
```

---

## 权威引用技巧

### 引用来源分级

| 级别 | 来源类型 | 可信度 | 使用场景 |
|-----|---------|--------|---------|
| ⭐⭐⭐⭐⭐ | 官方文档/论文 | 极高 | 核心概念、API 说明 |
| ⭐⭐⭐⭐ | 权威调查/统计 | 高 | 市场趋势、采用率 |
| ⭐⭐⭐ | 技术博客(大厂) | 中高 | 实践经验、案例 |
| ⭐⭐ | 知名开发者博客 | 中 | 个人见解、技巧 |
| ⭐ | 一般博客 | 低 | 参考观点(需验证) |

### 引用格式标准

#### 格式 1: 行内引用(推荐)

```markdown
根据 Stack Overflow 2024 调查[1],Rust 连续 9 年被评为"最受喜爱的编程语言",
87% 的 Rust 开发者表示愿意继续使用[2]。

## 参考资料

[1] Stack Overflow Developer Survey 2024:
    https://survey.stackoverflow.co/2024

[2] Rust Developer Survey 2023:
    https://blog.rust-lang.org/2024/02/19/2023-Rust-Annual-Survey-2023-results.html
```

#### 格式 2: 引用块

```markdown
> 根据 Stack Overflow 2024 调查,Rust 连续 9 年被评为"最受喜爱的编程语言"。
>
> — Stack Overflow Developer Survey 2024

[来源链接](https://survey.stackoverflow.co/2024)
```

### 引用数量建议

| 文章长度 | 最少引用 | 推荐引用 | 类型分布 |
|---------|---------|---------|---------|
| < 1000字 | 3 | 5 | 2 官方 + 3 其他 |
| 1000-2000字 | 5 | 8 | 3 官方 + 5 其他 |
| > 2000字 | 8 | 12+ | 5 官方 + 7+ 其他 |

### 高质量引用来源

#### Rust 相关

- 官方文档: https://doc.rust-lang.org/
- Rust Blog: https://blog.rust-lang.org/
- RFC: https://rust-lang.github.io/rfcs/
- This Week in Rust: https://this-week-in-rust.org/

#### 通用资源

- Stack Overflow Survey: https://survey.stackoverflow.co/
- GitHub Octoverse: https://octoverse.github.com/
- ACM Digital Library: https://dl.acm.org/
- arXiv: https://arxiv.org/

---

## 数据和案例收集

### 数据收集方法

#### 1. 性能基准测试

**工具**:
- Criterion.rs(Rust 基准测试)
- hyperfine(命令行工具对比)

**示例**:

```rust
// benches/image_processing.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn bench_process(c: &mut Criterion) {
  c.bench_function("process 1000 images", |b| {
    b.iter(|| process_images(black_box(1000)))
  });
}

criterion_group!(benches, bench_process);
criterion_main!(benches);
```

**记录结果**:

```markdown
## 性能测试结果

测试环境:
- CPU: M1 Pro(8核)
- 内存: 16GB
- 图片: 10000张 5MB JPEG

| 实现 | 平均耗时 | 标准差 | 吞吐量 |
|-----|---------|--------|--------|
| Python | 120min | ±5min | 83 img/min |
| Go | 35min | ±2min | 285 img/min |
| Rust(单线程) | 45min | ±1min | 222 img/min |
| Rust(8核) | 15min | ±0.5min | **666 img/min** |

结论:Rust 并行版本比 Python 快 **8 倍**。
```

#### 2. 真实项目案例

**收集要素**:
- 项目背景
- 遇到的问题
- 解决方案
- 具体结果

**模板**:

```markdown
## 案例:图像处理服务优化

### 背景
2023年6月,我们的图像处理服务遇到瓶颈:
- 每天处理 10000+ 张产品图片
- Python 实现耗时 2 小时
- 客户要求降到 30 分钟内

### 问题分析
1. Python GIL 限制多核利用
2. PIL 库内存占用高(2.5GB 峰值)
3. 无法并行处理

### 解决方案
使用 Rust + rayon 重写:

\`\`\`rust
use rayon::prelude::*;
use image::DynamicImage;

fn process_images(paths: Vec<PathBuf>) -> Result<Vec<Image>> {
  paths
    .par_iter()  // 并行迭代器
    .map(|path| {
      let img = image::open(path)?;
      let resized = img.resize(800, 600, FilterType::Lanczos3);
      Ok(resized)
    })
    .collect()
}
\`\`\`

### 结果
- 处理时间: 120min → **15min**(8倍提升)
- 内存使用: 2.5GB → **1.2GB**(52% 减少)
- CPU 利用率: 25% → **95%**
- 成本节省: 减少 3 台服务器

### 代码仓库
https://github.com/example/rust-image-processor
```

#### 3. 数据来源清单

**建立素材库**:

```
materials/
├── raw/                  # 原始数据
│   ├── benchmarks/       # 性能测试结果
│   ├── surveys/          # 调查报告
│   └── papers/           # 学术论文
├── indexed/              # 主题索引
│   ├── performance.md    # 性能相关数据
│   ├── adoption.md       # 采用率数据
│   └── comparisons.md    # 语言对比数据
└── archive/              # 历史数据
```

**索引示例** (`materials/indexed/performance.md`):

```markdown
# Rust 性能数据索引

## 基准测试

### 1. 图像处理性能(2023-06)
- 来源: 个人项目
- 对比: Python vs Rust
- 结果: Rust 快 8 倍
- 文件: raw/benchmarks/image-processing-2023-06.md

### 2. Web 服务性能(2024-01)
- 来源: 生产环境
- QPS: 5000(单实例)
- 延迟: P99 < 10ms
- 文件: raw/benchmarks/web-service-2024-01.md

## 行业调查

### Stack Overflow Survey 2024
- 最受喜爱: 87%
- 使用率: 13%
- 来源: https://survey.stackoverflow.co/2024
```

---

## 为 llms.txt 优化内容结构

### 结构化写作

**原则**: 让 AI 能快速找到关键信息

#### 1. 使用清晰的标题层级

```markdown
# 主标题(H1): 文章主题

## 核心概念(H2): 基础知识

### 子概念(H3): 具体细节

## 实战案例(H2): 真实应用

### 案例 1(H3)

## 总结(H2)
```

#### 2. 添加结构化元数据

```markdown
---
title: "Rust 学习指南"
author: "张华"
published: "2024-03-15"
updated: "2024-10-20"
tags: ["Rust", "系统编程", "教程"]
category: "Tutorial"
difficulty: "Intermediate"
reading_time: "15 min"
e_e_a_t_score: 9.7
---
```

#### 3. 使用 TL;DR

```markdown
# Rust 学习指南

## TL;DR

- **目标读者**: 有其他语言基础的开发者
- **学习时长**: 2-3 个月
- **核心难点**: 所有权系统、生命周期
- **实战项目**: CLI 工具、Web 服务、WASM
- **性能提升**: 比 Python 快 5-10 倍
- **推荐资源**: The Rust Book、Rustlings

---

[正文内容...]
```

#### 4. 关键信息前置

```markdown
## 核心结论

在深入细节前,先说结论:

1. Rust 适合对性能和安全性有高要求的场景
2. 学习曲线陡峭,需要 2-3 个月入门
3. 生产环境表现优秀,我们的 Web 服务 QPS 达 5000+
4. 值得投入时间学习

[详细论证...]
```

---

## 写作流程

### 阶段 1: 准备(2-3 小时)

#### 1. 确定主题和目标

```markdown
# 写作计划

主题: Rust 学习指南
目标读者: 前端/后端开发者(有编程基础)
目标: 分享 2 年 Rust 实践经验,帮助新手快速入门
E-E-A-T 目标: 9.0+
预计字数: 2000 字
预计引用: 10 个权威来源
```

#### 2. 收集素材

- [ ] 个人经历记录(时间线、项目)
- [ ] 代码示例准备
- [ ] 权威引用来源
- [ ] 性能数据/截图
- [ ] 真实案例

#### 3. 创建大纲

```markdown
# Rust 学习指南 - 大纲

## 1. 我为什么学 Rust?(500 字)
- 2022 年遇到的性能瓶颈
- 评估 Go/C++/Rust 的过程
- 最终选择 Rust 的原因

## 2. 学习历程(800 字)
- 第 1-3 周:基础语法
- 第 4-8 周:第一个项目(CLI 工具)
- 第 3-6 个月:生产环境实践

## 3. 三个关键项目(600 字)
- 项目 1: CLI 工具
- 项目 2: WASM 图像处理
- 项目 3: Web 服务

## 4. 经验总结(100 字)
- 5 个最佳实践
- 3 个常见误区
```

### 阶段 2: 初稿(4-6 小时)

**技巧**:
- 快速完成初稿,不要追求完美
- 使用第一人称
- 插入代码示例占位符
- 标记需要补充的引用

### 阶段 3: 审校(2-3 小时)

#### 1. E-E-A-T 检查

```bash
geoify review draft.md

# 根据建议优化:
# - 添加作者信息
# - 补充权威引用
# - 增加具体数据
# - 完善联系方式
```

#### 2. 去 AI 味

- [ ] 替换模糊词汇("可能" → 具体数据)
- [ ] 添加个人语气词
- [ ] 加入失败经历
- [ ] 使用口语化表达

#### 3. 代码示例验证

- [ ] 所有代码可运行
- [ ] 添加注释说明
- [ ] 包含输出示例

### 阶段 4: 优化(1-2 小时)

#### 1. 生成 Schema.org

```bash
geoify schema final.md \
  --url "https://example.com/rust-guide" \
  --site-name "TechBlog"
```

#### 2. 优化 frontmatter

```yaml
---
title: "Rust 语言入门到实战:一位前端工程师的学习之旅"
description: "分享我 2 年 Rust 实践经验,从困惑到精通,包含 3 个真实项目案例"
author: "张华"
author_title: "高级软件工程师"
published: "2024-03-15"
updated: "2024-10-20"
tags: ["Rust", "系统编程", "Web开发", "性能优化"]
reading_time: "15 min"
---
```

#### 3. 最终检查

- [ ] E-E-A-T 得分 ≥ 9.0
- [ ] 字数 ≥ 1500
- [ ] 引用 ≥ 5 个权威来源
- [ ] 代码示例 ≥ 5 个
- [ ] 作者信息完整

---

## 内容检查清单

### ✅ 发布前检查

#### Experience(经验)

- [ ] 使用第一人称叙述(至少 5 处)
- [ ] 包含 2+ 个具体项目
- [ ] 分享真实挑战和解决方案
- [ ] 展示时间跨度(3 个月以上)

#### Expertise(专业性)

- [ ] 使用 10+ 个专业术语
- [ ] 包含 5+ 个完整代码示例
- [ ] 至少 1 处深度分析(原理/机制)
- [ ] 总结 3+ 个最佳实践

#### Authoritativeness(权威性)

- [ ] 引用 5+ 个权威来源(官方文档/论文)
- [ ] 包含 3+ 个具体数据
- [ ] 添加 3+ 个外部高质量链接
- [ ] 完整的作者信息(姓名+职位+背景+联系方式)

#### Trustworthiness(可信度)

- [ ] 所有陈述准确,无夸大
- [ ] 标注发布和更新日期
- [ ] 提供 2+ 个联系方式
- [ ] 说明内容适用范围和局限性

#### 技术要素

- [ ] 添加 frontmatter 元数据
- [ ] 生成 Schema.org 标记
- [ ] 优化标题层级(H1/H2/H3)
- [ ] 添加 TL;DR 摘要
- [ ] 检查所有链接有效
- [ ] 代码示例可运行

#### llms.txt 优化

- [ ] 清晰的标题结构
- [ ] 关键信息前置
- [ ] 避免过度嵌套
- [ ] 使用结构化元数据

---

## 延伸阅读

- [GEO 核心概念](./GEO_CONCEPTS.md) - 理解 GEO 的基本原理
- [E-E-A-T 指南](./EEAT_GUIDE.md) - 深入理解评分标准
- [案例研究](./CASE_STUDIES.md) - 9.7 分文章深度分析
- [完整工作流](./WORKFLOW_TUTORIAL.md) - 从构思到发布的详细步骤

---

**写真实的经历,让 AI 愿意引用!** ✨

*最后更新: 2025-11-03*
