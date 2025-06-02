import { FastifyInstance } from 'fastify';
import { sleepRecordController } from '../controllers/sleepRecordController';
import { authenticate } from '../middleware/auth';
import { sleepRecordService } from '../services/sleepRecordService';

export async function sleepRecordRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authenticate);

  // Get all sleep records for the authenticated user
  fastify.get('/', sleepRecordController.getRecords);

  // Get recent sleep records
  fastify.get<{
    Params: { userId: string };
    Querystring: { limit?: string };
  }>('/:userId/recent', sleepRecordController.getRecentRecords);

  // Get sleep stats
  fastify.get<{
    Params: { userId: string };
    Querystring: { startDate?: string; endDate?: string };
  }>('/:userId/stats', sleepRecordController.getStats);

  // Create sleep record
  fastify.post<{
    Body: {
      sleepStart: string;
      sleepEnd: string;
      sleepQuality: number;
      notes?: string;
    };
  }>('/', sleepRecordController.createRecord);

  // Update sleep record
  fastify.put<{
    Params: { id: string };
    Body: {
      sleepStart?: string;
      sleepEnd?: string;
      sleepQuality?: number;
      notes?: string;
    };
  }>('/:id', sleepRecordController.updateRecord);

  // Delete sleep record
  fastify.delete<{
    Params: { id: string };
  }>('/:id', sleepRecordController.deleteRecord);

  // Get a specific sleep record
  fastify.get('/record/:id', sleepRecordController.getRecord);

  // 최근 수면 기록 조회
  fastify.get<{
    Params: { userId: string };
    Querystring: { limit?: string };
  }>('/sleep-records/:userId/recent', async (request, reply) => {
    try {
      const { userId } = request.params;
      const limit = request.query.limit ? parseInt(request.query.limit) : 7;
      
      const records = await sleepRecordService.getRecentRecords(parseInt(userId), limit);
      
      return {
        success: true,
        data: records
      };
    } catch (error) {
      console.error('Error fetching recent sleep records:', error);
      return reply.status(500).send({
        success: false,
        error: '수면 기록을 불러오는데 실패했습니다.'
      });
    }
  });

  // 수면 통계 조회
  fastify.get<{
    Params: { userId: string };
  }>('/sleep-records/:userId/stats', async (request, reply) => {
    try {
      const { userId } = request.params;
      const stats = await sleepRecordService.getSleepStats(parseInt(userId));
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching sleep stats:', error);
      return reply.status(500).send({
        success: false,
        error: '수면 통계를 불러오는데 실패했습니다.'
      });
    }
  });

  // 수면 기록 생성
  fastify.post<{
    Body: {
      userId: number;
      sleepStart: string;
      sleepEnd: string;
      sleepQuality: number;
      notes?: string;
    };
  }>('/sleep-records', async (request, reply) => {
    try {
      const record = await sleepRecordService.createSleepRecord(request.body);
      return {
        success: true,
        data: record
      };
    } catch (error) {
      console.error('Error creating sleep record:', error);
      return reply.status(500).send({
        success: false,
        error: '수면 기록 생성에 실패했습니다.'
      });
    }
  });

  // 수면 기록 수정
  fastify.put<{
    Params: { id: string };
    Body: {
      sleepStart?: string;
      sleepEnd?: string;
      sleepQuality?: number;
      notes?: string;
    };
  }>('/sleep-records/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const record = await sleepRecordService.updateSleepRecord(parseInt(id), request.body);
      return {
        success: true,
        data: record
      };
    } catch (error) {
      console.error('Error updating sleep record:', error);
      return reply.status(500).send({
        success: false,
        error: '수면 기록 수정에 실패했습니다.'
      });
    }
  });

  // 수면 기록 삭제
  fastify.delete<{
    Params: { id: string };
  }>('/sleep-records/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      await sleepRecordService.deleteSleepRecord(parseInt(id));
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting sleep record:', error);
      return reply.status(500).send({
        success: false,
        error: '수면 기록 삭제에 실패했습니다.'
      });
    }
  });
} 