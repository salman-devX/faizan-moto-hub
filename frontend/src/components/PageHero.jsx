export function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-primary" aria-hidden="true" />
      <div className="container-page py-14 md:py-20">
        {eyebrow && <p className="eyebrow mb-3">// {eyebrow}</p>}
        <h1 className="font-display text-3xl font-bold uppercase leading-[0.95] md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
