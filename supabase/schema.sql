create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid references auth.users primary key,
  nom text,
  avatar_url text,
  role text default 'lecteur',
  created_at timestamp default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text unique not null,
  type text not null,
  couleur text,
  icone text,
  created_at timestamp default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text unique not null
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  slug text unique not null,
  contenu text,
  extrait text,
  image_cover text,
  auteur_id uuid references profiles(id),
  categorie_id uuid references categories(id),
  statut text default 'draft',
  featured boolean default false,
  vues integer default 0,
  created_at timestamp default now(),
  published_at timestamp
);

create table if not exists articles_tags (
  article_id uuid references articles(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create table if not exists adresses (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text unique not null,
  description text,
  categorie_id uuid references categories(id),
  adresse text,
  ville text,
  region text,
  telephone text,
  site_web text,
  email text,
  instagram text,
  image text,
  images text[],
  horaires text,
  prix_moyen text,
  statut text default 'draft',
  featured boolean default false,
  created_at timestamp default now()
);

create table if not exists avis (
  id uuid primary key default gen_random_uuid(),
  adresse_id uuid references adresses(id) on delete cascade,
  user_id uuid references profiles(id),
  note integer check (note between 1 and 5),
  commentaire text,
  created_at timestamp default now()
);

create table if not exists marques (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text unique not null,
  description text,
  logo text,
  site_web text,
  categorie_id uuid references categories(id),
  contact text,
  statut text default 'draft',
  featured boolean default false,
  created_at timestamp default now()
);

create table if not exists publicites (
  id uuid primary key default gen_random_uuid(),
  titre text,
  image text not null,
  lien text not null,
  emplacement text not null,
  date_debut date,
  date_fin date,
  actif boolean default true,
  clics integer default 0,
  impressions integer default 0,
  created_at timestamp default now()
);

create table if not exists newsletters (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  nom text,
  actif boolean default true,
  created_at timestamp default now()
);

create or replace function increment_article_vues(article_slug text)
returns void as $func$
  update articles set vues = vues + 1 where slug = article_slug;
$func$ language sql;

create or replace function is_staff()
returns boolean as $func$
  select exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'redacteur')
  );
$func$ language sql security definer;

alter table profiles enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table articles enable row level security;
alter table articles_tags enable row level security;
alter table adresses enable row level security;
alter table avis enable row level security;
alter table marques enable row level security;
alter table publicites enable row level security;
alter table newsletters enable row level security;

create policy profiles_read on profiles for select using (true);
create policy profiles_self_update on profiles for update using (auth.uid() = id);
create policy profiles_staff_all on profiles for all using (is_staff());

create policy categories_read on categories for select using (true);
create policy categories_staff on categories for all using (is_staff());

create policy tags_read on tags for select using (true);
create policy tags_staff on tags for all using (is_staff());

create policy articles_public_read on articles for select using (statut = 'published');
create policy articles_staff_read on articles for select using (is_staff());
create policy articles_staff_write on articles for all using (is_staff());

create policy articles_tags_read on articles_tags for select using (true);
create policy articles_tags_staff on articles_tags for all using (is_staff());

create policy adresses_public_read on adresses for select using (statut = 'published');
create policy adresses_staff_read on adresses for select using (is_staff());
create policy adresses_staff_write on adresses for all using (is_staff());

create policy avis_read on avis for select using (true);
create policy avis_insert on avis for insert with check (auth.uid() = user_id);
create policy avis_staff on avis for all using (is_staff());

create policy marques_public_read on marques for select using (statut = 'published');
create policy marques_staff on marques for all using (is_staff());

create policy publicites_public_read on publicites for select using (actif = true);
create policy publicites_staff on publicites for all using (is_staff());

create policy newsletters_insert on newsletters for insert with check (true);
create policy newsletters_staff on newsletters for all using (is_staff());

insert into storage.buckets (id, name, public)
values ('articles', 'articles', true), ('adresses', 'adresses', true), ('publicites', 'publicites', true)
on conflict (id) do nothing;

create policy storage_public_read on storage.objects for select using (bucket_id in ('articles', 'adresses', 'publicites'));
create policy storage_staff_write on storage.objects for insert with check (bucket_id in ('articles', 'adresses', 'publicites') and is_staff());
create policy storage_staff_update on storage.objects for update using (bucket_id in ('articles', 'adresses', 'publicites') and is_staff());
create policy storage_staff_delete on storage.objects for delete using (bucket_id in ('articles', 'adresses', 'publicites') and is_staff());
