-- GAME CLUB — طرح پایگاه داده Supabase
-- این فایل را یک‌بار در SQL Editor همان پروژه اجرا کنید.

create extension if not exists pgcrypto;

-- ===== مدیران (فقط کاربرانی که اینجا هستند می‌توانند تغییر دهند) =====
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ===== بازی‌ها =====
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  developer text,
  release_year int,
  genre text,
  categories text[] not null default '{}',
  rating numeric(2,1) check (rating between 0 and 5),
  description text,
  platforms text[] not null default '{}',
  download_size text,
  cover_url text,
  video_url text,
  gallery text[] not null default '{}',
  official_store_url text,
  download_url text,
  min_specs jsonb,
  rec_specs jsonb,
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  created_at timestamptz not null default now()
);

-- ===== لینک‌های پلتفرم‌ها =====
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('instagram','youtube','rubika','telegram','custom')),
  title text,
  url text not null,
  sort_order int not null default 0,
  enabled boolean not null default true
);

-- ===== تنظیمات سایت (مثلاً لوگو) =====
create table if not exists public.site_settings (
  key text primary key,
  value jsonb
);

-- ===== امنیت سطر (RLS) =====
alter table public.admin_users enable row level security;
alter table public.games enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;

create policy "admin self read" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

create policy "games public read" on public.games
  for select using (true);
create policy "games admin write" on public.games
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "social public read" on public.social_links
  for select using (enabled or public.is_admin());
create policy "social admin write" on public.social_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "settings public read" on public.site_settings
  for select using (true);
create policy "settings admin write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ===== ذخیره‌سازی فایل (کاور، گالری، ویدیو، لوگو) =====
insert into storage.buckets (id, name, public)
values ('game-media', 'game-media', true), ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

create policy "media public read" on storage.objects
  for select using (bucket_id in ('game-media', 'site-assets'));
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id in ('game-media', 'site-assets') and public.is_admin());
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id in ('game-media', 'site-assets') and public.is_admin());
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id in ('game-media', 'site-assets') and public.is_admin());

-- ===== نمونه بازی (خیالی؛ از پنل مدیریت ویرایش یا حذف کنید) =====
insert into public.games (title, developer, release_year, genre, categories, rating, description, platforms, download_size, min_specs, rec_specs, is_featured, is_popular) values
('Iron Horizon', 'Sample Studio', 2024, 'Action-Adventure', array['action','adventure'], 4.6,
 'توضیح نمونه — از پنل مدیریت ویرایش کنید.', array['PC','PS5'], '60 GB',
 '{"os":"Windows 10 64-bit","cpu":"Quad-core 3.0 GHz","gpu":"4 GB VRAM","ram_gb":8,"storage_gb":60}',
 '{"os":"Windows 11 64-bit","cpu":"6-core 3.6 GHz","gpu":"8 GB VRAM","ram_gb":16,"storage_gb":60}', true, true),
('Neon Circuit', 'Sample Studio', 2023, 'Racing', array['racing'], 4.3,
 'توضیح نمونه.', array['PC'], '35 GB',
 '{"os":"Windows 10 64-bit","cpu":"4-core 3.2 GHz","gpu":"4 GB VRAM","ram_gb":8,"storage_gb":35}',
 '{"os":"Windows 11 64-bit","cpu":"6-core 3.6 GHz","gpu":"8 GB VRAM","ram_gb":16,"storage_gb":35}', false, true),
('Harbor Tactics', 'Sample Studio', 2022, 'Strategy', array['strategy','simulation'], 4.1,
 'توضیح نمونه.', array['PC'], '18 GB',
 '{"os":"Windows 10 64-bit","cpu":"Dual-core 2.8 GHz","gpu":"2 GB VRAM","ram_gb":4,"storage_gb":18}',
 '{"os":"Windows 11 64-bit","cpu":"Quad-core 3.2 GHz","gpu":"4 GB VRAM","ram_gb":8,"storage_gb":18}', false, false),
('Hollow Depths', 'Sample Studio', 2025, 'Horror', array['horror','adventure'], 4.8,
 'توضیح نمونه.', array['PC','PS5'], '22 GB',
 '{"os":"Windows 10 64-bit","cpu":"Quad-core 3.0 GHz","gpu":"4 GB VRAM","ram_gb":8,"storage_gb":22}',
 '{"os":"Windows 11 64-bit","cpu":"6-core 3.4 GHz","gpu":"8 GB VRAM","ram_gb":16,"storage_gb":22}', false, true);
