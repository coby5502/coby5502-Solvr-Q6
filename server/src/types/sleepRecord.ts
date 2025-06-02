export interface SleepRecord {
  id: number
  userId: number
  sleepStart: string
  sleepEnd: string
  sleepQuality: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSleepRecordDTO {
  userId: number
  sleepStart: string
  sleepEnd: string
  sleepQuality: number
  notes?: string
}

export interface UpdateSleepRecordDTO {
  sleepStart?: string
  sleepEnd?: string
  sleepQuality?: number
  notes?: string
}

export interface SleepStats {
  avgSleepTime: number
  avgSleepQuality: number
  totalRecords: number
  weeklyPattern: {
    day: string
    avgSleepTime: number
    avgSleepQuality: number
  }[]
  monthlyPattern: {
    date: string
    avgSleepTime: number
    avgSleepQuality: number
  }[]
}

export interface WeeklySleepPattern {
  date: string
  avgSleepTime: number
  avgSleepQuality: number
}

export interface MonthlySleepPattern {
  month: string
  avgSleepTime: number
  avgSleepQuality: number
  recordCount: number
}

export interface GetRecordsOptions {
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}