import { eq } from 'drizzle-orm'
import { sleepGoals } from '../db/schema'
import { SleepGoal, CreateSleepGoalDTO, UpdateSleepGoalDTO } from '../types/sleepGoal'
import { db } from '../db'

type SleepGoalServiceDeps = {
  db: any
}

export const createSleepGoalService = ({ db }: SleepGoalServiceDeps) => {
  const getSleepGoals = async (userId: number): Promise<SleepGoal[]> => {
    return db.select().from(sleepGoals).where(eq(sleepGoals.userId, userId));
  };

  const createSleepGoal = async (data: CreateSleepGoalDTO): Promise<SleepGoal> => {
    // 한 유저당 하나만 존재: 기존 목표 삭제
    await db.delete(sleepGoals).where(eq(sleepGoals.userId, data.userId));
    const now = new Date().toISOString();
    const [goal] = await db.insert(sleepGoals)
      .values({
        userId: data.userId,
        bedtimeTime: data.bedtimeTime,
        wakeupTime: data.wakeupTime,
        targetSleepQuality: data.targetSleepQuality as 1 | 2 | 3 | 4 | 5,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    if (!goal) throw new Error('Failed to create sleep goal');
    return goal;
  };

  const updateSleepGoal = async (id: number, data: UpdateSleepGoalDTO): Promise<SleepGoal> => {
    const updates: any = {};
    if (data.bedtimeTime) updates.bedtimeTime = data.bedtimeTime;
    if (data.wakeupTime) updates.wakeupTime = data.wakeupTime;
    if (data.targetSleepQuality) updates.targetSleepQuality = data.targetSleepQuality as 1 | 2 | 3 | 4 | 5;
    updates.updatedAt = new Date().toISOString();
    const [goal] = await db.update(sleepGoals)
      .set(updates)
      .where(eq(sleepGoals.id, id))
      .returning();
    if (!goal) throw new Error('Failed to update sleep goal');
    return goal;
  };

  const deleteSleepGoal = async (id: number): Promise<void> => {
    await db.delete(sleepGoals).where(eq(sleepGoals.id, id));
  };

  return {
    getSleepGoals,
    createSleepGoal,
    updateSleepGoal,
    deleteSleepGoal
  };
}

export type SleepGoalService = ReturnType<typeof createSleepGoalService>

export const sleepGoalService = createSleepGoalService({ db }) 