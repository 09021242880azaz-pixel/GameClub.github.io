/* GAME CLUB — کتابخانه و صفحه جزئیات بازی */
let ALL = [];
let ACTIVE_CAT = "";

const SORTS = {
  newest: null,
  rating: (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
  title: (a, b) => String(a.title).localeCompare(String(b.title), LANG),
};

const gameCard = (g) =>
  `<a class="glass game-card" href="${gameHref(g)}">
    <div class="cover" style="background-image:${cover(g)}">${g.is_featured ? `<span class="badge">${esc(t("featured"))}</span>` : ""}</div>
    <div class="card-body">
      <h3>${esc(g.title)}</h3>
      <div class="meta"><span>${esc(g.genre || "")}</span><span>${num(g.release_year)}</span><span class="rating">★ ${num(g.rating)}</span></div>
    </div>
  </a>`;

function markChips() {
  document.querySelectorAll("#cats .chip").forEach((c) => c.classList.toggle("on", c.dataset.cat === ACTIVE_CAT));
}

function applyFilters() {
  const q = $("#q").value.trim().toLowerCase();
  const cmp = SORTS[$("#sort").value];
  let list = ALL.filter(
    (g) =>
      (!ACTIVE_CAT || (g.categories || []).includes(ACTIVE_CAT)) &&
      (!q || [g.title, g.developer, g.genre].join(" ").toLowerCase().includes(q))
  );
  if (cmp) list = list.sort(cmp);
  $("#results").innerHTML = list.length ? list.map(gameCard).join("") : `<p class="empty">${esc(t("no_results"))}</p>`;
  $("#count").textContent = t("results_count").replace("{n}", num(list.length));
  markChips();
}

async function initGames() {
  if (!CONFIGURED) return notice(t("setup_needed"));
  const params = new URLSearchParams(location.search);
  ACTIVE_CAT = params.get("cat") || "";
  $("#q").value = params.get("q") || "";
  $("#cats").innerHTML = [`<button class="chip" data-cat="">${esc(t("all"))}</button>`]
    .concat(CATS.map((c) => `<button class="chip" data-cat="${c}">${esc(t("cat_" + c))}</button>`))
    .join("");
  $("#cats").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-cat]");
    if (!b) return;
    ACTIVE_CAT = b.dataset.cat;
    applyFilters();
  });
  $("#q").addEventListener("input", applyFilters);
  $("#sort").addEventListener("change", applyFilters);
  ALL = await fetchGames();
  applyFilters();
}

function videoEmbed(url) {
  const yt = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" allowfullscreen loading="lazy" title="gameplay"></iframe>`;
  return `<video controls playsinline src="${esc(safeUrl(url))}"></video>`;
}

function specTable(s) {
  if (!s) return `<p class="empty">—</p>`;
  const rows = [
    [t("os"), s.os],
    [t("cpu"), s.cpu],
    [t("gpu"), s.gpu],
    [t("ram"), s.ram_gb ? `${num(s.ram_gb)} GB` : ""],
    [t("storage"), s.storage_gb ? `${num(s.storage_gb)} GB` : ""],
  ];
  return `<table class="specs">${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v || "—")}</td></tr>`).join("")}</table>`;
}

async function initGame() {
  if (!CONFIGURED) return notice(t("setup_needed"));
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return notice(t("not_found"));
  const { data: g, error } = await sb.from("games").select("*").eq("id", id).maybeSingle();
  if (error || !g) return notice(t("not_found"));

  document.title = `${g.title} — GAME CLUB`;
  const gallery = g.gallery || [];
  const videoBtn = g.video_url ? `<button class="vid" data-video="1" aria-label="video">▶</button>` : "";
  const thumbs = videoBtn + gallery.map((src, i) => `<img data-i="${i}" src="${esc(safeUrl(src))}" alt="">`).join("");

  $("#game").innerHTML = `
    <section class="glass hero-game" style="--bg-img:${cover(g)}">
      <div class="hero-game-body">
        <a class="back" href="games.html">‹ ${esc(t("back"))}</a>
        <h1>${esc(g.title)}</h1>
        <p class="meta">${esc(g.developer || "")}${g.release_year ? ` · ${num(g.release_year)}` : ""}</p>
        <div class="chips" style="margin-top:12px">${(g.categories || []).map((c) => `<span class="chip on">${esc(t("cat_" + c))}</span>`).join("")}</div>
        <p class="desc">${esc(g.description || "")}</p>
        <div class="meta-row">
          <span>★ <b class="rating">${num(g.rating)}</b> ${esc(t("rating"))}</span>
          <span>${esc(t("size"))}: <b>${esc(g.download_size || "—")}</b></span>
          <span>${esc(t("platforms"))}: <b>${esc((g.platforms || []).join("، ") || "—")}</b></span>
        </div>
        <div class="actions">
          ${g.official_store_url ? `<a class="btn" href="${esc(safeUrl(g.official_store_url))}" target="_blank" rel="noopener noreferrer">${esc(t("store"))}</a>` : ""}
          ${g.download_url ? `<a class="btn ghost" href="${esc(safeUrl(g.download_url))}" target="_blank" rel="noopener noreferrer">${esc(t("download"))}</a>` : ""}
        </div>
      </div>
    </section>

    <section class="game-grid">
      <div class="glass panel">
        <h2>${esc(t("media"))}</h2>
        <div class="player" id="display"></div>
        <div class="gallery" id="thumbs">${thumbs}</div>
      </div>
      <div class="glass panel">
        <h2>${esc(t("requirements"))}</h2>
        <h3 class="sub">${esc(t("minimum"))}</h3>
        ${specTable(g.min_specs)}
        <h3 class="sub">${esc(t("recommended_req"))}</h3>
        ${specTable(g.rec_specs)}
      </div>
    </section>`;

  const show = (m) => {
    $("#display").innerHTML = m.video ? videoEmbed(m.src) : `<img src="${esc(safeUrl(m.src))}" alt="${esc(g.title)}">`;
  };
  if (g.video_url) show({ video: true, src: g.video_url });
  else if (gallery[0]) show({ video: false, src: gallery[0] });
  else $("#display").innerHTML = `<p class="empty">${esc(t("no_media"))}</p>`;

  $("#thumbs").addEventListener("click", (e) => {
    if (e.target.closest("[data-video]")) return show({ video: true, src: g.video_url });
    const img = e.target.closest("img[data-i]");
    if (img) show({ video: false, src: gallery[+img.dataset.i] });
  });
}

PAGES.games = initGames;
PAGES.game = initGame;
