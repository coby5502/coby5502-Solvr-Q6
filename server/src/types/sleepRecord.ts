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

export interface SleepRecordService {
  getRecords(userId: number, options?: GetRecordsOptions): Promise<SleepRecord[]>
  getSleepRecordById(id: number): Promise<SleepRecord | null>
  createSleepRecord(data: CreateSleepRecordDTO): Promise<SleepRecord>
  updateSleepRecord(id: number, data: UpdateSleepRecordDTO): Promise<SleepRecord>
  deleteSleepRecord(id: number): Promise<void>
  getSleepStats(userId: number): Promise<SleepStats>
  getWeeklySleepPattern(userId: number): Promise<WeeklySleepPattern[]>
  getMonthlySleepPattern(userId: number): Promise<MonthlySleepPattern[]>
  getRecentRecords(userId: number, limit?: number): Promise<SleepRecord[]>
} 