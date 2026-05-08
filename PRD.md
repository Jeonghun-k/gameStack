# GameStack — Product Requirements Document

**버전**: 1.0.0  
**작성일**: 2026-05-04  
**팀**: 3인 팀 프로젝트  
**상태**: In Progress

---

## 1. 개요 (Overview)

### 1-1. 프로젝트 한 줄 정의

> 게이머들이 여러 플랫폼에 분산된 게임 이력을 한 곳에 모아 관리하고 공유할 수 있는 **통합 포트폴리오 플랫폼**

### 1-2. 배경 및 문제 정의

현재 게이머들은 Steam, PlayStation, Xbox, 모바일 등 다양한 플랫폼에서 게임을 즐기지만, 자신의 게임 이력을 통합적으로 관리하거나 공유할 수 있는 수단이 없다.

- 플랫폼마다 분산된 게임 기록
- 내가 어떤 게임을 얼마나 했는지 한눈에 파악 불가
- 게임 취향을 친구나 커뮤니티와 쉽게 공유할 방법 없음
- 비슷한 취향의 다른 게이머를 발견하고 연결할 수단이 없음

### 1-3. 목표

- 게이머가 자신의 게임 라이브러리를 한 곳에서 관리할 수 있도록 한다
- 나만의 고유 프로필 링크로 게임 이력을 공유할 수 있도록 한다
- 닉네임으로 다른 유저를 검색하고 공개 프로필을 볼 수 있도록 한다

### 1-4. 타겟 사용자

- 주 타겟: 멀티플랫폼 게이머 (10대 후반 ~ 30대)
- 부 타겟: 게임 커뮤니티 활동을 즐기는 유저
- 예상 규모: 만 명 이상

---

## 2. 기술 스택 (Tech Stack)

| 분류 | 기술 | 용도 |
|------|------|------|
| Frontend | React (Vite) | UI 구성 |
| 상태 관리 | React Context API | 전역 로그인 상태 |
| DB | Supabase (PostgreSQL) | 게임 라이브러리, 댓글, 별점 저장 |
| 인증 | Supabase Auth | Google 소셜 로그인 |
| 외부 API | RAWG API | 게임 데이터 (제목, 포스터, 장르, 메타스코어) |
| 배포 | Vercel | 프론트엔드 호스팅 |
| 버전 관리 | GitHub | 협업 및 코드 관리 |

---

## 3. 파일 구조 (Project Structure)

```
src/
  components/
    Icon.jsx
    StatusBadge.jsx
    StarRating.jsx
    GlassCard.jsx
    GameCard.jsx
    Avatar.jsx
    StatCard.jsx
    TopBar.jsx
    Sidebar.jsx
  pages/
    LandingPage.jsx
    Dashboard.jsx
    LibraryPage.jsx
    ProfilePage.jsx
    LFGPage.jsx
    StatsPage.jsx
    GameDetailPage.jsx
  context/
    AuthContext.jsx
  hooks/
    useLibrary.js
    useSearch.js
  lib/
    supabase.js
    rawg.js
  styles/
    global.css
  data/
    mockData.js
  App.jsx
  main.jsx
```

---

## 4. 데이터베이스 설계 (Database Schema)

### 4-1. 테이블 목록

#### `profiles` — 유저 정보
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | auth.users.id와 동일 (PK) |
| email | text | 이메일 |
| nickname | text | 닉네임 |
| is_admin | boolean | 관리자 여부 (기본값: false) |
| created_at | timestamp | 가입일 |
| banned_at | timestamp | 정지일 (null이면 정상) |

#### `games` — 게임 라이브러리
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| rawg_id | integer | RAWG API 게임 ID |
| title | text | 게임 제목 |
| cover | text | 포스터 이미지 URL |
| genres | text[] | 장르 배열 |
| metacritic | integer | 메타스코어 |
| status | text | backlog / playing / completed / dropped |
| created_at | timestamp | 추가일 |

#### `comments` — 댓글
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| game_id | integer | RAWG 게임 ID |
| text | text | 댓글 내용 |
| created_at | timestamp | 작성일 |

#### `ratings` — 별점
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| game_id | integer | RAWG 게임 ID |
| score | integer | 1 ~ 5점 |

> `UNIQUE(user_id, game_id)` — 1인 1점 제한

### 4-2. 테이블 관계

```
auth.users (Supabase 자동 관리)
    ├── profiles.id       닉네임, 관리자 여부
    ├── games.user_id     게임 라이브러리
    ├── comments.user_id  댓글
    └── ratings.user_id   별점
```

---

## 5. 기능 명세 (Feature Specification)

### 5-1. 인증 (Authentication)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| Google 소셜 로그인 | Supabase Auth OAuth | P0 |
| 로그아웃 | 세션 종료 | P0 |
| 로그인 상태 유지 | 새로고침 후에도 세션 복원 | P0 |
| 비로그인 접근 제한 | 라이브러리, 프로필 등 로그인 필요 페이지 보호 | P1 |

### 5-2. 게임 라이브러리 (Library)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 게임 검색 | RAWG API로 실시간 검색 | P0 |
| 게임 추가 | 검색 결과에서 라이브러리에 추가 (Supabase INSERT) | P0 |
| 상태 관리 | Backlog / Playing / Completed / Dropped 변경 (Supabase UPDATE) | P0 |
| 게임 삭제 | 라이브러리에서 제거 (Supabase DELETE) | P0 |
| 탭 필터 | 상태별 필터링 | P0 |
| 정렬 | 제목 / 별점 / 메타스코어 / 플레이 시간 순 정렬 | P1 |
| 그리드 / 리스트 뷰 | 보기 방식 전환 | P1 |

### 5-3. 게임 상세 페이지 (Game Detail)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 게임 정보 표시 | RAWG API 상세 데이터 파싱 | P0 |
| 별점 입력 | 1~5점 저장 (Supabase ratings) | P0 |
| 상태 변경 | 상세 페이지에서도 상태 변경 가능 | P1 |
| 리뷰 작성 | 한줄평 저장 | P1 |
| 댓글 | 작성 / 조회 / 삭제 (Supabase comments) | P1 |

### 5-4. 프로필 (Profile)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 내 프로필 조회 | 닉네임, 통계, 게임 목록 | P1 |
| 공개 프로필 링크 | gamestack.com/[id] 형태로 공유 | P2 |
| 닉네임 변경 | Supabase profiles UPDATE | P2 |

### 5-5. 통계 (Stats)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 장르 분포 | 내 라이브러리 기반 장르 통계 | P1 |
| 상태별 현황 | Playing / Completed / Backlog / Dropped 비율 | P1 |
| 월별 플레이 기록 | 월별 추가 게임 수 시각화 | P2 |

### 5-6. 유저 검색 (User Search)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 닉네임 검색 | profiles 테이블 ilike 검색 | P2 |
| 검색 결과 유저 카드 | 아바타, 닉네임, 가입연도 표시 | P2 |
| 공개 프로필 이동 | 유저 카드 클릭 → `/:userId` 페이지 | P2 |

---

## 6. 우선순위 정의 (Priority)

| 등급 | 의미 |
|------|------|
| P0 | 없으면 서비스 불가 — 반드시 구현 |
| P1 | 핵심 기능 — 가능하면 구현 |
| P2 | 부가 기능 — 시간 남으면 구현 |

### MVP 범위 (P0만)

```
✅ Google 로그인
✅ RAWG API 게임 검색
✅ 게임 라이브러리 추가 / 삭제
✅ 상태 변경 (Backlog / Playing / Completed / Dropped)
✅ 게임 상세 페이지
✅ 별점 저장
✅ Vercel 배포
```

---

## 7. API 명세 (API Specification)

### 7-1. RAWG API

**Base URL**: `https://api.rawg.io/api`

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/games?search={query}` | GET | 게임 검색 |
| `/games/{id}` | GET | 게임 상세 정보 |

**파싱할 필드**

```js
{
  id,               // 게임 고유 ID
  name,             // 게임 제목
  background_image, // 포스터 URL
  genres,           // 장르 배열
  metacritic,       // 메타스코어
  released,         // 출시일
  description_raw,  // 게임 설명 (상세 API)
}
```

### 7-2. Supabase

**연결 파일**: `src/lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

**주요 쿼리 패턴**

```js
// 라이브러리 조회
supabase.from('games').select('*').eq('user_id', user.id)

// 게임 추가
supabase.from('games').insert({ user_id, rawg_id, title, status: 'backlog' })

// 상태 변경
supabase.from('games').update({ status }).eq('id', gameId)

// 게임 삭제
supabase.from('games').delete().eq('id', gameId)
```

---

## 8. 환경변수 (.env)

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
VITE_RAWG_KEY=rawg에서_발급받은_API_키
```

> `.env` 파일은 `.gitignore`에 포함 — GitHub에 절대 올리지 말 것  
> 팀원 간 공유는 카카오톡으로만 진행

---

## 9. 팀 역할 분담

| 팀원 | 담당 | 주요 파일 |
|------|------|-----------|
| 팀원 A | DB / 백엔드 | supabase.js, AuthContext.jsx, useLibrary.js, useSearch.js, rawg.js |
| 팀원 B | 페이지 | LandingPage, Dashboard, LibraryPage, GameDetailPage |
| 팀원 C | 컴포넌트 / UI | components/ 전체, ProfilePage, LFGPage(유저검색), StatsPage, global.css |

---

## 10. 브랜치 전략

```
main      최종 완성본
  └── dev 통합 브랜치
        ├── feat/auth
        ├── feat/search
        ├── feat/library
        ├── feat/game-detail
        ├── feat/comments
        ├── feat/user-search
        └── feat/supabase-db
```

**작업 규칙**
- 작업 시작 전 `git pull origin dev` 필수
- 기능 완료 시 PR → dev 로 Merge
- Merge 전 카카오톡으로 팀원에게 공지

---

## 11. 미구현 / 추후 확장 계획

- 공개 프로필 링크 (`/[userId]` 라우팅) 구현
- 유저 팔로우 / 친구 기능
- Steam API 연동 (실제 플레이 시간 자동 동기화)
- 관리자 페이지 (유저 관리, 신고 처리)
- 모바일 앱 (React Native)

---

## 12. 주요 링크

| 항목 | URL |
|------|-----|
| GitHub | https://github.com/Jeonghun-k/gameStack |
| Supabase | https://supabase.com |
| RAWG API 문서 | https://rawg.io/apidocs |
| Vercel 배포 | 배포 후 추가 예정 |