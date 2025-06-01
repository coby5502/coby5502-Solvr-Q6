import { Database } from './database'
import { UserService } from './user'
import { SleepRecordService } from './sleepRecord'
import { SleepGoalService } from './sleepGoal'
import { SleepAnalysisService } from './sleepAnalysis'

export interface AppContext {
  db: Database
  userService: UserService
  sleepRecordService: SleepRecordService
  sleepGoalService: SleepGoalService
  sleepAnalysisService: SleepAnalysisService
}
