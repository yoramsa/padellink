export default function Footer() {
  return (
    <footer className="border-t border-brand-light/12 px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-start">
        <a href="#top" className="text-lg font-extrabold text-ink-white">
          Mazaly<span className="text-brand-light">.Digital</span>
        </a>
        <p className="text-sm text-ink-gray">
          © 2026 Mazaly Digital · תל אביב, ישראל 🇮🇱
        </p>
      </div>
    </footer>
  );
}
