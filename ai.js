/* GAME CLUB — دستیار هوشمند: پیشنهاد بازی و تحلیل سازگاری سیستم */
const LEVEL_KEY = { below_min: "level_below", meets_min: "level_min", meets_rec: "level_rec", unknown: "level_unknown" };
const STATUS_KEY = { below_min: "status_below", meets_min: "status_min", meets_rec: "status_rec" };

// همه درخواست‌ها از طریق Edge Function انجام می‌شوند؛ کلید هوش مصنوعی هرگز در مرورگر نیست.
async function callAI(payload) {
  if (!CONFIGURED) throw new Error(t("setup_needed"));
  const { data, error } = await sb.functions.invoke(CFG.AI_FUNCTION_NAME || "ai-assistant", {
    body: { ...payload, lang: LANG },
  });
  if (error) {
    let msg = t("error");
    try {
      const j = await error.context.json();
      if (j?.error) msg = j.error;
    } catch (e) {}
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

async function onRecommend(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const out = $("#rec-out");
  out.innerHTML = `<p class="empty">${esc(t("ai_wait"))}</p>`;
  try {
    const data = await callAI({
      type: "recommend",
      input: {
        genres: fd.getAll("genre"),
        gameplay: String(fd.get("gameplay") || "").slice(0, 120),
        mode: fd.get("mode"),
        interests: String(fd.get("interests") || "").slice(0, 500),
      },
    });
    const recs = data.recommendations || [];
    out.innerHTML = recs.length
      ? recs
          .map(
            (r) => `<a class="glass result" href="game.html?id=${encodeURIComponent(r.id)}">
              <b>${esc(r.title)}</b><p class="muted">${esc(r.reason)}</p></a>`
          )
          .join("")
      : `<p class="empty">${esc(data.message || t("rec_none"))}</p>`;
  } catch (err) {
    out.innerHTML = `<div class="notice">${esc(err.message)}</div>`;
  }
}

async function onCheck(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const out = $("#pc-out");
  out.innerHTML = `<p class="empty">${esc(t("ai_wait"))}</p>`;
  try {
    const data = await callAI({
      type: "compat",
      game_id: fd.get("game_id"),
      pc: {
        cpu: fd.get("cpu"),
        gpu: fd.get("gpu"),
        ram_gb: Number(fd.get("ram_gb")),
        os: fd.get("os"),
        storage_gb: Number(fd.get("storage_gb")),
      },
    });
    out.innerHTML = `<div class="glass result">
      <b class="verdict">${esc(t(STATUS_KEY[data.status] || "status_below"))}</b>
      ${data.status === "meets_min" ? `<p class="muted">${esc(t("limit_note"))}</p>` : ""}
      ${data.summary ? `<p class="muted">${esc(data.summary)}</p>` : ""}
      <table class="specs" style="margin-top:12px">
        ${data.items
          .map(
            (i) => `<tr><td>${esc(t(i.component))}</td><td class="ltr">${esc(i.have)}</td><td>${esc(t(LEVEL_KEY[i.level] || "level_unknown"))}</td></tr>`
          )
          .join("")}
      </table>
      ${data.items.filter((i) => i.note).map((i) => `<p class="muted"><b>${esc(t(i.component))}:</b> ${esc(i.note)}</p>`).join("")}
    </div>`;
  } catch (err) {
    out.innerHTML = `<div class="notice">${esc(err.message)}</div>`;
  }
}

async function initAI() {
  $("#rec-genres").innerHTML = CATS.map(
    (c) => `<label class="chip"><input type="checkbox" name="genre" value="${c}" hidden>${esc(t("cat_" + c))}</label>`
  ).join("");
  if (!CONFIGURED) {
    notice(t("setup_needed"));
  } else {
    const { data } = await sb.from("games").select("id,title").order("title");
    $("#pc-game").innerHTML =
      (data || []).map((g) => `<option value="${esc(g.id)}">${esc(g.title)}</option>`).join("") || `<option value="">—</option>`;
  }
  $("#rec-form").addEventListener("submit", onRecommend);
  $("#pc-form").addEventListener("submit", onCheck);
}

PAGES.ai = initAI;
