"use strict";

/** Render one chip per case into bar; return a function that selects case i. */
function caseBar(bar, cases, show) {
  const chips = cases.map((c, j) => chip(c.label, false, () => select(j)));
  bar.replaceChildren(...chips);
  function select(i) {
    chips.forEach((b, j) => b.setAttribute("aria-pressed", String(i === j)));
    show(cases[i]);
  }
  return select;
}

// ---------------------------------------------------------------------------
// Weekly run: dots (charge lines) travel through drug-utilization's steps.
// ---------------------------------------------------------------------------

const SVG_NS = "http://www.w3.org/2000/svg";
const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;
const CANCELLED = Symbol("cancelled");

const CARD_W = 140;
const CARD_H = 112;
const STEP_X = 188;
const PILL_W = 140;
const PILL_H = 52;
const SOURCE_Y = 14;
const OUTPUT_Y = 330;
const LINES = 9;
const KEPT = 4;
const WIDE_GAP = 24;

const cardTop = (i) => (i % 2 ? 136 : 116);
const tray = (i) => ({ x: CARD_W / 2 + i * STEP_X, y: cardTop(i) + 72 });

const FLOW_SOURCES = {
  epic: { title: "Epic charges", sub: "every week", color: "blue", x: 70, on: 1, d: "M70 40V188" },
  formulary: { title: "Formulary lists", sub: "every week", color: "green", x: 446, on: 4, d: "M446 40C446 120 610 70 625 208" },
  crosswalk: { title: "CMS crosswalk", sub: "every quarter", color: "amber", x: 634, on: 4, d: "M634 40V208" },
  addendum: { title: "CMS Addendum B", sub: "every quarter", color: "violet", x: 822, on: 4, d: "M822 40C822 120 660 70 643 208" },
  groups: { title: "Location groups", sub: "by department", color: "teal", x: 1010, on: 5, d: "M1010 40C1010 120 848 70 831 188" },
};

const FLOW_OUTPUTS = [
  { title: "Group workbooks", sub: "for pharmacy", color: "green", x: 446, d: "M1010 208C1010 330 446 240 446 356" },
  { title: "Executive summary", sub: "for managers", color: "blue", x: 634, d: "M1010 208C1010 320 634 250 634 356" },
  { title: "Run summary", sub: "every check", color: "violet", x: 822, d: "M1010 208C1010 300 822 270 822 356" },
  { title: "NDC reports", sub: "for item data", color: "pink", x: 1010, d: "M1010 208V356" },
];

// Two ways out of Sort: drug lines above, supply lines below.
const SORT_LANES = ["M822 170C880 130 950 150 1010 190", "M822 206C880 244 950 244 1010 226"];

function svgEl(tag, attrs = {}, ...kids) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  el.append(...kids);
  return el;
}

function svgText(content, x, y, className = "") {
  const t = svgEl("text", { x, y, class: className });
  t.textContent = content;
  return t;
}

/** Draw the streams, cards and pills. Returns the parts the animation drives. */
function buildFlow(svg) {
  const streams = svgEl("g");
  const shapes = svgEl("g");
  const dots = svgEl("g");
  const labels = svgEl("g");
  svg.append(streams, shapes, dots, labels);

  const stream = (d, color, on, extra = "") => {
    const path = svgEl("path", { class: `ribbon c-${color} ${extra}`, d, "data-on": on });
    streams.append(path);
    return path;
  };
  const pill = ({ title, sub, color, x }, y, on) => {
    const el = svgEl("g", { class: `pill c-${color}`, "data-on": on },
      svgEl("rect", { x: x - PILL_W / 2, y, width: PILL_W, height: PILL_H, rx: PILL_H / 2 }),
      svgText(title, x, y + 24),
      svgText(sub, x, y + 41, "sub"));
    shapes.append(el);
    return el;
  };
  const tick = (x, y, color) => {
    const el = svgEl("g", { class: `tick c-${color}` },
      svgEl("circle", { r: 10 }),
      svgEl("path", { d: "M-4.5 0l3 3 6-6.5" }));
    labels.append(svgEl("g", { transform: `translate(${x} ${y})` }, el));
    return el;
  };

  const sources = {};
  for (const [id, spec] of Object.entries(FLOW_SOURCES)) {
    sources[id] = { color: spec.color, path: stream(spec.d, spec.color, spec.on) };
    pill(spec, SOURCE_Y, spec.on);
  }

  const links = FLOW_STEPS.slice(0, 4).map((_, i) => {
    const [a, b] = [tray(i), tray(i + 1)];
    const bend = STEP_X / 2;
    const d = `M${a.x} ${a.y}C${a.x + bend} ${a.y} ${b.x - bend} ${b.y} ${b.x} ${b.y}`;
    return stream(d, FLOW_STEPS[i + 1].color, i + 2, "wide");
  });
  const lanes = SORT_LANES.map((d) => stream(d, "pink", 6, "wide"));

  stream(`M70 188V${OUTPUT_Y + PILL_H / 2}`, "coral", 1, "stop");
  pill({ title: "Run stops", sub: "nothing changes", color: "coral", x: 70 }, OUTPUT_Y, 1);
  labels.append(svgEl("g", { class: "c-coral" }, svgText("wrong files?", 84, 284, "stop-label")));

  const outputs = FLOW_OUTPUTS.map((spec) => ({
    x: spec.x,
    color: spec.color,
    path: stream(spec.d, spec.color, 6),
    el: pill(spec, OUTPUT_Y, 6),
    tick: tick(spec.x + PILL_W / 2 - 8, OUTPUT_Y, spec.color),
  }));

  const ticks = FLOW_STEPS.map((step, i) => {
    const x = i * STEP_X;
    const top = cardTop(i);
    const { x: cx, y: cy } = tray(i);
    shapes.append(svgEl("g", { class: `card c-${step.color}`, "data-on": i + 1, "data-step": i + 1 },
      svgEl("rect", { x, y: top, width: CARD_W, height: CARD_H, rx: 24 }),
      svgEl("path", { class: "icon", d: step.icon, transform: `translate(${cx - 18} ${cy - 18}) scale(1.5)` })));
    labels.append(
      svgText(step.title, cx, top + 34, "card-title"),
      svgEl("g", { class: `badge c-${step.color}` },
        svgEl("circle", { cx: x + 24, cy: top + 26, r: 12 }),
        svgText(String(i + 1), x + 24, top + 31)));
    return tick(x + CARD_W - 12, top + 12, step.color);
  });

  return { layer: dots, sources, links, lanes, outputs, ticks };
}

// The animation clock. Bumping `run` cancels whatever is playing.
let run = 0;
// Reduced motion: no autoplay and steps jump, until the visitor presses Play.
let pace = REDUCED_MOTION ? 0 : 1;

function timed(dur, delay, apply) {
  const id = run;
  return new Promise((resolve, reject) => {
    const start = performance.now() + delay;
    const frame = (now) => {
      if (id !== run) return reject(CANCELLED);
      const t = dur > 0 ? Math.min(Math.max((now - start) / dur, 0), 1) : 1;
      apply(t);
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

const tween = (dur, delay, apply) => timed(dur * pace, delay * pace, apply);
const wait = (ms) => timed(ms, 0, () => {});
const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (2 - 2 * t) ** 3 / 2);

function drawDot(dot) {
  dot.g.setAttribute("transform", `translate(${dot.x} ${dot.y}) scale(${dot.s})`);
}

function makeDot(layer, x, y, color, { r = 6, enriched = false, paper = false } = {}) {
  const g = svgEl("g", { class: `dot c-${color}${enriched ? " enriched" : ""}` });
  if (paper) {
    g.append(svgEl("rect", { class: "core", x: -8, y: -10, width: 16, height: 20, rx: 4 }));
  } else {
    // A ring in the three reference colors shows once a line is enriched.
    ["green", "amber", "violet"].forEach((c, i) => g.append(svgEl("circle", {
      class: `arc c-${c}`, r: 9.5, pathLength: 3, "stroke-dasharray": "1 2", "stroke-dashoffset": -i,
    })));
    g.append(svgEl("circle", { class: "core", r }));
  }
  layer.append(g);
  const dot = { g, x, y, s: 1, color };
  drawDot(dot);
  return dot;
}

function recolor(dot, color) {
  dot.g.classList.replace(`c-${dot.color}`, `c-${color}`);
  dot.color = color;
}

/** Centered grid of n positions around a tray. */
function slots(center, n, gap = 15) {
  const cols = n <= KEPT ? 2 : 3;
  const rows = Math.ceil(n / cols);
  return Array.from({ length: n }, (_, i) => ({
    x: center.x + (i % cols - (cols - 1) / 2) * gap,
    y: center.y + (Math.floor(i / cols) - (rows - 1) / 2) * gap,
  }));
}

/** Follow a stream to a position. The dots bunch up on the stream and spread out at each end. */
function fly(dot, path, to, { delay = 0, dur = 1100, grow = false, shrink = false } = {}) {
  const length = path.getTotalLength();
  const first = path.getPointAtLength(0);
  const last = path.getPointAtLength(length);
  const from = { x: dot.x - first.x, y: dot.y - first.y };
  const off = { x: to.x - last.x, y: to.y - last.y };
  if (grow) {
    dot.s = 0;
    drawDot(dot);
  }
  return tween(dur, delay, (t) => {
    const e = ease(t);
    const p = path.getPointAtLength(e * length);
    dot.x = p.x + from.x * (1 - e) ** 2 + off.x * e ** 2;
    dot.y = p.y + from.y * (1 - e) ** 2 + off.y * e ** 2;
    dot.s = Math.min(1, grow ? t * 6 : 1, shrink ? (1 - t) * 6 : 1);
    drawDot(dot);
  });
}

function flock(dots, path, targets, { stagger = 70, delay = 0, ...rest } = {}) {
  return Promise.all(dots.map((d, i) => fly(d, path, targets[i], { delay: delay + i * stagger, ...rest })));
}

function slide(dot, to, { dur = 360, scale = dot.s } = {}) {
  const { x, y, s } = dot;
  const { x: tx, y: ty } = to;
  return tween(dur, 0, (t) => {
    const e = ease(t);
    dot.x = x + (tx - x) * e;
    dot.y = y + (ty - y) * e;
    dot.s = s + (scale - s) * e;
    drawDot(dot);
  });
}

function bump(el) {
  if (!pace) return;
  el.animate([{ transform: "scale(1)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }], { duration: 320, easing: "ease-out" });
}

function setupPipeline() {
  const svg = document.getElementById("flow-svg");
  const figure = svg.closest("figure");
  const scroller = svg.parentElement;
  const bar = document.getElementById("flow-steps");
  const play = document.getElementById("flow-play");
  const caption = document.getElementById("flow-caption");
  const title = document.getElementById("flow-title");
  const text = document.getElementById("flow-text");
  const { layer, sources, links, lanes, outputs, ticks } = buildFlow(svg);
  const lit = svg.querySelectorAll("[data-on]");
  const card = (i) => svg.querySelector(`[data-step="${i + 1}"]`);
  const last = FLOW_STEPS.length - 1;

  const spawn = (x, y, color, opts) => makeDot(layer, x, y, color, opts);
  const lineDots = (center, n, gap, opts) => slots(center, n, gap).map(({ x, y }) => spawn(x, y, "blue", opts));
  const atStreamHead = (path, n, color, opts) => {
    const { x, y } = path.getPointAtLength(0);
    return Array.from({ length: n }, () => spawn(x, y, color, opts));
  };
  // Small drops run down a source's stream and vanish into the card.
  const drip = (id, cardIndex) => {
    const { path, color } = sources[id];
    const drops = atStreamHead(path, 3, color, { r: 4 });
    return flock(drops, path, drops.map(() => tray(cardIndex)), { delay: 250, stagger: 170, dur: 1150, grow: true, shrink: true });
  };
  const sortedSlots = () => {
    const c = tray(4);
    return [
      { x: c.x - 25, y: c.y - 13 },
      { x: c.x, y: c.y - 13 },
      { x: c.x + 25, y: c.y - 13 },
      { x: c.x, y: c.y + 14 },
    ];
  };

  async function cancelPair(a, b) {
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    await Promise.all([slide(a, mid, { scale: 0.6 }), slide(b, mid, { scale: 0.6 })]);
    a.g.remove();
    b.g.remove();
    const ring = svgEl("circle", { class: "burst c-coral", cx: mid.x, cy: mid.y });
    layer.append(ring);
    await tween(380, 0, (t) => {
      ring.setAttribute("r", 3 + t * 15);
      ring.style.opacity = 1 - t;
    });
    ring.remove();
  }

  // One function per step. Each starts from where the step before left the dots, so
  // any step can play on its own.
  const STEPS = [
    async function check() {
      layer.replaceChildren();
      const { path } = sources.epic;
      await flock(atStreamHead(path, LINES, "blue"), path, slots(tray(0), LINES), { grow: true });
    },
    async function load() {
      layer.replaceChildren();
      await flock(lineDots(tray(0), LINES), links[0], slots(tray(1), LINES));
    },
    async function clean() {
      layer.replaceChildren();
      const dots = lineDots(tray(1), LINES);
      await flock(dots, links[1], slots(tray(2), LINES));
      await wait(250);
      const pairs = [[dots[1], dots[2]], [dots[6], dots[7]]];
      const early = dots[5];
      pairs.flat().forEach((d) => recolor(d, "coral"));
      recolor(early, "slate");
      await wait(400);
      await Promise.all([
        ...pairs.map(([a, b]) => cancelPair(a, b)),
        slide(early, { x: early.x, y: early.y + 28 }, { dur: 520, scale: 0 }),
      ]);
      const at = slots(tray(2), KEPT, WIDE_GAP);
      await Promise.all([dots[0], dots[3], dots[4], dots[8]].map((d, i) => slide(d, at[i])));
    },
    async function enrich() {
      layer.replaceChildren();
      const dots = lineDots(tray(2), KEPT, WIDE_GAP);
      await Promise.all([
        flock(dots, links[2], slots(tray(3), KEPT, WIDE_GAP), { stagger: 110 }),
        drip("formulary", 3),
        drip("crosswalk", 3),
        drip("addendum", 3),
      ]);
      bump(card(3));
      dots.forEach((d) => d.g.classList.add("enriched"));
      await wait(500);
    },
    async function sort() {
      layer.replaceChildren();
      const dots = lineDots(tray(3), KEPT, WIDE_GAP, { enriched: true });
      await Promise.all([
        flock(dots, links[3], slots(tray(4), KEPT, WIDE_GAP), { stagger: 110 }),
        drip("groups", 4),
      ]);
      dots.forEach((d, i) => recolor(d, i < 3 ? "teal" : "slate"));
      const at = sortedSlots();
      await Promise.all(dots.map((d, i) => slide(d, at[i], { dur: 420 })));
    },
    async function deliver() {
      layer.replaceChildren();
      const dots = sortedSlots().map(({ x, y }, i) => spawn(x, y, i < 3 ? "teal" : "slate", { enriched: true }));
      const at = slots(tray(5), KEPT, WIDE_GAP);
      await Promise.all([
        flock(dots.slice(0, 3), lanes[0], at, { stagger: 110 }),
        fly(dots[3], lanes[1], at[3], { delay: 110 }),
      ]);
      bump(card(5));
      await wait(250);
      const { x, y } = tray(5);
      const papers = outputs.map((o) => spawn(x, y, o.color, { paper: true }));
      // One duration for every distance: the finished folder arrives whole.
      await Promise.all([
        ...papers.map((p, k) => fly(p, outputs[k].path, { x: outputs[k].x, y: OUTPUT_Y + PILL_H / 2 }, { dur: 1300, grow: true, shrink: true })),
        ...dots.map((d) => slide(d, d, { dur: 400, scale: 0 })),
      ]);
      for (const o of outputs) {
        o.el.classList.add("done");
        o.tick.classList.add("done");
        bump(o.el);
      }
    },
  ];

  let current = 0;
  let wanted = !REDUCED_MOTION;
  let visible = false;
  let looping = false;

  const select = caseBar(bar, FLOW_STEPS, (step) => {
    current = FLOW_STEPS.indexOf(step);
    const n = String(current + 1);
    for (const el of lit) el.classList.toggle("on", el.dataset.on === n);
    ticks.forEach((t, j) => t.classList.toggle("done", j < current));
    for (const o of outputs) {
      o.el.classList.remove("done");
      o.tick.classList.remove("done");
    }
    title.textContent = step.heading;
    text.textContent = step.text;
    caption.className = `flow-caption c-${step.color}`;
    if (pace) caption.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], 320);
    // On a narrow screen the diagram scrolls sideways: bring the step to the middle.
    const box = scroller.getBoundingClientRect();
    const node = card(current).getBoundingClientRect();
    scroller.scrollLeft += node.left + node.width / 2 - (box.left + box.width / 2);
  });
  [...bar.children].forEach((c, j) => c.classList.add(`c-${FLOW_STEPS[j].color}`));

  async function playStep(i) {
    select(i);
    await STEPS[i]();
    ticks[i].classList.add("done");
  }

  async function ignoreCancel(work) {
    try {
      await work();
    } catch (error) {
      if (error !== CANCELLED) throw error;
    }
  }

  function halt() {
    run += 1;
    looping = false;
  }

  function loop() {
    halt();
    looping = true;
    return ignoreCancel(async () => {
      for (let i = current; ; i = i === last ? 0 : i + 1) {
        await playStep(i);
        await wait(i === last ? 2600 : 500);
      }
    });
  }

  // Plays while wanted and on screen; a screen reader hears steps only when they are chosen.
  function sync() {
    play.textContent = wanted ? "Pause" : "Play";
    caption.setAttribute("aria-live", wanted ? "off" : "polite");
    if (wanted && visible && !looping) loop();
    else if (!(wanted && visible) && looping) halt();
  }

  // A step chosen by hand takes over from the player.
  function takeOver(i) {
    wanted = false;
    halt();
    sync();
    ignoreCancel(() => playStep(i));
  }

  play.addEventListener("click", () => {
    pace = 1;
    wanted = !wanted;
    sync();
  });
  bar.addEventListener("click", (event) => {
    if (event.target.closest(".chip")) takeOver(current);
  });
  svg.addEventListener("click", (event) => {
    const stage = event.target.closest("[data-step]");
    if (stage) takeOver(Number(stage.dataset.step) - 1);
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { threshold: 0.25 }).observe(figure);

  select(0);
  sync();
  if (REDUCED_MOTION) ignoreCancel(() => playStep(0));
}

// ---------------------------------------------------------------------------
// Work explorer.
// ---------------------------------------------------------------------------

function chip(label, pressed, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.textContent = label;
  b.setAttribute("aria-pressed", String(pressed));
  b.addEventListener("click", onClick);
  return b;
}

function setupExplorer() {
  const state = { area: "all", source: "all", text: "" };
  const areaBar = document.getElementById("area-filter");
  const sourceSelect = document.getElementById("source-filter");
  const search = document.getElementById("work-search");
  const grid = document.getElementById("work-grid");
  const count = document.getElementById("work-count");

  for (const [key, label] of Object.entries(SOURCES)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = label;
    sourceSelect.append(option);
  }

  function renderAreas() {
    const all = chip("All", state.area === "all", () => { state.area = "all"; render(); });
    const rest = Object.entries(AREAS).map(([key, label]) =>
      chip(label, state.area === key, () => { state.area = key; render(); }));
    areaBar.replaceChildren(all, ...rest);
  }

  function card(p) {
    const article = document.createElement("article");
    article.className = "work-card";
    const kind = document.createElement("span");
    kind.className = `kind kind-${p.kind}`;
    kind.textContent = KINDS[p.kind];
    const title = document.createElement("h3");
    title.textContent = p.name;
    const what = document.createElement("p");
    what.textContent = p.what;
    const areas = document.createElement("p");
    areas.className = "work-areas";
    areas.textContent = p.areas.map((a) => AREAS[a]).join(" · ");
    const sources = document.createElement("ul");
    sources.className = "work-sources";
    sources.setAttribute("aria-label", "Reads");
    for (const s of p.sources) {
      const li = document.createElement("li");
      li.textContent = SOURCES[s];
      sources.append(li);
    }
    article.append(kind, title, what, sources, areas);
    return article;
  }

  function render() {
    renderAreas();
    const text = state.text.trim().toLowerCase();
    const shown = PROJECTS.filter((p) =>
      (state.area === "all" || p.areas.includes(state.area)) &&
      (state.source === "all" || p.sources.includes(state.source)) &&
      (text === "" || `${p.name} ${p.what}`.toLowerCase().includes(text)));
    grid.replaceChildren(...shown.map(card));
    if (shown.length === 0) {
      const empty = document.createElement("p");
      empty.className = "work-empty";
      empty.textContent = "No matches.";
      grid.append(empty);
    }
    count.textContent = `Showing ${shown.length} of ${PROJECTS.length} tools`;
  }

  sourceSelect.addEventListener("change", () => { state.source = sourceSelect.value; render(); });
  search.addEventListener("input", () => { state.text = search.value; render(); });
  render();
}

function setupExtracts() {
  const list = document.getElementById("extract-list");
  list.replaceChildren(...EXTRACTS.map(({ group, items }) => {
    const block = document.createElement("div");
    block.className = "extract-group";
    const h = document.createElement("h3");
    h.textContent = group;
    const ul = document.createElement("ul");
    for (const [name, format] of items) {
      const li = document.createElement("li");
      const n = document.createElement("span");
      n.textContent = name;
      li.append(n);
      if (format) {
        const f = document.createElement("span");
        f.className = "fmt";
        f.textContent = format;
        li.append(f);
      }
      ul.append(li);
    }
    block.append(h, ul);
    return block;
  }));
}

setupPipeline();
setupExplorer();
setupExtracts();
