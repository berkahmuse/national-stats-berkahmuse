// Nippon Numbers — page renderers (hash routes).
// Each view returns HTML and registers its charts + controls with main.js.

import * as D from "./data.js";
import { lineChart, dualLine, barChart, groupedBars, pyramid } from "./charts.js";

function kpiCard(k) {
  return `<article class="kpi">
    <div class="kpi-label">${k.label}</div>
    <div class="kpi-value">${k.value}</div>
    <div class="kpi-detail">${k.detail}</div>
    <div class="kpi-source">${k.source}</div>
  </article>`;
}

function sourceNote(text) {
  return `<p class="src">Source: ${text}</p>`;
}

function sectionHead(title, sub) {
  return `<div class="section-head"><h2>${title}</h2><p>${sub}</p></div>`;
}

// ---------- Home ----------

export function viewHome(register) {
  const peak = D.POP_PEAK;
  const html = `
  <section class="hero">
    <p class="eyebrow">Japan · Official statistics, 1970–2024</p>
    <h1>Japan is shrinking —<br>and getting older, fast.</h1>
    <p class="lede">Population peaked at ${peak.total} million in ${peak.year} and has fallen every year since.
    One in three residents is now over 65. Nippon Numbers gathers the country's official figures —
    population, births, work and the economy — in one place, each with its source and year.</p>
    <div class="hero-links">
      <a class="btn" href="#/population">Explore the population →</a>
      <a class="btn ghost" href="#/sources">See all sources</a>
    </div>
  </section>

  <section class="card">
    ${sectionHead("Fifty years of population", "Pick a measure, then narrow the years. Hover any point for its value.")}
    <div class="controls" role="group" aria-label="Chart measure">
      <button class="chip active" data-metric="total">Total population</button>
      <button class="chip" data-metric="elderly">Share aged 65+</button>
      <button class="chip" data-metric="children">Share aged 0–14</button>
      <label class="range-label">Years
        <select id="home-range">
          <option value="0">All (1970–2024)</option>
          <option value="1990">1990 onwards</option>
          <option value="2000">2000 onwards</option>
        </select>
      </label>
    </div>
    <div class="chart-wrap"><canvas id="home-chart" height="300" aria-label="Population trend chart"></canvas></div>
    <p class="chart-caption" id="home-caption"></p>
    ${sourceNote("Statistics Bureau of Japan, Population Census &amp; Population Estimates.")}
  </section>

  <section class="kpis" aria-label="Key indicators">${D.KPI.map(kpiCard).join("")}</section>

  <section class="split">
    <article class="card">
      <h2>Three numbers that explain Japan</h2>
      <ol class="numbered">
        <li><strong>128.08m → 124.09m.</strong> Population fell by 4 million from its 2008 peak to 2024 — and the fall is speeding up: 2024 alone lost about 0.6 million people.</li>
        <li><strong>721,000 births, 1,605,000 deaths.</strong> In 2024 deaths outnumbered births more than two to one. The natural decrease was about 884,000 people.</li>
        <li><strong>1.15 children per woman.</strong> The 2024 fertility rate is the lowest on record. At this rate each generation is roughly half the size of its parents'.</li>
      </ol>
    </article>
    <article class="card">
      <h2>What to look at next</h2>
      <ul class="linklist">
        <li><a href="#/population">Population &amp; ageing →</a><span>The 2024 age pyramid, the 1990 vs 2024 shift, and the biggest prefectures.</span></li>
        <li><a href="#/births">Births, deaths &amp; fertility →</a><span>Births vs deaths since 2010, the fertility slide, and life expectancy.</span></li>
        <li><a href="#/work">Work &amp; jobs →</a><span>Unemployment, foreign workers, and who is in the labour force.</span></li>
        <li><a href="#/economy">Economy &amp; prices →</a><span>GDP, growth, inflation, debt and trade.</span></li>
      </ul>
    </article>
  </section>`;

  register(() => {
    const canvas = document.getElementById("home-chart");
    const caption = document.getElementById("home-caption");
    if (!canvas) return;
    const series = {
      total: { points: D.POP_TREND.map((p) => ({ x: p.year, y: p.total })), unit: "m", decimals: 2, caption: "Total population, millions. Peak: 128.08m in 2008; 124.09m in 2024." },
      elderly: { points: D.ELDERLY_SHARE.map((p) => ({ x: p.year, y: p.value })), unit: "%", decimals: 1, caption: "Share of the population aged 65 and over. 7.1% in 1970 → 29.2% in 2024." },
      children: { points: D.CHILD_SHARE.map((p) => ({ x: p.year, y: p.value })), unit: "%", decimals: 1, caption: "Share of the population aged 0–14. 23.9% in 1970 → 11.3% in 2024." },
    };
    let metric = "total";
    const draw = () => {
      const from = Number(document.getElementById("home-range").value);
      const s = series[metric];
      const pts = s.points.filter((p) => p.x >= from);
      lineChart(canvas, pts, { unit: s.unit, decimals: s.decimals, color: metric === "total" ? "#bf3b2b" : "#33507e" });
      caption.textContent = s.caption;
    };
    document.querySelectorAll("[data-metric]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-metric]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        metric = btn.dataset.metric;
        draw();
      });
    });
    document.getElementById("home-range").addEventListener("change", draw);
    draw();
  });
  return html;
}

// ---------- Population ----------

export function viewPopulation(register) {
  const rows = D.PREFECTURES.map(
    (p) => `<tr><td>${p.name}</td><td class="num">${p.value.toFixed(2)}</td></tr>`,
  ).join("");
  const html = `
  <section class="page-head">
    <p class="eyebrow">Population</p>
    <h1>An older, smaller Japan</h1>
    <p class="lede">The age pyramid tells the story at a glance: the widest bands are now 70–74, not 20–24.
    Below it, the same country in 1990 and 2024 — children halved as a share, the elderly more than doubled.</p>
  </section>

  <section class="card">
    ${sectionHead("The 2024 age pyramid", "Population by 5-year age band, millions. Red bands are 65 and over.")}
    <div class="chart-wrap tall"><canvas id="pyr-chart" height="520" aria-label="Age pyramid 2024"></canvas></div>
    ${sourceNote("Statistics Bureau of Japan, Population Estimates, 1 Oct 2024 (bands rounded to the nearest 0.1m).")}
  </section>

  <section class="card">
    ${sectionHead("1990 vs 2024: the great shift", "Millions of people in each age group.")}
    <div class="chart-wrap"><canvas id="age-chart" height="300" aria-label="Age structure 1990 versus 2024"></canvas></div>
    ${sourceNote("Statistics Bureau of Japan, Population Census 1990 and Population Estimates 2024.")}
  </section>

  <section class="card">
    ${sectionHead("Where people live", "Largest prefectures, 1 Oct 2024. Click a column heading to sort.")}
    <table class="data" id="pref-table">
      <thead><tr><th data-sort="name">Prefecture ↕</th><th data-sort="value" class="num">Population (millions) ↕</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${sourceNote("Statistics Bureau of Japan, Population Estimates 2024. Tokyo alone holds 11.4% of the country.")}
  </section>

  <section class="card">
    <h2>Reading the pyramid</h2>
    <p>The two bulges are the baby booms: the 70–74 band (born 1947–49, right after the war) and the
    45–49 band (born 1971–74, their children). Below them every band is narrower than the one above it —
    that is what a fertility rate of 1.15 looks like. The 65+ group, 36.25 million people, now outnumbers
    children (14.02 million) by more than two and a half to one.</p>
  </section>`;

  register(() => {
    const pyr = document.getElementById("pyr-chart");
    if (pyr) pyramid(pyr, D.PYRAMID_2024);
    const age = document.getElementById("age-chart");
    if (age) {
      groupedBars(
        age,
        D.AGE_STRUCTURE[1990].map((g, i) => ({ label: g.group, a: g.value, b: D.AGE_STRUCTURE[2024][i].value })),
        { unit: "m", labelA: "1990", labelB: "2024" },
      );
    }
    const table = document.getElementById("pref-table");
    if (table) {
      let dir = 1;
      let key = "value";
      const sortRows = (k) => {
        if (k === key) dir = -dir;
        else {
          key = k;
          dir = k === "value" ? -1 : 1;
        }
        const data = [...D.PREFECTURES].sort((a, b) =>
          k === "value" ? dir * (a.value - b.value) : dir * a.name.localeCompare(b.name),
        );
        table.querySelector("tbody").innerHTML = data
          .map((p) => `<tr><td>${p.name}</td><td class="num">${p.value.toFixed(2)}</td></tr>`)
          .join("");
      };
      table.querySelectorAll("th[data-sort]").forEach((th) => {
        th.addEventListener("click", () => sortRows(th.dataset.sort));
        th.style.cursor = "pointer";
      });
      sortRows("value"); // first call toggles dir to -1: largest first
      dir = -1;
    }
  });
  return html;
}

// ---------- Births ----------

export function viewBirths(register) {
  const html = `
  <section class="page-head">
    <p class="eyebrow">Births, deaths &amp; fertility</p>
    <h1>Fewer births, more deaths — every year</h1>
    <p class="lede">Births have fallen in 15 of the last 16 years while deaths keep rising. The gap between
    the two lines is the natural decrease: 884,000 people in 2024 alone.</p>
  </section>

  <section class="card">
    ${sectionHead("Births vs deaths", "Thousands per year. The lines crossed in 2007 and have widened ever since.")}
    <div class="chart-wrap"><canvas id="bd-chart" height="300" aria-label="Births versus deaths chart"></canvas></div>
    ${sourceNote("Ministry of Health, Labour and Welfare, Vital Statistics 2010–2024.")}
  </section>

  <section class="split">
    <article class="card">
      ${sectionHead("Fertility keeps sliding", "Children per woman. Replacement level is 2.07.")}
      <div class="chart-wrap"><canvas id="tfr-chart" height="260" aria-label="Fertility rate chart"></canvas></div>
      ${sourceNote("Ministry of Health, Labour and Welfare, Vital Statistics.")}
    </article>
    <article class="card">
      <h2>Life is long — and getting longer to live alone</h2>
      <dl class="facts">
        <div><dt>Life expectancy, women (2023)</dt><dd>${D.LIFE_EXPECTANCY.women} years</dd></div>
        <div><dt>Life expectancy, men (2023)</dt><dd>${D.LIFE_EXPECTANCY.men} years</dd></div>
        <div><dt>Marriages (2024)</dt><dd>499,999 — first year below 500,000</dd></div>
        <div><dt>Births (2024)</dt><dd>720,988 — the lowest since records began in 1899</dd></div>
        <div><dt>Deaths (2024)</dt><dd>1,605,298 — the highest on record</dd></div>
      </dl>
      ${sourceNote(D.LIFE_EXPECTANCY.source + "; MHLW, Vital Statistics 2024.")}
    </article>
  </section>`;

  register(() => {
    const bd = document.getElementById("bd-chart");
    if (bd) {
      dualLine(
        bd,
        D.BIRTHS_DEATHS.map((p) => ({ x: p.year, y: p.births })),
        D.BIRTHS_DEATHS.map((p) => ({ x: p.year, y: p.deaths })),
        { unit: "k", labelA: "Births", labelB: "Deaths", yMin: 600 },
      );
    }
    const tfr = document.getElementById("tfr-chart");
    if (tfr) {
      lineChart(
        tfr,
        D.TFR.map((p) => ({ x: p.year, y: p.value })),
        { unit: "", decimals: 2, color: "#bf3b2b", yMin: 1.0 },
      );
    }
  });
  return html;
}

// ---------- Work ----------

export function viewWork(register) {
  const m = D.MIGRATION.map(
    (x) => `<div class="fact-row"><span>${x.label}</span><strong>${x.value}</strong><span class="muted">${x.detail}</span><span class="muted">${x.source}</span></div>`,
  ).join("");
  const html = `
  <section class="page-head">
    <p class="eyebrow">Work &amp; jobs</p>
    <h1>Almost everyone who wants a job has one</h1>
    <p class="lede">Unemployment has sat near 2.5% for years, and employers report 1.25 openings per applicant.
    The labour force still grows — because more women and older people work, and because foreign workers arrive in record numbers.</p>
  </section>

  <section class="kpis" aria-label="Labour indicators">
    <article class="kpi"><div class="kpi-label">Labour force, 2024</div><div class="kpi-value">${D.LABOUR.labourForce}m</div><div class="kpi-detail">People aged 15+ in work or looking</div><div class="kpi-source">Labour Force Survey 2024</div></article>
    <article class="kpi"><div class="kpi-label">Employed, 2024</div><div class="kpi-value">${D.LABOUR.employed}m</div><div class="kpi-detail">Up 0.42m on 2023</div><div class="kpi-source">Labour Force Survey 2024</div></article>
    <article class="kpi"><div class="kpi-label">Unemployed, 2024</div><div class="kpi-value">${D.LABOUR.unemployed}m</div><div class="kpi-detail">Unemployment rate ${D.LABOUR.unemploymentRate}%</div><div class="kpi-source">Labour Force Survey 2024</div></article>
  </section>

  <section class="card">
    ${sectionHead("Unemployment, 2019–2024", "Percent, annual average. The pandemic spike faded within two years.")}
    <div class="chart-wrap"><canvas id="unemp-chart" height="280" aria-label="Unemployment rate chart"></canvas></div>
    ${sourceNote("Statistics Bureau of Japan, Labour Force Survey.")}
  </section>

  <section class="card">
    ${sectionHead("Who fills the gaps", "Migration and the tight jobs market.")}
    <div class="fact-list">${m}</div>
    <p>With the working-age population shrinking by roughly 0.6 million a year, employers have turned to
    three sources: women returning to work, people working past 65, and foreign workers — 2.30 million of
    them by October 2024, the most ever recorded.</p>
  </section>`;

  register(() => {
    const c = document.getElementById("unemp-chart");
    if (c) {
      lineChart(
        c,
        D.LABOUR.unemploymentSeries.map((p) => ({ x: p.year, y: p.value })),
        { unit: "%", decimals: 1, color: "#2e7d6b", yMin: 2.0 },
      );
    }
  });
  return html;
}

// ---------- Economy ----------

export function viewEconomy(register) {
  const e = D.ECONOMY;
  const tradeBalance = (e.exports2024 - e.imports2024).toFixed(1);
  const html = `
  <section class="page-head">
    <p class="eyebrow">Economy &amp; prices</p>
    <h1>The world's 4th-largest economy, still growing slowly</h1>
    <p class="lede">Nominal GDP passed ¥600 trillion for the first time in 2024, but real growth was
    slightly negative. Inflation, absent for decades, is back — and so is the debate about the
    world's heaviest public debt load.</p>
  </section>

  <section class="kpis" aria-label="Economy indicators">
    <article class="kpi"><div class="kpi-label">Nominal GDP, 2024</div><div class="kpi-value">¥${e.gdpNominalYen}tn</div><div class="kpi-detail">$${e.gdpNominalUsd}tn — ranked #${e.gdpRank} in the world</div><div class="kpi-source">Cabinet Office; IMF WEO Oct 2025</div></article>
    <article class="kpi"><div class="kpi-label">GDP per person, 2024</div><div class="kpi-value">$${e.gdpPerCapitaUsd}k</div><div class="kpi-detail">About half the US level</div><div class="kpi-source">IMF, World Economic Outlook</div></article>
    <article class="kpi"><div class="kpi-label">Consumer prices, 2024</div><div class="kpi-value">+${e.cpi2024}%</div><div class="kpi-detail">All items, annual average</div><div class="kpi-source">Statistics Bureau, CPI 2024</div></article>
    <article class="kpi"><div class="kpi-label">Government debt, 2024</div><div class="kpi-value">${e.govDebt}%</div><div class="kpi-detail">Of GDP, the highest among major economies</div><div class="kpi-source">IMF, World Economic Outlook</div></article>
  </section>

  <section class="card">
    ${sectionHead("Real GDP growth", "Percent change on the previous year. 2020 is the pandemic crash.")}
    <div class="chart-wrap"><canvas id="gdp-chart" height="280" aria-label="Real GDP growth chart"></canvas></div>
    ${sourceNote("Cabinet Office, National Accounts (SNA), calendar years.")}
  </section>

  <section class="card">
    ${sectionHead("Trade in 2024", "Goods, trillion yen.")}
    <table class="data">
      <tbody>
        <tr><td>Exports</td><td class="num">¥${e.exports2024.toFixed(1)}tn</td></tr>
        <tr><td>Imports</td><td class="num">¥${e.imports2024.toFixed(1)}tn</td></tr>
        <tr><td><strong>Balance</strong></td><td class="num"><strong>¥${tradeBalance}tn (deficit)</strong></td></tr>
      </tbody>
    </table>
    ${sourceNote("Ministry of Finance, Trade Statistics of Japan 2024.")}
    <p>Japan has run a goods trade deficit every year since 2021, as a weaker yen raised import costs —
    above all for the energy Japan must buy abroad.</p>
  </section>`;

  register(() => {
    const c = document.getElementById("gdp-chart");
    if (c) {
      barChart(
        c,
        e.realGrowth.map((p) => ({ x: p.year, y: p.value })),
        { unit: "%", decimals: 1 },
      );
    }
  });
  return html;
}

// ---------- Sources ----------

export function viewSources(register) {
  const rows = D.SOURCES.map(
    (s) => `<tr><td>${s.dataset}</td><td>${s.publisher}</td><td>${s.year}</td><td>${s.usedFor}</td></tr>`,
  ).join("");
  const html = `
  <section class="page-head">
    <p class="eyebrow">Sources &amp; methods</p>
    <h1>Every figure, sourced</h1>
    <p class="lede">Nippon Numbers republishes nothing without naming where it came from. Type in the box
    to filter the list — try “labour”, “IMF” or “2024”.</p>
  </section>

  <section class="card">
    <div class="controls">
      <label class="filter-label">Filter datasets
        <input id="src-filter" type="search" placeholder="e.g. labour" autocomplete="off">
      </label>
      <span class="count" id="src-count">${D.SOURCES.length} datasets</span>
    </div>
    <div class="table-scroll">
      <table class="data" id="src-table">
        <thead><tr><th>Dataset</th><th>Publisher</th><th>Year</th><th>Used for</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </section>

  <section class="card">
    <h2>Methods &amp; notes</h2>
    <ul class="notes">
      <li>Population figures are for 1 October each year (Statistics Bureau estimates); census years use the census count.</li>
      <li>Age-band figures for the 2024 pyramid are rounded to the nearest 0.1 million; bands sum to 123.7m against the 124.09m total because of rounding.</li>
      <li>Births, deaths and fertility are from the final Vital Statistics, except 2024, which uses the preliminary release.</li>
      <li>GDP in dollars and government debt are IMF World Economic Outlook figures (October 2025); GDP in yen and real growth are Cabinet Office national accounts.</li>
      <li>Nothing on this site is fetched from the internet: every number lives in the site's own files, and the site works with no network connection.</li>
      <li>Land area 377,975 km² (Geospatial Information Authority of Japan); population density 328 people per km² in 2024; 47 prefectures; capital Tokyo.</li>
    </ul>
  </section>`;

  register(() => {
    const input = document.getElementById("src-filter");
    const table = document.getElementById("src-table");
    const count = document.getElementById("src-count");
    if (!input || !table) return;
    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      table.querySelectorAll("tbody tr").forEach((tr) => {
        const hit = !q || tr.textContent.toLowerCase().includes(q);
        tr.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      count.textContent = `${shown} of ${D.SOURCES.length} datasets`;
    };
    input.addEventListener("input", apply);
  });
  return html;
}
