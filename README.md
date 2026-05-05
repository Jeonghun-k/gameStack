# 🎮 GameStack

> 게이머들을 위한 통합 포트폴리오 & 커뮤니티 플랫폼

Steam, PlayStation, Xbox 등 여러 플랫폼에 분산된 게임 이력을 한 곳에 모아 관리하고, 나만의 게이머 포트폴리오를 만들어 공유하세요.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

---

## 📸 스크린샷

| 랜딩 페이지 | 대시보드 |
|------------|---------|
| ![landing](screenshots/landing.png) | ![dashboard](screenshots/landing2.png) |

---

## ✨ 주요 기능

- **게임 라이브러리** — RAWG API로 게임을 검색해 라이브러리에 추가하고 `Backlog / Playing / Completed / Dropped` 상태로 관리
- **게임 상세 페이지** — 포스터, 장르, 메타스코어 확인 및 별점·리뷰 저장
- **플레이 통계** — 장르 분포, 상태별 현황, 월별 기록 시각화
- **프로필 공유** — 나만의 고유 링크로 게임 포트폴리오 공유
- **LFG (Team-up)** — 실시간으로 같이 게임할 팀원 모집

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 18 + Vite |
| 상태 관리 | React Context API |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | Supabase Auth (Google OAuth) |
| 외부 API | RAWG API |
| 스타일 | CSS (CSS Variables) |
| 배포 | Vercel |

---

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 컴포넌트
│   ├── Icon.jsx
│   ├── StatusBadge.jsx
│   ├── StarRating.jsx
│   ├── GlassCard.jsx
│   ├── GameCard.jsx
│   ├── Avatar.jsx
│   ├── StatCard.jsx
│   ├── TopBar.jsx
│   └── Sidebar.jsx
├── pages/               # 페이지 컴포넌트
│   ├── LandingPage.jsx
│   ├── Dashboard.jsx
│   ├── LibraryPage.jsx
│   ├── ProfilePage.jsx
│   ├── LFGPage.jsx
│   ├── StatsPage.jsx
│   └── GameDetailPage.jsx
├── context/
│   └── AuthContext.jsx  # 전역 로그인 상태
├── hooks/
│   ├── useLibrary.js    # 게임 라이브러리 CRUD
│   └── useSearch.js     # RAWG API 검색
├── lib/
│   ├── supabase.js      # Supabase 클라이언트
│   └── rawg.js          # RAWG API 함수
├── styles/
│   └── global.css
├── data/
│   └── mockData.js
├── App.jsx
└── main.jsx
```

---

## 🚀 시작하기

### 사전 준비

- Node.js 18 이상
- [Supabase](https://supabase.com) 계정
- [RAWG API](https://rawg.io/apidocs) 키

### 설치

```bash
# 레포지토리 클론
git clone https://github.com/Jeonghun-k/gameStack.git
cd gameStack

# 패키지 설치
npm install
```

### 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력합니다.

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
VITE_RAWG_KEY=rawg에서_발급받은_API_키
```

> API 키 발급 위치
> - Supabase: [supabase.com](https://supabase.com) → 프로젝트 → Settings → API
> - RAWG: [rawg.io/apidocs](https://rawg.io/apidocs) → API Key

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

---

## 🗄 데이터베이스 설정

Supabase SQL Editor에서 아래 SQL을 실행합니다.

```sql
-- 유저 프로필
CREATE TABLE profiles (
  id        uuid REFERENCES auth.users PRIMARY KEY,
  email     text,
  nickname  text,
  is_admin  boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- 게임 라이브러리
CREATE TABLE games (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users NOT NULL,
  rawg_id     integer,
  title       text,
  cover       text,
  genres      text[],
  metacritic  integer,
  status      text DEFAULT 'backlog',
  created_at  timestamp DEFAULT now()
);

-- 댓글
CREATE TABLE comments (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users NOT NULL,
  game_id     integer,
  text        text,
  created_at  timestamp DEFAULT now()
);

-- 별점
CREATE TABLE ratings (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users NOT NULL,
  game_id     integer,
  score       integer,
  UNIQUE (user_id, game_id)
);

-- RLS 활성화
ALTER TABLE games    ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "내 게임만" ON games
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "댓글 조회는 전체" ON comments
  FOR SELECT USING (true);

CREATE POLICY "댓글 작성은 본인" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "댓글 삭제는 본인" ON comments
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "별점은 본인만" ON ratings
  FOR ALL USING (auth.uid() = user_id);

-- 회원가입 시 프로필 자동 생성 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, nickname)
  VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 🌿 브랜치 전략

```
main              최종 완성본 (배포용)
  └── dev         통합 브랜치
        ├── feat/auth
        ├── feat/search
        ├── feat/library
        ├── feat/game-detail
        ├── feat/comments
        └── feat/supabase-db
```

**작업 규칙**

```bash
# 작업 시작 전
git checkout dev
git pull origin dev

# 브랜치 생성 후 작업
git checkout -b feat/내기능

# 작업 완료 후
git add .
git commit -m "feat: 기능 설명"
git push origin feat/내기능
# → GitHub에서 PR 생성 → dev로 Merge
```

---

## 👥 팀 역할 분담

| 팀원 | 담당 |
|------|------|
| 팀원 A | Supabase DB 설계, Auth, useLibrary / useSearch 훅 |
| 팀원 B | LandingPage, Dashboard, LibraryPage, GameDetailPage |
| 팀원 C | 전체 컴포넌트, ProfilePage, LFGPage, StatsPage, CSS |

---

## 📋 구현 현황

### MVP (필수)
- [x] 프로젝트 초기 세팅
- [ ] Google 로그인 / 로그아웃
- [ ] RAWG API 게임 검색
- [ ] 게임 라이브러리 추가 / 삭제
- [ ] 상태 변경 (Backlog / Playing / Completed / Dropped)
- [ ] 게임 상세 페이지
- [ ] 별점 저장
- [ ] Vercel 배포

### 추가 기능
- [ ] 댓글 시스템
- [ ] 플레이 통계 시각화
- [ ] 프로필 공개 링크
- [ ] LFG 게시글 DB 저장
- [ ] Supabase Realtime (LFG 실시간 알림)

---

## 🔗 관련 링크

- [RAWG API 문서](https://rawg.io/apidocs)
- [Supabase 문서](https://supabase.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [PRD 문서](./PRD.md)

---

## ⚠️ 주의사항

- `.env` 파일은 절대 GitHub에 올리지 않습니다
- API 키는 팀원 간 카카오톡으로만 공유합니다
- `main` 브랜치에 직접 push하지 않습니다
