import { NextResponse } from "next/server";
import { createClient, isConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Le service n'est pas encore configuré." },
      { status: 503 }
    );
  }

  let body: { email?: string; nom?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const nom = (body.nom || "").trim() || null;
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!valid) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("newsletters")
    .upsert({ email, nom, actif: true }, { onConflict: "email" });

  if (error) {
    return NextResponse.json(
      { error: "Inscription impossible pour le moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
