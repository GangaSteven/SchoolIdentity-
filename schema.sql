-- Proposition de schéma initial SchoolIdentity.
-- À examiner et adapter avant exécution dans un projet Supabase.
-- Ne pas exécuter sur la base TransConnect ni sur une base existante sans audit.

create extension if not exists pgcrypto;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school_code text unique not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.parents (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  parent_id uuid not null references public.parents(id),
  student_number text not null,
  full_name text not null,
  class_name text,
  created_at timestamptz not null default now(),
  unique (school_id, student_number)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id),
  school_id uuid not null references public.schools(id),
  status text not null default 'pending'
    check (status in ('pending','active','expired','cancelled')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id),
  token_hash text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  student_id uuid not null references public.students(id),
  scanned_by uuid not null references auth.users(id),
  event_type text not null check (event_type in ('arrival','departure')),
  device_event_id text not null,
  scanned_at timestamptz not null,
  synced_at timestamptz default now(),
  created_at timestamptz not null default now(),
  unique (school_id, device_event_id)
);

create table if not exists public.sms_logs (
  id uuid primary key default gen_random_uuid(),
  attendance_id uuid not null references public.attendance_logs(id),
  recipient_phone text not null,
  provider_message_id text,
  status text not null default 'queued'
    check (status in ('queued','sent','delivered','failed')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists students_school_idx on public.students(school_id);
create index if not exists students_parent_idx on public.students(parent_id);
create index if not exists attendance_student_date_idx on public.attendance_logs(student_id, scanned_at desc);
create index if not exists subscriptions_parent_status_idx on public.subscriptions(parent_id, status);

-- À compléter impérativement :
-- * table de rôles (admin, school_admin, supervisor, parent)
-- * RLS stricte sur chaque table
-- * validation serveur des paiements et abonnements
-- * calculs de commissions et journal comptable
-- * file SMS et gestion idempotente des événements
-- * règles de rétention et consentement pour les données des mineurs
