import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-400 text-lg mb-8">페이지를 찾을 수 없습니다.</p>
        <Link
          to="/"
          className="bg-accent-purple text-white px-6 py-3 rounded-lg hover:bg-accent-purple/90"
        >
          홈으로 돌아가기
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFoundPage 