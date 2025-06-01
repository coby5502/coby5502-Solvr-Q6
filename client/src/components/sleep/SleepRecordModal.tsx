import React, { useState, useEffect } from 'react'
import { sleepRecordService } from '../../services/sleepRecordService'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ko } from 'date-fns/locale'

interface SleepRecordModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  record?: any
}

const SleepRecordModal: React.FC<SleepRecordModalProps> = ({ open, onClose, onSuccess, record }) => {
  const [date, setDate] = useState<Date | null>(new Date())
  const [sleepTime, setSleepTime] = useState<Date | null>(null)
  const [wakeTime, setWakeTime] = useState<Date | null>(null)
  const [sleepQuality, setSleepQuality] = useState(3)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (record) {
      const sleepStart = new Date(record.sleepStart)
      const sleepEnd = new Date(record.sleepEnd)
      setDate(sleepStart)
      setSleepTime(sleepStart)
      setWakeTime(sleepEnd)
      setSleepQuality(record.sleepQuality)
      setNotes(record.notes || '')
    } else {
      setDate(new Date())
      setSleepTime(null)
      setWakeTime(null)
      setSleepQuality(3)
      setNotes('')
    }
  }, [record])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!date || !sleepTime || !wakeTime) {
      setError('모든 값을 입력해 주세요.')
      return
    }
    setLoading(true)
    try {
      // 취침 시작
      const sleepStart = new Date(date)
      sleepStart.setHours(sleepTime.getHours(), sleepTime.getMinutes(), 0, 0)
      // 기상 시간
      let sleepEnd = new Date(date)
      sleepEnd.setHours(wakeTime.getHours(), wakeTime.getMinutes(), 0, 0)
      // 만약 기상 시간이 취침 시간보다 빠르면 다음날로
      if (sleepEnd <= sleepStart) {
        sleepEnd.setDate(sleepEnd.getDate() + 1)
      }

      const data = {
        sleepStart: sleepStart.toISOString(),
        sleepEnd: sleepEnd.toISOString(),
        sleepQuality,
        notes
      }

      if (record) {
        await sleepRecordService.updateRecord(record.id, data)
      } else {
        await sleepRecordService.createRecord(data)
      }
      onSuccess()
    } catch (err) {
      setError('기록 저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

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
        <h2 className="text-xl font-bold text-white mb-6">
          {record ? '수면 기록 수정' : '새 수면 기록'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">취침 날짜</label>
            <DatePicker
              selected={date}
              onChange={setDate}
              dateFormat="yyyy-MM-dd"
              locale={ko}
              className="w-full bg-dark-400 text-white rounded px-3 py-2 focus:outline-none"
              calendarClassName="bg-dark-400 text-white"
              dayClassName={() => 'hover:bg-accent-purple/30'}
              popperClassName="z-50"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-300 mb-1">취침 시간</label>
              <DatePicker
                selected={sleepTime}
                onChange={setSleepTime}
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
            <div className="flex-1">
              <label className="block text-gray-300 mb-1">기상 시간</label>
              <DatePicker
                selected={wakeTime}
                onChange={setWakeTime}
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
          </div>
          <div>
            <label className="block text-gray-300 mb-1">수면 품질</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSleepQuality(q)}
                  className={`w-10 h-10 rounded-full ${
                    sleepQuality === q
                      ? 'bg-accent-purple text-white'
                      : 'bg-dark-400 text-gray-400'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">메모</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-dark-400 text-white rounded px-3 py-2 focus:outline-none"
              rows={3}
            />
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
              {loading ? '저장 중...' : record ? '수정하기' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SleepRecordModal 