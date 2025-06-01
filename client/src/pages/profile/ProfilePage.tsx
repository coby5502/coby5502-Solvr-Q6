import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 호출로 유저 정보 업데이트
    setEditMode(false)
  }

  const handleDelete = () => {
    if (window.confirm('정말로 탈퇴하시겠습니까?')) {
      // TODO: API 호출로 회원 탈퇴
      logout()
    }
  }

  return (
    <div className="w-full max-w-full md:max-w-lg mx-auto mt-10 bg-dark-300 rounded-lg shadow-lg p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">프로필</h2>
      {editMode ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-400">이름</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 rounded bg-dark-400 text-white border border-dark-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-dark-400 text-white border border-dark-500"
            />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-accent-purple px-4 py-2 rounded text-white">저장</button>
            <button type="button" onClick={() => setEditMode(false)} className="bg-gray-600 px-4 py-2 rounded">취소</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <span className="block text-gray-400">이름</span>
            <span className="block text-lg font-semibold">{user?.name}</span>
          </div>
          <div>
            <span className="block text-gray-400">이메일</span>
            <span className="block text-lg font-semibold">{user?.email}</span>
          </div>
          <div className="flex space-x-2 mt-6">
            <button onClick={() => setEditMode(true)} className="bg-accent-purple px-4 py-2 rounded text-white">수정</button>
            <button onClick={logout} className="bg-gray-600 px-4 py-2 rounded">로그아웃</button>
            <button onClick={handleDelete} className="bg-red-600 px-4 py-2 rounded">탈퇴</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage 