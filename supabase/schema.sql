-- ============================================================
--  SoccerLink — schéma Postgres + RLS
--  À exécuter dans Supabase → SQL Editor
--
--  Script rejouable : le bloc « reset » ci-dessous supprime les
--  tables SoccerLink (et d'éventuelles tables homonymes d'une
--  ancienne app) pour repartir propre. Ne pas lancer sur une base
--  dont tu veux garder ces tables.
-- ============================================================

-- ── Reset ───────────────────────────────────────────────────
-- Supprime chaque objet quel que soit son type (table / vue / vue matérialisée)
do $$
declare r record;
begin
  for r in
    select c.relname, c.relkind
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in ('league_standings','ratings','match_players','matches','leagues','venues','profiles')
  loop
    if r.relkind = 'v' then
      execute format('drop view if exists public.%I cascade', r.relname);
    elsif r.relkind = 'm' then
      execute format('drop materialized view if exists public.%I cascade', r.relname);
    else
      execute format('drop table if exists public.%I cascade', r.relname);
    end if;
  end loop;
end $$;

drop policy if exists "avatars_read"   on storage.objects;
drop policy if exists "avatars_write"  on storage.objects;
drop policy if exists "avatars_update" on storage.objects;

create extension if not exists pgcrypto;

-- ── Tables ──────────────────────────────────────────────────

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  avatar_url text,
  city text,
  position text check (position in ('GK','DEF','MID','FWD')),
  preferred_foot text check (preferred_foot in ('left','right','both')),
  rank text default 'Bronze',
  points int default 0,
  matches_played int default 0,
  wins int default 0,
  goals int default 0,
  assists int default 0,
  clean_sheets int default 0,
  created_at timestamptz default now()
);

create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  lat double precision,
  lng double precision,
  formats text[]
);

create table if not exists leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  format text,
  admin_id uuid references profiles(id),
  season text,
  starts_on date,
  ends_on date,
  created_at timestamptz default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles(id),
  venue_id uuid references venues(id),
  format text check (format in ('5v5','7v7','11v11')),
  starts_at timestamptz not null,
  slots int not null,
  price_per_player numeric,
  level text,
  status text default 'open' check (status in ('open','full','played','rated','cancelled')),
  score_a int,
  score_b int,
  league_id uuid references leagues(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists match_players (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references profiles(id) on delete cascade,
  team char(1) check (team in ('A','B')),
  is_waitlisted boolean default false,
  goals int default 0,
  assists int default 0,
  clean_sheet boolean default false,
  created_at timestamptz default now(),
  unique (match_id, player_id)
);

create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  rater_id uuid references profiles(id) on delete cascade,
  rated_id uuid references profiles(id) on delete cascade,
  c1 int check (c1 between 1 and 5),
  c2 int check (c2 between 1 and 5),
  c3 int check (c3 between 1 and 5),
  c4 int check (c4 between 1 and 5),
  c5 int check (c5 between 1 and 5),
  created_at timestamptz default now(),
  unique (match_id, rater_id, rated_id),
  check (rater_id <> rated_id)
);

create table if not exists league_standings (
  league_id uuid references leagues(id) on delete cascade,
  player_id uuid references profiles(id) on delete cascade,
  played int default 0,
  won int default 0,
  drawn int default 0,
  lost int default 0,
  goals_for int default 0,
  goals_against int default 0,
  points int default 0,
  primary key (league_id, player_id)
);

-- ── Index ───────────────────────────────────────────────────
create index if not exists idx_matches_starts_at on matches (starts_at);
create index if not exists idx_matches_status on matches (status);
create index if not exists idx_match_players_match on match_players (match_id);
create index if not exists idx_match_players_player on match_players (player_id);
create index if not exists idx_ratings_rated on ratings (rated_id);
create index if not exists idx_standings_league on league_standings (league_id);

-- ── Droits d'accès (GRANT) pour l'API Supabase ──────────────
-- Sans ces droits : "permission denied for table ...". La RLS ci-dessous
-- reste la vraie barrière de sécurité au niveau ligne.
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;

-- ── RLS ─────────────────────────────────────────────────────
alter table profiles         enable row level security;
alter table venues           enable row level security;
alter table leagues          enable row level security;
alter table matches          enable row level security;
alter table match_players    enable row level security;
alter table ratings          enable row level security;
alter table league_standings enable row level security;

-- profiles : lecture publique, écriture par le propriétaire
create policy "profiles_read"   on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- venues : lecture publique, ajout par tout utilisateur authentifié
create policy "venues_read"   on venues for select using (true);
create policy "venues_insert" on venues for insert with check (auth.role() = 'authenticated');

-- leagues : lecture publique, gérées par leur admin
create policy "leagues_read"   on leagues for select using (true);
create policy "leagues_insert" on leagues for insert with check (auth.uid() = admin_id);
create policy "leagues_update" on leagues for update using (auth.uid() = admin_id);
create policy "leagues_delete" on leagues for delete using (auth.uid() = admin_id);

-- matches : lecture publique, gérés par leur créateur
create policy "matches_read"   on matches for select using (true);
create policy "matches_insert" on matches for insert with check (auth.uid() = creator_id);
create policy "matches_update" on matches for update using (auth.uid() = creator_id);
create policy "matches_delete" on matches for delete using (auth.uid() = creator_id);

-- match_players : lecture publique ; inscription = soi-même ;
--                 modif/suppression = soi-même ou créateur du match
create policy "mp_read"   on match_players for select using (true);
create policy "mp_insert" on match_players for insert with check (auth.uid() = player_id);
create policy "mp_update" on match_players for update using (
  auth.uid() = player_id
  or auth.uid() = (select creator_id from matches m where m.id = match_id)
);
create policy "mp_delete" on match_players for delete using (
  auth.uid() = player_id
  or auth.uid() = (select creator_id from matches m where m.id = match_id)
);

-- ratings : lecture publique ; on ne peut noter que sous son nom, pas soi-même
create policy "ratings_read"   on ratings for select using (true);
create policy "ratings_insert" on ratings for insert with check (auth.uid() = rater_id and rater_id <> rated_id);
create policy "ratings_update" on ratings for update using (auth.uid() = rater_id);

-- league_standings : lecture publique ; écriture par l'admin de la ligue
create policy "standings_read"   on league_standings for select using (true);
create policy "standings_write"  on league_standings for all using (
  auth.uid() = (select admin_id from leagues l where l.id = league_id)
) with check (
  auth.uid() = (select admin_id from leagues l where l.id = league_id)
);

-- ── Storage : bucket avatars ────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_read"   on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_write"  on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "avatars_update" on storage.objects for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');
