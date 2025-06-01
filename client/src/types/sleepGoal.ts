export interface SleepGoal {
  id: number
  userId: number
  bedtimeTime: string
  wakeupTime: string
  targetSleepQuality: number
  targetConsistencyDays: number
  notes?: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSleepGoalDTO {
  userId: number
  bedtimeTime: string
  wakeupTime: string
  targetSleepQuality: number
  targetConsistencyDays: number
  notes?: string
}

export interface UpdateSleepGoalDTO {
  bedtimeTime?: string
  wakeupTime?: string
  targetSleepQuality?: number
  targetConsistencyDays?: number
  isActive?: boolean
} 