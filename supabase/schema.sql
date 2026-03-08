-- =========================================================
-- Bootcamp QR Attendance - Supabase Database File
-- Event: Business Development and Brand Building Bootcamp
-- Dates: 10, 11, 12, 13, 14 March 2026
-- =========================================================

-- Optional extension support
create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- Table: profiles
-- Stores participant and admin user data
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null unique,
  year text not null,
  branch text not null,
  division text not null,
  roll_no text not null unique,
  email text not null unique,
  qr_token text not null unique,
  role text not null default 'participant' check (role in ('participant', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- Table: event_days
-- Stores the 5 allowed attendance dates
-- ---------------------------------------------------------
create table if not exists public.event_days (
  id bigint generated always as identity primary key,
  label text not null unique,
  attendance_date date not null unique
);

-- ---------------------------------------------------------
-- Table: attendance
-- Stores one row per participant per attendance date
-- ---------------------------------------------------------
create table if not exists public.attendance (
  id bigint generated always as identity primary key,
  participant_id uuid not null references public.profiles(id) on delete cascade,
  attendance_date date not null references public.event_days(attendance_date) on delete cascade,
  marked_at timestamptz not null default now(),
  marked_by uuid references public.profiles(id),
  unique (participant_id, attendance_date)
);

-- ---------------------------------------------------------
-- Seed event days
-- ---------------------------------------------------------
insert into public.event_days (label, attendance_date)
values
  ('Day 1', '2026-03-10'),
  ('Day 2', '2026-03-11'),
  ('Day 3', '2026-03-12'),
  ('Day 4', '2026-03-13'),
  ('Day 5', '2026-03-14')
on conflict (attendance_date) do nothing;

-- ---------------------------------------------------------
-- Update timestamp helper
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Admin helper function
-- SECURITY DEFINER avoids policy recursion issues
-- ---------------------------------------------------------
create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user_id
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;

-- ---------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.event_days enable row level security;
alter table public.attendance enable row level security;

-- ---------------------------------------------------------
-- Profiles policies
-- ---------------------------------------------------------
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can view own profile or admins can view all profiles" on public.profiles;
create policy "Users can view own profile or admins can view all profiles"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- ---------------------------------------------------------
-- Event day policies
-- ---------------------------------------------------------
drop policy if exists "Authenticated users can view event days" on public.event_days;
create policy "Authenticated users can view event days"
on public.event_days
for select
to authenticated
using (true);

-- ---------------------------------------------------------
-- Attendance policies
-- ---------------------------------------------------------
drop policy if exists "Participants can view own attendance and admins can view all attendance" on public.attendance;
create policy "Participants can view own attendance and admins can view all attendance"
on public.attendance
for select
to authenticated
using (participant_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Admins can insert attendance" on public.attendance;
create policy "Admins can insert attendance"
on public.attendance
for insert
to authenticated
with check (public.is_admin(auth.uid()));

-- ---------------------------------------------------------
-- Helpful indexes
-- ---------------------------------------------------------
create index if not exists attendance_participant_id_idx on public.attendance (participant_id);
create index if not exists attendance_date_idx on public.attendance (attendance_date);
create index if not exists profiles_role_idx on public.profiles (role);
