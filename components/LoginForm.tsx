"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError("Identifiants incorrects.");
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm rounded-3xl border border-or/30 bg-white p-8 shadow-card">
      <div className="flex justify-center">
        <Logo />
      </div>
      <h1 className="mt-6 text-center font-title text-2xl font-bold text-marine">
        Espace rédaction
      </h1>
      <p className="mt-1 text-center text-sm text-marine/55">
        Connexion réservée à l'équipe Mazaly.
      </p>

      <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-field rounded-xl px-4 py-3 text-sm"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="input-field rounded-xl px-4 py-3 text-sm"
        />
        {error && <p className="text-sm font-medium text-mauve">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
