export interface SleepRecord {
  id: number
  userId: number
  startTime: string
  endTime: string
  sleepDuration: number
  sleepQuality: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSleepRecordDTO {
  userId: number
  startTime: string
  endTime: string
  sleepDuration: number
  sleepQuality: number
  notes?: string
}

export interface UpdateSleepRecordDTO {
  startTime?: string
  endTime?: string
  sleepDuration?: number
  sleepQuality?: number
  notes?: string
}

export interface SleepStats {
  averageSleepDuration: number
  averageSleepQuality: number
  consistencyScore: number
  bestSleepQuality: number
  worstSleepQuality: number
}

export interface WeeklySleepPattern {
  date: string
  sleepDuration: number
  sleepQuality: number
}

export interface MonthlySleepPattern {
  date: string
  averageSleepDuration: number
  averageSleepQuality: number
}

export interface SleepAnalysis {
  overallStats: SleepStats
  weeklyPattern: WeeklySleepPattern[]
  monthlyPattern: MonthlySleepPattern[]
  recommendations: string[]
  environmentImpact: {
    noiseLevel: number
    temperature: number
    humidity: number
    lightLevel: number
    mattressComfort: number
    pillowComfort: number
    roomVentilation: number
  }
} 