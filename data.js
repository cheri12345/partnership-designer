/* Shared mock data and helpers for the three Partnership Designer layout
   concepts. No backend, no build step. Loaded via <script src="data.js">
   before each layout's own inline script. */

const OPPORTUNITIES = [
  {
    id: "meridian",
    name: "Meridian Community Capital",
    type: "loan",
    fit: 88,
    min: 250000,
    max: 750000,
    dilutive: false,
    timeline: "Rolling, funds in 4 to 6 weeks",
    focusArea: "community lending programs",
    terms: [
      "5-year term",
      "6.25% fixed rate",
      "No collateral required for orgs with 2+ years of financials",
    ],
    gain:
      "Meridian is trying to prove that mission-driven lending performs as well as conventional credit. A clean repayment record from an organization like yours is exactly the track record they need to bring to their own funders.",
    worksWith: "Works with 40+ community organizations carrying $250K to $2M in outstanding loans.",
    requirements: [
      { label: "2+ years of audited financials", met: true },
      { label: "Active operating budget over $500K", met: true },
      { label: "No prior loan defaults", met: true },
    ],
  },
  {
    id: "hartwell",
    name: "Hartwell Family Foundation",
    type: "grant",
    fit: 82,
    min: 50000,
    max: 150000,
    dilutive: false,
    timeline: "Next review: November 2026",
    focusArea: "youth mentoring services",
    terms: [
      "No equity, no repayment",
      "2-year reporting cycle",
      "Program-restricted funds",
    ],
    gain:
      "Hartwell is under pressure from its own board to show funded work that ties back to measurable outcomes, not just activity. A tight, outcomes-based case is worth more to them than a long narrative.",
    worksWith: "Funds 18 organizations a year, mostly first-time grantees.",
    requirements: [
      { label: "501(c)(3) status or fiscal sponsor on file", met: true },
      { label: "Program serves youth directly, not through an intermediary", met: true },
      { label: "Outcomes data from at least 1 prior cohort", met: false },
    ],
  },
  {
    id: "beacon",
    name: "Beacon Impact Partners",
    type: "equity",
    fit: 65,
    min: 500000,
    max: 2000000,
    dilutive: true,
    timeline: "6 to 9 month diligence process",
    focusArea: "growth stage operations",
    terms: [
      "8 to 12% equity stake",
      "One board observer seat",
      "No forced exit before year 5",
    ],
    gain:
      "Beacon is trying to build a track record in mission-aligned deals before raising its next fund. An early, well-run investment in your organization becomes proof they can source deals other investors miss.",
    worksWith: "Has closed 6 deals in the last 18 months, all under $3M.",
    requirements: [
      { label: "3+ years of positive operating margin", met: false },
      { label: "Willing to offer a board observer seat", met: true },
      { label: "Minimum $2M in annual revenue", met: false },
    ],
  },
  {
    id: "alderfitch",
    name: "Alder and Fitch Corporate Partnerships",
    type: "corporate",
    fit: 91,
    min: 100000,
    max: 300000,
    dilutive: false,
    timeline: "Budget cycle opens January 2027",
    focusArea: "workforce training partnerships",
    terms: [
      "Cash plus in-kind services",
      "1-year renewable agreement",
      "Co-branded reporting expected",
    ],
    gain:
      "Alder and Fitch needs a small number of credible, well-run partners it can point to in its own sustainability reporting. They are looking for organizations that make the relationship easy, not just organizations that need the money.",
    worksWith: "Currently supports 4 partners nationally, room for 2 more this cycle.",
    requirements: [
      { label: "Co-branding and joint reporting capacity", met: true },
      { label: "Dedicated staff contact for the partnership", met: true },
      { label: "Existing workforce training curriculum", met: true },
    ],
  },
  {
    id: "northstar",
    name: "Northstar CDFI",
    type: "loan",
    fit: 74,
    min: 1000000,
    max: 3000000,
    dilutive: false,
    timeline: "Applications open year-round",
    focusArea: "affordable housing development",
    terms: [
      "7-year term",
      "5.5% rate for qualifying organizations",
      "Requires 3 years of audited financials",
    ],
    gain:
      "Northstar has federal targets for capital deployed into underserved areas. Every dollar placed with an organization like yours counts directly toward the numbers they report to their own regulators.",
    worksWith: "Deployed $42M last year across 60 organizations.",
    requirements: [
      { label: "3 years of audited financials", met: false },
      { label: "Minimum $1M in annual revenue", met: true },
      { label: "Collateral or a loan-loss reserve", met: false },
    ],
  },
  {
    id: "cascade",
    name: "Cascade Grants Collaborative",
    type: "grant",
    fit: 79,
    min: 25000,
    max: 100000,
    dilutive: false,
    timeline: "Rolling, decisions in 6 weeks",
    focusArea: "general operating support",
    terms: [
      "No equity, no repayment",
      "Light quarterly check-in",
      "Funds can cover general operating",
    ],
    gain:
      "Cascade pools money from six smaller family foundations that do not have the staff to find organizations on their own. They gain a vetted pipeline, you gain access to six funders through one relationship.",
    worksWith: "Distributes to 30 organizations a year on behalf of its member foundations.",
    requirements: [
      { label: "501(c)(3) status", met: true },
      { label: "Operating budget under $2M", met: true },
      { label: "No more than 2 active grants from member foundations", met: true },
    ],
  },
  {
    id: "fielding",
    name: "Fielding Bros. Corporate Giving",
    type: "corporate",
    fit: 68,
    min: 50000,
    max: 200000,
    dilutive: false,
    timeline: "Ongoing, no fixed deadline",
    focusArea: "volunteer-supported programming",
    terms: [
      "Cash grant plus employee volunteer hours",
      "1-year term",
      "Optional co-marketing",
    ],
    gain:
      "Fielding Bros. is trying to give its employees something real to volunteer for, not just a check to write. Organizations that can absorb volunteer hours, not only money, are what they are short on.",
    worksWith: "Runs 12 active partnerships, half added in the last year.",
    requirements: [
      { label: "Structured volunteer program in place", met: false },
      { label: "Local presence near a Fielding Bros. office", met: true },
      { label: "Co-marketing approval process", met: true },
    ],
  },
  {
    id: "thornwood",
    name: "Thornwood Capital",
    type: "equity",
    fit: 55,
    min: 2000000,
    max: 5000000,
    dilutive: true,
    timeline: "12+ month process, next intake Q2 2027",
    focusArea: "market expansion",
    terms: [
      "15 to 20% equity stake",
      "Board seat required",
      "Standard liquidation preference",
    ],
    gain:
      "Thornwood is a newer fund still building its reputation with limited partners. A visible, well-governed investment gives them a reference story for their next round of fundraising.",
    worksWith: "First fund, 3 investments closed to date.",
    requirements: [
      { label: "$5M+ trailing revenue", met: false },
      { label: "Willing to take a board seat", met: true },
      { label: "Clear path to a next funding round", met: false },
    ],
  },
  {
    id: "unionsquare",
    name: "Union Square Community Fund",
    type: "grant",
    fit: 85,
    min: 75000,
    max: 250000,
    dilutive: false,
    timeline: "Applications due quarterly",
    focusArea: "neighborhood programming",
    terms: [
      "No equity, no repayment",
      "Annual report only",
      "Multi-year renewal possible",
    ],
    gain:
      "Union Square has to show its local donors that money raised locally stays local. An organization with deep roots in the community is worth more to their story than a larger one from outside the region.",
    worksWith: "Funds 22 local organizations, renews about 70% each year.",
    requirements: [
      { label: "Physical presence in the funding region", met: true },
      { label: "501(c)(3) status or fiscal sponsor", met: true },
      { label: "Local board or advisory representation", met: true },
    ],
  },
  {
    id: "harborview",
    name: "Harborview Lending Cooperative",
    type: "loan",
    fit: 90,
    min: 150000,
    max: 500000,
    dilutive: false,
    timeline: "Rolling, funds in 3 weeks",
    focusArea: "facilities and equipment",
    terms: [
      "3-year term",
      "5.75% fixed rate",
      "Member-owned, profits returned to borrowers",
    ],
    gain:
      "Harborview is a lending cooperative owned by the organizations it lends to. Every loan that performs well strengthens the cooperative for every other member, including you, going forward.",
    worksWith: "148 member organizations, average loan size $310K.",
    requirements: [
      { label: "Member-eligible organization type", met: true },
      { label: "3-year operating history", met: true },
      { label: "No outstanding liens on equipment", met: true },
    ],
  },
  {
    id: "kestrelvine",
    name: "Kestrel and Vine Ventures",
    type: "equity",
    fit: 60,
    min: 1000000,
    max: 4000000,
    dilutive: true,
    timeline: "Next partner meeting: January 2027",
    focusArea: "product and delivery scaling",
    terms: [
      "10 to 15% equity stake",
      "Quarterly reporting",
      "Pro rata rights on future rounds",
    ],
    gain:
      "Kestrel and Vine is trying to diversify a portfolio that is currently concentrated in one sector. An organization like yours fills a gap they have to close before their next investor update.",
    worksWith: "9 active portfolio organizations across 4 sectors.",
    requirements: [
      { label: "Recurring revenue model", met: false },
      { label: "Willing to share quarterly reporting", met: true },
      { label: "Existing institutional investor on the cap table", met: false },
    ],
  },
  {
    id: "willowmere",
    name: "Willowmere Foundation",
    type: "grant",
    fit: 77,
    min: 200000,
    max: 600000,
    dilutive: false,
    timeline: "Letters of intent due March 2027",
    focusArea: "multi-year program delivery",
    terms: [
      "No equity, no repayment",
      "3-year reporting cycle",
      "Site visit required before award",
    ],
    gain:
      "Willowmere's trustees renew the foundation's charter every 5 years based on demonstrated impact. A well-documented, multi-year partnership is exactly the kind of evidence they need going into that renewal.",
    worksWith: "Awards to 10 organizations per cycle, average grant $340K.",
    requirements: [
      { label: "Multi-year program plan documented", met: true },
      { label: "Site-visit readiness", met: false },
      { label: "501(c)(3) status", met: true },
    ],
  },
  {
    id: "granitestate",
    name: "Granite State Corporate Partners",
    type: "corporate",
    fit: 83,
    min: 300000,
    max: 800000,
    dilutive: false,
    timeline: "Budget approved through June 2027",
    focusArea: "community health initiatives",
    terms: [
      "Cash plus product donation",
      "2-year agreement",
      "Executive sponsor assigned",
    ],
    gain:
      "Granite State ties a portion of executive compensation to community investment outcomes. They need partners who can show clear, attributable results, not just goodwill, to justify that spend internally.",
    worksWith: "6 active partnerships, this would be their largest this year.",
    requirements: [
      { label: "Executive sponsor identified internally", met: false },
      { label: "Attributable outcomes reporting capacity", met: true },
      { label: "Multi-year commitment capacity", met: true },
    ],
  },
];

function unmetRequirements(o) {
  return (o.requirements || []).filter((r) => !r.met);
}

/* Shared cross-page state (org profile, prefs, tracked drafts, favorites,
   dismissed opportunities, settings) so the constellation, the CHELCIE
   workspace, and the Research Portfolio page all read/write the same
   thing instead of resetting on navigation. A single JSON blob, merged
   on write so one page never clobbers a field only another page owns. */
const STORE_KEY = "cc12.store";

function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "null") || {};
  } catch {
    return {};
  }
}

function saveStore(patch) {
  const next = { ...loadStore(), ...patch };
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    /* ignore (private mode, quota, etc.) */
  }
  return next;
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const TYPE_LABEL = {
  loan: "Loan",
  grant: "Grant",
  corporate: "Corporate",
  equity: "Equity",
};

function fmtMoney(n) {
  if (n >= 1000000) {
    const m = n / 1000000;
    return "$" + (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + "M";
  }
  return "$" + Math.round(n / 1000) + "K";
}

function amountRange(o) {
  return fmtMoney(o.min) + " to " + fmtMoney(o.max);
}

function isRolling(o) {
  return /rolling|ongoing|year.round/i.test(o.timeline);
}

/* Filters: hard show/hide, live toggles. Returns true if opp should show. */
function passesFilters(o, filters) {
  if (filters.hideDilutive && o.dilutive) return false;
  if (filters.under500k && o.max > 500000) return false;
  if (filters.rollingOnly && !isRolling(o)) return false;
  return true;
}

/* Preferences: soft emphasis, not hide. Returns true if opp matches the
   organization's stated intake constraints. */
function matchesPreferences(o, prefs) {
  if (!prefs.wantTypes.includes(o.type)) return false;
  if (prefs.maxRange && o.min > prefs.maxRange) return false;
  return true;
}

function defaultAsk(o) {
  const range = amountRange(o);
  if (o.type === "loan") {
    return `A ${range} loan to support ${o.focusArea}, structured around a repayment timeline we can sustain alongside current revenue.`;
  }
  if (o.type === "grant") {
    return `A ${range} grant to fund the next phase of ${o.focusArea}.`;
  }
  if (o.type === "corporate") {
    return `A ${range} partnership combining funding with in-kind support for ${o.focusArea}.`;
  }
  return `${range} in growth capital to scale ${o.focusArea}.`;
}

function defaultUseOfFunds(o) {
  return `Program staff, delivery costs, and outcome tracking for ${o.focusArea} over the next 12 to 18 months.`;
}

/* Builds the inner HTML for an opportunity's detail view. Shared across all
   three layouts; each layout supplies its own surrounding chrome (slide-over,
   modal, or inline expand) and calls wireDetail() after inserting this. */
function renderDetailContent(o) {
  return `
    <div class="detail" data-opp="${o.id}">
      <p class="eyebrow">${TYPE_LABEL[o.type]} &middot; Fit ${o.fit}</p>
      <h2 class="detail-title">${o.name}</h2>
      <p class="detail-sub">${amountRange(o)} &middot; ${o.timeline}</p>

      <div class="detail-block">
        <p class="label">Terms under discussion</p>
        <ul class="terms-list">
          ${o.terms.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      </div>

      <div class="detail-block gain-block">
        <p class="label">What they gain from you</p>
        <p class="gain-text">${o.gain}</p>
        <p class="works-with">${o.worksWith}</p>
      </div>

      <div class="detail-block">
        <p class="label">Design your partnership</p>
        <p class="field-caption">This becomes a one-pager built for this opportunity specifically, not a generic pitch.</p>

        <label class="field">
          <span>Your organization</span>
          <input type="text" class="pitch-org" value="Your organization" />
        </label>

        <label class="field">
          <span>What you are asking for</span>
          <textarea class="pitch-ask" rows="3">${defaultAsk(o)}</textarea>
        </label>

        <label class="field">
          <span>How the funds will be used</span>
          <textarea class="pitch-use" rows="3">${defaultUseOfFunds(o)}</textarea>
        </label>

        <button type="button" class="btn btn-primary draft-btn">Draft with CHELCIE</button>

        <div class="draft-output" hidden></div>
      </div>
    </div>
  `;
}

/* Wires the Draft with CHELCIE simulation inside a given root element that
   already contains renderDetailContent()'s markup. */
function wireDetail(root, o) {
  const btn = root.querySelector(".draft-btn");
  const output = root.querySelector(".draft-output");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const org = root.querySelector(".pitch-org").value.trim() || "Your organization";
    const ask = root.querySelector(".pitch-ask").value.trim();
    const use = root.querySelector(".pitch-use").value.trim();

    btn.disabled = true;
    btn.textContent = "Drafting…";
    output.hidden = true;

    setTimeout(() => {
      output.innerHTML = `
        <p class="draft-label">One-pager &middot; draft</p>
        <div class="draft-doc">
          <p class="draft-doc-title">${org}</p>
          <p class="draft-doc-sub">Partnership request to ${o.name}</p>
          <p class="draft-doc-h">What we are asking</p>
          <p>${ask}</p>
          <p class="draft-doc-h">How the funds will be used</p>
          <p>${use}</p>
          <p class="draft-doc-h">Why this fits</p>
          <p>${o.gain}</p>
          <p class="draft-doc-h">Terms under discussion</p>
          <p>${o.terms.join(", ")}.</p>
        </div>
      `;
      output.hidden = false;
      btn.disabled = false;
      btn.textContent = "Regenerate";
    }, 1100);
  });
}
