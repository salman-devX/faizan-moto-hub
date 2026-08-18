import { PageHero } from "../components/PageHero.jsx";
import { Reveal } from "../components/Reveal.jsx";
import aboutImg from "../assets/about-mechanic.jpg";

export default function About() {
  return (
    <div>
      <PageHero
        eyebrow="Our Story"
        title="About Faizan Motor Workshop"
        subtitle="Two decades of hands-on repair experience, built on honest diagnosis and fair pricing."
      />
      <section className="container-page grid gap-10 py-16 md:grid-cols-2 md:items-center">
        <Reveal>
          <img src={aboutImg} alt="Mechanic at work" className="rounded-lg" />
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow mb-2">Who We Are</p>
          <h2 className="font-display text-2xl font-bold uppercase md:text-3xl">
            Built By Mechanics, For Every Car Owner
          </h2>
          <p className="mt-4 text-muted-foreground">
            Faizan Motor Workshop started as a small mechanical garage in Johar Town and has grown into a
            full-service workshop covering mechanical repair, auto electrical work, denting and painting.
            Every department is run by specialists who only work in their field, so your car is always
            handled by someone who knows it well.
          </p>
          <p className="mt-4 text-muted-foreground">
            We believe in explaining the problem before we fix it. You get a clear estimate, regular updates
            through our tracking system, and a workshop that stands behind its work.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-border bg-card py-16">
        <div className="container-page grid gap-8 sm:grid-cols-3">
          {[
            { n: "20+", l: "Years Combined Experience" },
            { n: "4", l: "Specialist Departments" },
            { n: "1000+", l: "Vehicles Serviced" },
          ].map((s) => (
            <Reveal key={s.l}>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-primary">{s.n}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
