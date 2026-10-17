# ThriftMall Auth setup (required after the code changes)

ThriftMall uses Supabase Auth. The code supports email/password signup with a code-entry screen, phone/password signup verified by OTP over SMS or WhatsApp, login with either the registered email or E.164 phone number, account recovery, and authenticated password changes.

## 1. Email confirmation must be enabled

In Supabase Dashboard, open **Authentication → Sign In / Providers → Email** (wording can vary) and enable email confirmations. The app intentionally detects and warns if signup returns a live session immediately, because that means the project is not requiring confirmation.

## 2. Configure email templates to send codes

Open **Authentication → Email Templates**.

- **Confirm signup:** use the six-digit token in the body, for example: `<p>Your ThriftMall verification code is {{ .Token }}</p>`. Remove the `{{ .ConfirmationURL }}` link if you want users to paste a code into the site.
- **Reset password:** also use `{{ .Token }}` in the email body for code-entry recovery, for example: `<p>Your ThriftMall password reset code is {{ .Token }}</p>`.

The code's redirect URL is the site's current origin. If using a hosted callback/link flow instead, add the exact production and development URLs under **Authentication → URL Configuration**. Test confirmation and recovery on the intended hosted origin before launch.

## 3. Enable phone authentication

Under **Authentication → Sign In / Providers → Phone**, enable phone sign-in. Configure and test an SMS provider (for example, Twilio) and set sane OTP rate limits. Users must enter international E.164 numbers such as `+263771234567`.

## 4. WhatsApp delivery is provider-dependent

The UI offers SMS and WhatsApp when the user registers or requests a recovery code by phone. Supabase currently supports WhatsApp OTP delivery through **Twilio or Twilio Verify with a configured WhatsApp sender**; it is not automatically available with every SMS provider. Configure it before offering WhatsApp to users. If it isn't configured, the WhatsApp request will return an error and the user can switch to SMS.

## 5. Production hardening

- Enable leaked-password protection in **Authentication → Password Security**.
- Configure CAPTCHA/bot protection and review OTP/email rate limits.
- Verify auth confirmation/recovery templates and sender reputation.
- Test duplicate signup attempts with existing verified email and phone identities.
- Test seller profile updates using two separate seller accounts and confirm neither can edit the other's profile.
- Do not put Supabase secret/service-role keys or Resend API keys into browser code.

Phone-based users log in with their verified phone number and password. Their public WhatsApp shop contact is a separate editable field and does not change the account's login identity.
