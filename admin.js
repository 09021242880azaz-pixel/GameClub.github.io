/* GAME CLUB — پنل مدیریت (فقط حساب‌های ثبت‌شده در admin_users) */
let GAMES = [];
let SOCIAL = [];
let EDITING = null;

const CAT_FA = {
  action: "اکشن", adventure: "ماجراجویی", racing: "مسابقه‌ای", sports: "ورزشی", horror: "ترسناک",
  shooting: "شوتر", simulation: "شبیه‌سازی", strategy: "استراتژی", rpg: "نقش‌آفرینی", open_world: "جهان باز",
};
const SOCIAL_LABELS = { instagram: "اینستاگرام", youtube: "یوتیوب", rubika: "روبیکا", telegram: "تلگرام", custom: "لینک سفارشی" };
const SPEC_KEYS = ["os", "cpu", "gpu", "ram_gb", "storage_gb"];

const F = (name) => document.querySelector(`#game-form [name="${name}"]`);
const nul = (v) => String(v ?? "").trim() || null;
const err = (e) => notice(e?.message || "خطا رخ داد.");
const ok = (m) => notice(m, false);

function showView(v) {
  $("#view-login").classList.toggle("hidden", v !== "login");
  $("#view-dash").classList.toggle("hidden", v !== "dash");
}

function buildCategoryBoxes() {
  $("#form-cats").innerHTML = CATS.map(
    (c) => `<label class="chip"><input type="checkbox" name="cat" value="${c}" hidden>${CAT_FA[c]}</label>`
  ).join("");
}

async function onLogin(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const { error } = await sb.auth.signInWithPassword({ email: fd.get("email"), password: fd.get("password") });
  if (error) err({ message: "ورود ناموفق: " + error.message });
}

async function enter(user) {
  const { data } = await sb.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) {
    await sb.auth.signOut();
    return err({ message: "این حساب دسترسی مدیریت ندارد." });
  }
  $("#who").textContent = user.email;
  showView("dash");
  await reloadAll();
}

async function reloadAll() {
  await Promise.all([loadGames(), loadSocial(), loadLogoPreview()]);
  loadLogo();
}

async function loadGames() {
  const { data, error } = await sb.from("games").select("*").order("created_at", { ascending: false });
  if (error) return err(error);
  GAMES = data || [];
  renderGames();
  renderStats();
}

function renderGames() {
  $("#games-table").innerHTML = GAMES.length
    ? GAMES.map(
        (g) => `<tr>
          <td>${esc(g.title)}</td>
          <td>${esc(g.genre || "—")}</td>
          <td>${num(g.rating)}</td>
          <td><button class="chip ${g.is_featured ? "on" : ""}" data-act="feature" data-id="${g.id}">${g.is_featured ? "بله" : "خیر"}</button></td>
          <td><button class="chip ${g.is_popular ? "on" : ""}" data-act="popular" data-id="${g.id}">${g.is_popular ? "بله" : "خیر"}</button></td>
          <td>
            <button class="btn ghost sm" data-act="edit" data-id="${g.id}">ویرایش</button>
            <button class="btn danger sm" data-act="del" data-id="${g.id}">حذف</button>
          </td></tr>`
      ).join("")
    : `<tr><td colspan="6" class="empty">بازی‌ای ثبت نشده است.</td></tr>`;
}

function renderStats() {
  const avg = GAMES.length ? GAMES.reduce((s, g) => s + Number(g.rating || 0), 0) / GAMES.length : 0;
  const items = [
    ["کل بازی‌ها", GAMES.length],
    ["ویژه", GAMES.filter((g) => g.is_featured).length],
    ["محبوب", GAMES.filter((g) => g.is_popular).length],
    ["میانگین امتیاز", avg.toFixed(1)],
    ["لینک‌های فعال", SOCIAL.filter((s) => s.enabled).length],
  ];
  $("#stats").innerHTML = items
    .map(([l, v]) => `<div class="glass stat"><b>${num(v)}</b><span class="muted">${l}</span></div>`)
    .join("");

  const counts = {};
  GAMES.forEach((g) => (g.categories || []).forEach((c) => (counts[c] = (counts[c] || 0) + 1)));
  $("#cat-stats").innerHTML = Object.entries(CAT_FA)
    .map(([k, v]) => {
      const n = counts[k] || 0;
      const p = GAMES.length ? Math.round((n / GAMES.length) * 100) : 0;
      return `<div class="catrow"><div class="catlabel"><span>${v}</span><b>${num(n)}</b></div><div class="bar"><i style="width:${p}%"></i></div></div>`;
    })
    .join("");
}

function resetForm() {
  EDITING = null;
  $("#game-form").reset();
  $("#form-title").textContent = "بازی جدید";
}

function fillForm(g) {
  $("#game-form").reset();
  EDITING = g.id;
  $("#form-title").textContent = `ویرایش: ${g.title}`;
  ["title", "developer", "release_year", "genre", "rating", "download_size", "description", "cover_url",
    "video_url", "official_store_url", "download_url"].forEach((n) => (F(n).value = g[n] ?? ""));
  F("platforms").value = (g.platforms || []).join(", ");
  F("gallery").value = (g.gallery || []).join("\n");
  ["min", "rec"].forEach((p) => {
    const s = g[`${p}_specs`] || {};
    SPEC_KEYS.forEach((k) => (F(`${p}_${k}`).value = s[k] ?? ""));
  });
  document.querySelectorAll('#game-form [name="cat"]').forEach((cb) => (cb.checked = (g.categories || []).includes(cb.value)));
  F("is_featured").checked = !!g.is_featured;
  F("is_popular").checked = !!g.is_popular;
  $("#game-section").scrollIntoView({ behavior: "smooth" });
}

function readForm() {
  const specs = (p) => ({
    os: nul(F(`${p}_os`).value),
    cpu: nul(F(`${p}_cpu`).value),
    gpu: nul(F(`${p}_gpu`).value),
    ram_gb: Number(F(`${p}_ram_gb`).value) || null,
    storage_gb: Number(F(`${p}_storage_gb`).value) || null,
  });
  const lines = (v) => String(v || "").split("\n").map((s) => s.trim()).filter(Boolean);
  return {
    title: F("title").value.trim(),
    developer: nul(F("developer").value),
    release_year: Number(F("release_year").value) || null,
    genre: nul(F("genre").value),
    rating: F("rating").value === "" ? null : Number(F("rating").value),
    download_size: nul(F("download_size").value),
    platforms: F("platforms").value.split(",").map((s) => s.trim()).filter(Boolean),
    categories: [...document.querySelectorAll('#game-form [name="cat"]:checked')].map((c) => c.value),
    description: nul(F("description").value),
    cover_url: nul(F("cover_url").value),
    video_url: nul(F("video_url").value),
    gallery: lines(F("gallery").value),
    official_store_url: nul(F("official_store_url").value),
    download_url: nul(F("download_url").value),
    min_specs: specs("min"),
    rec_specs: specs("rec"),
    is_featured: F("is_featured").checked,
    is_popular: F("is_popular").checked,
  };
}

async function saveGame(e) {
  e.preventDefault();
  const p = readForm();
  if (!p.title) return err({ message: "عنوان بازی الزامی است." });
  if (p.rating !== null && (p.rating < 0 || p.rating > 5)) return err({ message: "امتیاز باید بین ۰ و ۵ باشد." });
  const res = EDITING
    ? await sb.from("games").update(p).eq("id", EDITING)
    : await sb.from("games").insert(p);
  if (res.error) return err(res.error);
  ok("بازی ذخیره شد.");
  resetForm();
  loadGames();
}

async function onGamesClick(e) {
  const b = e.target.closest("button[data-act]");
  if (!b) return;
  const g = GAMES.find((x) => x.id === b.dataset.id);
  if (!g) return;
  if (b.dataset.act === "edit") return fillForm(g);
  if (b.dataset.act === "del") {
    if (!confirm(`بازی «${g.title}» حذف شود؟`)) return;
    const { error } = await sb.from("games").delete().eq("id", g.id);
    if (error) return err(error);
    if (EDITING === g.id) resetForm();
    return loadGames();
  }
  const col = b.dataset.act === "feature" ? "is_featured" : "is_popular";
  const { error } = await sb.from("games").update({ [col]: !g[col] }).eq("id", g.id);
  if (error) return err(error);
  loadGames();
}

async function uploadFile(bucket, file) {
  const maxMB = file.type.startsWith("video/") ? 100 : 10;
  if (file.size > maxMB * 1024 * 1024) throw new Error(`حجم فایل نباید بیشتر از ${maxMB} مگابایت باشد.`);
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
  const { error } = await sb.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function uploadInto(e, field) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    F(field).value = await uploadFile("game-media", file);
    ok("فایل آپلود شد. برای ثبت نهایی، بازی را ذخیره کنید.");
  } catch (x) {
    err(x);
  }
}

async function onGalleryFiles(e) {
  const urls = [];
  try {
    for (const f of e.target.files) urls.push(await uploadFile("game-media", f));
  } catch (x) {
    return err(x);
  }
  const ta = F("gallery");
  ta.value = [ta.value.trim(), ...urls].filter(Boolean).join("\n");
  ok("تصاویر به گالری اضافه شد. برای ثبت نهایی، بازی را ذخیره کنید.");
}

async function onLogoFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const url = await uploadFile("site-assets", file);
    const { error } = await sb.from("site_settings").upsert({ key: "logo_url", value: url });
    if (error) throw error;
    ok("لوگو ذخیره شد.");
    loadLogoPreview();
    loadLogo();
  } catch (x) {
    err(x);
  }
}

async function loadLogoPreview() {
  const { data } = await sb.from("site_settings").select("value").eq("key", "logo_url").maybeSingle();
  $("#logo-preview").innerHTML =
    typeof data?.value === "string" && data.value
      ? `<img src="${esc(safeUrl(data.value))}" alt="">`
      : `<p class="empty">لوگویی تنظیم نشده است.</p>`;
}

async function loadSocial() {
  const { data, error } = await sb.from("social_links").select("*").order("sort_order");
  if (error) return err(error);
  SOCIAL = data || [];
  $("#social-table").innerHTML = SOCIAL.length
    ? SOCIAL.map(
        (s) => `<tr>
          <td>${esc(SOCIAL_LABELS[s.platform] || s.platform)}</td>
          <td>${esc(s.title || "—")}</td>
          <td class="ltr">${esc(s.url)}</td>
          <td>${num(s.sort_order)}</td>
          <td><button class="chip ${s.enabled ? "on" : ""}" data-act="toggle" data-id="${s.id}">${s.enabled ? "فعال" : "غیرفعال"}</button></td>
          <td><button class="btn danger sm" data-act="del" data-id="${s.id}">حذف</button></td>
        </tr>`
      ).join("")
    : `<tr><td colspan="6" class="empty">لینکی ثبت نشده است.</td></tr>`;
  renderStats();
}

async function addSocial(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const url = String(fd.get("url") || "").trim();
  if (!/^https?:\/\//i.test(url)) return err({ message: "آدرس باید با http:// یا https:// شروع شود." });
  const { error } = await sb.from("social_links").insert({
    platform: fd.get("platform"),
    title: String(fd.get("title") || "").trim() || null,
    url,
    sort_order: Number(fd.get("sort_order")) || 0,
    enabled: fd.get("enabled") === "on",
  });
  if (error) return err(error);
  e.target.reset();
  ok("لینک افزوده شد.");
  loadSocial();
}

async function onSocialClick(e) {
  const b = e.target.closest("button[data-act]");
  if (!b) return;
  const s = SOCIAL.find((x) => x.id === b.dataset.id);
  if (!s) return;
  if (b.dataset.act === "del") {
    if (!confirm("این لینک حذف شود؟")) return;
    const { error } = await sb.from("social_links").delete().eq("id", s.id);
    if (error) return err(error);
  } else {
    const { error } = await sb.from("social_links").update({ enabled: !s.enabled }).eq("id", s.id);
    if (error) return err(error);
  }
  loadSocial();
}

function initAdmin() {
  if (!CONFIGURED) {
    notice(t("setup_needed"));
    showView("login");
    return;
  }
  buildCategoryBoxes();
  $("#login-form").addEventListener("submit", onLogin);
  $("#logout").addEventListener("click", () => sb.auth.signOut());
  $("#new-game").addEventListener("click", resetForm);
  $("#cancel-edit").addEventListener("click", resetForm);
  $("#game-form").addEventListener("submit", saveGame);
  $("#games-table").addEventListener("click", onGamesClick);
  $("#social-form").addEventListener("submit", addSocial);
  $("#social-table").addEventListener("click", onSocialClick);
  $("#cover-file").addEventListener("change", (e) => uploadInto(e, "cover_url"));
  $("#video-file").addEventListener("change", (e) => uploadInto(e, "video_url"));
  $("#gallery-file").addEventListener("change", onGalleryFiles);
  $("#logo-file").addEventListener("change", onLogoFile);

  sb.auth.onAuthStateChange((event, session) => {
    if (!session) return showView("login");
    if (event === "INITIAL_SESSION" || event === "SIGNED_IN") enter(session.user);
  });
}

document.addEventListener("DOMContentLoaded", initAdmin);
