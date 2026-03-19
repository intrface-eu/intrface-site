const featuredProjects = [
  {
    name: "AOC",
    description: "A terminal-first AI workspace built around persistent context, memory, and task-aware development.",
  },
  {
    name: "Voyager",
    description: "An AI-powered tourism platform for discovery, multilingual content, and guided exploration.",
  },
  {
    name: "Funda",
    description: "A funding opportunity platform for discovery, matching, and AI-assisted workflow execution.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-24 sm:px-10 lg:px-12">
        <div className="max-w-4xl space-y-8">
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-400">
            Intrface
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            We build AI-native platforms, products, and systems.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-neutral-300 sm:text-xl">
            This repository is the foundation for the Intrface brand site — a
            home for our flagship products, platform narrative, and public
            presentation.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <article
              key={project.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                Featured Project
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                {project.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                {project.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4 text-sm text-neutral-300">
          <span className="rounded-full border border-white/10 px-4 py-2">
            Next.js
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2">
            TypeScript
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2">
            Tailwind CSS
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2">
            AOC + Taskmaster planning workflow
          </span>
        </div>
      </section>
    </main>
  );
}
