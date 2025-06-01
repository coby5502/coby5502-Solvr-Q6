import { eq, and, sql } from 'drizzle-orm'
import { sleepRecords, sleepEnvironment } from '../db/schema'
import { Database } from '../types/database'
import { SleepPattern, SleepRecommendation, SleepAnalysis, WeeklySleepPattern, MonthlySleepPattern } from '../types/sleepAnalysis'
import { db } from '../db'

type SleepAnalysisServiceDeps = {
  db: Database
}

export const createSleepAnalysisService = ({ db }: SleepAnalysisServiceDeps) => {
  const analyzeSleepPattern = async (userId: number): Promise<SleepPattern> => {
    const records = await db.select()
      .from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(sql`${sleepRecords.sleepStart} DESC`)
      .limit(30)

    if (records.length === 0) {
      return {
        avgSleepTime: 0,
        avgSleepQuality: 0,
        consistency: 0,
        recommendedBedtime: new Date().toISOString(),
        recommendedWakeupTime: new Date().toISOString()
      }
    }

    const avgSleepTime = records.reduce((acc, record) => {
      const sleepTime = (new Date(record.sleepEnd).getTime() - new Date(record.sleepStart).getTime()) / (1000 * 60 * 60)
      return acc + sleepTime
    }, 0) / records.length

    const avgSleepQuality = records.reduce((acc, record) => acc + record.sleepQuality, 0) / records.length

    const consistency = calculateConsistency(records)

    const recommendedBedtime = calculateRecommendedBedtime(records)
    const recommendedWakeupTime = calculateRecommendedWakeupTime(records)

    return {
      avgSleepTime,
      avgSleepQuality,
      consistency,
      recommendedBedtime,
      recommendedWakeupTime
    }
  }

  const getSleepRecommendations = async (userId: number): Promise<SleepRecommendation> => {
    try {
      const pattern = await analyzeSleepPattern(userId)
      
      return {
        pattern,
        suggestions: await getRecommendations(userId),
        improvements: {
          sleepTime: calculateSleepTimeImprovement(pattern.avgSleepTime),
          sleepQuality: calculateSleepQualityImprovement(pattern.avgSleepQuality)
        }
      }
    } catch (error) {
      console.error('Error getting sleep recommendations:', error)
      throw error
    }
  }

  const calculateWeeklyPattern = async (userId: number): Promise<WeeklySleepPattern[]> => {
    const records = await db.select()
      .from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(sql`date(${sleepRecords.sleepStart}) DESC`)

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const patterns: WeeklySleepPattern[] = []

    for (const day of days) {
      const dayRecords = records.filter(record => {
        const date = new Date(record.sleepStart)
        return date.toLocaleDateString('en-US', { weekday: 'long' }) === day
      })

      if (dayRecords.length > 0) {
        const totalSleepMinutes = dayRecords.reduce((acc, record) => {
          const start = new Date(record.sleepStart)
          const end = new Date(record.sleepEnd)
          return acc + (end.getTime() - start.getTime()) / (1000 * 60)
        }, 0)
        const avgSleepMinutes = totalSleepMinutes / dayRecords.length
        const avgSleepHours = Math.floor(avgSleepMinutes / 60)
        const avgSleepMinutesRemainder = Math.round(avgSleepMinutes % 60)
        const avgSleepTime = `${avgSleepHours}:${avgSleepMinutesRemainder.toString().padStart(2, '0')}`

        const avgSleepQuality = dayRecords.reduce((acc, record) => acc + record.sleepQuality, 0) / dayRecords.length

        const sleepTimes = dayRecords.map(record => {
          const start = new Date(record.sleepStart)
          return start.getHours() * 60 + start.getMinutes()
        })
        const mean = sleepTimes.reduce((acc, time) => acc + time, 0) / sleepTimes.length
        const variance = sleepTimes.reduce((acc, time) => acc + Math.pow(time - mean, 2), 0) / sleepTimes.length
        const consistency = 100 - Math.min(Math.sqrt(variance) / 60 * 100, 100)

        patterns.push({
          day,
          avgSleepTime: parseFloat(avgSleepTime),
          avgSleepQuality,
          consistency
        })
      }
    }

    return patterns
  }

  const calculateMonthlyPattern = async (userId: number): Promise<MonthlySleepPattern[]> => {
    const records = await db.select()
      .from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(sql`date(${sleepRecords.sleepStart}) DESC`)

    const patterns: MonthlySleepPattern[] = []
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const monthRecords = records.filter(record => {
      const date = new Date(record.sleepStart)
      return date >= firstDayOfMonth && date <= lastDayOfMonth
    })

    const weeks = Math.ceil((lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + 1) / 7)

    for (let week = 0; week < weeks; week++) {
      const weekStart = new Date(firstDayOfMonth)
      weekStart.setDate(firstDayOfMonth.getDate() + week * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const weekRecords = monthRecords.filter(record => {
        const date = new Date(record.sleepStart)
        return date >= weekStart && date <= weekEnd
      })

      if (weekRecords.length > 0) {
        const totalSleepMinutes = weekRecords.reduce((acc, record) => {
          const start = new Date(record.sleepStart)
          const end = new Date(record.sleepEnd)
          return acc + (end.getTime() - start.getTime()) / (1000 * 60)
        }, 0)
        const avgSleepMinutes = totalSleepMinutes / weekRecords.length
        const avgSleepHours = Math.floor(avgSleepMinutes / 60)
        const avgSleepMinutesRemainder = Math.round(avgSleepMinutes % 60)
        const avgSleepTime = `${avgSleepHours}:${avgSleepMinutesRemainder.toString().padStart(2, '0')}`

        const avgSleepQuality = weekRecords.reduce((acc, record) => acc + record.sleepQuality, 0) / weekRecords.length

        const sleepTimes = weekRecords.map(record => {
          const start = new Date(record.sleepStart)
          return start.getHours() * 60 + start.getMinutes()
        })
        const mean = sleepTimes.reduce((acc, time) => acc + time, 0) / sleepTimes.length
        const variance = sleepTimes.reduce((acc, time) => acc + Math.pow(time - mean, 2), 0) / sleepTimes.length
        const consistency = 100 - Math.min(Math.sqrt(variance) / 60 * 100, 100)

        patterns.push({
          week: week + 1,
          avgSleepTime: parseFloat(avgSleepTime),
          avgSleepQuality,
          consistency
        })
      }
    }

    return patterns
  }

  const calculateSleepTimeImprovement = (currentTime: number): number => {
    const targetMinutes = 8 * 60 // 8시간 목표
    return Math.max(0, targetMinutes - currentTime) / 60
  }

  const calculateSleepQualityImprovement = (currentQuality: number): number => {
    return Math.max(0, 5 - currentQuality)
  }

  const getRecommendations = async (userId: number): Promise<string[]> => {
    const pattern = await analyzeSleepPattern(userId)
    const recommendations: string[] = []

    if (pattern.avgSleepTime < 7) {
      recommendations.push('수면 시간이 부족합니다. 하루 7-9시간의 수면을 목표로 하세요.')
    } else if (pattern.avgSleepTime > 9) {
      recommendations.push('수면 시간이 너무 깁니다. 하루 7-9시간의 수면을 목표로 하세요.')
    }

    if (pattern.avgSleepQuality < 3) {
      recommendations.push('수면의 질이 낮습니다. 수면 환경을 개선하고 수면 위생을 실천해보세요.')
    }

    return recommendations
  }

  const getEnvironmentImpact = async (userId: number) => {
    const records = await db.select()
      .from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(sql`${sleepRecords.sleepStart} DESC`)
      .limit(30)

    const environments = await db.select()
      .from(sleepEnvironment)
      .where(eq(sleepEnvironment.userId, userId))
      .orderBy(sql`${sleepEnvironment.createdAt} DESC`)
      .limit(30)

    const impacts: Array<{
      factor: string
      correlation: number
      impact: 'positive' | 'negative' | 'neutral'
    }> = []

    if (records.length > 0 && environments.length > 0) {
      const sleepQualities = records.map(record => record.sleepQuality)
      const temperatures = environments.map(env => env.temperature || 0)
      const humidities = environments.map(env => env.humidity || 0)
      const noiseLevels = environments.map(env => env.noiseLevel || 0)
      const lightLevels = environments.map(env => env.lightLevel || 0)

      const tempCorrelation = calculateCorrelation(sleepQualities, temperatures)
      const humidityCorrelation = calculateCorrelation(sleepQualities, humidities)
      const noiseCorrelation = calculateCorrelation(sleepQualities, noiseLevels)
      const lightCorrelation = calculateCorrelation(sleepQualities, lightLevels)

      impacts.push({
        factor: 'temperature',
        correlation: tempCorrelation,
        impact: tempCorrelation > 0.3 ? 'positive' : tempCorrelation < -0.3 ? 'negative' : 'neutral'
      })

      impacts.push({
        factor: 'humidity',
        correlation: humidityCorrelation,
        impact: humidityCorrelation > 0.3 ? 'positive' : humidityCorrelation < -0.3 ? 'negative' : 'neutral'
      })

      impacts.push({
        factor: 'noise',
        correlation: noiseCorrelation,
        impact: noiseCorrelation > 0.3 ? 'positive' : noiseCorrelation < -0.3 ? 'negative' : 'neutral'
      })

      impacts.push({
        factor: 'light',
        correlation: lightCorrelation,
        impact: lightCorrelation > 0.3 ? 'positive' : lightCorrelation < -0.3 ? 'negative' : 'neutral'
      })
    }

    return impacts
  }

  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = Math.min(x.length, y.length)
    if (n === 0) return 0

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0)
    const sumX2 = x.reduce((a, b) => a + b * b, 0)
    const sumY2 = y.reduce((a, b) => a + b * b, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
  }

  const calculateConsistency = (records: any[]): number => {
    if (records.length === 0) return 0

    const sleepTimes = records.map(record => {
      const start = new Date(record.sleepStart)
      return start.getHours() * 60 + start.getMinutes()
    })

    const mean = sleepTimes.reduce((acc, time) => acc + time, 0) / sleepTimes.length
    const variance = sleepTimes.reduce((acc, time) => acc + Math.pow(time - mean, 2), 0) / sleepTimes.length

    return 100 - Math.min(Math.sqrt(variance) / 60 * 100, 100)
  }

  const calculateVariance = (values: number[]): number => {
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length
    return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
  }

  const calculateRecommendedBedtime = (records: any[]): string => {
    if (records.length === 0) return new Date().toISOString()

    const bedtimes = records.map(record => new Date(record.sleepStart))
    const avgBedtime = new Date(bedtimes.reduce((acc, date) => acc + date.getTime(), 0) / bedtimes.length)

    return avgBedtime.toISOString()
  }

  const calculateRecommendedWakeupTime = (records: any[]): string => {
    if (records.length === 0) return new Date().toISOString()

    const wakeupTimes = records.map(record => new Date(record.sleepEnd))
    const avgWakeupTime = new Date(wakeupTimes.reduce((acc, date) => acc + date.getTime(), 0) / wakeupTimes.length)

    return avgWakeupTime.toISOString()
  }

  const getSleepAnalysis = async (userId: number): Promise<SleepAnalysis> => {
    const pattern = await analyzeSleepPattern(userId)
    const weeklyPatterns = await calculateWeeklyPattern(userId)
    const monthlyPatterns = await calculateMonthlyPattern(userId)
    const recommendations = await getRecommendations(userId)
    const environmentImpact = await getEnvironmentImpact(userId)

    const weeklyAvg = weeklyPatterns.reduce((acc, pattern) => ({
      avgSleepTime: acc.avgSleepTime + pattern.avgSleepTime,
      avgSleepQuality: acc.avgSleepQuality + pattern.avgSleepQuality,
      consistency: acc.consistency + pattern.consistency
    }), {
      avgSleepTime: 0,
      avgSleepQuality: 0,
      consistency: 0
    })

    const monthlyAvg = monthlyPatterns.reduce((acc, pattern) => ({
      avgSleepTime: acc.avgSleepTime + pattern.avgSleepTime,
      avgSleepQuality: acc.avgSleepQuality + pattern.avgSleepQuality,
      consistency: acc.consistency + pattern.consistency
    }), {
      avgSleepTime: 0,
      avgSleepQuality: 0,
      consistency: 0
    })

    return {
      overallStats: {
        avgSleepTime: pattern.avgSleepTime,
        avgSleepQuality: pattern.avgSleepQuality,
        consistency: pattern.consistency
      },
      weeklyPattern: {
        avgSleepTime: weeklyAvg.avgSleepTime / weeklyPatterns.length,
        avgSleepQuality: weeklyAvg.avgSleepQuality / weeklyPatterns.length,
        consistency: weeklyAvg.consistency / weeklyPatterns.length
      },
      monthlyPattern: {
        avgSleepTime: monthlyAvg.avgSleepTime / monthlyPatterns.length,
        avgSleepQuality: monthlyAvg.avgSleepQuality / monthlyPatterns.length,
        consistency: monthlyAvg.consistency / monthlyPatterns.length
      },
      recommendations,
      environmentImpact
    }
  }

  return {
    analyzeSleepPattern,
    getSleepRecommendations,
    getSleepAnalysis
  }
}

export type SleepAnalysisService = ReturnType<typeof createSleepAnalysisService>

export const sleepAnalysisService = createSleepAnalysisService({ db }) 