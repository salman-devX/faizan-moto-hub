import { PageHero } from "../components/PageHero.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { Button } from "../components/Button.jsx";
import { WORKSHOP, telHref, waHref, mapsEmbed, mapsDirections } from "../lib/workshop";

export default function Contact() {
  return (
    <div>
      <PageHero eyebrow="Get In Touch" title="Contact Us" subtitle="Call, message on WhatsApp, or visit the workshop directly." />
      <section className="container-page grid gap-10 py-16 md:grid-cols-2">
        <Reveal>
          <div className="surface-card rounded-lg p-6">
            <h3 className="font-display text-lg font-bold uppercase">Workshop Details</h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Address</dt>
                <dd className="font-semibold">{WORKSHOP.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd><a href={telHref} className="font-semibold text-primary">{WORKSHOP.phoneDisplay}</a></dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Hours</dt>
                <dd className="font-semibold">{WORKSHOP.hours}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={waHref()} target="_blank" rel="noreferrer">WhatsApp Us</Button>
              <Button href={mapsDirections} target="_blank" rel="noreferrer" variant="outline">Get Directions</Button>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              title="Workshop location"
              src={mapsEmbed}
              className="h-full min-h-[360px] w-full"
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
