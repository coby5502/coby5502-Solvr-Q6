import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { sleepGoalService } from '../../services/sleepGoalService'
import { sleepRecordService } from '../../services/sleepRecordService'
import { SleepGoal } from '../../types/sleepGoal'
import { Link } from 'react-router-dom'
import SleepGoalModal from '../../components/sleep/SleepGoalModal'

const HomePage: React.FC = () => {
  const { user } = useAuth()
  const [activeGoal, setActiveGoal] = useState<SleepGoal | null>(null)
  const [recentRecords, setRecentRecords] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)

  const fetchData = async () => {
    if (!user) return
    try {
      const [goalResponse, recordsResponse, statsResponse] = await Promise.all([
        sleepGoalService.getGoals(user.id),
        sleepRecordService.getRecentRecords(user.id, 3),
        sleepRecordService.getStats(user.id)
      ])
      setActiveGoal(goalResponse.data[0] || null)
      setRecentRecords(recordsResponse.data)
      setStats(statsResponse.data)
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-200 text-white p-6">
        <div className="text-white">로딩 중...</div>
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
              <span className="text-white">{activeGoal.targetSleepQuality}/5</span>
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

      {/* Recent Sleep Records */}
      <section className="bg-dark-300 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">최근 수면 기록</h2>
          <Link
            to="/records"
            className="text-accent-purple hover:text-accent-purple/90 text-sm"
          >
            전체 보기
          </Link>
        </div>
        {recentRecords.length > 0 ? (
          <div className="space-y-4">
            {recentRecords.map((record) => (
              <div key={record.id} className="bg-dark-300 rounded-lg p-4 border border-dark-400">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">
                    {new Date(record.sleepStart).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="text-white">품질: {record.sleepQuality}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {new Date(record.sleepStart).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(record.sleepEnd).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-white">
                    {Math.round(
                      (new Date(record.sleepEnd).getTime() -
                        new Date(record.sleepStart).getTime()) /
                        (1000 * 60 * 60)
                    )}
                    시간
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">아직 수면 기록이 없습니다.</p>
            <Link
              to="/records"
              className="inline-block bg-accent-purple text-white px-4 py-2 rounded-lg hover:bg-accent-purple/90"
            >
              기록하기
            </Link>
          </div>
        )}
      </section>

      {/* Sleep Stats Summary */}
      {stats && (
        <section className="bg-dark-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">수면 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-400 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">평균 수면 시간</h3>
              <p className="text-2xl font-bold text-white">
                {stats.avgSleepTime.toFixed(1)}시간
              </p>
            </div>
            <div className="bg-dark-400 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">평균 수면 품질</h3>
              <p className="text-2xl font-bold text-white">
                {stats.avgSleepQuality.toFixed(1)}/5
              </p>
            </div>
            <div className="bg-dark-400 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">기록 수</h3>
              <p className="text-2xl font-bold text-white">
                {stats.totalRecords}회
              </p>
            </div>
          </div>
        </section>
      )}

      {isGoalModalOpen && (
        <SleepGoalModal
          userId={user!.id}
          initialBedtimeTime={activeGoal?.bedtimeTime}
          initialWakeupTime={activeGoal?.wakeupTime}
          initialTargetSleepQuality={activeGoal?.targetSleepQuality}
          onClose={() => setIsGoalModalOpen(false)}
          onSuccess={() => { setIsGoalModalOpen(false); fetchData(); }}
        />
      )}
    </div>
  )
}

export default HomePage 