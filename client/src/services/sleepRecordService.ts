import { api } from '../utils/api'
import {
  SleepRecord,
  CreateSleepRecordDTO,
  UpdateSleepRecordDTO,
  SleepStats,
  WeeklySleepPattern,
  MonthlySleepPattern,
} from '../types/sleep'

export const sleepRecordService = {
  // 수면 기록 목록 조회
  async getRecords(): Promise<{ data: SleepRecord[] }> {
    const response = await api.get<{ data: SleepRecord[] }>(`/sleep-records`)
    return response.data
  },

  // 수면 기록 상세 조회
  async getRecord(recordId: number): Promise<{ data: SleepRecord }> {
    const response = await api.get<{ data: SleepRecord }>(`/sleep-records/record/${recordId}`)
    return response.data
  },

  // 수면 기록 생성
  async createRecord(data: CreateSleepRecordDTO): Promise<{ data: SleepRecord }> {
    const response = await api.post<{ data: SleepRecord }>('/sleep-records', data)
    return response.data
  },

  // 수면 기록 수정
  async updateRecord(recordId: number, data: UpdateSleepRecordDTO): Promise<{ data: SleepRecord }> {
    const response = await api.put<{ data: SleepRecord }>(`/sleep-records/${recordId}`, data)
    return response.data
  },

  // 수면 기록 삭제
  async deleteRecord(recordId: number): Promise<void> {
    await api.delete(`/sleep-records/${recordId}`)
  },

  // 최근 수면 기록 조회
  async getRecentRecords(userId: number, limit: number = 7): Promise<{ data: SleepRecord[] }> {
    const response = await api.get<{ data: SleepRecord[] }>(`/sleep-records/${userId}/recent`, {
      params: { limit }
    })
    return response.data
  },

  // 수면 통계 조회
  async getStats(userId: number): Promise<{ data: SleepStats }> {
    const response = await api.get<{ data: SleepStats }>(`/sleep-records/stats/${userId}`)
    return response.data
  },

  // 주간 수면 패턴 조회
  async getWeeklyPattern(userId: number): Promise<{ data: WeeklySleepPattern[] }> {
    const response = await api.get<{ data: WeeklySleepPattern[] }>(`/sleep-records/weekly-pattern/${userId}`)
    return response.data
  },

  // 월간 수면 패턴 조회
  async getMonthlyPattern(userId: number): Promise<{ data: MonthlySleepPattern[] }> {
    const response = await api.get<{ data: MonthlySleepPattern[] }>(`/sleep-records/monthly-pattern/${userId}`)
    return response.data
  },

  // 수면 통계 조회
  async getSleepStats(userId: number): Promise<SleepStats> {
    const response = await fetch(`/sleep-records/stats/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch sleep stats')
    }
    return response.json()
  },

  // 주간 수면 패턴 조회
  async getWeeklySleepPattern(userId: number): Promise<WeeklySleepPattern[]> {
    const response = await fetch(`/sleep-records/weekly-pattern/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch weekly sleep pattern')
    }
    return response.json()
  },

  // 월간 수면 패턴 조회
  async getMonthlySleepPattern(userId: number): Promise<MonthlySleepPattern[]> {
    const response = await fetch(`/sleep-records/monthly-pattern/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch monthly sleep pattern')
    }
    return response.json()
  },
} 