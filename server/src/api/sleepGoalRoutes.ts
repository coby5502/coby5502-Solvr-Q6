import { FastifyInstance } from 'fastify';
import { sleepGoalController } from '../controllers/sleepGoalController';
import { authenticate } from '../middleware/auth';

export async function sleepGoalRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authenticate);

  // Get all sleep goals for a user
  fastify.get('/:userId', sleepGoalController.getGoals);

  // Create a new sleep goal
  fastify.post('/', sleepGoalController.createGoal);

  // Update a sleep goal
  fastify.put('/:id', sleepGoalController.updateGoal);

  // Delete a sleep goal
  fastify.delete('/:id', sleepGoalController.deleteGoal);
} 