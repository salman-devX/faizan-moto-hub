import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "./Button.jsx";
import { MediaGallery } from "./MediaGallery.jsx";
import { STATUS_FLOW, STATUS_LABEL } from "../lib/workshop";

export function RequestWorkPanel({ request, onUpdated }) {
  const [notes, setNotes] = useState([]);
  const [media, setMedia] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [n, m] = await Promise.all([
        api.get(`/api/notes/${request.id}`),
        api.get(`/api/media/${request.id}`),
      ]);
      setNotes(n);
      setMedia(m);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.id]);

  const changeStatus = async (status) => {
    setBusy(true);
    setError("");
    try {
      await api.patch(`/api/requests/${request.id}/status`, { status });
      onUpdated?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (newNote.trim().length < 2) return;
    setBusy(true);
    setError("");
    try {
      await api.post(`/api/notes/${request.id}`, { body: newNote.trim() });
      setNewNote("");
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Update Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_FLOW.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={s === request.status ? "default" : "outline"}
              disabled={busy}
              onClick={() => changeStatus(s)}
            >
              {STATUS_LABEL[s]}
            </Button>
          ))}
          <Button size="sm" variant="outline" disabled={busy} onClick={() => changeStatus("cancelled")}>
            Cancel Request
          </Button>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2">Customer Photos / Videos</p>
        <MediaGallery items={media} />
      </div>

      <div>
        <p className="eyebrow mb-2">Staff Notes</p>
        <form onSubmit={addNote} className="mb-3 flex gap-2">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note for the team..."
            className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm"
          />
          <Button size="sm" disabled={busy}>Add</Button>
        </form>
        <div className="space-y-3">
          {notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
          {notes.map((n) => (
            <div key={n.id} className="rounded-md border border-border bg-muted/40 p-3 text-sm">
              <p>{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {n.author_name} · {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
    </div>
  );
}
