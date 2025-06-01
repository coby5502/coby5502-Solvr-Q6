import { api } from '../utils/api'
import { SleepAnalysis, EnvironmentImpact, SleepRecommendation } from '../types/sleepAnalysis'
import { WeeklySleepPattern, MonthlySleepPattern } from '../types/sleep'

export const sleepAnalysisService = {
  // 수면 분석 데이터 조회
  async getSleepAnalysis(userId: number): Promise<SleepAnalysis> {
    const response = await api.get<{ data: SleepAnalysis }>(`/api/sleep-analysis?userId=${userId}`)
    return response.data.data
  },

  // 수면 통계 조회
  async getSleepStats(userId: number): Promise<{ data: { totalHours: number; averageHours: number; averageQuality: number } }> {
    const response = await api.get<{ data: { totalHours: number; averageHours: number; averageQuality: number } }>(`/api/sleep-analysis/stats/${userId}`)
    return response.data
  },

  // 주간 수면 패턴 조회
  async getWeeklyPattern(): Promise<{ data: any }> {
    const response = await api.get<{ data: any }>('/sleep-analysis/weekly')
    return response.data
  },

  // 월간 수면 패턴 조회
  async getMonthlyPattern(): Promise<{ data: any }> {
    const response = await api.get<{ data: any }>('/sleep-analysis/monthly')
    return response.data
  },

  // 수면 추천사항 조회
  async getRecommendations(): Promise<{ data: string[] }> {
    const response = await api.get<{ data: string[] }>('/sleep-analysis/recommendations')
    return response.data
  },

  // 수면 환경 영향 조회
  async getEnvironmentImpact(userId: number): Promise<{ data: EnvironmentImpact[] }> {
    const response = await api.get<{ data: EnvironmentImpact[] }>(`/api/sleep-analysis/environment/${userId}`)
    return response.data
  },

  // 수면 패턴 분석
  async getSleepPattern(userId: number): Promise<SleepAnalysis> {
    const response = await api.get(`/sleep-analysis/pattern/${userId}`)
    return response.data.data
  },

  // 수면 추천사항 조회
  async getSleepRecommendations(userId: number): Promise<SleepRecommendation> {
    const response = await api.get(`/sleep-analysis/recommendations/${userId}`)
    return response.data.data
  },

  // 수면 통계 조회
  async getStats(userId: number): Promise<SleepStats> {
    const response = await api.get<SleepStats>(`/sleep-analysis/${userId}/stats`)
    return response.data
  }
} 