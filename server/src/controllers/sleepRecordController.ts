import { FastifyRequest, FastifyReply } from 'fastify'
import { sleepRecordService } from '../services/sleepRecordService'

export const sleepRecordController = {
  async getRecords(request: FastifyRequest<{
    Querystring: {
      startDate?: string;
      endDate?: string;
      limit?: string;
      offset?: string;
    }
  }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const { startDate, endDate, limit, offset } = request.query;
      const records = await sleepRecordService.getSleepRecords(userId, {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined
      });

      return reply.code(200).send({ data: records });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async getRecord(request: FastifyRequest<{
    Params: { id: string };
  }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const recordId = parseInt(request.params.id, 10);
      if (isNaN(recordId)) {
        return reply.code(400).send({ error: 'Invalid record ID' });
      }

      const record = await sleepRecordService.getSleepRecordById(recordId);
      if (!record) {
        return reply.code(404).send({ error: 'Record not found' });
      }

      return reply.code(200).send({ data: record });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async createRecord(request: FastifyRequest<{
    Body: {
      sleepStart: string;
      sleepEnd: string;
      sleepQuality: number;
      notes?: string;
    }
  }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const record = await sleepRecordService.createSleepRecord({
        ...request.body,
        userId
      });
      return reply.code(201).send({ data: record });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async updateRecord(request: FastifyRequest<{
    Params: { id: string };
    Body: {
      sleepStart?: string;
      sleepEnd?: string;
      sleepQuality?: number;
      notes?: string;
    }
  }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const recordId = parseInt(request.params.id, 10);
      if (isNaN(recordId)) {
        return reply.code(400).send({ error: 'Invalid record ID' });
      }

      const record = await sleepRecordService.updateSleepRecord(recordId, request.body);
      return reply.code(200).send({ data: record });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async deleteRecord(request: FastifyRequest<{
    Params: { id: string };
  }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const recordId = parseInt(request.params.id, 10);
      if (isNaN(recordId)) {
        return reply.code(400).send({ error: 'Invalid record ID' });
      }

      await sleepRecordService.deleteSleepRecord(recordId);
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async getStats(request: FastifyRequest<{
    Params: { userId: string };
    Querystring: {
      startDate?: string;
      endDate?: string;
    }
  }>, reply: FastifyReply) {
    try {
      const userId = parseInt(request.params.userId, 10);
      if (isNaN(userId)) {
        return reply.code(400).send({ error: 'Invalid userId' });
      }

      const stats = await sleepRecordService.getSleepStats(userId);
      return reply.code(200).send({ data: stats });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async getRecentRecords(request: FastifyRequest<{
    Params: { userId: string };
    Querystring: {
      limit?: string;
    }
  }>, reply: FastifyReply) {
    try {
      const userId = parseInt(request.params.userId, 10);
      const limit = parseInt(request.query.limit, 10) || 3;
      if (isNaN(userId)) {
        return reply.code(400).send({ error: 'Invalid userId' });
      }
      const records = await sleepRecordService.getRecentRecords(userId, limit);
      return reply.code(200).send({ data: records });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to fetch recent records' });
    }
  }
}

export type SleepRecordController = typeof sleepRecordController 