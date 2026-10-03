# Lyric sheet review

`lyrics.txt` was drafted from YouTube's automatic captions (`source/captions/`) and corrected from context. The renders
show exactly what `lyrics.txt` says, so please **listen and confirm these lines**. After editing, re-time (see README →
"Re-timing") and re-render.

Corrections made from the captions (high confidence; context makes them clear):
- The hook is set as **"Thus spoke compute"**. The captions heard "the spoke computes" / "the smoke computes".
- Names and terms: Solow (captions: "So low"), Baumol's (captions: "Almost"), Yann, Shenzhen (captions: "scenes"),
  "Capex" (captions: "Kid pics"), "Ed's on the pod" (captions: "And hedge on the pot"), "Llama Four".
- Numbers are spelled out as sung ("forty", "ten", "twenty twenty-two", "nineteen eighty", "ten thousand").

Best guesses (please check by ear):
| lyrics.txt section · line | what the captions had | what the sheet says now |
|---|---|---|
| verse1 · 7 | "the rest away too hard" | "the rest were way too hard" |
| chorus · line 1 | "from the ore to the suit" | kept as "suit" (it may be another word) |
| chorus1 · line 3 | the first half is masked by "[music]" | "You modeled a tractor," was added to match the later choruses; its timing is pinned in `analysis/timing-fixes.json` |
| verse2 · 2 | "the wall get breaking through" | "kept breaking through" |
| verse2 · 5 | "Stop it. Flops it twice a day." | "Stopped clock's right twice a day." |
| verse2 · 11 | "says a house cat" (cut across two caption cues) | joined into one line |
| bridge1 · 4 | "field great minds" | "feed great minds" |
| verse4 · 4 | "going nameless step they can" | "going every step they can" |
| final1 · 7–8 | the constraint line differs from the earlier choruses | kept as captioned ("in the book of rules", "Out of date,") |

Word timing: the timing in `data/lyrics.json` comes from `analysis/timing_lite.py`. It uses the caption cue times plus
vocal-band onset snapping, and is accurate to about ±0.15 s. For tighter sync, re-time with the full pipeline (README).
