# Moon Night

**Moon Night**는 건강한 수면 습관을 돕는 미니멀리즘 기반의 수면 트래킹 웹 서비스입니다.

## 주요 기능
- **수면 기록**: 취침/기상 시간, 수면 품질, 메모를 간편하게 기록/관리
- **수면 목표**: 원하는 취침/기상 시간, 목표 수면 품질 설정
- **수면 분석**: 최근 기록과 통계를 한눈에 확인
- **모던 다크 테마**: 눈에 편안한 다크 UI, 모바일 친화적 레이아웃
- **간결한 UX**: 불필요한 요소를 최소화한 직관적 인터페이스

## 기술 스택
- **Frontend**: React, Tailwind CSS, React Router, Vite
- **Backend**: Node.js, Fastify
- **Database**: SQLite with DirzzleORM
- **언어**: TypeScript

## 설치 및 실행

```bash
# 프로젝트 루트에서 의존성 설치
pnpm install

# 개발 서버 실행 (클라이언트+서버 동시)
pnpm dev

# 클라이언트만 실행
pnpm dev:client

# 서버만 실행
pnpm dev:server
```

## 환경 변수 설정
- 클라이언트: `client/.env` (예시: `client/.env.example`)
- 서버: `server/.env` (예시: `server/.env.example`)

## 주요 API 엔드포인트
- `GET /sleep-records/:userId/recent` : 최근 수면 기록 조회
- `GET /sleep-records/:userId/stats` : 수면 통계 조회
- `POST /sleep-records` : 수면 기록 추가
- `PUT /sleep-records/:id` : 수면 기록 수정
- `DELETE /sleep-records/:id` : 수면 기록 삭제
- `GET /sleep-goals/:userId` : 수면 목표 조회
- `POST /sleep-goals` : 수면 목표 설정/수정
- `GET /sleep-analysis/insight` : 맞춤형 추천 멘트(인사이트) 생성

---

> Moon Night와 함께 더 나은 수면 습관을 만들어보세요!

# Changelog

## [최신 업데이트]

- **Gemini AI 기반 맞춤형 인사이트**
  - Google Gemini AI API를 활용해 최근 수면 기록을 분석, 한 문장으로 간결한 수면 팁/인사이트를 자동 생성하여 제공합니다.
  - 인사이트 생성 중에는 자연스러운 안내 메시지가 표시됩니다.

## [이전 업데이트]

- **분석(Analysis) 탭 개선**
  - 수면 시간 추이, 수면 품질 추이 그래프(트렌드 차트) 추가
  - 최근 수면 기록을 기반으로 한 맞춤형 추천 멘트(인사이트) 상단에 표시 (서버에서 동적으로 생성)
  - 맞춤형 추천 멘트(인사이트) 생성을 위한 신규 API(`/sleep-analysis/insight`) 추가
