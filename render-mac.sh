#!/usr/bin/env bash
# Render THUS SPOKE COMPUTE on macOS (Metal GPU via Chrome/ANGLE). Timing and audio analysis are committed in data/,
# so no Python/ML setup is needed — just bun, ffmpeg and Chrome.
#   ./render-mac.sh setup                 # one-time: bun install, master audio, checks
#   ./render-mac.sh sheet                 # contact sheet of every shot cut  -> out/wip/sheet.png
#   ./render-mac.sh review [name]         # fast 960x540 review with audio  -> out/review/<name>-half.mp4
#   ./render-mac.sh final [name.mp4]      # 1080p, motion blur, QA report   -> out/final/<name>.mp4, qa/report.md
#   ./render-mac.sh preview               # live preview in the browser (scrub with the timeline)
# Needs: Homebrew `ffmpeg` (brew install ffmpeg), `bun` (curl -fsSL https://bun.sh/install | bash), Google Chrome.
# Env overrides: PDOOM_CHROME (browser binary), PDOOM_GL_ARGS (Chrome GL flags), FPS (default 30), MAXS (max motion-blur
# sub-frames per frame, default 12; lower = faster).
set -euo pipefail
P=$(cd "$(dirname "$0")" && pwd); cd "$P"
CMD=${1:-review}

# --- browser + GPU flags (Metal through ANGLE; the Linux defaults in render.ts are gl-egl/headless-ozone)
if [ -z "${PDOOM_CHROME:-}" ]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "/Applications/Chromium.app/Contents/MacOS/Chromium" \
           "$HOME/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" /usr/bin/chromium; do
    [ -x "$c" ] && { export PDOOM_CHROME="$c"; break; }
  done
fi
[ -n "${PDOOM_CHROME:-}" ] || { echo "Chrome not found: install Google Chrome or set PDOOM_CHROME"; exit 1; }
if [ "$(uname)" = Darwin ]; then export PDOOM_GL_ARGS="${PDOOM_GL_ARGS:---use-angle=metal --enable-gpu-rasterization --ignore-gpu-blocklist}"; fi
export PDOOM_BOOT_TIMEOUT_MS=${PDOOM_BOOT_TIMEOUT_MS:-240000}

# --- GNU tool shims (timeout, sha256sum) so the shared Linux scripts run unchanged
SHIM="$P/.shims"; mkdir -p "$SHIM"
command -v timeout >/dev/null || { if command -v gtimeout >/dev/null; then ln -sf "$(command -v gtimeout)" "$SHIM/timeout"; else printf '#!/usr/bin/env bash\nshift; exec "$@"\n' > "$SHIM/timeout"; chmod +x "$SHIM/timeout"; fi; }
command -v sha256sum >/dev/null || { printf '#!/usr/bin/env bash\nexec shasum -a 256 "$@"\n' > "$SHIM/sha256sum"; chmod +x "$SHIM/sha256sum"; }
export PATH="$SHIM:$PATH"

# --- the locked master (the authorized source audio) and the render's audio copy
M="$P/source/audio/Cq8qO-NjYIg.m4a"
mkdir -p analysis/work audio out/wip out/review out/final qa
echo "$M" > analysis/work/MASTER
[ -s audio/master.m4a ] || ffmpeg -v error -y -i "$M" -c:a aac -b:a 256k audio/master.m4a
[ -s data/lyrics.json ] && [ -s data/audio.json ] || { echo "data/lyrics.json or data/audio.json missing (they are committed; git pull?)"; exit 1; }
[ -d app/node_modules ] || (cd app && bun install)

case "$CMD" in
  setup) echo "ready: chrome=$PDOOM_CHROME gl=$PDOOM_GL_ARGS"; (cd app && bunx tsc --noEmit -p tsconfig.json && echo "typecheck ok") ;;
  sheet) (cd app && bun scripts/render.ts sheet --cuts --cols 6 --out ../out/wip/sheet.png) && echo out/wip/sheet.png ;;
  review) ./review.sh "${2:-review}" ;;
  final) ./render-full.sh "${2:-thus-spoke-compute.mp4}" "${FPS:-30}" 60 "${MAXS:-12}" ;;
  preview) cd app && exec bunx vite --open ;;
  *) echo "usage: $0 setup|sheet|review [name]|final [name.mp4]|preview"; exit 1 ;;
esac
