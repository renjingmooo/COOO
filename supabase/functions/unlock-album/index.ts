import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const normalizePassphrase = (value: unknown) => String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, "");
  let answer = "";
  try { answer = normalizePassphrase((await req.json()).answer); }
  catch { return json({ error: "invalid_request" }, 400); }

  const expected = normalizePassphrase(Deno.env.get("ALBUM_PASSPHRASE"));
  if (!expected || answer !== expected) return json({ error: "wrong_passphrase" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? secretKeys.default;
  if (!url || !serviceKey) return json({ error: "server_not_configured" }, 503);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: rows, error } = await admin.from("private_memories")
    .select("id,title,place,date,story,media").order("date", { ascending: false });
  if (error) return json({ error: "album_unavailable" }, 503);

  const memories = [];
  for (const row of rows ?? []) {
    const media = [];
    for (const item of Array.isArray(row.media) ? row.media : []) {
      if (!item?.path || !["image", "video"].includes(item.type)) continue;
      const { data, error: signError } = await admin.storage.from("private-album").createSignedUrl(item.path, 900);
      if (!signError && data?.signedUrl) media.push({ type: item.type, caption: item.caption ?? "", url: data.signedUrl });
    }
    memories.push({ id: row.id, title: row.title, place: row.place, date: row.date, story: row.story, media });
  }
  return json({ memories, expiresAt: Date.now() + 900000 });
});
