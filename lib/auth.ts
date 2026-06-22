import { redirect } from "next/navigation";
import { createClient, isConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getProfile(): Promise<Profile | null> {
  if (!isConfigured()) return null;
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (data) return data as Profile;

  return {
    id: user.id,
    nom: user.email || null,
    avatar_url: null,
    role: "lecteur",
    created_at: new Date().toISOString()
  };
}

export function isStaff(profile: Profile | null): boolean {
  return profile?.role === "admin" || profile?.role === "redacteur";
}

export async function requireStaff(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile || !isStaff(profile)) {
    redirect("/login?redirect=/admin");
  }
  return profile as Profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/admin");
  }
  return profile as Profile;
}
