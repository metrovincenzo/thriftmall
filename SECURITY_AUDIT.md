# ThriftMall Security Audit — 2026-10-22

## Scope and limitations

Reviewed the current `main` source and the connected Supabase production project's table grants, row-level security policies, auth signup trigger, migration history, and Supabase security advisor results. This was a read-only review of production data and configuration. No account data, product data, or secrets were read or changed. This is not a penetration test and does not certify the site as completely secure.

## Findings

### High priority: policy role scope was broader than necessary

The live RLS policies for product insertion, product deletion, and profile updates were declared for `public`, although their predicates depended on `auth.uid()` and the table grants restricted actual writes. This is not evidence that anonymous writes succeeded, but the policy role scope was unnecessarily broad.

**Proposed fix:** migration `20261022120000_harden_rls_policy_roles_and_signup_trigger.sql` changes these write policies to `TO authenticated` and retains seller ownership checks.

### Defense in depth: SECURITY DEFINER signup trigger

The live `public.handle_new_user()` trigger function was SECURITY DEFINER and pinned `search_path` to `public`. It already schema-qualified its target table, but an empty search path is safer for a privileged function.

**Proposed fix:** the migration pins `search_path = ''`, schema-qualifies the table, handles empty metadata values, and revokes direct execute grants from public API roles. The auth trigger remains attached to `auth.users`.

### Supabase Auth setting: leaked-password protection is disabled

The Supabase security advisor reports `auth_leaked_password_protection` as a warning. Enable leaked-password protection in Supabase Dashboard > Authentication > Settings / Password Security if the project's plan and dashboard expose that option. The connected tools do not expose an API to safely change this Auth setting, so it has not been changed here.

### Hosting limitation: response security headers

GitHub Pages is static hosting and does not provide arbitrary server response-header configuration from this repository. A strict Content Security Policy, HSTS, and other response headers should be configured at a hosting layer that supports them, after testing the policy against the site's inline scripts, Supabase, and Google Fonts. Do not add a guessed restrictive CSP that could break authentication or checkout.

## Positive checks

- Supabase reports the project as active/healthy.
- RLS is enabled on the reviewed public application tables and Storage objects.
- Product insert/update/delete policies include seller ownership checks; the update policy includes both `USING` and `WITH CHECK`.
- Buyer preferences are restricted to their owning authenticated user.
- The signup trigger's SECURITY DEFINER function has a fixed search path.
- The browser code contains a Supabase publishable key, not a service-role key. Publishable keys are intended to be public; never put service-role/secret keys in the page.
- The frontend escapes dynamic text before rendering most HTML templates and validates image URLs against the project's HTTPS Storage origin.

## Required verification before production rollout

1. Review and merge the migration through a pull request.
2. Apply it to the connected Supabase project using the migration workflow, then query `pg_policies` and `pg_proc.proconfig` to verify the effective state.
3. Test buyer and seller signup/login, product creation/edit/delete, profile/shop editing, image upload, and buyer preferences using separate test accounts.
4. Enable leaked-password protection if available; review email confirmation, password recovery redirect URLs, and session settings in the Supabase dashboard.
5. Configure response security headers at a compatible host/proxy and run a browser/device regression test.
