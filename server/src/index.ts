import Fastify from 'fastify'
import cors from '@fastify/cors'
import env from './config/env'
import { initializeDatabase, getDb } from './db'
import runMigration from './db/migrate'
import { createSleepRecordService } from './services/sleepRecordService'
import { createUserService } from './services/userService'
import { createSleepAnalysisService } from './services/sleepAnalysisService'
import { createSleepGoalService } from './services/sleepGoalService'
import { AppContext } from './types/context'

// 각 도메인별 라우트 플러그인 import
import healthRoutes from './api/healthRoutes'
import { userRoutes } from './api/userRoutes'
import { sleepGoalRoutes } from './api/sleepGoalRoutes'
import { sleepRecordRoutes } from './api/sleepRecordRoutes'
import { sleepAnalysisRoutes } from './api/sleepAnalysisRoutes'

// Fastify 인스턴스 생성
const fastify = Fastify({
  logger: {
    level: env.LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
})

// 서버 시작 함수
async function start() {
  try {
    // CORS 설정
    await fastify.register(cors, {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    })

    // 데이터베이스 마이그레이션 및 초기화
    await runMigration()
    await initializeDatabase()

    // 서비스 및 컨텍스트 초기화
    const db = await getDb()
    const context: AppContext = {
      sleepRecordService: createSleepRecordService({ db }),
      userService: createUserService({ db }),
      sleepAnalysisService: createSleepAnalysisService({ db }),
      sleepGoalService: createSleepGoalService({ db })
    }

    // 컨텍스트를 Fastify 인스턴스에 주입
    fastify.decorate('context', context)

    // 라우트 등록
    await fastify.register(healthRoutes, { prefix: '/api/health' })
    await fastify.register(userRoutes, { prefix: '/api/users' })
    await fastify.register(sleepGoalRoutes, { prefix: '/api/sleep-goals' })
    await fastify.register(sleepRecordRoutes, { prefix: '/api/sleep-records' })
    await fastify.register(sleepAnalysisRoutes, { prefix: '/api/sleep-analysis' })

    // 서버 시작
    await fastify.listen({ port: env.PORT, host: env.HOST })

    console.log(`서버가 http://${env.HOST}:${env.PORT} 에서 실행 중입니다.`)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

// 서버 시작
start() 