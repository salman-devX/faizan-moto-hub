import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./Button.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { WORKSHOP, telHref } from "../lib/workshop";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
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
    <header className="sticky top-0 z-40">
      <div className="hazard-rule" aria-hidden="true" />
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="stamp-badge h-9 w-9 text-[10px] font-bold">FMW</span>
            <span className="font-display text-lg font-bold uppercase leading-none tracking-wide">
              Faizan <span className="text-primary">Motor</span> Workshop
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass} end={link.to === "/"}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={telHref} className="font-mono text-sm font-medium text-muted-foreground hover:text-foreground">
              {WORKSHOP.phoneDisplay}
            </a>
            <ThemeToggle />
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
            <Button to="/request" size="sm">
              Book Now
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              className="rounded-sm border border-border p-2"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="mt-1 block h-0.5 w-5 bg-foreground" />
              <span className="mt-1 block h-0.5 w-5 bg-foreground" />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-b border-border bg-background lg:hidden">
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
