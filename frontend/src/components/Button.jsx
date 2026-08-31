import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-50 disabled:pointer-events-none active:translate-y-px";

const variants = {
  default:
    "bg-primary text-primary-foreground border border-primary-dark shadow-[inset_0_-2px_0_rgb(var(--primary-dark))] hover:bg-primary-dark",
  outline: "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
  secondary: "bg-muted text-foreground border border-border hover:border-primary/50",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  // For use on a colored (bg-primary) section, e.g. the CTA band — solid white pill.
  invert: "bg-white text-primary border border-white shadow-[inset_0_-2px_0_rgb(0_0_0_/_0.12)] hover:bg-white/90",
  // For use on a colored (bg-primary) section — outlined, inverts to solid on hover.
  invertOutline: "border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary",
};

const sizes = {
  default: "h-10 px-5",
  sm: "h-9 px-4 text-xs",
  lg: "h-12 px-7",
  icon: "h-10 w-10",
};

export function Button({
  variant = "default",
  size = "default",
  to,
  href,
  className = "",
  children,
  ...props
}) {
  const cls = `${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
