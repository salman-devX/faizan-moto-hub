import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { Button } from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const { user, isAdmin, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      let loggedInUser;
      if (mode === "login") {
        loggedInUser = await login(form.email, form.password);
      } else {
        loggedInUser = await register(form.fullName, form.phone, form.email, form.password);
      }
      const isAdmin = (loggedInUser?.roles || []).includes("admin");
      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHero eyebrow="Account" title={mode === "login" ? "Sign In" : "Create Account"} />
      <section className="container-page max-w-md py-16">
        <form onSubmit={submit} className="surface-card space-y-4 rounded-lg p-6">
          {mode === "register" && (
            <>
              <input className="input" placeholder="Full Name" value={form.fullName} onChange={set("fullName")} required />
              <input className="input" placeholder="Phone (03XXXXXXXXX)" value={form.phone} onChange={set("phone")} required />
            </>
          )}
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={set("email")} required />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={set("password")} required />

          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}
