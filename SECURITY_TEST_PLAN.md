# ThriftMall security test plan

**Status:** Tests are defined. Database metadata review and independent JavaScript parsing were completed; the complete regression suite has not run successfully.

## Safety rules

Use staging and test identities for destructive/adversarial tests. Never delete real users, send test campaigns to real customers, flood production, or record credentials/tokens/personal details in logs.

## Automated checks

| Test | Procedure | Expected | Current status |
|---|---|---|---|
| JavaScript syntax | Run node --check app.js and node --check checkout-invoice.js. | No syntax errors. | Independent parse previously passed; Actions has not completed. |
| Static regression | Run node --test tests/security-static.test.mjs. | CSP/inline-script, image validation, digest schema checks pass. | Added on this branch; needs a working runner. |
| CodeQL | Run repository security workflow. | Findings triaged, no unresolved high/critical alerts. | Not available: previous run failed before steps started. |
| Dependencies | Review pinned Supabase JS CDN version and other external scripts against advisories. | Supported versions; known vulnerabilities triaged. | Supabase JS updated on branch; full scan pending. |

## Browser journeys

1. Open desktop/mobile Chromium and Firefox. Expected: no CSP violations that break functionality and no uncaught JS errors.
2. Create test buyer and seller accounts; verify email confirmation and login. Expected: verification remains required and profile editing cannot change account type.
3. Test invalid/expired/reused verification and recovery links. Expected: safely rejected, no redirect to unallowlisted destinations.
4. Request recovery for existing/nonexistent emails. Expected: user-facing response does not reveal account existence where provider behavior permits.
5. Seller A creates/edits/deletes a product and updates shop settings. Expected: only Seller A's records change and successful changes persist after refresh.
6. Seller B attempts to edit/delete Seller A's product by modifying request IDs. Expected: database denies or affects zero rows.
7. Buyer attempts to change profile type or access another user's profile/preferences. Expected: denied.
8. Upload JPEG/PNG/WebP, then SVG, HTML renamed as .jpg, oversized file, empty file, malformed bytes. Expected: UI rejects unsupported/oversized inputs; bucket rejects disallowed MIME/size; no script executes.
9. Upload/delete using another user's UUID folder. Expected: denied.
10. Tamper with cart prices/seller IDs in DevTools and open WhatsApp checkout. Expected: no claim of verified payment; seller confirms actual listing, price, availability, delivery and payment independently.
11. Block invoice image generation. Expected: clear text invoice/manual WhatsApp fallback.
12. Test account deletion in staging with controlled failures at each step. Expected: no cross-account deletion; partial-failure recovery is documented.
13. Run digest dry mode, invalid secret, non-POST method, and one dedicated test-mailbox send. Expected: only opt-ins processed, invalid secret/method rejected, at most one test message, no recipient list in logs.
14. Toggle updates opt-in off and rerun dry mode. Expected: opted-out account no longer receives future digest messages.
15. Check access/correction/export/deletion requests and policy disclosures against actual behavior.

## Database authorization matrix

Use separate anonymous, buyer A, buyer B, seller A, and seller B identities.

| Attempt | Expected result |
|---|---|
| Anonymous read published products and seller details | Allowed |
| Anonymous read buyer-only profile/preferences | Denied/no rows |
| Buyer A read/update Buyer B preferences | Denied/no rows |
| Buyer changes own profile type | Denied by column grants |
| Seller A inserts product with Seller B's ID | Denied |
| Seller A edits/deletes Seller B product | Denied |
| Seller A updates own product while changing seller_id | Denied by WITH CHECK |
| User uploads/deletes another UUID's image | Denied |
| Unauthenticated delete-account call | 401/403 |
| Digest with invalid secret or non-POST | 403/405 |

## Deployment checks

Confirm reviewed commit is on main and published before calling a change live. Inspect actual HTTP response headers separately from meta tags. Re-run Supabase Security Advisor after schema changes. Record commit SHA, deployed function version, test date, and rollback procedure.
