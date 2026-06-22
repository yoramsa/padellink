import Reveal from "./Reveal";
import { processSteps } from "@/lib/site";

export default function Process() {
  return (
    <section id="process" className="px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-light">
            תהליך
          </span>
          <h2 className="mt-3 text-3xl font-black text-ink-white sm:text-4xl">
            4 צעדים מרעיון לאוויר
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item, i) => (
            <Reveal key={item.step} delay={i * 90}>
              <article className="glass card-hover relative h-full overflow-hidden rounded-3xl p-6">
                <span className="text-5xl font-black text-brand/30">
                  {item.step}
                </span>
                <h3 className="mt-3 text-lg font-bold text-ink-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-gray">
                  {item.desc}
                </p>
                <div className="gold-line mt-6 h-px w-full" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
