"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/bonnes-adresses", label: "Bonnes adresses" },
  { href: "/a-propos", label: "À propos" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-or/30 bg-creme/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3.5">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-nav text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/news"
            className="btn-gold rounded-full px-5 py-2 text-sm font-semibold"
          >
            Lire le journal
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-marine/20 text-marine md:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-or/30 bg-creme md:hidden">
          <nav className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="link-nav rounded-lg px-3 py-3 text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
