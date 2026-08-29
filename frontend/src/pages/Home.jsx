import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { api } from "../lib/api";
import { DEPTS, WORKSHOP, telHref, waHref } from "../lib/workshop";
import heroImg from "../assets/hero-workshop.jpg";
import motorImg from "../assets/dept-motor.jpg";
import electricalImg from "../assets/dept-electrical.jpg";
import dentingImg from "../assets/dept-denting.jpg";
import paintingImg from "../assets/dept-painting.jpg";

const DEPT_IMAGES = { motor: motorImg, electrical: electricalImg, denting: dentingImg, painting: paintingImg };

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get("/api/testimonials").then(setTestimonials).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden">
        <img src={heroImg} alt="Faizan Motor Workshop" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-page relative z-10 pb-20 pt-40 text-white">
          <Reveal>
            <p className="eyebrow mb-4">Johar Town, Lahore</p>
            <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-tight md:text-6xl">
              Your Car, <span className="text-primary">Fixed Right</span>, The First Time
            </h1>
            <p className="mt-5 max-w-xl text-white/80 md:text-lg">
              Mechanical, electrical, denting and painting — all under one roof. Book online, track your repair
              in real time, and get it back in expert hands.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/request" size="lg">Book a Service</Button>
              <Button href={waHref()} target="_blank" rel="noreferrer" variant="outline" size="lg">
                WhatsApp Us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Departments */}
      <section className="container-page py-20">
        <Reveal>
          <p className="eyebrow mb-2">What We Do</p>
          <h2 className="font-display text-3xl font-bold uppercase md:text-4xl">Four Departments, One Workshop</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {DEPTS.map((d, i) => (
            <Reveal key={d.key} delay={i * 90}>
              <Link
                to={`/services/${d.key}`}
                className="hover-lift surface-card block overflow-hidden rounded-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={DEPT_IMAGES[d.key]} alt={d.label} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold uppercase">{d.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="border-y border-border bg-card">
        <div className="container-page grid gap-10 py-20 md:grid-cols-3">
          {[
            { tag: "PRICING", title: "Transparent Pricing", body: "No hidden charges. You approve the estimate before any work begins." },
            { tag: "TRACKING", title: "Live Status Tracking", body: "Get a tracking ID for every request and follow progress from received to completed." },
            { tag: "STAFF", title: "Skilled Specialists", body: "Dedicated mechanics, electricians, denters and painters — each an expert in their department." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div>
                <span className="stamp-badge h-12 px-3 text-[10px]">{item.tag}</span>
                <h3 className="mt-4 font-display text-xl font-bold uppercase">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-page py-20">
          <Reveal>
            <p className="eyebrow mb-2">Customer Reviews</p>
            <h2 className="font-display text-3xl font-bold uppercase md:text-4xl">What Our Customers Say</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 6).map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <div className="surface-card h-full rounded-lg p-6">
                  <div className="mb-2 text-primary">{"★".repeat(t.rating)}</div>
                  <p className="text-sm text-muted-foreground">"{t.body}"</p>
                  <p className="mt-4 text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-primary">
        <div className="container-page flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="font-display text-2xl font-bold uppercase text-white md:text-4xl">
            Need Your Car Looked At Today?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button to="/request" size="lg" className="bg-white text-primary hover:bg-white/90">
              Book Now
            </Button>
            <Button href={telHref} size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Call {WORKSHOP.phoneDisplay}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
