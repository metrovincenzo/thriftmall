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

function getAuthTime(authHeader: string): number | null {
  const token = authHeader.slice("Bearer ".length).split(".")[1];
  if (!token) return null;
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
    return typeof payload.auth_time === "number" ? payload.auth_time : null;
  } catch {
    return null;
  }
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

  // Require a recently authenticated session as a server-side safeguard.
  // The website also re-checks the password before invoking this function.
  const authTime = getAuthTime(authHeader);
  const now = Math.floor(Date.now() / 1000);
  if (authTime === null || authTime > now + 30 || now - authTime > 300) {
    return reply(401, { error: "For your security, re-enter your password and try again." });
  }

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
  // The live foreign keys cascade Auth-user deletion to profiles,
  // products, and profile_preferences. Delete Auth first so a failed Auth
  // deletion does not leave an active account with its profile already gone.
  const { error: authDeleteError } = await admin.auth.admin.deleteUser(uid);
  if (authDeleteError) {
    return reply(500, { error: "Could not delete your account. No account records were removed." });
  }

  // Storage and Postgres cannot be deleted in one transaction. Relational
  // records are removed by verified ON DELETE CASCADE constraints; clean
  // public photos last and report any cleanup failure honestly.
  for (let i = 0; i < paths.length; i += 100) {
    const { error } = await bucket.remove(paths.slice(i, i + 100));
    if (error) {
      return reply(200, {
        success: true,
        warning: "Your account was deleted, but some uploaded photos could not be removed. Contact support for cleanup.",
      });
    }
  }

  return reply(200, { success: true });
});
