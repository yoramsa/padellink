import Reveal from "./Reveal";
import { services } from "@/lib/site";

export default function Services() {
  return (
    <section id="services" className="px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-light">
            שירותים
          </span>
          <h2 className="mt-3 text-3xl font-black text-ink-white sm:text-4xl">
            חבילות שמתאימות לכל שלב
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-gray">
            מחירים שקופים, ללא עמלות נסתרות, עם אפשרות לתשלום בשלבים.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 90}>
              <article className="glass card-hover flex h-full flex-col rounded-3xl p-6">
                <span className="text-3xl">{service.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-ink-white">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-gray">
                  {service.desc}
                </p>
                <p className="mt-5 text-lg font-extrabold text-brand-light">
                  {service.price}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
