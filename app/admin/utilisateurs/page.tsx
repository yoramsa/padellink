import { adminListProfiles } from "@/lib/admin";
import { getProfile } from "@/lib/auth";
import { formatDate } from "@/lib/slug";
import { updateRole } from "./actions";

export const dynamic = "force-dynamic";

const roles = ["lecteur", "redacteur", "admin"];

export default async function AdminUsersPage() {
  const [profiles, me] = await Promise.all([adminListProfiles(), getProfile()]);
  const isAdmin = me?.role === "admin";

  return (
    <div>
      <h1 className="font-title text-3xl font-bold text-marine">Utilisateurs</h1>
      {!isAdmin && (
        <p className="mt-2 text-sm text-mauve">
          Seul un administrateur peut modifier les rôles.
        </p>
      )}

      <div className="mt-7 overflow-hidden rounded-2xl border border-or/25 bg-white shadow-soft">
        {profiles.length ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-or/20 text-marine/55">
              <tr>
                <th className="px-5 py-3 font-semibold">Nom</th>
                <th className="px-5 py-3 font-semibold">Rôle</th>
                <th className="px-5 py-3 font-semibold">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id} className="border-b border-or/10">
                  <td className="px-5 py-3 font-medium text-marine">
                    {profile.nom || profile.id.slice(0, 8)}
                  </td>
                  <td className="px-5 py-3">
                    {isAdmin ? (
                      <form action={updateRole} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={profile.id} />
                        <select
                          name="role"
                          defaultValue={profile.role}
                          className="input-field rounded-lg px-3 py-1.5 text-sm"
                        >
                          {roles.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="text-sm font-semibold text-azur hover:underline"
                        >
                          Enregistrer
                        </button>
                      </form>
                    ) : (
                      <span className="rounded-full bg-or/15 px-3 py-1 text-xs font-semibold text-or">
                        {profile.role}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-marine/60">
                    {formatDate(profile.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-sm text-marine/55">Aucun utilisateur.</p>
        )}
      </div>
    </div>
  );
}
