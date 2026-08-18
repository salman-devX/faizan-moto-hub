import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { WORKSHOP, telHref } from "../lib/workshop";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/track", label: "Track Request" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, staffDept, signOut } = useAuth();

  const navClass = ({ isActive }) =>
    `text-sm font-semibold uppercase tracking-wide transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  const dashboardTo = isAdmin ? "/admin" : staffDept ? "/staff" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-lg font-bold uppercase tracking-wide">
          Faizan <span className="text-primary">Motor</span> Workshop
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={telHref} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            {WORKSHOP.phoneDisplay}
          </a>
          {user ? (
            <>
              <Button to={dashboardTo} variant="secondary" size="sm">
                {isAdmin ? "Admin" : staffDept ? "Staff Panel" : "My Requests"}
              </Button>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <Button to="/auth" size="sm">
              Sign In
            </Button>
          )}
          <Button to="/request" size="sm" variant="default" className="bg-gradient-red border-0">
            Book Now
          </Button>
        </div>

        <button
          className="rounded-md border border-border p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-5 bg-foreground" />
          <span className="mt-1 block h-0.5 w-5 bg-foreground" />
          <span className="mt-1 block h-0.5 w-5 bg-foreground" />
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-page flex flex-col gap-4 py-4">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass} onClick={() => setOpen(false)} end={link.to === "/"}>
                {link.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              {user ? (
                <>
                  <Button to={dashboardTo} variant="secondary" onClick={() => setOpen(false)}>
                    {isAdmin ? "Admin" : staffDept ? "Staff Panel" : "My Requests"}
                  </Button>
                  <Button onClick={() => { signOut(); setOpen(false); }} variant="outline">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button to="/auth" onClick={() => setOpen(false)}>
                  Sign In
                </Button>
              )}
              <Button to="/request" onClick={() => setOpen(false)}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
