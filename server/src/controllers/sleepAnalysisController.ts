import { FastifyRequest, FastifyReply } from 'fastify'
import { sleepAnalysisService } from '../services/sleepAnalysisService'

export const sleepAnalysisController = {
  getInsight: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
      const insight = await sleepAnalysisService.getInsight(userId);
      return reply.code(200).send({ insight });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
} 