import type { LineValue } from '../types';
import { lineLabel } from './divination';

const BAR_W = 120;
const BAR_H = 14;
const GAP = 4;

function drawBar(ctx: CanvasRenderingContext2D, x: number, y: number, val: LineValue) {
  if (val <= 1) {
    ctx.fillStyle = '#666';
    ctx.fillRect(x, y, BAR_W * 0.4, BAR_H);
    ctx.fillRect(x + BAR_W * 0.6, y, BAR_W * 0.4, BAR_H);
  } else {
    ctx.fillStyle = '#b22222';
    ctx.fillRect(x, y, BAR_W, BAR_H);
  }
}

export function generateShareImage(
  lines: readonly LineValue[],
  _guaName: string,
  fullName: string,
  changingLines: readonly number[],
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const w = 400;
  const hexH = lines.length * (BAR_H + GAP);
  const h = hexH + 120;
  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#b22222';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(fullName, w / 2, 36);

  const cl = changingLines.length > 0
    ? changingLines.map((n) => `第${n}爻`).join(' ')
    : '静卦';
  ctx.fillStyle = '#666';
  ctx.font = '14px sans-serif';
  ctx.fillText(`变爻: ${cl}`, w / 2, 58);

  const startY = 75;
  for (let i = 5; i >= 0; i--) {
    const yi = startY + (5 - i) * (BAR_H + GAP);
    const bx = (w - BAR_W) / 2;
    drawBar(ctx, bx, yi, lines[i]);
    ctx.fillStyle = '#999';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(lineLabel(i, lines[i]), bx - 8, yi + 11);
    if (lines[i] === 3) {
      ctx.fillStyle = '#b22222';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('○', bx + BAR_W + 8, yi + 13);
    } else if (lines[i] === 0) {
      ctx.fillStyle = '#b22222';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('×', bx + BAR_W + 8, yi + 13);
    }
  }

  return canvas.toDataURL('image/png');
}
