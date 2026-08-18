import { STATUS_FLOW, STATUS_LABEL } from "../lib/workshop";

export function StatusTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
        This request was cancelled.
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <ol className="space-y-0">
      {STATUS_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STATUS_FLOW.length - 1;
        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[11px] top-6 h-full w-0.5 ${done ? "bg-primary" : "bg-border"}`}
              />
            )}
            <span
              className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                done ? "border-primary bg-primary text-white" : "border-border bg-background text-muted-foreground"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <div>
              <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                {STATUS_LABEL[step]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
