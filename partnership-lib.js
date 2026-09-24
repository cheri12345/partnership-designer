/* Corporate Partnership Designer — ported from Amy's C-CHANGE demo
   (src/lib/pathway/partnership.ts + PartnershipDesigner.tsx). Deterministic
   keyword-driven synthesizer: given a plain-English study/program
   description, surfaces corporate business units with a strategic reason to
   fund it (not the grant desk), an entry vehicle, check size, decision
   maker, and a draft VP-level outreach email. No AI dependency needed. */

const SAMPLE_STUDIES = [
  {
    label: "COPD trial · indoor air",
    text: "A 400-patient randomized trial testing whether HEPA air purifiers in the homes of COPD patients reduce exacerbations, ER visits, and 12-month mortality. Cohort recruited across three Boston-area primary care networks.",
  },
  {
    label: "Wildfire smoke · pediatric asthma",
    text: "A three-year prospective cohort in Northern California measuring the impact of wildfire smoke exposure on pediatric asthma control. N95 respirator distribution arm compared to standard-of-care.",
  },
  {
    label: "Extreme heat · urban housing",
    text: "A neighborhood-scale intervention deploying passive cooling retrofits in low-income multifamily housing across Phoenix and Miami. Primary endpoints: heat-related ED visits and all-cause mortality during heat waves.",
  },
  {
    label: "School ventilation · respiratory outcomes",
    text: "A cluster-randomized trial across 60 public schools evaluating whether upgraded HVAC and continuous CO2/PM monitoring reduce respiratory illness absenteeism.",
  },
];

const SPONSORS = [
  {
    themes: ["copd", "asthma", "indoor air", "air quality", "particulate", "pm2.5", "purifier", "wildfire smoke"],
    entry: {
      company: "Dyson",
      business_unit: "Dyson Institute + Global Comms (indoor air science)",
      strategic_hook: "Dyson has been building a public narrative around indoor air science for five years. A peer-reviewed trial that uses their purification tech is the credibility asset their marketing team can't buy.",
      entry_vehicle: "In-kind hardware plus an unrestricted research gift via Global Comms, not the foundation. Bypasses the grant queue entirely.",
      check_size: "$150K to $400K cash plus full hardware fleet",
      decision_maker: { role: "VP, Global Communications & Sustainability", name_hint: "Route through Dyson US comms, not the UK charity arm" },
      why_them: "They fund what proves the product category. Your trial is that proof.",
      sources: [
        { label: "Dyson newsroom, indoor air science", url: "https://www.dyson.com/newsroom" },
        { label: "James Dyson Foundation", url: "https://www.jamesdysonfoundation.com/" },
      ],
    },
  },
  {
    themes: ["copd", "asthma", "indoor air", "air quality", "particulate", "pm2.5", "purifier"],
    entry: {
      company: "IQAir",
      business_unit: "Foundation + N.A. Medical Partnerships",
      strategic_hook: "IQAir already partners with academic medical centers on real-world evidence. A trial from a research center like yours elevates them above every consumer competitor.",
      entry_vehicle: "Research partnership agreement with device provisioning, plus a foundation grant on top for the community deployment arm.",
      check_size: "$75K to $200K per cohort",
      decision_maker: { role: "Director of Medical Partnerships, N.A.", name_hint: "A warm intro through a co-investigator at another academic medical center helps" },
      why_them: "Every trial with their name attached is a distribution moat against consumer competitors.",
      sources: [
        { label: "IQAir Foundation", url: "https://www.iqair.com/us/newsroom/iqair-foundation" },
        { label: "IQAir healthcare partnerships", url: "https://www.iqair.com/us/commercial-air-quality-solutions/healthcare" },
      ],
    },
  },
  {
    themes: ["hvac", "building", "school", "ventilation", "heat", "urban", "cooling", "housing", "extreme heat", "heatwave"],
    entry: {
      company: "Trane Technologies",
      business_unit: "Center for Healthy & Efficient Spaces",
      strategic_hook: "Trane's Center exists to prove ventilation and heat-resilience ROI to school districts and hospital systems. Your data lets their sales team walk in with a peer-reviewed slide.",
      entry_vehicle: "Sponsored research agreement through the Center, not corporate giving. Faster contract cycle and a larger check.",
      check_size: "$250K to $750K",
      decision_maker: { role: "VP, Center for Healthy & Efficient Spaces", name_hint: "Direct outreach, leadership is publicly named" },
      why_them: "This is a business unit with a research budget, not a charity. They're actively looking for academic partners.",
      sources: [
        { label: "Trane, Center for Healthy & Efficient Spaces", url: "https://www.tranetechnologies.com/en/index/company/center-for-healthy-and-efficient-spaces.html" },
        { label: "Trane Technologies sustainability", url: "https://www.tranetechnologies.com/en/index/sustainability.html" },
      ],
    },
  },
  {
    themes: ["copd", "asthma", "respiratory", "inhaler", "lung", "pediatric"],
    entry: {
      company: "AstraZeneca",
      business_unit: "Respiratory & Immunology BioPharmaceuticals + Sustainability",
      strategic_hook: "AZ is under investor pressure to prove its climate-health strategy is more than an ESG report. A trial tying air quality to their disease area is on-strategy for two divisions at once.",
      entry_vehicle: "Investigator-Sponsored Study through Medical Affairs, a separate budget line from the foundation, no RFP required.",
      check_size: "$300K to $1.2M",
      decision_maker: { role: "US Medical Director, Respiratory", name_hint: "Approach with a one-page concept, not a full protocol" },
      why_them: "Medical Affairs has budget authority and moves fast when the science aligns.",
      sources: [
        { label: "AstraZeneca, Externally Sponsored Research", url: "https://openinnovation.astrazeneca.com/preclinical-research/externally-sponsored-research.html" },
        { label: "AZ Respiratory & Immunology", url: "https://www.astrazeneca.com/our-therapy-areas/respiratory-and-immunology.html" },
      ],
    },
  },
  {
    themes: ["wildfire", "smoke", "ppe", "n95", "mask", "occupational"],
    entry: {
      company: "3M",
      business_unit: "Personal Safety Division + 3Mgives",
      strategic_hook: "3M's Personal Safety budget funds wildfire-response research to protect their occupational-health customer base. Your trial informs their next-gen filter spec.",
      entry_vehicle: "Sponsored research through Personal Safety R&D, plus a parallel 3Mgives community grant for the deployment arm.",
      check_size: "$200K to $600K",
      decision_maker: { role: "Global Application Engineering Director, Respiratory Protection", name_hint: "Enter through R&D, then loop in 3Mgives" },
      why_them: "Their business unit needs your data. That's a much stronger position than asking a foundation for a favor.",
      sources: [
        { label: "3M Personal Safety, Respiratory Protection", url: "https://www.3m.com/3M/en_US/p/c/ppe/respiratory-protection/" },
        { label: "3Mgives", url: "https://www.3m.com/3M/en_US/gives-us/" },
      ],
    },
  },
  {
    themes: ["heat", "urban", "housing", "climate justice", "vulnerable populations"],
    entry: {
      company: "Google.org",
      business_unit: "Climate & Crisis Response + Google Public Sector",
      strategic_hook: "Google.org's climate portfolio is explicitly looking for population-level heat-health projects with a data-science component.",
      entry_vehicle: "Google.org Impact Challenge, plus pro-bono Google Fellows engineering time.",
      check_size: "$500K to $3M cash plus engineering fellows",
      decision_maker: { role: "Director, Google.org Climate", name_hint: "Application cycles are publicly announced; a warm intro helps a lot" },
      why_them: "They want to fund the study that becomes the map layer.",
      sources: [
        { label: "Google.org, Climate crisis", url: "https://www.google.org/our-work/climate-crisis/" },
        { label: "Google.org Impact Challenge (climate)", url: "https://impactchallenge.withgoogle.com/climate/" },
      ],
    },
  },
  {
    themes: ["digital", "wearable", "sensor", "data", "ai", "machine learning", "cohort", "app"],
    entry: {
      company: "Apple",
      business_unit: "Health Team + Apple Investigator Support Program",
      strategic_hook: "Apple's Health team funds studies that use Apple Watch or iPhone sensor data. A cohort like yours is on-strategy and under-represented in their current portfolio.",
      entry_vehicle: "Apple Investigator Support Program: device provisioning plus technical support, applied for directly, not through a foundation.",
      check_size: "Device fleet plus technical support, worth $200K or more; some studies receive direct funding",
      decision_maker: { role: "Health Team Research Partnerships Lead", name_hint: "Direct outreach to Apple Health research partnerships" },
      why_them: "They want peer-reviewed publications with their hardware in the methods section.",
      sources: [
        { label: "Apple Investigator Support Program", url: "https://investigatorsupport.apple.com/" },
      ],
    },
  },
  {
    themes: ["community", "clinic", "primary care", "health system", "medicaid"],
    entry: {
      company: "Kaiser Permanente",
      business_unit: "Community Health + Institute for Health Policy",
      strategic_hook: "Kaiser's Community Health arm actively funds climate-health work in their service areas. A partnership with a research center brings scientific rigor their internal team can't replicate.",
      entry_vehicle: "Community Health Investment RFP, plus an Institute for Health Policy co-authored brief.",
      check_size: "$250K to $1M",
      decision_maker: { role: "VP, Community Health Investments", name_hint: "Regional VPs have discretion; the national portfolio reviews quarterly" },
      why_them: "They're both funder and health system, so the partnership pays off twice.",
      sources: [
        { label: "Kaiser Permanente, Community Health", url: "https://about.kaiserpermanente.org/community-health" },
      ],
    },
  },
];

const ALL_KEYWORDS = Array.from(new Set(SPONSORS.flatMap((s) => s.themes))).sort((a, b) => b.length - a.length);

function extractThemes(input) {
  const norm = ` ${input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ")} `;
  const hits = new Set();
  for (const kw of ALL_KEYWORDS) {
    if (norm.includes(` ${kw} `) || norm.includes(kw)) hits.add(kw);
  }
  return [...hits];
}

function draftVPEmail(top, studySummary, orgName) {
  const org = orgName || "your organization";
  const subject = `${org} × ${top.company}: a partnership hook for ${top.business_unit.split("+")[0].trim()}`;
  const body = [
    `Hi [First Name],`,
    ``,
    `I lead partnerships for ${org}. I'm writing directly rather than through the foundation queue because I don't think this is a grant conversation, I think it's a business-unit conversation.`,
    ``,
    `Here's the work: ${studySummary}`,
    ``,
    `Why ${top.company}, and specifically ${top.business_unit}: ${top.strategic_hook}`,
    ``,
    `What I'd propose isn't a grant application. It's a ${top.entry_vehicle.toLowerCase()} A typical structure at this stage is ${top.check_size.toLowerCase()}, and the value to your team is a peer-reviewed result your comms and sales orgs can point to for years.`,
    ``,
    `Would a 20-minute call in the next two weeks make sense? I can bring one slide showing exactly how this reads for your team.`,
    ``,
    `Thank you,`,
    `[Your name]`,
    org,
  ].join("\n");
  return { subject, body };
}

function designPartnership(input) {
  const trimmed = input.trim();
  const themes = extractThemes(trimmed);

  const scored = SPONSORS.map((rule) => ({
    rule,
    score: rule.themes.filter((t) => themes.includes(t)).length,
  }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set();
  const targets = [];
  for (const s of scored) {
    if (seen.has(s.rule.entry.company)) continue;
    seen.add(s.rule.entry.company);
    targets.push(s.rule.entry);
    if (targets.length >= 4) break;
  }

  if (targets.length === 0) {
    for (const rule of SPONSORS.slice(0, 3)) {
      if (seen.has(rule.entry.company)) continue;
      seen.add(rule.entry.company);
      targets.push(rule.entry);
    }
  }

  const summary = trimmed.length > 240 ? `${trimmed.slice(0, 237)}...` : trimmed || "your program";
  const top = targets[0];

  return {
    study_summary: summary,
    themes,
    targets,
    vp_email: draftVPEmail(top, summary),
  };
}

function vpEmailFor(design, target, orgName) {
  return draftVPEmail(target, design.study_summary, orgName);
}
