export interface User {
  id: number
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface CreateUserDTO {
  email: string
  password: string
  name: string
}

export interface UpdateUserDTO {
  email?: string
  name?: string
  password?: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}
