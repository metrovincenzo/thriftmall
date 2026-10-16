import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function reply(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply(405, { error: "Method not allowed." });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return reply(401, { error: "Sign in to continue." });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return reply(500, { error: "Account deletion is not configured on the server." });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return reply(401, { error: "Your session has expired. Sign in again." });

  let body: { confirm?: string };
  try {
    body = await req.json();
  } catch {
    return reply(400, { error: "Invalid request." });
  }
  if (body.confirm !== "DELETE") return reply(400, { error: "Deletion was not confirmed." });

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const uid = user.id;

  // Uploads use a flat uid/filename layout in the images bucket.
  const bucket = admin.storage.from("images");
  const paths: string[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await bucket.list(uid, { limit: 100, offset, sortBy: { column: "name", order: "asc" } });
    if (error) return reply(500, { error: "Could not prepare account photos for deletion. No database records were deleted." });
    paths.push(...(data || []).filter((item) => !!item.id).map((item) => uid + "/" + item.name));
    if (!data || data.length < 100) break;
  }
  for (let i = 0; i < paths.length; i += 100) {
    const { error } = await bucket.remove(paths.slice(i, i + 100));
    if (error) return reply(500, { error: "Could not delete all account photos. Your sign-in remains active; contact support before retrying." });
  }

  const { error: productsError } = await admin.from("products").delete().eq("seller_id", uid);
  if (productsError) return reply(500, { error: "Could not remove your listings. Your sign-in remains active." });

  const { error: prefsError } = await admin.from("profile_preferences").delete().eq("user_id", uid);
  if (prefsError) return reply(500, { error: "Could not remove your account preferences. Your sign-in remains active." });

  const { error: profileError } = await admin.from("profiles").delete().eq("id", uid);
  if (profileError) return reply(500, { error: "Could not remove your profile. Your sign-in remains active." });

  const { error: authDeleteError } = await admin.auth.admin.deleteUser(uid);
  if (authDeleteError) return reply(500, { error: "Your profile data was removed, but the sign-in account could not be deleted. Contact support before retrying." });

  return reply(200, { success: true });
});
