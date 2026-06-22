"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || "")
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "send failed");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError("שליחת ההודעה נכשלה. אפשר לפנות אלינו ב-WhatsApp.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="שם מלא"
          className="input-field rounded-xl px-4 py-3 text-sm"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="אימייל"
          className="input-field rounded-xl px-4 py-3 text-sm"
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="ספרו לנו על הפרויקט שלכם"
        className="input-field rounded-xl px-4 py-3 text-sm"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {status === "sending" ? "שולח..." : "שליחת הודעה"}
      </button>

      {status === "success" && (
        <p className="text-sm font-medium text-brand-light">
          תודה! נחזור אליכם עם הצעת מחיר תוך 24 שעות ✅
        </p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-rose-300">{error}</p>
      )}
    </form>
  );
}
