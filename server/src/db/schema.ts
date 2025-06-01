import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// 사용자 테이블 스키마
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: text('role').notNull().default('USER'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
})

// 수면 기록 테이블 스키마
export const sleepRecords = sqliteTable('sleep_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sleepStart: text('sleep_start').notNull(),
  sleepEnd: text('sleep_end').notNull(),
  sleepQuality: integer('sleep_quality').notNull(),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
})

// 수면 목표 테이블 스키마
export const sleepGoals = sqliteTable('sleep_goals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bedtimeTime: text('bedtime_time').notNull(),
  wakeupTime: text('wakeup_time').notNull(),
  targetSleepQuality: integer('target_sleep_quality').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
})

// 타입 정의
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UpdateUser = Partial<Omit<NewUser, 'id' | 'createdAt'>>

export type SleepRecord = typeof sleepRecords.$inferSelect
export type NewSleepRecord = typeof sleepRecords.$inferInsert
export type UpdateSleepRecord = Partial<Omit<NewSleepRecord, 'id' | 'createdAt'>>

export type SleepGoal = typeof sleepGoals.$inferSelect
export type NewSleepGoal = typeof sleepGoals.$inferInsert
export type UpdateSleepGoal = Partial<Omit<NewSleepGoal, 'id' | 'createdAt'>>
