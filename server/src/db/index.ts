import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { mkdir } from 'fs/promises'
import { dirname } from 'path'
import * as schema from './schema'
import runMigration from './migrate'

const DATABASE_URL = './data/database.sqlite'

// 데이터베이스 디렉토리 생성 함수
async function ensureDatabaseDirectory() {
  const dir = dirname(DATABASE_URL)
  try {
    await mkdir(dir, { recursive: true })
  } catch (error) {
    // 디렉토리가 이미 존재하는 경우 무시
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

const sqlite = new Database(DATABASE_URL)
export const db = drizzle(sqlite, { schema })

export async function getDb(): Promise<typeof db> {
  return db
}

export async function initializeDatabase(): Promise<typeof db> {
  await ensureDatabaseDirectory()
  await runMigration()
  return getDb()
}

export default { initializeDatabase, getDb }
