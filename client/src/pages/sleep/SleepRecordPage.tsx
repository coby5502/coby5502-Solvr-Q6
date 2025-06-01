import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { sleepRecordService } from '../../services/sleepRecordService'
import { motion } from 'framer-motion'
import SleepRecordModal from '../../components/sleep/SleepRecordModal'

const SleepRecordPage: React.FC = () => {
  const { user } = useAuth()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)

  useEffect(() => {
    if (user) fetchRecords()
  }, [user])

  const fetchRecords = async () => {
    setLoading(true)
    if (!user) return
    const res = await sleepRecordService.getRecords()
    setRecords(res.data)
    setLoading(false)
  }

  const handleEdit = (record: any) => {
    setEditingRecord(record)
    setShowForm(true)
  }

  const handleDelete = async (recordId: number) => {
    if (!confirm('정말로 이 기록을 삭제하시겠습니까?')) return
    try {
      await sleepRecordService.deleteRecord(recordId)
      fetchRecords()
    } catch (error) {
      console.error('Error deleting record:', error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingRecord(null)
    fetchRecords()
  }

  // 깔끔한 SVG 휴지통 아이콘 컴포넌트
  const TrashIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
      <path d="M7.5 8.5v5m5-5v5M3 5.5h14M8.5 3.5h3A1.5 1.5 0 0 1 13 5v0.5h-6V5A1.5 1.5 0 0 1 8.5 3.5zM5 5.5v10A1.5 1.5 0 0 0 6.5 17h7A1.5 1.5 0 0 0 15 15.5v-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-200 text-white p-6">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full md:max-w-2xl mx-auto min-h-screen bg-dark-200 text-white p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">수면 기록</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent-purple text-white px-4 py-2 rounded-lg hover:bg-accent-purple/90 shadow"
        >
          {showForm ? '취소' : '새 기록'}
        </button>
      </div>

      {showForm && (
        <SleepRecordModal
          open={showForm}
          onClose={() => {
            setShowForm(false)
            setEditingRecord(null)
          }}
          onSuccess={handleFormSuccess}
          record={editingRecord}
        />
      )}

      <div className="space-y-6">
        {records.map((record) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-dark-300 rounded-xl p-5 shadow border border-dark-400 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:bg-dark-200 transition"
            onClick={() => handleEdit(record)}
          >
            <button
              onClick={e => { e.stopPropagation(); handleDelete(record.id); }}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-red-400 bg-transparent hover:bg-red-500/80 hover:text-white shadow transition"
              title="삭제"
            >
              <TrashIcon />
            </button>
            <div className="flex items-center mb-1">
              <span className="text-gray-200 text-base font-semibold">
                {new Date(record.sleepStart).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex flex-row items-center gap-4 mb-1">
              <span className="text-gray-100 text-sm">
                {new Date(record.sleepStart).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} - {new Date(record.sleepEnd).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-white text-sm font-medium">
                {Math.round((new Date(record.sleepEnd).getTime() - new Date(record.sleepStart).getTime()) / (1000 * 60 * 60))}시간
              </span>
              <span className="text-accent-purple text-sm font-semibold ml-auto">품질 {record.sleepQuality}/5</span>
            </div>
            {record.notes && (
              <div className="bg-dark-400 rounded p-3 mt-3">
                <span className="text-gray-400 text-xs">메모</span>
                <p className="text-white mt-1 text-sm">{record.notes}</p>
              </div>
            )}
          </motion.div>
        ))}

        {records.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">아직 수면 기록이 없습니다.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-accent-purple text-white px-4 py-2 rounded-lg hover:bg-accent-purple/90 shadow"
            >
              첫 기록 작성하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SleepRecordPage 