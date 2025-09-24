import React, { useMemo, useRef, useState } from "react";
import type { Berry } from "../types/berry";
import styles from "./FirmnessSlider.module.css";
import {
  clamp,
  indexToGlowCenter,
  indexToThumbTranslate,
  lerpHueDeg,
} from "../../../utils/sliderGeometry";
import {
  darkRedHue,
  greenHue,
  redHue,
  ROW_GAP,
  ROW_H,
  THUMB,
  yellowHue,
} from "../../../utils/constants";
import { useGesture } from "@use-gesture/react";

type SliderVars = React.CSSProperties & {
  "--rows": string;
  "--row-h": string;
  "--row-gap": string;
  "--y-px": string;
  "--hue": string;
};
export type FirmnessValue = Berry["firmness"];

export type FirmnessOption = { value: FirmnessValue; label: string; count: number };

type Props = {
  options: FirmnessOption[];
  selected: FirmnessValue;
  onChange: (next: FirmnessValue) => void;
  title?: string;
  subtitle?: string;
};

const HUE_BY_FIRMNESS: Record<FirmnessValue, number> = {
  "very-soft": greenHue,
  soft: greenHue,
  hard: yellowHue,
  "very-hard": redHue,
  "super-hard": darkRedHue,
};

export default function FirmnessSlider({
  options,
  selected,
  onChange,
  title = "Pok`e Berries",
  subtitle = "How tough are you?",
}: Props) {
  const trackWrapRef = useRef<HTMLDivElement | null>(null); // the whole track area - through that we can get the bounding rect
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState<number | null>(null); // countinuous Y position of the drag on the track, or null if not dragging

  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === selected),
  ); // index of the selected row

  // where to put the thumb and what hue to use
  const lockedThumbY = useMemo(() => indexToThumbTranslate(activeIndex), [activeIndex]);
  const glowCenterY = useMemo(() => indexToGlowCenter(activeIndex), [activeIndex]);
  const lockedHue = HUE_BY_FIRMNESS[options[activeIndex]?.value ?? "soft"] ?? 118;

  // track geometry
  const step = ROW_H + ROW_GAP; // distance between row tops
  const full = options.length * ROW_H + (options.length - 1) * ROW_GAP; // full height of the track

  const knobTranslate =
    isDragging && dragY != null ? clamp(dragY - THUMB / 2, 0, full - THUMB) : lockedThumbY; // where to put the knob, using clamp to keep it on track
  const glowY = isDragging && dragY != null ? clamp(dragY, 0, full) : glowCenterY; // where to put the glow center

  // Here i calculate continuous hue when dragging, or discrete hue when not dragging
  const hue = useMemo(() => {
    if (!isDragging && dragY == null) return lockedHue;
    const idxFloat = clamp(glowY / step, 0, options.length - 1);
    const i0 = Math.floor(idxFloat);
    const i1 = Math.min(options.length - 1, i0 + 1);
    const t = idxFloat - i0;

    // interpolate hue between the two nearest rows
    const h0 = HUE_BY_FIRMNESS[options[i0]?.value ?? "soft"] ?? 118;
    const h1 = HUE_BY_FIRMNESS[options[i1]?.value ?? "soft"] ?? 118;
    return lerpHueDeg(h0, h1, t);
  }, [isDragging, dragY, glowY, step, options, lockedHue]);

  // handle drag gesture on the track
  useGesture(
    {
      onDrag: ({ active, xy: [, y] }) => {
        const wrap = trackWrapRef.current;
        if (!wrap) return;

        setIsDragging(active);

        const rect = wrap.getBoundingClientRect();
        const relY = y - rect.top;
        const clamped = clamp(relY, 0, full);
        setDragY(clamped);

        const idx = Math.round(clamped / step);
        const nextIdx = clamp(idx, 0, options.length - 1);
        if (nextIdx !== activeIndex) onChange(options[nextIdx].value);

        if (!active) setDragY(null);
      },
    },
    {
      target: trackWrapRef,
      drag: {
        axis: "y",
        filterTaps: true,
        pointer: { touch: true },
      },
    },
  );

  type ThumbVars = React.CSSProperties & { "--thumb-translate": string };
  const thumbStyle: ThumbVars = { "--thumb-translate": `${knobTranslate}px` };

  const handleRowClick = (idx: number) => {
    if (idx !== activeIndex) onChange(options[idx].value);
  };

  const cssVars: SliderVars = {
    "--rows": String(options.length),
    "--row-h": `${ROW_H}px`,
    "--row-gap": `${ROW_GAP}px`,
    "--y-px": `${glowCenterY}px`,
    "--hue": String(hue),
  };

  return (
    <aside className={styles.container} style={cssVars}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.sub}>{subtitle}</div>
      </div>

      <div ref={trackWrapRef} className={styles.trackWrap}>
        <div className={styles.track}>
          <div className={styles.glow} aria-hidden />
          <div
            className={`${styles.thumb} ${isDragging ? styles.thumbDragging : ""}`}
            style={thumbStyle}
            aria-hidden
          />
        </div>
      </div>

      <div className={styles.list}>
        {options.map((opt, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={opt.value}
              className={styles.row}
              onClick={() => handleRowClick(idx)}
              type="button"
            >
              <span className={`${styles.label} ${isActive ? styles.labelActive : ""}`}>
                {opt.label}
              </span>
              <span className={styles.count}>{opt.count}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
