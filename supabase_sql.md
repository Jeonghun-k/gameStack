# GameStack — Supabase SQL

## 1. 테이블 생성 (순서대로 실행)

### profiles
```sql
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  nickname text,
  is_admin boolean default false,
  created_at timestamp with time zone default now(),
  banned_at timestamp with time zone
);
```

### games
```sql
create table games (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  rawg_id integer,
  title text not null,
  cover text,
  genres text[],
  metacritic integer default 0,
  status text default 'backlog' check (status in ('backlog','playing','completed','dropped')),
  created_at timestamp with time zone default now()
);
```

### comments
```sql
create table comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  game_id integer not null,
  text text not null,
  created_at timestamp with time zone default now()
);
```

### ratings
```sql
create table ratings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  game_id integer not null,
  score integer check (score between 1 and 5),
  unique(user_id, game_id)
);
```

---

## 2. RLS 보안정책 (테이블 생성 후 실행)

```sql
-- RLS 활성화
alter table profiles enable row level security;
alter table games enable row level security;
alter table ratings enable row level security;
alter table comments enable row level security;

-- profiles 정책 (전체 조회 가능, 본인만 수정)
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- games 정책 (본인 데이터만)
create policy "games_select" on games for select using (auth.uid() = user_id);
create policy "games_insert" on games for insert with check (auth.uid() = user_id);
create policy "games_update" on games for update using (auth.uid() = user_id);
create policy "games_delete" on games for delete using (auth.uid() = user_id);

-- ratings 정책
create policy "ratings_select" on ratings for select using (auth.uid() = user_id);
create policy "ratings_insert" on ratings for insert with check (auth.uid() = user_id);
create policy "ratings_update" on ratings for update using (auth.uid() = user_id);
create policy "ratings_delete" on ratings for delete using (auth.uid() = user_id);

-- comments 정책 (댓글은 전체 조회 가능, 작성/삭제는 본인만)
create policy "comments_select" on comments for select using (true);
create policy "comments_insert" on comments for insert with check (auth.uid() = user_id);
create policy "comments_delete" on comments for delete using (auth.uid() = user_id);
```

---

## 실행 순서

1. `profiles` 테이블 생성
2. `games` 테이블 생성
3. `comments` 테이블 생성
4. `ratings` 테이블 생성
5. RLS 보안정책 전체 실행

> `lfg_posts` 테이블은 코드에서 사용하지 않으므로 생성 불필요
