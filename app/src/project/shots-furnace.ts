// FURNACE: the compute world — near-black, molten orange type that blooms, the acid hyperbolic curve.
// The takeoff instrumental, verse 1's dark shots, the hammer, and every chorus (which grows with sh.o.n).
import {
  A, CAP, F, H, W, base, clamp, col, ease, from, fw, hold, label, lerp, ln, lyric, measure, mix, note, prog, rule, setFont, slam,
  split, strokePts, TAU, txt, upto, word, along, sizeTo, pulseAt, type S, type Word,
} from './common';
import { cam } from '../scenes/shots';
import { clean, snapCam } from '../scenes/kit';
import { row } from '../scenes/typeset';
import { hash, noise1 } from '../engine/util';
import { BRAND } from './brand';

const nOf = (s: S) => Math.max(1, Math.min(3, s.sh.o.n ?? 1));
/** Glow copy of a stroke (only signal/ember/acid go on the glow layer). */
function glowPts(s: S, pts: [number, number][], k: number, key: 'acid' | 'ember' | 'signal', w = 10, a = 0.5) { strokePts(s.g, pts, k, col(key, a), w); }
/** The hyperbolic curve y = 1/(T - x) sampled into screen space. */
function hyperPts(x0: number, y0: number, w: number, h: number, T = 1.04, n = 120): [number, number][] {
  const pts: [number, number][] = [];
  const f = (u: number) => 1 / (T - u) - 1 / T;
  const top = f(1);
  for (let i = 0; i <= n; i++) { const u = i / n; pts.push([x0 + u * w, y0 - (f(u) / top) * h]); }
  return pts;
}

// ------------------------------------------------------------------ INSTRUMENTAL: the curve leaves the paper and goes vertical
function takeoff(s: S) {
  const { t, sh, c, g } = s;
  const t0 = sh.start, t1 = sh.end, d = t1 - t0;
  const k = prog(t, t0, t0 + d * 0.62, ease.inOutQuad);
  s.bg.glow = 0.2 + 0.4 * k; s.bg.grid = 0.4;
  const pts = hyperPts(-200, 900, 2100, 4200, 1.03);
  const head = along(pts, k);
  // camera rides the pen up; at the top it settles for the title
  const tt = prog(t, t0 + d * 0.62, t0 + d * 0.72, ease.inOutCubic);
  const kc = { x: lerp(Math.max(W / 2, head.x - 260), W / 2, tt), y: lerp(Math.min(H / 2, head.y + 200), -3300 + H / 2, tt), z: lerp(1.0, 0.9, tt), r: lerp(-0.03, 0, tt) };
  cam(s, kc);
  // years along the x axis, a log-compute ladder on the y axis
  for (let i = 0; i <= 14; i++) { const x = -200 + (2100 * i) / 14; rule(c, x, 900, x, 920, 1, col('graphite', 0.8), 2); note(c, String(2012 + i * 1), x, 960, 0.7, 20, 'ash', 'center'); }
  rule(c, -200, 900, 1900, 900, 1, col('graphite', 0.8), 2);
  strokePts(c, pts, k, col('acid', 0.95), 6); glowPts(s, pts, k, 'acid', 18, 0.45);
  // rungs: training compute (FLOP), ticking up a decade per rung as the pen passes
  for (let e = 18; e <= 29; e++) {
    const y = 900 - ((e - 18) / 11) * 4200;
    if (head.y > y + 40) continue;
    rule(c, head.x + 60, y, head.x + 260, y, prog(head.y, y + 40, y - 80), col('graphite', 0.7), 2);
    note(c, `1e${e} FLOP`, head.x + 280, y + 7, 0.8, 24, e % 3 ? 'ash' : 'signal');
  }
  g.fillStyle = col('ember', 0.9); g.beginPath(); g.arc(head.x, head.y, 18, 0, TAU); g.fill();
  c.fillStyle = col('ember', 1); c.beginPath(); c.arc(head.x, head.y, 8, 0, TAU); c.fill();
  // the title, carved out of the top of the curve
  const tk = prog(t, t0 + d * 0.68, t0 + d * 0.8, ease.outExpo);
  if (tk > 0) {
    const out = prog(t, t1 - 0.5, t1, ease.inCubic);
    const fa = A(125, 300), fb = A(125, 900), cx = W / 2, cy = -3300 + H / 2;
    const sa = sizeTo(BRAND.titleA, fa, 980), sb = sizeTo(BRAND.titleB, fb, 980);
    const a = 1 - out;
    label(s, BRAND.titleA, fa, sa, cx, cy - 30 - (1 - tk) * 80, col('bone', tk * a));
    const kb = prog(t, t0 + d * 0.74, t0 + d * 0.84, ease.outExpo);
    label(s, BRAND.titleB, fb, sb * lerp(1.3, 1, kb), cx, cy + sb * CAP / 2 + 40, mix('bone', 'signal', 0.95, kb * a));
    label(s, BRAND.titleB, fb, sb * lerp(1.3, 1, kb), cx, cy + sb * CAP / 2 + 40, col('ember', 0.35 * kb * a), g);
    rule(c, cx - 490, cy + sb * CAP + 90, cx + 490, cy + sb * CAP + 90, kb * a, col('signal', 0.9), 3);
    note(c, BRAND.tagline, cx, cy + sb * CAP + 150, prog(t, t0 + d * 0.84, t0 + d * 0.9) * a, 26, 'ash', 'center');
    s.post.flash = 0.12 * pulseAt(t, t0 + d * 0.74, 0.12);
    s.post.zoom = lerp(1, 1.8, out);
  }
}

// ------------------------------------------------------------------ V1: "normal" — in air quotes
function sarcasm(s: S) {
  const { t, c } = s;
  const l = ln(s);
  const R = split(l, [6, 7]);
  const nw = fw(l, /normal/i);
  const times = [s.sh.start, nw.start - 0.08, R[2]![0]!.start - 0.08];
  cam(s, snapCam(t, times, [{ x: W / 2, y: 380, z: 1.15, r: -0.02 }, { x: W / 2, y: 520, z: 1.0, r: 0.015 }, { x: W / 2, y: 600, z: 0.92, r: 0 }], 0.4));
  lyric(s, R[0]!, 300, { width: 1500, max: 120 });
  const fam = A(125, 900), sz = sizeTo('NORMAL', fam, 1100, 330);
  word(s, nw, 'NORMAL', fam, sz, W / 2, 560, { sc: slam(nw, t, 1.6) });
  // the air quotes pop on either side a beat after the word
  const qk = prog(t, nw.start + 0.12, nw.start + 0.4, ease.outBack);
  if (qk > 0) {
    const ww = measure('NORMAL', fam, sz) / 2;
    label(s, '“', F.serif(600, false), 420 * qk, W / 2 - ww - 90, 520, col('signal', 1));
    label(s, '”', F.serif(600, false), 420 * qk, W / 2 + ww + 90, 520, col('signal', 1));
    label(s, '“', F.serif(600, false), 420 * qk, W / 2 - ww - 90, 520, col('ember', 0.4), s.g);
    label(s, '”', F.serif(600, false), 420 * qk, W / 2 + ww + 90, 520, col('ember', 0.4), s.g);
  }
  const tw = R[2]![0]!;
  word(s, tw, 'technology?', F.serif(600, true), 210, W / 2, 830, { sc: slam(tw, t, 1.3) });
  void c;
}

// ------------------------------------------------------------------ V1: the dynamo — spins down to a slower chronology
function dynamo(s: S) {
  const { t, sh, c, g } = s;
  const l = ln(s);
  hold(s, 1.0, 1.05, 0);
  const slow = fw(l, /slower/i), dyn = fw(l, /dynamo/i);
  const v1 = 7.0, v2 = 0.35;
  const ang = v1 * Math.min(t - sh.start, slow.start - sh.start) + v2 * Math.max(0, t - slow.start);
  const cx = 600, cy = 560, R = 300;
  const k = prog(t, sh.start, dyn.start + 0.3, ease.outExpo);
  // armature: rim, spokes, windings
  c.strokeStyle = col('bone', 0.85 * k); c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R * k, 0, TAU); c.stroke();
  c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, R * 0.72 * k, 0, TAU); c.stroke();
  for (let i = 0; i < 12; i++) {
    const a = ang + (i / 12) * TAU;
    rule(c, cx + Math.cos(a) * 60, cy + Math.sin(a) * 60, cx + Math.cos(a) * R * 0.72, cy + Math.sin(a) * R * 0.72, k, col(i % 3 ? 'graphite' : 'signal', 0.9), i % 3 ? 3 : 6);
    if (i % 3 === 0) rule(g, cx + Math.cos(a) * 60, cy + Math.sin(a) * 60, cx + Math.cos(a) * R * 0.72, cy + Math.sin(a) * R * 0.72, k, col('ember', 0.4 * (1 - prog(t, slow.start, slow.end))), 10);
  }
  // brushes + sparks while it spins fast
  const fast = 1 - prog(t, slow.start, slow.end + 0.3);
  for (let i = 0; i < 14 * fast; i++) { const a = -0.3 + hash(i, Math.floor(t * 30)) * 0.6; rule(g, cx + R, cy, cx + R + Math.cos(a) * 90 * hash(i, 2, Math.floor(t * 30)), cy + Math.sin(a) * 90, 1, col('ember', 0.8), 3); }
  // the words: DYNAMO on the hub, REMIX ringing the rim, the rest on the right
  word(s, dyn, 'DYNAMO', A(62, 900), 92, cx, cy, { rot: ang * 0.02 });
  const rem = fw(l, /remix/i);
  if (t > rem.start - 0.06) {
    setFont(c, A(100, 800), 54);
    'REMIX · REMIX · REMIX · '.split('').forEach((ch, i, arr) => {
      const a = ang * 0.5 + (i / arr.length) * TAU - Math.PI / 2;
      c.save(); c.translate(cx + Math.cos(a) * (R + 50), cy + Math.sin(a) * (R + 50)); c.rotate(a + Math.PI / 2);
      c.fillStyle = mix('bone', 'signal', Math.max(0, 1 - (t - rem.start) * 2)); c.textAlign = 'center'; c.fillText(ch, 0, 0); c.restore();
    });
  }
  const rest = from(l, /with/i);
  word(s, l.words[0]!, txt(l.words[0]!), A(62, 300), 60, cx, cy - 150, {});
  lyric(s, rest.slice(0, 3), 520, { x: 1400, width: 760, max: 130 });
  const chron = rest.slice(3);
  // chronology: letters arrive slowly, one tick at a time
  chron.forEach((w) => {
    const text = txt(w).replace('.', '');
    const fam = A(100, 900), sz = sizeTo(text, fam, 780, 140), wd = measure(text, fam, sz);
    const n = text.length, dur = Math.max(0.5, w.end - w.start + 0.4);
    for (let i = 0; i < n; i++) {
      const ki = prog(t, w.start - 0.05 + (i / n) * dur, w.start - 0.05 + (i / n) * dur + 0.1, ease.outExpo);
      if (ki <= 0) continue;
      const cw = measure(text.slice(0, i), fam, sz), chw = measure(text[i]!, fam, sz);
      label(s, text[i]!, fam, sz, 1400 - wd / 2 + cw + chw / 2, 760 - (1 - ki) * 40, mix('bone', 'signal', ki < 1 ? 1 : Math.max(0, 1 - (t - w.end) * 2), ki));
    }
  });
}

// ------------------------------------------------------------------ V1: forty years to rewire every floor in the factory
function factory(s: S) {
  const { t, sh, c, g } = s;
  const l = ln(s);
  hold(s, 1.0, 1.03);
  const forty = fw(l, /forty/i), rew = fw(l, /rewire/i), fac = fw(l, /factory/i);
  // header row: TOOK FORTY YEARS
  lyric(s, l.words.slice(0, 3), 170, { width: 900, max: 110, align: 'l' });
  // the year counter runs forty years across the line
  const yr = Math.round(lerp(1890, 1930, prog(t, forty.start, fac.end, ease.inOutQuad)));
  if (t > forty.start - 0.05) label(s, String(yr), A(62, 900), 200, 1560, 170, col('graphite', 0.9));
  // the building: five floors, each floor carries a word; the wire climbs floor by floor on the onsets
  const floors = l.words.slice(3);
  const bx = 300, bw = 1320, fh = 150, by = 1000;
  const fk = prog(t, sh.start, sh.start + 0.5, ease.outExpo);
  c.strokeStyle = col('bone', 0.8 * fk); c.lineWidth = 4;
  for (let i = 0; i <= 5; i++) rule(c, bx, by - i * fh, bx + bw, by - i * fh, fk, col('bone', 0.6), 3);
  rule(c, bx, by, bx, by - 5 * fh, fk, col('bone', 0.8), 4); rule(c, bx + bw, by, bx + bw, by - 5 * fh, fk, col('bone', 0.8), 4);
  // saw-tooth roof
  for (let i = 0; i < 6; i++) { const x = bx + (bw / 6) * i; c.beginPath(); c.moveTo(x, by - 5 * fh); c.lineTo(x + bw / 6, by - 5 * fh - 70 * fk); c.lineTo(x + bw / 6, by - 5 * fh); c.stroke(); }
  // group the floor words: rewire / every / floor / in the / factory
  const groups: Word[][] = [[], [], [], [], []];
  floors.forEach((w) => { const x = clean(w.w).toLowerCase(); const q = x === 'to' || x === 'rewire' ? 0 : x === 'every' ? 1 : x === 'floor' ? 2 : x === 'in' || x === 'the' ? 3 : 4; groups[q]!.push(w); });
  const wire: [number, number][] = [[bx - 120, by + 40], [bx + 40, by + 40]];
  groups.forEach((gr, i) => {
    if (!gr.length) return;
    const y = by - i * fh - fh / 2;
    wire.push([bx + 40, y + 50], [bx + bw - 60, y + 50], [bx + bw - 60, y - fh / 2 + 50 - 20]);
    const lit = t >= gr[0]!.start;
    if (lit) { c.fillStyle = col('signal', 0.08 + 0.1 * pulseAt(t, gr[0]!.start, 0.2)); c.fillRect(bx + 4, y - fh / 2 + 4, bw - 8, fh - 8); }
    lyric(s, gr, y - 10, { width: 700, max: 96, anno: false });
  });
  const wk = prog(t, rew.start, fac.start + 0.3, ease.linear);
  strokePts(c, wire, wk, col('signal', 1), 5); strokePts(g, wire, wk, col('ember', 0.5), 12);
  void sh;
}

// ------------------------------------------------------------------ V1: easy tasks lit, the rest too hard — then the model gets its turn
const TASKS = ['EMAIL', 'SUMMARIZE', 'TRANSLATE', 'CODE', 'DIAGNOSE', 'NEGOTIATE', 'PROVE', 'DESIGN', 'TEACH', 'AUDIT', 'PLAN', 'RESEARCH', 'DRAFT', 'FORECAST', 'REPAIR', 'MANAGE', 'INVENT', 'SELL', 'LITIGATE', 'TUTOR', 'TRIAGE', 'COMPOSE', 'SCHEDULE', 'ANALYZE', 'PILOT', 'REVIEW', 'PATCH', 'INVEST', 'SEARCH', 'BUILD', 'TEST', 'HIRE'];
function tasks(s: S) {
  const { t, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const easy = fw(l1, /easy/i), hard = fw(l1, /hard/i), turn = fw(l2, /turn/i), mod = fw(l2, /modest/i);
  hold(s, 1.0, 1.04, 0);
  // the task grid: 8 x 4 cells
  const gx = 220, gy = 330, cw = 185, chh = 120;
  const turnK = prog(t, turn.start - 0.05, turn.start + 0.6, ease.inOutCubic);
  for (let i = 0; i < 32; i++) {
    const r = Math.floor(i / 8), q = i % 8, x = gx + q * cw, y = gy + r * chh;
    const isEasy = [0, 1, 2, 12].includes(i);
    const litE = isEasy && t >= easy.start + i * 0.02;
    // on "turn" every cell flips over (scaleY through 0) and comes back lit
    const fl = prog(t, turn.start + (q + r) * 0.04, turn.start + (q + r) * 0.04 + 0.35, ease.inOutCubic);
    const sy = Math.abs(Math.cos(fl * Math.PI));
    const lit = litE || fl > 0.5;
    c.save(); c.translate(x + cw / 2, y + chh / 2); c.scale(1, Math.max(0.02, sy));
    c.fillStyle = col(lit ? 'signal' : 'ink2', lit ? 0.85 : 1); c.fillRect(-cw / 2 + 6, -chh / 2 + 6, cw - 12, chh - 12);
    if (!lit && t > hard.start) { c.strokeStyle = col('graphite', 0.6); c.lineWidth = 2; for (let h = -cw; h < cw; h += 18) { c.beginPath(); c.moveTo(Math.max(-cw / 2 + 6, h), -chh / 2 + 6 + Math.max(0, -cw / 2 + 6 - h)); c.lineTo(Math.min(cw / 2 - 6, h + chh), Math.min(chh / 2 - 6, -chh / 2 + 6 + (Math.min(cw / 2 - 6, h + chh) - h))); c.stroke(); } }
    setFont(c, F.mono(600), 20); c.fillStyle = col(lit ? 'ink' : 'ash', 1); c.textAlign = 'center'; c.fillText(TASKS[i]!, 0, 8);
    c.restore();
    if (lit) { g.fillStyle = col('ember', 0.12); g.fillRect(x + 6, y + 6, cw - 12, chh - 12); }
  }
  // line 1 above the grid, line 2 below it; MODEST is set small on purpose, TURN rotates a quarter turn
  const a1 = 1 - prog(t, l2.start - 0.2, l2.start + 0.2);
  lyric(s, l1.words, 210, { width: 1500, max: 90, alpha: Math.max(0.25, a1) });
  const pre = upto(l2, /modest/i), post = from(l2, /and/i, /turn/i);
  lyric(s, pre, 870, { width: 760, max: 72, x: 560, anno: false });
  word(s, mod, 'modest', F.serif(400, true), 44, 1010, 870, { sc: 1 });
  lyric(s, post, 980, { width: 820, max: 72, x: 700, anno: false });
  word(s, turn, 'TURN.', A(125, 900), 150, 1450, 960, { rot: -Math.PI / 2 * turnK + Math.PI / 2 * 0, sc: slam(turn, t, 1.4) });
}

// ------------------------------------------------------------------ V1: computers everywhere except the stats; party hats
function solow(s: S) {
  const { t, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const sw = prog(t, l2.start - 0.2, l2.start + 0.2, ease.inOutCubic);
  const comp = fw(l1, /computers/i), stats = fw(l1, /stats/i), hats = fw(l2, /hats/i), party = fw(l2, /party/i);
  cam(s, { x: W / 2, y: H / 2 + sw * H, z: 1, r: 0 });
  // panel A: the field of COMPUTER (everywhere) with a clean hole for the statistics
  {
    const hx0 = 560, hy0 = 520, hw = 800, hh = 340;
    setFont(c, F.mono(600), 22); c.textAlign = 'left';
    const spread = prog(t, comp.start - 0.05, comp.start + 0.9, ease.outCubic);
    for (let r = 0; r < 34; r++) for (let q = 0; q < 14; q++) {
      const x = 40 + q * 150 + (r % 2) * 70, y = 60 + r * 30;
      if (x > hx0 - 160 && x < hx0 + hw && y > hy0 - 20 && y < hy0 + hh + 20) continue;
      const d = Math.hypot(x - W / 2, y - H / 2) / 1100;
      if (d > spread) continue;
      c.fillStyle = col(hash(r, q) > 0.93 ? 'signal' : 'graphite', 0.55); c.fillText('COMPUTER', x, y);
    }
    // the stats table: flat
    const sk = prog(t, stats.start - 0.1, stats.start + 0.3, ease.outExpo);
    c.strokeStyle = col('bone', 0.9 * sk); c.lineWidth = 3; c.strokeRect(hx0, hy0, hw, hh);
    note(c, 'PRODUCTIVITY GROWTH, % / YR', hx0 + 20, hy0 + 40, sk, 22, 'ash');
    ['1970s  1.1', '1980s  1.0', '1990s  1.1'].forEach((r, i) => note(c, r, hx0 + 20, hy0 + 110 + i * 60, prog(t, stats.start + i * 0.1, stats.start + i * 0.1 + 0.2), 34, 'bone'));
    const flat: [number, number][] = [[hx0 + 420, hy0 + 220], [hx0 + 560, hy0 + 216], [hx0 + 760, hy0 + 222]];
    strokePts(c, flat, sk, col('signal', 1), 5);
    lyric(s, l1.words, 250, { width: 1600, max: 110 });
  }
  // panel B: the seminar concludes — party hats (striped cones) and confetti
  {
    const oy = H;
    const hk = prog(t, party.start - 0.05, hats.start + 0.4, ease.outBack);
    for (let i = 0; i < 5; i++) {
      const x = 360 + i * 300, y = oy + 820, sc = hk * (0.8 + 0.25 * hash(i, 3)), r = (hash(i) - 0.5) * 0.4;
      if (sc <= 0) continue;
      c.save(); c.translate(x, y); c.rotate(r); c.scale(sc, sc);
      c.fillStyle = col(i % 2 ? 'signal' : 'bone', 0.95); c.beginPath(); c.moveTo(-90, 0); c.lineTo(0, -260); c.lineTo(90, 0); c.closePath(); c.fill();
      c.strokeStyle = col('ink', 0.9); c.lineWidth = 10; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(-90 + k * 22, -k * 62); c.lineTo(90 - k * 22, -k * 62 + 20); c.stroke(); }
      c.fillStyle = col('ember', 1); c.beginPath(); c.arc(0, -262, 18, 0, TAU); c.fill();
      c.restore();
    }
    for (let i = 0; i < 160; i++) {
      const t0 = l2.start + hash(i, 1) * 0.6, dt = t - t0; if (dt < 0) continue;
      const x = hash(i, 2) * W + Math.sin(dt * 3 + i) * 30, y = oy - 40 + dt * (180 + 160 * hash(i, 3));
      c.fillStyle = col(i % 3 ? 'signal' : i % 2 ? 'bone' : 'acid', 0.85); c.save(); c.translate(x, y); c.rotate(dt * 4 + i); c.fillRect(-6, -3, 12, 6); c.restore();
    }
    const pre = upto(l2, /don/i), post = from(l2, /don/i);
    lyric(s, pre, oy + 230, { width: 1200, max: 96 });
    lyric(s, post, oy + 400, { width: 1500, max: 120 });
  }
}

// ------------------------------------------------------------------ PRE: the hammer in the human hand — then the hammer builds the hand
function hammer(s: S) {
  const { t, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const hw = fw(l1, /hammer/i), hand = fw(l1, /hand/i), hum = fw(l1, /human/i);
  const builds = fw(l2, /build/i), hand2 = fw(l2, /hand/i), ham2 = fw(l2, /hammer/i);
  const in2 = prog(t, l2.start - 0.2, l2.start + 0.3, ease.inOutCubic);
  cam(s, { x: W / 2 + 120 * in2, y: H / 2, z: lerp(1, 0.92, in2), r: 0 });
  // line 1 / line 2 text at the top
  lyric(s, l1.words, 160, { width: 1500, max: 92, alpha: 1 - 0.8 * in2 });
  if (in2 > 0) lyric(s, l2.words, 160 + 120 * in2, { width: 1500, max: 84 });
  // the hammer: head = the word HAMMER on a block; handle = a bar; it swings on line-2 onsets (strikes)
  const strikes = l2.words.filter((w) => w.start >= ham2.start).map((w) => w.start);
  let sw = 0; for (const st of strikes) sw = Math.max(sw, pulseAt(t, st, 0.09));
  const ang = -0.32 * in2 + 0.4 * sw * in2;
  const px = 760, py = 1000;
  const hk = prog(t, hw.start - 0.05, hw.start + 0.3, ease.outBack);
  c.save(); c.translate(px, py); c.rotate(ang);
  c.fillStyle = col('graphite', 0.95); c.fillRect(-22, -380 * hk, 44, 380 * hk);
  if (hk > 0) {
    c.fillStyle = col('ink2', 1); c.strokeStyle = col('bone', 0.9); c.lineWidth = 4; c.fillRect(-280, -500, 560, 140); c.strokeRect(-280, -500, 560, 140);
    word(s, hw, 'HAMMER', A(125, 900), sizeTo('HAMMER', A(125, 900), 500, 120), 0, -430, { sc: 1 });
  }
  c.restore();
  // the hand (line 1): HUMAN / HAND gripping the handle
  const a1 = 1 - in2;
  if (a1 > 0) {
    word(s, hum, 'HUMAN', A(62, 900), 80, px - 230, py - 200, { alpha: a1 });
    word(s, hand, 'HAND', A(125, 900), 150, px, py - 120, { alpha: a1, sc: slam(hand, t, 1.4) });
  }
  // line 2: every strike lands on the anvil at the right and builds a letter of HAND
  if (in2 > 0) {
    const ax = 1400, ay = 820;
    c.fillStyle = col('graphite', 0.9); c.fillRect(ax - 260, ay + 40, 520, 50); c.fillRect(ax - 120, ay + 90, 240, 120);
    const letters = 'HAND';
    const fam = A(125, 900), sz = 240, total = measure(letters, fam, sz);
    const bst = [builds.start, (builds.start + hand2.start) / 2, hand2.start - 0.12, hand2.start];
    letters.split('').forEach((ch, i) => {
      const k = prog(t, bst[i]!, bst[i]! + 0.2, ease.outBack);
      if (k <= 0) return;
      const cw = measure(letters.slice(0, i), fam, sz), chw = measure(ch, fam, sz);
      const x = ax - total / 2 + cw + chw / 2, y = ay - 80;
      label(s, ch, fam, sz * k, x, y, mix('bone', 'signal', pulseAt(t, bst[i]!, 0.25)));
      label(s, ch, fam, sz * k, x, y, col('ember', 0.5 * pulseAt(t, bst[i]!, 0.25)), g);
      // sparks
      for (let q = 0; q < 10; q++) { const p = pulseAt(t, bst[i]!, 0.12); if (p < 0.05) break; const a = -Math.PI * hash(i, q); rule(g, x, ay + 30, x + Math.cos(a) * 160 * (1 - p), ay + 30 + Math.sin(a) * 160 * (1 - p), 1, col('ember', p), 3); }
    });
    s.post.shake = [noise1(t * 60, 1) * 12 * sw * in2, noise1(t * 60, 2) * 12 * sw * in2];
  }
}

// =================================================================== CHORUS
// ROBOTS BUILDING ROBOTS: the word assembles copies of itself; each generation builds two more (depth grows with n)
function robots(s: S) {
  const { t, sh, c, g } = s;
  const l = ln(s);
  const n = nOf(s);
  const r1 = l.words[0]!, bld = fw(l, /build/i), r2 = l.words.find((w, i) => i > 1 && /robot/i.test(w.w)) ?? l.words[2]!;
  const ore = fw(l, /ore/i), suit = l.words[l.words.length - 1]!;
  const depth = 2 + n;
  const gk = prog(t, r2.start, ore.start + 0.2, ease.linear);
  cam(s, { x: W / 2, y: lerp(420, 520, gk), z: lerp(1.0, 0.82 - 0.06 * n, gk), r: lerp(0, -0.02, gk) });
  const fam = A(125, 900);
  // generation 0 + 1 built by the sung words, deeper generations unfold over the rest of the line
  type Node = { x: number; y: number; sz: number; d: number; t0: number };
  const nodes: Node[] = [{ x: W / 2, y: 230, sz: 210, d: 0, t0: r1.start }];
  for (let d = 1; d <= depth; d++) {
    const prev = nodes.filter((q) => q.d === d - 1);
    const span = (suit.start - r2.start) / depth;
    prev.forEach((p, i) => {
      for (const side of [-1, 1]) nodes.push({ x: p.x + side * (W / Math.pow(2, d + 1)) * 1.12, y: p.y + 200 / Math.pow(1.25, d - 1) + 30, sz: p.sz * 0.56, d, t0: d === 1 ? (side < 0 ? bld.start : r2.start) : r2.start + (d - 1) * span + (i / prev.length) * span * 0.7 });
    });
  }
  for (const q of nodes) {
    if (t < q.t0 - 0.06) continue;
    const k = prog(t, q.t0 - 0.06, q.t0 + 0.25, ease.outExpo);
    // the build arm from parent: a hairline that draws the copy into being
    const hot = pulseAt(t, q.t0, 0.25);
    if (q.d > 0) { const py = q.y - 200 / Math.pow(1.25, q.d - 1) - 30; rule(c, q.x, q.y - q.sz * 0.5, lerp(q.x, W / 2, 0) , py + q.sz * 0.9, k, col('graphite', 0.7), 2); }
    const text = 'ROBOTS', wd = measure(text, fam, q.sz);
    // letters assemble left to right
    text.split('').forEach((ch, i) => {
      const ki = prog(t, q.t0 - 0.06 + i * 0.03, q.t0 + i * 0.03 + 0.18, ease.outExpo);
      if (ki <= 0) return;
      const cw = measure(text.slice(0, i), fam, q.sz), chw = measure(ch, fam, q.sz);
      label(s, ch, fam, q.sz, q.x - wd / 2 + cw + chw / 2, q.y + (1 - ki) * -q.sz * 0.5, mix('bone', 'signal', Math.max(hot, q.d === 0 ? 0 : 0.25), ki));
      if (hot > 0.05) label(s, ch, fam, q.sz, q.x - wd / 2 + cw + chw / 2, q.y + (1 - ki) * -q.sz * 0.5, col('ember', 0.4 * hot * ki), g);
    });
  }
  // r1 / build / r2 are the first three nodes; the sung "building" sits between them
  word(s, bld, 'BUILDING', A(62, 300), 70, W / 2, 380, { sc: slam(bld, t, 1.3) });
  // FROM THE ORE TO THE SUIT: the supply chain along the bottom
  const tail = from(l, /from/i);
  const ty = 1000 + 120 * gk;
  if (t > ore.start - 0.4) {
    rule(c, 260, ty + 70, 1660, ty + 70, prog(t, ore.start, suit.start + 0.2), col('signal', 0.9), 4);
    rule(g, 260, ty + 70, 1660, ty + 70, prog(t, ore.start, suit.start + 0.2), col('ember', 0.4), 10);
  }
  lyric(s, tail, ty, { width: 1400, max: 90, anno: false });
  void sh;
}

// A MILLION MINDS IN PARALLEL: a grid of cells, all thinking at once; nobody sleeps
function minds(s: S) {
  const { t, sh, c, g } = s;
  const l = ln(s);
  const n = nOf(s);
  const mil = fw(l, /million/i), par = fw(l, /parallel/i), sleep = fw(l, /sleep/i), nev = fw(l, /never/i);
  hold(s, 1.0, 1.06 + 0.02 * n);
  const cols = 64, rows = 36, cw = W / cols, ch = H / rows;
  const on = prog(t, mil.start - 0.05, par.start + 0.2, ease.outCubic);
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const d = Math.hypot(q - cols / 2, r - rows / 2) / Math.hypot(cols / 2, rows / 2);
    if (d > on * 1.05) continue;
    // all cells pulse together on the beat after "parallel" (synchronous = parallel)
    const ph = t > par.start ? 0.5 + 0.5 * Math.sin((t - par.start) * 9.6 + (t > par.start ? 0 : q * 0.3)) : 0.3 + 0.7 * hash(q, r, Math.floor(t * 8));
    const a = 0.12 + 0.35 * ph * (hash(q, r) > 0.5 ? 1 : 0.6);
    c.fillStyle = col(hash(q, r, 7) > 0.985 ? 'signal' : 'graphite', a); c.fillRect(q * cw + 3, r * ch + 3, cw - 6, ch - 6);
    if (hash(q, r, 7) > 0.985) { g.fillStyle = col('ember', 0.25 * ph); g.fillRect(q * cw + 3, r * ch + 3, cw - 6, ch - 6); }
  }
  // counter
  const cnt = Math.floor(Math.pow(10, 6 * prog(t, mil.start - 0.05, mil.end + 0.3, ease.outCubic)) * (n > 1 ? Math.pow(10, n - 1) : 1));
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = col('ink', 0.75); c.fillRect(0, 300, W, 480);
  c.restore();
  cam(s, { x: W / 2, y: H / 2, z: 1, r: 0 });
  label(s, cnt.toLocaleString('en-US'), F.mono(600), 60, W / 2, 360, col('ash', prog(t, mil.start, mil.start + 0.2)));
  lyric(s, upto(l, /that/i), 520, { width: 1600, max: 150 });
  const tail = from(l, /that/i);
  lyric(s, tail, 700, { width: 1300, max: 100, anno: false });
  // never sleep: a "z" that is struck through, a 24/7 bar always lit
  const zk = prog(t, sleep.start, sleep.start + 0.3, ease.outBack);
  if (zk > 0) { label(s, 'z z z', F.serif(600, true), 90 * zk, 1640, 700, col('graphite', 1)); rule(c, 1520, 720, 1760, 670, prog(t, sleep.start + 0.15, sleep.start + 0.4, ease.outExpo), col('signal', 1), 8); }
  if (t > nev.start) note(c, 'UPTIME 24/7 · 365', W / 2, 860, prog(t, nev.start, nev.start + 0.3), 24, 'signal', 'center');
  void sh;
}

/** An original, geometric tractor (body, cab, big rear wheel, small front wheel). */
function tractor(s: S, x: number, y: number, sz: number, a: number, hot: number, textOn = true) {
  const { c } = s;
  c.save(); c.translate(x, y); c.scale(sz, sz); c.globalAlpha = a;
  c.fillStyle = mix('bone', 'signal', hot); c.fillRect(-60, -60, 110, 40); c.fillRect(-20, -105, 50, 48);
  c.fillStyle = col('ink', 1); c.fillRect(-12, -98, 34, 26);
  c.fillStyle = col('graphite', 1); c.fillRect(32, -80, 8, 22);
  c.strokeStyle = mix('bone', 'signal', hot); c.lineWidth = 9; c.beginPath(); c.arc(-30, -5, 30, 0, TAU); c.stroke(); c.beginPath(); c.arc(40, 2, 18, 0, TAU); c.stroke();
  if (textOn) { setFont(c, A(100, 900), 22); c.fillStyle = col('ink', 1); c.textAlign = 'center'; c.fillText('TRACTOR', -5, -32); }
  c.restore();
}
// YOU MODELED A TRACTOR, NOW THE TRACTORS BUILD THE FLEET: one becomes many
function fleet(s: S) {
  const { t, c } = s;
  const l = ln(s);
  const n = nOf(s);
  const tr = fw(l, /tractor\b|tractor,/i), trs = fw(l, /tractors/i), bld = fw(l, /build/i), flt = l.words[l.words.length - 1]!;
  const gen = (tt: number) => (tt < trs.start ? 0 : Math.min(6 + n, Math.floor((tt - trs.start) / Math.max(0.12, (flt.start - trs.start) / (5 + n))) + 1));
  const G = gen(t);
  const count = Math.pow(2, G);
  const z = lerp(1.0, 0.36, clamp(G / (6 + n)));
  cam(s, { x: W / 2, y: H / 2 + 60, z: z * (1 + 0.04 * pulseAt(t, flt.start, 0.2)), r: 0 });
  const per = Math.ceil(Math.sqrt(count * 2.2));
  for (let i = 0; i < (G === 0 ? 0 : count); i++) {
    const q = i % per, r = Math.floor(i / per);
    const rowsN = Math.ceil(count / per);
    const x = W / 2 + (q - (per - 1) / 2) * 190, y = H / 2 + 60 + (r - (rowsN - 1) / 2) * 140 + 380 / z;
    const born = i < count / 2 ? 0 : pulseAt(t, trs.start + (G - 1) * Math.max(0.12, (flt.start - trs.start) / (5 + n)), 0.2);
    tractor(s, x, y, 1.1, 1, born, G < 5);
  }
  if (G === 0) tractor(s, W / 2, H / 2 + 300, 4.2, prog(t, tr.start - 0.05, tr.start + 0.25, ease.outBack), 0, true);
  // the words stay screen-sized: counter-scale the camera for the type
  cam(s, { x: W / 2, y: H / 2, z: 1, r: 0 });
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = col('ink', 0.7 * clamp(G / 3)); c.fillRect(0, 100, W, 330); c.restore();
  lyric(s, upto(l, /now/i), 200, { width: 1300, max: 100 });
  lyric(s, from(l, /now/i).slice(0, -1), 340, { width: 1100, max: 80, anno: false });
  word(s, flt, 'FLEET.', A(125, 900), sizeTo('FLEET.', A(125, 900), 1300, 360), W / 2, 760, { sc: slam(flt, t, 2.2) });
  note(c, `×${count.toLocaleString('en-US')}`, W - 150, 980, t > trs.start ? 1 : 0, 34, 'signal', 'right');
  void bld;
}

// YOUR BOTTLENECK'S A SPEED BUMP ON A HYPERBOLIC ROUTE: the camera drives the acid curve; the bump is tiny
function hyper(s: S) {
  const { t, sh, c } = s;
  const l = ln(s);
  const ws = l.words;
  const pts = hyperPts(0, 900, 4200, 900, 1.2, 200);
  const us = ws.map((_, i) => 0.05 + (i / (ws.length - 1)) * 0.9);
  const pos = us.map((u) => along(pts, u));
  const times = [sh.start, ...ws.map((w) => w.start - 0.07)];
  const targets = [{ x: pos[0]!.x + 200, y: pos[0]!.y - 100, z: 1, r: 0 }, ...pos.map((p) => ({ x: p.x + 40, y: p.y - 140, z: 0.92, r: -clamp(p.a, -0.6, 0.6) * 0.5 }))];
  cam(s, snapCam(t, times, targets, 0.38));
  // the road: double line + dashed centre
  const last = ws[ws.length - 1]!;
  const k = prog(t, sh.start, last.end + 0.2, ease.linear);
  strokePts(c, pts, 1, col('graphite', 0.6), 26);
  strokePts(c, pts, k, col('acid', 0.95), 6); strokePts(s.g, pts, k, col('acid', 0.4), 18);
  // the speed bump under BOTTLENECK'S: a tiny hump
  const bi = ws.findIndex((w) => /bottleneck/i.test(w.w)), bp = pos[Math.max(0, bi)]!;
  c.fillStyle = col('signal', 0.9); c.beginPath(); c.ellipse(bp.x, bp.y - 2, 26, 9, bp.a, Math.PI, TAU); c.fill();
  ws.forEach((w, i) => {
    const p = pos[i]!;
    const big = /hyperbolic|route|speed|bump/i.test(w.w);
    const tiny = /bottleneck/i.test(w.w);
    const sz = tiny ? 34 : big ? 120 : 70;
    word(s, w, txt(w), tiny ? F.mono(600) : A(/hyperbolic/i.test(w.w) ? 62 : 100, 900), sz, p.x, p.y - 40 - sz * 0.4, { rot: clamp(p.a, -0.6, 0.6), sc: slam(w, t, tiny ? 1 : 1.5), ghost: 0.12 });
  });
}

// YOUR CONSTRAINTS ARE FOOTNOTES …: superscripts fall to the foot of the page; OUT OF DATE strikes them through
const NOTES = ['¹ Power: grid interconnect queue, 4–7 yrs (2023).', '² Data: the internet runs out by 2026 (2022).', '³ Chips: export controls hold the line (2023).', '⁴ Capital: nobody will fund a $100B cluster (2021).', '⁵ Reasoning: transformers cannot plan (2023).'];
function footnotes(s: S) {
  const { t, c } = s;
  const l = ln(s);
  const n = nOf(s);
  hold(s, 1.0, 1.03);
  const fn = l.words.filter((w) => /footnote/i.test(w.w));
  const outIdx = l.words.findIndex((w) => /out/i.test(clean(w.w)));
  const date = l.words.find((w) => /date|rules/i.test(w.w)) ?? l.words[l.words.length - 1]!;
  const head = outIdx > 0 ? l.words.slice(0, outIdx) : l.words.slice(0, Math.ceil(l.words.length / 2));
  const tail = outIdx > 0 ? l.words.slice(outIdx) : l.words.slice(head.length);
  const rr = lyric(s, head, 330, { width: 1600, max: 120 });
  // superscripts fly off the words to the foot
  const fk = fn.length ? prog(t, fn[0]!.start, fn[0]!.start + 0.6, ease.inOutCubic) : 0;
  for (let i = 0; i < 3 + n - 1 && i < NOTES.length; i++) {
    const sx = W / 2 + (rr ? rr.xs[Math.min(rr.xs.length - 1, 1 + i)]! : 0) + 40, sy = 250;
    const tx = 180, ty = 760 + i * 46;
    const k = prog(fk, i * 0.12, 0.6 + i * 0.12);
    label(s, String(i + 1), A(100, 900), lerp(70, 26, k), lerp(sx, tx - 20, k), lerp(sy, ty - 10, k), col('signal', 1));
    if (k > 0.9) {
      note(c, NOTES[i]!.slice(2), tx + 10, ty, prog(k, 0.9, 1), 28, 'ash');
      // struck through when the line says they're out of date
      const sk = prog(t, date.start + i * 0.07, date.start + i * 0.07 + 0.25, ease.outExpo);
      setFont(c, F.mono(500), 28); const wd = c.measureText(NOTES[i]!.slice(2)).width;
      rule(c, tx + 10, ty - 9, tx + 10 + wd, ty - 9, sk, col('signal', 1), 4);
    }
  }
  rule(c, 160, 700, 760, 700, fk, col('graphite', 0.8), 2);
  lyric(s, tail, 560, { width: 1300, max: 100, anno: false });
}

// THE CURVE DON'T WAIT FOR REFEREES, IT JUST COMPOUNDS THE RATE: the curve leaves the frame; the referees stay small.
// Choruses 1-2 (n < 3): a gentle exponential with the camera drifting up. Final chorus (n >= 3): LIFTOFF — see liftoff().
function compound(s: S) {
  if (nOf(s) >= 3) return liftoff(s);
  const { t, sh, c, g } = s;
  const all = sh.lines.flatMap((l) => l.words);
  const n = nOf(s);
  const ref = all.find((w) => /referee/i.test(w.w)) ?? all[0]!;
  const comp = all.find((w) => /compound/i.test(w.w)) ?? all[all.length - 2]!;
  const rate = all[all.length - 1]!;
  const up = prog(t, comp.start - 0.2, sh.end, ease.inQuad);
  cam(s, { x: W / 2 + 200 * up, y: H / 2 - 900 * up, z: lerp(1, 0.75, up), r: -0.04 * up });
  const pts: [number, number][] = []; for (let i = 0; i <= 120; i++) { const u = i / 120; pts.push([150 + u * 1700, 960 - (Math.exp(u * 4.2) - 1) / (Math.exp(4.2) - 1) * 2300]); }
  const k = prog(t, sh.start, rate.end + 0.3, ease.inOutQuad);
  strokePts(c, pts, k, col('acid', 1), 7); glowPts(s, pts, k, 'acid', 20, 0.45);
  for (let d = 1; d <= 6 + 2 * n; d++) {
    const u = Math.log(1 + (Math.pow(2, d) / Math.pow(2, 6 + 2 * n)) * (Math.exp(4.2) - 1)) / 4.2;
    if (u > k) break;
    const p = along(pts, u);
    note(c, `×${Math.pow(2, d)}`, p.x - 20, p.y, 0.9, 26, 'signal', 'right');
    g.fillStyle = col('ember', 0.6); g.beginPath(); g.arc(p.x, p.y, 10, 0, TAU); g.fill();
  }
  referees(s, ref, 1);
  const ci = all.findIndex((w) => /^it$/i.test(clean(w.w)) || /compound/i.test(w.w));
  const head = all.slice(0, ci > 0 ? ci : Math.ceil(all.length / 2));
  const tail = all.slice(head.length);
  lyric(s, head, 240, { width: 1500, max: 110, alpha: 1 - prog(up, 0.08, 0.25) });
  const ty = H / 2 - 900 * up + 220 / lerp(1, 0.75, up), tx = W / 2 + 200 * up - 180;
  if (tail.length) row(s, tail, A(125, 900), 1300 / lerp(1, 0.75, up), 190 / lerp(1, 0.75, up), tx, ty, { from: 1.6 });
}

/** Three small referees with a flag at the foot of the curve (scale k keeps them readable when the camera zooms out). */
function referees(s: S, ref: Word, k: number) {
  const { t, c } = s;
  const rk = prog(t, ref.start - 0.05, ref.start + 0.3, ease.outBack);
  if (rk <= 0) return;
  for (let i = 0; i < 3; i++) {
    const x = 260 + i * 90 * k, y = 1000;
    c.save(); c.translate(x, y); c.scale(k, k);
    c.strokeStyle = col('bone', 0.8 * rk); c.lineWidth = 5; c.beginPath(); c.arc(0, -90, 14, 0, TAU); c.moveTo(0, -76); c.lineTo(0, -30); c.lineTo(-16, 0); c.moveTo(0, -30); c.lineTo(16, 0); c.moveTo(0, -60); c.lineTo(30, -90); c.stroke();
    c.fillStyle = col('signal', rk); c.fillRect(30, -110, 26, 18);
    c.restore();
  }
}

/**
 * FINAL CHORUS LIFTOFF ("…referees. / It just compounds the rate."): a far steeper exponential (e^9 over 16,000 px) whose
 * pen accelerates — slow along the floor through line 1, then inCubic over the held "compounds" — while the camera chases
 * the pen head and pulls out (zoom 1 → 0.16) so the whole curve reads as a wall. COMPOUNDS rides the head with an
 * accelerating echo trail and speed streaks; the doubling counter races to ×2^24; THE RATE lands with a hit at the top.
 */
const LK = 9, LH = 16000, LX0 = 150, LW = 2600;
const liftY = (u: number) => 960 - LH * (Math.exp(LK * u) - 1) / (Math.exp(LK) - 1);
const liftX = (u: number) => LX0 + LW * u;
function liftoff(s: S) {
  const { t, sh, c, g } = s;
  const all = sh.lines.flatMap((l) => l.words);
  const ref = all.find((w) => /referee/i.test(w.w)) ?? all[0]!;
  const it = all.find((w) => /^it$/i.test(clean(w.w))) ?? all[Math.max(0, all.length - 5)]!;
  const comp = all.find((w) => /compound/i.test(w.w)) ?? all[all.length - 3]!;
  const rate = all[all.length - 1]!;
  const tEnd = Math.max(rate.end, rate.start + 0.25);
  // pen progress u: creeps along the floor during line 1, then accelerates hard through "it just compounds the rate"
  const uAt = (tt: number) => (tt < it.start ? 0.5 * prog(tt, sh.start, it.start, ease.outQuad) : 0.5 + 0.5 * prog(tt, it.start, tEnd, (x) => x * x * x));
  const u = uAt(t);
  const hx = liftX(u), hy = liftY(u), height = 960 - hy;
  const vel = (960 - liftY(uAt(t + 1 / 30)) - height) * 30; // px/s of climb (for streaks + stretch)
  // camera: chase the head (head sits in the upper third), zoom out with height so the curve becomes a steep wall
  // frame the whole curve, floor to pen: as it climbs the view pulls back and the curve reads as a steepening wall
  const z = Math.min(1, 800 / (height + 260), 1500 / (hx - LX0 + 360));
  const camX = Math.min((LX0 - 120 + hx + 160) / 2, hx - 520 / z), camY = (980 + hy - 120) / 2;
  const shakeK = clamp(vel / 20000);
  const rot = -0.04 * clamp(height / 4000);
  cam(s, { x: camX, y: camY, z, r: rot });
  const at = (dx: number, dy: number) => [hx + dx / z, hy + dy / z] as const; // screen-px offsets from the pen head
  const lw = (px: number) => px / Math.sqrt(z) / Math.sqrt(z); // keep strokes screen-visible while zooming out
  // the curve (drawn up to u) + a faint projection of where it is going
  const pts: [number, number][] = []; for (let i = 0; i <= 220; i++) { const q = (i / 220) * u; pts.push([liftX(q), liftY(q)]); }
  const fut: [number, number][] = []; for (let i = 0; i <= 80; i++) { const q = u + (i / 80) * (1 - u); fut.push([liftX(q), liftY(q)]); }
  strokePts(c, fut, 1, col('graphite', 0.35), lw(2));
  strokePts(c, pts, 1, col('acid', 1), lw(7)); strokePts(g, pts, 1, col('acid', 0.5), lw(22));
  // the floor (the "normal" baseline) and the referees left on it
  rule(c, -400, 960, LX0 + LW + 600, 960, 1, col('graphite', 0.8), lw(2));
  // altitude rungs (×10 each): they compress and stream past as the view pulls back — the sense of climbing
  for (let e = 1; e <= 6; e++) {
    const y = 960 - 25 * Math.pow(10, e * 0.62) * 6; if (y < hy - 400 / z) break;
    rule(c, LX0 - 200 / z, y, LX0 + LW + 300, y, 1, col('graphite', 0.45), lw(1.5));
    note(c, `10^${18 + 2 * e} FLOP`, LX0 - 60 / z, y - 8 / z, 0.7, 18 / z, 'ash', 'left');
  }
  referees(s, ref, Math.min(4, 1 / Math.sqrt(z)));
  // doublings: ×2 … ×2^24, each popping as the pen passes it; labels keep a constant screen size
  for (let d = 1; d <= 24; d++) {
    const ud = Math.log(1 + (Math.pow(2, d) / Math.pow(2, 24)) * (Math.exp(LK) - 1)) / LK;
    if (ud > u) break;
    const x = liftX(ud), y = liftY(ud), pop = pulseAt(t, it.start + (ud - 0.5) / 0.5 * (tEnd - it.start), 0.15);
    const tsz = (22 + 18 * pop) / z;
    note(c, `×${Math.pow(2, d).toLocaleString('en-US')}`, x - 24 / z, y + 8 / z, 0.9, tsz, d > 16 ? 'ember' : 'signal', 'right');
    g.fillStyle = col('ember', 0.5 + 0.5 * pop); g.beginPath(); g.arc(x, y, (8 + 14 * pop) / z, 0, TAU); g.fill();
  }
  // speed streaks below the head, denser and longer as it accelerates
  const ns = Math.floor(40 * shakeK);
  for (let i = 0; i < ns; i++) {
    const ox = (hash(i, 1) - 0.5) * 1400 / z, len = (200 + 900 * hash(i, 2)) * shakeK / z, oy = hash(i, 3, Math.floor(t * 30)) * 900 / z;
    rule(g, hx + ox, hy + oy, hx + ox, hy + oy + len, 1, col(i % 3 ? 'acid' : 'ember', 0.25 + 0.3 * shakeK), lw(3));
  }
  // the pen head
  g.fillStyle = col('ember', 0.9); g.beginPath(); g.arc(hx, hy, 26 / z, 0, TAU); g.fill();
  c.fillStyle = col('ember', 1); c.beginPath(); c.arc(hx, hy, 10 / z, 0, TAU); c.fill();
  // --- typography (sized in screen pixels: world size = px / z)
  const head = all.slice(0, all.indexOf(it));
  const a1 = 1 - prog(t, it.start - 0.1, it.start + 0.4);
  if (a1 > 0) { cam(s, { x: W / 2, y: H / 2, z: 1, r: 0 }); lyric(s, head, 240, { width: 1500, max: 110, alpha: a1 }); cam(s, { x: camX, y: camY, z, r: rot }); }
  // IT JUST: small, left behind on the floor where the climb starts
  const itJust = all.slice(all.indexOf(it), all.indexOf(comp));
  itJust.forEach((w, i) => { const [x, y] = at(-760 + i * 150, -40); word(s, w, txt(w), A(62, 300), 70 / z, x, y, { sc: slam(w, t, 1.4), alpha: 1 - prog(t, comp.start + 0.2, comp.start + 0.7) }); });
  // COMPOUNDS rides the head; an echo trail of past positions shows the acceleration
  if (t >= comp.start - 0.06) {
    const fam = A(125, 900), spx = sizeTo('COMPOUNDS', fam, 1180, 220), px = spx / z;
    const [cx0, cy0] = at(-40 - 590, 110);
    // echo trail: where the word was a moment ago, in screen space (it streaks down as the climb accelerates)
    for (let e = 4; e >= 1; e--) word(s, null, 'COMPOUNDS', fam, px, cx0, cy0 + (e * 70 * shakeK) / z, { color: col('signal', 0.1 * (5 - e) * clamp(shakeK * 2.5)) });
    const stretch = 1 + 0.5 * shakeK;
    c.save(); g.save();
    for (const ctx of [c, g]) { ctx.translate(cx0, cy0); ctx.scale(1, stretch); ctx.translate(-cx0, -cy0); }
    word(s, comp, 'COMPOUNDS', fam, px, cx0, cy0, { sc: slam(comp, t, 2.2), glow: 1.4 });
    c.restore(); g.restore();
  }
  // THE RATE: lands at the top as the curve leaves the frame; the multiplier spins past a million
  const the = all[all.length - 2]!;
  if (t >= the.start - 0.06 && the !== comp) { const [x, y] = at(-960, 330); word(s, the, 'THE', A(62, 300), 100 / z, x, y, { sc: slam(the, t, 1.4) }); }
  if (t >= rate.start - 0.06) {
    const [x, y] = at(-330, 380);
    word(s, rate, 'RATE', A(125, 900), 300 / z, x, y, { sc: slam(rate, t, 2.6), glow: 1.6 });
    const mult = Math.pow(2, Math.min(40, 20 + Math.floor((t - rate.start) * 60)));
    const [mx, my] = at(-40, 560);
    note(c, `×${mult.toLocaleString('en-US')}`, mx, my, 1, 34 / z, 'ember', 'right');
  }
  const hit = pulseAt(t, rate.start, 0.12) + 0.5 * pulseAt(t, comp.start, 0.12);
  s.post.flash = 0.12 * pulseAt(t, rate.start, 0.12);
  s.post.shake = [noise1(t * 60, 3) * (6 * shakeK + 16 * hit), noise1(t * 60, 4) * (6 * shakeK + 16 * hit)];
  s.post.zoom = (s.post.zoom ?? 1) * (1 + 0.04 * hit);
  s.bg.glow = 0.35 + 0.5 * shakeK;
}

/**
 * The ORACLE: an original 2.5D speaking machine — a rack monolith (oblique side + top faces) with blinking blade units, a
 * ringed speaker grille that pulses with the voice, and a plinth whose inscription is COMPUTE. "Thus" and "spoke" are
 * spoken: they leave the grille on sound-wave arcs and settle either side of it; COMPUTE ignites on the plinth.
 * The second statement re-speaks over the first (which drifts outward, smaller), and the camera pushes into the grille.
 * n grows the machine's blades/halo and adds background machines (compute replicating).
 */
function machine(s: S, cx: number, top: number, sc: number, a: number, speak: number, lit: number, seed: number, flat = false) {
  const { c, g, t } = s;
  const fw_ = 520 * sc, fh = 680 * sc, dx = 70 * sc, dy = -44 * sc, x0 = cx - fw_ / 2;
  c.save(); c.globalAlpha = a;
  // side + top faces (oblique projection, darker) then the front
  c.fillStyle = col('ink', 1); c.beginPath(); c.moveTo(x0 + fw_, top); c.lineTo(x0 + fw_ + dx, top + dy); c.lineTo(x0 + fw_ + dx, top + fh + dy); c.lineTo(x0 + fw_, top + fh); c.closePath(); c.fill();
  c.fillStyle = col('graphite', 0.55); c.beginPath(); c.moveTo(x0, top); c.lineTo(x0 + dx, top + dy); c.lineTo(x0 + fw_ + dx, top + dy); c.lineTo(x0 + fw_, top); c.closePath(); c.fill();
  c.fillStyle = col('ink2', 1); c.fillRect(x0, top, fw_, fh);
  c.strokeStyle = col('graphite', 1); c.lineWidth = 3 * sc; c.strokeRect(x0, top, fw_, fh);
  c.beginPath(); c.moveTo(x0 + fw_, top); c.lineTo(x0 + fw_ + dx, top + dy); c.lineTo(x0 + fw_ + dx, top + fh + dy); c.lineTo(x0 + fw_, top + fh); c.moveTo(x0, top); c.lineTo(x0 + dx, top + dy); c.lineTo(x0 + fw_ + dx, top + dy); c.stroke();
  if (flat) { c.restore(); return; }
  // blade units: 3 above the grille, 4 below; LEDs blink (hash of time), more of them lit as `lit` grows
  const gy = top + fh * 0.44, R = 150 * sc;
  const blades = [0.05, 0.13, 0.21, 0.69, 0.77, 0.85, 0.93];
  blades.forEach((b, bi) => {
    const y = top + fh * b - 18 * sc;
    c.fillStyle = col('ink', 1); c.fillRect(x0 + 24 * sc, y, fw_ - 48 * sc, 38 * sc);
    for (let q = 0; q < 16; q++) {
      const on = hash(bi, q, Math.floor(t * 12) + seed) < 0.25 + 0.6 * lit;
      c.fillStyle = col(on ? (q % 5 ? 'signal' : 'acid') : 'graphite', on ? 0.95 : 0.5); c.fillRect(x0 + 40 * sc + q * 27 * sc, y + 14 * sc, 14 * sc, 10 * sc);
      if (on) { g.fillStyle = col(q % 5 ? 'ember' : 'acid', 0.25); g.fillRect(x0 + 40 * sc + q * 27 * sc, y + 14 * sc, 14 * sc, 10 * sc); }
    }
  });
  // the grille: concentric rings that swell with the voice, a vertical aperture that glows while speaking
  const sw = 1 + 0.08 * speak;
  for (let r = 0; r < 7; r++) {
    c.strokeStyle = col(r === 6 ? 'bone' : 'graphite', r === 6 ? 0.8 : 0.9); c.lineWidth = (r === 6 ? 5 : 3) * sc;
    c.beginPath(); c.arc(cx, gy, R * sw * (0.3 + r * 0.115), 0, TAU); c.stroke();
  }
  const ah = R * (0.25 + 0.75 * speak);
  c.fillStyle = mix('graphite', 'signal', speak); c.fillRect(cx - 9 * sc, gy - ah, 18 * sc, ah * 2);
  g.fillStyle = col('ember', 0.7 * speak); g.fillRect(cx - 16 * sc, gy - ah, 32 * sc, ah * 2);
  g.strokeStyle = col('signal', 0.35 * speak); g.lineWidth = 10 * sc; g.beginPath(); g.arc(cx, gy, R * sw, 0, TAU); g.stroke();
  c.restore();
}
function oracle(s: S) {
  const { t, sh, c, g } = s;
  const l = ln(s);
  const n = nOf(s), v = sh.o.v ?? 0;
  const ws = l.words;
  const A3 = ws.slice(0, 3), B3 = ws.slice(3, 6);
  const second = B3.length ? prog(t, B3[0]!.start - 0.12, B3[0]!.start + 0.25, ease.outExpo) : 0;
  s.bg.glow = 0.45 + 0.15 * n; s.bg.gx = 0.5; s.bg.gy = 0.38;
  const GX = W / 2, TOP = 122, GY = TOP + 680 * 0.44;
  // camera: holds on the monolith, pushes into the grille on the second statement; mirrored tilt on the second chorus pass
  cam(s, { x: GX, y: lerp(H / 2, H / 2 + 30, second), z: lerp(1.0, 1.05, second) * (1 + 0.03 * prog(t, sh.start, sh.end)), r: (v ? 0.015 : -0.015) * (1 - second) });
  const speakAt = (w?: Word) => (w ? (t >= w.start - 0.03 && t < w.end + 0.08 ? 1 : pulseAt(t, w.end + 0.08, 0.1)) : 0);
  const voice = clamp(s.au.env('vocal', t));
  const speak = Math.max(...ws.map((w) => speakAt(w)), 0) * (0.6 + 0.4 * voice);
  const hit = Math.max(...ws.map((w) => (/compute/i.test(w.w) ? pulseAt(t, w.start, 0.2) : 0)), 0);
  // halo rays behind the machine
  const rays = 18 + 18 * n;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * TAU + t * 0.04 * (v ? -1 : 1);
    const len = (650 + hash(i, 5, n) * 800) * (0.55 + 0.45 * prog(t, A3[2]?.start ?? sh.start, (A3[2]?.start ?? sh.start) + 0.4, ease.outExpo));
    g.strokeStyle = col('signal', 0.03 + 0.02 * n + 0.08 * hit); g.lineWidth = 6 + hash(i, 2) * 12;
    g.beginPath(); g.moveTo(GX + Math.cos(a) * 420, GY + Math.sin(a) * 420); g.lineTo(GX + Math.cos(a) * len * 1.3, GY + Math.sin(a) * len); g.stroke();
  }
  // background machines: compute replicating (flat silhouettes, more each chorus)
  for (let i = 0; i < 2 * (n - 1); i++) {
    const side = i % 2 ? 1 : -1, k = 1 + Math.floor(i / 2);
    machine(s, GX + side * (430 + 260 * k), TOP + 120 + 70 * k, 0.55 / k, 0.55, 0, 0, i, true);
  }
  // the plinth, with the inscription line
  const py = TOP + 680 + 20, ph = 230;
  c.fillStyle = col('ink2', 1); c.fillRect(GX - 760, py, 1520, ph); c.strokeStyle = col('graphite', 1); c.lineWidth = 3; c.strokeRect(GX - 760, py, 1520, ph);
  c.fillStyle = col('graphite', 0.6); c.beginPath(); c.moveTo(GX - 760, py); c.lineTo(GX - 720, py - 26); c.lineTo(GX + 800, py - 26); c.lineTo(GX + 760, py); c.closePath(); c.fill();
  machine(s, GX, TOP, 1, 1, speak, clamp(prog(t, sh.start, sh.end) + 0.3 * (n - 1)), n);
  // sound waves: arcs leave the grille on every spoken word ("Thus", "spoke")
  for (const w of ws.filter((x) => !/compute/i.test(x.w))) {
    const age = t - w.start;
    if (age < 0 || age > 0.9) continue;
    for (const side of [-1, 1]) {
      const r = 170 + age * 900, al = 0.7 * (1 - age / 0.9);
      c.strokeStyle = col('bone', al * 0.6); c.lineWidth = 4; c.beginPath(); c.arc(GX, GY, r, side < 0 ? Math.PI - 0.5 : -0.5, side < 0 ? Math.PI + 0.5 : 0.5); c.stroke();
      g.strokeStyle = col('signal', al * 0.5); g.lineWidth = 8; g.beginPath(); g.arc(GX, GY, r, side < 0 ? Math.PI - 0.5 : -0.5, side < 0 ? Math.PI + 0.5 : 0.5); g.stroke();
    }
  }
  // spoken words: fly out of the aperture to either side of the machine
  const fs = F.serif(600, true);
  const spoken = (w: Word | undefined, text: string, side: number, out: number) => {
    if (!w || t < w.start - 0.06) return;
    const k = prog(t, w.start - 0.06, w.start + 0.35, ease.outExpo);
    const tx = GX + side * (560 + 90 * out), ty = GY + 10 - 230 * out;
    const x = lerp(GX, tx, k), y = lerp(GY, ty, k), sz = lerp(40, 170, k) * (1 - 0.5 * out);
    word(s, w, text, fs, sz, x, y, { alpha: 1 - 0.55 * out });
  };
  const out1 = second; // the first statement drifts outward and up when the second begins
  spoken(A3[0], 'Thus', -1, out1); spoken(A3[1], 'spoke', 1, out1);
  if (B3.length) { spoken(B3[0], 'Thus', -1, 0); spoken(B3[1], 'spoke', 1, 0); }
  // COMPUTE: the inscription on the plinth, lit by the sung word (the second statement re-ignites it)
  const fc = A(125, 900), csz = sizeTo('COMPUTE', fc, 1320, 260), cy = py + ph / 2;
  const c1 = A3[2], c2 = B3[2];
  const cur = c2 && t >= c2.start - 0.06 ? c2 : c1;
  if (cur) {
    if (t < cur.start - 0.06) word(s, null, 'COMPUTE', fc, csz, GX, cy, { color: col('graphite', 0.7) }); // carved, unlit
    else {
      word(s, cur, 'COMPUTE', fc, csz, GX, cy, { sc: slam(cur, t, cur === c2 ? 1.25 : 1.5), glow: 1.5 });
      // a white-hot sweep runs across the inscription as it ignites
      const sk = prog(t, cur.start, cur.start + 0.45, ease.outCubic);
      if (sk < 1) { const sx = GX - 660 + 1320 * sk; g.fillStyle = col('ember', 0.6 * (1 - sk)); g.fillRect(sx - 40, py + 10, 80, ph - 20); }
    }
  }
  s.post.flash = 0.06 * hit;
  s.post.shake = [noise1(t * 50, 3) * 10 * hit, noise1(t * 50, 4) * 10 * hit];
}

export const FURNACE = { takeoff, sarcasm, dynamo, factory, tasks, solow, hammer, robots, minds, fleet, hyper, footnotes, compound, oracle };
void base; void split; void sizeTo;
