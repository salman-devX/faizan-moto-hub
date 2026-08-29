import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { Button } from "../components/Button.jsx";
import { MediaUploader } from "../components/MediaUploader.jsx";
import { MediaGallery } from "../components/MediaGallery.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api";
import { DEPTS, isValidPkPhone } from "../lib/workshop";

const initialForm = {
  full_name: "",
  phone: "",
  whatsapp: "",
  car_make: "",
  car_model: "",
  reg_no: "",
  dept: "",
  service_id: "",
  problem: "",
  preferred_date: "",
  preferred_time: "",
  notes: "",
};

export default function RequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ ...initialForm, dept: params.get("dept") || "", full_name: user?.full_name || "", phone: user?.phone || "" });
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [media, setMedia] = useState([]);

  const loadMedia = async (requestId) => {
    const m = await api.get(`/api/media/${requestId}`).catch(() => []);
    setMedia(m);
  };

  useEffect(() => {
    if (!form.dept) return setServices([]);
    api.get(`/api/services?dept=${form.dept}`).then(setServices).catch(() => {});
  }, [form.dept]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit = useMemo(() => {
    return (
      form.full_name.trim().length > 1 &&
      isValidPkPhone(form.phone) &&
      form.dept &&
      form.service_id &&
      form.problem.trim().length >= 15
    );
  }, [form]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) return setError("Please sign in first to book a service.");
    if (!canSubmit) return setError("Please fill all required fields correctly.");

    setBusy(true);
    try {
      const data = await api.post("/api/requests", form);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <div>
        <PageHero eyebrow="Book a Service" title="Request Service" />
        <div className="container-page py-16 text-center">
          <p className="text-muted-foreground">Please sign in to book a service request.</p>
          <Button to="/auth" className="mt-4">Sign In</Button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <PageHero eyebrow="Booked" title="Request Received" />
        <div className="container-page max-w-lg py-16 text-center">
          <div className="surface-card rounded-lg p-8">
            <p className="text-muted-foreground">Your tracking ID is</p>
            <p className="mt-2 font-display text-3xl font-bold text-primary">{result.code}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Save this code with your phone number to track progress anytime, or check it from "My Requests".
            </p>

            <div className="mt-6 border-t border-border pt-6 text-left">
              <p className="eyebrow mb-2">Photos / Video (optional)</p>
              <p className="mb-3 text-sm text-muted-foreground">
                Add photos of the damage or a short video of the problem so our team can prepare before you arrive.
              </p>
              <MediaGallery items={media} />
              <div className="mt-3">
                <MediaUploader requestId={result.id} onUploaded={() => loadMedia(result.id)} />
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Button to="/dashboard">My Requests</Button>
              <Button to={`/track?code=${result.code}`} variant="outline">Track This Request</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero eyebrow="Book a Service" title="Request Service" subtitle="Tell us about the problem and preferred time — we'll confirm by phone or WhatsApp." />
      <section className="container-page max-w-2xl py-16">
        <form onSubmit={submit} className="surface-card space-y-5 rounded-lg p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name *">
              <input className="input" value={form.full_name} onChange={set("full_name")} required />
            </Field>
            <Field label="Phone (03XXXXXXXXX) *">
              <input className="input" value={form.phone} onChange={set("phone")} placeholder="03001234567" required />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Car Make">
              <input className="input" value={form.car_make} onChange={set("car_make")} placeholder="Toyota" />
            </Field>
            <Field label="Model">
              <input className="input" value={form.car_model} onChange={set("car_model")} placeholder="Corolla" />
            </Field>
            <Field label="Registration No.">
              <input className="input" value={form.reg_no} onChange={set("reg_no")} placeholder="LEA-1234" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department *">
              <select className="input" value={form.dept} onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value, service_id: "" }))} required>
                <option value="">Select department</option>
                {DEPTS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select>
            </Field>
            <Field label="Service *">
              <select className="input" value={form.service_id} onChange={set("service_id")} required disabled={!form.dept}>
                <option value="">{form.dept ? "Select service" : "Choose department first"}</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Describe the Problem *">
            <textarea className="input min-h-[100px]" value={form.problem} onChange={set("problem")} placeholder="What's wrong with the vehicle? Any noises, warning lights, when it started, etc." required />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Preferred Date">
              <input type="date" className="input" value={form.preferred_date} onChange={set("preferred_date")} />
            </Field>
            <Field label="Preferred Time">
              <input type="time" className="input" value={form.preferred_time} onChange={set("preferred_time")} />
            </Field>
          </div>

          <Field label="Additional Notes">
            <textarea className="input" value={form.notes} onChange={set("notes")} />
          </Field>

          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}

          <Button type="submit" disabled={busy || !canSubmit} className="w-full">
            {busy ? "Submitting..." : "Submit Request"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            You'll be able to add photos or a video right after submitting.
          </p>
        </form>
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
