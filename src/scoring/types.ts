/**
 * E-E-A-T 评分系统类型定义
 */

/** E-E-A-T 总体评分结果 */
export interface EEATScore {
  /** 总分 (0-10) */
  overall: number
  /** 各维度得分 */
  breakdown: {
    experience: number
    expertise: number
    authoritativeness: number
    trustworthiness: number
  }
  /** 详细评分项 */
  details: ScoreDetails
  /** 优化建议 */
  recommendations: Recommendation[]
  /** 评分时间 */
  timestamp: string
}

/** 详细评分项 */
export interface ScoreDetails {
  experience: ExperienceDetails
  expertise: ExpertiseDetails
  authoritativeness: AuthoritativenessDetails
  trustworthiness: TrustworthinessDetails
}

/** Experience (体验) 详情 */
export interface ExperienceDetails {
  score: number
  checks: {
    hasFirstPerson: CheckResult
    hasSpecificDetails: CheckResult
    hasRealCases: CheckResult
    avoidsVagueTerms: CheckResult
  }
}

/** Expertise (专业性) 详情 */
export interface ExpertiseDetails {
  score: number
  checks: {
    hasTechnicalDetails: CheckResult
    hasDeepAnalysis: CheckResult
    avoidsCommonKnowledge: CheckResult
    hasUniqueInsights: CheckResult
  }
}

/** Authoritativeness (权威性) 详情 */
export interface AuthoritativenessDetails {
  score: number
  checks: {
    hasCitations: CheckResult
    citationCount: CheckResult
    hasAuthorCredentials: CheckResult
    hasExternalLinks: CheckResult
  }
}

/** Trustworthiness (可信度) 详情 */
export interface TrustworthinessDetails {
  score: number
  checks: {
    allDataSourced: CheckResult
    hasPublishDate: CheckResult
    hasUpdateDate: CheckResult
    hasContactInfo: CheckResult
  }
}

/** 检查结果 */
export interface CheckResult {
  /** 是否通过 */
  passed: boolean
  /** 得分 (0-1) */
  score: number
  /** 说明 */
  message: string
  /** 具体数据 */
  data?: any
}

/** 优化建议 */
export interface Recommendation {
  /** 维度 */
  dimension: 'experience' | 'expertise' | 'authoritativeness' | 'trustworthiness'
  /** 优先级 */
  priority: 'high' | 'medium' | 'low'
  /** 建议内容 */
  message: string
  /** 影响分数 */
  impact: number
}

/** 文章内容分析结果 */
export interface ContentAnalysis {
  /** 文章内容 */
  content: string
  /** Frontmatter */
  frontmatter?: Record<string, any>
  /** 词数 */
  wordCount: number
  /** 段落数 */
  paragraphCount: number
  /** 标题数 */
  headingCount: number
  /** 链接数 */
  linkCount: number
  /** 引用数 */
  citationCount: number
  /** 代码块数 */
  codeBlockCount: number
  /** 列表数 */
  listCount: number
  /** 图片数 */
  imageCount: number
}

/** 评分器选项 */
export interface ScorerOptions {
  /** 目标分数 */
  target?: {
    experience?: number
    expertise?: number
    authoritativeness?: number
    trustworthiness?: number
  }
  /** 严格模式 */
  strict?: boolean
  /** 详细输出 */
  verbose?: boolean
}
