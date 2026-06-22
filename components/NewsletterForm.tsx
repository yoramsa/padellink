"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") || ""),
          nom: String(data.get("nom") || "")
        })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "error");
      setStatus("success");
      setMessage("Merci ! Votre inscription est confirmée.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Réessayez plus tard.");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "flex flex-col gap-3 sm:flex-row" : "mx-auto flex max-w-xl flex-col gap-3 sm:flex-row"}
    >
      {!compact && (
        <input
          name="nom"
          placeholder="Prénom"
          className="input-field w-full rounded-full px-5 py-3 text-sm sm:w-40"
        />
      )}
      <input
        name="email"
        type="email"
        required
        placeholder="Votre adresse email"
        className="input-field w-full flex-1 rounded-full px-5 py-3 text-sm"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-gold rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {status === "sending" ? "..." : "Je m'inscris"}
      </button>
      {status === "success" && (
        <p className="w-full text-sm font-medium text-azur sm:order-last">{message}</p>
      )}
      {status === "error" && (
        <p className="w-full text-sm font-medium text-mauve sm:order-last">{message}</p>
      )}
    </form>
  );
}
