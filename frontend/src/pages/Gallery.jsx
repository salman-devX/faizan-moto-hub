import { useEffect, useState } from "react";
import { PageHero } from "../components/PageHero.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { api, fileUrl } from "../lib/api";
import motorImg from "../assets/dept-motor.jpg";
import electricalImg from "../assets/dept-electrical.jpg";
import dentingImg from "../assets/dept-denting.jpg";
import paintingImg from "../assets/dept-painting.jpg";

const FALLBACK = [
  { id: "f1", title: "Engine Diagnostics", image_url: motorImg },
  { id: "f2", title: "Auto Electrical Repair", image_url: electricalImg },
  { id: "f3", title: "Denting & Panel Work", image_url: dentingImg },
  { id: "f4", title: "Full Body Painting", image_url: paintingImg },
];

export default function Gallery() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    api.get("/api/gallery").then((rows) => {
      if (rows.length > 0) setItems(rows);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <PageHero eyebrow="Our Work" title="Gallery" subtitle="A look at recent repairs, restorations and finishes from the workshop." />
      <section className="container-page py-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 8) * 60}>
              <div className="zoom-media aspect-square overflow-hidden rounded-lg border border-border">
                <img
                  src={item.image_url?.startsWith("http") || item.image_url?.startsWith("/uploads") ? fileUrl(item.image_url) : item.image_url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.title}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
