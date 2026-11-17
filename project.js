// One tool's page, drawn from PAGES (pages.js) and PROJECTS (data.js).
// project.html?p=<slug> is the pitch; project.html?p=<slug>&how is how it works.
"use strict";

const RAIL_COLORS = ["blue", "indigo", "coral", "amber", "green", "teal", "violet", "pink", "slate"];

const head = (eyebrow, h, lede = "") =>
  `<div class="section-head"><p class="eyebrow">${eyebrow}</p><h2>${h}</h2>${lede ? `<p class="lede">${lede}</p>` : ""}</div>`;

const list = (items, attrs = "") => `<ul${attrs}>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

/** Tiles are [color, heading, text, ledger]; the ledger is optional. */
const tiles = (items) => `<div class="tiles">${items.map(([color, h, text, ledger]) =>
  `<div class="tile c-${color}"><h3>${h}</h3>${ledger ? `<pre class="ledger">${ledger}</pre>` : ""}<p>${text}</p></div>`).join("")}</div>`;

/**
 * A few rows of made-up data with a bracket naming what they are.
 * rows: [left, right, tone]; groups: [firstRow, lastRow, label, sub, tone, struck].
 * Tones are given, waste and plain. Keep left plus right under 24 characters.
 */
function rowsFigure({ rows, groups = [], alt }) {
  const top = (i) => 20 + i * 50;
  const body = rows.map(([left, right, tone], i) => `
    <rect x="10" y="${top(i)}" width="230" height="40" rx="8" fill="var(--${tone}-wash)"/>
    <text class="mono" font-size="14" x="24" y="${top(i) + 25}">${left}</text>
    <text class="mono" font-size="14" x="226" y="${top(i) + 25}" text-anchor="end">${right}</text>`);
  const marks = groups.map(([first, last, label, sub, tone, struck]) => {
    const a = top(first) + 4;
    const b = top(last) + 36;
    const strikes = struck ? rows.slice(first, last + 1).map((_, i) => ` M18 ${top(first + i) + 20} H232`).join("") : "";
    return `
    <path class="ln" stroke-width="1.5" d="M250 ${a} H262 V${b} H250${strikes}"/>
    <text class="lab" x="276" y="${(a + b) / 2 - 2}" style="fill:var(--${tone})">${label}</text>
    <text font-size="15" x="276" y="${(a + b) / 2 + 18}">${sub}</text>`;
  });
  return `<svg viewBox="0 0 440 ${top(rows.length)}" role="img" aria-label="${alt}">${body.join("")}${marks.join("")}</svg>`;
}

const figure = (fig) =>
  `<figure class="fig">${fig.svg || rowsFigure(fig)}${fig.caption ? `<figcaption>${fig.caption}</figcaption>` : ""}</figure>`;

/** A headed list of points, beside its figure when it has one. */
function pictured(eyebrow, { h, fig, points }) {
  const text = head(eyebrow, h) + list(points, ' class="points"');
  return fig
    ? `<section><div class="wrap pair">${figure(fig)}<div>${text}</div></div></section>`
    : `<section><div class="wrap">${text}</div></section>`;
}

const closing = (h, href, label) => `
  <section><div class="wrap contact-box">
    <p class="eyebrow">Next step</p>
    <h2>${h}</h2>
    <ul class="contact-links">
      <li><a class="button primary" href="index.html#contact">Engagement inquiries</a></li>
      <li><a class="button" href="${href}">${label}</a></li>
    </ul>
  </div></section>`;

function pitchPage(project, { h1, lede, gap, finds, gets, cta }, here) {
  return `
  <section class="hero"><div class="wrap">
    <p class="eyebrow">${AREAS[project.areas[0]]} · ${project.name}</p>
    <h1>${h1}</h1>
    <p class="lede">${lede}</p>
    <div class="hero-actions">
      <a class="button primary" href="index.html#contact">Engagement inquiries</a>
      <a class="button" href="${here}&how">How it works</a>
    </div>
  </div></section>
  ${pictured("The gap", gap)}
  <section><div class="wrap">${head("What it finds", finds.h)}${tiles(finds.tiles)}</div></section>
  <section><div class="wrap about">
    <div><p class="eyebrow">What you get</p><h2>${gets.h}</h2>${list(gets.items, ' style="margin-top:16px"')}</div>
    <div><h3 style="margin-bottom:12px">Reads</h3>${list(project.sources.map((s) => SOURCES[s]), ' class="work-sources"')}</div>
  </div></section>
  ${closing(cta, `${here}&how`, "How it works")}`;
}

function howPage(project, { h1, lede, rule, path, example, outcomes, limits }, cta, here) {
  return `
  <section class="hero"><div class="wrap">
    <p class="eyebrow"><a href="${here}">${project.name}</a> · How it works</p>
    <h1>${h1}</h1>
    <p class="lede">${lede} Every figure on this page is a made-up example.</p>
  </div></section>
  ${pictured("The rule", rule)}
  <section><div class="wrap">${head("The path", path.h)}
    <ol class="rail">${path.steps.map(([h, text], i) =>
      `<li class="c-${RAIL_COLORS[i % RAIL_COLORS.length]}"><div><h3>${h}</h3><p>${text}</p></div></li>`).join("")}</ol>
  </div></section>
  <section><div class="wrap">${head("Worked example", example.h, example.lede)}${tiles(example.tiles)}</div></section>
  <section><div class="wrap">${head("The outcomes", outcomes.h)}${tiles(outcomes.tiles)}</div></section>
  <section><div class="wrap about">
    <div><p class="eyebrow">Limits</p><h2>What it will not tell you</h2></div>
    ${list(limits)}
  </div></section>
  ${closing(cta, here, project.name)}`;
}

function render() {
  const params = new URLSearchParams(location.search);
  const slug = params.get("p");
  const project = PROJECTS.find((p) => p.slug === slug);
  const page = PAGES[slug];
  const main = document.querySelector("main");
  if (!project || !page) {
    main.innerHTML = `<section class="hero"><div class="wrap"><h1>Page not found.</h1>
      <p class="lede"><a href="portfolio.html">See the portfolio</a></p></div></section>`;
    return;
  }
  const here = `project.html?p=${slug}`;
  const how = params.has("how");
  document.title = `${how ? `How ${project.name} works` : project.name} · Pharmagistics`;
  main.innerHTML = how ? howPage(project, page.how, page.pitch.cta, here) : pitchPage(project, page.pitch, here);
}

render();
