import { FastifyRequest, FastifyReply } from 'fastify'
import { sleepAnalysisService } from '../services/sleepAnalysisService'

export const sleepAnalysisController = {
  getSleepStats: async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
      const { userId } = request.params
      const stats = await sleepAnalysisService.getSleepStats(Number(userId))
      return stats
    } catch (error) {
      console.error('Error getting sleep stats:', error)
      return reply.status(500).send({ message: '수면 통계를 가져오는데 실패했습니다.' })
    }
  },

  getWeeklySleepPatterns: async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
      const { userId } = request.params
      const patterns = await sleepAnalysisService.getWeeklySleepPatterns(Number(userId))
      return patterns
    } catch (error) {
      console.error('Error getting weekly sleep patterns:', error)
      return reply.status(500).send({ message: '주간 수면 패턴을 가져오는데 실패했습니다.' })
    }
  },

  getMonthlySleepPatterns: async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
      const { userId } = request.params
      const patterns = await sleepAnalysisService.getMonthlySleepPatterns(Number(userId))
      return patterns
    } catch (error) {
      console.error('Error getting monthly sleep patterns:', error)
      return reply.status(500).send({ message: '월간 수면 패턴을 가져오는데 실패했습니다.' })
    }
  },

  async getSleepPattern(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const pattern = await sleepAnalysisService.analyzeSleepPattern(userId);
      return reply.code(200).send({ pattern });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async getWeeklyPattern(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const pattern = await sleepAnalysisService.getWeeklyPattern(userId);
      return reply.code(200).send({ pattern });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async getMonthlyPattern(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const pattern = await sleepAnalysisService.getMonthlyPattern(userId);
      return reply.code(200).send({ pattern });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async getRecommendations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const recommendations = await sleepAnalysisService.getRecommendations(userId);
      return reply.code(200).send({ recommendations });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  },

  async getEnvironmentImpact(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const impact = await sleepAnalysisService.getEnvironmentImpact(userId);
      return reply.code(200).send({ impact });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
} 