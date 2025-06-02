import { eq, and, desc, sql } from 'drizzle-orm'
import { sleepRecords } from '../db/schema'
import { SleepRecord, CreateSleepRecordDTO, UpdateSleepRecordDTO, SleepStats, WeeklySleepPattern, MonthlySleepPattern, GetRecordsOptions } from '../types/sleepRecord'
import { db } from '../db'

type SleepRecordServiceDeps = {
  db: any
}

export const createSleepRecordService = ({ db }: SleepRecordServiceDeps) => {
  const getAllSleepRecords = async (userId: number): Promise<SleepRecord[]> => {
    const rows = await db.select().from(sleepRecords).where(eq(sleepRecords.userId, userId)).orderBy(desc(sleepRecords.sleepStart))
    return rows.map((r: any) => ({ ...r, notes: r.notes === null ? undefined : r.notes }))
  }

  const getSleepRecordById = async (id: number): Promise<SleepRecord | null> => {
    const result = await db.select().from(sleepRecords).where(eq(sleepRecords.id, id))
    if (!result[0]) return null
    const r = result[0]
    return { ...r, notes: r.notes === null ? undefined : r.notes }
  }

  const createSleepRecord = async (data: CreateSleepRecordDTO): Promise<SleepRecord> => {
    const now = new Date().toISOString()
    await db.insert(sleepRecords).values({
      userId: data.userId,
      sleepStart: data.sleepStart,
      sleepEnd: data.sleepEnd,
      sleepQuality: data.sleepQuality as 1 | 2 | 3 | 4 | 5,
      notes: data.notes,
      createdAt: now,
      updatedAt: now
    })
    const result = await db.select().from(sleepRecords).where(and(eq(sleepRecords.userId, data.userId), eq(sleepRecords.sleepStart, data.sleepStart))).orderBy(desc(sleepRecords.id))
    const r = result[0]
    return { ...r, notes: r.notes === null ? undefined : r.notes }
  }

  const updateSleepRecord = async (id: number, data: UpdateSleepRecordDTO): Promise<SleepRecord> => {
    const updates: any = {}
    if (data.sleepStart) updates.sleepStart = data.sleepStart
    if (data.sleepEnd) updates.sleepEnd = data.sleepEnd
    if (data.sleepQuality) updates.sleepQuality = data.sleepQuality as 1 | 2 | 3 | 4 | 5
    if (data.notes !== undefined) updates.notes = data.notes
    updates.updatedAt = new Date().toISOString()
    await db.update(sleepRecords).set(updates).where(eq(sleepRecords.id, id))
    const updated = await db.select().from(sleepRecords).where(eq(sleepRecords.id, id))
    if (!updated[0]) throw new Error('Failed to fetch updated record')
    const r = updated[0]
    return { ...r, notes: r.notes === null ? undefined : r.notes }
  }

  const deleteSleepRecord = async (id: number): Promise<void> => {
    await db.delete(sleepRecords).where(eq(sleepRecords.id, id))
  }

  const getSleepStats = async (userId: number): Promise<SleepStats> => {
    // 전체 평균
    const result = await db.select({
      avgSleepTime: sql`AVG((julianday(${sleepRecords.sleepEnd}) - julianday(${sleepRecords.sleepStart})) * 24)`,
      avgSleepQuality: sql`AVG(${sleepRecords.sleepQuality})`,
      totalRecords: sql`COUNT(*)`
    }).from(sleepRecords).where(eq(sleepRecords.userId, userId))
    const avgSleepTime = Number(result[0]?.avgSleepTime ?? 0)
    const avgSleepQuality = Number(result[0]?.avgSleepQuality ?? 0)
    const totalRecords = Number(result[0]?.totalRecords ?? 0)

    // 주간 패턴 (최근 7일)
    const weeklyRows = await db.select().from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(desc(sleepRecords.sleepStart))
      .limit(7)
    const weeklyPattern = weeklyRows.map((r: any) => ({
      day: r.sleepStart.slice(0, 10),
      avgSleepTime: (new Date(r.sleepEnd).getTime() - new Date(r.sleepStart).getTime()) / (1000 * 60 * 60),
      avgSleepQuality: r.sleepQuality
    }))

    // 월간 패턴 (최근 6개월)
    const monthlyMap: { [month: string]: { totalSleep: number, totalQuality: number, count: number } } = {}
    const allRows = await db.select().from(sleepRecords).where(eq(sleepRecords.userId, userId))
    for (const r of allRows) {
      const month = r.sleepStart.slice(0, 7)
      const sleepHours = (new Date(r.sleepEnd).getTime() - new Date(r.sleepStart).getTime()) / (1000 * 60 * 60)
      if (!monthlyMap[month]) monthlyMap[month] = { totalSleep: 0, totalQuality: 0, count: 0 }
      monthlyMap[month].totalSleep += sleepHours
      monthlyMap[month].totalQuality += r.sleepQuality
      monthlyMap[month].count += 1
    }
    const monthlyPattern = Object.entries(monthlyMap)
      .map(([date, v]) => ({
        date,
        avgSleepTime: v.totalSleep / v.count,
        avgSleepQuality: v.totalQuality / v.count
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6)

    return {
      avgSleepTime,
      avgSleepQuality,
      totalRecords,
      weeklyPattern,
      monthlyPattern
    }
  }

  const getWeeklySleepPattern = async (userId: number): Promise<WeeklySleepPattern[]> => {
    const records = await db.select().from(sleepRecords).where(eq(sleepRecords.userId, userId))
    const byDate: { [date: string]: { totalSleep: number; totalQuality: number; count: number } } = {}
    for (const r of records) {
      const date = r.sleepStart.slice(0, 10)
      const sleepStart = new Date(r.sleepStart)
      const sleepEnd = new Date(r.sleepEnd)
      const sleepHours = (sleepEnd.getTime() - sleepStart.getTime()) / (1000 * 60 * 60)
      if (!byDate[date]) byDate[date] = { totalSleep: 0, totalQuality: 0, count: 0 }
      byDate[date].totalSleep += sleepHours
      byDate[date].totalQuality += r.sleepQuality
      byDate[date].count += 1
    }
    const result: WeeklySleepPattern[] = Object.entries(byDate)
      .map(([date, v]) => ({
        date,
        avgSleepTime: v.totalSleep / v.count,
        avgSleepQuality: v.totalQuality / v.count
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7)
    return result
  }

  const getMonthlySleepPattern = async (userId: number): Promise<MonthlySleepPattern[]> => {
    const records = await db.select().from(sleepRecords).where(eq(sleepRecords.userId, userId))
    const byMonth: { [month: string]: { totalSleep: number; totalQuality: number; count: number } } = {}
    for (const r of records) {
      const month = r.sleepStart.slice(0, 7)
      const sleepStart = new Date(r.sleepStart)
      const sleepEnd = new Date(r.sleepEnd)
      const sleepHours = (sleepEnd.getTime() - sleepStart.getTime()) / (1000 * 60 * 60)
      if (!byMonth[month]) byMonth[month] = { totalSleep: 0, totalQuality: 0, count: 0 }
      byMonth[month].totalSleep += sleepHours
      byMonth[month].totalQuality += r.sleepQuality
      byMonth[month].count += 1
    }
    const result: MonthlySleepPattern[] = Object.entries(byMonth)
      .map(([month, v]) => ({
        month,
        avgSleepTime: v.totalSleep / v.count,
        avgSleepQuality: v.totalQuality / v.count,
        recordCount: v.count
      }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6)
    return result
  }

  const getSleepRecords = async (userId: number, options: GetRecordsOptions = {}): Promise<SleepRecord[]> => {
    const { startDate, endDate, limit, offset } = options;
    
    const records = await db.select()
      .from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(desc(sleepRecords.sleepStart))
      .limit(limit ?? 100)
      .offset(offset ?? 0);

    return records.map((r: any) => ({
      ...r,
      notes: r.notes === null ? undefined : r.notes
    }));
  }

  const getRecentRecords = async (userId: number, limit: number = 7): Promise<SleepRecord[]> => {
    try {
      const records = await db.select()
        .from(sleepRecords)
        .where(eq(sleepRecords.userId, userId))
        .orderBy(desc(sleepRecords.sleepStart))
        .limit(limit);
      
      return records.map((r: any) => ({ 
        ...r, 
        notes: r.notes === null ? undefined : r.notes 
      }));
    } catch (error) {
      console.error('Error in getRecentRecords:', error);
      throw error;
    }
  }

  return {
    getAllSleepRecords,
    getSleepRecordById,
    createSleepRecord,
    updateSleepRecord,
    deleteSleepRecord,
    getSleepStats,
    getWeeklySleepPattern,
    getMonthlySleepPattern,
    getSleepRecords,
    getRecentRecords
  }
}

export const sleepRecordService = createSleepRecordService({ db })
export type SleepRecordService = ReturnType<typeof createSleepRecordService> 