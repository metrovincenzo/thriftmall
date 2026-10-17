-- ThriftMall auth/profile security migration.
-- Keeps existing user IDs and product data; adds private preferences and tightens client privileges.

begin;

create table if not exists public.profile_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  follows text[] not null default '{}',
  updates_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profile_preferences enable row level security;

drop policy if exists "Users can read their own preferences" on public.profile_preferences;
create policy "Users can read their own preferences"
  on public.profile_preferences for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Users can create their own preferences" on public.profile_preferences;
create policy "Users can create their own preferences"
  on public.profile_preferences for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "Users can update their own preferences" on public.profile_preferences;
create policy "Users can update their own preferences"
  on public.profile_preferences for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Public profile fields only. Account roles and created_at are not client-editable.
revoke all privileges on table public.profiles from public, anon, authenticated;
grant select (id, type, name, shop, loc, wa, logo_url) on table public.profiles to anon, authenticated;
grant update (name, shop, loc, wa, logo_url) on table public.profiles to authenticated;

-- Public catalog reads; seller writes remain controlled by the existing RLS policies.
revoke all privileges on table public.products from public, anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert (seller_id, name, price, size, cond, cat, img_url) on table public.products to authenticated;
grant delete on table public.products to authenticated;

do $$
declare seq_name text;
begin
  seq_name := pg_get_serial_sequence('public.products', 'id');
  if seq_name is not null then
    execute format('grant usage, select on sequence %s to authenticated', seq_name);
  end if;
end;
$$;

revoke all privileges on table public.profile_preferences from public, anon, authenticated;
grant select, insert, update on table public.profile_preferences to authenticated;

-- Trigger functions should not be exposed as callable browser RPCs.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

commit;
