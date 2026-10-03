// THE CRITICS and THE BUILDOUT: verse 2 (the wall, the clock, the off-ramp, the world model, the cat), verse 3 (the bubble,
// the rails), the bridge's proof machine, and verse 4 (Shenzhen, the assembly line, returns that learn, the rope).
// All drawings are original line art made of rules, arcs and type.
import {
  A, CAP, F, H, W, base, clamp, col, ease, from, fw, hold, label, lerp, ln, lyric, measure, mix, note, prog, rule, setFont, slam,
  strokePts, TAU, txt, typeOn, upto, word, along, sizeTo, pulseAt, stamp, type S, type Word,
} from './common';
import { cam } from '../scenes/shots';
import { clean } from '../scenes/kit';
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
  if (gk > 0) {
    const mx = 1600, my = 260;
    c.strokeStyle = col('signal', 1); c.lineWidth = 8; c.beginPath(); c.moveTo(mx - 50, my - 160); c.lineTo(mx, my - 50); c.lineTo(mx + 50, my - 160); c.stroke();
    c.fillStyle = col('signal', 1); c.beginPath(); c.arc(mx, my, 90 * gk, 0, TAU); c.fill();
    g.fillStyle = col('ember', 0.5); g.beginPath(); g.arc(mx, my, 110 * gk, 0, TAU); g.fill();
    label(s, 'IMO', A(100, 900), 46 * gk, mx, my, col('ink', 1));
  }
  // line 2 set at the top; THROUGH punches through the hole
  lyric(s, l2.words.slice(0, -1), 150, { width: 1600, max: 74, alpha: t > l2.start - 0.4 ? 1 : 0 });
  word(s, thr, 'THROUGH', A(125, 900), 260 * lerp(0.3, 1, boom), W / 2, 520, { sc: slam(thr, t, 2.4) });
  s.post.shake = [noise1(t * 60, 1) * 20 * pulseAt(t, brk.start, 0.12), noise1(t * 60, 2) * 20 * pulseAt(t, brk.start, 0.12)];
}

// ------------------------------------------------------------------ V2: the wall should get tenure; every flub becomes a post
function tenure(s: S) {
  const { t, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const ten = fw(l1, /tenure/i), wl = fw(l1, /wall/i), adv = fw(l2, /adventure/i);
  const sw = prog(t, l2.start - 0.2, l2.start + 0.25, ease.inOutCubic);
  cam(s, { x: W / 2 + sw * 120, y: H / 2, z: lerp(1, 0.95, sw), r: 0 });
  // the nameplate on a door: WALL, with a mortarboard
  const a1 = 1 - 0.85 * sw;
  const px = 560, py = 560;
  c.strokeStyle = col('bone', 0.9 * a1); c.lineWidth = 5; c.strokeRect(px - 300, py - 330, 600, 760);
  c.fillStyle = col('ink2', a1); c.fillRect(px - 220, py - 110, 440, 160); c.strokeRect(px - 220, py - 110, 440, 160);
  word(s, wl, 'THE WALL', A(100, 900), 70, px, py - 30, { alpha: a1 });
  const tk = prog(t, ten.start - 0.05, ten.start + 0.4, ease.outBack);
  if (tk > 0) {
    // mortarboard: a rhombus + cap + tassel, dropped onto the plate
    const my = py - 170 - (1 - tk) * 300;
    c.fillStyle = col('signal', a1); c.beginPath(); c.moveTo(px - 170, my); c.lineTo(px, my - 50); c.lineTo(px + 170, my); c.lineTo(px, my + 50); c.closePath(); c.fill();
    c.fillRect(px - 80, my, 160, 60); rule(c, px + 120, my, px + 140, my + 110, 1, col('ember', a1), 4);
    label(s, 'TENURED', F.mono(700), 34, px, py + 120, col('signal', a1 * tk));
  }
  lyric(s, upto(l1, /tenure/i), 300, { x: 1340, width: 900, max: 84, alpha: a1 });
  word(s, ten, 'TENURE.', F.serif(600, true), 200, 1340, 560, { sc: slam(ten, t, 1.4), alpha: Math.max(0.2, a1) });
  // line 2: each beat after "flubs" another post card slides in; ADVENTURE is the headline of the last one
  if (sw > 0) {
    const fl = fw(l2, /flubs/i);
    const cards = Math.floor(clamp((t - fl.start) / 0.14, 0, 14));
    for (let i = 0; i < cards; i++) {
      const x = 1000 + (i % 7) * 70 + 120, y = 380 + i * 34;
      c.fillStyle = col('bone', 0.95); c.fillRect(x, y, 600, 220); c.strokeStyle = col('graphite', 1); c.lineWidth = 2; c.strokeRect(x, y, 600, 220);
      setFont(c, F.mono(700), 22); c.fillStyle = col('ink', 1); c.textAlign = 'left'; c.fillText(`NEW POST · #${(i + 1) * 37}`, x + 24, y + 44);
      for (let k = 0; k < 3; k++) { c.fillStyle = col('graphite', 0.3); c.fillRect(x + 24, y + 80 + k * 34, 480 - k * 90, 14); }
    }
    lyric(s, upto(l2, /flubs/i).concat([fl]), 220, { x: 760, width: 1200, max: 90 });
    lyric(s, from(l2, /becomes/i, /adventure/i), 860, { x: 560, width: 700, max: 70, anno: false });
    word(s, adv, 'ADVENTURE', A(125, 900), 120, 560, 980, { sc: slam(adv, t, 1.6) });
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
  if (ck > 0) { label(s, '✓ 10:10', F.mono(700), 40 * ck, cx, cy + 160, col('signal', 1)); label(s, '✓ 22:10', F.mono(700), 40 * ck, cx, cy + 210, col('signal', 1)); }
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
function offramp(s: S) {
  const { t, sh, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const off = fw(l1, /off/i), road = l1.words[l1.words.length - 1]!, doomed = l2.words.filter((w) => /doom/i.test(w.w)), load = l2.words[l2.words.length - 1]!;
  scr(s, 1.0, 1.03);
  const hy = 430; // horizon
  // perspective road: two edges converging, dashes running toward the camera (speed), and the exit ramp peeling right
  const vx = W / 2;
  c.fillStyle = col('ink2', 1); c.beginPath(); c.moveTo(vx - 20, hy); c.lineTo(vx + 20, hy); c.lineTo(W + 300, H); c.lineTo(-300, H); c.closePath(); c.fill();
  rule(c, vx - 20, hy, -300, H, 1, col('bone', 0.8), 4); rule(c, vx + 20, hy, W + 300, H, 1, col('bone', 0.8), 4);
  const run = (t - sh.start) * 1.6;
  for (let i = 0; i < 14; i++) { const z0 = ((i / 14 + run) % 1), z1 = z0 + 0.03; const f = (z: number) => hy + (H - hy) * Math.pow(z, 2.2); rule(c, vx, f(z0), vx, f(z1), 1, col('bone', 0.8), 2 + 14 * z0); }
  const rk = prog(t, off.start - 0.1, off.start + 0.5, ease.outCubic);
  c.strokeStyle = col('signal', 0.9 * rk); c.lineWidth = 5; c.beginPath(); c.moveTo(vx + 400, H); c.quadraticCurveTo(vx + 380, hy + 160, W + 100, hy + 120); c.stroke();
  // the exit sign
  const sk = prog(t, l1.start - 0.1, l1.start + 0.3, ease.outBack);
  if (sk > 0) {
    c.fillStyle = col('bone', 0.95); c.fillRect(1240, 140, 540 * sk, 200); rule(c, 1500, 340, 1500, 470, sk, col('graphite', 1), 10);
    word(s, off, 'OFF-RAMP →', A(100, 900), 70, 1510, 210, { base: 'ink', hot: 'blood', alpha: sk });
    word(s, road, 'NOT THE ROAD', F.mono(700), 34, 1510, 290, { base: 'ink', hot: 'blood', alpha: sk });
  }
  lyric(s, upto(l1, /off/i), 200, { x: 640, width: 980, max: 96, alpha: 1 - prog(t, l2.start - 0.2, l2.start + 0.2) * 0.8 });
  // line 2: the truck labelled DOOMED hauls a trailer of tokens up the road
  if (t > l2.start - 0.3) {
    const dk = prog(t, l2.start, load.end + 0.5, ease.inOutCubic);
    const z = lerp(0.95, 0.35, dk), ty = hy + (H - hy) * Math.pow(z, 2.2), sc = 0.2 + 1.3 * Math.pow(z, 2.2);
    c.save(); c.translate(vx - 60 * sc, ty); c.scale(sc, sc);
    c.fillStyle = col('graphite', 1); c.fillRect(-420, -260, 600, 230); c.fillStyle = col('signal', 1); c.fillRect(200, -200, 180, 170);
    c.fillStyle = col('ink', 1); c.fillRect(260, -180, 90, 60);
    for (const wx of [-340, -100, 280]) { c.fillStyle = col('ink', 1); c.beginPath(); c.arc(wx, -20, 46, 0, TAU); c.fill(); c.strokeStyle = col('bone', 0.9); c.lineWidth = 8; c.stroke(); }
    setFont(c, F.mono(700), 34); c.textAlign = 'left';
    for (let r = 0; r < 4; r++) for (let q = 0; q < 6; q++) { c.fillStyle = col(hash(r, q) > 0.8 ? 'signal' : 'bone', 0.9); c.fillText(['tok', '▮', 'λ', '∑', 'id', '01'][(r + q) % 6]!, -400 + q * 96, -200 + r * 44); }
    c.restore();
    lyric(s, l2.words.filter((w) => w !== doomed[0]), 560, { width: 1200, max: 64, anno: false, x: 640 });
    if (doomed[0]) word(s, doomed[0], 'DOOMED,', A(125, 900), 120, 640, 440, { sc: slam(doomed[0], t, 1.6) });
    void g;
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
  if (hk > 0) { rule(c, 470, 640, 520, 760, hk, col('signal', 1), 4); rule(c, 570, 640, 520, 760, hk, col('signal', 1), 4); c.fillStyle = col('signal', 1); c.fillRect(470, 760, 100 * hk, 70 * hk); label(s, 'STAFF', F.mono(700), 22 * hk, 520, 795, col('ink', 1)); }
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
  if (tk > 0) { c.fillStyle = col('bone', tk); c.fillRect(vx - 60, hy - 170, 120, 110); c.fillRect(vx - 100, hy - 66, 200, 16); }
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
    if (vk > 0) {
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
    if (rk > 0) stamp(s, 'REFEREE: NOTHING TO ADD', 1250, 960, kid.start, 44, -0.06, 'signal');
    void g;
  }
  void sh;
}

// ------------------------------------------------------------------ V4: Shenzhen 1980 — boats and paddy fields; the skyline yields
function shenzhen(s: S) {
  const { t, sh, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const yrW = fw(l1, /nineteen/i), boats = fw(l1, /boats/i), paddy = fw(l1, /paddy/i), look = fw(l2, /look/i), sky = fw(l2, /skyline/i);
  scr(s, 1.0, 1.04);
  const hy = 700;
  const grow = prog(t, look.start - 0.1, sky.end + 0.4, ease.outExpo);
  // water + waves
  for (let i = 0; i < 9; i++) { const y = hy + 30 + i * 36; c.strokeStyle = col('graphite', 0.7); c.lineWidth = 2; c.beginPath(); for (let x = 0; x <= W; x += 20) { const yy = y + Math.sin(x * 0.02 + t * 1.5 + i) * 5; x ? c.lineTo(x, yy) : c.moveTo(x, yy); } c.stroke(); }
  rule(c, 0, hy, W, hy, 1, col('bone', 0.8), 3);
  // boats (original simple hulls with a mast and a sail)
  const bk = prog(t, boats.start - 0.1, boats.start + 0.4, ease.outCubic);
  for (let i = 0; i < 4; i++) { const x = 300 + i * 380 + Math.sin(t * 0.7 + i) * 20, y = hy + 70 + (i % 2) * 70; if (bk <= 0) break; c.fillStyle = col('bone', bk * (1 - grow * 0.6)); c.beginPath(); c.moveTo(x - 70, y); c.lineTo(x + 70, y); c.lineTo(x + 50, y + 26); c.lineTo(x - 50, y + 26); c.closePath(); c.fill(); rule(c, x, y, x, y - 90, 1, col('bone', bk), 3); c.beginPath(); c.moveTo(x + 4, y - 86); c.lineTo(x + 60, y - 20); c.lineTo(x + 4, y - 20); c.closePath(); c.fill(); }
  // paddy field terraces (the near shore, left) — replaced by towers as the skyline grows
  const pk = prog(t, paddy.start - 0.1, paddy.start + 0.5, ease.outCubic) * (1 - grow);
  for (let i = 0; i < 7; i++) rule(c, 100, hy - 20 - i * 18, 100 + (700 - i * 60) * pk, hy - 20 - i * 18, 1, col('graphite', 0.9), 3);
  // the skyline: towers rise from the horizon; each carries a word of line 2 rotated vertically
  const ws2 = l2.words;
  for (let i = 0; i < 16; i++) {
    const x = 120 + i * 110, h = (220 + hash(i, 9) * 460) * prog(grow, (i % 5) * 0.08, (i % 5) * 0.08 + 0.6, ease.outExpo), w = 80 + hash(i, 2) * 40;
    if (h <= 1) continue;
    c.fillStyle = col('ink2', 1); c.strokeStyle = col('graphite', 1); c.lineWidth = 2; c.fillRect(x, hy - h, w, h); c.strokeRect(x, hy - h, w, h);
    for (let r = 0; r < h / 30 - 1; r++) if (hash(i, r) > 0.45) { c.fillStyle = col('signal', 0.7); c.fillRect(x + 10, hy - h + 12 + r * 30, w - 20, 8); g.fillStyle = col('ember', 0.2); g.fillRect(x + 10, hy - h + 12 + r * 30, w - 20, 8); }
  }
  // the year: 1980 → 2026 on "skyline"
  const yr = Math.round(lerp(1980, 2026, prog(t, look.start, sky.end, ease.inOutCubic)));
  if (t > yrW.start - 0.05) label(s, String(yr), A(62, 900), 260, 1560, 220, col(t > look.start ? 'signal' : 'bone', 0.9));
  { const a = 1 - prog(t, l2.start - 0.2, l2.start + 0.2) * 0.8, k = Math.max(1, l1.words.findIndex((w) => /fishing/i.test(w.w))); lyric(s, l1.words.slice(0, k), 170, { width: 1150, max: 90, align: 'l', alpha: a }); lyric(s, l1.words.slice(k), 300, { width: 1150, max: 80, align: 'l', alpha: a, anno: false }); }
  if (t > l2.start - 0.3) lyric(s, ws2, 950, { width: 1600, max: 84 });
  void sh;
}

// ------------------------------------------------------------------ V4: the assembly line — ROBOTS stamped on every unit
function assembly(s: S) {
  const { t, sh, c, g } = s;
  const all = sh.lines.flatMap((l) => l.words);
  scr(s, 1.0, 1.03);
  // the belt: rollers + moving chevrons
  const by = 760;
  rule(c, 0, by, W, by, 1, col('bone', 0.8), 4); rule(c, 0, by + 70, W, by + 70, 1, col('bone', 0.8), 4);
  const mv = ((t - sh.start) * 260) % 120;
  for (let x = -120; x < W + 120; x += 120) { c.strokeStyle = col('graphite', 1); c.lineWidth = 4; c.beginPath(); c.moveTo(x - mv + 20, by + 12); c.lineTo(x - mv + 50, by + 35); c.lineTo(x - mv + 20, by + 58); c.stroke(); }
  for (let x = 40; x < W; x += 160) { c.strokeStyle = col('graphite', 1); c.beginPath(); c.arc(x, by + 110, 22, 0, TAU); c.stroke(); }
  // stations (arm shapes) above the belt: MINE / WIRE / PAINT
  const ST = [{ x: 420, l: 'MINE' }, { x: 960, l: 'WIRE' }, { x: 1500, l: 'PAINT' }];
  const verbs = all.filter((w) => /mine|wire|paint/i.test(w.w));
  ST.forEach((st, i) => {
    const v = verbs[i];
    const hit = v ? pulseAt(t, v.start, 0.12) : 0;
    rule(c, st.x, 140, st.x, 380 + 160 * hit, 1, col('bone', 0.9), 12);
    c.fillStyle = col(hit > 0.1 ? 'signal' : 'graphite', 1); c.fillRect(st.x - 70, 380 + 160 * hit, 140, 40);
    if (hit > 0.05) { g.fillStyle = col('ember', 0.5 * hit); g.fillRect(st.x - 90, 370 + 160 * hit, 180, 60); }
    note(c, st.l, st.x, 120, 0.8, 22, 'ash', 'center');
  });
  // every sung word rides the belt: it enters at its onset at the right of the station that matches, and flows left
  const lineIdx = (w: Word) => sh.lines.findIndex((l) => l.words.includes(w));
  sh.lines.forEach((l, li) => {
    const nxt = sh.lines[li + 1];
    const off = nxt ? prog(t, nxt.start - 0.15, nxt.start + 0.35, ease.inCubic) : 0;
    if (off >= 1 || t < l.start - 0.5) return;
    const drift = -(t - l.start) * 25 - off * 2200;
    const sizes = l.words.map((w) => (/robot/i.test(w.w) ? 92 : 64));
    const fams = l.words.map((w) => A(/robot/i.test(w.w) ? 125 : 87, 900));
    const wds = l.words.map((w, i) => measure(txt(w), fams[i]!, sizes[i]!));
    const tot = wds.reduce((a, b) => a + b, 0) + 30 * (wds.length - 1);
    const sc = Math.min(1, 1560 / tot);
    let x = W / 2 - (tot * sc) / 2 + drift;
    l.words.forEach((w, i) => { word(s, w, txt(w), fams[i]!, sizes[i]! * sc, x + (wds[i]! * sc) / 2, 690 - (sizes[i]! * sc) * 0.2, { sc: slam(w, t, 1.5) }); x += (wds[i]! + 30) * sc; });
  });
  void lineIdx;
}

// ------------------------------------------------------------------ V4: diminishing returns — until capital can think, and learns
function returns(s: S) {
  const { t, c } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const dim_ = fw(l1, /diminishing/i), think = fw(l2, /think/i), learns = l2.words[l2.words.length - 1]!;
  scr(s, 1.0, 1.03);
  const x0 = 240, y0 = 920, w = 1100, h = 560;
  const ak = prog(t, l1.start - 0.2, l1.start + 0.3, ease.outExpo);
  rule(c, x0, y0, x0 + w, y0, ak, col('bone', 0.9), 3); rule(c, x0, y0, x0, y0 - h, ak, col('bone', 0.9), 3);
  note(c, 'CAPITAL →', x0 + w, y0 + 44, ak, 22, 'ash', 'right'); note(c, 'OUTPUT', x0 - 10, y0 - h - 16, ak, 22, 'ash');
  // concave part: sqrt-ish flattening
  const conc: [number, number][] = []; for (let i = 0; i <= 40; i++) { const u = i / 40 * 0.6; conc.push([x0 + u * w, y0 - h * 0.55 * Math.pow(u / 0.6, 0.4)]); }
  strokePts(c, conc, prog(t, l1.start, dim_.end + 0.3, ease.inOutQuad), col('bone', 1), 6);
  // the knee: on "think" the curve bends upward in acid
  const kn = conc[conc.length - 1]!;
  const ex: [number, number][] = [[kn[0], kn[1]]]; for (let i = 1; i <= 40; i++) { const u = i / 40; ex.push([kn[0] + u * w * 0.4, kn[1] - (Math.exp(u * 3.5) - 1) / (Math.exp(3.5) - 1) * 900]); }
  const ek = prog(t, think.start, learns.end + 0.2, ease.inQuad);
  strokePts(c, ex, ek, col('acid', 1), 7); strokePts(s.g, ex, ek, col('acid', 0.45), 18);
  if (ek > 0) { c.fillStyle = col('acid', 1); c.beginPath(); c.arc(kn[0], kn[1], 12, 0, TAU); c.fill(); }
  // the dashed "diminishing" asymptote
  c.setLineDash([12, 10]); rule(c, kn[0], kn[1], x0 + w, kn[1] - 30, prog(t, dim_.start, dim_.end + 0.3), col('graphite', 1), 3); c.setLineDash([]);
  const a1 = 1 - prog(t, l2.start - 0.2, l2.start + 0.2) * 0.75;
  lyric(s, l1.words, 160, { width: 1600, max: 80, alpha: a1 });
  lyric(s, upto(l2, /learns/i), 280, { width: 1600, max: 80, alpha: t > l2.start - 0.4 ? 1 : 0, anno: false });
  word(s, learns, 'LEARNS.', A(125, 900), 220 * lerp(0.7, 1.0, ek), 1560, 560, { sc: slam(learns, t, 1.8), rot: -0.08 });
}

// ------------------------------------------------------------------ V4: the fab and the vote; man is a rope (between animal and overman) — priced
function rope(s: S) {
  const { t, c, g } = s;
  const l1 = ln(s, 0), l2 = ln(s, 1);
  const fab = fw(l1, /fab/i), vote = l1.words[l1.words.length - 1]!, zar = fw(l2, /zarathustra/i), rp = l2.words.filter((w) => /rope/i.test(w.w)), pr = fw(l2, /pricing/i);
  const sw = prog(t, l2.start - 0.2, l2.start + 0.3, ease.inOutCubic);
  cam(s, { x: W / 2, y: H / 2 + sw * H, z: 1, r: 0 });
  // panel A: a wafer turning (the fab) beside a ballot slot that nobody uses
  {
    const wx = 520, wy = 600, R = 280, rot = (t - l1.start) * 0.6;
    const fk = prog(t, fab.start - 0.1, fab.start + 0.4, ease.outExpo);
    c.save(); c.translate(wx, wy); c.rotate(rot);
    c.strokeStyle = col('bone', 0.9 * fk); c.lineWidth = 4; c.beginPath(); c.arc(0, 0, R * fk, 0, TAU); c.stroke();
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const x = i * 42, y = j * 42; if (x * x + y * y > (R - 40) * (R - 40)) continue; c.fillStyle = col(hash(i, j) > 0.85 ? 'signal' : 'graphite', 0.9 * fk); c.fillRect(x - 17, y - 17, 34, 34); }
    c.restore();
    word(s, fab, 'FAB', A(125, 900), 140, wx, wy + R + 110, {});
    // ballot box
    const vk = prog(t, vote.start - 0.1, vote.start + 0.3, ease.outBack);
    if (vk > 0) { c.strokeStyle = col('bone', 0.9); c.lineWidth = 5; c.strokeRect(1300, 560, 340 * vk, 280); c.fillStyle = col('ink', 1); c.fillRect(1380, 548, 180 * vk, 22); word(s, vote, 'VOTE', A(100, 900), 90, 1470, 720, {}); rule(c, 1280, 560, 1660, 860, prog(t, vote.start + 0.15, vote.start + 0.45, ease.outExpo), col('signal', 1), 10); }
    lyric(s, l1.words.slice(0, -1), 180, { width: 1600, max: 74 });
  }
  // panel B: a rope slung between ANIMAL and OVERMAN; the line's words walk it; then a price tag swings on
  {
    const oy = H;
    const ax = 220, bx = W - 220, py = oy + 420, sag = 260;
    const rk = prog(t, zar.start - 0.1, zar.start + 0.5, ease.outCubic);
    const pts: [number, number][] = []; for (let i = 0; i <= 60; i++) { const u = i / 60; pts.push([lerp(ax, bx, u), py + sag * 4 * u * (1 - u)]); }
    strokePts(c, pts, rk, col('bone', 0.95), 8);
    for (const [x, lab] of [[ax, 'ANIMAL'], [bx, 'OVERMAN']] as const) { rule(c, x, py - 40, x, oy + 980, rk, col('graphite', 1), 12); note(c, lab, x, py - 60, rk, 24, 'ash', 'center'); }
    const ws = l2.words;
    const bigs = ws.map((w) => /rope|zarathustra|man|pricing/i.test(w.w));
    const wds = ws.map((w, i) => measure(txt(w), A(bigs[i] ? 100 : 62, bigs[i] ? 900 : 500), bigs[i] ? 60 : 40) + 64);
    const tot = wds.reduce((a, b) => a + b, 0); let acc0 = 0;
    ws.forEach((w, i) => {
      const u = 0.04 + 0.8 * (acc0 + wds[i]! / 2) / tot; acc0 += wds[i]!;
      const p = along(pts, u);
      word(s, w, txt(w), A(bigs[i] ? 100 : 62, bigs[i] ? 900 : 500), bigs[i] ? 60 : 40, p.x, p.y - 55, { rot: p.a * 0.35, sc: slam(w, t, 1.4) });
    });
    // the price tag on "pricing"
    const pk = prog(t, pr.start, pr.start + 0.5, ease.outElastic);
    if (pk > 0) {
      const tp = along(pts, 0.93); const sway = Math.sin((t - pr.start) * 5) * 0.2 * (1 - prog(t, pr.start, pr.start + 2));
      c.save(); c.translate(tp.x, tp.y); c.rotate(sway); rule(c, 0, 0, 0, 120 * pk, 1, col('bone', 1), 3);
      c.fillStyle = col('signal', 1); c.beginPath(); c.moveTo(-90, 120 * pk); c.lineTo(90, 120 * pk); c.lineTo(90, 220 * pk); c.lineTo(-90, 220 * pk); c.closePath(); c.fill();
      setFont(c, F.mono(700), 34 * pk); c.fillStyle = col('ink', 1); c.textAlign = 'center'; c.fillText('$ / FT', 0, 182 * pk); c.restore();
      g.fillStyle = col('ember', 0.3 * pk); g.fillRect(tp.x - 90, tp.y + 120, 180, 100);
    }
    void rp;
  }
}

export const CRITICS = { wall, tenure, stoppedClock, offramp, family, cat, bubble, rails, hilbert, swarm, lean, shenzhen, assembly, returns, rope };
void base; void CAP; void typeOn;
