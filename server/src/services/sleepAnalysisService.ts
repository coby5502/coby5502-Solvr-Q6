import { eq, sql } from 'drizzle-orm'
import { sleepRecords } from '../db/schema'
import { db } from '../db'
import { GoogleGenAI } from '@google/genai'

type SleepAnalysisServiceDeps = {
  db: any
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const createSleepAnalysisService = ({ db }: SleepAnalysisServiceDeps) => {
  // 수면 인사이트(멘트) 생성 함수
  const getInsight = async (userId: number): Promise<string> => {
    // 최근 7개 기록 가져오기 (최신순)
    const records: any[] = await db.select()
      .from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(sql`${sleepRecords.sleepStart} DESC`)
      .limit(7);

    if (records.length === 0) return '최근 수면 기록이 없습니다. 기록을 추가해보세요!';

    // 최근 기록 요약
    const sleepSummaries = records.map((r: any) => {
      const sleepStart = new Date(r.sleepStart);
      const sleepEnd = new Date(r.sleepEnd);
      const duration = ((sleepEnd.getTime() - sleepStart.getTime()) / (1000 * 60 * 60)).toFixed(1);
      return `날짜: ${sleepStart.toLocaleDateString('ko-KR')}, 취침: ${sleepStart.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}, 기상: ${sleepEnd.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}, 수면시간: ${duration}시간, 수면품질: ${r.sleepQuality}점`;
    }).join('\n');

    // 프롬프트 생성
    const prompt = `아래는 한 사용자의 최근 7일 수면 기록입니다. 취침시간, 기상시간, 수면시간, 수면품질을 모두 고려해서, 한국어로 딱 한 문장, 30자 이내로, 아무 스타일 없이 실질적인 수면 팁이나 인사이트를 짧게 말해줘.\n\n${sleepSummaries}`;

    try {
      if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not set');
        return 'AI 기반 인사이트 생성에 실패했습니다. API 키가 설정되지 않았습니다.';
      }

      const config = { responseMimeType: 'text/plain' };
      const model = 'gemma-3-1b-it';
      const contents = [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ];

      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let result = '';
      for await (const chunk of response) {
        if (typeof chunk.text === 'string') {
          result += chunk.text;
        }
      }

      if (!result) {
        console.error('No text content in Gemini API response');
        return '수면 기록을 기반으로 한 인사이트를 생성하지 못했습니다.';
      }

      return result.trim();
    } catch (e) {
      console.error('Error in getInsight:', e);
      if (e instanceof Error) {
        console.error('Error details:', e.message);
      }
      return 'AI 기반 인사이트 생성에 실패했습니다. 나중에 다시 시도해 주세요.';
    }
  };

  return {
    getInsight
  }
}

export type SleepAnalysisService = ReturnType<typeof createSleepAnalysisService>

export const sleepAnalysisService = createSleepAnalysisService({ db }) 