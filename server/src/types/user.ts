import { UserRole, CreateUserDto, UpdateUserDto } from './index'

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface UserService {
  getUserById(id: number): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  createUser(data: CreateUserDto): Promise<User>
  updateUser(id: number, data: UpdateUserDto): Promise<User>
  deleteUser(id: number): Promise<void>
  validateUser(email: string, password: string): Promise<User>
} 