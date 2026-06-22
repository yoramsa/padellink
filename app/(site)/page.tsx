import Link from "next/link";
import {
  getFeaturedArticles,
  getArticlesByType,
  getFeaturedAdresses
} from "@/lib/queries";
import ArticleCard from "@/components/ArticleCard";
import AddressCard from "@/components/AddressCard";
import SectionHeader from "@/components/SectionHeader";
import EmptyNotice from "@/components/EmptyNotice";
import NewsletterForm from "@/components/NewsletterForm";
import AdBanner from "@/components/AdBanner";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, news, blog, adresses] = await Promise.all([
    getFeaturedArticles(5),
    getArticlesByType("news", 6),
    getArticlesByType("blog", 4),
    getFeaturedAdresses(6)
  ]);

  const hero = featured[0];
  const heroSide = featured.slice(1, 4);

  return (
    <div className="pb-10">
      <section className="mx-auto max-w-content px-5 py-10">
        {hero ? (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <article className="card-rise relative overflow-hidden rounded-3xl border border-or/30 shadow-card">
              <Link href={`/news/${hero.slug}`}>
                <div className="aspect-[16/10] overflow-hidden bg-marine">
                  {hero.image_cover ? (
                    <img
                      src={hero.image_cover}
                      alt={hero.titre}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="mosaic-band h-full w-full" />
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-marine/95 to-transparent p-7">
                  {hero.categorie && (
                    <span className="inline-block rounded-full bg-or px-3 py-1 text-xs font-bold text-marine">
                      {hero.categorie.nom}
                    </span>
                  )}
                  <h1 className="mt-3 font-title text-3xl font-extrabold leading-tight text-creme sm:text-4xl">
                    {hero.titre}
                  </h1>
                  {hero.extrait && (
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-creme/85">
                      {hero.extrait}
                    </p>
                  )}
                </div>
              </Link>
            </article>

            <div className="flex flex-col gap-4">
              {heroSide.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="card-rise flex gap-4 overflow-hidden rounded-2xl border border-or/25 bg-white p-3 shadow-soft"
                >
                  <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-creme">
                    {article.image_cover ? (
                      <img
                        src={article.image_cover}
                        alt={article.titre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="mosaic-band h-full w-full" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    {article.categorie && (
                      <span className="text-xs font-semibold text-azur">
                        {article.categorie.nom}
                      </span>
                    )}
                    <h3 className="mt-1 font-title text-base font-bold leading-snug text-marine">
                      {article.titre}
                    </h3>
                  </div>
                </Link>
              ))}
              {heroSide.length === 0 && (
                <div className="flex flex-1 flex-col justify-center rounded-2xl border border-or/30 bg-white p-8 text-center shadow-soft">
                  <h2 className="font-title text-2xl font-bold text-marine">
                    Bienvenue sur Mazaly
                  </h2>
                  <p className="mt-2 text-sm text-marine/60">
                    Le média de la communauté francophone en Israël.
                  </p>
                  <Link
                    href="/news"
                    className="btn-primary mx-auto mt-5 rounded-full px-5 py-2.5 text-sm font-semibold"
                  >
                    Découvrir les news
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-or/30 bg-white p-12 text-center shadow-card">
            <p className="font-title text-sm font-semibold uppercase tracking-widest text-or">
              Média communautaire francophone
            </p>
            <h1 className="mx-auto mt-4 max-w-3xl font-title text-4xl font-extrabold leading-tight text-marine sm:text-5xl">
              Mazaly, le rendez-vous des francophones d'Israël
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-marine/70">
              Actualités, témoignages et bonnes adresses pour vivre pleinement
              la communauté, de l'alyah au quotidien.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <NewsletterForm />
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-content px-5 py-8">
        <SectionHeader
          title="À la une"
          subtitle="L'actualité de la communauté francophone"
          href="/news"
          linkLabel="Toutes les news"
        />
        {news.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((article) => (
              <ArticleCard key={article.id} article={article} basePath="/news" />
            ))}
          </div>
        ) : (
          <EmptyNotice label="Les premiers articles arrivent très bientôt." />
        )}
      </section>

      <section className="py-6">
        <AdBanner emplacement="home" />
      </section>

      <section className="mx-auto max-w-content px-5 py-8">
        <SectionHeader
          title="Le Blog"
          subtitle="Récits, culture et conseils"
          href="/blog"
          linkLabel="Tout le blog"
        />
        {blog.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {blog.map((article) => (
              <ArticleCard key={article.id} article={article} basePath="/blog" />
            ))}
          </div>
        ) : (
          <EmptyNotice label="Les premiers billets de blog arrivent bientôt." />
        )}
      </section>

      <section className="mx-auto max-w-content px-5 py-8">
        <SectionHeader
          title="Bonnes adresses"
          subtitle="Les lieux préférés de la communauté"
          href="/bonnes-adresses"
          linkLabel="Toutes les adresses"
        />
        {adresses.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {adresses.map((adresse) => (
              <AddressCard key={adresse.id} adresse={adresse} />
            ))}
          </div>
        ) : (
          <EmptyNotice label="Les bonnes adresses arrivent bientôt." />
        )}
      </section>
    </div>
  );
}
