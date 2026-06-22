"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/adresses", label: "Bonnes adresses" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/publicites", label: "Publicités" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" }
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-link rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "admin-link-active" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
