-- Compatibility for the current main-branch storefront, which still uses profiles.select('*').
-- created_at is non-sensitive; private preferences are stored in profile_preferences.
grant select (created_at) on table public.profiles to anon, authenticated;
