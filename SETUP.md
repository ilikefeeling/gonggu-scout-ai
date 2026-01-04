# Gong-gu Scout AI - Setup & Run Guide

이 가이드는 Gong-gu Scout AI 프로젝트를 로컬에서 실행하는 방법을 설명합니다.

## 사전 요구사항

- Node.js 18+ 설치됨 ✅
- PostgreSQL 18+ 설치됨 ✅

## 환경 설정

### 1. 데이터베이스 연결 설정

`backend/.env` 파일을 생성하고 아래 내용을 입력해주세요:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/gonggu_scout?schema=public"
PORT=3001
```

**중요:** `YOUR_PASSWORD` 부분을 실제 PostgreSQL postgres 사용자의 비밀번호로 변경해주세요.

### 2. 데이터베이스 생성

PostgreSQL에서 `gonggu_scout` 데이터베이스를 생성합니다:

```bash
# PowerShell에서 실행
psql -U postgres -c "CREATE DATABASE gonggu_scout;"
```

비밀번호를 입력하라는 메시지가 나타나면 PostgreSQL 비밀번호를 입력하세요.

### 3. Prisma 설정 및 시드 데이터 생성

```bash
npm run setup:backend
```

이 명령은 다음을 수행합니다:

- Prisma 클라이언트 생성
- 데이터베이스 스키마 푸시
- 30개의 mock 인플루언서 데이터 생성

## 실행 방법

### 개발 모드 (권장)

프론트엔드와 백엔드를 동시에 실행:

```bash
npm run dev
```

또는 개별 실행:

```bash
# 터미널 1 - 백엔드
npm run dev:backend

# 터미널 2 - 프론트엔드  
npm run dev:frontend
```

### 접속 URL

- **프론트엔드:** <http://localhost:5173>
- **백엔드 API:** <http://localhost:3001/api>
- **Health Check:** <http://localhost:3001/api/health>

## 주요 기능

### 검색 필터

- 카테고리별 검색 (육아, 주방/리빙, 헬스/다이어트, 뷰티, 패션, 테크)
- 팔로워 수 범위 필터 (1K - 1M)
- 평균 릴스 조회수 범위 필터
- 정렬 옵션 (참여율, 팔로워, 최근 공구)

### 인플루언서 카드

- 프로필 정보 (이름, 카테고리)
- 주요 메트릭 (팔로워, 평균 조회수, 참여율)
- 공구 활동성 (최근 공구 D-Day)
- 판매 피로도 (🟢 신선함 / 🟡 보통 / 🔴 높음)

### 상세 보기

- 종합 메트릭 분석
- 공구 활동 내역
- 판매 피로도 심층 분석
- 예상 수익성 (Phase 2 준비 중)

## 문제 해결

### "DATABASE_URL not found" 에러

- `backend/.env` 파일이 올바르게 생성되었는지 확인
- PostgreSQL 비밀번호가 정확한지 확인

### PostgreSQL 연결 실패

- PostgreSQL 서비스가 실행 중인지 확인
- 포트 5432가 사용 가능한지 확인

### 포트 충돌

- 3001 (백엔드) 또는 5173 (프론트엔드) 포트가 이미 사용 중인 경우
- 다른 프로세스를 종료하거나 `.env`에서 다른 포트로 변경

## 다음 단계 (Phase 2)

- Instagram Graph API 실제 연동
- NLP 기반 댓글 감성 분석
- 진성 도달률 계산 (Outlier 제거)
- 수익 시뮬레이터
- 제안서 자동 생성
