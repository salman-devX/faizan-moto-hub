export function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="border-b border-border bg-card">
      <div className="container-page py-14 md:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-bold uppercase md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
