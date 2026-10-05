// THE CRITICS and THE BUILDOUT: verse 2 (the wall, the clock, the off-ramp, the world model, the cat), verse 3 (the bubble,
// the rails), the bridge's proof machine, and verse 4 (Shenzhen, the assembly line, returns that learn, the rope).
// All drawings are original line art made of rules, arcs and type.
import {
  A, CAP, F, H, W, base, clamp, col, ease, from, fw, hold, label, lerp, ln, lyric, measure, mix, note, prog, rule, setFont, slam,
  strokePts, TAU, txt, typeOn, upto, word, along, sizeTo, pulseAt, stamp, type S, type Word,
box,
} from './common';
import { cam } from '../scenes/shots';
import { clean, heat, lerpCam, snapCam } from '../scenes/kit';
import { hash, noise1 } from '../engine/util';

/** Fixed screen camera (composition coords = screen coords) with a slow push. */
const scr = (s: S, z0 = 1, z1 = 1.04, r = 0) => hold(s, z0, z1, r);

// ------------------------------------------------------------------ V2: the wall (bricks are words) — takes gold, breaks through
function wall(s: S) {
  const { t, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const gold = fw(l2, /gold/i), brk = fw(l2, /breaking/i), thr = l2.words[l2.words.length - 1]!;
  const boom = prog(t, brk.start, brk.start + 0.9, ease.outCubic);
  scr(s, 1.0, 1.05);
  // the wall: 9 courses of bricks; the sung words of line 1 are laid as bricks, the rest are blank
  const bw = 200, bh = 70, x0 = 160, y0 = 980;
  const ws1 = l1.words;
  let wi = 0;
  for (let r = 0; r < 9; r++) for (let q = 0; q < 8 + (r % 2); q++) {
    const x = x0 + q * bw - (r % 2) * bw / 2, y = y0 - r * bh;
    if (x < 60 || x + bw > W - 60) continue;
    const isWord = r >= 5 && r <= 7 && q >= 2 && q <= 6 && wi < ws1.length && (r - 5) * 5 + (q - 2) === wi;
    const w = isWord ? ws1[wi++] : undefined;
    const tLay = w ? w.start : l1.start + (r * 9 + q) * 0.012;
    const k = prog(t, tLay - 0.1, tLay + 0.12, ease.outExpo);
    if (k <= 0) continue;
    // break-through: bricks near the hole fly outward
    const dx = x + bw / 2 - W / 2, dy = y - bh / 2 - 520, d = Math.hypot(dx, dy);
    const f = boom * clamp(1.3 - d / 600) * 900;
    const ox = (dx / (d + 1)) * f + noise1(r * 9 + q, 2) * 80 * boom, oy = (dy / (d + 1)) * f + 400 * boom * boom * clamp(1.3 - d / 600);
    c.save(); c.translate(x + bw / 2 + ox, y - bh / 2 - (1 - k) * 60 + oy); c.rotate(boom * (hash(r, q) - 0.5) * 3 * clamp(1.3 - d / 600));
    c.fillStyle = col('ink2', 1); c.strokeStyle = col('graphite', 0.9); c.lineWidth = 3;
    c.fillRect(-bw / 2 + 4, -bh / 2 + 4, bw - 8, bh - 8); c.strokeRect(-bw / 2 + 4, -bh / 2 + 4, bw - 8, bh - 8);
    c.restore();
    if (w) word(s, w, txt(w), A(87, 900), Math.min(46, sizeTo(txt(w), A(87, 900), bw - 24)), x + bw / 2 + ox, y - bh / 2 + oy, {});
  }
  // the gold medal on "gold"
  const gk = prog(t, gold.start - 0.05, gold.start + 0.35, ease.outBack);
  if (gk > 0.001) {
    // hung on the wall's face from a nail in the top course (y 400), right of the break-through, swinging as it lands
    const fall = 1 - boom, nx = 1650, ny = 400, swing = Math.sin((t - gold.start) * 9) * 0.25 * pulseAt(t, gold.start, 0.5);
    const mx = nx + Math.sin(swing) * 210, my = ny + Math.cos(swing) * 210 - (1 - gk) * 260 + boom * boom * 900;
    if (fall > 0.02 && gk > 0.001) {
      c.fillStyle = col('bone', 1); c.beginPath(); c.arc(nx, ny, 9, 0, TAU); c.fill();
      c.strokeStyle = col('signal', 1); c.lineWidth = 10; c.beginPath(); c.moveTo(nx - 6, ny); c.lineTo(mx - 40, my - 70); c.moveTo(nx + 6, ny); c.lineTo(mx + 40, my - 70); c.stroke();
      c.fillStyle = col('signal', 1); c.beginPath(); c.arc(mx, my, 92 * gk, 0, TAU); c.fill();
      c.strokeStyle = col('ember', 1); c.lineWidth = 5; c.beginPath(); c.arc(mx, my, 74 * gk, 0, TAU); c.stroke();
      g.fillStyle = col('ember', 0.45); g.beginPath(); g.arc(mx, my, 112 * gk, 0, TAU); g.fill();
      label(s, 'IMO', A(100, 900), 48 * gk, mx, my - 10, col('ink', 1));
      label(s, 'GOLD', F.mono(700), 20 * gk, mx, my + 34, col('ink', 1));
    }
  }
  // line 2 set at the top; THROUGH punches through the hole
  lyric(s, l2.words.slice(0, -1), 150, { width: 1600, max: 74, alpha: t > l2.start - 0.4 ? 1 : 0 });
  if (t >= brk.start - 0.04) word(s, thr, 'THROUGH', A(125, 900), 260 * lerp(0.35, 1, boom), W / 2, 520, { ghost: 1, sc: t >= thr.start - 0.06 ? slam(thr, t, 1.6) : 1 });
  s.post.shake = [noise1(t * 60, 1) * 20 * pulseAt(t, brk.start, 0.12), noise1(t * 60, 2) * 20 * pulseAt(t, brk.start, 0.12)];
}

// ------------------------------------------------------------------ V2: the wall should get tenure; every flub becomes a post
// An actual brick wall (running bond, mortar, per-brick tone, its ends receding in one-point perspective) on a ground line.
// A brass plaque on it reads THE WALL; on "tenure" a mortarboard drops onto the wall's top and TENURED is engraved.
// Line 2: post cards get pasted onto the wall one after another, each pinned, until ADVENTURE lands.
function brickWall(s: S, x0: number, y0: number, x1: number, y1: number) {
  const { c } = s;
  box(c, x0, y0, x1 - x0, y1 - y0, 160, col('blood', 1), mix('blood', 'ink', 0.55), mix('blood', 'ash', 0.25), col('ink', 0.5), 1.5);
  const bw = 120, bh = 46, m = 6;
  c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip();
  c.fillStyle = col('graphite', 1); c.fillRect(x0, y0, x1 - x0, y1 - y0); // mortar
  for (let r = 0; r * (bh + m) < y1 - y0; r++) for (let q = -1; q * (bw + m) < x1 - x0 + bw; q++) {
    const x = x0 + q * (bw + m) + (r % 2 ? (bw + m) / 2 : 0), y = y0 + r * (bh + m) + m / 2;
    const tone = hash(r, q, 11);
    c.fillStyle = mix('blood', tone > 0.5 ? 'ink2' : 'signal', 0.12 + 0.25 * Math.abs(tone - 0.5)); c.fillRect(x, y, bw, bh);
    c.fillStyle = col('bone', 0.07); c.fillRect(x, y, bw, 4); // lit top edge
    c.fillStyle = col('ink', 0.25); c.fillRect(x, y + bh - 5, bw, 5); // shadow lip
  }
  c.restore();
  rule(c, 0, y1, W, y1, 1, col('graphite', 1), 3); // the ground line
}
function tenure(s: S) {
  const { t, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const ten = fw(l1, /tenure/i), wl = fw(l1, /wall/i), adv = fw(l2, /adventure/i), fl = fw(l2, /flubs/i);
  cam(s, { x: W / 2, y: H / 2, z: 1 + 0.03 * prog(t, l1.start, l2.end), r: 0 });
  const wx0 = 220, wx1 = W - 220, wy0 = 380, wy1 = 900;
  brickWall(s, wx0, wy0, wx1, wy1);
  // brass plaque: THE WALL (the sung word), TENURED engraved on "tenure"
  const px = W / 2, py = 610, pw = 560, ph = 190;
  c.fillStyle = mix('ember', 'signal', 0.35); c.fillRect(px - pw / 2, py - ph / 2, pw, ph);
  c.strokeStyle = col('blood', 1); c.lineWidth = 4; c.strokeRect(px - pw / 2 + 10, py - ph / 2 + 10, pw - 20, ph - 20);
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) { c.fillStyle = col('blood', 1); c.beginPath(); c.arc(px + sx * (pw / 2 - 26), py + sy * (ph / 2 - 26), 7, 0, TAU); c.fill(); }
  word(s, wl, 'THE WALL', A(100, 900), 74, px, py - 22, { base: 'ink', hot: 'blood' });
  const tk = prog(t, ten.start - 0.05, ten.start + 0.45, ease.outCubic);
  if (tk > 0.001) {
    c.save(); c.beginPath(); c.rect(px - 200, py + 20, 400 * tk, 60); c.clip();
    label(s, 'TENURED · EST. 2022', F.mono(700), 30, px, py + 50, col('blood', 1)); c.restore();
    // the mortarboard drops onto the wall's top edge
    const my = lerp(wy0 - 600, wy0 - 34, ease.outBack(prog(t, ten.start - 0.05, ten.start + 0.35)));
    c.fillStyle = col('ink', 1); c.beginPath(); c.moveTo(px - 260, my); c.lineTo(px, my - 70); c.lineTo(px + 260, my); c.lineTo(px, my + 70); c.closePath(); c.fill();
    c.strokeStyle = col('graphite', 1); c.lineWidth = 3; c.stroke();
    c.fillStyle = col('ink2', 1); c.fillRect(px - 120, my + 4, 240, 34);
    rule(c, px, my, px + 190, my + 30, 1, col('signal', 1), 5); rule(c, px + 190, my + 30, px + 196, my + 130, 1, col('signal', 1), 5);
    g.fillStyle = col('ember', 0.5); g.fillRect(px + 186, my + 100, 20, 36);
  }
  const a1 = 1 - prog(t, l2.start - 0.2, l2.start + 0.2);
  lyric(s, upto(l1, /tenure/i), 150, { width: 1200, max: 80, alpha: a1, x: 820 });
  word(s, ten, 'tenure.', F.serif(600, true), 150, 1560, 140, { sc: slam(ten, t, 1.3), alpha: a1 });
  // line 2: post cards pasted onto the wall, each pinned; ADVENTURE is the last headline
  if (t > l2.start - 0.3) {
    const cards = Math.floor(clamp((t - fl.start) / 0.12 + 1, 0, 16));
    for (let i = 0; i < cards; i++) {
      const cx = wx0 + 140 + hash(i, 1) * (wx1 - wx0 - 280), cy = wy0 + 90 + hash(i, 2) * (wy1 - wy0 - 200);
      if (Math.abs(cx - px) < pw / 2 + 120 && Math.abs(cy - py) < ph / 2 + 80) continue; // keep the plaque readable
      const k = prog(t, fl.start + i * 0.12, fl.start + i * 0.12 + 0.15, ease.outBack);
      c.save(); c.translate(cx, cy); c.rotate((hash(i, 3) - 0.5) * 0.3); c.scale(k, k);
      c.fillStyle = col('bone', 0.97); c.fillRect(-120, -80, 240, 160);
      setFont(c, F.mono(700), 18); c.fillStyle = col('ink', 1); c.textAlign = 'left'; c.fillText(`NEW POST #${(i + 1) * 37}`, -104, -46);
      for (let q = 0; q < 3; q++) { c.fillStyle = col('graphite', 0.35); c.fillRect(-104, -20 + q * 30, 200 - q * 50, 12); }
      c.fillStyle = col('signal', 1); c.beginPath(); c.arc(0, -80, 9, 0, TAU); c.fill();
      c.restore();
    }
    lyric(s, upto(l2, /adventure/i), 150, { width: 1500, max: 76, alpha: 1 - a1 });
    word(s, adv, 'ADVENTURE', A(125, 900), sizeTo('ADVENTURE', A(125, 900), 1100, 150), W / 2, 990, { sc: slam(adv, t, 1.5) });
  }
}

// ------------------------------------------------------------------ V2: the stopped clock — right twice a day; ten posts an hour
function stoppedClock(s: S) {
  const { t, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const tw = fw(l1, /twice/i), tn = fw(l1, /ten/i), hr = fw(l1, /hour/i), pw = fw(l2, /power/i), wait = fw(l2, /waiting/i);
  scr(s, 1.0, 1.04);
  const cx = 560, cy = 560, R = 330;
  const sw = prog(t, l2.start - 0.2, l2.start + 0.3, ease.inOutCubic);
  // dial
  c.strokeStyle = col('bone', 0.9); c.lineWidth = 8; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
  for (let i = 0; i < 60; i++) { const a = (i / 60) * TAU; const r0 = i % 5 ? R - 18 : R - 40; rule(c, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * (R - 6), cy + Math.sin(a) * (R - 6), 1, col(i % 5 ? 'graphite' : 'bone', 0.9), i % 5 ? 2 : 5); }
  // ten times an hour: ten ticks around the dial, each one a post, firing fast
  const posts = Math.floor(clamp((t - tn.start) / Math.max(0.06, (hr.end - tn.start) / 10), 0, 10));
  for (let i = 0; i < posts; i++) { const a = (i / 10) * TAU - Math.PI / 2; c.fillStyle = col('signal', 1); c.beginPath(); c.arc(cx + Math.cos(a) * (R + 50), cy + Math.sin(a) * (R + 50), 16, 0, TAU); c.fill(); g.fillStyle = col('ember', 0.5); g.beginPath(); g.arc(cx + Math.cos(a) * (R + 50), cy + Math.sin(a) * (R + 50), 22, 0, TAU); g.fill(); }
  // stopped hands at 10:10 — twice a day it is right: the two ✓ flash on "twice"
  const ha = (10 / 12) * TAU - Math.PI / 2, ma = (10 / 60) * TAU - Math.PI / 2;
  rule(c, cx, cy, cx + Math.cos(ha) * R * 0.5, cy + Math.sin(ha) * R * 0.5, 1, col('bone', 1), 14);
  rule(c, cx, cy, cx + Math.cos(ma) * R * 0.8, cy + Math.sin(ma) * R * 0.8, 1, col('bone', 1), 8);
  const ck = prog(t, tw.start, tw.start + 0.3, ease.outBack);
  if (ck > 0.001) { label(s, '✓ 10:10', F.mono(700), 40 * ck, cx, cy + 160, col('signal', 1)); label(s, '✓ 22:10', F.mono(700), 40 * ck, cx, cy + 210, col('signal', 1)); }
  // lines on the right
  { const hi = l1.words.findIndex((w) => /^he$/i.test(clean(w.w))); const a = hi > 0 ? hi : 5; lyric(s, l1.words.slice(0, a), 220, { x: 1400, width: 820, max: 96, alpha: 1 - 0.7 * sw }); lyric(s, l1.words.slice(a), 360, { x: 1400, width: 820, max: 96, alpha: 1 - 0.7 * sw, anno: false }); }
  if (sw > 0) {
    lyric(s, l2.words.slice(0, -1), 500, { x: 1400, width: 820, max: 72, anno: false });
    // a forecast bar chart that never shows power: the last bar is an empty outline with a spinner
    const bx = 1080;
    for (let i = 0; i < 6; i++) { const h = 30 + 12 * hash(i); c.fillStyle = col('graphite', 0.9); c.fillRect(bx + i * 90, 900 - h, 60, h); }
    c.strokeStyle = col('signal', 1); c.lineWidth = 3; c.setLineDash([10, 8]); c.strokeRect(bx + 6 * 90, 600, 60, 300); c.setLineDash([]);
    const spin = (t - wait.start) * 6;
    for (let i = 0; i < 8; i++) { const a = spin + (i / 8) * TAU; c.fillStyle = col('bone', 0.15 + 0.85 * (i / 8)); c.beginPath(); c.arc(bx + 6 * 90 + 30 + Math.cos(a) * 26, 560 + Math.sin(a) * 26, 6, 0, TAU); c.fill(); }
    word(s, pw, 'POWER', A(125, 900), 150, 1400, 760, { sc: slam(pw, t, 1.5) });
  }
}

// ------------------------------------------------------------------ V2: an off-ramp, not the road — the doomed one hauls the load
// A night highway in one-point perspective: shoulders, lane dashes streaming toward the camera (we drive behind the
// truck), an exit ramp peeling off right under an overhead gantry sign. On line 2 a truck, seen from BEHIND, pulls away up
// the main road toward the horizon: rear doors stencilled THE LOAD, tail lights, a trailer full of tokens.
function offramp(s: S) {
  const { t, sh, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const off = fw(l1, /off/i), road = l1.words[l1.words.length - 1]!, doomed = l2.words.filter((w) => /doom/i.test(w.w)), load = l2.words[l2.words.length - 1]!;
  scr(s, 1.0, 1.02);
  const hy = 470, vx = W / 2;
  const P = (u: number, z: number) => ({ x: vx + u * (40 + 1500 * Math.pow(z, 1.8)), y: hy + (H - hy + 140) * Math.pow(z, 1.8) }); // u: -1..1 across the road, z: 0 (horizon) .. 1 (camera)
  const poly = (pts: { x: number; y: number }[], fill: string) => { c.fillStyle = fill; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.closePath(); c.fill(); };
  // sky glow on the horizon, the asphalt, shoulders
  const sky = c.createLinearGradient(0, hy - 220, 0, hy); sky.addColorStop(0, col('ink', 0)); sky.addColorStop(1, col('blood', 0.35)); c.fillStyle = sky; c.fillRect(0, hy - 220, W, 220);
  poly([P(-1.25, 0), P(1.25, 0), P(1.25, 1), P(-1.25, 1)], col('graphite', 0.35));
  poly([P(-1, 0), P(1, 0), P(1, 1), P(-1, 1)], col('ink2', 1));
  // a proper exit: a deceleration lane runs beside the right lane (dashed line between them), splits at a striped gore
  // nose, then the ramp curves away right and drops off behind the embankment. Road space: u across (main road -1..1),
  // z depth (0 horizon .. 1 camera).
  const rk = prog(t, off.start - 0.2, off.start + 0.45, ease.outCubic);
  const ZS = 0.56, LW = 0.62; // split depth, lane width (in u)
  const uL = (z: number) => (z >= ZS ? 1 : 1 + 3.2 * Math.pow(ZS - z, 1.45)), uR = (z: number) => uL(z) + LW;
  const zs: number[] = []; for (let i = 0; i <= 60; i++) zs.push(1 - (i / 60) * (1 - 0.16));
  const edgeL = zs.map((z) => P(uL(z), z)), edgeR = zs.map((z) => P(uR(z), z));
  c.save(); c.globalAlpha = 0.35 + 0.65 * rk;
  c.fillStyle = col('graphite', 0.25); c.beginPath(); edgeR.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.lineTo(W + 400, hy + 20); c.lineTo(W + 400, H + 200); c.closePath(); c.fill();
  c.fillStyle = col('ink2', 1); c.beginPath(); edgeL.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); for (let i = edgeR.length - 1; i >= 0; i--) c.lineTo(edgeR[i]!.x, edgeR[i]!.y); c.closePath(); c.fill();
  // the gore: the widening wedge between the main edge and the ramp, filled with diagonal stripes
  const gz = zs.filter((z) => z <= ZS && z >= 0.24);
  c.fillStyle = col('graphite', 0.5); c.beginPath(); gz.forEach((z, i) => { const p = P(1, z); i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); }); for (let i = gz.length - 1; i >= 0; i--) { const p = P(uL(gz[i]!), gz[i]!); c.lineTo(p.x, p.y); } c.closePath(); c.fill();
  for (let i = 0; i < 9; i++) { const z0 = ZS - 0.035 * i, z1 = z0 - 0.03; if (z1 < 0.24) break; const a = P(1, z0), b = P(uL(z1), z1); rule(c, a.x, a.y, b.x, b.y, 1, col('bone', 0.75), 2 + 7 * z0); }
  // lines: ramp outer edge, ramp inner edge after the split, dashed lane line before it
  strokePts(c, edgeR.map((p) => [p.x, p.y] as [number, number]), 1, col('bone', 0.9), 5);
  strokePts(c, zs.filter((z) => z <= ZS).map((z) => { const p = P(uL(z), z); return [p.x, p.y] as [number, number]; }), 1, col('bone', 0.9), 4);
  for (let i = 0; i < 8; i++) { const z0 = ZS + (i / 8) * (1 - ZS), z1 = Math.min(1, z0 + 0.03); const a = P(1, z0), b = P(1, z1); rule(c, a.x, a.y, b.x, b.y, 1, col('bone', 0.8), 3 + 10 * z0); }
  // the ramp's guide arrow, painted in the exit lane
  { const z = 0.8, a = P(1 + LW / 2, z), sc_ = 0.4 + z; c.fillStyle = col('bone', 0.6); c.beginPath(); c.moveTo(a.x - 14 * sc_, a.y + 30 * sc_); c.lineTo(a.x - 14 * sc_, a.y - 10 * sc_); c.lineTo(a.x - 30 * sc_, a.y - 10 * sc_); c.lineTo(a.x + 10 * sc_, a.y - 46 * sc_); c.lineTo(a.x + 30 * sc_, a.y - 10 * sc_); c.lineTo(a.x + 14 * sc_, a.y - 10 * sc_); c.lineTo(a.x + 14 * sc_, a.y + 30 * sc_); c.closePath(); c.fill(); }
  // a small EXIT sign on the gore nose
  { const n_ = P(1.06, ZS - 0.01); c.fillStyle = col('graphite', 1); c.fillRect(n_.x - 3, n_.y - 70, 6, 70); c.fillStyle = col('bone', 1); c.fillRect(n_.x - 34, n_.y - 96, 68, 30); setFont(c, F.mono(700), 18); c.fillStyle = col('ink', 1); c.textAlign = 'center'; c.fillText('EXIT', n_.x, n_.y - 75); }
  c.restore();
  // main road: left edge, right edge only beyond the split, lane dashes streaming toward the camera
  strokePts(c, [[P(-1, 0).x, P(-1, 0).y], [P(-1, 1).x, P(-1, 1).y]], 1, col('bone', 0.85), 5);
  strokePts(c, [[P(1, 0).x, P(1, 0).y], [P(1, ZS).x, P(1, ZS).y]], 1, col('bone', 0.85), 5);
  const run = (t - sh.start) * 1.8;
  for (const u of [-0.33, 0.33]) for (let i = 0; i < 12; i++) {
    const z0 = ((i / 12 + run) % 1), z1 = Math.min(1, z0 + 0.035);
    const a = P(u, z0), b = P(u, z1); rule(c, a.x, a.y, b.x, b.y, 1, col('bone', 0.75), 2 + 16 * z0);
  }
  // overhead gantry with the sign (2.5D boxes): EXIT → OFF-RAMP / NOT THE ROAD
  const sk = prog(t, l1.start - 0.1, l1.start + 0.35, ease.outBack);
  if (sk > 0.001) {
    const gz = 0.55, gl = P(-1.15, gz), gr = P(1.75, gz), gy = gl.y - 560 * Math.pow(gz, 1.8) - 90;
    box(c, gl.x - 10, gy, 20, gl.y - gy, 12, col('graphite', 1), col('ink2', 1), col('ash', 0.5));
    box(c, gr.x - 10, gy, 20, gr.y - gy, 12, col('graphite', 1), col('ink2', 1), col('ash', 0.5));
    box(c, gl.x, gy - 14, gr.x - gl.x, 22, 12, col('graphite', 1), col('ink2', 1), col('ash', 0.5));
    const sx = Math.min(W - 280, P(1.3, gz).x), sy = gy - 190 * sk;
    box(c, sx - 250, sy, 500, 180 * sk, 18, col('bone', 1), col('ash', 1), col('bone', 0.8), col('ink', 0.8), 3);
    if (sk > 0.6) {
      note(c, 'EXIT 1', sx - 230, sy + 34, 1, 22, 'blood');
      word(s, off, 'OFF-RAMP ↗', A(100, 900), 64, sx, sy + 82, { base: 'ink', hot: 'blood' });
      word(s, road, 'NOT THE ROAD', F.mono(700), 30, sx, sy + 140, { base: 'ink', hot: 'blood' });
    }
  }
  lyric(s, upto(l1, /off/i), 170, { x: 640, width: 980, max: 96, alpha: 1 - prog(t, l2.start - 0.25, l2.start + 0.1) });
  // line 2: the truck from behind, pulling away along the right lane toward the horizon
  if (t > l2.start - 0.3) {
    const dk = prog(t, l2.start - 0.2, load.end + 0.8, ease.inOutQuad);
    const z = lerp(0.98, 0.3, dk), base_ = P(0.33, z), sc = 0.12 + 1.05 * Math.pow(z, 1.8);
    const bob = Math.sin(t * 22) * 2 * sc;
    c.save(); c.translate(base_.x, base_.y + bob); c.scale(sc, sc);
    // shadow, wheels + mud flaps, then the trailer's rear face (doors) with a hint of its right side and roof
    c.fillStyle = col('ink', 0.6); c.beginPath(); c.ellipse(0, 0, 330, 34, 0, 0, TAU); c.fill();
    for (const wx of [-230, -150, 150, 230]) { c.fillStyle = col('ink', 1); c.fillRect(wx - 34, -70, 68, 70); }
    c.fillStyle = col('graphite', 1); c.fillRect(-270, -40, 70, 36); c.fillRect(200, -40, 70, 36);
    box(c, -290, -600, 580, 520, 120, col('ash', 1), col('graphite', 1), col('bone', 0.6), col('ink', 0.8), 3);
    rule(c, 0, -600, 0, -80, 1, col('ink', 0.8), 4);
    for (const hx of [-140, 140]) { rule(c, hx, -560, hx, -120, 1, col('ink', 0.5), 3); }
    c.fillStyle = col('ink', 1); c.fillRect(-300, -84, 600, 26); // bumper
    for (const lx of [-262, 262]) { c.fillStyle = col('signal', 1); c.fillRect(lx - 22, -150, 44, 30); }
    setFont(c, F.mono(700), 46); c.fillStyle = col('ink', 1); c.textAlign = 'center'; c.fillText('THE LOAD', 0, -470);
    setFont(c, F.mono(700), 34); for (let r = 0; r < 4; r++) { let line = ''; for (let q = 0; q < 6; q++) line += ['tok', 'λ', '∑', 'id', '01', '▮'][(r * 3 + q) % 6] + ' '; c.fillStyle = col('ink', 0.55); c.fillText(line, 0, -400 + r * 56); }
    c.restore();
    for (const lx of [-262, 262]) { g.fillStyle = col('ember', 0.6); g.beginPath(); g.arc(base_.x + lx * sc, base_.y + bob - 135 * sc, 40 * sc + 6, 0, TAU); g.fill(); }
    lyric(s, l2.words.filter((w) => w !== doomed[0]), 330, { width: 1200, max: 64, anno: false, x: 640 });
    if (doomed[0]) word(s, doomed[0], 'DOOMED,', A(125, 900), 120, 640, 220, { sc: slam(doomed[0], t, 1.6) });
  }
}

// ------------------------------------------------------------------ V2: the godfather and the network — then the world model, and the empty list
function family(s: S) {
  const { t, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const dis = fw(l1, /disowning/i), kids = l1.words[l1.words.length - 1]!, wm = fw(l2, /world/i), name = fw(l2, /name/i), did = l2.words[l2.words.length - 1]!;
  const sw = prog(t, l2.start - 0.2, l2.start + 0.3, ease.inOutCubic);
  cam(s, { x: W / 2, y: H / 2 + sw * H, z: 1, r: 0 });
  // panel A: the network — a root node and its descendants; on "disowning" the root's edges snap and it drifts off
  {
    const cut = prog(t, dis.start, kids.end + 0.3, ease.inCubic);
    const root = { x: W / 2 + cut * 520, y: 300 - cut * 120 };
    const kidsP: { x: number; y: number }[] = [];
    for (let i = 0; i < 5; i++) kidsP.push({ x: 360 + i * 300, y: 640 });
    const gk = prog(t, l1.start, l1.start + 0.6, ease.outExpo);
    kidsP.forEach((k, i) => {
      for (let j = 0; j < 4; j++) { const gx = k.x - 105 + j * 70, gy = 860; rule(c, k.x, k.y, gx, gy, gk, col('graphite', 0.7), 2); c.fillStyle = col('graphite', 1); c.beginPath(); c.arc(gx, gy, 12 * gk, 0, TAU); c.fill(); }
      const broke = prog(cut, i * 0.1, i * 0.1 + 0.2);
      if (broke < 1) { const mx = lerp(root.x, k.x, 0.5 - broke * 0.25), my = lerp(root.y, k.y, 0.5 - broke * 0.25); rule(c, root.x, root.y, mx, my, gk, col('bone', 0.8), 3); rule(c, k.x, k.y, lerp(k.x, root.x, 0.5 - broke * 0.25), lerp(k.y, root.y, 0.5 - broke * 0.25), gk, col('bone', 0.8), 3); }
      c.fillStyle = col('bone', 1); c.beginPath(); c.arc(k.x, k.y, 22 * gk, 0, TAU); c.fill();
    });
    c.fillStyle = col('signal', 1); c.beginPath(); c.arc(root.x, root.y, 40, 0, TAU); c.fill();
    lyric(s, upto(l1, /now/i), 150, { width: 1600, max: 90 });
    lyric(s, from(l1, /now/i), 980, { width: 1500, max: 76, anno: false });
  }
  // panel B: a wireframe world turning; beside it, the list "name one thing" stays empty, cursor blinking
  {
    const oy = H, gx = 560, gy = oy + 560, R = 300;
    const rot = (t - l2.start) * 0.8;
    const wk = prog(t, wm.start - 0.1, wm.start + 0.4, ease.outExpo);
    c.strokeStyle = col('bone', 0.75 * wk); c.lineWidth = 3;
    c.beginPath(); c.arc(gx, gy, R, 0, TAU); c.stroke();
    for (let i = 1; i < 6; i++) { const y = gy - R + (i * 2 * R) / 6, rr = Math.sqrt(R * R - (y - gy) * (y - gy)); c.beginPath(); c.ellipse(gx, y, rr, rr * 0.12, 0, 0, TAU); c.stroke(); }
    for (let i = 0; i < 6; i++) { const a = rot + (i / 6) * Math.PI; c.beginPath(); c.ellipse(gx, gy, Math.abs(Math.cos(a)) * R, R, 0, 0, TAU); c.stroke(); }
    lyric(s, upto(l2, /name/i), oy + 170, { width: 1600, max: 84 });
    const nk = prog(t, name.start - 0.1, name.start + 0.2);
    lyric(s, from(l2, /name/i), oy + 380, { x: 1380, width: 760, max: 70, anno: false });
    for (let i = 0; i < 3; i++) { note(c, `${i + 1}.`, 1060, oy + 560 + i * 90, nk, 44, 'ash'); rule(c, 1130, oy + 566 + i * 90, 1700, oy + 566 + i * 90, nk, col('graphite', 0.8), 2); }
    if (t > did.start && Math.floor(t * 3) % 2) { c.fillStyle = col('signal', 1); c.fillRect(1134, oy + 520, 22, 40); }
  }
}

/** An original line-art cat (geometric): sitting, tail curled. */
function catArt(s: S, x: number, y: number, sc: number, k: number, blink: number) {
  const { c } = s;
  if (k <= 0) return;
  c.save(); c.translate(x, y); c.scale(sc, sc); c.globalAlpha = k;
  c.strokeStyle = col('bone', 1); c.lineWidth = 7; c.lineJoin = 'round'; c.lineCap = 'round';
  c.beginPath(); c.ellipse(0, 40, 110, 140, 0, Math.PI * 1.05, Math.PI * 1.95, true); c.stroke(); // body
  c.beginPath(); c.arc(0, -150, 85, 0, TAU); c.stroke(); // head
  c.beginPath(); c.moveTo(-70, -195); c.lineTo(-62, -268); c.lineTo(-18, -230); c.moveTo(70, -195); c.lineTo(62, -268); c.lineTo(18, -230); c.stroke(); // ears
  c.beginPath(); c.moveTo(110, 150); c.quadraticCurveTo(230, 150, 200, 40); c.quadraticCurveTo(185, 0, 160, 10); c.stroke(); // tail
  rule(c, -110, 175, 110, 175, 1, col('bone', 1), 7); // ground
  c.fillStyle = col('signal', 1); const eh = 12 * (1 - blink);
  c.beginPath(); c.ellipse(-32, -160, 10, Math.max(1, eh), 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(32, -160, 10, Math.max(1, eh), 0, 0, TAU); c.fill();
  c.lineWidth = 3; for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) rule(c, sd * 30, -125 + i * 8, sd * 120, -140 + i * 16, 1, col('bone', 0.8), 3);
  c.restore();
}
// ------------------------------------------------------------------ V2: a house cat has more sense — hire the cat; let it train your Llama
function cat(s: S) {
  const { t, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const ct = fw(l1, /cat/i), hire = fw(l1, /hire/i), cool = fw(l1, /cool/i), four = fw(l2, /four/i), far = fw(l2, /far/i);
  scr(s, 1.0, 1.03);
  const blink = pulseAt(t, cool.start, 0.08);
  catArt(s, 520, 700, 1.25, prog(t, ct.start - 0.1, ct.start + 0.4, ease.outCubic), blink);
  // the badge, clipped on when hired
  const hk = prog(t, hire.start, hire.start + 0.35, ease.outBack);
  if (hk > 0.001) { rule(c, 470, 640, 520, 760, hk, col('signal', 1), 4); rule(c, 570, 640, 520, 760, hk, col('signal', 1), 4); c.fillStyle = col('signal', 1); c.fillRect(470, 760, 100 * hk, 70 * hk); label(s, 'STAFF', F.mono(700), 22 * hk, 520, 795, col('ink', 1)); }
  stamp(s, 'HIRED', 820, 420, hire.start + 0.15, 70, 0.14, 'signal');
  const a1 = 1 - prog(t, l2.start - 0.2, l2.start + 0.2);
  lyric(s, l1.words, 170, { width: 1600, max: 80, alpha: Math.max(0.15, a1) });
  // line 2: the training run — a progress bar stuck at 4 %, loss line flat
  if (t > l2.start - 0.3) {
    const bx = 1000, by = 500;
    lyric(s, upto(l2, /see/i), 360, { x: 1380, width: 800, max: 80 });
    c.strokeStyle = col('bone', 0.9); c.lineWidth = 3; c.strokeRect(bx, by, 760, 60);
    const p = Math.min(0.04, prog(t, l2.start, four.end) * 0.04);
    c.fillStyle = col('signal', 1); c.fillRect(bx + 4, by + 4, (760 - 8) * p / 0.04 * 0.04 * 25 * 0.04, 52);
    note(c, `TRAINING  ${Math.round(p * 100)}%  · ETA ∞`, bx, by - 16, 1, 24, 'ash');
    const loss: [number, number][] = []; for (let i = 0; i <= 30; i++) loss.push([bx + i * 25, by + 260 - 6 * Math.sin(i * 1.3) * hash(i)]);
    strokePts(c, loss, prog(t, l2.start, far.start + 0.4), col('graphite', 1), 4);
    note(c, 'LOSS', bx, by + 180, 1, 22, 'ash');
    lyric(s, from(l2, /see/i), 920, { x: 1380, width: 760, max: 80, anno: false });
  }
}

// ------------------------------------------------------------------ V3: the bubble — inflates, pops; capex to the moon, revenue falls over
function bubble(s: S) {
  const { t, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const bub = fw(l1, /bubble/i), pop = l1.words[l1.words.length - 1]!, cap = fw(l2, /capex/i), moon = fw(l2, /moon/i), flop = l2.words[l2.words.length - 1]!, rev = fw(l2, /revenue/i);
  const sw = t >= l2.start - 0.08 ? 1 : 0;
  scr(s, 1.0, 1.02);
  // the bubble
  const grow = prog(t, bub.start - 0.1, pop.start, ease.inQuad), pk = prog(t, pop.start, pop.start + 0.35, ease.outCubic);
  const R = lerp(120, 430, grow);
  if (pk < 1 && sw < 1) {
    c.strokeStyle = col('bone', 0.85 * (1 - pk)); c.lineWidth = 4; c.beginPath(); c.arc(W / 2, 600, R, 0, TAU); c.stroke();
    c.strokeStyle = col('bone', 0.4 * (1 - pk)); c.beginPath(); c.arc(W / 2 - R * 0.35, 600 - R * 0.35, R * 0.25, Math.PI * 1.1, Math.PI * 1.6); c.stroke();
  }
  // droplets on the pop
  if (pk > 0 && sw < 1) for (let i = 0; i < 40; i++) { const a = (i / 40) * TAU + hash(i) * 0.3, d = R * (1 + pk * 0.6); c.fillStyle = col('bone', 0.8 * (1 - pk)); c.beginPath(); c.arc(W / 2 + Math.cos(a) * d, 600 + Math.sin(a) * d + pk * pk * 200, 8 * (1 - pk) + 2, 0, TAU); c.fill(); }
  if (sw < 1) {
    lyric(s, upto(l1, /bubble/i), 200, { width: 1500, max: 90, alpha: 1 - sw });
    word(s, bub, 'BUBBLE', A(125, 900), lerp(90, 220, grow), W / 2, 600, { alpha: (1 - pk * 0.8) * (1 - sw) });
    lyric(s, from(l1, /gonna|going/i).slice(0, -1), 940, { width: 800, max: 70, anno: false, alpha: 1 - sw });
    word(s, pop, 'POP.', A(62, 900), 160, W / 2 + 560, 900, { sc: slam(pop, t, 2.2), alpha: 1 - sw });
  }
  // line 2: the bar chart
  if (sw > 0) {
    const up = prog(t, cap.start, moon.end + 0.3, ease.inCubic);
    cam(s, { x: W / 2, y: H / 2 - up * 900, z: lerp(1, 0.8, up), r: 0 });
    const x0 = 520, y0 = 960;
    rule(c, 300, y0, 1620, y0, sw, col('bone', 0.9), 3);
    c.fillStyle = col('signal', 1); c.fillRect(x0, y0 - 80 - up * 1900, 240, 80 + up * 1900); g.fillStyle = col('ember', 0.3); g.fillRect(x0, y0 - 80 - up * 1900, 240, 80 + up * 1900);
    // the moon at the top
    const my = y0 - 2200; c.fillStyle = col('bone', 0.95); c.beginPath(); c.arc(x0 + 120, my, 160, 0, TAU); c.fill(); c.fillStyle = col('ink', 1); c.beginPath(); c.arc(x0 + 190, my - 40, 150, 0, TAU); c.fill();
    word(s, cap, 'CAPEX', A(125, 900), 110, x0 + 120, y0 - 160 - up * 1900, { sc: slam(cap, t, 1.5) });
    word(s, moon, 'TO THE MOON', A(87, 900), 90, x0 + 120, my + 260, {});
    // revenue: a short bar that tips over on "flop"
    const fk = prog(t, flop.start - 0.05, flop.start + 0.45, ease.outBack);
    c.save(); c.translate(1300, y0); c.rotate(-Math.PI / 2 * 0 + (Math.PI / 2) * fk); c.fillStyle = col('graphite', 1); c.fillRect(0, -240, 120, 240); c.restore();
    word(s, rev, "REVENUE'S", A(87, 900), 70, 1360, y0 - 300 + 300 * fk * 0.5, {});
    word(s, flop, 'A FLOP.', A(125, 900), 110, 1360, y0 + 90, { sc: slam(flop, t, 1.6) });
  }
}

// ------------------------------------------------------------------ V3: railroads went bust, the tracks outlived the tycoons; the buildout lands
function rails(s: S) {
  const { t, sh, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const tyc = l1.words[l1.words.length - 1]!, trk = fw(l1, /tracks/i), bust = fw(l1, /bust/i), soon = l2.words[l2.words.length - 1]!;
  scr(s, 1.0, 1.06);
  const hy = 380, vx = W / 2;
  // ties recede to the horizon; line 1's words are stamped on the ties, one per tie
  const f = (z: number) => hy + (H - hy) * Math.pow(z, 2.0);
  const ws1 = l1.words;
  for (let i = 0; i < 18; i++) {
    const z = 1 - i / 18, y = f(z), half = 40 + 820 * Math.pow(z, 2.0);
    rule(c, vx - half, y, vx + half, y, prog(t, sh.start + i * 0.03, sh.start + i * 0.03 + 0.2), col('graphite', 0.9), 4 + 20 * z * z);
  }
  rule(c, vx - 40, hy, vx - 700, H + 100, 1, col('bone', 0.9), 6); rule(c, vx + 40, hy, vx + 700, H + 100, 1, col('bone', 0.9), 6);
  const keys = ws1.filter((w) => /railroad|bust|tracks|tycoon/i.test(w.w));
  const rest = ws1.filter((w) => !keys.includes(w));
  const a1 = 1 - prog(t, l2.start - 0.2, l2.start + 0.2) * 0.85;
  lyric(s, rest, 170, { width: 1500, max: 66, alpha: a1, anno: false });
  keys.forEach((w, i) => {
    const z = 0.9 - i * 0.2, y = f(z) - 10, sz = 30 + 150 * Math.pow(z, 2);
    const isT = w === tyc;
    const fade = (isT ? 1 - prog(t, tyc.end + 0.1, tyc.end + 1.2) : 1) * a1;
    word(s, w, txt(w), A(isT ? 62 : 100, 900), sz, vx, y - sz * 0.45, { alpha: fade, sc: slam(w, t, 1.3) });
  });
  // a top hat for the tycoons — it fades; the tracks remain
  const tk = prog(t, tyc.start, tyc.start + 0.3, ease.outBack) * (1 - prog(t, tyc.end + 0.1, tyc.end + 1.2));
  if (tk > 0.001) { c.fillStyle = col('bone', tk); c.fillRect(vx - 60, hy - 170, 120, 110); c.fillRect(vx - 100, hy - 66, 200, 16); }
  if (t > bust.start) note(c, '1873 · 1893 · PANIC', 150, 140, prog(t, bust.start, bust.start + 0.3), 22, 'ash');
  // line 2: datacentre blocks rise along both sides of the line, lit windows; LANDING SOON blinks
  if (t > l2.start - 0.2) {
    const bk = prog(t, l2.start, soon.start, ease.outCubic);
    for (let i = 0; i < 10; i++) for (const sd of [-1, 1]) {
      const z = 0.25 + i * 0.075, y = f(z), x = vx + sd * (140 + 900 * Math.pow(z, 2.0)), w = 60 + 260 * z * z, h = (120 + 900 * z * z) * prog(bk, i * 0.06, i * 0.06 + 0.4, ease.outExpo);
      c.fillStyle = col('ink2', 1); c.strokeStyle = col('graphite', 1); c.lineWidth = 2; c.fillRect(x - w / 2, y - h, w, h); c.strokeRect(x - w / 2, y - h, w, h);
      for (let r = 0; r < Math.floor(h / (14 + 30 * z)); r++) { const lit = hash(i, r, sd) > 0.4; if (!lit) continue; c.fillStyle = col('signal', 0.8); c.fillRect(x - w / 2 + 6, y - h + 8 + r * (14 + 30 * z), w - 12, 4 + 8 * z); g.fillStyle = col('ember', 0.25); g.fillRect(x - w / 2 + 6, y - h + 8 + r * (14 + 30 * z), w - 12, 4 + 8 * z); }
    }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = col('ink', 0.7); c.fillRect(0, 110, W, 260); c.restore();
    cam(s, { x: W / 2, y: H / 2, z: 1, r: 0 });
    lyric(s, upto(l2, /landing/i), 200, { width: 1600, max: 84 });
    const ld = from(l2, /landing/i);
    if (Math.floor((t - soon.start) * 3) % 2 === 0 || t < soon.start + 0.6) lyric(s, ld, 310, { width: 700, max: 60, anno: false });
  }
  void trk;
}

// ------------------------------------------------------------------ BRIDGE: "we must know — we will know", carved; ten thousand agents set loose
function hilbert(s: S) {
  const { t, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const ag = fw(l2, /agents/i), go = l2.words[l2.words.length - 1]!, ten = fw(l2, /ten/i);
  const sw = prog(t, l2.start - 0.2, l2.start + 0.3, ease.inOutCubic);
  cam(s, { x: W / 2, y: H / 2 + 60 * sw, z: lerp(1.05, 0.85, sw), r: 0 });
  // the stone
  const sx = W / 2, sy = 620, sw2 = 900, sh2 = 640;
  c.fillStyle = col('ink2', 1); c.strokeStyle = col('graphite', 1); c.lineWidth = 4;
  c.beginPath(); c.moveTo(sx - sw2 / 2, sy + sh2 / 2); c.lineTo(sx - sw2 / 2, sy - sh2 / 2 + 160); c.arc(sx, sy - sh2 / 2 + 160, sw2 / 2, Math.PI, 0); c.lineTo(sx + sw2 / 2, sy + sh2 / 2); c.closePath(); c.fill(); c.stroke();
  rule(c, 200, sy + sh2 / 2, W - 200, sy + sh2 / 2, 1, col('graphite', 1), 3);
  // header: whose stone
  const hl = upto(l1, /we/i);
  lyric(s, hl, 140, { width: 1400, max: 76, alpha: 1 - sw });
  // carved: line 1 from "we" on, in serif capitals, letter by letter
  const carved = from(l1, /we/i);
  const half = Math.ceil(carved.length / 2);
  [carved.slice(0, half), carved.slice(half)].forEach((r, ri) => {
    const text = r.map((w) => clean(w.w).toUpperCase()).join(' ');
    const fam = F.serif(600, false), sz = sizeTo(text, fam, 700, 96);
    const wd = measure(text, fam, sz);
    let off = 0;
    r.forEach((w) => {
      const tx = clean(w.w).toUpperCase();
      for (let i = 0; i < tx.length; i++) {
        const k = prog(t, w.start - 0.05 + i * 0.04, w.start + i * 0.04 + 0.1);
        if (k <= 0) continue;
        const cw = measure(tx.slice(0, i), fam, sz), chw = measure(tx[i]!, fam, sz);
        label(s, tx[i]!, fam, sz, sx - wd / 2 + off + cw + chw / 2, sy - 90 + ri * 150, mix('bone', 'signal', ri === 1 ? 0.9 : 0.1, k));
        if (ri === 1) label(s, tx[i]!, fam, sz, sx - wd / 2 + off + cw + chw / 2, sy - 90 + ri * 150, col('ember', 0.3 * k), g);
      }
      off += measure(tx + ' ', fam, sz);
    });
  });
  note(c, 'WIR MÜSSEN WISSEN — WIR WERDEN WISSEN', sx, sy + 240, prog(t, l1.end - 0.4, l1.end + 0.2) * (1 - sw), 22, 'ash', 'center');
  // line 2: the agents — 10,000 points leave the stone on "let them go"
  if (sw > 0) {
    const rel = prog(t, go.start - 0.3, go.start + 1.2, ease.outCubic);
    const spawn = prog(t, ten.start, ag.end, ease.outCubic);
    const N = 2400;
    for (let i = 0; i < N * spawn; i++) {
      const a = hash(i, 1) * TAU, r0 = Math.sqrt(hash(i, 2)) * 380, r1 = 400 + hash(i, 3) * 1400;
      const r = lerp(r0, r1, rel);
      const x = sx + Math.cos(a) * r * 1.4, y = sy + Math.sin(a) * r * 0.8;
      c.fillStyle = col(hash(i, 4) > 0.9 ? 'signal' : 'bone', 0.75); c.fillRect(x, y, 4, 4);
    }
    label(s, Math.round(10000 * spawn).toLocaleString('en-US') + ' AGENTS', F.mono(700), 34, sx, 1010, col('signal', spawn));
    lyric(s, l2.words, 150, { width: 1600, max: 80 });
  }
}

// ------------------------------------------------------------------ BRIDGE: ask the swarm — P vs NP, and the vault
function swarm(s: S) {
  const { t, sh, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const rie = fw(l1, /riemann/i), nav = fw(l1, /navier/i), sw_ = l1.words[l1.words.length - 1]!, eq = fw(l2, /equal/i), storm = l2.words[l2.words.length - 1]!, vault = fw(l2, /vault/i);
  const in2 = prog(t, l2.start - 0.2, l2.start + 0.3, ease.inOutCubic);
  scr(s, 1.0, 1.03);
  // the swarm: points orbiting the current target
  const tgt = [{ x: 560, y: 520 }, { x: 1360, y: 520 }];
  const swT = prog(t, sw_.start, sw_.start + 0.5, ease.outCubic);
  for (let i = 0; i < 1200; i++) {
    const which = i % 2, p = tgt[which]!;
    const a = hash(i, 1) * TAU + (t - sh.start) * (0.6 + hash(i, 2)) * (which ? 1 : -1), r = 120 + hash(i, 3) * 260 * (1 - 0.4 * swT);
    let x = p.x + Math.cos(a) * r * 1.3, y = p.y + Math.sin(a) * r * 0.7;
    // on line 2 everything streams into the vault on "stormed"
    const st = prog(t, storm.start - 0.2, storm.start + 0.6, ease.inCubic);
    x = lerp(x, 1540, st); y = lerp(y, 640, st);
    c.fillStyle = col(hash(i, 4) > 0.92 ? 'signal' : 'bone', 0.6 * (1 - in2 * 0.4)); c.fillRect(x, y, 3, 3);
  }
  const a1 = 1 - in2;
  word(s, rie, 'RIEMANN', F.serif(600, true), 130, 560, 520, { alpha: a1, sc: slam(rie, t, 1.3) });
  word(s, nav, 'NAVIER–STOKES', F.serif(600, true), 100, 1360, 520, { alpha: a1, sc: slam(nav, t, 1.3) });
  lyric(s, from(l1, /go/i), 900, { width: 1300, max: 90, alpha: a1 });
  // line 2: P ? NP — the middle glyph flips to "=" on "equal"; the vault door blows open
  if (in2 > 0) {
    const ek = t >= eq.start;
    const flick = !ek && Math.floor(t * 12) % 2;
    label(s, 'P', A(125, 900), 300, 340, 470, col('bone', in2));
    label(s, ek ? '=' : flick ? '≠' : '?', A(100, 900), 300, 760, 470, col(ek ? 'signal' : 'bone', in2));
    if (ek) label(s, '=', A(100, 900), 300, 760, 470, col('ember', 0.4 * pulseAt(t, eq.start, 0.3)), g);
    label(s, 'NP', A(125, 900), 300, 1200, 470, col('bone', in2));
    const vk = prog(t, vault.start - 0.1, vault.start + 0.3, ease.outBack), open = prog(t, storm.start - 0.1, storm.start + 0.5, ease.outCubic);
    if (vk > 0.001) {
      const vx = 1540, vy = 640;
      c.strokeStyle = col('bone', 0.9); c.lineWidth = 8; c.beginPath(); c.arc(vx, vy, 170 * vk, 0, TAU); c.stroke();
      c.save(); c.translate(vx - 170 * open, vy); c.scale(1 - 0.85 * open, 1);
      c.fillStyle = col('graphite', 1); c.beginPath(); c.arc(0, 0, 150 * vk, 0, TAU); c.fill();
      for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + open * 3; rule(c, 0, 0, Math.cos(a) * 110 * vk, Math.sin(a) * 110 * vk, 1, col('bone', 0.9), 8); }
      c.restore();
    }
    if (t > l2.start - 0.3) lyric(s, l2.words, 860, { width: 1600, max: 74, anno: false, alpha: in2 });
    s.post.shake = [noise1(t * 60, 1) * 18 * pulseAt(t, storm.start, 0.15), noise1(t * 60, 2) * 18 * pulseAt(t, storm.start, 0.15)];
  }
}

// ------------------------------------------------------------------ BRIDGE: zeros one by one (the mainframe way) — then proofs in Lean
const PROOF = ['theorem swarm_checks (h : Conjecture) : Proof := by', '  intro n hn', '  induction n with', '  | zero => simp', '  | succ k ih =>', '    rw [Nat.succ_eq_add_one]', '    exact lemma_7 ih hn', '-- ✓ no goals · kernel accepted'];
function lean(s: S) {
  const { t, sh, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const zer = fw(l1, /zeros/i), kid = l2.words[l2.words.length - 1]!, lean_ = fw(l2, /lean/i);
  const in2 = prog(t, l2.start - 0.2, l2.start + 0.3, ease.inOutCubic);
  scr(s, 1.0, 1.02);
  // panel: the critical line, zeros checked one at a time, slow
  const a1 = 1 - in2;
  if (a1 > 0) {
    const lx = 1440;
    rule(c, lx, 120, lx, 980, a1, col('bone', 0.6 * a1), 2);
    note(c, 'Re(s) = ½', lx + 20, 150, a1, 22, 'ash');
    const nz = Math.floor(clamp((t - zer.start) / 0.32, 0, 30));
    for (let i = 0; i < nz; i++) { const y = 960 - i * 32; c.fillStyle = col('signal', a1); c.beginPath(); c.arc(lx, y, 8, 0, TAU); c.fill(); note(c, `ζ #${(i + 1).toLocaleString('en-US')} ✓`, lx + 26, y + 7, a1 * 0.8, 18, 'ash'); }
    { const k = Math.max(1, l1.words.findIndex((w) => /^the$/i.test(clean(w.w)))); lyric(s, l1.words.slice(0, k), 440, { x: 760, width: 1150, max: 120, alpha: a1 }); lyric(s, l1.words.slice(k), 600, { x: 760, width: 1150, max: 120, alpha: a1, anno: false }); }
  }
  // the proof, typed by the swarm, accepted by the kernel; the referee has nothing to do
  if (in2 > 0) {
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = col('ink', 0.82 * in2); c.fillRect(140, 300, W - 280, 560); c.strokeStyle = col('graphite', in2); c.lineWidth = 2; c.strokeRect(140, 300, W - 280, 560); c.restore();
    cam(s, { x: W / 2, y: H / 2, z: 1, r: 0 });
    const t0 = lean_.start - 0.1, t1 = kid.start;
    PROOF.forEach((ln_, i) => {
      const a = t0 + ((t1 - t0) * i) / PROOF.length, b = a + (t1 - t0) / PROOF.length;
      typeOn(s, ln_, 190, 370 + i * 58, a, b, 32, i === PROOF.length - 1 ? 'signal' : i === 0 ? 'bone' : 'ash');
    });
    lyric(s, l2.words, 170, { width: 1600, max: 80 });
    const rk = prog(t, kid.start, kid.start + 0.4, ease.outBack);
    if (rk > 0.001) stamp(s, 'REFEREE: NOTHING TO ADD', 1250, 960, kid.start, 44, -0.06, 'signal');
    void g;
  }
  void sh;
}

// ------------------------------------------------------------------ V4: Shenzhen 1980 — boats and paddy fields; the skyline yields
function shenzhen(s: S) {
  const { t, sh, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const yrW = fw(l1, /nineteen/i), look = fw(l2, /look/i), sky = fw(l2, /skyline/i);
  scr(s, 1.0, 1.03);
  const hy = 640;
  const grow = prog(t, l2.start - 0.1, sky.end + 0.3, ease.outCubic);
  // water + waves
  for (let i = 0; i < 10; i++) { const y = hy + 30 + i * 40; c.strokeStyle = col('graphite', 0.7); c.lineWidth = 2; c.beginPath(); for (let x = 0; x <= W; x += 20) { const yy = y + Math.sin(x * 0.02 + t * 1.5 + i) * 5; x ? c.lineTo(x, yy) : c.moveTo(x, yy); } c.stroke(); }
  rule(c, 0, hy, W, hy, 1, col('bone', 0.8), 3);
  // line 1: the scene-setting words at the top; FISHING / BOATS ride the water as hulls and stay visible; PADDY / FIELDS are terraces
  const fish = l1.words.filter((w) => /fishing|boats/i.test(w.w)), field = l1.words.filter((w) => /paddy|fields/i.test(w.w));
  const head = l1.words.filter((w) => !fish.includes(w) && !field.includes(w) && !/nineteen|eighty/i.test(w.w));
  const a1 = 1;
  lyric(s, head, 170, { width: 900, max: 84, align: 'l', alpha: a1 });
  fish.forEach((w, i) => {
    if (t < w.start - 0.3) return;
    const k = ease.outBack(prog(t, w.start - 0.1, w.start + 0.35)), x = 520 + i * 560 + Math.sin(t * 0.8 + i) * 18, y = hy + 140 + Math.sin(t * 2 + i) * 6 - (1 - k) * 60;
    const f = A(100, 900), wd = measure(txt(w), f, 64) + 70;
    c.save(); c.globalAlpha = a1;
    c.fillStyle = mix('bone', 'signal', heat(w, t)); c.beginPath(); c.moveTo(x - wd / 2 - 30, y - 40); c.lineTo(x + wd / 2 + 40, y - 40); c.lineTo(x + wd / 2, y + 30); c.lineTo(x - wd / 2, y + 30); c.closePath(); c.fill();
    rule(c, x, y - 40, x, y - 230, 1, col('bone', 1), 5);
    c.fillStyle = col('bone', 0.85); c.beginPath(); c.moveTo(x + 6, y - 225); c.lineTo(x + 150, y - 60); c.lineTo(x + 6, y - 60); c.closePath(); c.fill();
    c.restore();
    word(s, w, txt(w), f, 64, x, y - 6, { base: 'ink', hot: 'blood', alpha: a1 });
  });
  field.forEach((w, i) => {
    if (t < w.start - 0.3) return;
    const k = prog(t, w.start - 0.1, w.start + 0.5, ease.outCubic), y0 = hy - 30 - i * 90;
    for (let r = 0; r < 3; r++) rule(c, 120 + r * 26, y0 - r * 22, 120 + r * 26 + (700 - r * 60) * k, y0 - r * 22, 1, col('graphite', a1), 4);
    word(s, w, txt(w), A(125, 900), 56, 120 + 240, y0 - 60, { alpha: a1 * k, align: 'l' });
  });
  // line 2: each word rises from the horizon as a tower with the word running up its face; SKYLINE is the tallest
  const ws2 = l2.words, n2 = ws2.length;
  ws2.forEach((w, i) => {
    const k = prog(t, w.start - 0.1, w.start + 0.45, ease.outExpo);
    if (k <= 0) return;
    const isSky = /skyline/i.test(w.w), f = A(isSky ? 125 : 100, 900), fs = isSky ? 74 : 50;
    const len = measure(txt(w), f, fs), tw = isSky ? 150 : 96, th = (len + 120) * k;
    const x = 160 + (i / Math.max(1, n2 - 1)) * (W - 320) - tw / 2;
    box(c, x, hy - th, tw, th, 60, col('ink2', 1), col('ink', 1), col('graphite', 0.6), col('graphite', 1), 2);
    for (let r = 0; r < th / 34 - 1; r++) for (const side of [0, 1]) if (hash(i, r, side) > 0.5) { c.fillStyle = col('signal', 0.6); c.fillRect(x + 8 + side * (tw - 24), hy - th + 14 + r * 34, 10, 12); }
    word(s, w, txt(w), f, fs, x + tw / 2, hy - th / 2, { rot: -Math.PI / 2, glow: isSky ? 1.5 : 1 });
  });
  // the year: 1980 → 2026 across the second line
  const yr = Math.round(lerp(1980, 2026, prog(t, look.start, sky.end, ease.inOutCubic)));
  if (t > yrW.start - 0.05) label(s, String(yr), A(62, 900), 150, 1150, 200, col(t > look.start ? 'signal' : 'bone', 0.9));
  void sh; void g;
}

// ------------------------------------------------------------------ V4: the assembly line — ROBOTS stamped on every unit
function assembly(s: S) {
  const { t, sh, c, g } = s;
  const all = sh.lines.flatMap((l) => l.words);
  scr(s, 1.0, 1.03);
  // the belt: rollers + moving chevrons
  const by = 760;
  rule(c, 0, by, W, by, 1, col('bone', 0.8), 4); rule(c, 0, by + 70, W, by + 70, 1, col('bone', 0.8), 4);
  // accelerating cadence: hits per second grow from 1.6 to 14 over the shot; phase = ∫ rate dt (closed form)
  const D = Math.max(0.5, sh.end - sh.start), xT = clamp((t - sh.start) / D), ra = 1.6, rb = 12.4;
  const phase = D * (ra * xT + (rb * xT * xT * xT) / 3), rate = ra + rb * xT * xT;
  const beltX = D * (ra * xT + (rb * xT * xT * xT) / 3) * 118;
  const mv = beltX % 120;
  // One physical conveyor carries the sung robot/word units below. Do not add a second generic unit row here.
  for (let x = -120; x < W + 120; x += 120) { c.strokeStyle = col('graphite', 1); c.lineWidth = 4; c.beginPath(); c.moveTo(x - mv + 20, by + 12); c.lineTo(x - mv + 50, by + 35); c.lineTo(x - mv + 20, by + 58); c.stroke(); }
  for (let x = 40; x < W; x += 160) { c.strokeStyle = col('graphite', 1); c.beginPath(); c.arc(x, by + 110, 22, 0, TAU); c.stroke(); }
  // stations (arm shapes) above the belt: MINE / WIRE / PRINT
  const ST = [{ x: 420, l: 'MINE' }, { x: 960, l: 'WIRE' }, { x: 1500, l: 'PRINT' }];
  const verbs = all.filter((w) => /mine|wire|print/i.test(w.w));
  ST.forEach((st, i) => {
    const v = verbs[i];
    const ph = phase - i * 0.33, fr = ph - Math.floor(ph);
    const cad = ph > 0 ? Math.pow(1 - fr, 6) : 0; // the press drops at each beat of the accelerating cadence
    const hit = Math.max(v ? pulseAt(t, v.start, 0.12) : 0, cad * clamp(0.4 + rate / 14));
    rule(c, st.x, 140, st.x, 380 + 160 * hit, 1, col('bone', 0.9), 12);
    c.fillStyle = col(hit > 0.1 ? 'signal' : 'graphite', 1); c.fillRect(st.x - 70, 380 + 160 * hit, 140, 40);
    if (hit > 0.05) { g.fillStyle = col('ember', 0.5 * hit); g.fillRect(st.x - 90, 370 + 160 * hit, 180, 60); }
    note(c, st.l, st.x, 120, 0.8, 22, 'ash', 'center');
  });
  note(c, `${Math.round(rate * 60)} UNITS / MIN`, W - 120, 1040, 0.9, 26, rate > 9 ? 'signal' : 'ash', 'right');
  // every sung word rides the belt: it enters at its onset at the right of the station that matches, and flows left
  const lineIdx = (w: Word) => sh.lines.findIndex((l) => l.words.includes(w));
  sh.lines.forEach((l, li) => {
    const nxt = sh.lines[li + 1];
    const off = nxt ? prog(t, nxt.start - 0.15, nxt.start + 0.35, ease.inCubic) : 0;
    if (off >= 1 || t < l.start - 0.5) return;
    const drift = -(t - l.start) * 25 - off * 2200;
    // every word is an object on the belt: a crate with the word stencilled on it; ROBOTS are robot units
    const isR = l.words.map((w) => /robot/i.test(w.w));
    const f = A(87, 900), fsz = l.words.map((w, i) => (isR[i] ? 40 : 34));
    const wds = l.words.map((w, i) => Math.max(isR[i] ? 120 : 70, measure(txt(w), f, fsz[i]!) + 30));
    const tot = wds.reduce((a, b) => a + b, 0) + 16 * (wds.length - 1);
    const sc = Math.min(1, 1640 / tot);
    let x = W / 2 - (tot * sc) / 2 + drift;
    l.words.forEach((w, i) => {
      const cw = wds[i]! * sc, cx = x + cw / 2, k = ease.outBack(prog(t, w.start - 0.1, w.start + 0.2));
      x += (wds[i]! + 16) * sc;
      if (k <= 0.001) return;
      const hot = heat(w, t);
      c.save(); c.translate(cx, by); c.scale(k, k);
      if (isR[i]) { // a robot unit: legs, body, head with a visor — the word on its chest
        c.fillStyle = mix('ash', 'signal', hot); c.fillRect(-cw * 0.32, -40, cw * 0.18, 40); c.fillRect(cw * 0.14, -40, cw * 0.18, 40);
        box(c, -cw / 2, -150 * sc, cw, 112 * sc, 34, mix('ash', 'signal', hot), col('graphite', 1), col('bone', 0.6), col('ink', 0.6), 1.5);
        box(c, -cw * 0.25, -214 * sc, cw * 0.5, 58 * sc, 26, mix('ash', 'signal', hot), col('graphite', 1), col('bone', 0.6), col('ink', 0.6), 1.5);
        c.fillStyle = col('ink', 1); c.fillRect(-cw * 0.18, -194 * sc, cw * 0.36, 12 * sc);
      } else box(c, -cw / 2, -96 * sc, cw, 96 * sc, 40, mix('ash', 'ember', hot * 0.6), col('graphite', 1), col('bone', 0.55), col('ink', 0.6), 1.5);
      c.restore();
      word(s, w, txt(w), f, fsz[i]! * sc * Math.max(0.001, k), cx, by - (isR[i] ? 94 : 48) * sc * k, { base: 'ink', hot: 'blood' });
    });
  });
  void lineIdx;
}

// ------------------------------------------------------------------ V4: diminishing returns — until capital can think, and learns
function returns(s: S) {
  const { t, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const think = fw(l2, /think/i), learns = l2.words[l2.words.length - 1]!;
  // the chart is BUILT FROM THE WORDS: each sung word is a bar. Line 1's bars trace diminishing returns (each one adds
  // less); line 2's bars climb the acid exponential once capital can think, LEARNS the tallest.
  const x0 = 200, y0 = 960, w = 1520, h = 700;
  const zoomOut = prog(t, think.start - 0.2, learns.end + 0.3, ease.inOutCubic);
  cam(s, { x: W / 2, y: lerp(H / 2, H / 2 - 160, zoomOut), z: lerp(1, 0.84, zoomOut), r: 0 });
  const ak = prog(t, l1.start - 0.2, l1.start + 0.3, ease.outExpo);
  rule(c, x0, y0, x0 + w, y0, ak, col('bone', 0.9), 3); rule(c, x0, y0, x0, y0 - h - 300, ak, col('bone', 0.9), 3);
  note(c, 'CAPITAL →', x0 + w, y0 + 44, ak, 22, 'ash', 'right'); note(c, 'OUTPUT', x0 - 10, y0 - h - 316, ak, 22, 'ash');
  const n1 = l1.words.length, n2 = l2.words.length, N = n1 + n2, slot = w / N;
  const conc = (u: number) => h * 0.5 * Math.pow(u, 0.42);              // u: 0..1 across line 1's bars
  const kneeH = conc(1);
  const expo = (u: number) => kneeH + (Math.exp(u * 3.4) - 1) / (Math.exp(3.4) - 1) * (h + 260 - kneeH); // line 2
  const tops: [number, number][] = [];
  [...l1.words, ...l2.words].forEach((wd, i) => {
    const second = i >= n1, u = second ? (i - n1 + 1) / n2 : (i + 1) / n1;
    const bh = (second ? expo(u) : conc(u)) * ease.outCubic(prog(t, wd.start - 0.06, wd.start + 0.3));
    const x = x0 + i * slot + 6, bw = slot - 12, top = y0 - bh;
    tops.push([x + bw / 2, y0 - (second ? expo(u) : conc(u))]);
    if (bh <= 1) return;
    const hot = heat(wd, t);
    c.fillStyle = second ? mix('ink2', 'acid', 0.18 + 0.3 * hot) : mix('ink2', 'signal', 0.12 + 0.35 * hot); c.fillRect(x, top, bw, bh);
    c.strokeStyle = col(second ? 'acid' : 'graphite', 0.9); c.lineWidth = 2; c.strokeRect(x, top, bw, bh);
    if (second && hot > 0.05) { g.fillStyle = col('acid', 0.18 * hot); g.fillRect(x, top, bw, bh); }
    // the word runs up inside its bar (sized to fit both the bar's height and width)
    const f = A(/learns|think|capital|returns|diminishing/i.test(wd.w) ? 100 : 62, 900);
    const fs = Math.min(bw * 0.78, sizeTo(txt(wd), f, Math.max(40, bh - 24), 999));
    word(s, wd, txt(wd), f, fs, x + bw / 2, top + bh / 2, { rot: -Math.PI / 2, glow: second ? 1.3 : 1 });
  });
  // the curve over the bar tops: bone along the flattening, acid once it kinks upward
  const k1 = prog(t, l1.start, l1.words[n1 - 1]!.end + 0.2, ease.inOutQuad), k2 = prog(t, think.start, learns.end + 0.2, ease.inQuad);
  strokePts(c, tops.slice(0, n1), k1, col('bone', 0.9), 4);
  strokePts(c, tops.slice(n1 - 1), k2, col('acid', 1), 6); strokePts(g, tops.slice(n1 - 1), k2, col('acid', 0.4), 16);
}

// ------------------------------------------------------------------ V4: the fab and the vote; man is a rope (between animal and overman) — priced
function rope(s: S) {
  const { t, sh, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const fab = fw(l1, /fab/i), vote = l1.words[l1.words.length - 1]!, zar = fw(l2, /zarathustra/i), rp = l2.words.filter((w) => /rope/i.test(w.w)), pr = fw(l2, /pricing/i);
  const sw = prog(t, l2.start - 0.2, l2.start + 0.3, ease.inOutCubic);
  cam(s, { x: W / 2, y: H / 2 + sw * H, z: 1, r: 0 });
  // panel A: a wafer turning (the fab) beside a ballot slot that nobody uses
  {
    const wx = 430, wy = 620, R = 250, rot = (t - l1.start) * 0.6;
    const fk = prog(t, fab.start - 0.1, fab.start + 0.4, ease.outExpo);
    c.save(); c.translate(wx, wy); c.rotate(rot);
    c.strokeStyle = col('bone', 0.9 * fk); c.lineWidth = 4; c.beginPath(); c.arc(0, 0, R * fk, 0, TAU); c.stroke();
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const x = i * 42, y = j * 42; if (x * x + y * y > (R - 40) * (R - 40)) continue; c.fillStyle = col(hash(i, j) > 0.85 ? 'signal' : 'graphite', 0.9 * fk); c.fillRect(x - 17, y - 17, 34, 34); }
    c.restore();
    word(s, fab, 'FAB', A(125, 900), 140, wx, wy + R + 110, {});
    // ballot box
    const vk = prog(t, vote.start - 0.1, vote.start + 0.3, ease.outBack);
    if (vk > 0.001) { c.strokeStyle = col('bone', 0.9); c.lineWidth = 5; c.strokeRect(1300, 560, 340 * vk, 280); c.fillStyle = col('ink', 1); c.fillRect(1380, 548, 180 * vk, 22); word(s, vote, 'VOTE', A(100, 900), 90, 1470, 720, {}); rule(c, 1280, 560, 1660, 860, prog(t, vote.start + 0.15, vote.start + 0.45, ease.outExpo), col('signal', 1), 10); }
    // the journal: a closed, unread book between the fab and the ballot box (dust on its top edge, a ribbon still tucked in)
    const jw = l1.words.find((w) => /journal/i.test(w.w)), cw_ = l1.words.find((w) => /curve/i.test(w.w));
    if (jw && t >= jw.start - 0.1) {
      const k = ease.outBack(prog(t, jw.start - 0.1, jw.start + 0.3)), bx_ = 960, by_ = 720;
      c.save(); c.translate(bx_, by_); c.scale(Math.max(0.001, k), Math.max(0.001, k)); c.rotate(-0.06);
      box(c, -170, -230, 340, 300, 60, col('blood', 1), col('bone', 0.85), col('bone', 0.7), col('ink', 0.7), 2);
      c.fillStyle = col('ember', 0.85); c.fillRect(-140, -200, 280, 6); c.fillRect(-140, 30, 280, 6);
      for (let i = 0; i < 26; i++) { c.fillStyle = col('ash', 0.35); c.fillRect(-160 + hash(i, 4) * 330, -232 - hash(i, 5) * 6, 4, 2); }
      c.fillStyle = col('signal', 1); c.fillRect(110, 66, 14, 60);
      c.restore();
      word(s, jw, 'JOURNAL', F.serif(600, false), 54 * Math.max(0.001, k), bx_, by_ - 110, { base: 'bone', hot: 'ember' });
      note(c, 'VOL. 1 · UNREAD', bx_, by_ - 40, k, 18, 'bone', 'center');
    }
    // the curve: drawn on the front of the ballot box, already climbing past it
    if (cw_ && t >= cw_.start - 0.06) {
      const k = prog(t, cw_.start, cw_.start + 0.5, ease.inQuad), pts: [number, number][] = [];
      for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([1320 + u * 300, 820 - (Math.exp(u * 3) - 1) / (Math.exp(3) - 1) * 380]); }
      strokePts(c, pts, k, col('acid', 1), 6); strokePts(g, pts, k, col('acid', 0.4), 16);
    }
    lyric(s, l1.words.slice(0, -1), 180, { width: 1600, max: 74 });
  }
  // panel B: an actual rope (twisted strands) slung between ANIMAL and OVERMAN. Fuse style: the words sit ON the rope, a
  // spark burns along it word by word, the camera rides it zoomed in — then pulls back before "out here pricing rope" to
  // show the whole span, and a price tag swings onto it.
  {
    const oy = H;
    const ax = 170, bx = W - 170, py = oy + 360, sag = 320;
    const pts: [number, number][] = []; for (let i = 0; i <= 200; i++) { const u = i / 200; pts.push([lerp(ax, bx, u), py + sag * 4 * u * (1 - u)]); }
    const ws = l2.words;
    const outW = ws.find((w) => /^out$/i.test(clean(w.w))) ?? ws[Math.max(0, ws.length - 4)]!;
    const bigs = ws.map((w) => /rope|zarathustra|man|pricing/i.test(w.w));
    const fams = ws.map((_, i) => A(bigs[i] ? 100 : 62, bigs[i] ? 900 : 500)), szs = ws.map((_, i) => (bigs[i] ? 46 : 30));
    const wds = ws.map((w, i) => measure(txt(w), fams[i]!, szs[i]!) + 26);
    const tot = wds.reduce((x, y) => x + y, 0); const us: number[] = []; let acc0 = 0;
    for (const wd of wds) { us.push(0.05 + 0.82 * (acc0 + wd / 2) / tot); acc0 += wd; }
    const pos = us.map((u) => along(pts, u));
    let cur = -1; ws.forEach((w, i) => { if (t >= w.start) cur = i; });
    const wordLit = cur < 0 ? 0.03 * prog(t, l2.start - 0.3, ws[0]!.start) : lerp(us[cur]! - (wds[cur]! / tot) * 0.41, us[cur]! + (wds[cur]! / tot) * 0.41, prog(t, ws[cur]!.start, Math.max(ws[cur]!.start + 0.1, ws[cur]!.end)));
    // After the last sung word, the fuse keeps burning into the handoff instead of freezing in place.
    const last = ws.length - 1;
    const lit = cur === last && t > ws[last]!.end
      ? lerp(wordLit, 1, prog(t, ws[last]!.end, sh.end - 0.1, ease.inOutCubic))
      : wordLit;
    // camera: ride the words zoomed in; the pull-back starts just before "out"
    const ride = ws.filter((w) => w.start < outW.start);
    const times = [l2.start - 0.3, ...ride.map((w) => w.start - 0.07), outW.start - 0.4];
    const targets = [{ x: pos[0]!.x + 60, y: pos[0]!.y - 60, z: 2.1, r: 0 }, ...ride.map((_, i) => ({ x: pos[i]!.x + 50, y: pos[i]!.y - 60, z: 2.1, r: -clamp(pos[i]!.a, -0.5, 0.5) * 0.3 })), { x: W / 2, y: oy + H / 2 - 20, z: 1, r: 0 }];
    const kB = snapCam(t, times, targets, 0.5);
    const kA = { x: W / 2, y: H / 2, z: 1, r: 0 };
    cam(s, lerpCam(kA, kB, sw));
    // posts
    for (const [x, lab] of [[ax, 'ANIMAL'], [bx, 'OVERMAN']] as const) { c.fillStyle = col('graphite', 1); c.fillRect(x - 10, py - 30, 20, oy + 1000 - py); c.fillStyle = col('ash', 1); c.beginPath(); c.arc(x, py, 16, 0, TAU); c.fill(); note(c, lab, x, py - 50, 1, 22, 'ash', 'center'); }
    // the rope: thick core, twisted strand marks every ~14 px (charred and glowing behind the spark), a highlight
    strokePts(c, pts, 1, col('graphite', 1), 22); strokePts(c, pts, 1, col('ash', 1), 16);
    let L = 0;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]!, [x1, y1] = pts[i]!, seg = Math.hypot(x1 - x0, y1 - y0), an = Math.atan2(y1 - y0, x1 - x0);
      for (let d = (14 - (L % 14)) % 14; d < seg; d += 14) {
        const px = x0 + Math.cos(an) * d, py2 = y0 + Math.sin(an) * d, u = (i - 1 + d / seg) / (pts.length - 1);
        const nx = -Math.sin(an), ny = Math.cos(an), tx = Math.cos(an), ty = Math.sin(an);
        const burnt = u < lit;
        c.strokeStyle = burnt ? mix('blood', 'signal', 0.6) : col('graphite', 1); c.lineWidth = 3;
        c.beginPath(); c.moveTo(px - nx * 8 - tx * 6, py2 - ny * 8 - ty * 6); c.lineTo(px + nx * 8 + tx * 6, py2 + ny * 8 + ty * 6); c.stroke();
        if (burnt && (Math.floor(L + d) % 28) < 14) { g.strokeStyle = col('ember', 0.35); g.lineWidth = 6; g.beginPath(); g.moveTo(px - nx * 8, py2 - ny * 8); g.lineTo(px + nx * 8, py2 + ny * 8); g.stroke(); }
      }
      L += seg;
    }
    // the spark head
    const sp = along(pts, Math.max(0.001, lit));
    g.fillStyle = col('ember', 0.95); g.beginPath(); g.arc(sp.x, sp.y, 16, 0, TAU); g.fill();
    for (let i = 0; i < 10; i++) { const a2 = hash(i, Math.floor(t * 60)) * TAU, r2 = 12 + hash(i, 3, Math.floor(t * 60)) * 40; rule(g, sp.x, sp.y, sp.x + Math.cos(a2) * r2, sp.y + Math.sin(a2) * r2, 1, col('signal', 0.8), 2); }
    c.fillStyle = col('ember', 1); c.beginPath(); c.arc(sp.x, sp.y, 6, 0, TAU); c.fill();
    // the words sit on the rope, rotated with it
    ws.forEach((w, i) => {
      if (t < w.start - 0.45) return;
      const p = pos[i]!, rot = clamp(p.a, -0.6, 0.6), off = szs[i]! * 0.55 + 14;
      word(s, w, txt(w), fams[i]!, szs[i]!, p.x + Math.sin(rot) * off, p.y - Math.cos(rot) * off, { rot, sc: slam(w, t, 1.4), ghost: 0.12 });
    });
    // the price tag swings onto the rope on "pricing"
    const pk = prog(t, pr.start, pr.start + 0.5, ease.outElastic);
    if (pk > 0) {
      const tp = along(pts, 0.93); const sway = Math.sin((t - pr.start) * 5) * 0.2 * (1 - prog(t, pr.start, pr.start + 2));
      c.save(); c.translate(tp.x, tp.y); c.rotate(sway); rule(c, 0, 0, 0, 120 * pk, 1, col('bone', 1), 3);
      c.fillStyle = col('signal', 1); c.beginPath(); c.moveTo(-90, 120 * pk); c.lineTo(90, 120 * pk); c.lineTo(90, 220 * pk); c.lineTo(-90, 220 * pk); c.closePath(); c.fill();
      setFont(c, F.mono(700), 34 * pk); c.fillStyle = col('ink', 1); c.textAlign = 'center'; c.fillText('$ / FT', 0, 182 * pk); c.restore();
      g.fillStyle = col('ember', 0.3 * pk); g.fillRect(tp.x - 90, tp.y + 120, 180, 100);
    }
    void rp; void zar;
  }
}

export const CRITICS = { wall, tenure, stoppedClock, offramp, family, cat, bubble, rails, hilbert, swarm, lean, shenzhen, assembly, returns, rope };
void base; void CAP; void typeOn;
