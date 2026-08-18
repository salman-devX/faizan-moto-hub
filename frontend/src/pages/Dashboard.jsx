import { useEffect, useState } from "react";
import { PageHero } from "../components/PageHero.jsx";
import { Button } from "../components/Button.jsx";
import { StatusTimeline } from "../components/StatusTimeline.jsx";
import { MediaGallery } from "../components/MediaGallery.jsx";
import { MediaUploader } from "../components/MediaUploader.jsx";
import { api } from "../lib/api";
import { STATUS_LABEL, STATUS_TONE } from "../lib/workshop";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/api/requests").then(setRequests).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openRequest = async (id) => {
    setOpenId(id === openId ? null : id);
    if (id !== openId) {
      const m = await api.get(`/api/media/${id}`);
      setMedia(m);
    }
  };

  return (
    <div>
      <PageHero eyebrow="Account" title="My Requests" />
      <section className="container-page py-16">
        {!loading && requests.length === 0 && (
          <div className="surface-card rounded-lg p-8 text-center">
            <p className="text-muted-foreground">You haven't booked any services yet.</p>
            <Button to="/request" className="mt-4">Book a Service</Button>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="surface-card rounded-lg p-5">
              <button className="flex w-full items-center justify-between text-left" onClick={() => openRequest(r.id)}>
                <div>
                  <p className="font-display font-bold uppercase">{r.code} · {r.service_name}</p>
                  <p className="text-sm text-muted-foreground">{r.car_make} {r.car_model} {r.reg_no}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_TONE[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
              </button>

              {openId === r.id && (
                <div className="mt-5 space-y-6 border-t border-border pt-5">
                  <StatusTimeline status={r.status} />
                  <div>
                    <p className="eyebrow mb-2">Photos / Video</p>
                    <MediaGallery items={media} />
                    <div className="mt-3">
                      <MediaUploader requestId={r.id} onUploaded={() => openRequest(r.id)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
