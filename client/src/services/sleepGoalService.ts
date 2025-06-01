import { api } from '../utils/api'
import { SleepGoal, CreateSleepGoalDTO, UpdateSleepGoalDTO } from '../types/sleepGoal'

export const sleepGoalService = {
  // 수면 목표 목록 조회
  async getGoals(userId: number): Promise<{ data: SleepGoal[] }> {
    const response = await api.get<{ data: SleepGoal[] }>(`/sleep-goals/${userId}`)
    return response.data
  },

  // 수면 목표 상세 조회
  async getGoal(goalId: number): Promise<{ data: SleepGoal }> {
    const response = await api.get<{ data: SleepGoal }>(`/sleep-goals/${goalId}`)
    return response.data
  },

  // 수면 목표 생성
  async createGoal(data: CreateSleepGoalDTO): Promise<{ data: SleepGoal }> {
    const response = await api.post<{ data: SleepGoal }>('/sleep-goals', data)
    return response.data
  },

  // 수면 목표 수정
  async updateGoal(goalId: number, data: UpdateSleepGoalDTO): Promise<{ data: SleepGoal }> {
    const response = await api.put<{ data: SleepGoal }>(`/sleep-goals/${goalId}`, data)
    return response.data
  },

  // 수면 목표 삭제
  async deleteGoal(goalId: number): Promise<void> {
    await api.delete(`/sleep-goals/${goalId}`)
  }
} 