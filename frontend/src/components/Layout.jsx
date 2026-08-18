import { SiteHeader } from "./SiteHeader.jsx";
import { SiteFooter } from "./SiteFooter.jsx";
import { FloatingContact } from "./FloatingContact.jsx";

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingContact />
    </div>
  );
}
