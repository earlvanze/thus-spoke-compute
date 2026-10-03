// Project shots (EXTRA overrides LIBRARY by name). Every lyric line of this video belongs to a bespoke composition:
//   shots-paper.ts   — the working paper (intro, verse-1 economists, pre-chorus, the Clay problems, the outro)
//   shots-furnace.ts — compute: the takeoff, verse-1 dark shots, the hammer, every chorus (grows with o.n), THUS SPOKE COMPUTE
//   shots-critics.ts — verse 2 (the critics), verse 3 (bubble, rails), the bridge's proof machine, verse 4 (the buildout)
// Rules: pure functions of s.t; words land on w.start; only signal/ember/acid on the glow layer; type >= 96 px from the edges.
import type { S } from '../scenes/shots';
import { PAPER } from './shots-paper';
import { FURNACE } from './shots-furnace';
import { CRITICS } from './shots-critics';

export const EXTRA: Record<string, (s: S) => void> = { ...PAPER, ...FURNACE, ...CRITICS };
