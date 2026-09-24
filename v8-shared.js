/* Round 8 — the arrival page, shared across layouts A, B and C.

   One place you land after intake, for every kind of money. The three
   layouts differ only in how the middle of the page is arranged; the
   sections themselves are built here so the copy stays identical when
   Amy compares them side by side.

   Loaded AFTER data.js, partnership-lib.js and builder-shared.js.

   Page contract expected from each layout:
     #fitMount     — headline + fit card
     #toldMount    — "what you told us"
     #listMount    — the one mixed list
     #tellMount    — tell CHELCIE + keeps looking
   Layout B additionally mounts a describe box and calls applyDescribe().
   Layout C additionally mounts #stackMount and calls renderStack(). */

/* ---------- plain-words field mapping ----------
   The C-CHANGE component fields, generalised for every kind of money:
     strategic_hook  -> "Why they'd want you"
     entry_vehicle   -> "What kind of deal it is"
     check_size      -> "How much"
     decision_maker  -> "Who decides"
     why_them        -> the one-liner under the name
     sources         -> "Check it yourself"                              */

const KIND_WORD = {
  grant: "Grant",
  loan: "Loan",
  corporate: "Corporate partner",
  equity: "Investor",
};

/* Who actually signs off, and the one-liner. Written per organisation
   because "who decides" is the part a generic template always gets wrong. */
const WHO_DECIDES = {
  meridian: {
    who: "Their credit committee, which meets every other week.",
    line: "A lender that needs borrowers like you to prove its own case.",
  },
  hartwell: {
    who: "A family board of five. One of them reads everything first.",
    line: "A family foundation under pressure to show real outcomes.",
  },
  beacon: {
    who: "Two partners. Both have to say yes.",
    line: "A fund building a track record before it raises again.",
  },
  alderfitch: {
    who: "The head of partnerships, with sign-off from their CFO over $250K.",
    line: "A company that needs a partner it can point to, not just fund.",
  },
  northstar: {
    who: "A loan officer prepares it; the investment committee approves it.",
    line: "A lender with federal targets your loan helps them hit.",
  },
  cascade: {
    who: "A shared committee with one representative from each member foundation.",
    line: "Six small funders behind one relationship.",
  },
  fielding: {
    who: "Their community giving lead, who runs it past HR for the volunteer side.",
    line: "A company short on things its staff can actually show up for.",
  },
  thornwood: {
    who: "The full partnership, at a Monday meeting.",
    line: "A first-time fund that needs a reference story.",
  },
  unionsquare: {
    who: "A community board of local donors and two staff.",
    line: "A local fund that has to prove local money stays local.",
  },
  harborview: {
    who: "A member-elected lending panel.",
    line: "A co-op owned by the organisations it lends to.",
  },
  kestrelvine: {
    who: "The investment partner who sources the deal, then the full partner meeting.",
    line: "A fund with a gap in its portfolio you happen to fill.",
  },
  willowmere: {
    who: "Programme staff shortlist it; the trustees decide.",
    line: "A foundation heading into a charter renewal.",
  },
  granitestate: {
    who: "An executive sponsor, tied to their own comp.",
    line: "A company where someone's bonus depends on this working.",
  },
};

/* Corporate check sizes are written as prose. Pull the dollar figures out. */
function parseMoney(tok) {
  const m = String(tok).match(/\$?\s*([\d.]+)\s*([KkMm])?/);
  if (!m) return 0;
  return parseFloat(m[1]) * (/[Mm]/.test(m[2] || "") ? 1e6 : /[Kk]/.test(m[2] || "") ? 1e3 : 1);
}
function checkSizeFigures(text) {
  const hits = String(text).match(/\$\s*[\d.]+\s*[KkMm]?/g) || [];
  const nums = hits.map(parseMoney).filter((n) => n > 0);
  return nums.length ? nums : [150000];
}
function checkSizeLow(text) {
  return Math.min(...checkSizeFigures(text));
}
function checkSizeHigh(text) {
  return Math.max(...checkSizeFigures(text));
}

/* The list shows one line, not a paragraph. */
function firstSentence(text) {
  const m = String(text).match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : String(text)).trim();
}

/* What the deal actually is, and how you get in, per kind of money. */
function dealShape(o) {
  if (o.type === "loan") {
    return {
      deal: "Money you pay back, on terms. No ownership changes hands.",
      howIn: "Send two years of financials and a short note on what the money is for. They will come back with an indicative rate before anything formal.",
      offer: "A clean, boring repayment record and the numbers to back it up.",
    };
  }
  if (o.type === "grant") {
    return {
      deal: "Money you do not pay back and do not give anything up for. You report on how it went.",
      howIn: "A short letter first, not a full application. Two pages on what you would do and what you would measure.",
      offer: "Outcomes they can put in front of their own board, written plainly.",
    };
  }
  if (o.type === "corporate") {
    return {
      deal: "A partnership: cash, plus something they can point to. Usually renewable.",
      howIn: "Go to the business unit, not the giving desk. Ask for twenty minutes, bring one page.",
      offer: "A relationship that is easy to run and easy for them to talk about.",
    };
  }
  return {
    deal: "Money for a share of the organisation. You give up some ownership and some control.",
    howIn: "A warm introduction moves faster than a cold one here. Expect a long diligence process.",
    offer: "A well-governed organisation they can show their own investors.",
  };
}

/* ---------- build the one mixed list ---------- */

/* Everything in the list, whatever kind of money it is, becomes this shape. */
function toItem(o) {
  const shape = dealShape(o);
  const extra = WHO_DECIDES[o.id] || { who: "Not confirmed yet.", line: "" };
  return {
    id: o.id,
    kind: o.type,
    kindWord: KIND_WORD[o.type],
    name: o.name,
    fit: o.fit,
    why: o.gain,
    line: extra.line,
    hook: extra.line || firstSentence(o.gain),
    howMuch: amountRange(o),
    min: o.min,
    max: o.max,
    when: o.timeline,
    deal: shape.deal,
    howIn: shape.howIn,
    offer: shape.offer,
    who: extra.who,
    terms: o.terms,
    sources: [],
    sample: true, // invented organisation — see the note in index.html
    dilutive: o.dilutive,
    slow: /6 to 9 month|12\+ month|diligence/i.test(o.timeline),
    designable: fromOpportunity(o),
  };
}

/* Corporate targets CHELCIE surfaced from a description of the work. These
   are the only entries with real organisations and real public links. */
function toDiscoveredItem(t, design, rank) {
  return {
    id: "disc-" + slug(t.company),
    kind: "corporate",
    kindWord: "Corporate partner",
    name: t.company,
    // Ranked down the list rather than all tying at the top, so the mixed
    // list stays genuinely mixed instead of four corporates then everything else.
    fit: 96 - rank * 5,
    why: t.strategic_hook,
    line: t.why_them,
    hook: firstSentence(t.why_them),
    howMuch: t.check_size,
    min: checkSizeLow(t.check_size),
    max: checkSizeHigh(t.check_size),
    when: "No deadline — this is a conversation, not an application",
    deal: t.entry_vehicle,
    howIn: t.decision_maker.name_hint,
    offer: "Work their business unit needs and cannot produce itself.",
    who: t.decision_maker.role,
    terms: [],
    sources: t.sources || [],
    sample: false,
    dilutive: false,
    slow: false,
    discovered: true,
    designable: fromSponsor(t, design),
  };
}

/* ---------- state ---------- */

const v8 = {
  // Exactly the fields onboarding v2 captures, with its own default values.
  intake: {
    entity: "501(c)(3) nonprofit",
    state: "Massachusetts",
    years: 6,
    employees: 45,
    purpose: "Program",
    need: 2500000,
    revenue: 8000000,
    daysCash: 47,
    dscr: 1.32,
    populations: ["Low-income", "Children"],
  },
  wantKinds: new Set(["grant", "loan", "corporate", "equity"]),
  rules: new Set(["no-ownership"]),
  describeText: "",
  discovered: [],
  openId: null,
  decisions: {}, // id -> { value, reason, revisit, note }
  added: 3,
  view: "list",
  rulesOpen: false,
};

/* What CHELCIE searches on when the user has typed nothing at all: the
   structured answers, turned into a query. The user never sees this string —
   it stands in for the prose they were never asked to write. */
function intakeQuery() {
  const i = v8.intake;
  return [i.purpose, i.populations.join(" "), "community clinic primary care health"].join(" ");
}

const RULES = [
  { id: "no-ownership", label: "No giving up ownership", hides: (it) => it.dilutive },
  { id: "no-repay", label: "Nothing we pay back", hides: (it) => it.kind === "loan" },
  { id: "no-slow", label: "Nothing slower than six months", hides: (it) => it.slow },
];

const PASS_REASONS = [
  "Not right for us",
  "Wrong timing",
  "Already talking to them",
  "We would not qualify",
  "Not worth it for the size",
  "Something about the relationship",
  "Other",
];

function allItems() {
  return [...OPPORTUNITIES.map(toItem), ...v8.discovered];
}

function visibleItems() {
  const active = RULES.filter((r) => v8.rules.has(r.id));
  return allItems()
    .filter((it) => v8.wantKinds.has(it.kind))
    .filter((it) => !active.some((r) => r.hides(it)))
    .sort((a, b) => b.fit - a.fit);
}

/* ---------- 1. headline + fit card ---------- */

const FIT_TOTAL = 7;
const FIT_NEXT = [
  "your last two years of financials",
  "who is on your board",
  "what you raised last year",
  "the programmes you run now",
];

/* Sum of what's actually on the table, from the visible entries. */
function potential(items) {
  let lo = 0;
  let hi = 0;
  for (const it of items) {
    lo += it.min;
    hi += it.max;
  }
  return { lo, hi };
}

function renderFit() {
  const el = document.getElementById("fitMount");
  if (!el) return;
  const items = visibleItems();
  const { lo, hi } = potential(items);
  const n = v8.added;
  const missing = FIT_NEXT[Math.max(0, n - 3)] || "the last piece";

  // Composition, widest kind first — the breakdown under a balance.
  const byKind = ["grant", "loan", "corporate", "equity"]
    .map((k) => ({ k, total: items.filter((i) => i.kind === k).reduce((a, i) => a + i.max, 0) }))
    .filter((x) => x.total > 0);
  const sum = byKind.reduce((a, x) => a + x.total, 0) || 1;

  el.innerHTML = `
    <div class="v8-hero">
      <p class="eyebrow">Welcome, Amy</p>
      <h1>Realise your financial potential.</h1>
    </div>

    <div class="potential">
      <p class="potential-figure">${money(lo)} <span>to</span> ${money(hi)}</p>
      <p class="potential-sub">on the table right now, across ${items.length} places that want what you have.</p>

      <div class="comp-bar">
        ${byKind
          .map(
            (x) =>
              `<span class="comp-seg ${x.k}" style="flex:${x.total / sum}" title="${KIND_WORD[x.k]}s"></span>`,
          )
          .join("")}
      </div>
      <div class="comp-key">
        ${byKind
          .map((x) => `<span><i class="${x.k}"></i>${KIND_WORD[x.k]}s ${money(x.total)}</span>`)
          .join("")}
      </div>

      <p class="potential-note">
        ${
          n >= FIT_TOTAL
            ? "CHELCIE has everything it asked for. This number is as sharp as it gets."
            : `This grows as CHELCIE learns more. Next up: ${missing}. <button class="regen-link" id="addMore">Add it</button>`
        }
      </p>
    </div>
  `;

  const btn = document.getElementById("addMore");
  if (btn) {
    btn.addEventListener("click", () => {
      v8.added = Math.min(FIT_TOTAL, v8.added + 1);
      renderFit();
    });
  }
}

/* ---------- 2. what you told us ---------- */

function renderTold(opts) {
  const el = document.getElementById("toldMount");
  if (!el) return;
  const i = v8.intake;

  // Read in a couple of seconds, not a couple of sentences. These are the
  // answers from onboarding v2, shown back as facts.
  const facts = [
    ["Organisation", `${i.entity} · ${i.years} years · ${i.employees} people`],
    ["Looking to fund", `${i.purpose.toLowerCase()} · ${money(i.need)}`],
    ["Your numbers", `${money(i.revenue)} revenue · ${i.daysCash} days cash · ${i.dscr}× debt cover`],
    ["Who you serve", i.populations.join(", ").toLowerCase()],
  ];

  el.innerHTML = `
    <div class="told-head">
      <p class="told-label">What you told us</p>
      <button class="told-change" id="toldChange">Change</button>
    </div>
    <dl class="fact-grid">
      ${facts.map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
    </dl>

    <p class="chips-label">Open to</p>
    <div class="chip-row" id="kindChips">
      ${["grant", "loan", "corporate", "equity"]
        .map(
          (k) =>
            `<button class="chip${v8.wantKinds.has(k) ? " on" : ""}" data-kind="${k}">${KIND_WORD[k]}s</button>`,
        )
        .join("")}
    </div>

    <details class="ruled-out"${v8.rulesOpen ? " open" : ""}>
      <summary>${ruledOutSummary()}</summary>
      <div class="chip-row" id="ruleChips">
        ${RULES.map(
          (r) => `<button class="chip chip-out${v8.rules.has(r.id) ? " on" : ""}" data-rule="${r.id}">${r.label}</button>`,
        ).join("")}
      </div>
    </details>
  `;

  const details = el.querySelector(".ruled-out");
  if (details) details.addEventListener("toggle", () => { v8.rulesOpen = details.open; });

  el.querySelectorAll("[data-kind]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.kind;
      if (v8.wantKinds.has(k)) v8.wantKinds.delete(k);
      else v8.wantKinds.add(k);
      renderTold(opts);
      renderList();
    });
  });

  el.querySelectorAll("[data-rule]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = btn.dataset.rule;
      if (v8.rules.has(r)) v8.rules.delete(r);
      else v8.rules.add(r);
      renderTold(opts);
      renderList();
    });
  });

  document.getElementById("toldChange").addEventListener("click", () => {
    window.location.href = "../onboarding-v2/index.html";
  });
}

function money(n) {
  if (n >= 1000000) {
    const m = n / 1000000;
    return "$" + (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + "M";
  }
  return "$" + Math.round(n / 1000) + "K";
}

function ruledOutSummary() {
  const on = RULES.filter((r) => v8.rules.has(r.id));
  if (on.length === 0) return "Nothing ruled out";
  return "Ruled out: " + on.map((r) => r.label.toLowerCase()).join(", ");
}

/* ---------- 3. the one mixed list ---------- */

function renderList() {
  const el = document.getElementById("listMount");
  if (!el) return;
  const items = visibleItems();
  const head =
    v8.view === "stack"
      ? `<div class="list-head"><h2>What it costs you</h2></div>`
      : `<div class="list-head">
           <h2>Best fit first</h2>
           <p class="list-count">${items.length} of ${allItems().length} shown</p>
         </div>`;

  if (v8.view === "stack") {
    el.innerHTML = head + `<div id="stackMount"></div>`;
    renderStack(items);
    return;
  }

  if (items.length === 0) {
    el.innerHTML = head + `<div class="empty-note">Nothing left once those are ruled out. Turn a chip back on above.</div>`;
    return;
  }

  el.innerHTML =
    head +
    `<div class="money-list">${items.map((it) => cardHTML(it)).join("")}</div>`;

  el.querySelectorAll(".card-head").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      v8.openId = v8.openId === id ? null : id;
      renderList();
      if (v8.openId === id) {
        const card = document.querySelector(`.money-card[data-id="${id}"]`);
        if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  items.forEach((it) => {
    if (v8.openId !== it.id) return;
    wireCardBody(it);
  });
}

function cardHTML(it) {
  const open = v8.openId === it.id;
  const d = v8.decisions[it.id];
  return `
    <article class="money-card${open ? " open" : ""}${d && d.value === "pass" ? " decided-pass" : ""}" data-id="${it.id}">
      <button class="card-head" data-id="${it.id}">
        <span class="kind-mark ${it.kind}" aria-hidden="true"></span>
        <span class="card-text">
          <span class="card-why">${it.hook}</span>
          <span class="card-meta">${it.name} &middot; ${it.kindWord}</span>
          ${d ? `<span class="card-decided ${d.value}">${decidedLabel(d)}</span>` : ""}
        </span>
        <span class="card-money">
          <span class="card-amount">${it.howMuch}</span>
          ${it.sample ? `<span class="card-sample">sample</span>` : ""}
        </span>
      </button>
      ${open ? cardBodyHTML(it) : ""}
    </article>
  `;
}

function decidedLabel(d) {
  if (d.value === "pursue") return "You're going after this";
  if (d.value === "hold") return "On hold" + (d.revisit ? ` &middot; back on ${d.revisit}` : "");
  return "Passed" + (d.reason ? ` &middot; ${d.reason}` : "");
}

function cardBodyHTML(it) {
  const d = v8.decisions[it.id];
  return `
    <div class="card-body">
      <div class="body-row">
        <p class="body-label">Why they'd want you</p>
        <p class="body-text">${it.why}</p>
        <p class="card-when">${it.when}${it.sample ? " &middot; sample data" : ""}</p>
      </div>
      <div class="body-row">
        <p class="body-label">Who decides</p>
        <p class="body-text">${it.who}</p>
      </div>
      <div class="body-row">
        <p class="body-label">What kind of deal it is</p>
        <p class="body-text">${it.deal}</p>
      </div>
      <div class="body-row">
        <p class="body-label">How to get in</p>
        <p class="body-text">${it.howIn}</p>
      </div>
      <div class="body-row">
        <p class="body-label">What to offer</p>
        <p class="body-text">${it.offer}</p>
        ${it.terms.length ? `<ul class="body-list">${it.terms.map((t) => `<li>${t}</li>`).join("")}</ul>` : ""}
      </div>
      <div class="body-row">
        <p class="body-label">Check it yourself</p>
        ${
          it.sources.length
            ? `<ul class="source-list">${it.sources
                .map(
                  (s) =>
                    `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a></li>`,
                )
                .join("")}</ul>`
            : `<p class="source-empty">No public link yet. This one is sample data &mdash; open question for Josh.</p>`
        }
      </div>

      <div class="card-actions">
        <button class="btn-primary draft-first" data-id="${it.id}">Draft the first message</button>
      </div>

      <div class="decide-row">
        ${["pursue", "hold", "pass"]
          .map(
            (v) =>
              `<button class="decide-btn${d && d.value === v ? " on" : ""}" data-decide="${v}" data-id="${it.id}">${
                v === "pursue" ? "Pursue" : v === "hold" ? "Hold" : "Pass"
              }</button>`,
          )
          .join("")}
      </div>
      <div id="decidePanel-${it.id}"></div>
    </div>
  `;
}

function wireCardBody(it) {
  const card = document.querySelector(`.money-card[data-id="${it.id}"]`);
  if (!card) return;

  const draft = card.querySelector(".draft-first");
  if (draft) draft.addEventListener("click", () => openBuilder(it.designable));

  card.querySelectorAll("[data-decide]").forEach((btn) => {
    btn.addEventListener("click", () => renderDecidePanel(it, btn.dataset.decide));
  });
}

function renderDecidePanel(it, value) {
  const mount = document.getElementById("decidePanel-" + it.id);
  if (!mount) return;

  const card = document.querySelector(`.money-card[data-id="${it.id}"]`);
  const saved = v8.decisions[it.id];
  const markPending = (v) => {
    card.querySelectorAll("[data-decide]").forEach((b) => {
      b.classList.toggle("on", v ? b.dataset.decide === v : saved && b.dataset.decide === saved.value);
    });
  };

  // Tapping the same button again closes the panel.
  if (mount.dataset.value === value) {
    mount.dataset.value = "";
    mount.innerHTML = "";
    markPending(null);
    return;
  }
  mount.dataset.value = value;
  markPending(value);

  const blurb =
    value === "pursue"
      ? "CHELCIE will dig into this one properly and work out the way in."
      : value === "hold"
        ? "It stays on the list. Pick a date to bring it back if that helps."
        : "It comes off your list, and CHELCIE uses it to sharpen what it finds next.";

  mount.innerHTML = `
    <div class="decide-panel">
      <p>${blurb}</p>
      ${
        value === "pass"
          ? `<label for="passReason-${it.id}">Why</label>
             <select id="passReason-${it.id}">${PASS_REASONS.map((r) => `<option>${r}</option>`).join("")}</select>`
          : ""
      }
      ${
        value === "hold"
          ? `<label for="holdDate-${it.id}">Bring it back on</label>
             <input type="date" id="holdDate-${it.id}" />`
          : ""
      }
      <label for="decideNote-${it.id}">Anything CHELCIE should know (optional)</label>
      <textarea id="decideNote-${it.id}" rows="2" placeholder="What you know that CHELCIE doesn't."></textarea>
      <button class="btn-primary" id="saveDecide-${it.id}">Save</button>
    </div>
  `;

  document.getElementById("saveDecide-" + it.id).addEventListener("click", () => {
    const reasonEl = document.getElementById("passReason-" + it.id);
    const dateEl = document.getElementById("holdDate-" + it.id);
    const noteEl = document.getElementById("decideNote-" + it.id);
    v8.decisions[it.id] = {
      value,
      reason: reasonEl ? reasonEl.value : "",
      revisit: dateEl ? dateEl.value : "",
      note: noteEl ? noteEl.value.trim() : "",
    };
    renderList();
  });
}

/* ---------- 4. tell CHELCIE + keeps looking ---------- */

function renderTell() {
  const el = document.getElementById("tellMount");
  if (!el) return;
  el.innerHTML = `
    <div class="tell-box">
      <h2>Tell CHELCIE something</h2>
      <p class="tell-sub">A relationship you already have, a direction you want, something to stay away from. It changes what shows up above.</p>
      <textarea id="tellBody" rows="3" placeholder="We already know someone on the Hartwell board."></textarea>
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-top:12px;">
        <button class="btn-primary" id="tellSend">Send to CHELCIE</button>
        <span id="tellSent"></span>
      </div>
    </div>
    <div class="keeps-looking">
      <span class="keeps-pulse"></span>
      <p>
        <strong>CHELCIE keeps looking</strong>
        You don't have to come back and check. New matches land here, and anything you passed on stays passed on.
      </p>
    </div>
  `;

  document.getElementById("tellSend").addEventListener("click", () => {
    const body = document.getElementById("tellBody");
    if (!body.value.trim()) return;
    body.value = "";
    document.getElementById("tellSent").innerHTML =
      `<span class="tell-sent">Sent. It shapes what comes up next.</span>`;
  });
}

/* ---------- B: describe your work ---------- */

function applyDescribe(text) {
  v8.describeText = text;
  const design = designPartnership(text);
  v8.discovered = design.targets.map((t, i) => toDiscoveredItem(t, design, i));
  renderList();
  return design;
}

/* ---------- C: the stack ----------

   The star map was decorative: nothing about a funding opportunity is
   actually spatial, so the clusters carried no meaning a customer could
   act on — the same problem round 4's map had.

   This is the second view instead: a capital stack, the way finance people
   already sort money. Top to bottom by what it costs you, from equity (you
   give up ownership) down to grants (you give up nothing). Band width is
   how much of that kind is actually on the table. Tap a band and the list
   filters to it. */

const STACK_ORDER = ["equity", "corporate", "loan", "grant"];

const STACK_COST = {
  equity: "You give up ownership and a say in decisions",
  corporate: "You give up time — the relationship has to be run",
  loan: "You give it back, with interest",
  grant: "You give up nothing but the reporting",
};

function renderStack(items) {
  const mount = document.getElementById("stackMount");
  if (!mount) return;

  const all = allItems();
  const bands = STACK_ORDER.map((kind) => {
    const of = all.filter((i) => i.kind === kind);
    const active = RULES.filter((r) => v8.rules.has(r.id));
    const shown = of.filter((i) => !active.some((r) => r.hides(i)));
    return {
      kind,
      count: of.length,
      lo: of.reduce((a, i) => a + i.min, 0),
      hi: of.reduce((a, i) => a + i.max, 0),
      on: v8.wantKinds.has(kind) && shown.length > 0,
      ruledOut: shown.length === 0,
    };
  }).filter((b) => b.count > 0);

  const widest = Math.max(...bands.map((b) => b.hi), 1);

  mount.innerHTML = `
    <p class="stack-intro">Sorted by what each kind of money costs you, most expensive at the top.</p>
    <div class="stack">
      ${bands
        .map(
          (b) => `
        <button class="stack-band ${b.kind}${b.on ? "" : " off"}" data-kind="${b.kind}">
          <span class="band-fill" style="width:${Math.max((b.hi / widest) * 100, 12)}%"></span>
          <span class="band-body">
            <span class="band-head">
              <span class="band-kind">${KIND_WORD[b.kind]}s</span>
              <span class="band-amount">${money(b.lo)} to ${money(b.hi)}</span>
            </span>
            <span class="band-cost">${STACK_COST[b.kind]}</span>
            <span class="band-count">${b.count} ${b.count === 1 ? "place" : "places"}${b.ruledOut ? " · you ruled this out" : b.on ? "" : " · not shown"}</span>
          </span>
        </button>`,
        )
        .join("")}
    </div>
  `;

  mount.querySelectorAll("[data-kind]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // One band at a time: tapping a band shows only that kind, tapping the
      // only one showing puts everything back.
      const k = btn.dataset.kind;
      // Tapping a kind you ruled out lifts the rule that was hiding it.
      RULES.forEach((r) => {
        if (v8.rules.has(r.id) && all.some((i) => i.kind === k && r.hides(i))) v8.rules.delete(r.id);
      });
      const only = v8.wantKinds.size === 1 && v8.wantKinds.has(k);
      v8.wantKinds = new Set(only ? STACK_ORDER : [k]);
      v8.view = "list";
      syncViewToggle();
      renderFit();
      renderTold();
      renderList();
    });
  });
}

function syncViewToggle() {
  document.querySelectorAll("[data-view]").forEach((b) => {
    b.classList.toggle("on", b.dataset.view === v8.view);
  });
}
