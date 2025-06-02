import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { sleepGoalService } from '../../services/sleepGoalService'
import { sleepRecordService } from '../../services/sleepRecordService'
import { SleepGoal } from '../../types/sleepGoal'
import { SleepRecord, SleepStats } from '../../types/sleepRecord'
import { Link } from 'react-router-dom'
import SleepGoalModal from '../../components/sleep/SleepGoalModal'
import SleepRecordModal from '../../components/sleep/SleepRecordModal'
import { motion } from 'framer-motion'

const HomePage: React.FC = () => {
  const { user } = useAuth()
  const [activeGoal, setActiveGoal] = useState<SleepGoal | null>(null)
  const [recentRecords, setRecentRecords] = useState<SleepRecord[]>([])
  const [stats, setStats] = useState<SleepStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      if (!user?.id) {
        console.error('User ID is not available');
        return;
      }

      const [goalsResponse, recordsResponse, statsResponse] = await Promise.all([
        sleepGoalService.getGoals(user.id),
        sleepRecordService.getRecentRecords(user.id, 7),
        sleepRecordService.getStats(user.id)
      ]);

      setActiveGoal(goalsResponse.data[0] || null)
      setRecentRecords(recordsResponse.data || [])
      setStats(statsResponse.data || {
        averageSleepDuration: 0,
        averageSleepQuality: 0,
        consistencyScore: 0,
        bestSleepQuality: 0,
        worstSleepQuality: 0
      })
    } catch (error) {
      console.error('Error fetching home data:', error)
      setError('데이터를 불러오지 못했습니다.')
      setActiveGoal(null)
      setRecentRecords([])
      setStats({
        averageSleepDuration: 0,
        averageSleepQuality: 0,
        consistencyScore: 0,
        bestSleepQuality: 0,
        worstSleepQuality: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-200 text-white p-6">
        <div className="text-white">로그인이 필요합니다.</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-200 text-white p-6">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-200 text-white p-6">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full md:max-w-2xl mx-auto min-h-screen bg-dark-200 text-white p-6 space-y-8">
      {/* Welcome Section */}
      <section className="bg-dark-300 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {user?.name}님, 안녕하세요!
        </h1>
        <p className="text-gray-400">
          오늘도 좋은 수면 되세요. 현재 수면 상태를 확인해보세요.
        </p>
      </section>

      {/* Sleep Goal Section */}
      <section className="bg-dark-300 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">수면 목표</h2>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="text-accent-purple hover:text-accent-purple/90 text-sm"
          >
            목표 설정하기
          </button>
        </div>
        {activeGoal ? (
          <div className="bg-dark-400 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">취침 시간</span>
              <span className="text-white">{new Date(`2000-01-01T${activeGoal.bedtimeTime}`).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">기상 시간</span>
              <span className="text-white">{new Date(`2000-01-01T${activeGoal.wakeupTime}`).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">목표 수면 품질</span>
              <span className="text-white">{activeGoal.targetSleepQuality}점</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">설정된 수면 목표가 없습니다.</p>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="inline-block bg-accent-purple text-white px-4 py-2 rounded-lg hover:bg-accent-purple/90"
            >
              목표 설정하기
            </button>
          </div>
        )}
      </section>

      {/* 최근 수면 기록 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-300 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">최근 수면 기록</h2>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="text-accent-purple hover:text-accent-purple/90 text-sm"
          >
            기록 작성하기
          </button>
        </div>
        {recentRecords.length > 0 ? (
          <div className="space-y-2">
            {recentRecords.map((rec) => (
              <div key={rec.id} className="flex justify-between items-center border-b border-dark-400 py-2">
                <div>
                  <div className="text-white font-bold">
                    {new Date(rec.sleepStart).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {new Date(rec.sleepStart).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~ {new Date(rec.sleepEnd).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="text-accent-purple font-bold">{rec.sleepQuality}점</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">아직 수면 기록이 없습니다.</p>
            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="inline-block bg-accent-purple text-white px-4 py-2 rounded-lg hover:bg-accent-purple/90"
            >
              기록 작성하기
            </button>
          </div>
        )}
      </motion.div>

      {/* Sleep Stats Summary */}
      {stats && (
        <section className="bg-dark-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">수면 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-400 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">평균 수면 시간</h3>
              <p className="text-2xl font-bold text-white">
                {stats?.averageSleepDuration?.toFixed(1) || '0.0'}시간
              </p>
            </div>
            <div className="bg-dark-400 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">평균 수면 품질</h3>
              <p className="text-2xl font-bold text-white">
                {stats?.averageSleepQuality?.toFixed(1) || '0.0'}/5
              </p>
            </div>
            <div className="bg-dark-400 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">기록 수</h3>
              <p className="text-2xl font-bold text-white">
                {stats?.consistencyScore || 0}회
              </p>
            </div>
          </div>
        </section>
      )}

      {isGoalModalOpen && (
        <SleepGoalModal
          userId={user.id}
          initialBedtimeTime={activeGoal?.bedtimeTime}
          initialWakeupTime={activeGoal?.wakeupTime}
          initialTargetSleepQuality={activeGoal?.targetSleepQuality}
          onClose={() => setIsGoalModalOpen(false)}
          onSuccess={() => { setIsGoalModalOpen(false); fetchData(); }}
        />
      )}

      {isRecordModalOpen && (
        <SleepRecordModal
          open={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          onSuccess={() => { setIsRecordModalOpen(false); fetchData(); }}
        />
      )}
    </div>
  )
}

export default HomePage 