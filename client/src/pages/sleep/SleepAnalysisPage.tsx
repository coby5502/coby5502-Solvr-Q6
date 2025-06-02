import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { sleepRecordService } from '../../services/sleepRecordService'
import { sleepGoalService } from '../../services/sleepGoalService'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { sleepAnalysisService } from '../../services/sleepAnalysisService'

interface SleepRecord {
  id: number;
  sleepStart: string;
  sleepEnd: string;
  sleepQuality: number;
  notes?: string;
  quality?: number; // 변환용
}

interface SleepGoal {
  targetSleepQuality: number;
  bedtimeTime: string;
  wakeupTime: string;
}

const SleepAnalysisPage: React.FC = () => {
  const { user } = useAuth()
  const [recentRecords, setRecentRecords] = useState<SleepRecord[]>([])
  const [goal, setGoal] = useState<SleepGoal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [insight, setInsight] = useState<string>('');

  useEffect(() => {
    if (!user) return
    fetchData()
    setInsight('AI가 수면 기록을 분석하고 있어요...')
    const fetchInsight = async () => {
      try {
        const result = await sleepAnalysisService.getInsight();
        setInsight(result);
      } catch (e) {
        setInsight('추천 멘트를 불러오지 못했습니다.');
      }
    };
    fetchInsight();
    // eslint-disable-next-line
  }, [user])

  const fetchData = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const [recentRes, goalRes] = await Promise.all([
        sleepRecordService.getRecentRecords(user.id, 7),
        sleepGoalService.getGoals(user.id)
      ])
      // 품질 필드 변환
      setRecentRecords(
        (recentRes.data || []).map((r: any) => ({ ...r, quality: r.sleepQuality }))
      )
      setGoal(goalRes.data && goalRes.data[0] ? goalRes.data[0] : null)
    } catch (err) {
      setError('수면 분석 데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 수면 시간 계산 함수
  const calculateSleepDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // 시간 단위
  };

  // 차트 데이터 준비 (오래된순 정렬)
  const sleepDurationData = [...recentRecords]
    .sort((a, b) => new Date(a.sleepStart).getTime() - new Date(b.sleepStart).getTime())
    .map(record => ({
      date: new Date(record.sleepStart).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      duration: calculateSleepDuration(record.sleepStart, record.sleepEnd),
      quality: record.quality
    }));

  // 평균 수면 시간 계산
  const averageSleepDuration = recentRecords.length > 0
    ? recentRecords.reduce((sum, record) => 
        sum + calculateSleepDuration(record.sleepStart, record.sleepEnd), 0) / recentRecords.length
    : 0;

  // 수면 품질 추이 데이터
  const sleepQualityTrend = [...recentRecords]
    .sort((a, b) => new Date(a.sleepStart).getTime() - new Date(b.sleepStart).getTime())
    .map(record => ({
      date: new Date(record.sleepStart).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      quality: record.quality
    }));

  // 수면 품질 평균
  const averageQuality = recentRecords.length > 0
    ? recentRecords.reduce((sum, r) => sum + (r.quality ?? 0), 0) / recentRecords.length
    : 0;

  // 평균선 커스텀 컴포넌트 (네모 박스/텍스트 제거)
  const CustomAverageLine = () => null;

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label, chartType }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#1F2937', borderRadius: '0.5rem', color: '#fff', padding: 12, border: 'none', fontSize: 14, minWidth: 90 }}>
          <div style={{ marginBottom: 4 }}>{label}</div>
          {chartType === 'quality' ? (
            <div>수면 품질: <b>{payload[0].value.toFixed(1)}점</b></div>
          ) : (
            <div>수면 시간: <b>{payload[0].value.toFixed(1)}시간</b></div>
          )}
        </div>
      );
    }
    return null;
  };

  // 목표 수면 시간 계산
  const targetSleepDuration = goal
    ? (() => {
        const d = new Date(`2000-01-01T${goal.bedtimeTime}`);
        const w = new Date(`2000-01-01T${goal.wakeupTime}`);
        let diff = (w.getTime() - d.getTime()) / (1000 * 60 * 60);
        if (diff <= 0) diff += 24;
        return diff;
      })()
    : null;

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

      {/* 추천 멘트/인사이트 */}
      <div className="bg-dark-300 rounded-lg p-4 mb-4 shadow flex items-center">
        <span className="text-accent-purple text-lg mr-2">💡</span>
        <span className="text-white text-base font-medium">{insight}</span>
      </div>

      <div className="flex flex-col gap-6 mb-8">
        {/* 수면 시간 추이 */}
        {recentRecords.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-dark-300 p-6 rounded-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
              <h2 className="text-lg font-semibold">수면 시간 추이</h2>
            </div>
            <div className="h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepDurationData} margin={{ left: 0, right: 24, top: 16, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                    minTickGap={0}
                    interval={0}
                    padding={{ left: 0, right: 0 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip content={<CustomTooltip chartType="duration" />} />
                  <Line 
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#8884d8' }}
                    name="수면 시간 (시간)"
                  />
                  {/* 평균선 */}
                  <ReferenceLine y={averageSleepDuration} ifOverflow="visible" stroke="#ffbb28" strokeDasharray="4 2" strokeWidth={2} label={<CustomAverageLine />} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-row items-center justify-end gap-6 mt-2 text-sm">
              <span className="text-[#ffbb28] font-semibold">평균: {averageSleepDuration.toFixed(1)}시간</span>
              <span className="text-accent-purple font-semibold">목표: {targetSleepDuration !== null ? targetSleepDuration.toFixed(1) : '0.0'}시간</span>
            </div>
          </motion.div>
        )}

        {/* 수면 품질 추이 (LineChart) */}
        {recentRecords.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-dark-300 p-6 rounded-lg"
          >
            <h2 className="text-lg font-semibold mb-4">수면 품질 추이</h2>
            <div className="h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepQualityTrend} margin={{ left: 0, right: 24, top: 16, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                  <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} domain={[1, 5]} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip chartType="quality" />} />
                  <Line type="monotone" dataKey="quality" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#a78bfa' }} name="수면 품질" />
                  {/* 평균선 */}
                  <ReferenceLine y={averageQuality} ifOverflow="visible" stroke="#ffbb28" strokeDasharray="4 2" strokeWidth={2} label={<CustomAverageLine />} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-row items-center justify-end gap-6 mt-2 text-sm">
              <span className="text-[#ffbb28] font-semibold">평균: {averageQuality.toFixed(1)}점</span>
              <span className="text-accent-purple font-semibold">목표: {goal ? goal.targetSleepQuality : '0.0'}점</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SleepAnalysisPage 