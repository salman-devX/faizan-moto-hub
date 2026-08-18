import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { api } from "../lib/api";
import { DEPTS } from "../lib/workshop";
import motorImg from "../assets/dept-motor.jpg";
import electricalImg from "../assets/dept-electrical.jpg";
import dentingImg from "../assets/dept-denting.jpg";
import paintingImg from "../assets/dept-painting.jpg";

const DEPT_IMAGES = { motor: motorImg, electrical: electricalImg, denting: dentingImg, painting: paintingImg };

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/api/services").then(setServices).catch(() => {});
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Our Services"
        title="Everything Your Car Needs"
        subtitle="Choose a department to see the full list of services and request a booking."
      />
      <section className="container-page py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {DEPTS.map((d, i) => {
            const list = services.filter((s) => s.dept === d.key).slice(0, 5);
            return (
              <Reveal key={d.key} delay={i * 80}>
                <Link to={`/services/${d.key}`} className="hover-lift surface-card block overflow-hidden rounded-lg">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={DEPT_IMAGES[d.key]} alt={d.label} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold uppercase">{d.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{d.blurb}</p>
                    <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                      {list.map((s) => (
                        <li key={s.id}>• {s.name}</li>
                      ))}
                    </ul>
                    <span className="mt-4 inline-block text-sm font-semibold text-primary">View all &amp; book →</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
