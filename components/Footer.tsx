import Link from "next/link";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="mosaic-band">
        <div className="mx-auto max-w-content px-5 py-14 text-center">
          <h2 className="font-title text-2xl font-bold text-creme sm:text-3xl">
            Restez connectés à la communauté
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-creme/75">
            Recevez chaque semaine l'essentiel de l'actualité francophone en
            Israël, directement dans votre boîte mail.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="bg-creme">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row">
          <Logo />
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/news" className="link-nav text-sm">
              News
            </Link>
            <Link href="/blog" className="link-nav text-sm">
              Blog
            </Link>
            <Link href="/bonnes-adresses" className="link-nav text-sm">
              Bonnes adresses
            </Link>
            <Link href="/a-propos" className="link-nav text-sm">
              À propos
            </Link>
          </nav>
          <p className="text-xs text-marine/60">
            © {new Date().getFullYear()} Mazaly · Israël 🇮🇱
          </p>
        </div>
      </div>
    </footer>
  );
}
