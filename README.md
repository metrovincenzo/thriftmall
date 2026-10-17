# Thriftmall

Thriftmall is a static HTML/CSS/JavaScript storefront. The site is in
[`index.html`](./index.html); there is no framework, package manager, or build
step.

## Run locally

Python 3 is sufficient to serve the site:

```powershell
py -m http.server 8000
```

Open <http://localhost:8000>. Stop the server with Ctrl+C.

## Supabase setup

The browser app uses Supabase Auth, the `profiles` and `products` tables, and a
public `images` Storage bucket. Its Supabase URL and publishable key are
configured in the page's client initialization. These are browser-visible
settings, not server secrets. Never put a Supabase secret/service-role key or
an email-provider API key in the page.

For a new Supabase project, open the SQL editor and run
[`supabase/setup.sql`](./supabase/setup.sql). It creates the tables, signup
profile trigger, row-level security policies, image bucket policies, and
private profile-preference table expected by the app. The app exposes seller
shop details and listings publicly; buyer profiles and follow/update
preferences are only available to their signed-in owner.

`supabase/setup.sql` is a bootstrap script for a NEW project, not an upgrade
script. For an existing deployment, review and apply the ordered, versioned
migrations in [`supabase/migrations/`](./supabase/migrations/) instead. Back
up and inspect existing schema/policies before applying any SQL.

Follow [Auth configuration](./supabase/AUTH_CONFIGURATION.md) to enable email
confirmation, configure code-based email templates, and enable phone OTP
through SMS or (with a supported provider) WhatsApp. Configure the site's
local and deployed URLs as allowed redirect/site URLs. Use HTTPS in production.
Test buyer/seller signup, OTP verification, duplicate registration, password
recovery, profile/shop editing, image uploads, preferences, and seller-owned
product deletion against the configured project.

## Deployment

Deploy `index.html`, `denim.jpg`, `hero.jpg`, and `sign.jpg` to any static
hosting service (for example, GitHub Pages, Netlify, or Cloudflare Pages).
There is no build command. Configure the deployed domain in Supabase Auth,
then test the live site over HTTPS, including an email-confirmation link and
image uploads.

## Email updates

The app currently saves an email-update preference but does not send email.
Resend is not integrated. Do not enter a Resend API key in browser code. If
email updates are implemented later, send them through a trusted server-side
function and keep the provider key in that function's deployment secrets.
