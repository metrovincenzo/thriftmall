# ThriftMall incident response procedure

**Last reviewed:** 2026-10-23. Business incident lead and privacy contact must be supplied by the owner.

## Triggers

Suspected account takeover, exposed service-role/Resend/digest secret, unauthorized profile/product changes, suspicious database reads, private files exposed publicly, malicious uploads, unexpected email campaigns, or suspected personal-data breach.

## First response

1. Record UTC time, reporter, symptom, affected environment, and evidence location. Do not copy passwords, full tokens, customer messages, or secret values into tickets.
2. Preserve relevant Git commit SHAs, Actions logs, Supabase Auth/database/Edge Function logs, Resend events and provider alerts. Restrict evidence access.
3. Do not delete logs, reset the database or wipe files before preserving evidence.
4. If a secret may be exposed, prioritize provider-side rotation/revocation. Update server-side secret stores, deploy corrected functions, and verify the old secret no longer works.
5. If active abuse is occurring, use the smallest reversible containment action: disable affected function/schedule, restrict compromised access, or temporarily pause the affected upload feature. Record user impact.

## Credential response

- Supabase service-role/secret key: treat as critical; rotate/revoke in Supabase, update Edge Function secrets, scan history/artifacts/logs without printing values, and verify no public client uses the privileged key.
- Resend API key: revoke/rotate, inspect delivery events, stop unauthorized sends, verify sender settings, and investigate affected recipients.
- Digest shared secret: rotate DIGEST_SECRET and the trusted scheduler/caller value together; confirm the old value fails.
- GitHub account/token: revoke exposed tokens, review sessions and repository activity, remove unauthorized collaborators, and inspect workflow changes.
- User session/password: use Supabase recovery/session controls; never ask users to email passwords.

## Investigation and recovery

1. Establish first/last known suspicious event; separate confirmed facts from hypotheses.
2. Determine data types and approximate number of affected records/users/files/messages. Use counts where possible; avoid unnecessary exports.
3. Review Git changes, Actions workflow edits, Auth events, RLS/policy changes, migration history, Edge Function versions, storage policies and provider delivery logs.
4. Reproduce the attack path in staging, not against real users.
5. Restore from a known-good commit/configuration only after understanding the root cause. Validate permissions and critical user journeys before reopening the feature.
6. Patch root cause, add a repeatable regression test, verify rotation and session invalidation as needed, and record the commit/function version.

## Privacy/legal escalation

Notify the owner and qualified privacy/legal adviser promptly. Determine controller/processor roles, affected jurisdictions, data categories, risk to individuals and applicable notification deadlines. For Zimbabwe, assess the Cyber and Data Protection Act [Chapter 12:07], including sections 18–21 and current POTRAZ guidance. For EU/UK/Japan/California or other markets, confirm applicability and deadlines from current law; do not assume one global deadline. Document the decision, reasons, known facts and notices sent or not sent.

## Contacts to complete

- Legal/controller name and address: **owner to supply**
- Incident lead and backup: **owner to supply**
- Privacy request/breach contact: **owner to supply and verify mailbox**
- Supabase/GitHub/Resend administrators: **owner to confirm**
- External counsel / insurer / regulator contacts: **owner to supply**
