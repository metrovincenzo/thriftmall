# ThriftMall secure configuration checklist

**Last reviewed:** 2026-10-23. Settings are not considered enabled unless verified.

## GitHub

1. Open https://github.com/metrovincenzo/thriftmall → Settings → Actions → General. Confirm Actions are enabled and workflows are permitted. The last security workflow failed before steps started, so it produced no passing checks.
2. Open Security and quality / Code security settings. Enable available secret scanning, push protection and code scanning; feature availability depends on visibility/plan. Review alerts without copying secret values into tickets.
3. Review collaborators and connected apps; remove only access that is no longer needed after confirming owner recovery access.
4. Protect main where available: require PRs and passing checks, prevent force-push/deletion, restrict bypass access.
5. Keep workflow token permissions read-only unless a job requires more. Review third-party actions and dependency updates.
6. Do not deploy PR #22 until CSP and browser journeys are tested; live main does not yet contain these changes.

## Supabase Auth

1. Open project thriftmall → Authentication → Settings. Keep email confirmation enabled and verify Site URL/redirect allowlist.
2. Review password minimum length/complexity. The app checks at least 8 characters; provider-side policy is authoritative. Supabase docs say leaked-password protection is Pro+; this project is Free, so it may require a plan change.
3. Review Authentication → Settings → Bot and Abuse Protection. Supabase supports CAPTCHA options such as hCaptcha and Cloudflare Turnstile, but the frontend must obtain and pass a token. Do not enable CAPTCHA until code integration and browser testing are complete.
4. Review Auth rate limits, OTP expiry and recovery behavior. Test signup, confirmation, login, recovery and account deletion after changes.
5. Keep service-role keys only in Edge Function secrets, never in HTML/browser JavaScript.

## Database and Storage

1. Keep RLS on all exposed tables and policies ownership-aware. RLS alone is not enough; review grants and column permissions too.
2. Inspected application tables profiles, products and profile_preferences have RLS enabled. Current policies restrict own profiles/preferences and seller-owned product mutations.
3. The public images bucket is only for public listings/logos. Never upload private identity documents or confidential files there.
4. Live bucket metadata currently reports a 2 MiB limit and JPEG/PNG/WebP allowed. The bootstrap setup.sql is aligned on this branch to the live 2 MiB/JPEG/PNG/WebP settings and now includes seller-owned product updates plus own-folder storage deletes. This is a template-only change; no production SQL was applied. Test invalid and oversized uploads against the live bucket.
5. Do not rerun supabase/setup.sql against production; it is for a new project. Live migration history includes a migration whose source was not found in the repository. Reconcile history/source before DDL.
6. Run Supabase Security Advisor after schema/policy changes and test with separate identities.

## Edge Functions and Resend

1. In Edge Functions → Secrets, verify required secret names: SUPABASE_URL, SUPABASE_ANON_KEY where used, SUPABASE_SERVICE_ROLE_KEY, DIGEST_SECRET, RESEND_API_KEY and FROM_EMAIL as applicable. Never expose values.
2. Confirm digest scheduler/caller uses POST and x-digest-secret. Rotate secret if exposure is suspected.
3. Live digest source appears to query nonexistent profile columns. Corrected source in this branch is not deployed; run dry mode and send only to a dedicated test mailbox before any production schedule.
4. Confirm Resend sender/domain settings and delivery events; ensure opt-out changes stop future digest sends.
5. The security branch changes account deletion to remove the Auth user first (the live foreign keys cascade to profiles/products/preferences), then cleans public storage. Test this only in staging before deploying the function.

## GitHub Pages and HTTP headers

HTML can provide a CSP meta policy and referrer policy, but metadata cannot set all HTTP headers. CSP frame-ancestors, HSTS, X-Content-Type-Options and Permissions-Policy require response-header configuration. GitHub Pages does not provide arbitrary per-repository response-header configuration.

Options: keep GitHub Pages and treat CSP metadata as defense in depth, or later evaluate a host/CDN supporting response headers (for example Cloudflare Pages with a _headers file). Do not migrate hosting without a reviewed plan and verified rollback.

## Owner/legal tasks

Supply controller/business legal identity and address, target markets, privacy contact, user-age policy, retention periods, provider regions/contracts, transfer safeguards and breach contacts. Have qualified counsel assess Zimbabwe and any other applicable jurisdiction before claiming compliance.
