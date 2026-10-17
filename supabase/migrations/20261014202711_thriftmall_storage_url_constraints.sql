-- Restrict seller-controlled image URLs to the seller's own safe Storage object path.
-- Existing rows were checked and already match this pattern.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_img_url_owned_storage_path'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_img_url_owned_storage_path
      check (
        img_url ~ (
          '^https://vkirepgarlrkfmnzvktj[.]supabase[.]co/storage/v1/object/public/images/'
          || seller_id::text || '/[A-Za-z0-9._-]+[.]jpg$'
        )
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_logo_url_owned_storage_path'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_logo_url_owned_storage_path
      check (
        logo_url is null
        or logo_url = ''
        or logo_url ~ (
          '^https://vkirepgarlrkfmnzvktj[.]supabase[.]co/storage/v1/object/public/images/'
          || id::text || '/[A-Za-z0-9._-]+[.]jpg$'
        )
      );
  end if;
end;
$$;
