import { useEffect, useState } from "react";
import { PageHero } from "../components/PageHero.jsx";
import { Button } from "../components/Button.jsx";
import { RequestWorkPanel } from "../components/RequestWorkPanel.jsx";
import { api } from "../lib/api";
import { STATUS_LABEL, STATUS_TONE } from "../lib/workshop";

const ROLE_LABEL = { admin: "Admin", motor: "Motor Staff", electrical: "Electrical Staff", denter: "Denting Staff", painter: "Painting Staff" };

export default function Admin() {
  const [tab, setTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assign, setAssign] = useState({ user_id: "", role: "motor" });
  const [error, setError] = useState("");

  const loadRequests = () => api.get("/api/requests").then(setRequests);
  const loadRoles = () => {
    api.get("/api/admin/users").then(setUsers);
    api.get("/api/admin/roles").then(setRoles);
  };

  useEffect(() => {
    loadRequests();
    loadRoles();
  }, []);

  const active = requests.find((r) => r.id === openId);

  const addRole = async (e) => {
    e.preventDefault();
    setError("");
    if (!assign.user_id) return setError("Choose a user");
    try {
      await api.post("/api/admin/roles", assign);
      loadRoles();
    } catch (e) {
      setError(e.message);
    }
  };

  const removeRole = async (id) => {
    try {
      await api.del(`/api/admin/roles/${id}`);
      loadRoles();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <PageHero eyebrow="Admin" title="Workshop Admin" />
      <section className="container-page py-16">
        <div className="mb-8 flex gap-3">
          <Button size="sm" variant={tab === "requests" ? "default" : "outline"} onClick={() => setTab("requests")}>
            All Requests
          </Button>
          <Button size="sm" variant={tab === "roles" ? "default" : "outline"} onClick={() => setTab("roles")}>
            Staff Roles
          </Button>
        </div>

        {tab === "requests" && (
          <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
            <div className="space-y-3">
              {requests.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setOpenId(r.id)}
                  className={`surface-card block w-full rounded-lg p-4 text-left ${openId === r.id ? "border-primary" : ""}`}
                >
                  <p className="font-display font-bold uppercase">{r.code}</p>
                  <p className="text-sm text-muted-foreground">{r.full_name} · {r.dept}</p>
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
                    <RequestWorkPanel request={active} onUpdated={loadRequests} />
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Select a request to manage it.</p>
              )}
            </div>
          </div>
        )}

        {tab === "roles" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="surface-card rounded-lg p-6">
              <h3 className="font-display font-bold uppercase">Assign a Role</h3>
              <form onSubmit={addRole} className="mt-4 space-y-3">
                <select className="input" value={assign.user_id} onChange={(e) => setAssign((a) => ({ ...a, user_id: e.target.value }))}>
                  <option value="">Select a registered user</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
                <select className="input" value={assign.role} onChange={(e) => setAssign((a) => ({ ...a, role: e.target.value }))}>
                  {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
                <Button type="submit" className="w-full">Assign Role</Button>
              </form>
            </div>

            <div className="surface-card rounded-lg p-6">
              <h3 className="font-display font-bold uppercase">Current Staff & Admins</h3>
              <div className="mt-4 space-y-2">
                {roles.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                    <div>
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-muted-foreground">{ROLE_LABEL[r.role]}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => removeRole(r.id)}>Remove</Button>
                  </div>
                ))}
                {roles.length === 0 && <p className="text-sm text-muted-foreground">No staff assigned yet.</p>}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
