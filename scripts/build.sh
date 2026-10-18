#!/usr/bin/env bash
# No bundler: the site is plain HTML/CSS/JS. "Build" just copies the files that ship into dist/.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist
mkdir -p dist
cp -r index.html style.css tokens.css sketch.js vendor site.json thumbnail.svg preview.webm preview.mp4 dist/
touch dist/.nojekyll
