export interface SleepPattern {
  avgSleepTime: number
  avgSleepQuality: number
  consistency: number
  recommendedBedtime: string
  recommendedWakeupTime: string
}

export interface SleepRecommendation {
  pattern: SleepPattern
  suggestions: string[]
  improvements: {
    sleepTime: number
    sleepQuality: number
  }
}

export interface SleepAnalysis {
  overallStats: {
    avgSleepTime: number
    avgSleepQuality: number
    consistency: number
  }
  weeklyPattern: {
    avgSleepTime: number
    avgSleepQuality: number
    consistency: number
  }
  monthlyPattern: {
    avgSleepTime: number
    avgSleepQuality: number
    consistency: number
  }
  recommendations: string[]
  environmentImpact: Array<{
    factor: string
    correlation: number
    impact: 'positive' | 'negative' | 'neutral'
  }>
}

export interface WeeklySleepPattern {
  day: string
  avgSleepTime: number
  avgSleepQuality: number
  consistency: number
}

export interface MonthlySleepPattern {
  week: number
  avgSleepTime: number
  avgSleepQuality: number
  consistency: number
}

export interface SleepAnalysisService {
  analyzeSleepPattern(userId: number): Promise<SleepPattern>
  getSleepRecommendations(userId: number): Promise<SleepRecommendation>
  getSleepAnalysis(userId: number): Promise<SleepAnalysis>
} 