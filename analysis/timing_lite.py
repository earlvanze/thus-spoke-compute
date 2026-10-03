"""Model-free word timing + audio analysis (no Demucs / whisper / MMS_FA weights needed).

Used when the neural pipeline can't run (no network for model weights). Inputs:
  ../lyrics.txt                                  canonical sheet with [section] headers
  ../source/captions/<id>.en.srt                 YouTube rolling auto-captions (cue start ~ first word of the cue)
  MASTER (env)                                   the audio master
Method:
  1. Caption words are matched to the sheet's words (difflib on normalized tokens); each sheet word inherits a time
     window from its caption cue [cue start, next cue start]; unmatched words interpolate between matched neighbours.
  2. Inside each window words are spread by syllable weight, then each onset snaps to the strongest vocal-band onset
     (harmonic part of HPSS, 250-3500 Hz spectral flux) within +-120 ms, keeping order and >= 70 ms spacing.
  3. Beats/downbeats/envelopes/onsets are computed from the mix with HPSS standing in for the stems
     (percussive = drums, harmonic mid band = vocal, low band = bass, harmonic rest = other).
Writes ../data/lyrics.raw.json, ../data/lyrics.json (via tidy rules) and ../data/audio.json in the engine schema.
For frame-accurate timing, run the full pipeline (swap-audio.sh) on a machine with the models; this is a good-enough
approximation (typically within ~0.1-0.2 s of the sung onset).
"""
import difflib, json, os, re, subprocess, sys
import numpy as np, librosa, scipy.signal as ss

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
MASTER = os.environ.get('MASTER', os.path.join(ROOT, 'source/audio/Cq8qO-NjYIg.m4a'))
SRT = os.environ.get('SRT', os.path.join(ROOT, 'source/captions/Cq8qO-NjYIg.en.srt'))
LYR = os.environ.get('LYRICS', os.path.join(ROOT, 'lyrics.txt'))
SECTIONS_OUT = os.environ.get('SECTION_NAMES')  # unused; sections come from lyrics.txt
os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)

# ------------------------------------------------------------------ inputs
norm = lambda w: re.sub(r"[^a-z0-9]", '', w.lower().replace('’', "'"))
NUM = {'40': 'forty', '10': 'ten', '2022': 'twenty twenty two', '1980': 'nineteen eighty', '10,000': 'ten thousand', '4': 'four'}

def srt_cues(path):
    out = []
    for b in open(path).read().strip().split('\n\n'):
        L = b.strip().split('\n')
        if len(L) < 3: continue
        a, _ = L[1].split(' --> ')
        h, m, s = a.replace(',', '.').split(':'); t = int(h) * 3600 + int(m) * 60 + float(s)
        txt = ' '.join(L[2:])
        txt = re.sub(r'\[[^\]]*\]|>>', ' ', txt)
        ws = []
        for w in txt.split():
            w2 = NUM.get(w.strip('.,?!"'), w)
            ws += [norm(x) for x in w2.split() if norm(x)]
        out.append((t, ws))
    return out

lines = []; sec = ''
for raw in open(LYR):
    s = raw.strip()
    if not s or s.startswith('#'): continue
    m = re.match(r'^\[(.+)\]$', s)
    if m: sec = m.group(1); continue
    lines.append({'text': s, 'section': sec, 'words': [{'w': w} for w in s.split()]})
sheet = [(li, wi, norm(w['w']).replace("'", '')) for li, L in enumerate(lines) for wi, w in enumerate(L['words'])]
# split hyphenated words for matching (navier-stokes) but keep one display token
sheet_tok = [re.sub(r'[^a-z0-9]', '', x[2]) for x in sheet]

cues = srt_cues(SRT)
cap = [(ci, w) for ci, (t, ws) in enumerate(cues) for w in ws]
cap_tok = [w for _, w in cap]

# ------------------------------------------------------------------ audio
wav = os.path.join(HERE, 'work', 'master.wav'); os.makedirs(os.path.dirname(wav), exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', MASTER, '-ac', '1', '-ar', '22050', '-c:a', 'pcm_s16le', wav], check=True)
y, sr = librosa.load(wav, sr=22050, mono=True)
dur = len(y) / sr
FPS = 100; hop = int(round(sr / FPS))
S = librosa.stft(y, n_fft=2048, hop_length=hop)
H_, P_ = librosa.decompose.hpss(np.abs(S), margin=(1.0, 2.0))
freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
vb = (freqs > 250) & (freqs < 3500)
vflux = np.maximum(0, np.diff(np.log1p(H_[vb] * 50), axis=1, prepend=0)).sum(0)
vflux = np.convolve(vflux, np.hanning(5) / np.hanning(5).sum(), 'same')
vflux /= np.percentile(vflux, 99) + 1e-9
venergy = np.log1p(H_[vb] * 50).sum(0); venergy = (venergy - np.percentile(venergy, 5)) / (np.percentile(venergy, 99) - np.percentile(venergy, 5) + 1e-9)

# ------------------------------------------------------------------ 1. caption windows per sheet word
sm = difflib.SequenceMatcher(a=sheet_tok, b=cap_tok, autojunk=False)
cue_of = [None] * len(sheet)
for a, b, n in sm.get_matching_blocks():
    for k in range(n): cue_of[a + k] = cap[b + k][0]
# unmatched: within a replaced block map proportionally
for tag, a0, a1, b0, b1 in sm.get_opcodes():
    if tag == 'replace' and b1 > b0:
        for k in range(a0, a1): cue_of[k] = cap[min(b1 - 1, b0 + int((k - a0) * (b1 - b0) / max(1, a1 - a0)))][0]
known = [i for i, c in enumerate(cue_of) if c is not None]
for i in range(len(sheet)):
    if cue_of[i] is None:
        prv = max([k for k in known if k < i], default=None); nxt = min([k for k in known if k > i], default=None)
        cue_of[i] = cue_of[prv] if prv is not None else cue_of[nxt]
cue_t = [c[0] for c in cues] + [dur]

VOW = re.compile(r'[aeiouy]+')
def syl(w):
    w = norm(w)
    if w.isdigit(): return 2
    n = len(VOW.findall(w))
    if w.endswith('e') and n > 1 and not w.endswith('le'): n -= 1
    return max(1, n)

# group sheet words by cue, spread inside [cue start, next cue start] (clipped to the voiced span)
times = [None] * len(sheet)
by_cue = {}
for i, c in enumerate(cue_of): by_cue.setdefault(c, []).append(i)
for c, idx in sorted(by_cue.items()):
    t0 = cue_t[c]; t1 = cue_t[c + 1] if c + 1 < len(cues) else min(dur, t0 + 4)
    t1 = min(t1, t0 + 0.42 * sum(syl(sheet[i][2] or 'a') for i in idx) + 0.5)  # don't stretch over an instrumental gap
    wts = np.array([syl(lines[sheet[i][0]]['words'][sheet[i][1]]['w']) for i in idx], float)
    edges = t0 + (t1 - t0) * np.concatenate([[0], np.cumsum(wts)]) / wts.sum()
    for k, i in enumerate(idx): times[i] = [edges[k], edges[k + 1]]

# ------------------------------------------------------------------ 2. snap onsets to vocal-band flux peaks
pk = ss.find_peaks(vflux, height=0.08, distance=6)[0]
pkt = pk / FPS; pkv = vflux[pk]
prev = -1.0
for i in range(len(sheet)):
    s0 = times[i][0]
    m = (pkt > s0 - 0.12) & (pkt < s0 + 0.12) & (pkt > prev + 0.07)
    if m.any():
        cand = pkt[m]; sc = pkv[m] - 1.5 * np.abs(cand - s0)
        s0 = float(cand[np.argmax(sc)])
    s0 = max(s0, prev + 0.07)
    times[i][0] = s0; prev = s0
for i in range(len(sheet)):
    nxt = times[i + 1][0] if i + 1 < len(sheet) else dur
    times[i][1] = max(times[i][0] + 0.08, min(times[i][1], nxt))

out_lines = []
for li, L in enumerate(lines):
    ws = []
    for k, (a, b, _) in enumerate(sheet):
        if a != li: continue
        st, en = times[k]
        ws.append({'w': L['words'][b]['w'], 'start': round(st, 3), 'end': round(en, 3), 'conf': 0.5 if sm else 0.3})
    out_lines.append({'text': L['text'], 'section': L['section'], 'start': ws[0]['start'], 'end': ws[-1]['end'], 'words': ws})
matched = sum(1 for a, b, n in sm.get_matching_blocks() for _ in range(n))
J = {'lines': out_lines, 'notes': f'timing_lite: caption-cue windows ({matched}/{len(sheet)} sheet words matched to {os.path.basename(SRT)}) + vocal-band onset snapping on {MASTER}. Approximate; re-time with swap-audio.sh for MMS_FA accuracy.'}
json.dump(J, open(os.path.join(ROOT, 'data/lyrics.raw.json'), 'w'))
print(f'lyrics: {len(out_lines)} lines, {len(sheet)} words, {matched} matched to captions')

# tidy (same rules as tidy.py)
for L in out_lines:
    ws = L['words']
    for i, w in enumerate(ws):
        if i + 1 < len(ws) and ws[i + 1]['start'] - w['end'] < 0.6: w['end'] = max(w['end'], ws[i + 1]['start'])
        w['end'] = round(max(w['end'], w['start'] + 0.08), 3)
    L['start'], L['end'] = ws[0]['start'], ws[-1]['end']
for a, b in zip(out_lines, out_lines[1:]):
    if a['end'] > b['start'] - 0.01: a['end'] = a['words'][-1]['end'] = round(max(a['words'][-1]['start'] + 0.06, b['start'] - 0.01), 3)
json.dump(J, open(os.path.join(ROOT, 'data/lyrics.json'), 'w'), indent=1)

# ------------------------------------------------------------------ 3. audio.json
def env(x, lo=None, hi=None):
    m = np.ones_like(freqs, bool)
    if lo: m &= freqs >= lo
    if hi: m &= freqs < hi
    r = np.sqrt((x[m] ** 2).mean(0))
    out = np.zeros_like(r); a, rl = np.exp(-1 / (0.010 * FPS)), np.exp(-1 / (0.090 * FPS)); v = 0
    for i, s in enumerate(r):
        v = a * v + (1 - a) * s if s > v else rl * v + (1 - rl) * s; out[i] = v
    return np.clip(out / (np.percentile(out, 99) + 1e-9), 0, 1)
A_ = np.abs(S)
feat = {'rms': env(A_), 'low': env(A_, None, 150), 'mid': env(A_, 150, 2000), 'high': env(A_, 4000, None),
        'vocal': env(H_, 250, 3500), 'drums': env(P_), 'bass': env(H_, None, 200), 'other': env(H_, 3500, None)}
oenv = librosa.onset.onset_strength(S=librosa.amplitude_to_db(P_ + 1e-6), sr=sr, hop_length=hop)
tempo, beats = librosa.beat.beat_track(onset_envelope=oenv, sr=sr, hop_length=hop, units='time', tightness=200)
grid = np.array(beats); period = float(np.median(np.diff(grid)))
head = np.arange(grid[0] - period, -1e-6, -period)[::-1]; tail = np.arange(grid[-1] + period, dur, period)
grid = np.concatenate([head, grid, tail])

def onsets(x, lo, hi, delta):
    m = np.ones_like(freqs, bool)
    if lo: m &= freqs >= lo
    if hi: m &= freqs < hi
    e = np.maximum(0, np.diff(np.log1p(x[m] * 50), axis=1, prepend=0)).sum(0)
    e /= np.percentile(e, 99) + 1e-9
    p = librosa.util.peak_pick(e, pre_max=3, post_max=3, pre_avg=10, post_avg=10, delta=delta, wait=6)
    s = e[p] / (np.percentile(e[p], 95) + 1e-9) if len(p) else []
    return [[round(q / FPS, 3), round(float(min(1, v)), 3)] for q, v in zip(p, s)]
kick = onsets(P_, None, 120, 0.25); snare = onsets(P_, 1500, 5000, 0.25); hat = onsets(P_, 7000, None, 0.2)
voc = onsets(H_, 250, 3500, 0.2)
starts = np.array([l['start'] for l in out_lines]); best = None
kk = np.array([k[0] for k in kick])
for ph in range(4):
    db = grid[ph::4]
    d = np.min(np.abs(starts[:, None] - db[None, :]), 1)
    kd = np.min(np.abs(db[:, None] - kk[None, :]), 1) if len(kk) else np.ones(len(db))
    score = np.mean(d < 0.15) + 0.5 * np.mean(kd < 0.06)
    if best is None or score > best[0]: best = (score, ph)
downbeats = grid[best[1]::4]
secs = []
for L in out_lines:
    if not secs or secs[-1]['name'] != L['section']:
        st = L['start'] if not secs else float(downbeats[np.argmin(np.abs(downbeats - (L['start'] - 0.3)))])
        secs.append({'name': L['section'], 'start': round(min(st, L['start']), 3)})
secs[0]['start'] = 0.0
for a, b in zip(secs, secs[1:] + [{'start': dur}]): a['end'] = round(b['start'], 3)
au = {'duration': round(dur, 3), 'bpm': round(60 / period, 3), 'beat_period': round(period, 5), 'time_signature': 4,
      'beats': [round(float(b), 3) for b in grid], 'downbeats': [round(float(b), 3) for b in downbeats], 'sections': secs, 'fps': FPS,
      'features': {k: [round(float(v), 3) for v in a] for k, a in feat.items()},
      'onsets': {'kick': kick, 'snare': snare, 'hat': hat, 'vocal': voc},
      'notes': 'timing_lite: librosa beat tracking on the HPSS percussive part; HPSS stands in for Demucs stems.'}
json.dump(au, open(os.path.join(ROOT, 'data/audio.json'), 'w'))
print(f'audio: {dur:.2f}s bpm {60 / period:.2f} beats {len(grid)} downbeat phase {best[1]} sections {[s["name"] for s in secs]}')
