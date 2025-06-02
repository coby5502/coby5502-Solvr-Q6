// server/src/services/userService.ts
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import bcrypt from 'bcrypt'
import { db } from '../db'

type UserServiceDeps = {
  db: any
}

const mapDbUserToUser = (dbUser: any): any => ({
  ...dbUser,
  role: dbUser.role
})

export const createUserService = ({ db }: UserServiceDeps) => {
  const getAllUsers = async (): Promise<any[]> => {
    const results = await db.select().from(users)
    return results.map(mapDbUserToUser)
  }

  const getUserById = async (id: number): Promise<any | null> => {
    const [result] = await db.select().from(users).where(eq(users.id, id))
    return result ? mapDbUserToUser(result) : null
  }

  const getUserByEmail = async (email: string): Promise<any | null> => {
    const [result] = await db.select().from(users).where(eq(users.email, email))
    return result ? mapDbUserToUser(result) : null
  }

  const createUser = async (data: any): Promise<any> => {
    const { email, password, name } = data
    const password_hash = await bcrypt.hash(password, 10)
    const now = new Date().toISOString()

    const [user] = await db.insert(users)
      .values({
        email,
        name,
        password_hash,
        createdAt: now,
        updatedAt: now,
        role: 'USER'
      })
      .returning()

    if (!user) throw new Error('Failed to create user')
    return mapDbUserToUser(user)
  }

  const updateUser = async (id: number, data: any): Promise<any> => {
    const updates: any = {}
    if (data.email) updates.email = data.email
    if (data.password) updates.password_hash = await bcrypt.hash(data.password, 10)
    if (data.name) updates.name = data.name
    updates.updatedAt = new Date().toISOString()

    const [user] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning()

    if (!user) throw new Error('Failed to update user')
    return mapDbUserToUser(user)
  }

  const deleteUser = async (id: number): Promise<void> => {
    await db.delete(users).where(eq(users.id, id))
  }

  const validateUser = async (email: string, password: string): Promise<any> => {
    const user = await getUserByEmail(email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    return user
  }

  return {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    validateUser
  }
}

export type UserService = ReturnType<typeof createUserService>

export const userService = createUserService({ db })
