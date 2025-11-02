/**
 * Schema.org 基础类型定义
 */

/** Schema.org 上下文 */
export const SCHEMA_CONTEXT = 'https://schema.org'

/** 基础 Schema 对象 */
export interface BaseSchema {
  '@context': string
  '@type': string
  [key: string]: any
}

/** Person Schema */
export interface PersonSchema extends BaseSchema {
  '@type': 'Person'
  name: string
  jobTitle?: string
  description?: string
  url?: string
  email?: string
  sameAs?: string[]
  image?: string
}

/** Organization Schema */
export interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization'
  name: string
  url?: string
  logo?: string
  sameAs?: string[]
}

/** Article Schema */
export interface ArticleSchema extends BaseSchema {
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle' | 'TechArticle'
  headline: string
  description?: string
  image?: string | string[]
  author: PersonSchema | OrganizationSchema
  publisher?: OrganizationSchema
  datePublished: string
  dateModified?: string
  mainEntityOfPage?: string
  keywords?: string[]
  articleSection?: string
  wordCount?: number
  inLanguage?: string
  citation?: Array<{
    '@type': 'CreativeWork'
    name: string
    url: string
  }>
}

/** HowTo Schema */
export interface HowToSchema extends BaseSchema {
  '@type': 'HowTo'
  name: string
  description?: string
  image?: string | string[]
  totalTime?: string
  estimatedCost?: {
    '@type': 'MonetaryAmount'
    currency: string
    value: string
  }
  tool?: string[]
  supply?: string[]
  step: Array<{
    '@type': 'HowToStep'
    name: string
    text: string
    image?: string
    url?: string
  }>
}

/** Review Schema */
export interface ReviewSchema extends BaseSchema {
  '@type': 'Review'
  reviewRating: {
    '@type': 'Rating'
    ratingValue: number
    bestRating?: number
    worstRating?: number
  }
  author: PersonSchema | OrganizationSchema
  reviewBody: string
  datePublished?: string
  itemReviewed: {
    '@type': string
    name: string
    description?: string
  }
}

/** FAQPage Schema */
export interface FAQPageSchema extends BaseSchema {
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

/** BreadcrumbList Schema */
export interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }>
}

/** 内容类型 */
export type ContentType = 'article' | 'howto' | 'review' | 'faq' | 'person'

/** Schema 生成选项 */
export interface SchemaOptions {
  /** 文章 URL */
  url?: string
  /** 网站名称 */
  siteName?: string
  /** 网站 Logo */
  siteLogo?: string
  /** 作者信息覆盖 */
  authorOverride?: Partial<PersonSchema>
  /** 语言 */
  language?: string
}
