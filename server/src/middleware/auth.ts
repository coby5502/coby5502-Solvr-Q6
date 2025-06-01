import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken } from '../utils/jwt'
import { UserRole } from '../types'

// Fastify의 Request 타입에 user 속성 추가
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: number
      role: UserRole
    }
  }
}

// Fastify 인증 미들웨어
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return reply.code(401).send({ error: '인증 토큰이 필요합니다.' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return reply.code(401).send({ error: '유효하지 않은 인증 토큰입니다.' })
    }

    const decoded = await verifyToken(token)
    request.user = {
      id: decoded.id,
      role: decoded.role as UserRole
    }
  } catch (error) {
    return reply.code(401).send({ error: '인증에 실패했습니다.' })
  }
}

export function requireRole(role: UserRole) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.code(401).send({ error: '인증이 필요합니다.' })
    }

    if (request.user.role !== role) {
      return reply.code(403).send({ error: '접근 권한이 없습니다.' })
    }
  }
} 