import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { sleepGoalService } from '../../services/sleepGoalService'
import { ko } from 'date-fns/locale'

interface SleepGoalModalProps {
  onClose: () => void
  onSuccess: () => void
  userId: number
  initialBedtimeTime?: string
  initialWakeupTime?: string
  initialTargetSleepQuality?: number
}

function parseTimeStringToDate(time: string) {
  if (!time) return null
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

function formatDateToTimeString(date: Date | null) {
  if (!date) return ''
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

const SleepGoalModal: React.FC<SleepGoalModalProps> = ({ onClose, onSuccess, userId, initialBedtimeTime = '', initialWakeupTime = '', initialTargetSleepQuality = 3 }) => {
  const [bedtimeTime, setBedtimeTime] = useState<Date | null>(parseTimeStringToDate(initialBedtimeTime))
  const [wakeupTime, setWakeupTime] = useState<Date | null>(parseTimeStringToDate(initialWakeupTime))
  const [targetSleepQuality, setTargetSleepQuality] = useState(initialTargetSleepQuality)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await sleepGoalService.createGoal({
        userId,
        bedtimeTime: formatDateToTimeString(bedtimeTime),
        wakeupTime: formatDateToTimeString(wakeupTime),
        targetSleepQuality,
        targetConsistencyDays: 7
      })
      onSuccess()
    } catch (err: any) {
      setError('목표 저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-dark-300 rounded-lg p-8 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-white mb-6">수면 목표 설정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">취침 시간</label>
            <DatePicker
              selected={bedtimeTime}
              onChange={setBedtimeTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={10}
              timeCaption="시간"
              dateFormat="HH:mm"
              locale={ko}
              className="w-full bg-dark-400 text-white rounded px-3 py-2 focus:outline-none"
              popperClassName="z-50"
              placeholderText="--:--"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">기상 시간</label>
            <DatePicker
              selected={wakeupTime}
              onChange={setWakeupTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={10}
              timeCaption="시간"
              dateFormat="HH:mm"
              locale={ko}
              className="w-full bg-dark-400 text-white rounded px-3 py-2 focus:outline-none"
              popperClassName="z-50"
              placeholderText="--:--"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">목표 수면 품질</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setTargetSleepQuality(q)}
                  className={`w-10 h-10 rounded-full ${
                    targetSleepQuality === q
                      ? 'bg-accent-purple text-white'
                      : 'bg-dark-400 text-gray-400'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-accent-purple text-white hover:bg-accent-purple/90"
              disabled={loading}
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SleepGoalModal 