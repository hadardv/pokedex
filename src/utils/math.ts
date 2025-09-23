import { ROW_GAP, ROW_H, THUMB } from "./constants";


// Where should the knob sit so its center aligns with the selected row
export function indexToThumbTranslate(index: number) {
  return index * (ROW_H + ROW_GAP) + (ROW_H - THUMB) / 2;
}

// Where should the glow center align with the selected row
export function indexToGlowCenter(index: number) {
  return index * (ROW_H + ROW_GAP) + ROW_H / 2;
}

// Convert a pointer’s Y on the track to the nearest row index.
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
