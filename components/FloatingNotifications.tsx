"use client";

import { useEffect, useState } from "react";
import { notifications } from "@/lib/site";

type Slot = {
  id: number;
  text: string;
  top: string;
  side: string;
  duration: number;
};

const positions = [
  { top: "18%", side: "6%" },
  { top: "34%", side: "10%" },
  { top: "58%", side: "5%" },
  { top: "24%", side: "70%" },
  { top: "62%", side: "72%" }
];

export default function FloatingNotifications() {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let id = 0;
    let index = 0;

    const spawn = () => {
      const pos = positions[index % positions.length];
      const note = notifications[index % notifications.length];
      index += 1;
      const slot: Slot = {
        id: id++,
        text: note.text,
        top: pos.top,
        side: pos.side,
        duration: 6000
      };
      setSlots((prev) => [...prev.slice(-3), slot]);
      window.setTimeout(() => {
        setSlots((prev) => prev.filter((s) => s.id !== slot.id));
      }, slot.duration);
    };

    spawn();
    const interval = window.setInterval(spawn, 2200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className="notif-card animate-floatUp absolute rounded-2xl px-4 py-3 text-sm font-medium text-ink-white"
          style={{ top: slot.top, insetInlineStart: slot.side }}
        >
          {slot.text}
        </div>
      ))}
    </div>
  );
}
