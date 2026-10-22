import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("index uses CSP and does not depend on inline executable scripts or inline handlers", async () => {
  const html = await read("../index.html");
  assert.match(html, /Content-Security-Policy/i);
  assert.doesNotMatch(html, /<script\b(?![^>]*\bsrc\s*=)[^>]*>[\s\S]*?<\/script>/i);
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
});

test("image uploads have a size cap and explicit raster allowlist", async () => {
  const app = await read("../app.js");
  assert.match(app, /MAX_UPLOAD_BYTES\s*=\s*8\s*\*\s*1024\s*\*\s*1024/);
  assert.match(app, /image\/jpeg/);
  assert.match(app, /image\/png/);
  assert.match(app, /image\/webp/);
  assert.match(app, /file\.size\s*>\s*MAX_UPLOAD_BYTES/);
  assert.match(app, /const dataUrl=await shrink\(file\)/);
});

test("digest uses the actual preferences table and rejects non-POST requests", async () => {
  const fn = await read("../supabase/functions/send-digest/index.ts");
  assert.match(fn, /req\.method\s*!==\s*"POST"/);
  assert.match(fn, /req\.headers\.get\("x-test-email"\)/);
  assert.doesNotMatch(fn, /url\.searchParams\.get\("test"\)/);
  assert.match(fn, /from\("profile_preferences"\)\.select\("user_id,follows"\)\.eq\("updates_opt_in",\s*true\)/);
  assert.doesNotMatch(fn, /from\("profiles"\)\.select\("id,name,follows"\)/);
});

test("invoice code escapes data and does not claim payment verification", async () => {
  const invoice = await read("../checkout-invoice.js");
  assert.match(invoice, /esc\s*\(/);
  assert.match(invoice, /NOT proof of payment|not proof of payment|NOT attached/i);
});

test("account deletion avoids removing relational data before Auth deletion", async () => {
  const fn = await read("../supabase/functions/delete-account/index.ts");
  const authDelete = fn.indexOf("admin.auth.admin.deleteUser(uid)");
  const storageDelete = fn.indexOf("bucket.remove(paths.slice");
  assert.ok(authDelete >= 0);
  assert.ok(storageDelete > authDelete);
  assert.doesNotMatch(fn, /admin\.from\("(products|profiles|profile_preferences)"\)\.delete\(\)/);
});
 
test("bootstrap SQL preserves seller ownership on product updates and storage deletes", async () => {
  const sql = await read("../supabase/setup.sql");
  assert.match(sql, /grant update \(name, price, size, cond, cat, img_url\) on table public\.products to authenticated/i);
  assert.match(sql, /Sellers can update their own products/i);
  assert.match(sql, /with check \([\s\S]*seller_id = \(select auth\.uid\(\)\)/i);
  assert.match(sql, /Users can delete their own Thriftmall files/i);
  assert.match(sql, /2097152, array\['image\/jpeg', 'image\/png', 'image\/webp'\]/i);
});
