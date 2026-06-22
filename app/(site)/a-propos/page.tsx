import NewsletterForm from "@/components/NewsletterForm";

export const metadata = {
  title: "À propos",
  description:
    "Mazaly, le média communautaire des francophones d'Israël : notre mission et nos valeurs."
};

const valeurs = [
  {
    titre: "Proximité",
    texte:
      "Nous racontons la communauté francophone d'Israël de l'intérieur, avec ses visages, ses histoires et ses lieux."
  },
  {
    titre: "Utilité",
    texte:
      "Des informations concrètes pour mieux vivre au quotidien : alyah, démarches, culture et bonnes adresses."
  },
  {
    titre: "Indépendance",
    texte:
      "Un média gratuit, financé par la publicité, au service des lecteurs avant tout."
  }
];

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="font-title text-sm font-semibold uppercase tracking-widest text-or">
        À propos
      </p>
      <h1 className="mt-3 font-title text-4xl font-extrabold leading-tight text-marine sm:text-5xl">
        Mazaly, le média de la communauté francophone en Israël
      </h1>
      <div className="gold-rule mt-5 h-0.5 w-28" />

      <div className="prose-content mt-8">
        <p>
          Mazaly est né d'une conviction simple : la communauté francophone
          d'Israël mérite un média qui lui ressemble. Chaleureux, vivant et
          profondément attaché à son histoire comme à son présent.
        </p>
        <p>
          De l'alyah aux récits du quotidien, de la culture aux bonnes adresses,
          Mazaly raconte celles et ceux qui font vibrer la communauté, partout
          dans le pays. Mazaly est aussi une marque mère, pensée pour grandir :
          de nouvelles aventures suivront, dont Mazaly Event et Mazaly Digital.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {valeurs.map((v) => (
          <div
            key={v.titre}
            className="rounded-2xl border border-or/25 bg-white p-6 shadow-soft"
          >
            <h2 className="font-title text-lg font-bold text-marine">
              {v.titre}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-marine/70">
              {v.texte}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-or/30 bg-white p-8 text-center shadow-soft">
        <h2 className="font-title text-2xl font-bold text-marine">
          Rejoignez la communauté
        </h2>
        <p className="mt-2 text-sm text-marine/60">
          Recevez l'essentiel de l'actualité francophone d'Israël.
        </p>
        <div className="mt-6">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
