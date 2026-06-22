import Reveal from "./Reveal";
import { projects } from "@/lib/site";

export default function Projects() {
  return (
    <section id="projects" className="px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-light">
            פרויקטים
          </span>
          <h2 className="mt-3 text-3xl font-black text-ink-white sm:text-4xl">
            דוגמאות לפלטפורמות שבנינו
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 100}>
              <article className="glass card-hover flex h-full flex-col rounded-3xl p-6">
                <div className="mb-5 flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-night-700 to-night-900 text-4xl shadow-glow">
                  ✦
                </div>
                <h3 className="text-lg font-bold text-ink-white">
                  {project.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-gray">
                  {project.desc}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-brand-light/25 bg-night-900/60 px-3 py-1 text-xs font-medium text-brand-soft"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
