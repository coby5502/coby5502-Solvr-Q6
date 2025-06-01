import React, { useState } from 'react'
import { sleepExportService } from '../../services/sleepExportService'

interface SleepRecordExportProps {
  userId: number
}

const SleepRecordExport: React.FC<SleepRecordExportProps> = ({ userId }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setError(null)
      await sleepExportService.exportSleepRecords(userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export sleep records')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="px-4 py-2 bg-accent-purple text-white rounded-md hover:bg-accent-purple/90 disabled:opacity-50"
      >
        {isExporting ? 'Exporting...' : 'Export Sleep Records'}
      </button>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}

export default SleepRecordExport 