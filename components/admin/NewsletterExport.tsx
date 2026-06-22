"use client";

import type { Newsletter } from "@/lib/types";

export default function NewsletterExport({
  abonnes
}: {
  abonnes: Newsletter[];
}) {
  const onExport = () => {
    const header = "email,nom,actif,date\n";
    const rows = abonnes
      .map((a) => {
        const nom = (a.nom || "").replace(/"/g, '""');
        return `"${a.email}","${nom}",${a.actif},${a.created_at}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mazaly-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={onExport}
      disabled={abonnes.length === 0}
      className="btn-gold rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
    >
      Exporter en CSV
    </button>
  );
}
