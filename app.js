/* GAME CLUB — منطق مشترک صفحات عمومی */
const CFG = window.GAME_CLUB_CONFIG || {};
const CONFIGURED = !!CFG.SUPABASE_URL && !CFG.SUPABASE_URL.includes("YOUR-PROJECT");
const sb = CONFIGURED ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;

const CATS = ["action", "adventure", "racing", "sports", "horror", "shooting", "simulation", "strategy", "rpg", "open_world"];

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "#");
const num = (n) => (n === null || n === undefined || Number.isNaN(Number(n)) ? "—" : Number(n).toLocaleString(LANG));
const gameHref = (g) => `game.html?id=${encodeURIComponent(g.id)}`;
const cover = (g) =>
  g.cover_url ? `url('${safeUrl(g.cover_url).replace(/'/g, "%27")}')` : "linear-gradient(135deg,#3a2a10,#0e0e10)";

function notice(msg, isError = true) {
  const el = $("#notice");
  if (!el) return;
  el.textContent = msg;
  el.className = "notice" + (isError ? "" : " ok");
}

const NAV = [
  ["index.html", "home"],
  ["games.html", "library"],
  ["ai.html", "ai"],
  ["admin.html", "admin"],
];

function buildLang() {
  const sel = $("#lang");
  if (!sel) return;
  sel.innerHTML = LANGS.map((l) => `<option value="${l.code}" ${l.code === LANG ? "selected" : ""}>${esc(l.name)}</option>`).join("");
  sel.onchange = () => setLang(sel.value);
}

function renderShell() {
  const here = location.pathname.split("/").pop() || "index.html";
  const links = NAV.map(
    ([href, key]) => `<a href="${href}" class="${href === here ? "active" : ""}">${esc(t(key))}</a>`
  ).join("");
  if ($("#rail")) $("#rail").innerHTML = `<div id="logo-slot" class="logo-slot"></div><nav class="rail-nav">${links}</nav>`;
  if ($("#mnav")) $("#mnav").innerHTML = links;
  buildLang();
}

async function loadLogo() {
  const slot = $("#logo-slot");
  if (!slot || !sb) return;
  const { data } = await sb.from("site_settings").select("value").eq("key", "logo_url").maybeSingle();
  if (typeof data?.value === "string" && data.value) {
    slot.innerHTML = `<img src="${esc(safeUrl(data.value))}" alt="">`;
  }
}

async function fetchGames() {
  const { data, error } = await sb.from("games").select("*").order("created_at", { ascending: false });
  if (error) {
    notice(`${t("error")} ${error.message}`);
    return [];
  }
  return data || [];
}

const tile = (g) =>
  `<a class="glass tile" href="${gameHref(g)}"><div class="tile-img" style="background-image:${cover(g)}"></div>` +
  `<div class="tile-meta"><b>${esc(g.title)}</b><span class="muted">${esc(g.genre || "")}</span></div></a>`;

function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = ((x0 + x1) / 2).toFixed(1);
    d += ` C${mx},${y0.toFixed(1)} ${mx},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return d;
}

function ring(pct) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(Math.max(pct, 0), 100) / 100);
  return `<svg viewBox="0 0 120 120">
    <defs><linearGradient id="gr" x1="0" x2="1"><stop offset="0" stop-color="#ffd36a"/><stop offset="1" stop-color="#ff8a1f"/></linearGradient></defs>
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="10"/>
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="url(#gr)" stroke-width="10" stroke-linecap="round"
      stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 60 60)"/>
    <text x="60" y="67" text-anchor="middle" fill="#fff" font-size="20" font-weight="800">${num(Math.round(pct))}%</text>
  </svg>`;
}

async function initHome() {
  if (!CONFIGURED) return notice(t("setup_needed"));

  const [games, social] = await Promise.all([
    fetchGames(),
    sb.from("social_links").select("*").eq("enabled", true).order("sort_order"),
  ]);

  // Banner: featured game, or the welcome text when the library is empty
  const featured = games.find((g) => g.is_featured) || games[0];
  if (featured) {
    $("#hero-bg").style.backgroundImage = cover(featured);
    $("#hero-title").textContent = featured.title;
    $("#hero-sub").textContent = [featured.developer, featured.genre, featured.release_year].filter(Boolean).join(" · ");
    $("#hero-link").href = gameHref(featured);
  } else {
    $("#hero-title").textContent = t("hero_title");
    $("#hero-sub").textContent = t("hero_text");
  }

  // Tiles row: popular first, then the rest
  const trio = [...games.filter((g) => g.is_popular), ...games]
    .filter((g, i, a) => a.indexOf(g) === i)
    .slice(0, 3);
  $("#trio").innerHTML = trio.length ? trio.map(tile).join("") : `<p class="empty">${esc(t("no_games"))}</p>`;

  // Latest game
  const latest = games[0];
  $("#update").innerHTML = latest
    ? `<a href="${gameHref(latest)}" class="update"><div class="upd-img" style="background-image:${cover(latest)}"></div>` +
      `<div><b>${esc(latest.title)}</b><div class="muted">${esc(latest.genre || "")}</div></div></a>`
    : `<p class="empty">${esc(t("no_games"))}</p>`;

  // Category counts (real data)
  const counts = {};
  games.forEach((g) => (g.categories || []).forEach((c) => (counts[c] = (counts[c] || 0) + 1)));
  $("#cats").innerHTML = CATS.map(
    (c) => `<a class="chip" href="games.html?cat=${c}">${esc(t("cat_" + c))}${counts[c] ? ` · ${num(counts[c])}` : ""}</a>`
  ).join("");

  // Platform links managed from the admin panel
  $("#social").innerHTML =
    social.error || !social.data?.length
      ? `<p class="empty">${esc(t("no_links"))}</p>`
      : social.data.map((s) => `<a href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${esc(s.title || s.platform)}</a>`).join("");

  // Wave: ratings of the latest games, oldest to newest
  const series = games.slice(0, 12).reverse().map((g) => Number(g.rating) || 0);
  if (series.length >= 2) {
    const W = 600, H = 150, step = W / (series.length - 1);
    const pts = series.map((v, i) => [i * step, H - 20 - (v / 5) * (H - 40)]);
    $("#wave").innerHTML =
      `<defs><linearGradient id="gw" x1="0" x2="1"><stop offset="0" stop-color="#ff8a1f"/><stop offset="1" stop-color="#ffd36a"/></linearGradient></defs>` +
      `<path d="${smoothPath(pts)}" fill="none" stroke="url(#gw)" stroke-width="3" stroke-linecap="round"/>` +
      pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#ffb938" stroke="#0c0c0e" stroke-width="2"/>`).join("");
  }

  // Top categories as bars
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const max = top[0] ? top[0][1] : 1;
  $("#activity").innerHTML = top.length
    ? top.map(([c, n]) => `<div class="act"><span>${esc(t("cat_" + c))}</span><div class="bar"><i style="width:${Math.round((n / max) * 100)}%"></i></div><b>${num(n)}</b></div>`).join("")
    : `<p class="muted">${esc(t("no_games"))}</p>`;

  // Right column: totals, ring and recommendations
  const avg = games.length ? games.reduce((s, g) => s + Number(g.rating || 0), 0) / games.length : 0;
  $("#total").textContent = num(games.length);
  $("#ring").innerHTML = ring((avg / 5) * 100);
  $("#stats").innerHTML = [
    [t("total_games"), num(games.length)],
    [t("featured"), num(games.filter((g) => g.is_featured).length)],
    [t("popular"), num(games.filter((g) => g.is_popular).length)],
    [t("avg_rating"), num(avg.toFixed(1))],
  ]
    .map(([l, v]) => `<div class="stat-row"><span class="muted">${esc(l)}</span><b>${v}</b></div>`)
    .join("");

  const rec = games.filter((g) => Number(g.rating) >= 4).sort((a, b) => b.rating - a.rating).slice(0, 4);
  $("#recommended").innerHTML = rec.length
    ? rec.map((g) => `<a href="${gameHref(g)}"><span>${esc(g.title)}</span><b class="rating">★ ${num(g.rating)}</b></a>`).join("")
    : `<p class="empty">${esc(t("no_games"))}</p>`;
}

const PAGES = { home: initHome };

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  if (CONFIGURED) loadLogo();
  const init = PAGES[document.body.dataset.page];
  if (init) init();
});
