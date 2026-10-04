// Shared helpers for this video's compositions (pure functions of s.t, see WORKFLOW.md §5).
import { W, H } from '../engine/gl';
import { F, measure } from '../engine/type';
import type { Line, Word } from '../engine/lyrics';
import { clamp, ease, lerp, prog, TAU } from '../engine/util';
import { A, CAP, clean, col, mix, note, rule, setFont } from '../scenes/kit';
import { base, cam, hotK, slam, txt, word, type S } from '../scenes/shots';
import { row, findW, last } from '../scenes/typeset';

export { W, H, F, measure, clamp, ease, lerp, prog, TAU, A, CAP, clean, col, mix, note, rule, setFont, base, cam, hotK, slam, txt, word, row, findW, last };
export type { S, Line, Word };

/** Line i of the shot (falls back to the last one). */
export const ln = (s: S, i = 0) => s.sh.lines[Math.min(i, s.sh.lines.length - 1)]!;
/** Word matching re in line l (fallback: last word). */
export const fw = (l: Line, re: RegExp) => findW(l, re);
/** The accent colour for drawings: blood on paper, signal in the furnace. */
export const acc = (s: S) => (s.paper ? 'blood' : 'signal');
/** Dim drawing colour. */
export const dim = (s: S) => (s.paper ? 'graphite' : 'graphite');
/** Static screen camera with a slow push (z0 -> z1 over the shot) and an optional tilt. */
export function hold(s: S, z0 = 1, z1 = 1.04, r = 0, x = W / 2, y = H / 2) {
  const k = prog(s.t, s.sh.start, s.sh.end);
  cam(s, { x, y, z: lerp(z0, z1, k), r });
}
/** A lyric row in the Swiss setting: content words heavy, small words light, hairline + mono index. */
export function lyric(s: S, ws: Word[], y: number, o: { width?: number; max?: number; fam?: string; x?: number; align?: 'l' | 'r' | 'c'; alpha?: number; from?: number; anno?: boolean; base?: any; hot?: any } = {}) {
  return row(s, ws, o.fam ?? A(100, 900), o.width ?? 1500, o.max ?? 150, o.x ?? W / 2, y, { align: o.align, alpha: o.alpha, from: o.from, anno: o.anno, base: o.base, hot: o.hot });
}
/** Split a line into rows of words (by a word index list of breaks) for multi-row settings. */
export function split(l: Line, at: number[]): Word[][] {
  const out: Word[][] = []; let p = 0;
  for (const a of [...at, l.words.length]) { if (a > p) out.push(l.words.slice(p, a)); p = a; }
  return out;
}
/** Index of the first word matching re (or -1). */
export const idx = (l: Line, re: RegExp) => l.words.findIndex((w) => re.test(clean(w.w)));
/** Words of l from the first match of re (inclusive) to the end, or up to (exclusive) another match. */
export function from(l: Line, re: RegExp, to?: RegExp) {
  const a = Math.max(0, idx(l, re)); const b = to ? idx(l, to) : -1;
  return l.words.slice(a, b > a ? b : l.words.length);
}
export function upto(l: Line, re: RegExp) { const b = idx(l, re); return l.words.slice(0, b < 0 ? l.words.length : b); }
/** Monospace typewriter text revealed between t0 and t1 (with a block cursor while typing). */
export function typeOn(s: S, text: string, x: number, y: number, t0: number, t1: number, size = 30, color: string = 'ash', align: CanvasTextAlign = 'left', a = 1) {
  const { c, t } = s;
  if (t < t0 || a <= 0) return 0;
  const n = Math.round(clamp((t - t0) / Math.max(0.05, t1 - t0)) * text.length);
  setFont(c, F.mono(500), size); c.textAlign = align; c.textBaseline = 'alphabetic';
  c.fillStyle = col(color, a); c.fillText(text.slice(0, n), x, y);
  const w = c.measureText(text.slice(0, n)).width;
  if (n < text.length) { c.fillStyle = col(color, a * 0.8); c.fillRect(align === 'left' ? x + w + 3 : x + 3, y - size * 0.78, size * 0.55, size * 0.9); }
  return w;
}
/** Hand-drawn line reveal of a polyline (k = 0..1 of its length). */
export function strokePts(ctx: CanvasRenderingContext2D, pts: [number, number][], k: number, stroke: string, w = 3) {
  if (k <= 0 || pts.length < 2) return;
  const L: number[] = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1]! + Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]));
  const tot = L[L.length - 1]! * clamp(k);
  ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0]![0], pts[0]![1]);
  for (let i = 1; i < pts.length; i++) {
    if (L[i]! <= tot) ctx.lineTo(pts[i]![0], pts[i]![1]);
    else { const f = (tot - L[i - 1]!) / Math.max(1e-6, L[i]! - L[i - 1]!); ctx.lineTo(lerp(pts[i - 1]![0], pts[i]![0], f), lerp(pts[i - 1]![1], pts[i]![1], f)); break; }
  }
  ctx.stroke();
}
/** Point on a polyline at fraction k (with angle). */
export function along(pts: [number, number][], k: number) {
  const L: number[] = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1]! + Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]));
  const tot = L[L.length - 1]! * clamp(k);
  for (let i = 1; i < pts.length; i++) if (L[i]! >= tot) {
    const f = (tot - L[i - 1]!) / Math.max(1e-6, L[i]! - L[i - 1]!);
    return { x: lerp(pts[i - 1]![0], pts[i]![0], f), y: lerp(pts[i - 1]![1], pts[i]![1], f), a: Math.atan2(pts[i]![1] - pts[i - 1]![1], pts[i]![0] - pts[i - 1]![0]) };
  }
  const p = pts[pts.length - 1]!; return { x: p[0], y: p[1], a: 0 };
}
/** A rubber stamp that slams down at t0 (scale 2.2 -> 1, slight rotation). */
export function stamp(s: S, text: string, x: number, y: number, t0: number, size = 90, rot = -0.12, colr = 'blood') {
  const { c, t } = s;
  if (t < t0 - 0.03) return;
  const k = prog(t, t0 - 0.03, t0 + 0.12, ease.outQuad), sc = lerp(2.2, 1, k);
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc); c.globalAlpha = k;
  setFont(c, F.mono(700), size); const w = c.measureText(text).width;
  c.strokeStyle = col(colr, 0.9); c.lineWidth = size * 0.07; c.strokeRect(-w / 2 - size * 0.3, -size * 0.75, w + size * 0.6, size * 1.1);
  c.fillStyle = col(colr, 0.9); c.textAlign = 'center'; c.fillText(text, 0, size * 0.18);
  c.restore();
  s.post.shake = [Math.sin(t * 90) * 8 * (1 - k), Math.cos(t * 70) * 6 * (1 - k)];
}
/** Axis frame for paper charts. */
export function axes(s: S, x0: number, y0: number, w: number, h: number, k: number, labelX = '', labelY = '') {
  const c = s.c, cl = col(base(s), 0.85);
  rule(c, x0, y0, x0 + w, y0, k, cl, 3); rule(c, x0, y0, x0, y0 - h, k, cl, 3);
  for (let i = 1; i <= 10; i++) rule(c, x0 + (w * i) / 10, y0, x0 + (w * i) / 10, y0 + 12, k, cl, 2);
  if (labelX) note(c, labelX, x0 + w, y0 + 44, k, 22, s.paper ? 'graphite' : 'ash', 'right');
  if (labelY) note(c, labelY, x0 - 16, y0 - h - 14, k, 22, s.paper ? 'graphite' : 'ash', 'left');
}
/** Ink colour mixing for paper-aware drawings. */
export const inkA = (s: S, a = 1) => col(base(s), a);
/** Draw text centred with a given family and fill (no word timing). */
export function label(s: S, text: string, fam: string, size: number, x: number, y: number, fill: string, ctx = s.c, align: CanvasTextAlign = 'center', rot = 0) {
  ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot);
  setFont(ctx, fam, size); ctx.fillStyle = fill; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(text, 0, (CAP * size) / 2);
  ctx.restore();
}
/** Word as the object: draws the word w (timing-aware) and returns its measured width. */
export function wordAt(s: S, w: Word, fam: string, size: number, x: number, y: number, o: Parameters<typeof word>[7] = {}) {
  word(s, w, txt(w), fam, size, x, y, o);
  return measure(txt(w), fam, size);
}
export const sizeTo = (text: string, fam: string, width: number, max = 999) => Math.min(max, (100 * width) / Math.max(1, measure(text, fam, 100)));
export const pulseAt = (t: number, t0: number, hl = 0.12) => (t < t0 ? 0 : Math.pow(0.5, (t - t0) / hl));
export { mix as mixc, hotK as hot };

// ------------------------------------------------------------------ solids in one-point perspective
// Everything recedes toward ONE vanishing point fixed on screen (VP), whatever the camera or local transform: the VP is
// mapped into the current local coordinates through the inverse canvas transform. Depth d is in local units.
export const VP = { x: W / 2, y: 430, focal: 1500 };
export const OBL = { x: 0.62, y: -0.42 }; // kept for callers that still want an oblique offset
function localVP(ctx: CanvasRenderingContext2D) {
  const m = ctx.getTransform(), inv = m.inverse();
  const p = inv.transformPoint(new DOMPoint(VP.x, VP.y));
  const scale = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1;
  return { x: p.x, y: p.y, scale };
}
const recede = (d: number, scale: number) => { const ds = Math.max(0, d * scale); return ds / (ds + VP.focal); };
/** A solid box seen in one-point perspective: front face (x, y, w, h) and the side faces that recede toward the VP. */
export function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, d: number, front: string, side: string, top: string, edge?: string, lw = 2) {
  const v = localVP(ctx), k = recede(d, v.scale);
  const F_: [number, number][] = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const B = F_.map(([px, py]) => [px + (v.x - px) * k, py + (v.y - py) * k] as [number, number]);
  // faces: top (0-1), right (1-2), bottom (2-3), left (3-0); the ones facing away fall inside the front and are covered
  const faces: [number, number, string][] = [[0, 1, top], [1, 2, side], [2, 3, side], [3, 0, side]];
  for (const [i, j, fill] of faces) {
    ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(F_[i]![0], F_[i]![1]); ctx.lineTo(F_[j]![0], F_[j]![1]); ctx.lineTo(B[j]![0], B[j]![1]); ctx.lineTo(B[i]![0], B[i]![1]); ctx.closePath(); ctx.fill();
    if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = lw; ctx.stroke(); }
  }
  ctx.fillStyle = front; ctx.fillRect(x, y, w, h);
  if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, h); }
}
/** Solid type extruded toward the vanishing point, centred on (x, cap-centre y). */
export function solidText(ctx: CanvasRenderingContext2D, text: string, fam: string, size: number, x: number, y: number, depth: number, face: string, side: string, sc = 1) {
  if (sc <= 0.001) return;
  const v = localVP(ctx);
  const n = Math.max(2, Math.min(24, Math.round(depth / 2)));
  setFont(ctx, fam, size); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  for (let i = n; i >= 0; i--) {
    const k = recede((depth * i) / n, v.scale * sc);
    ctx.save(); ctx.translate(v.x, v.y); ctx.scale(1 - k, 1 - k); ctx.translate(-v.x, -v.y);
    ctx.translate(x, y); if (sc !== 1) ctx.scale(sc, sc);
    ctx.fillStyle = i === 0 ? face : side; ctx.fillText(text, 0, (CAP * size) / 2);
    ctx.restore();
  }
}

// ------------------------------------------------------------------ detonation + spark trail (ported from pdoom-video,
// MIT © Giacomo Magnanini: scenes/outro.ts detonation and scenes/_motifs.ts sparkParticles), recoloured to this palette
// and drawn on the Canvas2D layers: bone streaks on the base layer, hot streaks and rings on the glow layer.
import { mulberry32 as _mb32, hash as _hash, smoothstep as _ss } from '../engine/util';
/** pdoom's detonation at screen point (cx, cy): `age` seconds since the blast; rings on each of `rings` (times). */
export function detonation(s: S, cx: number, cy: number, age: number, rings: number[], fade = 1) {
  if (age < 0 || fade <= 0) return;
  const { c, g, t } = s;
  c.save(); g.save(); c.setTransform(1, 0, 0, 1, 0, 0); g.setTransform(1, 0, 0, 1, 0, 0);
  const rnd = _mb32(99), grow = ease.outExpo(clamp(age / 1.4));
  c.lineCap = 'round'; g.lineCap = 'round';
  for (let i = 0; i < 2600; i++) {
    const a = rnd() * TAU, sp = 0.2 + rnd() ** 2 * 1.4, r0 = rnd() * 40, len = 60 + rnd() * 380, hot = rnd() < 0.3;
    const r1 = r0 + grow * sp * 1400, tail = Math.max(r0, r1 - len * (0.3 + grow));
    const al = fade * (1 - grow * 0.4);
    const ctx = hot ? g : c;
    ctx.strokeStyle = hot ? col(i % 3 ? 'ember' : 'signal', al * 0.9) : col('bone', al * 0.75); ctx.lineWidth = hot ? 1.8 : 1;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * tail, cy + Math.sin(a) * tail); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke();
  }
  rings.forEach((tk, k) => {
    const ak = t - tk; if (ak < 0 || ak > 1.2) return;
    const R = ease.outCubic(ak / 1.2) * 1300;
    g.strokeStyle = col(k % 2 ? 'acid' : 'signal', (1 - ak / 1.2) * fade); g.lineWidth = 2.5 * (1 - ak / 1.2) + 0.8;
    g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke();
    c.strokeStyle = col('bone', 0.35 * (1 - ak / 1.2) * fade); c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
  });
  c.restore(); g.restore();
  s.post.flash = Math.max(s.post.flash ?? 0, Math.pow(0.5, age / 0.045) * 1.2 * fade);
  const sh = Math.pow(0.5, age / 0.4) * fade;
  s.post.shake = [Math.sin(t * 90) * 14 * sh, Math.cos(t * 77) * 14 * sh];
  void _ss;
}
/** pdoom's spark particles: streaks shed by a moving head (headAt(t) gives its position in the current transform). */
export function sparkTrail(s: S, headAt: (tt: number) => { x: number; y: number } | null, o: { rate?: number; life?: number; speed?: number; gravity?: number; seed?: number } = {}) {
  const { g, t } = s;
  const life = o.life ?? 0.45, speed = o.speed ?? 260, grav = o.gravity ?? 520, seed = o.seed ?? 1, rate = o.rate ?? 90;
  const n0 = Math.floor((t - life) * rate), n1 = Math.floor(t * rate);
  g.lineCap = 'round';
  for (let n = n0; n <= n1; n++) {
    const tb = n / rate; if (tb > t) continue;
    const age = t - tb, h = headAt(tb); if (!h) continue;
    const a = _hash(n, seed) * TAU, sp = speed * (0.25 + _hash(n, seed + 1) ** 2 * 1.2), lf = life * (0.35 + 0.65 * _hash(n, seed + 2));
    if (age > lf) continue;
    const vx = Math.cos(a) * sp, vy = Math.sin(a) * sp - speed * 0.3;
    const x = h.x + vx * age, y = h.y + vy * age + 0.5 * grav * age * age;
    const a0 = Math.max(0, age - 0.018), x0 = h.x + vx * a0, y0 = h.y + vy * a0 + 0.5 * grav * a0 * a0;
    const k = 1 - age / lf, heat_ = k * k;
    g.strokeStyle = heat_ > 0.5 ? col('ember', 0.9 * k) : col('signal', 0.9 * k); g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x, y); g.stroke();
  }
}
