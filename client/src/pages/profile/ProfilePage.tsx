import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth()
  return (
    <div className="w-full max-w-full md:max-w-lg mx-auto mt-10 bg-dark-300 rounded-lg shadow-lg p-8 text-white flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="block text-gray-400">이름</span>
        <span className="block text-lg font-semibold">{user?.name}</span>
        <span className="block text-gray-400 mt-4">이메일</span>
        <span className="block text-lg font-semibold">{user?.email}</span>
      </div>
      <button onClick={logout} className="bg-gray-600 px-4 py-2 rounded text-white text-base font-semibold mt-6">로그아웃</button>
    </div>
  )
}

export default ProfilePage