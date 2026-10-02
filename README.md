# thus-spoke-compute

A kinetic-typography production workspace for **“AI is a normal technology?”**. The authorized intake audio and caption materials are in [`source/`](source/); see [`source/PROVENANCE.md`](source/PROVENANCE.md) for source, format, and alignment status.

> **Caption note:** `source/captions/` contains YouTube automatic captions. Review and force-align a corrected canonical lyric sheet before producing a lyric-synchronized render.

## Renderer template



Code-rendered **kinetic-typography music videos** from any song: give it one audio master and the lyrics, and it times
every sung word, then renders a 1080p video where the words are the image. Each word lands on its sung onset. Every phrase
becomes a typographic object that does what the words say. The camera holds, then snaps on the beat, and the export averages
sub-frames for real motion blur.

It is the [`pdoom-video`](LICENSE-pdoom-engine) renderer (three.js + Canvas2D in headless Chromium, MIT) turned into a reusable
workflow. It adds a word-timing pipeline (stems → transcription → forced alignment → checks), a section-driven director,
a library of compositions, Swiss-grid type setting, graphic "plates", and review/final/QA scripts.

```text
audio.wav + lyrics.txt ──▶ swap-audio.sh ──▶ data/lyrics.json (word times) + data/audio.json (beats, envelopes)
                                              │
              brand.ts · palette.ts · script.ts (SECTIONS) · shots.ts (your compositions)
                                              │
                    contact sheets ──▶ review.sh (fast, half-res) ──▶ render-full.sh ──▶ qa.sh
```

## Requirements
- Linux with **Chromium** (`/usr/bin/chromium`, or set `PDOOM_CHROME`), **ffmpeg**, **bun**, **uv** (Python 3.11+).
- **whisper.cpp** (`whisper-cli`) plus a GGML model (e.g. `ggml-medium.en.bin`) for cueing. Point `WHISPER_MODEL` at it.
- A GPU helps (`PDOOM_GL_ARGS="--use-angle=gl-egl --ozone-platform=headless"`). SwiftShader also works for sheets:
  `PDOOM_GL_ARGS="--use-gl=swiftshader --disable-gpu --ozone-platform=headless"`.

## Quick start
```sh
./new-project.sh ~/videos/my-song/kinetic        # scaffold (installs app + analysis deps)
cd ~/videos/my-song/kinetic
$EDITOR lyrics.txt                                # exactly what is sung, with [section] headers
WHISPER_MODEL=~/models/ggml-medium.en.bin ./swap-audio.sh ~/music/my-song.wav
$EDITOR app/src/project/{brand,palette,script,shots}.ts
(cd app && bun scripts/render.ts sheet --cuts --cols 4 --out ../out/wip/sheet.png)   # look at it
./review.sh v1                                    # → out/review/v1-half.mp4 (no blur, 960×540, fast)
./render-full.sh my-song-v1.mp4                   # final: motion blur, segments, mux, QA report
```
Live preview while editing: `cd app && bunx vite`, then open the page (scrub with the timeline).

## What's in the box
| path | what |
|---|---|
| `app/src/engine/` | the renderer: WebGL compositor, post (grain, bloom, CA), audio-reactive data, offline export |
| `app/src/scenes/director.ts` | builds the edit from the lyric `[section]` tags; instrumental shots; holds that never cover the next line |
| `app/src/scenes/shots.ts` | library compositions (`slam`, `anchor`, `stair`, `ledger`, `blueprint`, `tree`, `title`, `outro`, …) + helpers |
| `app/src/scenes/typeset.ts` | Swiss-grid `row()` (big content words, light small words, ghost-in, annotation), `band()`, `snapVal()` |
| `app/src/scenes/plates2d.ts` | graphic plates behind a shot: guilloché, ledger, blueprint, scope, engrave, ui, halftone, contour, terminal, stamps |
| `app/src/project/` | **per video**: `brand.ts`, `palette.ts`, `script.ts` (the edit), `shots.ts` (bespoke compositions) |
| `analysis/` | timing pipeline (`align.py`, `autocue.py`, `refine.py`, `native.py`, `fix_timing.py`, `analyze.py`, `check.py`) |
| `analysis/tools/` | `transcribe_windows.py`, `verify_fa.py`, `xcorr.py`, `envelope.py`, `spillcheck.py`, `loop_master.py` |
| `swap-audio.sh` | analyse a take (cached by checksum) and make it active |
| `review.sh` / `render-full.sh` / `qa.sh` | review render / final render / delivery checks |

**Read [`WORKFLOW.md`](WORKFLOW.md)** for the full process and the lessons that shaped it.

## License
MIT (see [`LICENSE`](LICENSE)). The rendering engine is MIT by its original author ([`LICENSE-pdoom-engine`](LICENSE-pdoom-engine)).
The bundled fonts (Archivo, IBM Plex Mono, Cormorant, EMS stroke fonts) are under the SIL Open Font License
([`app/public/fonts/OFL.txt`](app/public/fonts/OFL.txt)). No song, lyrics or client material is included.
