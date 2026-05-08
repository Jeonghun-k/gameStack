# GameStack — Todo List

약간 어떤거 해야될지 모르겠을 때 이걸 보면 좋을듯

> PRD v1.0.0 기준 | 마지막 업데이트: 2026-05-07  
> 범례: ✅ 완료 · 🔄 진행중 · ⬜ 미완료
---

## 0. 프로젝트 초기 세팅

- [x] ✅ React + Vite 프로젝트 생성
- [x] ✅ ESLint 설정
- [x] ✅ `.gitignore` 설정 (.env 포함)
- [x] ✅ GitHub 레포 연결 (`feat/auth`, `feat/library` 등 브랜치 전략 수립)
- [ ] ⬜ `@supabase/supabase-js` 패키지 설치
- [x] ✅ `react-router-dom` 패키지 설치 (URL 기반 라우팅)
- [ ] ⬜ `.env` 파일 생성 및 팀원 공유 (카카오톡)
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_RAWG_KEY`

---

## 1. 파일 구조 (PRD §3)

- [x] ✅ `src/components/Icon.jsx`
- [x] ✅ `src/components/StatusBadge.jsx`
- [x] ✅ `src/components/StarRating.jsx`
- [x] ✅ `src/components/GlassCard.jsx`
- [x] ✅ `src/components/GameCard.jsx`
- [x] ✅ `src/components/Avatar.jsx`
- [x] ✅ `src/components/StatCard.jsx`
- [x] ✅ `src/components/TopBar.jsx`
- [x] ✅ `src/components/Sidebar.jsx`
- [x] ✅ `src/pages/LandingPage.jsx`
- [x] ✅ `src/pages/Dashboard.jsx`
- [x] ✅ `src/pages/LibraryPage.jsx`
- [x] ✅ `src/pages/ProfilePage.jsx`
- [x] ✅ `src/pages/LFGPage.jsx`
- [x] ✅ `src/pages/StatsPage.jsx`
- [x] ✅ `src/pages/GameDetailPage.jsx`
- [x] ✅ `src/data/mockData.js`
- [x] ✅ `src/styles/global.css`
- [x] ✅ `src/App.jsx`
- [x] ✅ `src/main.jsx`
- [x] ✅ `src/context/AuthContext.jsx` — 전역 로그인 상태 관리
- [x] ✅ `src/hooks/useLibrary.js` — 라이브러리 CRUD 훅
- [x] ✅ `src/hooks/useSearch.js` — RAWG 검색 훅
- [x] ✅ `src/lib/supabase.js` — Supabase 클라이언트 초기화
- [x] ✅ `src/lib/rawg.js` — RAWG API 호출 함수 모음

---

## 2. Supabase 설정 (PRD §4, §7-2)

### 2-1. 프로젝트 생성
- [x] ✅ Supabase 프로젝트 생성
- [x] ✅ API URL / Anon Key 발급 후 `.env` 등록

### 2-2. 테이블 생성
- [x] ✅ `profiles` 테이블 생성
  - `id` (uuid, PK = auth.users.id)
  - `email` (text)
  - `nickname` (text)
  - `is_admin` (boolean, default: false)
  - `created_at` (timestamp)
  - `banned_at` (timestamp, nullable)
- [x] ✅ `games` 테이블 생성
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → auth.users)
  - `rawg_id` (integer)
  - `title` (text)
  - `cover` (text)
  - `genres` (text[])
  - `metacritic` (integer)
  - `status` (text: backlog/playing/completed/dropped)
  - `created_at` (timestamp)
- [x] ✅ `comments` 테이블 생성
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → auth.users)
  - `game_id` (integer)
  - `text` (text)
  - `created_at` (timestamp)
- [x] ✅ `ratings` 테이블 생성
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → auth.users)
  - `game_id` (integer)
  - `score` (integer, 1~5)
  - UNIQUE(user_id, game_id)

### 2-3. RLS (Row Level Security) 설정
- [x] ✅ `games` 테이블 — 본인 데이터만 CRUD 허용
- [x] ✅ `comments` 테이블 — 조회는 전체, 작성/삭제는 본인만
- [x] ✅ `ratings` 테이블 — 본인 데이터만 CRUD 허용
- [x] ✅ `profiles` 테이블 — 조회는 전체, 수정은 본인만

---

## 3. 인증 (PRD §5-1) — 담당: 팀원 A

> 브랜치: `feat/auth` → ✅ dev 머지 완료

- [x] ✅ `src/lib/supabase.js` 작성 — createClient 초기화
- [x] ✅ `src/context/AuthContext.jsx` 작성
  - [x] ✅ Google OAuth 로그인 함수
  - [x] ✅ 로그아웃 함수
  - [x] ✅ 세션 상태 구독 (`onAuthStateChange`)
  - [x] ✅ 전역 `user` 상태 제공
- [x] ✅ **[P0]** Google 소셜 로그인 버튼 연결 (LandingPage)
- [x] ✅ **[P0]** 로그인 후 `/dashboard` 자동 리다이렉트
- [x] ✅ **[P0]** 로그아웃 버튼 연결 (Sidebar 유저 팝업 메뉴)
- [x] ✅ **[P0]** 새로고침 후 세션 복원 (AuthContext에서 처리)
- [x] ✅ Sidebar 유저 정보 실데이터 표시 (mockData 제거)
- [x] ✅ **[P1]** 비로그인 접근 제한 — Library, Profile, LFG, Stats 페이지 보호
  - 미로그인 시 LandingPage로 리다이렉트
- [x] ✅ 로그인 후 `profiles` 테이블에 유저 정보 자동 upsert

---

## 4. RAWG API 연동 (PRD §7-1) — 담당: 팀원 B

> 브랜치: `feat/search` → ✅ dev 머지 완료

- [x] ✅ RAWG API 키 발급 후 `.env` 등록
- [x] ✅ `src/lib/rawg.js` 작성
  - `searchGames(query)` — `/games?search={query}`
  - `getGameDetail(id)` — `/games/{id}`
- [x] ✅ `src/hooks/useSearch.js` 작성
  - 검색어 디바운싱 처리
  - 로딩 / 에러 상태 관리
- [x] ✅ `src/hooks/useGameDetail.js` 작성 (추가 구현)
- [x] ✅ **[P0]** LibraryPage 게임 추가 모달 — 실제 RAWG 검색으로 교체
- [x] ✅ **[P0]** GameDetailPage — RAWG 상세 API로 게임 설명 표시

---

## 5. 게임 라이브러리 (PRD §5-2) — 담당: 팀원 B

> 브랜치: `feat/library` → ✅ dev 머지 완료

### UI (완료)
- [x] ✅ **[P0]** 탭 필터 (All / Playing / Completed / Backlog / Dropped)
- [x] ✅ **[P1]** 정렬 (제목 / 별점 / 메타스코어 / 플레이 시간)
- [x] ✅ **[P1]** 그리드 / 리스트 뷰 전환
- [x] ✅ 게임 추가 모달 UI
- [x] ✅ 게임 카드 클릭 → 상세 페이지 이동

### Supabase 연동 (완료)
- [x] ✅ `src/hooks/useLibrary.js` 작성
- [x] ✅ **[P0]** 라이브러리 목록 조회 — `supabase.from('games').select('*').eq('user_id', user.id)`
- [x] ✅ **[P0]** 게임 추가 — `supabase.from('games').insert({...})`
- [x] ✅ **[P0]** 상태 변경 — `supabase.from('games').update({ status }).eq('id', gameId)`
- [x] ✅ **[P0]** 게임 삭제 버튼 UI 추가 + `supabase.from('games').delete().eq('id', gameId)`
- [x] ✅ mockData → Supabase 실데이터로 교체

---

## 6. 게임 상세 페이지 (PRD §5-3) — 담당: 팀원 B

> 브랜치: `feat/comments` → ✅ dev 머지 완료

### UI (완료)
- [x] ✅ **[P0]** 게임 정보 표시 (제목, 커버, 장르, 메타스코어, 플레이 시간, 플랫폼)
- [x] ✅ **[P0]** 별점 UI (StarRating 컴포넌트)
- [x] ✅ **[P1]** 상태 변경 버튼 UI
- [x] ✅ **[P1]** 리뷰 작성 textarea UI

### Supabase / RAWG 연동 (완료)
- [x] ✅ **[P0]** RAWG API로 게임 상세 정보 fetch (useGameDetail 훅)
- [x] ✅ **[P0]** 별점 저장 — `supabase.from('ratings').upsert({user_id, game_id, score})`
- [x] ✅ **[P1]** 상태 변경 저장 — Supabase UPDATE
- [x] ✅ **[P1]** 댓글 작성 — `supabase.from('comments').insert({...})`
- [x] ✅ **[P1]** 댓글 조회 — `supabase.from('comments').select('*').eq('game_id', id)`
- [x] ✅ **[P1]** 댓글 삭제 — 본인 글만 삭제 (RLS + user_id 2중 검증)
- [x] ✅ 라이브러리에서 게임 제거 기능
- [x] ✅ 전체 유저 평균 별점 표시

---

## 7. 프로필 (PRD §5-4) — 담당: 팀원 C

> 브랜치: `feat/profile` → ✅ dev 머지 완료

### UI (완료)
- [x] ✅ **[P1]** 프로필 헤더 (아바타, 닉네임, 바이오, 플랫폼, 가입일)
- [x] ✅ **[P1]** 통계 카드 (Total Games, Completed, Hours, Backlog)
- [x] ✅ **[P1]** Top Rated Games 섹션 (★5 완료작)
- [x] ✅ **[P1]** 공개 프로필 링크 표시 UI

### Supabase 연동 (완료)
- [x] ✅ **[P1]** 실제 로그인 유저 데이터로 교체 (mockData 제거)
- [x] ✅ **[P2]** 닉네임 변경 — Edit 버튼 기능 연결 + `supabase.from('profiles').upsert({ nickname })`
- [x] ✅ **[P2]** 공개 프로필 링크 — URL 라우팅 `/[userId]` 구현 (react-router-dom) → `feat/user-search`

---

## 8. 통계 (PRD §5-5) — 담당: 팀원 C

> 브랜치: `feat/profile` → ✅ dev 머지 완료

### UI (완료)
- [x] ✅ **[P1]** 장르 분포 바 차트
- [x] ✅ **[P1]** 월별 플레이 시간 바 차트
- [x] ✅ **[P1]** 상태별 현황 (Playing/Completed/Backlog/Dropped 비율)
- [x] ✅ 상단 통계 카드 4종 (Total Games, Completion Rate, Playing Now, Backlog Debt)

### Supabase 연동 (완료)
- [x] ✅ **[P1]** 실제 라이브러리 데이터 기반 장르 통계 집계
- [x] ✅ **[P1]** 실제 라이브러리 데이터 기반 상태별 비율 계산
- [x] ✅ **[P2]** 월별 게임 추가 수 집계 (Supabase `created_at` 기반)

---

## 9. 유저 검색 — 담당: 팀원 C

> 브랜치: `feat/user-search`

### UI (완료)
- [x] ✅ **[P2]** 검색창 UI (닉네임 입력)
- [x] ✅ **[P2]** 검색 결과 유저 카드 목록 표시 (아바타, 닉네임, 가입연도)
- [x] ✅ **[P2]** 유저 카드 클릭 → 공개 프로필 페이지 이동

### Supabase 연동
- [x] ✅ **[P2]** 닉네임으로 유저 검색 — `supabase.from('profiles').select('*').ilike('nickname', '%query%')`
- [x] ✅ **[P2]** 공개 프로필 페이지 (`/:userId`) 구현 — 닉네임·가입연도 표시 (라이브러리는 RLS로 비공개)

---

## 10. 라우팅 (react-router-dom)

- [x] ✅ `react-router-dom` 설치 및 설정
- [x] ✅ URL 기반 라우팅으로 전환
  - `/` — LandingPage
  - `/dashboard` — Dashboard
  - `/library` — LibraryPage
  - `/profile` — ProfilePage (본인)
  - `/:userId` — 공개 프로필
  - `/lfg` — LFGPage
  - `/stats` — StatsPage
  - `/game/:id` — GameDetailPage
- [x] ✅ Protected Route 컴포넌트 — 미로그인 시 `/`로 리다이렉트 (App.jsx에 구현 완료)

---

## 11. 배포 (PRD §2, §12)

- [ ] ⬜ Vercel 프로젝트 연결 (GitHub 레포 연동)
- [ ] ⬜ Vercel 환경변수 등록 (VITE_SUPABASE_URL 등)
- [ ] ⬜ `main` 브랜치 push → 자동 배포 확인
- [ ] ⬜ 배포 URL을 PRD §12 주요 링크에 추가

---

## 12. 팀원별 작업 현황

| 팀원 | 담당 | 상태 |
|------|------|------|
| 팀원 A | DB/Supabase (supabase.js, AuthContext, useLibrary, 인증) | ✅ feat/auth → dev 머지 완료 / ✅ Protected Route·profiles upsert 완료 |
| 팀원 B | RAWG API (rawg.js, useSearch, useGameDetail, LibraryPage·GameDetailPage·Dashboard 연동) | ✅ feat/search → dev 머지 완료 / ✅ feat/library → dev 머지 완료 / ✅ feat/comments → dev 머지 완료 |
| 팀원 C | 컴포넌트/UI (components 전체, ProfilePage, StatsPage, UserSearch) | ✅ UI 완료 / ✅ feat/profile → dev 머지 완료 / ✅ feat/user-search → dev 머지 완료 |

---

## 13. 추후 확장 (PRD §11 — 현재 범위 외)

- [ ] ⬜ LFG 실시간 알림 (Supabase Realtime)
- [ ] ⬜ Steam API 연동 (실제 플레이 시간 자동 동기화)
- [ ] ⬜ 관리자 페이지 (유저 관리, 신고 처리)
- [ ] ⬜ 모바일 앱 (React Native)


