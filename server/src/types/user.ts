// 사용자 역할 Enum
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

// 사용자 생성 DTO
export interface CreateUserDto {
  name: string
  email: string
  password: string
  role?: UserRole
}

// 사용자 수정 DTO
export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
  role?: UserRole
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    name: string
    email: string
    role: UserRole
    createdAt: string
    updatedAt: string
  }
  token: string
}