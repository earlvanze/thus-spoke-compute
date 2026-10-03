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

// THE CURVE DON'T WAIT FOR REFEREES, IT JUST COMPOUNDS THE RATE: the curve leaves the frame; the referees stay small
function compound(s: S) {
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
  // doublings tick off the curve
  for (let d = 1; d <= 6 + 2 * n; d++) {
    const u = Math.log(1 + (Math.pow(2, d) / Math.pow(2, 6 + 2 * n)) * (Math.exp(4.2) - 1)) / 4.2;
    if (u > k) break;
    const p = along(pts, u);
    note(c, `×${Math.pow(2, d)}`, p.x - 20, p.y, 0.9, 26, 'signal', 'right');
    g.fillStyle = col('ember', 0.6); g.beginPath(); g.arc(p.x, p.y, 10, 0, TAU); g.fill();
  }
  // the referees: small figures with a flag, left at the start of the curve
  const rk = prog(t, ref.start - 0.05, ref.start + 0.3, ease.outBack);
  for (let i = 0; i < 3; i++) {
    const x = 260 + i * 90, y = 1000;
    c.strokeStyle = col('bone', 0.8 * rk); c.lineWidth = 5; c.beginPath(); c.arc(x, y - 90, 14, 0, TAU); c.moveTo(x, y - 76); c.lineTo(x, y - 30); c.lineTo(x - 16, y); c.moveTo(x, y - 30); c.lineTo(x + 16, y); c.moveTo(x, y - 60); c.lineTo(x + 30, y - 90); c.stroke();
    c.fillStyle = col('signal', rk); c.fillRect(x + 30, y - 110, 26, 18);
  }
  // the words: line words before "it" set at the start of the curve, "compounds the rate" climbs with it
  const ci = all.findIndex((w) => /^it$/i.test(clean(w.w)) || /compound/i.test(w.w));
  const head = all.slice(0, ci > 0 ? ci : Math.ceil(all.length / 2));
  const tail = all.slice(head.length);
  lyric(s, head, 240, { width: 1500, max: 110, alpha: 1 - prog(up, 0.08, 0.25) });
  // the tail rides with the camera (screen-anchored), set big under the climbing curve
  const ty = H / 2 - 900 * up + 220 / lerp(1, 0.75, up), tx = W / 2 + 200 * up - 180;
  if (tail.length) row(s, tail, A(125, 900), 1300 / lerp(1, 0.75, up), 190 / lerp(1, 0.75, up), tx, ty, { from: 1.6 });
}

// THUS SPOKE COMPUTE: the hook as a monument — serif "Thus spoke" (the old voice), COMPUTE molten; rays grow with n
function oracle(s: S) {
  const { t, sh, c, g } = s;
  const l = ln(s);
  const n = nOf(s), v = sh.o.v ?? 0;
  const ws = l.words;
  const A3 = ws.slice(0, 3), B3 = ws.slice(3, 6);
  const second = B3.length ? prog(t, B3[0]!.start - 0.12, B3[0]!.start + 0.2, ease.outExpo) : 0;
  s.bg.glow = 0.5 + 0.2 * n;
  cam(s, { x: W / 2, y: H / 2, z: lerp(1.0, 0.82, second) * (1 + 0.05 * prog(t, sh.start, sh.end)), r: (v ? 0.02 : -0.02) * second });
  // rays
  const hit = Math.max(...ws.map((w) => (/compute/i.test(w.w) ? pulseAt(t, w.start, 0.2) : 0)), 0);
  const rays = 24 + 24 * n;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * TAU + t * 0.04 * (v ? -1 : 1);
    const len = (700 + hash(i, 5, n) * 900) * (0.6 + 0.4 * prog(t, A3[2]?.start ?? sh.start, (A3[2]?.start ?? sh.start) + 0.4, ease.outExpo));
    g.strokeStyle = col('signal', 0.04 + 0.03 * n + 0.08 * hit); g.lineWidth = 6 + hash(i, 2) * 14;
    g.beginPath(); g.moveTo(W / 2 + Math.cos(a) * 160, H / 2 + Math.sin(a) * 160); g.lineTo(W / 2 + Math.cos(a) * len, H / 2 + Math.sin(a) * len); g.stroke();
  }
  const draw = (tri: Word[], y0: number, scl: number, a: number) => {
    if (!tri.length) return;
    const [w1, w2, w3] = tri as [Word, Word, Word];
    const fs = F.serif(600, true), fc = A(125, 900);
    const ssz = 150 * scl, csz = sizeTo('COMPUTE', fc, 1500 * scl, 380 * scl);
    const t1 = measure('Thus', fs, ssz), t2 = measure('spoke', fs, ssz);
    word(s, w1, 'Thus', fs, ssz, W / 2 - (t1 + t2 + 40) / 2 + t1 / 2, y0 - csz * CAP / 2 - 70 * scl, { sc: slam(w1, t, 1.3), alpha: a });
    if (w2) word(s, w2, 'spoke', fs, ssz, W / 2 + (t1 + t2 + 40) / 2 - t2 / 2, y0 - csz * CAP / 2 - 70 * scl, { sc: slam(w2, t, 1.3), alpha: a });
    if (w3) {
      const kk = t >= w3.start - 0.06;
      if (kk) word(s, w3, 'COMPUTE', fc, csz, W / 2, y0 + 40 * scl, { sc: slam(w3, t, 1.9), alpha: a, glow: 1.4 });
    }
  };
  // first statement; the second one stacks underneath while the first recedes (the hook replicates too)
  draw(A3, lerp(H / 2, H / 2 - 260, second), lerp(1, 0.7, second), lerp(1, 0.5, second));
  if (B3.length && t > B3[0]!.start - 0.12) draw(B3, H / 2 + 260 * second, 0.95, 1);
  s.post.flash = 0.06 * hit;
  s.post.shake = [noise1(t * 50, 3) * 10 * hit, noise1(t * 50, 4) * 10 * hit];
  void c;
}

export const FURNACE = { takeoff, sarcasm, dynamo, factory, tasks, solow, hammer, robots, minds, fleet, hyper, footnotes, compound, oracle };
void base; void split; void sizeTo;
