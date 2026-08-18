import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { Button } from "../components/Button.jsx";
import { api } from "../lib/api";
import { deptMeta } from "../lib/workshop";

export default function ServiceDept() {
  const { dept } = useParams();
  const meta = deptMeta(dept);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!meta) return;
    api.get(`/api/services?dept=${dept}`).then(setServices).catch(() => {});
  }, [dept, meta]);

  if (!meta) return <Navigate to="/services" replace />;

  return (
    <div>
      <PageHero eyebrow="Department" title={meta.label} subtitle={meta.blurb} />
      <section className="container-page py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 60}>
              <div className="surface-card h-full rounded-lg p-5">
                <h3 className="font-display font-bold uppercase">{s.name}</h3>
                {s.description && <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button to={`/request?dept=${dept}`} size="lg">Book This Service</Button>
        </div>
      </section>
    </div>
  );
}
