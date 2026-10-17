# demo-web-p5

**Starling Sky**: a flocking-birds animation (the classic "boids" model) built with [p5.js](https://p5js.org), with sliders for cohesion, alignment, separation and bird count. Hosted on GitHub Pages at https://sthudir.github.io/demo-web-p5/.

Plain HTML, CSS and JavaScript. There is no bundler and no npm install: p5.js 1.11.3 is vendored in `vendor/` so the page works offline and without a CDN.

## Files
- `index.html`, `style.css`, `tokens.css`: page, layout and shared demo-web design tokens (dark + light via `prefers-color-scheme`).
- `sketch.js`: the animation. `setup()` and `draw()` are the p5 entry points; the `Bird` class holds the three rules.
- `site.json`, `thumbnail.svg`: what the hub reads for its card.
- `scripts/build.sh`: copies the shipping files into `dist/`.

## Run locally
```
python3 -m http.server      # then open http://localhost:8000/
```
or build and serve the output: `bash scripts/build.sh && python3 -m http.server --directory dist`

## Deploy
Push to `main`. `.github/workflows/deploy.yml` runs `scripts/build.sh` and publishes `dist/` to GitHub Pages. If the `HUB_DISPATCH_TOKEN` secret exists, it also tells the hub to refresh.

## Video
Replace the YouTube id in the `<iframe>` in `index.html` (`youtube-nocookie.com/embed/<id>`).

## Base path
All asset URLs are relative (`vendor/p5.min.js`, `style.css`), so the site works under `/demo-web-p5/` with no configuration.

## Credits
p5.js is licensed LGPL-2.1; see `vendor/p5-LICENSE.txt`.
