import { FastifyRequest, FastifyReply } from 'fastify';
import { sleepGoalService } from '../services/sleepGoalService';

export const sleepGoalController = {
  async createGoal(request: FastifyRequest<{
    Body: {
      bedtimeTime: string;
      wakeupTime: string;
      targetSleepQuality: number;
    }
  }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
      const goal = await sleepGoalService.createSleepGoal({
        ...request.body,
        userId
      });
      return reply.code(201).send({ goal });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async updateGoal(request: FastifyRequest<{
    Params: { id: string };
    Body: {
      bedtimeTime?: string;
      wakeupTime?: string;
      targetSleepQuality?: number;
    }
  }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
      const goalId = parseInt(request.params.id, 10);
      if (isNaN(goalId)) {
        return reply.code(400).send({ error: 'Invalid goal ID' });
      }
      const goal = await sleepGoalService.updateSleepGoal(goalId, request.body);
      return reply.code(200).send({ goal });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async deleteGoal(request: FastifyRequest<{
    Params: { id: string };
  }>, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
      const goalId = parseInt(request.params.id, 10);
      if (isNaN(goalId)) {
        return reply.code(400).send({ error: 'Invalid goal ID' });
      }
      await sleepGoalService.deleteSleepGoal(goalId);
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async getGoals(request: FastifyRequest<{
    Params: { userId: string };
  }>, reply: FastifyReply) {
    try {
      const userId = parseInt(request.params.userId, 10);
      if (isNaN(userId)) {
        return reply.code(400).send({ error: 'Invalid user ID' });
      }
      const goals = await sleepGoalService.getSleepGoals(userId);
      return reply.code(200).send({ data: goals });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
};

export type SleepGoalController = typeof sleepGoalController; 
export type SleepGoalController = typeof sleepGoalController; 