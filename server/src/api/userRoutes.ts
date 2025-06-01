import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

export async function userRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/register', userController.register);
  fastify.post('/login', userController.login);

  // Protected routes
  fastify.get('/me', { preHandler: authenticate }, userController.getCurrentUser);
  fastify.put<{ Body: { name?: string; email?: string; password?: string } }>('/me', { preHandler: authenticate }, userController.updateUser);
  fastify.delete('/me', { preHandler: authenticate }, userController.deleteUser);
} 