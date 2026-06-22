"use client";

import { useEffect, useRef, useState } from "react";
import { counters } from "@/lib/site";

function Counter({
  value,
  suffix,
  start
}: {
  value: number;
  suffix: string;
  start: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value]);

  return (
    <span className="text-5xl font-black text-gradient sm:text-6xl">
      {display}
      {suffix}
    </span>
  );
}

export default function Counters() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStart(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-5 py-16">
      <div
        ref={ref}
        className="glass mx-auto grid max-w-5xl grid-cols-2 gap-8 rounded-3xl px-6 py-10 md:grid-cols-4"
      >
        {counters.map((item) => (
          <div key={item.label} className="text-center">
            <div className="flex items-end justify-center gap-1">
              <Counter value={item.value} suffix={item.suffix} start={start} />
              {item.unit && (
                <span className="mb-2 text-lg font-bold text-brand-light">
                  {item.unit}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-ink-gray">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
