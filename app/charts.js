// Nippon Numbers — canvas chart helpers (no library, hand-rolled).
// Every chart draws on a <canvas> and shows values on hover; all charts
// resize with their container and redraw on window resize.

const INK = "#1c2b45";
const MUTED = "#5c6b84";
const GRID = "#e3ddd0";
const RED = "#bf3b2b";
const TEAL = "#2e7d6b";
const GOLD = "#c9a227";
const NAVY = "#33507e";

// Fit a canvas to its CSS size (crisp on retina) and return its 2d context.
export function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(50, Math.round(rect.width));
  const h = Math.max(50, Math.round(rect.height));
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return m * p;
}

function niceMin(v) {
  if (v >= 0) return 0;
  const p = Math.pow(10, Math.floor(Math.log10(-v)));
  const n = -v / p;
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return -m * p;
}

function drawAxes(ctx, pad, w, h, yMin, yMax, yLabel) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = yMin + ((yMax - yMin) * i) / steps;
    const y = pad.t + ((h - pad.t - pad.b) * (1 - (v - yMin) / (yMax - yMin)));
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(w - pad.r, y);
    ctx.stroke();
    ctx.fillText(yLabel(v), pad.l - 8, y);
  }
}

// Line chart with dots, value labels on hover, and a baseline note.
// points: [{x: label, y: number}], opts: {unit, decimals, color, fill}
export function lineChart(canvas, points, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { t: 14, r: 12, b: 26, l: 52 };
  const color = opts.color || RED;
  const ys = points.map((p) => p.y);
  const yMin = opts.yMin !== undefined ? opts.yMin : niceMin(Math.min(...ys));
  const yMax = niceMax(Math.max(...ys));
  const fmt = (v) =>
    opts.decimals ? v.toFixed(opts.decimals) : String(Math.round(v * 10) / 10);
  const yLabel = (v) => fmt(v) + (opts.unit || "");
  const xAt = (i) => pad.l + ((w - pad.l - pad.r) * i) / (points.length - 1);
  const yAt = (v) => pad.t + ((h - pad.t - pad.b) * (1 - (v - yMin) / (yMax - yMin)));

  drawAxes(ctx, pad, w, h, yMin, yMax, yLabel);

  // Area fill under the line.
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(xAt(i), yAt(p.y)) : ctx.lineTo(xAt(i), yAt(p.y))));
  ctx.lineTo(xAt(points.length - 1), h - pad.b);
  ctx.lineTo(xAt(0), h - pad.b);
  ctx.closePath();
  ctx.fillStyle = color + "1f";
  ctx.fill();

  // Line + dots.
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(xAt(i), yAt(p.y)) : ctx.lineTo(xAt(i), yAt(p.y))));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.fillStyle = color;
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(xAt(i), yAt(p.y), 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // X labels (every other one when crowded).
  ctx.fillStyle = MUTED;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const step = points.length > 8 ? 2 : 1;
  points.forEach((p, i) => {
    if (i % step === 0) ctx.fillText(String(p.x), xAt(i), h - pad.b + 8);
  });

  attachTooltip(canvas, points, xAt, (p) => `${p.x}: ${fmt(p.y)}${opts.unit || ""}`);
}

// Two series on one line chart, with a legend. Both series share the x labels.
// a, b: [{x, y}]. opts: {unit, decimals, labelA, labelB}
export function dualLine(canvas, a, b, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { t: 26, r: 12, b: 26, l: 52 };
  const ys = [...a.map((p) => p.y), ...b.map((p) => p.y)];
  const yMin = opts.yMin !== undefined ? opts.yMin : niceMin(Math.min(...ys));
  const yMax = niceMax(Math.max(...ys));
  const fmt = (v) => (opts.decimals ? v.toFixed(opts.decimals) : String(Math.round(v * 10) / 10));
  drawAxes(ctx, pad, w, h, yMin, yMax, (v) => fmt(v) + (opts.unit || ""));
  const xAt = (i) => pad.l + ((w - pad.l - pad.r) * i) / (a.length - 1);
  const yAt = (v) => pad.t + ((h - pad.t - pad.b) * (1 - (v - yMin) / (yMax - yMin)));
  const draw = (series, color) => {
    ctx.beginPath();
    series.forEach((p, i) => (i === 0 ? ctx.moveTo(xAt(i), yAt(p.y)) : ctx.lineTo(xAt(i), yAt(p.y))));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.fillStyle = color;
    series.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(p.y), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  draw(a, opts.colorA || TEAL);
  draw(b, opts.colorB || RED);
  ctx.fillStyle = MUTED;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  a.forEach((p, i) => ctx.fillText(String(p.x), xAt(i), h - pad.b + 8));
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  let lx = pad.l;
  [
    [opts.colorA || TEAL, opts.labelA || "A"],
    [opts.colorB || RED, opts.labelB || "B"],
  ].forEach(([c, t]) => {
    ctx.fillStyle = c;
    ctx.fillRect(lx, 8, 12, 12);
    ctx.fillStyle = INK;
    ctx.fillText(t, lx + 17, 14);
    lx += 17 + ctx.measureText(t).width + 22;
  });
  attachTooltip(canvas, a, xAt, (p, i) => {
    const j = a.findIndex((q) => q.x === p.x);
    return `${p.x}: ${opts.labelA || "A"} ${fmt(a[j].y)}${opts.unit || ""}, ${opts.labelB || "B"} ${fmt(b[j].y)}${opts.unit || ""}`;
  });
}

// Single-series vertical bars with a zero baseline (handles negatives).
// points: [{x, y}]. opts: {unit, decimals}
export function barChart(canvas, points, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { t: 14, r: 12, b: 26, l: 52 };
  const ys = points.map((p) => p.y);
  const yMin = niceMin(Math.min(0, ...ys));
  const yMax = niceMax(Math.max(0, ...ys));
  const fmt = (v) => (opts.decimals ? v.toFixed(opts.decimals) : String(Math.round(v * 10) / 10));
  drawAxes(ctx, pad, w, h, yMin, yMax, (v) => fmt(v) + (opts.unit || ""));
  const slot = (w - pad.l - pad.r) / points.length;
  const bw = Math.min(44, slot * 0.6);
  const y0 = pad.t + ((h - pad.t - pad.b) * (1 - (0 - yMin) / (yMax - yMin)));
  const yAt = (v) => pad.t + ((h - pad.t - pad.b) * (1 - (v - yMin) / (yMax - yMin)));
  points.forEach((p, i) => {
    const cx = pad.l + slot * (i + 0.5);
    const y = yAt(p.y);
    ctx.fillStyle = p.y < 0 ? RED : TEAL;
    ctx.fillRect(cx - bw / 2, Math.min(y, y0), bw, Math.abs(y - y0));
    ctx.fillStyle = INK;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(fmt(p.y) + (opts.unit || ""), cx, Math.min(y, y0) - 4);
    ctx.fillStyle = MUTED;
    ctx.textBaseline = "top";
    ctx.fillText(String(p.x), cx, h - pad.b + 8);
  });
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.moveTo(pad.l, y0);
  ctx.lineTo(w - pad.r, y0);
  ctx.stroke();
}

// Grouped vertical bars. groups: [{label, a, b}], aLabel/bLabel for the legend.
export function groupedBars(canvas, groups, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { t: 26, r: 12, b: 26, l: 52 };
  const max = niceMax(Math.max(...groups.flatMap((g) => [g.a, g.b])));
  const yLabel = (v) => `${v}${opts.unit || ""}`;
  drawAxes(ctx, pad, w, h, 0, max, yLabel);
  const slot = (w - pad.l - pad.r) / groups.length;
  const bw = Math.min(34, slot * 0.32);
  groups.forEach((g, i) => {
    const cx = pad.l + slot * (i + 0.5);
    const bar = (v, color, dx) => {
      const bh = ((h - pad.t - pad.b) * v) / max;
      ctx.fillStyle = color;
      ctx.fillRect(cx + dx - bw / 2, h - pad.b - bh, bw, bh);
    };
    bar(g.a, opts.colorA || NAVY, -bw / 2 - 2);
    bar(g.b, opts.colorB || RED, bw / 2 + 2);
    ctx.fillStyle = INK;
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(g.label, cx, h - pad.b + 8);
  });
  // Legend.
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const legend = [
    [opts.colorA || NAVY, opts.labelA || "A"],
    [opts.colorB || RED, opts.labelB || "B"],
  ];
  let lx = pad.l;
  legend.forEach(([c, t]) => {
    ctx.fillStyle = c;
    ctx.fillRect(lx, 8, 12, 12);
    ctx.fillStyle = INK;
    ctx.fillText(t, lx + 17, 14);
    lx += 17 + ctx.measureText(t).width + 22;
  });
}

// Horizontal population pyramid (single year, one side — values are totals
// per band, drawn as bars from the left with the band label on top).
export function pyramid(canvas, bands, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { t: 10, r: 46, b: 10, l: 44 };
  const max = niceMax(Math.max(...bands.map((b) => b.value)));
  const rowH = (h - pad.t - pad.b) / bands.length;
  const barH = Math.min(14, rowH * 0.62);
  bands.forEach((b, i) => {
    const y = pad.t + rowH * i + (rowH - barH) / 2;
    const bw = ((w - pad.l - pad.r) * b.value) / max;
    const old = i >= 13; // 65 and over
    ctx.fillStyle = old ? RED : NAVY;
    ctx.fillRect(pad.l, y, bw, barH);
    ctx.fillStyle = MUTED;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(b.band, pad.l - 6, y + barH / 2);
    ctx.fillStyle = INK;
    ctx.textAlign = "left";
    ctx.fillText(`${b.value.toFixed(1)}m`, pad.l + bw + 6, y + barH / 2);
  });
  ctx.fillStyle = MUTED;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`0 – ${max}m per band`, pad.l, h - 4);
}

// Hover tooltip: shows a small box with the nearest point's label + value.
function attachTooltip(canvas, points, xAt, textFor) {
  let tip = canvas.parentElement.querySelector(".chart-tip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "chart-tip";
    tip.hidden = true;
    canvas.parentElement.style.position = "relative";
    canvas.parentElement.appendChild(tip);
  }
  const move = (ev) => {
    const rect = canvas.getBoundingClientRect();
    let best = 0;
    let bestD = Infinity;
    points.forEach((p, i) => {
      const px = xAt(i);
      const dist = Math.abs(px - (ev.clientX - rect.left));
      if (dist < bestD) {
        bestD = dist;
        best = i;
      }
    });
    tip.textContent = textFor(points[best]);
    tip.hidden = false;
    const tx = Math.min(Math.max(ev.clientX - rect.left + 12, 4), rect.width - 120);
    tip.style.left = `${tx}px`;
    tip.style.top = `${Math.max(ev.clientY - rect.top - 34, 4)}px`;
  };
  canvas.addEventListener("mousemove", move);
  canvas.addEventListener("mouseleave", () => {
    tip.hidden = true;
  });
}

// Redraw every chart in the page (called on resize, debounced by caller).
export function redrawAll(renderers) {
  renderers.forEach((fn) => {
    try {
      fn();
    } catch {
      /* a chart whose canvas is not on screen yet is skipped */
    }
  });
}
