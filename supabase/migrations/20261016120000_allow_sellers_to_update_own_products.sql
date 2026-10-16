-- Allow authenticated sellers to update only their own product listings.
-- No product data is changed by this migration.

begin;

grant update (name, price, size, cond, cat, img_url)
  on table public.products to authenticated;

drop policy if exists "sellers update own products" on public.products;
create policy "sellers update own products"
  on public.products
  for update
  to authenticated
  using (
    seller_id = (select auth.uid())
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.type = 'seller'
    )
  )
  with check (
    seller_id = (select auth.uid())
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.type = 'seller'
    )
  );

commit;
