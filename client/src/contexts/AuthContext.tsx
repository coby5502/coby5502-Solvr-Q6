import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { User, LoginDTO, CreateUserDTO, AuthResponse } from '../types/user'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (data: LoginDTO) => Promise<void>
  register: (data: CreateUserDTO) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          setIsAuthenticated(false)
          return
        }

        const response = await api.get<{ data: User }>('/users/me')
        if (response.data.data) {
          setUser(response.data.data)
          setIsAuthenticated(true)
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error)
        if (error.response?.status === 401 && error.response?.data?.error === 'Invalid token') {
          localStorage.removeItem('token')
          setUser(null)
          setIsAuthenticated(false)
        }
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginDTO) => {
    try {
      setError(null)
      console.log('Login attempt with:', data)
      
      const response = await api.post<AuthResponse>('/users/login', data)
      console.log('Login response:', response.data)
      
      const { token, user } = response.data
      console.log('Token received:', token)
      console.log('User data:', user)
      
      localStorage.setItem('token', token)
      
      setUser(user)
      setIsAuthenticated(true)
      
      navigate('/')
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error)
      setError(error.response?.data?.message || '로그인에 실패했습니다.')
      throw error
    }
  }

  const register = async (data: CreateUserDTO) => {
    try {
      setError(null)
      const response = await api.post<AuthResponse>('/users/register', data)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      
      setUser(user)
      setIsAuthenticated(true)
      
      navigate('/')
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error)
      setError(error.response?.data?.message || '회원가입에 실패했습니다.')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
    navigate('/login')
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, isAuthenticated, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 