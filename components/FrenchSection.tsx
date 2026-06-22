import Reveal from "./Reveal";
import { frenchPoints, whatsappLink } from "@/lib/site";

export default function FrenchSection() {
  return (
    <section id="francais" className="px-5 py-20">
      <Reveal>
        <div className="ltr-block glass-strong mx-auto max-w-4xl rounded-3xl p-8 shadow-card sm:p-12">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-light">
            Communauté francophone
          </span>
          <h2 className="mt-3 text-3xl font-black text-ink-white sm:text-4xl">
            Vous êtes francophone en Israël&nbsp;?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-gray">
            Mazaly Digital est une agence web basée à Tel Aviv. Nous accompagnons
            les entrepreneurs et entreprises francophones installés en Israël dans
            la création de sites et de plateformes sur mesure — sans barrière de
            langue, avec une vraie compréhension du marché local.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {frenchPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm text-ink-white"
              >
                <span className="mt-0.5 text-brand-light">◆</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <a
            href={whatsappLink("Bonjour Mazaly Digital, je souhaite discuter de mon projet.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-9 inline-flex rounded-full px-7 py-3 text-base font-semibold"
          >
            Discutons de votre projet →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
