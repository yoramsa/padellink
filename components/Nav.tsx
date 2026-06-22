"use client";

import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`nav-shell fixed inset-x-0 top-0 z-50 ${scrolled ? "nav-scrolled" : ""}`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="text-lg font-extrabold tracking-tight text-ink-white">
          Mazaly<span className="text-brand-light">.Digital</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-gray transition-colors hover:text-ink-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn-primary rounded-full px-5 py-2 text-sm font-semibold"
          >
            📞 צור קשר
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-light/30 text-ink-white md:hidden"
          aria-label="תפריט"
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {open && (
        <div className="mobile-menu md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink-gray transition-colors hover:bg-night-700 hover:text-ink-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 rounded-full px-5 py-3 text-center text-base font-semibold"
            >
              📞 צור קשר
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
