import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { sleepRecordService } from '../../services/sleepRecordService'
import { sleepGoalService } from '../../services/sleepGoalService'
import { motion } from 'framer-motion'

const SleepAnalysisPage: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [goal, setGoal] = useState<any>(null)
  const [recentRecords, setRecentRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    fetchData()
    // eslint-disable-next-line
  }, [user])

  const fetchData = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const [statsRes, goalRes, recentRes] = await Promise.all([
        sleepRecordService.getStats(user.id),
        sleepGoalService.getGoal(user.id),
        sleepRecordService.getRecentRecords(user.id, 7)
      ])
      setStats(statsRes.data)
      setGoal(goalRes.data)
      setRecentRecords(recentRes.data)
    } catch (err) {
      setError('수면 분석 데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-white">로그인이 필요합니다.</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full md:max-w-2xl mx-auto space-y-8 bg-dark-200 min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-6">수면 분석</h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-300 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">수면 통계</h2>
        {stats ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">평균 수면 시간</span>
              <p className="text-white text-xl font-bold">{stats.avgSleepTime?.toFixed(2)} 시간</p>
            </div>
            <div>
              <span className="text-gray-400">평균 수면 품질</span>
              <p className="text-white text-xl font-bold">{stats.avgSleepQuality?.toFixed(2)} / 5</p>
            </div>
            <div>
              <span className="text-gray-400">총 기록 수</span>
              <p className="text-white text-xl font-bold">{stats.totalRecords}</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">통계 데이터가 없습니다.</div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-300 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">수면 목표</h2>
        {goal ? (
          <div>
            <div className="mb-2">
              <span className="text-gray-400">취침 시간</span>
              <p className="text-white font-bold">{goal.bedtimeTime}</p>
            </div>
            <div className="mb-2">
              <span className="text-gray-400">기상 시간</span>
              <p className="text-white font-bold">{goal.wakeupTime}</p>
            </div>
            <div>
              <span className="text-gray-400">목표 수면 품질</span>
              <p className="text-white font-bold">{goal.targetSleepQuality} / 5</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">설정된 수면 목표가 없습니다.</div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-300 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">최근 7일 기록</h2>
        {recentRecords.length > 0 ? (
          <div className="space-y-2">
            {recentRecords.map((rec) => (
              <div key={rec.id} className="flex justify-between items-center border-b border-dark-400 py-2">
                <div>
                  <div className="text-white font-bold">{new Date(rec.sleepStart).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div className="text-gray-400 text-sm">
                    {new Date(rec.sleepStart).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~ {new Date(rec.sleepEnd).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="text-accent-purple font-bold">{rec.sleepQuality} / 5</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">최근 기록이 없습니다.</div>
        )}
      </motion.div>
    </div>
  )
}

export default SleepAnalysisPage 