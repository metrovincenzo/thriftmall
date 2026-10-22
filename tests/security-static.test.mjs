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
});

test("digest uses the actual preferences table and rejects non-POST requests", async () => {
  const fn = await read("../supabase/functions/send-digest/index.ts");
  assert.match(fn, /req\.method\s*!==\s*"POST"/);
  assert.match(fn, /from\("profile_preferences"\)\.select\("user_id,follows"\)\.eq\("updates_opt_in",\s*true\)/);
  assert.doesNotMatch(fn, /from\("profiles"\)\.select\("id,name,follows"\)/);
});

test("invoice code escapes data and does not claim payment verification", async () => {
  const invoice = await read("../checkout-invoice.js");
  assert.match(invoice, /esc\s*\(/);
  assert.match(invoice, /NOT proof of payment|not proof of payment|NOT attached/i);
});
