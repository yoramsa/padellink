import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-title text-7xl font-extrabold text-or">404</p>
      <h1 className="mt-4 font-title text-3xl font-bold text-marine">
        Page introuvable
      </h1>
      <p className="mt-3 max-w-md text-marine/60">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="btn-primary mt-7 rounded-full px-6 py-3 text-sm font-semibold"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
