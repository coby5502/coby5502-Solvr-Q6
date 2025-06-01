import { FastifyRequest, FastifyReply } from 'fastify'
import { userService } from '../services/userService'
import { generateToken } from '../utils/jwt'

export const userController = {
  async register(request: FastifyRequest<{
    Body: {
      email: string;
      password: string;
      name: string;
    }
  }>, reply: FastifyReply) {
    try {
      const { email, password, name } = request.body;
      const user = await userService.createUser({ email, password, name });
      const token = generateToken({ id: user.id, role: user.role });
      
      return reply.code(201).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async login(request: FastifyRequest<{
    Body: {
      email: string;
      password: string;
    }
  }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;
      const user = await userService.validateUser(email, password);
      const token = generateToken({ id: user.id, role: user.role });
      
      return reply.code(200).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(401).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      return reply.code(200).send({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async updateUser(request: FastifyRequest<{
    Body: {
      name?: string;
      email?: string;
      password?: string;
    }
  }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const updatedUser = await userService.updateUser(userId, request.body);
      return reply.code(200).send({
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      await userService.deleteUser(userId);
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
}

export type UserController = typeof userController
