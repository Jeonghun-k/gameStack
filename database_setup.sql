-- Хуучин хүснэгтүүд байвал устгах (Цэвэрлэж эхлэх)
drop table if exists ratings cascade;
drop table if exists comments cascade;
drop table if exists games cascade;
drop table if exists profiles cascade;

-- 1. Profiles хүснэгт үүсгэх
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  nickname text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  banned_at timestamp with time zone
);

-- 2. Games хүснэгт үүсгэх (Library)
create table games (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  rawg_id integer not null,
  title text not null,
  cover text,
  genres text[],
  metacritic integer,
  status text not null check (status in ('backlog', 'playing', 'completed', 'dropped')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Comments хүснэгт үүсгэх
create table comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  game_id integer not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Ratings хүснэгт үүсгэх
create table ratings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  game_id integer not null,
  score integer not null check (score between 1 and 5),
  unique(user_id, game_id)
);

-- 5. Хамгаалалтын дүрэм (Row Level Security - RLS) асаах
alter table profiles enable row level security;
alter table games enable row level security;
alter table comments enable row level security;
alter table ratings enable row level security;

-- Profiles: Бүгд харах боломжтой, гэхдээ зөвхөн өөрийнхөөгөө засна
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Games: Бүгд харах боломжтой, гэхдээ зөвхөн өөрөө нэмж устгана
create policy "Public games are viewable by everyone." on games for select using (true);
create policy "Users can insert own games." on games for insert with check (auth.uid() = user_id);
create policy "Users can update own games." on games for update using (auth.uid() = user_id);
create policy "Users can delete own games." on games for delete using (auth.uid() = user_id);

-- Comments & Ratings: Бүгд харна, өөрөө нэмж засна
create policy "Comments are viewable by everyone." on comments for select using (true);
create policy "Users can insert own comments." on comments for insert with check (auth.uid() = user_id);
create policy "Users can update own comments." on comments for update using (auth.uid() = user_id);
create policy "Users can delete own comments." on comments for delete using (auth.uid() = user_id);

create policy "Ratings are viewable by everyone." on ratings for select using (true);
create policy "Users can insert own ratings." on ratings for insert with check (auth.uid() = user_id);
create policy "Users can update own ratings." on ratings for update using (auth.uid() = user_id);
create policy "Users can delete own ratings." on ratings for delete using (auth.uid() = user_id);
