// Boids: each bird follows cohesion, alignment and separation relative to nearby birds.
const W = 960, H = 540;
const VIEW = 70, CROWD = 26, MAX_SPEED = 3.2, MAX_FORCE = 0.06;
let birds = [], paused = false, scare = null;
const ui = (id) => document.getElementById(id);

function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

class Bird {
  constructor() {
    this.pos = createVector(random(W), random(H));
    this.vel = p5.Vector.random2D().mult(random(1.5, MAX_SPEED));
  }
  steer(target) { return target.setMag(MAX_SPEED).sub(this.vel).limit(MAX_FORCE); }
  step(flock, k) {
    const coh = createVector(), ali = createVector(), sep = createVector();
    let n = 0;
    for (const o of flock) {
      if (o === this) continue;
      const d = p5.Vector.dist(this.pos, o.pos);
      if (d > VIEW) continue;
      n++;
      coh.add(o.pos);
      ali.add(o.vel);
      if (d < CROWD) sep.add(p5.Vector.sub(this.pos, o.pos).div(max(d * d, 1)));
    }
    const acc = createVector();
    if (n) {
      acc.add(this.steer(coh.div(n).sub(this.pos)).mult(k.coh));
      acc.add(this.steer(ali.div(n)).mult(k.ali));
      if (sep.magSq()) acc.add(this.steer(sep).mult(k.sep));
    }
    if (scare) {
      const away = p5.Vector.sub(this.pos, scare.pos);
      const d = away.mag();
      if (d < 140) acc.add(away.setMag((1 - d / 140) * 0.5));
    }
    this.vel.add(acc).limit(MAX_SPEED);
    if (this.vel.mag() < 1.2) this.vel.setMag(1.2);
    this.pos.add(this.vel);
    this.pos.x = (this.pos.x + W) % W;
    this.pos.y = (this.pos.y + H) % H;
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(8, 0, -6, -3.5, -6, 3.5);
    pop();
  }
}

function resize(n) {
  while (birds.length < n) birds.push(new Bird());
  birds.length = n;
}

function setup() {
  const c = createCanvas(W, H);
  c.parent('stage');
  noStroke();
  c.elt.setAttribute('role', 'img');
  c.elt.setAttribute('aria-label', 'Animated flock of birds');
  const out = ui('count-out'), count = ui('count');
  const sync = () => { out.textContent = '(' + count.value + ')'; resize(+count.value); };
  count.addEventListener('input', sync);
  sync();
  ui('pause').addEventListener('click', (e) => {
    paused = !paused;
    e.target.textContent = paused ? 'Resume' : 'Pause';
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) ui('pause').click();
}

function draw() {
  const g = drawingContext.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, css('--dw-sky-a'));
  g.addColorStop(1, css('--dw-sky-b'));
  drawingContext.fillStyle = g;
  rect(0, 0, W, H);
  const k = { coh: +ui('cohesion').value, ali: +ui('alignment').value, sep: +ui('separation').value };
  fill(css('--dw-bird'));
  for (const b of birds) { if (!paused) b.step(birds, k); b.draw(); }
  if (scare && --scare.ttl <= 0) scare = null;
}

function mousePressed() {
  if (mouseX < 0 || mouseX > W || mouseY < 0 || mouseY > H) return;
  scare = { pos: createVector(mouseX, mouseY), ttl: 25 };
}
