import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import SignOutButton from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const profile = await requireStaff();

  return (
    <div className="min-h-screen bg-creme">
      <div className="flex flex-col lg:flex-row">
        <aside className="mosaic-band lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
          <div className="flex h-full flex-col p-5">
            <Link href="/admin" className="font-title text-2xl font-extrabold text-creme">
              Mazaly
            </Link>
            <p className="mt-1 text-xs text-creme/60">Espace rédaction</p>

            <div className="mt-7 flex-1">
              <AdminNav />
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="px-3 text-xs text-creme/60">{profile.nom}</p>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-or">
                {profile.role}
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <Link
                  href="/"
                  className="admin-link rounded-lg px-3 py-2.5 text-sm font-medium"
                >
                  Voir le site
                </Link>
                <SignOutButton />
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-5 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
