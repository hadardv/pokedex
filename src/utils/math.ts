
export const ROW_H = 70;      
export const ROW_GAP = 16;    
export const THUMB = 40;

export function indexToThumbTranslate(index: number) {
  return index * (ROW_H + ROW_GAP) + (ROW_H - THUMB) / 2;
}

export function indexToGlowCenter(index: number) {
  return index * (ROW_H + ROW_GAP) + ROW_H / 2;
}

export function pickIndexFromPointer(
  e: PointerEvent,
  wrap: HTMLDivElement | null,
  max: number
): number | null {
  if (!wrap) return null;
  const rect = wrap.getBoundingClientRect();
  let y = e.clientY - rect.top;
  const full = max * ROW_H + (max - 1) * ROW_GAP;
  if (y < 0) y = 0;
  if (y > full) y = full;
  const step = ROW_H + ROW_GAP;
  const idx = Math.round(y / step);
  return Math.max(0, Math.min(max - 1, idx));
}
