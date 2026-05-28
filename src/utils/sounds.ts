let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function playTossSound() {
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
  o.type = 'sine';
  o.frequency.setValueAtTime(800, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(2000, c.currentTime + 0.1);
  o.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.2);
  g.gain.setValueAtTime(0.15, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
  o.start(c.currentTime);
  o.stop(c.currentTime + 0.3);
}

export function playLandSound() {
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
  o.type = 'triangle';
  o.frequency.setValueAtTime(600, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15);
  g.gain.setValueAtTime(0.12, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
  o.start(c.currentTime);
  o.stop(c.currentTime + 0.2);
}
