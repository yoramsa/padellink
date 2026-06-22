import Reveal from "./Reveal";
import ContactForm from "./ContactForm";
import { site, whatsappLink } from "@/lib/site";

export default function Contact() {
  return (
    <section id="contact" className="px-5 py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-light">
            צור קשר
          </span>
          <h2 className="mt-3 text-3xl font-black text-ink-white sm:text-4xl">
            מוכנים להתחיל?
          </h2>
        </Reveal>

        <Reveal>
          <div className="glass-strong rounded-3xl p-8 shadow-card sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink("שלום Mazaly Digital, אשמח להצעת מחיר.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-1 rounded-full px-6 py-3 text-center text-sm font-bold"
              >
                💬 WhatsApp
              </a>
              <a
                href={`mailto:${site.email}`}
                className="btn-outline flex-1 rounded-full px-6 py-3 text-center text-sm font-semibold"
              >
                ✉️ {site.email}
              </a>
            </div>

            <div className="gold-line my-8 h-px w-full" />

            <ContactForm />

            <p className="mt-6 text-center text-xs text-ink-gray">
              מחיר ראשוני תוך 24 שעות · ללא עמלות נסתרות · תשלום בשלבים
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
