import { ROW_GAP, ROW_H, THUMB } from "./constants";

// Where should the thumb translate to align with the selected row
export function indexToThumbTranslate(index: number) {
  return index * (ROW_H + ROW_GAP) + (ROW_H - THUMB) / 2;
}

// Where should the glow center align with the selected row
export function indexToGlowCenter(index: number) {
  return index * (ROW_H + ROW_GAP) + ROW_H / 2;
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