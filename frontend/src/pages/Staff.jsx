import { useEffect, useState } from "react";
import { PageHero } from "../components/PageHero.jsx";
import { RequestWorkPanel } from "../components/RequestWorkPanel.jsx";
import { api } from "../lib/api";
import { STATUS_LABEL, STATUS_TONE } from "../lib/workshop";

export default function Staff() {
  const [requests, setRequests] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/api/requests").then(setRequests).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const active = requests.find((r) => r.id === openId);

  return (
    <div>
      <PageHero eyebrow="Staff Panel" title="Assigned Requests" subtitle="Requests for your department, newest first." />
      <section className="container-page py-16">
        {!loading && requests.length === 0 && (
          <p className="text-muted-foreground">No requests assigned to your department yet.</p>
        )}
        <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
          <div className="space-y-3">
            {requests.map((r) => (
              <button
                key={r.id}
                onClick={() => setOpenId(r.id)}
                className={`surface-card block w-full rounded-lg p-4 text-left transition-colors ${
                  openId === r.id ? "border-primary" : ""
                }`}
              >
                <p className="font-display font-bold uppercase">{r.code}</p>
                <p className="text-sm text-muted-foreground">{r.full_name} · {r.car_make} {r.car_model}</p>
                <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_TONE[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
              </button>
            ))}
          </div>

          <div>
            {active ? (
              <div className="surface-card rounded-lg p-6">
                <p className="eyebrow">{active.code}</p>
                <h3 className="font-display text-xl font-bold uppercase">{active.service_name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {active.full_name} · {active.phone} · {active.car_make} {active.car_model} {active.reg_no}
                </p>
                <p className="mt-3 text-sm">{active.problem}</p>
                <div className="mt-6">
                  <RequestWorkPanel request={active} onUpdated={load} />
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a request to view details.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
