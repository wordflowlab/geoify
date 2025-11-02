#!/usr/bin/env tsx

import { performance } from 'perf_hooks'
import { EEATScorer } from './src/scoring/eeat-scorer.js'
import { SchemaGenerator } from './src/schema/schema-generator.js'
import fs from 'fs-extra'

console.log('🚀 Geoify 性能基准测试\n')
console.log('=' .repeat(60))

// 读取示例文章
const markdown = await fs.readFile('examples/complete-workflow/draft.md', 'utf-8')

// 1. E-E-A-T 评分性能
console.log('\n📊 E-E-A-T 评分性能')
console.log('-'.repeat(60))

const scorer = new EEATScorer()
const iterations = 100

let totalTime = 0
for (let i = 0; i < iterations; i++) {
  const start = performance.now()
  scorer.score(markdown)
  const end = performance.now()
  totalTime += (end - start)
}

const avgTime = totalTime / iterations
console.log(`迭代次数: ${iterations}`)
console.log(`总耗时: ${totalTime.toFixed(2)}ms`)
console.log(`平均耗时: ${avgTime.toFixed(2)}ms`)
console.log(`吞吐量: ${(1000 / avgTime).toFixed(2)} 次/秒`)

// 2. Schema 生成性能
console.log('\n🔧 Schema 生成性能')
console.log('-'.repeat(60))

const generator = new SchemaGenerator()

totalTime = 0
for (let i = 0; i < iterations; i++) {
  const start = performance.now()
  generator.generate(markdown)
  const end = performance.now()
  totalTime += (end - start)
}

const avgSchemaTime = totalTime / iterations
console.log(`迭代次数: ${iterations}`)
console.log(`总耗时: ${totalTime.toFixed(2)}ms`)
console.log(`平均耗时: ${avgSchemaTime.toFixed(2)}ms`)
console.log(`吞吐量: ${(1000 / avgSchemaTime).toFixed(2)} 次/秒`)

// 3. 文章大小测试
console.log('\n📝 不同文章大小性能')
console.log('-'.repeat(60))

const sizes = [500, 1000, 2000, 5000, 10000]
for (const size of sizes) {
  const testContent = markdown.slice(0, size)

  const start = performance.now()
  scorer.score(testContent)
  const end = performance.now()

  console.log(`${size} 字符: ${(end - start).toFixed(2)}ms`)
}

// 4. 内存使用
console.log('\n💾 内存使用情况')
console.log('-'.repeat(60))

const memBefore = process.memoryUsage()
for (let i = 0; i < 1000; i++) {
  scorer.score(markdown)
}
const memAfter = process.memoryUsage()

console.log(`堆内存使用: ${((memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024).toFixed(2)}MB`)
console.log(`外部内存: ${((memAfter.external - memBefore.external) / 1024 / 1024).toFixed(2)}MB`)

console.log('\n' + '='.repeat(60))
console.log('✅ 基准测试完成\n')
