import { FastifyInstance } from 'fastify';
import { sleepAnalysisController } from '../controllers/sleepAnalysisController';
import { authenticate } from '../middleware/auth';

export async function sleepAnalysisRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authenticate);


  // Get sleep insight (멘트)
  fastify.get('/insight', sleepAnalysisController.getInsight);
} 