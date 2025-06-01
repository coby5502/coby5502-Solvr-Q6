export interface SleepAnalysis {
  userId: number
  averageSleepHours: number
  sleepQuality: number
  consistencyScore: number
  environmentImpact: EnvironmentImpact
  recommendations: SleepRecommendation[]
  lastAnalysisDate: string
}

export interface EnvironmentImpact {
  temperature: number
  noise: number
  light: number
  humidity: number
  overallScore: number
}

export interface SleepRecommendation {
  id: number
  title: string
  description: string
  type: 'environment' | 'routine' | 'lifestyle'
  priority: 'high' | 'medium' | 'low'
  isCompleted: boolean
  createdAt: string
  updatedAt: string
} 