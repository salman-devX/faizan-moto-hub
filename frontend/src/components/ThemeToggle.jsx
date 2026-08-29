import { useTheme } from "../context/ThemeContext.jsx";

export function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to day shift (light theme)" : "Switch to night shift (dark theme)"}
      title={isDark ? "Day shift" : "Night shift"}
      className={`inline-flex h-9 w-16 shrink-0 items-center rounded-full border border-border bg-muted px-1 transition-colors ${className}`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm transition-transform duration-300 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? "PM" : "AM"}
      </span>
    </button>
  );
}
