import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Berry } from "../types/berry";
import styles from "./FirmnessSlider.module.css";
import {
  indexToGlowCenter,
  indexToThumbTranslate,
  pickIndexFromPointer,
} from "../../../utils/math";
import { darkRedHue, greenHue, redHue, ROW_GAP, ROW_H, yellowHue} from "../../../utils/constants";


type SliderVars = React.CSSProperties & {
  '--rows': string;
  '--row-h': string;
  '--row-gap': string;
  '--y-px': string;
  '--hue': string;
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
  const trackWrapRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const activeIndex = Math.max(0, options.findIndex((o) => o.value === selected));

  const translateY = useMemo(() => indexToThumbTranslate(activeIndex), [activeIndex]);
  const glowCenterY = useMemo(() => indexToGlowCenter(activeIndex), [activeIndex]);

  const hue = HUE_BY_FIRMNESS[options[activeIndex]?.value ?? "soft"] ?? 118;

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: PointerEvent) => {
      const idx = pickIndexFromPointer(e, trackWrapRef.current, options.length);
      if (idx != null && idx !== activeIndex) onChange(options[idx].value);
    };
    const stop = () => setIsDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop, { once: true });
    window.addEventListener("pointercancel", stop, { once: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [isDragging, options, activeIndex, onChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);

    const idx = pickIndexFromPointer(e.nativeEvent, trackWrapRef.current, options.length);
    if (idx != null && idx !== activeIndex) onChange(options[idx].value);
  };

  const handleRowClick = (idx: number) => {
    if (idx !== activeIndex) onChange(options[idx].value);
  };

const cssVars: SliderVars = {
  '--rows': String(options.length),
  '--row-h': `${ROW_H}px`,
  '--row-gap': `${ROW_GAP}px`,
  '--y-px': `${glowCenterY}px`,
  '--hue': String(hue),
};


  return (
    <aside className={styles.container} style={cssVars}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.sub}>{subtitle}</div>
      </div>

      <div ref={trackWrapRef} className={styles.trackWrap} onPointerDown={handlePointerDown}>
        <div className={styles.track}>
          <div className={styles.glow} aria-hidden />
          <div
            className={styles.thumb}
            style={{ ["--thumb-translate" as string ]: `${translateY}px` }}
            aria-hidden
          />
        </div>
      </div>

      <div className={styles.list}>
        {options.map((opt, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button key={opt.value} className={styles.row} onClick={() => handleRowClick(idx)} type="button">
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
