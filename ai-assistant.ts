// GAME CLUB — Supabase Edge Function: ai-assistant
// مسیر: supabase/functions/ai-assistant/index.ts
// اجرا: supabase functions deploy ai-assistant
// کلید: supabase secrets set ANTHROPIC_API_KEY=...
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  // آدرس GitHub Pages خود را در secret با نام ALLOWED_ORIGIN تنظیم کنید (مثلاً https://username.github.io)
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const MODEL = "claude-haiku-5-5";
const LANG_NAMES: Record<string, string> = {
  fa: "Persian (Farsi)", zh: "Chinese (Simplified)", ja: "Japanese", ko: "Korean", it: "Italian", hi: "Hindi",
  tr: "Turkish", nl: "Dutch", sv: "Swedish", pl: "Polish", id: "Indonesian", th: "Thai", vi: "Vietnamese",
  uk: "Ukrainian", el: "Greek", he: "Hebrew", bn: "Bengali", ur: "Urdu",
};
const LEVELS = ["below_min", "meets_min", "meets_rec", "unknown"];
const RANK: Record<string, number> = { below_min: 0, meets_min: 1, meets_rec: 2 };

async function ask(apiKey: string, system: string, user: string): Promise<any> {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 1200, system, messages: [{ role: "user", content: user }] }),
  });
  if (!r.ok) throw new Error("سرویس هوش مصنوعی پاسخ نداد.");
  const data = await r.json();
  const text = (data.content ?? []).map((c: any) => c.text ?? "").join("");
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("پاسخ نامعتبر از مدل دریافت شد.");
  return JSON.parse(m[0]);
}

async function recommend(apiKey: string, langName: string, input: any, games: any[]) {
  if (!games.length) return { recommendations: [], message: "هنوز بازی‌ای ثبت نشده است." };
  const pool = games.map((g) => ({
    id: g.id, title: g.title, genre: g.genre, categories: g.categories,
    rating: g.rating, platforms: g.platforms, summary: String(g.description ?? "").slice(0, 300),
  }));
  const system =
    `You are the game recommender of GAME CLUB. Recommend ONLY games from the provided catalog; never invent games. ` +
    `Write each reason in ${langName}. Respond ONLY with JSON: ` +
    `{"recommendations":[{"id":"<catalog id>","reason":"<short reason>"}]} with at most 5 items.`;
  const user = `User preferences: ${JSON.stringify(input).slice(0, 2000)}\nCatalog: ${JSON.stringify(pool)}`;
  const out = await ask(apiKey, system, user);
  const byId = new Map(games.map((g) => [g.id, g]));
  const recommendations = (out.recommendations ?? [])
    .filter((r: any) => byId.has(r.id))
    .slice(0, 5)
    .map((r: any) => ({ id: r.id, title: byId.get(r.id).title, reason: String(r.reason ?? "").slice(0, 400) }));
  return { recommendations };
}

async function compat(apiKey: string, langName: string, gameId: string, pc: any, games: any[]) {
  const game = games.find((g) => g.id === gameId);
  if (!game) throw new Error("بازی انتخاب‌شده پیدا نشد.");

  const ram = Number(pc.ram_gb);
  const storage = Number(pc.storage_gb);
  if (!(ram > 0) || !(storage > 0)) throw new Error("مقدار رم و فضای ذخیره‌سازی باید عدد مثبت باشد.");

  const min = game.min_specs ?? {};
  const rec = game.rec_specs ?? {};
  const cmp = (have: number, minReq?: number, recReq?: number) => {
    if (!minReq && !recReq) return "unknown";
    if (recReq && have >= recReq) return "meets_rec";
    if (minReq && have >= minReq) return "meets_min";
    return "below_min";
  };

  // CPU و GPU را مدل ارزیابی می‌کند؛ RAM و فضا با قاعده مشخص سنجیده می‌شوند و مدل در آن‌ها دخالت نمی‌کند.
  const system =
    `You judge hardware compatibility for GAME CLUB. For CPU and GPU only, give a level: below_min, meets_min, meets_rec or unknown ` +
    `(unknown if the data is insufficient). Never promise FPS or performance numbers. ` +
    `Write notes and summary in ${langName}. Respond ONLY with JSON: ` +
    `{"cpu":{"level":"...","note":"..."},"gpu":{"level":"...","note":"..."},"summary":"..."}`;
  const user = JSON.stringify({
    pc: {
      cpu: String(pc.cpu ?? "").slice(0, 120),
      gpu: String(pc.gpu ?? "").slice(0, 120),
      os: String(pc.os ?? "").slice(0, 120),
    },
    requirements: {
      minimum: { cpu: min.cpu, gpu: min.gpu, os: min.os },
      recommended: { cpu: rec.cpu, gpu: rec.gpu, os: rec.os },
    },
  });
  const judge = await ask(apiKey, system, user);

  const items: any[] = [
    { component: "ram", have: ram, level: cmp(ram, min.ram_gb, rec.ram_gb), note: "" },
    { component: "storage", have: storage, level: cmp(storage, min.storage_gb, rec.storage_gb), note: "" },
    ...(["cpu", "gpu"] as const).map((k) => ({
      component: k,
      have: String(pc[k] ?? "").slice(0, 120),
      level: LEVELS.includes(judge[k]?.level) ? judge[k].level : "unknown",
      note: String(judge[k]?.note ?? "").slice(0, 300),
    })),
  ];

  const judged = items.filter((i) => i.level !== "unknown");
  if (!judged.length) throw new Error("اطلاعات کافی برای تحلیل وجود ندارد.");
  const status = ["below_min", "meets_min", "meets_rec"][Math.min(...judged.map((i) => RANK[i.level]))];
  return { status, summary: String(judge.summary ?? "").slice(0, 500), items };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "سرویس هوش مصنوعی هنوز تنظیم نشده است." }, 503);

  const body = await req.json().catch(() => null);
  if (!body) return json({ error: "ورودی نامعتبر است." }, 400);

  const langName = LANG_NAMES[body.lang] ?? LANG_NAMES.fa;

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: games, error } = await sb
    .from("games")
    .select("id,title,genre,categories,rating,description,platforms,min_specs,rec_specs");
  if (error) return json({ error: "خطا در خواندن کتابخانه." }, 500);

  try {
    if (body.type === "recommend") return json(await recommend(apiKey, langName, body.input ?? {}, games ?? []));
    if (body.type === "compat") return json(await compat(apiKey, langName, body.game_id, body.pc ?? {}, games ?? []));
    return json({ error: "نوع درخواست نامعتبر است." }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
