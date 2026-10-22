// ThriftMall weekly digest. Keep this source synchronized with the deployed Edge Function.
// Required secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, DIGEST_SECRET,
// and optionally FROM_EMAIL. This endpoint is server-to-server only.
import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = "https://metrovincenzo.github.io/thriftmall/";
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function constantTimeEqual(a: string, b: string): boolean {
  let mismatch = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return mismatch === 0;
}
function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed." });
  const expected = Deno.env.get("DIGEST_SECRET") ?? "";
  const supplied = req.headers.get("x-digest-secret") ?? "";
  if (!expected || !constantTimeEqual(supplied, expected)) return json(403, { error: "Forbidden." });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("FROM_EMAIL") ?? "Thriftmall <onboarding@resend.dev>";
  if (!supabaseUrl || !serviceRoleKey) return json(500, { error: "Server configuration is incomplete." });

  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";
  // Keep test mailbox addresses out of query strings, which are more likely to be logged.
  const testAddress = req.headers.get("x-test-email");
  if (testAddress && (testAddress.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testAddress))) {
    return json(400, { error: "Invalid test email address." });
  }
  if (!dry && !resendKey) return json(500, { error: "Email delivery is not configured." });

  const sb = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const since = new Date(Date.now() - 7 * 864e5).toISOString();
  // In the live schema, follows and updates_opt_in are in profile_preferences, not profiles.
  const [prefResult, buyerResult, productResult, sellerResult] = await Promise.all([
    sb.from("profile_preferences").select("user_id,follows").eq("updates_opt_in", true),
    sb.from("profiles").select("id,name").eq("type", "buyer"),
    sb.from("products").select("id,seller_id,name,size,cond,cat,price,img_url,created_at")
      .gte("created_at", since).order("created_at", { ascending: false }),
    sb.from("profiles").select("id,shop,loc").eq("type", "seller"),
  ]);
  if (prefResult.error || buyerResult.error || productResult.error || sellerResult.error) {
    return json(500, { error: "Could not prepare the digest." });
  }

  const buyers = new Map((buyerResult.data ?? []).map((b) => [b.id, b]));
  const preferences = (prefResult.data ?? []).filter((p) => buyers.has(p.user_id));
  const products = productResult.data ?? [];
  const shops = new Map((sellerResult.data ?? []).map((s) => [s.id, s]));
  if (!preferences.length) return json(200, { sent: 0, skipped: 0, failed: 0, preview: [] });

  const emails = new Map<string, string>();
  for (let page = 1; page <= 1000; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return json(500, { error: "Could not prepare recipient list." });
    for (const user of data.users) if (user.email) emails.set(user.id, user.email);
    if (data.users.length < 1000) break;
  }

  const result = { sent: 0, skipped: 0, failed: 0, preview: [] as string[] };
  for (const pref of preferences) {
    const buyer = buyers.get(pref.user_id)!;
    const follows: string[] = pref.follows ?? [];
    const picks = products.filter((p) =>
      follows.includes("cat:" + p.cat) || follows.includes("shop:" + p.seller_id)).slice(0, 8);
    const recipient = testAddress ?? emails.get(pref.user_id);
    if (!picks.length || !recipient) {
      result.skipped++;
      continue;
    }
    if (dry) {
      result.preview.push(picks.length + " items prepared");
      if (testAddress) break;
      continue;
    }
    const items = picks.map((p) => {
      const shop = shops.get(p.seller_id);
      return '<tr><td style="padding:10px 0"><img src="' + esc(p.img_url) + '" width="96" height="120" style="object-fit:cover;border-radius:10px" alt=""></td>' +
        '<td style="padding:10px 14px;font-family:Georgia,serif"><b>' + esc(p.name) + '</b><br>Size ' + esc(p.size) +
        ' &middot; ' + esc(p.cond) + '<br>US$' + Number(p.price).toFixed(2) + '<br><span style="color:#604e46">' +
        esc(shop?.shop) + ', ' + esc(shop?.loc) + '</span></td></tr>';
    }).join("");
    const firstName = String(buyer.name ?? "there").split(" ")[0];
    const html = '<div style="max-width:560px;margin:auto;font-family:Georgia,serif;color:#201b1a">' +
      '<h2>New thrift finds for you, ' + esc(firstName) + '</h2>' +
      '<p>These pieces just landed in shops and categories you follow.</p><table>' + items + '</table>' +
      '<p><a href="' + SITE + '#shops" style="background:#201b1a;color:#fff;padding:12px 22px;border-radius:99px;text-decoration:none">Browse Thriftmall</a></p>' +
      '<p style="color:#604e46;font-size:13px">You get this because you opted in. Turn it off any time in Account on ' +
      '<a href="' + SITE + '">Thriftmall</a>.</p></div>';
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + resendKey, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [recipient], subject: "New thrift finds for you", html }),
      });
      if (response.ok) result.sent++;
      else result.failed++;
    } catch {
      result.failed++;
    }
    if (testAddress) break;
    await new Promise((resolve) => setTimeout(resolve, 600));
  }
  return json(200, result);
});
