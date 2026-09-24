/* Shared adapters + section-outline builder + status/export tracker, used
   by every layout round from G onward. Extracted out of per-file inline
   scripts so new prototypes don't have to re-paste ~300 lines of
   identical JS every time. Load after data.js and partnership-lib.js.

   Contract expected from the page that includes this file:
   - a `.screen[data-screen="browse"]` section for the browse view, and
     a `.screen[data-screen="builder"]` section with the standard
     builder-shell markup (#sectionList, #builderMain, #builderProgress,
     #builderBack, #builderNext, and a back link with id
     "builderBackToBrowse")
   - the tracker overlay markup (#trackerOverlay, #trackerBtn,
     #trackerBadge, #trackerBody, #trackerClose)
   - the browse view calls `openBuilder(designable)` on click, where
     `designable` comes from `fromOpportunity(o)` or `fromSponsor(t, design)` */

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ---------- generalized designable ---------- */

function fromOpportunity(o) {
  return {
    kind: "onepager",
    eyebrow: TYPE_LABEL[o.type] + " · Fit " + o.fit,
    name: o.name,
    sub: amountRange(o) + " · " + o.timeline,
    gainQuote: o.gain,
    gainSub: o.worksWith,
    termsLine: o.terms.join(", ") + ".",
    defaultAskText: defaultAsk(o),
    defaultUseText: defaultUseOfFunds(o),
    draftSubLine: () => "Partnership request to " + o.name,
    filenameBase: (org) => slug(org) + "-" + slug(o.name) + "-one-pager",
    trackerKind: "onepager",
    trackerTitle: o.name,
    trackerSubtitle: amountRange(o) + " · " + o.timeline,
  };
}

function fromSponsor(t, design) {
  return {
    kind: "email",
    eyebrow: "CORPORATE · " + t.business_unit,
    name: t.company,
    sub: t.check_size,
    gainQuote: t.strategic_hook,
    gainSub: t.why_them,
    termsLine: `${t.entry_vehicle} Typical structure: ${t.check_size}.`,
    defaultAskText: `A short call to explore ${t.entry_vehicle.split(".")[0].toLowerCase()}.`,
    defaultUseText: `To advance: ${design.study_summary}`,
    draftSubLine: () => `Outreach to ${t.company}, ${t.business_unit}`,
    filenameBase: (org) => slug(org) + "-" + slug(t.company) + "-outreach",
    trackerKind: "vpemail",
    trackerTitle: t.company + " outreach",
    trackerSubtitle: t.business_unit,
  };
}

/* ---------- builder: outline-nav + focused editor ---------- */

const SECTIONS = [
  { id: "opportunity", label: "The opportunity", kind: "summary" },
  { id: "ask", label: "What we're asking", kind: "field", helper: "One or two sentences. CHELCIE drafted a start, edit it into your own words." },
  { id: "use", label: "How funds are used", kind: "field", helper: "Be specific, this is what gets checked against later." },
  { id: "fit", label: "Why this fits", kind: "field", helper: "Their reasoning, in your voice." },
  { id: "terms", label: "Terms under discussion", kind: "field", helper: "What's on the table so far. Nothing here is final." },
  { id: "review", label: "Review & send", kind: "review" },
];

let currentDesignable = null;
let fieldValues = {};
let sectionIdx = 0;
let currentTrackedEntry = null;

const screens = Array.from(document.querySelectorAll(".screen"));
function showScreen(id) {
  screens.forEach((s) => s.classList.toggle("active", s.dataset.screen === id));
  window.scrollTo(0, 0);
}

function openBuilder(d) {
  currentDesignable = d;
  currentTrackedEntry = null;
  fieldValues = {
    org: "Your organization",
    ask: d.defaultAskText,
    use: d.defaultUseText,
    fit: d.gainQuote,
    terms: d.termsLine,
  };
  sectionIdx = 0;
  showScreen("builder");
  renderSectionList();
  renderBuilderMain();
}

document.getElementById("builderBackToBrowse").addEventListener("click", () => showScreen("browse"));

function renderSectionList() {
  const list = document.getElementById("sectionList");
  list.innerHTML = SECTIONS.map((s, i) => `
    <li>
      <button class="section-item ${i === sectionIdx ? "current" : ""}" data-idx="${i}">
        <span class="section-mark ${s.kind !== "field" || fieldValues[s.id] ? "done" : ""}"></span>
        <span class="section-item-label">${s.label}</span>
      </button>
    </li>
  `).join("");
  list.querySelectorAll(".section-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      sectionIdx = Number(btn.dataset.idx);
      renderSectionList();
      renderBuilderMain();
    });
  });
}

function currentDocumentText() {
  const d = currentDesignable;
  const org = fieldValues.org.trim() || "Your organization";
  const text = [
    org,
    d.draftSubLine(),
    ``,
    `WHAT WE ARE ASKING`,
    fieldValues.ask,
    ``,
    `HOW THE FUNDS WILL BE USED`,
    fieldValues.use,
    ``,
    `WHY THIS FITS`,
    fieldValues.fit,
    ``,
    `TERMS UNDER DISCUSSION`,
    fieldValues.terms,
  ].join("\n");
  return { org, text };
}

function renderBuilderMain() {
  const d = currentDesignable;
  const s = SECTIONS[sectionIdx];
  const main = document.getElementById("builderMain");

  if (s.kind === "summary") {
    main.innerHTML = `
      <p class="builder-eyebrow">${d.eyebrow}</p>
      <h2 class="builder-title">${d.name}</h2>
      <p class="builder-helper">${d.sub}</p>
      <div class="gain-callout">
        <blockquote>${d.gainQuote}</blockquote>
        <p class="works-with">${d.gainSub}</p>
      </div>
      <div class="field-group">
        <label>Your organization</label>
        <input type="text" id="orgInput" value="${fieldValues.org}" />
      </div>
    `;
    document.getElementById("orgInput").addEventListener("input", (e) => { fieldValues.org = e.target.value; });
  } else if (s.kind === "field") {
    main.innerHTML = `
      <p class="builder-eyebrow">Section ${sectionIdx} of ${SECTIONS.length - 1}</p>
      <h2 class="builder-title">${s.label}</h2>
      <p class="builder-helper">${s.helper}</p>
      <button class="regen-link builder-redraft" id="redraftBtn">Redraft with CHELCIE</button>
      <div class="field-group">
        <textarea id="sectionField" rows="6">${fieldValues[s.id]}</textarea>
      </div>
    `;
    document.getElementById("sectionField").addEventListener("input", (e) => {
      fieldValues[s.id] = e.target.value;
      renderSectionList();
    });
    document.getElementById("redraftBtn").addEventListener("click", () => {
      const defaults = { ask: d.defaultAskText, use: d.defaultUseText, fit: d.gainQuote, terms: d.termsLine };
      fieldValues[s.id] = defaults[s.id];
      renderBuilderMain();
      renderSectionList();
    });
  } else if (s.kind === "review") {
    const { text } = currentDocumentText();
    if (!currentTrackedEntry) {
      currentTrackedEntry = addTracked({
        kind: d.trackerKind,
        title: d.trackerTitle,
        subtitle: d.trackerSubtitle,
        exportText: text,
        filename: d.filenameBase(fieldValues.org) + ".txt",
      });
    } else {
      currentTrackedEntry.exportText = text;
    }
    main.innerHTML = `
      <p class="builder-eyebrow">Last step</p>
      <h2 class="builder-title">Review &amp; send</h2>
      <p class="builder-helper">Everything below is editable from its own section on the left. Export when it's ready, or mark it sent once it's out the door.</p>
      <p class="draft-status" id="draftStatus"></p>
      <div class="draft-actions">
        <button class="btn-secondary" id="exportDraftBtn">Export .txt</button>
        <button class="btn-secondary" id="markSentBtn">Mark as sent</button>
      </div>
      <div class="draft-output"><pre style="white-space:pre-wrap; font-family:inherit; margin:0; font-size:0.875rem; line-height:1.6;">${text}</pre></div>
    `;
    renderDraftStatus();
    document.getElementById("exportDraftBtn").addEventListener("click", () => {
      currentTrackedEntry.exportText = currentDocumentText().text;
      exportEntry(currentTrackedEntry);
    });
    document.getElementById("markSentBtn").addEventListener("click", () => {
      currentTrackedEntry.status = currentTrackedEntry.status === "sent" ? "draft" : "sent";
      renderDraftStatus();
    });
  }

  document.getElementById("builderProgress").textContent = `${s.label} · ${sectionIdx + 1} of ${SECTIONS.length}`;
  document.getElementById("builderBack").style.visibility = sectionIdx === 0 ? "hidden" : "visible";
  document.getElementById("builderNext").style.visibility = sectionIdx === SECTIONS.length - 1 ? "hidden" : "visible";
}

document.getElementById("builderBack").addEventListener("click", () => {
  if (sectionIdx > 0) {
    sectionIdx--;
    renderSectionList();
    renderBuilderMain();
  }
});
document.getElementById("builderNext").addEventListener("click", () => {
  if (sectionIdx < SECTIONS.length - 1) {
    sectionIdx++;
    renderSectionList();
    renderBuilderMain();
  }
});

function renderDraftStatus() {
  if (!currentTrackedEntry) return;
  const st = document.getElementById("draftStatus");
  const btn = document.getElementById("markSentBtn");
  st.innerHTML = `<span class="status-dot ${currentTrackedEntry.status}"></span> ${currentTrackedEntry.status === "sent" ? "Marked as sent" : "Draft ready, not sent yet"}`;
  btn.textContent = currentTrackedEntry.status === "sent" ? "Mark as not sent" : "Mark as sent";
}

/* ---------- status + export tracker ---------- */

const tracked = [];

function addTracked(entry) {
  const record = { id: Date.now() + Math.random(), status: "draft", createdAt: new Date(), ...entry };
  tracked.unshift(record);
  updateTrackerBadge();
  return record;
}

function updateTrackerBadge() {
  const badge = document.getElementById("trackerBadge");
  badge.hidden = tracked.length === 0;
  badge.textContent = tracked.length;
}

function exportEntry(entry) {
  const blob = new Blob([entry.exportText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = entry.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const trackerOverlay = document.getElementById("trackerOverlay");
document.getElementById("trackerBtn").addEventListener("click", () => {
  renderTracker();
  trackerOverlay.classList.add("active");
});
document.getElementById("trackerClose").addEventListener("click", () => trackerOverlay.classList.remove("active"));

function renderTracker() {
  const body = document.getElementById("trackerBody");
  if (tracked.length === 0) {
    body.innerHTML = `<p class="tracker-empty">Nothing drafted yet. Open any opportunity or discovered company and start designing.</p>`;
    return;
  }
  body.innerHTML = tracked.map((t, i) => `
    <div class="tracker-item">
      <div>
        <p class="tracker-kind">${t.kind === "onepager" ? "ONE-PAGER" : "OUTREACH EMAIL"}</p>
        <p class="tracker-title">${t.title}</p>
        <p class="tracker-sub">${t.subtitle}</p>
      </div>
      <div class="tracker-actions">
        <span class="status-pill ${t.status}">${t.status === "sent" ? "Sent" : "Draft ready"}</span>
        <button class="btn-secondary tracker-export" data-idx="${i}">Export</button>
        <button class="back-link tracker-toggle" data-idx="${i}">${t.status === "sent" ? "Mark as not sent" : "Mark as sent"}</button>
      </div>
    </div>
  `).join("");
  body.querySelectorAll(".tracker-export").forEach((btn) => {
    btn.addEventListener("click", () => exportEntry(tracked[Number(btn.dataset.idx)]));
  });
  body.querySelectorAll(".tracker-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const t = tracked[Number(btn.dataset.idx)];
      t.status = t.status === "sent" ? "draft" : "sent";
      renderTracker();
    });
  });
}
