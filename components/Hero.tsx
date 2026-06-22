import StarfieldCanvas from "./StarfieldCanvas";
import FloatingNotifications from "./FloatingNotifications";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-24"
    >
      <StarfieldCanvas />
      <FloatingNotifications />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="badge mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-brand-soft">
          🇮🇱 סוכנות דיגיטל ישראלית 🇮🇱
        </span>

        <p className="mb-4 text-base font-medium text-ink-gray">
          כמה זמן לוקח לבנות אתר מקצועי?
        </p>

        <h1 className="text-5xl font-black leading-[1.05] sm:text-6xl md:text-7xl">
          <span className="text-gradient block">לא חודשים.</span>
          <span className="text-glow block">שבועיים.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-ink-gray sm:text-lg">
          ב-Mazaly Digital אנחנו בונים אתרים ופלטפורמות מהירים, מרשימים ומדויקים —
          מתל אביב, בעברית, צרפתית ואנגלית.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#contact"
            className="btn-primary w-full rounded-full px-7 py-3 text-base font-semibold sm:w-auto"
          >
            🚀 בואו נבנה משהו
          </a>
          <a
            href="#services"
            className="btn-outline w-full rounded-full px-7 py-3 text-base font-semibold sm:w-auto"
          >
            הצג חבילות
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-night-900 to-transparent" />
    </section>
  );
}
