import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { Button } from "../components/Button.jsx";
import { StatusTimeline } from "../components/StatusTimeline.jsx";
import { api } from "../lib/api";

export default function Track() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get("code") || "");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const data = await api.post("/api/track", { code, phone });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHero eyebrow="Track Request" title="Where's My Car?" subtitle="Enter your tracking ID and phone number to see live status." />
      <section className="container-page max-w-xl py-16">
        <form onSubmit={submit} className="surface-card space-y-4 rounded-lg p-6">
          <input
            className="input"
            placeholder="Tracking ID (e.g. FMW-2026-0001)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Phone number used at booking"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Searching..." : "Track Request"}
          </Button>
        </form>

        {result && (
          <div className="surface-card mt-8 rounded-lg p-6">
            <p className="eyebrow">{result.code}</p>
            <h3 className="font-display text-xl font-bold uppercase">
              {result.car_make} {result.car_model} {result.reg_no ? `· ${result.reg_no}` : ""}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{result.service_name}</p>
            <div className="mt-6">
              <StatusTimeline status={result.status} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
