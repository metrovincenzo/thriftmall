-- ThriftMall production hardening.
-- Tightens write-policy roles, hardens the auth trigger search_path, and indexes seller lookups.
-- No user data is changed or deleted by this migration.

begin;

-- SECURITY DEFINER functions must not resolve unqualified objects through a writable schema.
-- Every application table reference in this trigger is schema-qualified.
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
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Keep public catalog/profile reads public, but explicitly scope all write policies
-- to authenticated users and cache auth.uid() per statement.
drop policy if exists "shops public, own profile private" on public.profiles;
create policy "shops public, own profile private"
  on public.profiles for select to anon, authenticated
  using (type = 'seller' or id = (select auth.uid()));

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "products public" on public.products;
create policy "products public"
  on public.products for select to anon, authenticated
  using (true);

drop policy if exists "sellers add own products" on public.products;
create policy "sellers add own products"
  on public.products for insert to authenticated
  with check (
    seller_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.type = 'seller'
    )
  );

drop policy if exists "sellers delete own products" on public.products;
create policy "sellers delete own products"
  on public.products for delete to authenticated
  using (
    seller_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.type = 'seller'
    )
  );

drop policy if exists "sellers update own products" on public.products;
create policy "sellers update own products"
  on public.products for update to authenticated
  using (
    seller_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.type = 'seller'
    )
  )
  with check (
    seller_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.type = 'seller'
    )
  );

-- Supports seller-specific listing queries and foreign-key maintenance.
create index if not exists products_seller_id_idx on public.products (seller_id);

commit;
