import { fileUrl } from "../lib/api";

export function MediaGallery({ items = [] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos or videos uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.id} className="zoom-media aspect-square overflow-hidden rounded-md border border-border bg-muted">
          {item.kind === "image" ? (
            <img src={fileUrl(item.url)} alt="Uploaded" className="h-full w-full object-cover" />
          ) : (
            <video src={fileUrl(item.url)} controls className="h-full w-full object-cover" />
          )}
        </div>
      ))}
    </div>
  );
}
