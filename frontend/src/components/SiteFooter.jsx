import { Link } from "react-router-dom";
import { DEPTS, WORKSHOP, telHref, waHref } from "../lib/workshop";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold uppercase">
            Faizan <span className="text-primary">Motor</span> Workshop
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Trusted car mechanic, auto electrician, denting and painting workshop in Johar Town, Lahore.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-3">Services</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {DEPTS.map((d) => (
              <li key={d.key}>
                <Link to={`/services/${d.key}`} className="hover:text-foreground">
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
            <li><Link to="/track" className="hover:text-foreground">Track Request</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Contact</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{WORKSHOP.address}</li>
            <li><a href={telHref} className="hover:text-foreground">{WORKSHOP.phoneDisplay}</a></li>
            <li><a href={waHref()} target="_blank" rel="noreferrer" className="hover:text-foreground">WhatsApp Us</a></li>
            <li>{WORKSHOP.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Faizan Motor Workshop. All rights reserved.
      </div>
    </footer>
  );
}
