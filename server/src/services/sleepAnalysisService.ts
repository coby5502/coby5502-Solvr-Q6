import { eq, sql } from 'drizzle-orm'
import { sleepRecords } from '../db/schema'
import { Database } from '../types/database'
import { db } from '../db'

type SleepAnalysisServiceDeps = {
  db: Database
}

export const createSleepAnalysisService = ({ db }: SleepAnalysisServiceDeps) => {
  // 수면 인사이트(멘트) 생성 함수
  const getInsight = async (userId: number): Promise<string> => {
    // 최근 7개 기록 가져오기 (최신순)
    const records = await db.select()
      .from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(sql`${sleepRecords.sleepStart} DESC`)
      .limit(7);

    if (records.length === 0) return '최근 수면 기록이 없습니다. 기록을 추가해보세요!';

    // 평균값
    const avgDur = records.reduce((sum, r) => sum + ((new Date(r.sleepEnd).getTime() - new Date(r.sleepStart).getTime()) / (1000 * 60 * 60)), 0) / records.length;
    const avgQual = records.reduce((sum, r) => sum + r.sleepQuality, 0) / records.length;

    // 최근 2~3일 데이터
    const recentN = Math.min(3, records.length);
    const lastRecords = records.slice(0, recentN);
    const lastAvgDur = lastRecords.reduce((sum, r) => sum + ((new Date(r.sleepEnd).getTime() - new Date(r.sleepStart).getTime()) / (1000 * 60 * 60)), 0) / recentN;
    const lastAvgQual = lastRecords.reduce((sum, r) => sum + r.sleepQuality, 0) / recentN;

    // 상황별 멘트
    if (lastAvgDur < 6 && lastAvgQual < 3) {
      return '최근 며칠간 수면 시간과 품질이 모두 부족해요. 일찍 잠자리에 들고, 자기 전 휴대폰 사용을 줄여보세요.';
    }
    if (lastAvgDur < 6 && lastAvgQual >= 3) {
      return '최근 수면 시간이 부족하지만 품질은 나쁘지 않아요. 조금만 더 일찍 자면 더 좋은 컨디션을 기대할 수 있어요!';
    }
    if (lastAvgDur >= 6 && lastAvgDur < 7.5 && lastAvgQual < 3) {
      return '수면 시간은 평균에 가깝지만 품질이 낮아요. 자기 전 카페인, 스마트폰 사용을 줄여보세요.';
    }
    if (lastAvgDur >= 7.5 && lastAvgDur <= 9 && lastAvgQual >= 4) {
      return '최근 수면 시간과 품질 모두 훌륭해요! 지금처럼 꾸준히 관리해보세요.';
    }
    if (lastAvgDur > 9 && lastAvgQual < 3) {
      return '수면 시간이 길지만 품질이 낮아요. 깊은 잠을 방해하는 요인이 있는지 점검해보세요.';
    }
    if (lastAvgDur > 9 && lastAvgQual >= 3) {
      return '수면 시간이 다소 긴 편이에요. 너무 오래 자면 오히려 피로할 수 있으니 적당한 수면을 유지해보세요.';
    }
    if (lastAvgDur >= 6 && lastAvgDur < 7.5 && lastAvgQual >= 3) {
      return '수면 시간과 품질이 평균에 가까워요. 규칙적인 생활을 유지하면 더 좋은 결과를 얻을 수 있어요!';
    }
    // 최근 급격한 변화
    if (lastAvgDur < avgDur - 1) {
      return '최근 수면 시간이 평소보다 줄었어요. 피로가 쌓이지 않도록 주의하세요.';
    }
    if (lastAvgDur > avgDur + 1) {
      return '최근 수면 시간이 평소보다 늘었어요. 몸이 필요로 하는 휴식일 수 있으니 컨디션을 체크해보세요.';
    }
    if (lastAvgQual < avgQual - 1) {
      return '최근 수면 품질이 평소보다 떨어졌어요. 스트레스나 환경 변화를 점검해보세요.';
    }
    if (lastAvgQual > avgQual + 1) {
      return '최근 수면 품질이 평소보다 좋아졌어요! 좋은 습관을 계속 유지해보세요.';
    }
    return '수면 패턴이 비교적 안정적이에요. 꾸준히 기록하며 건강한 수면 습관을 이어가세요!';
  };

  return {
    getInsight
  }
}

export type SleepAnalysisService = ReturnType<typeof createSleepAnalysisService>

export const sleepAnalysisService = createSleepAnalysisService({ db }) 