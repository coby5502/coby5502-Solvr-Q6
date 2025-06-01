import { FastifyInstance } from 'fastify';
import { sleepRecordController } from '../controllers/sleepRecordController';
import { authenticate } from '../middleware/auth';

export async function sleepRecordRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authenticate);

  // Get all sleep records for a user
  fastify.get('/:userId', sleepRecordController.getRecords);

  // Get recent sleep records for a user
  fastify.get('/:userId/recent', sleepRecordController.getRecentRecords);

  // Get a specific sleep record
  fastify.get('/record/:id', sleepRecordController.getRecord);

  // Create a new sleep record
  fastify.post('/', sleepRecordController.createRecord);

  // Update a sleep record
  fastify.put('/:id', sleepRecordController.updateRecord);

  // Delete a sleep record
  fastify.delete('/:id', sleepRecordController.deleteRecord);

  // Get sleep statistics
  fastify.get('/stats/:userId', sleepRecordController.getStats);

  // Get all sleep records for the authenticated user
  fastify.get('/', sleepRecordController.getRecords);
} 