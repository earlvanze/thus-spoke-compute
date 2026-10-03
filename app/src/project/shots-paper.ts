// PAPER: the "normal technology" world — the working paper, its charts, stamps and footnotes. Ink on bone, no glow.
// Intro (spoken prologue), the economists of verse 1, the pre-chorus, and the outro's callback.
import {
  A, CAP, F, H, W, acc, axes, base, clamp, col, ease, from, fw, hold, label, lerp, ln, lyric, measure, mix, note, prog, rule, setFont,
  slam, split, stamp, strokePts, TAU, txt, typeOn, upto, word, along, sizeTo, pulseAt, type S, type Word,
} from './common';
import { cam } from '../scenes/shots';
import { BRAND } from './brand';
import { hash } from '../engine/util';

/** Page furniture of the working paper: running head, folio, margin rule. */
function sheet(s: S, head: string, folio: string, a = 1) {
  const c = s.c;
  note(c, head, 150, 92, 0.75 * a, 18, 'graphite');
  note(c, folio, W - 150, 92, 0.75 * a, 18, 'graphite', 'right');
  rule(c, 150, 108, W - 150, 108, a, col('graphite', 0.5), 1.5);
  rule(c, 150, H - 96, W - 150, H - 96, a, col('graphite', 0.5), 1.5);
}

// ------------------------------------------------------------------ INTRO 1: the working paper's title page
function paperTitle(s: S) {
  const { t, sh } = s;
  const l = ln(s);
  hold(s, 1.0, 1.05);
  const fk = prog(t, sh.start, sh.start + 0.8, ease.outExpo);
  sheet(s, 'WORKING PAPER SERIES · NO. 01', 'p. 1', fk);
  typeOn(s, 'ABSTRACT', 150, 200, sh.start + 0.2, sh.start + 0.6, 22, 'graphite');
  // the question, set as the paper's title: serif, flush left, three rows
  const R = split(l, [3, 6]);
  const fam = F.serif(600, false);
  let y = 360;
  R.forEach((r, i) => {
    const sz = i === 2 ? 210 : 150;
    let x = 150;
    for (const w of r) {
      const isQ = /technology/i.test(w.w);
      const f = isQ ? F.serif(600, true) : fam;
      const text = isQ ? w.w.replace('?', '') : w.w;
      const wd = measure(text, f, sz);
      word(s, w, text, f, sz, x + wd / 2, y, { sc: t < w.start - 0.06 ? 1 : slam(w, t, 1.18) });
      if (/normal/i.test(w.w)) rule(s.c, x, y + sz * 0.42, x + wd, y + sz * 0.42, prog(t, w.start, w.end + 0.2, ease.outCubic), col('blood', 0.9), 5);
      x += wd + sz * 0.22;
    }
    if (i === 2) {
      // the question mark arrives late and oversized, in the margin (a referee's pencil)
      const q = r[r.length - 1]!, k = prog(t, q.end - 0.15, q.end + 0.35, ease.outBack);
      if (k > 0) label(s, '?', F.serif(600, true), 420 * k, x + 90, y - 40, col('blood', 0.95));
    }
    y += i === 1 ? 240 : 180;
  });
  // abstract body as grey ruled bars (the paper is long; nobody reads it)
  for (let i = 0; i < 4; i++) { const k = prog(t, sh.start + 0.4 + i * 0.12, sh.start + 1.2 + i * 0.12, ease.outCubic); rule(s.c, 150, 900 + i * 26, 150 + (1500 - (i === 3 ? 700 : 0)) * k, 900 + i * 26, 1, col('graphite', 0.25), 10); }
}

// ------------------------------------------------------------------ INTRO 2: three ordinary inventions, drawn in ink
function analogies(s: S) {
  const { t, sh, c } = s;
  const l = ln(s);
  hold(s, 1.02, 1.0);
  sheet(s, 'FIG. 1 — GENERAL PURPOSE TECHNOLOGIES', 'p. 2', prog(t, sh.start, sh.start + 0.5));
  const nouns = [fw(l, /electricity/i), fw(l, /spreadsheet/i), fw(l, /fax/i)];
  const mach = fw(l, /machine/i);
  const xs = [380, 960, 1540];
  const ink = col(base(s), 0.9);
  nouns.forEach((n, i) => {
    const x = xs[i]!, k = prog(t, n.start - 0.1, n.start + 0.7, ease.outCubic);
    // "like" sits small above each column
    const likes = l.words.filter((w) => /like/i.test(w.w));
    const lw = likes[i];
    if (lw) word(s, lw, 'LIKE', A(62, 300), 46, x, 250, { sc: 1 });
    // icon (drawn on the noun's onset)
    if (i === 0) { // a lightning bolt in a socket
      strokePts(c, [[x - 30, 330], [x + 40, 330], [x - 10, 450], [x + 50, 450], [x - 40, 600], [x - 5, 480], [x - 60, 480], [x - 30, 330]], k, ink, 6);
      c.strokeStyle = ink; c.lineWidth = 4; if (k > 0.6) { c.beginPath(); c.arc(x, 470, 150, 0, TAU * prog(k, 0.6, 1)); c.stroke(); }
    } else if (i === 1) { // a spreadsheet: cells fill row by row
      const gx = x - 170, gy = 340;
      for (let r = 0; r <= 6; r++) rule(c, gx, gy + r * 40, gx + 340, gy + r * 40, k, col(base(s), 0.6), 2);
      for (let q = 0; q <= 5; q++) rule(c, gx + q * 68, gy, gx + q * 68, gy + 240, k, col(base(s), 0.6), 2);
      setFont(c, F.mono(500), 20); c.textAlign = 'right';
      for (let r = 0; r < 6; r++) for (let q = 0; q < 5; q++) {
        const kk = prog(t, n.start + (r * 5 + q) * 0.025, n.start + (r * 5 + q) * 0.025 + 0.1);
        if (kk > 0) { c.fillStyle = col(r === 5 ? 'blood' : base(s), 0.8 * kk); c.fillText(r === 5 ? 'Σ' : String(Math.floor(hash(r, q) * 900 + 100)), gx + q * 68 + 62, gy + r * 40 + 28); }
      }
    } else { // a fax: the machine, and a sheet curling out of it on "machine"
      const fk = prog(t, mach.start, mach.end + 0.6, ease.outCubic);
      c.strokeStyle = ink; c.lineWidth = 5;
      if (k > 0) { c.strokeRect(x - 170 * k, 500, 340 * k, 110); c.strokeRect(x - 120 * k, 470, 240 * k, 30); }
      if (fk > 0) {
        c.fillStyle = col('bone', 1); c.beginPath(); c.moveTo(x - 110, 480); c.lineTo(x - 110, 480 - 160 * fk); c.quadraticCurveTo(x, 480 - 200 * fk, x + 110, 480 - 160 * fk); c.lineTo(x + 110, 480); c.closePath(); c.fill(); c.stroke();
        for (let r = 0; r < 4; r++) rule(c, x - 80, 470 - (r + 1) * 30 * fk, x + 80 - r * 20, 470 - (r + 1) * 30 * fk, 1, col('graphite', 0.6), 6);
      }
    }
    // the noun, set under its figure
    const text = i === 2 ? 'FAX MACHINE' : txt(n);
    const fam = A(i === 1 ? 87 : 100, 900);
    const sz = sizeTo(text, fam, 470, 110);
    if (i === 2) {
      const w1 = measure('FAX', fam, sz), w2 = measure('MACHINE', fam, sz), gap = sz * 0.24, x0 = x - (w1 + gap + w2) / 2;
      word(s, n, 'FAX', fam, sz, x0 + w1 / 2, 760, { sc: slam(n, t, 1.3) });
      word(s, mach, 'MACHINE', fam, sz, x0 + w1 + gap + w2 / 2, 760, { sc: slam(mach, t, 1.3) });
    } else word(s, n, text, fam, sz, x, 760, { sc: slam(n, t, 1.3) });
    note(c, `(${String.fromCharCode(97 + i)}) ${['1882', '1979', '1964'][i]}`, x, 860, prog(t, n.start, n.start + 0.4), 22, 'graphite', 'center');
  });
}

// ------------------------------------------------------------------ INTRO 3: the S-curve of diffusion — then it tears upward
function scurve(s: S) {
  const { t, sh, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const cons = fw(l2, /consider/i);
  const tear = prog(t, cons.start, cons.end + 0.5, ease.inExpo);
  cam(s, { x: W / 2, y: H / 2 - 380 * tear, z: lerp(1, 1.15, prog(t, sh.start, cons.start)) * lerp(1, 0.8, tear), r: 0 });
  sheet(s, 'FIG. 2 — ADOPTION OVER TIME', 'p. 3', prog(t, sh.start, sh.start + 0.5));
  const x0 = 220, y0 = 900, w = 1480, h = 560;
  axes(s, x0, y0, w, h, prog(t, sh.start, sh.start + 0.6, ease.outExpo), 'YEARS →', 'SHARE OF ECONOMY');
  const S_ = (u: number) => 1 / (1 + Math.exp(-(u - 0.5) * 10));
  const pts: [number, number][] = []; for (let i = 0; i <= 80; i++) { const u = i / 80; pts.push([x0 + u * w, y0 - S_(u) * h * 0.85]); }
  const ws = l1.words;
  const k = prog(t, ws[0]!.start - 0.1, ws[ws.length - 1]!.end, ease.inOutQuad);
  strokePts(c, pts, k, col(base(s), 0.95), 6);
  // words ride the curve, each sitting where the pen was when it was said
  const szs = ws.map((w) => (/complementary|investment|diffusion|adoption/i.test(w.w) ? 56 : 48));
  const wds = ws.map((w, i) => measure(txt(w).replace(/[,.]$/, ''), A(87, 800), szs[i]!) + 40);
  const tot = wds.reduce((a, b) => a + b, 0);
  let acc0 = 0;
  ws.forEach((wo, i) => {
    const u = 0.03 + 0.94 * (acc0 + wds[i]! / 2) / tot; acc0 += wds[i]!;
    const yC = y0 - S_(u) * h * 0.85;
    word(s, wo, txt(wo).replace(/[,.]$/, ''), A(87, 800), szs[i]!, x0 + u * w, yC - 60 - 30 * Math.sin(u * Math.PI), { rot: -0.12 * Math.sin(u * Math.PI), sc: slam(wo, t, 1.25) });
  });
  // "Okay." — a tick mark at the plateau; "But consider." — the pen keeps going: straight up, through the top of the sheet
  const ok = fw(l2, /okay/i);
  const okk = prog(t, ok.start, ok.start + 0.3, ease.outBack);
  if (okk > 0) { label(s, 'OKAY.', F.mono(600), 60 * okk, x0 + w - 60, y0 - h * 0.85 + 70, col('graphite', 1)); }
  const but = fw(l2, /but/i);
  const up = prog(t, but.start, cons.end + 1.0, ease.inQuart);
  if (up > 0) {
    const ex = x0 + w, ey = y0 - S_(1) * h * 0.85;
    const top = ey - up * 2200;
    c.strokeStyle = col('blood', 1); c.lineWidth = 8;
    c.beginPath(); c.moveTo(ex - 60, ey + 2); c.quadraticCurveTo(ex, ey, ex + 10, ey - 60); c.lineTo(ex + 22, top); c.stroke();
    // the tear in the paper follows the pen
    c.fillStyle = col('ink', clamp(up * 2)); c.beginPath(); c.moveTo(ex + 22, top); c.lineTo(ex + 22 + 30 * up, ey - 80); c.lineTo(ex + 22 + 6, ey - 60); c.closePath(); c.fill();
  }
  word(s, but, 'BUT', A(62, 300), 110, 380, 230, { sc: slam(but, t, 1.4) });
  word(s, cons, 'CONSIDER.', F.serif(600, true), 170, 960, 230, { sc: slam(cons, t, 1.4) });
  s.post.flash = 0.25 * pulseAt(t, cons.end + 0.4, 0.15);
}

// ------------------------------------------------------------------ V1: the paper calls it satisfactory (stamped)
function stampShot(s: S) {
  const { t, sh, c } = s;
  const l = ln(s);
  hold(s, 1.0, 1.04, -0.01);
  // a document card on the desk
  const fk = prog(t, sh.start, sh.start + 0.5, ease.outExpo);
  c.save(); c.translate(W / 2, H / 2 + (1 - fk) * 300); c.rotate(-0.025);
  c.fillStyle = col('bone', 1); c.strokeStyle = col('graphite', 0.6); c.lineWidth = 2;
  c.fillRect(-760, -430, 1520, 860); c.strokeRect(-760, -430, 1520, 860);
  note(c, 'REFEREE REPORT — RECOMMENDATION', -660, -360, fk, 22, 'graphite');
  for (let i = 0; i < 9; i++) rule(c, -660, 290 + (i % 3) * 30 - (i > 2 ? 900 : 0), -660 + 900 * (0.5 + 0.5 * hash(i)), 290 + (i % 3) * 30 - (i > 2 ? 900 : 0), i < 3 ? fk : 0, col('graphite', 0.25), 10);
  c.restore();
  cam(s, { x: W / 2, y: H / 2, z: 1 + 0.03 * prog(t, sh.start, sh.end), r: 0 });
  const sat = fw(l, /satisfactory/i);
  const pat = fw(l, /patient/i);
  const r1 = upto(l, /patient/i), r2 = from(l, /and/i, /satisfactory/i);
  // everything sits inside the card (x 200..1720 → margins 300..1620)
  const pw = measure('patient,', F.serif(600, true), 150);
  lyric(s, r1, 300, { x: 300 + (1320 - pw - 60) / 2, width: 1320 - pw - 60, max: 92 });
  word(s, pat, 'patient,', F.serif(600, true), 150, 1620 - pw / 2, 290, { sc: slam(pat, t, 1.2) });
  lyric(s, r2, 520, { width: 1200, max: 90 });
  // the verdict is a rubber stamp, not a word
  stamp(s, 'SATISFACTORY', W / 2, 760, sat.start, 110, -0.08, 'blood');
  if (t < sat.start - 0.03) word(s, sat, 'SATISFACTORY', F.mono(700), 110, W / 2, 760, { ghost: 0.15 });
}

// ------------------------------------------------------------------ V1: the numbers (a Nobel on the shelf, 0.7 % over ten years)
function tfp(s: S) {
  const { t, sh, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const in2 = prog(t, l2.start - 0.2, l2.start + 0.4, ease.inOutCubic);
  cam(s, { x: W / 2 + 0 * in2, y: H / 2 + 0 * in2, z: lerp(1.02, 1, in2), r: 0 });
  sheet(s, 'TABLE 3 — AGGREGATE EFFECTS', 'p. 14', prog(t, sh.start, sh.start + 0.5));
  // line 1 typed into a ledger row; the medal hangs on a shelf at the right
  const a1 = 1 - 0.75 * in2;
  lyric(s, l1.words, 210, { width: 1300, max: 92, align: 'l', alpha: a1 });
  const nob = fw(l1, /nobel/i), shelf = fw(l1, /shelf/i);
  const mk = prog(t, nob.start - 0.05, nob.start + 0.35, ease.outBack);
  const sy = 380;
  rule(c, 1380, sy + 120, 1770, sy + 120, prog(t, shelf.start - 0.1, shelf.start + 0.3, ease.outExpo), col(base(s), 0.9), 6);
  if (mk > 0) {
    c.strokeStyle = col('blood', a1); c.lineWidth = 6;
    c.beginPath(); c.moveTo(1540, sy - 100); c.lineTo(1575, sy - 10); c.lineTo(1610, sy - 100); c.stroke();
    c.fillStyle = col('blood', 0.9 * a1); c.beginPath(); c.arc(1575, sy + 40 - (1 - mk) * 40, 70 * mk, 0, TAU); c.fill();
    label(s, 'Nobel', F.serif(600, true), 34 * mk, 1575, sy + 40, col('bone', a1));
  }
  // line 2: the chart — ten years, a line that barely rises; the figure counts up to 0.7
  if (t > l2.start - 0.3) {
    const x0 = 260, y0 = 930, w = 1100, h = 380;
    axes(s, x0, y0, w, h, prog(t, l2.start - 0.3, l2.start + 0.2, ease.outExpo), '10 YEARS', 'TFP');
    const k = prog(t, l2.start, l2.end, ease.linear);
    const pts: [number, number][] = []; for (let i = 0; i <= 40; i++) pts.push([x0 + (i / 40) * w, y0 - 8 - (i / 40) * 26]);
    strokePts(c, pts, k, col('blood', 1), 7);
    const pv = fw(l2, /seven/i);
    const v = 0.7 * prog(t, pv.start - 0.1, l2.end, ease.outCubic);
    label(s, `${v.toFixed(1)}%`, A(62, 900), 300, 1580, 600, col(base(s), 1));
    note(c, 'TOTAL FACTOR PRODUCTIVITY, CUMULATIVE', 1580, 760, prog(t, pv.start, pv.start + 0.4), 20, 'graphite', 'center');
    lyric(s, l2.words, 470, { width: 1100, max: 76, x: 810, alpha: 1 });
  }
}

// ------------------------------------------------------------------ V1: the regulatory gantt chart (the words are its rows)
function gantt(s: S) {
  const { t, sh, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const ws = [...l1.words, ...l2.words];
  hold(s, 1.0, 1.0);
  sheet(s, 'FIG. 7 — TIME TO DEPLOYMENT', 'p. 22', prog(t, sh.start, sh.start + 0.5));
  // year axis across the top
  const gx0 = 760, gw = 1000, y0 = 190;
  const yk = prog(t, sh.start, sh.start + 0.6, ease.outExpo);
  rule(c, gx0, y0, gx0 + gw, y0, yk, col(base(s), 0.8), 2);
  for (let i = 0; i <= 15; i++) { rule(c, gx0 + (gw * i) / 15, y0 - 8, gx0 + (gw * i) / 15, y0 + 820, yk, col('graphite', i % 5 ? 0.12 : 0.35), 1.5); if (i % 5 === 0) note(c, String(2025 + i), gx0 + (gw * i) / 15, y0 - 18, yk, 20, 'graphite', 'center'); }
  const yr = gw / 15;
  // rows: [label words, bar start (yrs), bar length (yrs), the word whose onset starts the bar]
  const rowsDef: [RegExp, RegExp | null, number, number][] = [
    [/permits/i, /year/i, 0, 1], [/grid/i, /ten/i, 1, 10], [/fda/i, /three/i, 2, 3], [/then/i, /again/i, 5, 3],
  ];
  const groups: Word[][] = [l1.words.slice(0, 4), l1.words.slice(4), l2.words.slice(0, 5), l2.words.slice(5)];
  groups.forEach((g, i) => {
    const y = 330 + i * 190;
    const [, endRe, st, len] = rowsDef[i]!;
    const first = g[0]!;
    const ek = endRe ? g.find((w) => endRe.test(w.w)) ?? g[g.length - 1]! : g[g.length - 1]!;
    // label: the sung words, flush right against the chart
    lyric(s, g, y, { width: 540, max: 66, x: 440, anno: false });
    const k = prog(t, first.start, ek.start + 0.25, ease.outCubic);
    const bx = gx0 + st * yr, bw = len * yr * k;
    c.fillStyle = col(i === 3 ? 'blood' : base(s), 0.85); c.fillRect(bx, y - 34, bw, 68);
    if (i >= 2 && k > 0.9) note(c, 'PHASE III', bx + 14, y + 8, 1, 22, 'bone');
  });
  void ws;
}

// ------------------------------------------------------------------ PRE: cost disease; the singularity on a tear-off calendar
function baumol(s: S) {
  const { t, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const sw = prog(t, l2.start - 0.25, l2.start + 0.25, ease.inOutCubic);
  cam(s, { x: W / 2 + sw * W, y: H / 2, z: 1, r: 0 });
  // panel A (line 1): a fever chart for COST, flat PRODUCTIVITY; the plumber is still a plumber (the word copies itself)
  {
    const x0 = 230, y0 = 850, w = 820, h = 520;
    axes(s, x0, y0, w, h, prog(t, l1.start - 0.2, l1.start + 0.4, ease.outExpo), 'DECADES', 'PRICE');
    const k = prog(t, l1.start, l1.end, ease.inOutQuad);
    const cost: [number, number][] = [], prod: [number, number][] = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40; cost.push([x0 + u * w, y0 - 30 - h * 0.8 * Math.pow(u, 1.7) + 12 * Math.sin(i * 1.7)]); prod.push([x0 + u * w, y0 - 60]); }
    strokePts(c, cost, k, col('blood', 1), 7); strokePts(c, prod, k, col('graphite', 0.8), 4);
    note(c, 'COST', x0 + w + 16, y0 - h * 0.8, k, 22, 'blood'); note(c, 'OUTPUT / HOUR', x0 + w + 16, y0 - 54, k, 22, 'graphite');
    const r1 = upto(l1, /the/i);
    lyric(s, r1, 200, { width: 1500, max: 100, align: 'l' });
    const pl = l1.words.filter((w) => /plumber/i.test(w.w));
    const rest = from(l1, /the/i);
    lyric(s, rest.slice(0, 1), 420, { x: 1390, width: 200, max: 60, anno: false });
    pl.forEach((w, i) => word(s, w, 'PLUMBER', A(100, 900), 110, 1390, 540 + i * 170, { sc: slam(w, t, 1.3) }));
    const st = l1.words.find((w) => /still/i.test(w.w));
    if (st) word(s, st, '= STILL A =', F.mono(600), 34, 1390, 625, {});
  }
  // panel B (line 2): a tear-off calendar; every "summer" tears a page and the year moves on
  {
    const ox = W;
    const sums = l2.words.filter((w) => /summer/i.test(w.w));
    const sing = fw(l2, /singularity/i);
    let year = 2026;
    for (const w of sums) if (t >= w.start) year++;
    const flip = sums.reduce((a, w) => Math.max(a, pulseAt(t, w.start, 0.1)), 0);
    c.fillStyle = col('bone', 1); c.strokeStyle = col(base(s), 0.9); c.lineWidth = 5;
    const cx = ox + 1300, cy = 560;
    c.fillRect(cx - 280, cy - 300, 560, 600); c.strokeRect(cx - 280, cy - 300, 560, 600);
    c.fillStyle = col('blood', 0.9); c.fillRect(cx - 280, cy - 300, 560, 120);
    label(s, 'SUMMER', A(125, 900), 70, cx, cy - 240, col('bone', 1));
    label(s, String(year), A(62, 900), 260 * (1 - 0.15 * flip), cx, cy + 30, col(base(s), 1));
    // the page that just tore off falls away
    if (flip > 0.02) { c.save(); c.translate(cx - 200, cy - 180 + (1 - flip) * 500); c.rotate((1 - flip) * 0.9); c.fillStyle = col('bone', flip); c.fillRect(-80, 0, 480, 420); c.strokeStyle = col('graphite', flip); c.strokeRect(-80, 0, 480, 420); c.restore(); }
    // the appointment, pencilled in and circled every year
    const sk = prog(t, sing.start, sing.start + 0.5, ease.outCubic);
    label(s, 'singularity', F.serif(600, true), 70, cx, cy + 200, col('blood', sk));
    c.strokeStyle = col('blood', 0.8 * sk); c.lineWidth = 3; c.beginPath(); c.ellipse(cx, cy + 195, 230, 60, -0.05, 0, TAU * sk); c.stroke();
    const r = upto(l2, /summer/i);
    cam(s, { x: W / 2 + sw * W, y: H / 2, z: 1, r: 0 });
    lyric(s, r, 260, { x: ox + 540, width: 760, max: 84 });
    const after = from(l2, /summer/i);
    lyric(s, after, 840, { x: ox + 540, width: 760, max: 84 });
  }
}

// ------------------------------------------------------------------ BRIDGE: seven problems, a million on each; six still out of reach
const CLAY = ['P vs NP', 'HODGE', 'POINCARÉ', 'RIEMANN', 'YANG–MILLS', 'NAVIER–STOKES', 'BIRCH–SWINNERTON-DYER'];
function clay(s: S) {
  const { t, sh, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  hold(s, 1.0, 1.03);
  sheet(s, 'MILLENNIUM PRIZE PROBLEMS · 2000', 'p. 1', prog(t, sh.start, sh.start + 0.5));
  lyric(s, l1.words, 190, { width: 1560, max: 96 });
  const mil = fw(l1, /million/i), each = fw(l1, /each/i);
  const later = fw(l2, /later/i), reach = fw(l2, /reach/i), six = fw(l2, /six/i);
  const up = prog(t, six.start, reach.start + 0.3, ease.inOutCubic);
  const reachY = 420;
  rule(c, 150, reachY, W - 150, reachY, prog(t, six.start, six.start + 0.4), col('blood', 0.7), 2);
  note(c, 'REACH', W - 150, reachY - 12, prog(t, six.start, six.start + 0.4), 18, 'blood', 'right');
  for (let i = 0; i < 7; i++) {
    const solved = i === 2;
    const cw = 214, x = 160 + i * (cw + 18), k = prog(t, l1.words[Math.min(i, l1.words.length - 1)]!.start - 0.05, l1.words[Math.min(i, l1.words.length - 1)]!.start + 0.3, ease.outBack);
    const y = 520 - (solved ? 0 : up * (330 + 30 * Math.sin(i * 1.3)));
    if (k <= 0) continue;
    c.strokeStyle = col(base(s), 0.9); c.lineWidth = 3; c.fillStyle = col('bone', 1);
    c.fillRect(x, y, cw, 270 * k); c.strokeRect(x, y, cw, 270 * k);
    setFont(c, F.mono(600), CLAY[i]!.length > 12 ? 15 : 22); c.fillStyle = col(base(s), 0.9); c.textAlign = 'center';
    c.fillText(CLAY[i]!, x + cw / 2, y + 50);
    const mk = prog(t, mil.start + i * 0.07, each.start + i * 0.05);
    if (mk > 0) label(s, '$1,000,000', F.mono(700), 26, x + cw / 2, y + 150, col('blood', mk));
    if (solved) { const sk = prog(t, later.start, later.start + 0.4, ease.outBack); if (sk > 0) label(s, '✓', A(100, 900), 130 * sk, x + cw / 2, y + 220, col('blood', 1)); }
  }
  // a quarter century goes by on the clock
  const yr = Math.round(lerp(2000, 2025, prog(t, l2.start - 0.2, later.end, ease.outCubic)));
  if (t > l2.start - 0.3) label(s, String(yr), A(62, 900), 140, 290, 940, col(base(s), 1));
  lyric(s, from(l2, /quarter/i).slice(2), 940, { x: 1150, width: 1150, max: 84, anno: false });
  lyric(s, l2.words.slice(0, 2), 860, { x: 1150, width: 600, max: 60, anno: false });
}

// ------------------------------------------------------------------ OUTRO: the title page again, smaller. "Cute." — then the end card.
function cute(s: S) {
  const { t, sh, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const cw = l2.words[0]!;
  const card = cw.end + 2.2;
  const ck = prog(t, card, card + 1.2, ease.inOutCubic);
  hold(s, 1.0, 1.02);
  sheet(s, 'WORKING PAPER SERIES · NO. 01 — REVISED', 'p. 1', prog(t, sh.start, sh.start + 0.6) * (1 - ck));
  // the question again, typed slowly, mono, small: the title page has become a footnote
  const ws = l1.words;
  let x = 150;
  setFont(c, F.mono(500), 46);
  for (const w of ws) {
    const k = prog(t, w.start - 0.05, w.start + 0.25);
    c.fillStyle = col(base(s), k * (1 - ck)); c.textAlign = 'left';
    c.fillText(w.w.toUpperCase(), x, 300);
    x += c.measureText(w.w.toUpperCase() + ' ').width;
  }
  // the reply, in the margin, in red pencil
  const kk = prog(t, cw.start - 0.04, cw.start + 0.5, ease.outBack);
  if (kk > 0) {
    label(s, 'Cute.', F.serif(600, true), 260 * kk, W / 2, 600, col('blood', 1 - ck));
    c.strokeStyle = col('blood', 0.8 * (1 - ck)); c.lineWidth = 4; c.beginPath(); c.ellipse(W / 2, 600, 330, 150, -0.08, 0, TAU * prog(t, cw.start + 0.2, cw.start + 1.0, ease.outCubic)); c.stroke();
  }
  // end card: the paper burns away from the centre into the furnace and the title is left
  if (ck > 0) {
    s.bg.paper = 1 - ck;
    s.paper = ck < 0.5;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = col('ink', ck); c.fillRect(0, 0, W, H); c.restore();
    const fa = A(125, 300), fb = A(125, 900);
    const sa = sizeTo(BRAND.titleA, fa, 980), sb = sizeTo(BRAND.titleB, fb, 980);
    label(s, BRAND.titleA, fa, sa, W / 2, H / 2 - sa * CAP / 2 - 20, col('bone', ck));
    label(s, BRAND.titleB, fb, sb, W / 2, H / 2 + sb * CAP / 2 + 10, mix('bone', 'signal', 0.9, ck));
    label(s, BRAND.titleB, fb, sb, W / 2, H / 2 + sb * CAP / 2 + 10, col('ember', 0.3 * ck), g);
    rule(c, W / 2 - 490, H / 2 + sb * CAP + 60, W / 2 + 490, H / 2 + sb * CAP + 60, ck, col('signal', 0.9), 3);
    note(c, BRAND.tagline, W / 2, H / 2 + sb * CAP + 120, prog(t, card + 0.8, card + 1.6), 26, 'ash', 'center');
  }
  s.post.fade = prog(t, sh.end - 2.0, sh.end - 0.15, ease.inOutCubic);
}

export const PAPER = { paperTitle, analogies, scurve, stampShot, tfp, gantt, baumol, clay, cute };
void lerp; void acc; void sizeTo; void clamp; void typeOn;
