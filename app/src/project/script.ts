// The edit, by SECTION (see STORYBOARD.md). Every kind here is a bespoke composition in project/shots*.ts unless noted.
// Two worlds: PAPER (the "normal technology" argument: bone sheets, ink, footnotes, slow charts) and FURNACE (compute:
// near-black, molten orange, the acid hyperbolic curve). Paper owns the intro, the economists and the bridge's proofs;
// the furnace owns every chorus and takes over the frame as the song goes on. The outro returns to paper for one word.
export type Spec = [kind: string, lines: number, opts?: Record<string, any>];

const P = { bg: { paper: 1 } }; // paper sheet: words stay solid ink (see WORKFLOW "paper plates")

/** Chorus: robots → minds → fleet, then the hyperbolic route → footnotes → compounding curve. `n` grows each time. */
function chorus(n: number, c: number): Spec[] {
  if (c === 6) return [['robots', 1, { n }], ['minds', 1, { n }], ['fleet', 1, { n }], ['hyper', 1, { n }], ['footnotes', 1, { n }], ['compound', 1, { n }]];
  if (c === 8) return [['oracle', 1, { n }], ['robots', 1, { n }], ['minds', 1, { n }], ['fleet', 1, { n }], ['oracle', 1, { n, v: 1 }], ['hyper', 1, { n }], ['footnotes', 1, { n }], ['compound', 1, { n }], ['interlude', 0, { afterPrev: 1.6 }]];
  if (c === 9) return [['oracle', 1, { n, boom: 1 }], ['robots', 1, { n }], ['minds', 1, { n }], ['fleet', 1, { n }], ['oracle', 1, { n, v: 1 }], ['hyper', 1, { n }], ['footnotes', 1, { n }], ['compound', 2, { n }]];
  return [['slam', c]];
}

export const SECTIONS: Record<string, (occ: number, count: number) => Spec[]> = {
  // spoken prologue on a clean paper sheet; the S-curve breaks upward on "consider", then the instrumental takes off
  intro: () => [['paperTitle', 1, P], ['analogies', 1, P], ['scurve', 2, P], ['takeoff', 0, { afterPrev: 1.2 }]],
  verse: (o, c) => {
    if (o === 1) return [['sarcasm', 1], ['dynamo', 1], ['factory', 1], ['stampShot', 1, P], ['tfp', 2, P], ['tasks', 2], ['solow', 2], ['gantt', 2, P]];
    if (o === 2) return [['wall', 2], ['tenure', 2], ['stoppedClock', 2], ['offramp', 2], ['family', 2], ['cat', 2]];
    if (o === 3) return [['bubble', 2], ['rails', 2]];
    if (o === 4) return [['shenzhen', 2], ['assembly', 2], ['returns', 2], ['rope', 2]];
    return [['slam', c]];
  },
  pre: () => [['baumol', 2, P], ['hammer', 2]],
  chorus: (n, c) => chorus(n, c),
  final: (_n, c) => chorus(3, c),
  bridge: () => [['clay', 2, P], ['hilbert', 2], ['swarm', 2], ['lean', 2]],
  outro: () => [['cute', 2, P]],
};
