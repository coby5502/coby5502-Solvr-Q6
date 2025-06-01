import { FastifyInstance } from 'fastify';
import { sleepAnalysisController } from '../controllers/sleepAnalysisController';
import { authenticate } from '../middleware/auth';

export async function sleepAnalysisRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authenticate);

  // Get sleep pattern analysis
  fastify.get('/pattern', sleepAnalysisController.getSleepPattern);

  // Get weekly sleep pattern
  fastify.get('/weekly', sleepAnalysisController.getWeeklyPattern);

  // Get monthly sleep pattern
  fastify.get('/monthly', sleepAnalysisController.getMonthlyPattern);

  // Get sleep recommendations
  fastify.get('/recommendations', sleepAnalysisController.getRecommendations);

  // Get environment impact analysis
  fastify.get('/environment', sleepAnalysisController.getEnvironmentImpact);
} 