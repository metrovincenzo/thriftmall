-- Tighten ThriftMall's live policy role scope and harden the signup trigger.
-- Safe to apply to the existing schema; does not change or delete user data.

-- RLS predicates already restrict ownership; also restrict these write policies
-- to signed-in users so the database policy expresses least privilege explicitly.
drop policy if exists "sellers add own products" on public.products;
create policy "sellers add own products"
  on public.products
  for insert
  to authenticated
  with check (
    seller_id = (select auth.uid())
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.type = 'seller'
    )
  );

drop policy if exists "sellers delete own products" on public.products;
create policy "sellers delete own products"
  on public.products
  for delete
  to authenticated
  using (
    seller_id = (select auth.uid())
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.type = 'seller'
    )
  );

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- This function must run with elevated privileges for the auth.users trigger.
-- Pinning an empty search_path and schema-qualifying the target table prevents
-- object-shadowing attacks against a SECURITY DEFINER function.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id, type, name, shop, loc, wa)
  values (
    new.id,
    case when new.raw_user_meta_data ->> 'type' = 'seller' then 'seller' else 'buyer' end,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), 'Member'),
    nullif(new.raw_user_meta_data ->> 'shop', ''),
    nullif(new.raw_user_meta_data ->> 'loc', ''),
    nullif(new.raw_user_meta_data ->> 'wa', '')
  );
  return new;
end;
$function$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
