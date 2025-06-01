export interface SleepGoal {
  id: number
  userId: number
  bedtimeTime: string
  wakeupTime: string
  targetSleepQuality: number
  createdAt: string
  updatedAt: string
}

export interface CreateSleepGoalDTO {
  userId: number
  bedtimeTime: string
  wakeupTime: string
  targetSleepQuality: number
}

export interface UpdateSleepGoalDTO {
  bedtimeTime?: string
  wakeupTime?: string
  targetSleepQuality?: number
} 