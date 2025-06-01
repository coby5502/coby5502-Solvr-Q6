import { api } from '../utils/api'
import { User, CreateUserDTO, UpdateUserDTO, LoginDTO, AuthResponse } from '../types/user'

export const userService = {
  // 회원가입
  async register(data: CreateUserDTO): Promise<{ data: AuthResponse }> {
    const response = await api.post<{ data: AuthResponse }>('/api/auth/register', data)
    return response.data
  },

  // 로그인
  async login(data: LoginDTO): Promise<{ data: AuthResponse }> {
    const response = await api.post<{ data: AuthResponse }>('/api/auth/login', data)
    return response.data
  },

  // 사용자 정보 조회
  async getUserById(id: number): Promise<{ data: User }> {
    const response = await api.get<{ data: User }>(`/api/users/${id}`)
    return response.data
  },

  // 사용자 정보 수정
  async updateUser(id: number, data: UpdateUserDTO): Promise<{ data: User }> {
    const response = await api.put<{ data: User }>(`/api/users/${id}`, data)
    return response.data
  },

  // 사용자 삭제
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/api/users/${id}`)
  }
} 