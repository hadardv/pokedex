import { ROW_GAP, ROW_H, THUMB } from "./constants";


// Where should the thumb translate to align with the selected row
export function indexToThumbTranslate(index: number) {
  return index * (ROW_H + ROW_GAP) + (ROW_H - THUMB) / 2;
}

// Where should the glow center align with the selected row
export function indexToGlowCenter(index: number) {
  return index * (ROW_H + ROW_GAP) + ROW_H / 2;
}

// pick the index based on pointer event position
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

// map pointer Y to a clamped distance on the track
export function pointerYOnTrack(e: PointerEvent, wrap: HTMLDivElement | null): number | null {
  if (!wrap) return null;
  const rect = wrap.getBoundingClientRect();
  //const full = ROW_H * 1 + (ROW_GAP * 0)
  const y = e.clientY - rect.top;
  return y;
}

// contiguous lerp between two hues in degrees
export function lerpHueDeg(a: number, b: number, t: number) {
  const d = ((b - a + 540) % 360) - 180;
  const h = a + d * t;
  return (h + 360) % 360;
}

// clamp n to the range so we can keep things on track
export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}