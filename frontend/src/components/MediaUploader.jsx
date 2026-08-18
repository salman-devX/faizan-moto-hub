import { useRef, useState } from "react";
import { api } from "../lib/api";
import { Button } from "./Button.jsx";
import { MAX_IMAGES, MAX_IMAGE_MB, MAX_VIDEOS, MAX_VIDEO_MB } from "../lib/workshop";

export function MediaUploader({ requestId, onUploaded }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (fileList) => {
    setError("");
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const images = files.filter((f) => f.type.startsWith("image/"));
    const videos = files.filter((f) => f.type.startsWith("video/"));

    if (images.length > MAX_IMAGES) return setError(`Max ${MAX_IMAGES} images at a time.`);
    if (videos.length > MAX_VIDEOS) return setError(`Max ${MAX_VIDEOS} videos at a time.`);
    const tooBigImage = images.find((f) => f.size > MAX_IMAGE_MB * 1024 * 1024);
    if (tooBigImage) return setError(`Images must be under ${MAX_IMAGE_MB}MB.`);
    const tooBigVideo = videos.find((f) => f.size > MAX_VIDEO_MB * 1024 * 1024);
    if (tooBigVideo) return setError(`Videos must be under ${MAX_VIDEO_MB}MB.`);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    setBusy(true);
    try {
      await api.upload(`/api/media/${requestId}`, formData);
      onUploaded?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? "Uploading..." : "Upload Photos / Video"}
      </Button>
      <p className="mt-1 text-xs text-muted-foreground">
        Up to {MAX_IMAGES} photos ({MAX_IMAGE_MB}MB each) and {MAX_VIDEOS} videos ({MAX_VIDEO_MB}MB each).
      </p>
      {error && <p className="mt-1 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}
