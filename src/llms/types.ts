/**
 * llms.txt 生成器的类型定义
 */

/**
 * 文章元数据
 */
export interface ArticleMetadata {
  title: string
  description?: string
  url: string
  tags?: string[]
  category?: string
  publishDate?: string
  author?: string
  eeatlScore?: number
  filePath: string
}

/**
 * 分类配置
 */
export interface CategoryConfig {
  tags: string[]
  priority: number
  label?: string
}

/**
 * llms.txt 生成器配置
 */
export interface LlmsTxtConfig {
  siteName: string
  siteUrl: string
  siteDescription: string
  categories?: {
    [key: string]: CategoryConfig
  }
  minEEATScore?: number
  maxArticles?: number
}

/**
 * llms.txt 生成结果
 */
export interface LlmsTxtOutput {
  llmsTxt: string
  llmsFullTxt: string
  metadata: {
    totalArticles: number
    categorizedArticles: number
    uncategorizedArticles: number
    averageEEATScore: number
    generatedAt: string
  }
}

/**
 * 文章分类结果
 */
export interface CategorizedArticles {
  [category: string]: ArticleMetadata[]
}
