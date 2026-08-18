import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  default: "bg-primary text-white hover:bg-primary-dark",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  secondary: "bg-muted text-foreground hover:bg-muted/70",
  ghost: "bg-transparent text-foreground hover:bg-muted",
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
