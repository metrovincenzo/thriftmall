# ThriftMall privacy data map

**Assessment date:** 2026-10-23. This inventory is based on inspected frontend copy, schema and Edge Function source; confirm it against provider dashboards and actual operations.

| Data | Purpose | System/recipient | Visibility | Retention question |
|---|---|---|---|---|
| Auth ID, email, phone, password credential/hash handling, confirmation/session metadata | Authentication and recovery | Supabase Auth | Private | Define account/session/log retention. Passwords are handled by Auth, not stored in app tables. |
| Name and account type | Account operation/display | public.profiles / Supabase | Seller details may be public; buyer profile restricted by RLS | Define deletion and lawful retention exceptions. |
| Shop name, seller location, WhatsApp number, logo URL | Public seller page/contact | public.profiles and public images bucket | Public by design | Remove/anonymize when no longer needed. Avoid exact home addresses unless necessary. |
| Product name, price, size, condition, category, seller ID, image URL | Catalogue and checkout | public.products and public images bucket | Public | Remove listings when deleted; backup retention unknown. |
| Product photos and shop logos | Display listings | Supabase Storage images bucket | Public; anyone with URL can view | Account deletion attempts cleanup; provider backup retention unknown. |
| Followed shops/categories | Recommendations and digest | profile_preferences.follows | RLS-restricted; privileged function can access | Define period and clear on account deletion. |
| Email updates opt-in | Digest eligibility | profile_preferences.updates_opt_in | RLS-restricted | No preference history in inspected schema; verify opt-out works in digest. |
| Cart IDs and UI state | Cart and filters | Browser localStorage | Same browser profile/origin | User/browser controlled; provide clear/reset behavior. |
| Order request/items/subtotal/seller number | Buyer-seller communication | Browser then WhatsApp and seller | Shared when buyer sends message; subsequent processing outside ThriftMall | No server-side order record found in inspected checkout code. |
| Digest email address and product picks | Optional weekly digest | Supabase Edge Function and Resend | Service role and email provider | Confirm Resend region, DPA, logs, retention, and unsubscribe/opt-out behavior. |
| IP/request metadata | Delivery/security; font requests | GitHub Pages, Supabase, Google Fonts, Resend/WhatsApp as applicable | Provider-dependent | Verify actual logs, locations and retention. |

## Third-party and transfer register

| Provider | Data likely processed | Evidence / open question |
|---|---|---|
| Supabase | Auth records, profiles, products, preferences, image objects, function requests/logs | In use. Confirm project region, DPA, subprocessors, backups and retention. |
| GitHub Pages/GitHub | Public website assets, source/deployment metadata, visitor network metadata | In use. Confirm repo visibility, Actions permissions and provider terms. |
| Resend | Email address and digest content | Function source references Resend. Confirm active configuration, sender/domain, DPA, region and retention. |
| WhatsApp/Meta | Seller phone and order message when buyer proceeds | Checkout opens a wa.me link; message is not sent until buyer proceeds. |
| Google Fonts | IP/request metadata and font request | Stylesheet is referenced by page. Self-hosting can reduce third-party requests if desired. |

## Privacy-by-design actions

1. Confirm controller/business legal name, address and privacy contact.
2. Document lawful basis separately for account operation, public seller listings, and optional digest email.
3. Set retention periods for inactive accounts, listings, images, logs, and backup copies.
4. Provide a documented access/correction/export/objection/opt-out/deletion request channel where applicable.
5. Verify that opt-out prevents future digest sends before enabling live delivery.
6. Keep private documents out of the public images bucket.
7. Verify processor terms, data-center regions and international transfer safeguards before promising compliance.
