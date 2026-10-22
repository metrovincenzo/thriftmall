# ThriftMall security audit

**Assessment date:** 2026-10-23. **Status:** In progress; not a certification or guarantee of complete security.

## Executive summary

The connected Supabase project has RLS enabled on the three application tables inspected: public.profiles, public.products, and public.profile_preferences. Policies inspected restrict own-profile/preferences access and seller-owned product writes. Public product listings and seller shop details are intentionally public.

No privileged service-role key was observed in the inspected browser entry point. The browser uses a Supabase publishable key, which is expected for a client app. This was not a complete historical secret scan.

The browser-hardening PR #22 is still a draft and not deployed. Its GitHub Actions run failed before job steps started, so no CI or CodeQL result exists. Real browser/device regression tests remain outstanding.

## Scope and limitations

Reviewed repository files available through GitHub tools, the security branch's app.js, checkout-invoice.js, setup SQL, the account-deletion Edge Function, live Supabase table/column metadata, grants, RLS policies, migrations, advisors, deployed Edge Function metadata/source, and current public security/legal guidance.

Not performed: local Windows working-tree inspection, browser automation, mobile tests, live authenticated cross-account API tests, production endpoint fuzzing, full historical Git/artifact secret scanning, or legal advice. No real user was deleted, no production email was sent, and no destructive SQL was run.

The live send-digest function source is not present on main. A corrected source copy is proposed on this branch but is not deployed. The account-deletion source is also hardened on this branch to let Auth deletion trigger verified foreign-key cascades before removing public storage objects; it is not deployed.

## Threat model

Protected assets: account credentials and sessions, private buyer preferences, seller profile control, product ownership, uploaded images, account deletion, digest recipient lists, and privacy records. Browser code/local storage are user-controlled; Supabase Auth validates identity; RLS/grants enforce database access; Edge Functions may hold privileged secrets; GitHub Pages serves static files but cannot configure arbitrary response headers.

## Findings

| ID | Severity | Finding | Status |
|---|---|---|---|
| F-01 | Medium | Browser CSP/script extraction changes exist in PR #22, not on live main. CI failed before steps ran. | **Fixed but not yet deployed**; browser tests pending. |
| F-02 | Medium | GitHub Pages does not allow arbitrary response headers from this repo. CSP metadata cannot replace frame-ancestors, HSTS, X-Content-Type-Options, or Permissions-Policy response headers. | **Partially addressed** on branch; hosting header control remains. |
| F-03 | Medium | Deployed send-digest queries profiles for follows and updates_opt_in, but those columns are in profile_preferences in the live schema. The function likely fails before sending. | **Fixed in branch source only; not deployed or live-tested.** |
| F-04 | Low/Medium | Original image helper accepted any image/* source and had no explicit source file size cap before decoding. | **Fixed on branch** with JPEG/PNG/WebP allowlist and 8 MiB source cap; browser test pending. |
| F-05 | Medium | Supabase Security Advisor reports leaked-password protection disabled. Current docs say this is Pro+; this project is Free. | **Not fixed**; plan/dashboard limitation. |
| F-06 | Medium | CAPTCHA/bot protection and Auth rate-limit configuration not verified; frontend does not currently pass a CAPTCHA token. | **Not tested**; requires dashboard config plus code integration. |
| F-07 | Medium | Live migration history contains 20261022155539_thriftmall_security_hardening, but matching migration source was not found in the repository. | **Not fixed**; reconcile before DDL changes. Do not replay blindly. |
| F-08 | Medium | Account deletion performs separate privileged deletes before deleting the Auth user. A later failure can leave a partially deleted account. | **Fixed in branch source, not deployed**: Auth deletion now happens before storage cleanup and relies on verified cascading foreign keys. Staging failure-path tests remain required. |
| F-09 | Medium | WhatsApp checkout creates the invoice/order text in the browser, not a server-side order or price record. Browser cart/message can be changed. No payment is processed by the site; sellers must independently verify current listings and prices. | **Design limitation documented**, not a payment verification system. |
| F-10 | Low/Medium | Public images bucket makes uploaded listing images/logos viewable by anyone with the URL. | **Expected only for public content**; do not store private documents there. |
| F-11 | Low/Medium | Privacy notice says adults only, but no age gate was verified; controller identity, retention periods, processor terms, and international-transfer safeguards are incomplete/unverified. | **Requires owner/legal review.** |
| F-12 | Low | The previous bootstrap SQL used different image limits and omitted the seller product-update grant/policy and own-folder storage-delete policy found in the live project. | **Fixed in branch bootstrap template only**; it now aligns the 2 MiB JPEG/PNG/WebP bucket and ownership policies. No production database change was made. |
| F-13 | Medium | Deployed send-digest has JWT verification disabled and relies on the shared DIGEST_SECRET header. If that secret leaks, the endpoint could be abused to send email; its value and caller controls were not inspected. | **Partially addressed in branch source** with POST-only handling and constant-time secret comparison; independent rate limiting and secret strength/rotation remain owner checks. Not deployed. |
| F-14 | Low | Performance advisor reports unused products_seller_id_idx. | Informational; do not drop without workload evidence. |

No critical exploitable vulnerability was demonstrated. That does not prove none exists.

## Database table review

| Table | Sensitivity | RLS | Intended/effective access design | Test status |
|---|---|---|---|---|
| public.profiles | Name, account ID, seller shop/location/WhatsApp/logo | Enabled | Public seller profiles; own profile visible to owner; update own row only. Column grants reviewed do not allow profile type updates. | Metadata inspected; separate-identity API tests not run. |
| public.products | Public listing details, prices, image URLs, seller ID | Enabled | Public reads; seller insert/update/delete policies enforce own seller ID and seller type. Update includes USING and WITH CHECK. | Metadata inspected; cross-seller attack tests not run. |
| public.profile_preferences | Followed categories/shops and updates opt-in | Enabled | Authenticated user can read/write own preference row using auth.uid() checks. | Metadata inspected; cross-account tests not run. |
| storage.objects / images | Public product/shop images | Storage policies present | Public read; authenticated upload/delete limited to caller UUID folder; bucket limits reported. | Policy metadata inspected; hostile upload tests not run. |

Additional checks: the Auth-user trigger calls a SECURITY DEFINER function with an empty search_path and explicit public-qualified table access; its execution ACL is restricted to privileged roles. The RLS auto-enable event trigger uses pg_catalog as its search_path and has privileged execution ACLs. Column-privilege checks confirmed authenticated users cannot update products.seller_id or profiles.type. The setup SQL explicitly targets a new project and must not be rerun against production. Live schema and setup SQL are not assumed identical.

## Secret review

The browser key is a publishable key, not a service-role key. No service-role key was observed in the inspected browser entry point. Edge Function source reads service-role credentials from server environment secrets; values were not printed or inspected. This is not a full historical scan of all branches, commits, artifacts, or logs. If any privileged secret is found in public history, rotate/revoke it; removing the current copy alone is insufficient.

## Release gate

1. Test PR #22 in real browsers for CSP violations, fonts, Supabase requests, auth redirects, product images and invoice checkout.
2. Restore functioning GitHub Actions and obtain passing syntax/security checks.
3. Run the digest in dry mode and to a dedicated test mailbox before deployment.
4. Test RLS with separate anonymous, buyer, and seller identities in staging.
5. Reconcile live migration history before database changes.
6. Configure and test CAPTCHA/bot protection if supported.
7. Complete controller/retention/processor/transfer decisions with qualified legal review.
