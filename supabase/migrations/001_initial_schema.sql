-- Zuko initial schema. Run in Supabase SQL Editor or via Supabase CLI.
-- Monetary amounts use NUMERIC(12,2) to match the current proposed project contract.
-- Revisit the team's DEC-001 decision before production use.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  university text default '',
  major text,
  academic_year text,
  semester text default 'First Semester 2026/2027',
  avatar_url text,
  matric_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  limit_amount numeric(12,2) not null check (limit_amount > 0),
  period text not null default 'monthly' check (period in ('monthly','weekly','semester')),
  color text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint budgets_user_category_period_unique unique (user_id, category, period)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'NGN' check (currency = 'NGN'),
  type text not null check (type in ('expense','income','transfer','deposit','withdrawal')),
  category text not null,
  date date not null default (now() at time zone 'Africa/Lagos')::date,
  source text not null default 'manual' check (source in ('manual','bmoni_card','bmoni_wallet','bmoni_transfer','bank_transfer','cash','campus_card','stipend')),
  status text not null default 'settled' check (status in ('initiated','pending','settled','failed','reversed')),
  is_budget_eligible boolean not null default true,
  external_reference text,
  merchant text,
  note text,
  created_at timestamptz not null default now()
);
create unique index if not exists transactions_external_reference_unique
  on public.transactions(external_reference) where external_reference is not null;
create index if not exists transactions_user_date_idx on public.transactions(user_id, date desc);

create table if not exists public.financial_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  target_amount numeric(12,2) not null check (target_amount > 0),
  current_amount numeric(12,2) not null default 0 check (current_amount >= 0),
  target_date date,
  category text not null,
  status text not null default 'in_progress' check (status in ('in_progress','completed','paused')),
  description text,
  color text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists budgets_set_updated_at on public.budgets;
create trigger budgets_set_updated_at before update on public.budgets for each row execute function public.set_updated_at();
drop trigger if exists goals_set_updated_at on public.financial_goals;
create trigger goals_set_updated_at before update on public.financial_goals for each row execute function public.set_updated_at();

-- Automatically create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.budgets enable row level security;
alter table public.transactions enable row level security;
alter table public.financial_goals enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "budgets_select_own" on public.budgets;
create policy "budgets_select_own" on public.budgets for select to authenticated using (auth.uid() = user_id);
drop policy if exists "budgets_insert_own" on public.budgets;
create policy "budgets_insert_own" on public.budgets for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "budgets_update_own" on public.budgets;
create policy "budgets_update_own" on public.budgets for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "budgets_delete_own" on public.budgets;
create policy "budgets_delete_own" on public.budgets for delete to authenticated using (auth.uid() = user_id);

 drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions for select to authenticated using (auth.uid() = user_id);
drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own" on public.transactions for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own" on public.transactions for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own" on public.transactions for delete to authenticated using (auth.uid() = user_id);

 drop policy if exists "goals_select_own" on public.financial_goals;
create policy "goals_select_own" on public.financial_goals for select to authenticated using (auth.uid() = user_id);
drop policy if exists "goals_insert_own" on public.financial_goals;
create policy "goals_insert_own" on public.financial_goals for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "goals_update_own" on public.financial_goals;
create policy "goals_update_own" on public.financial_goals for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "goals_delete_own" on public.financial_goals;
create policy "goals_delete_own" on public.financial_goals for delete to authenticated using (auth.uid() = user_id);
