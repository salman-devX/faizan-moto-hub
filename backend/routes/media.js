const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");
const { canSeeRequest } = require("../constants");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_IMAGE_MB = 8;
const MAX_VIDEO_MB = 60;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${uuid()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    if (!isImage && !isVideo) return cb(new Error("Only images and videos are allowed"));
    cb(null, true);
  },
});

// Upload files for a request (must own the request)
router.post("/:requestId", requireAuth, upload.array("files", 8), (req, res) => {
  const request = db.prepare("SELECT * FROM service_requests WHERE id = ?").get(req.params.requestId);
  if (!request) return res.status(404).json({ error: "Not found" });
  if (request.customer_id !== req.user.id) return res.status(403).json({ error: "Not allowed" });

  const saved = [];
  for (const file of req.files || []) {
    const isImage = file.mimetype.startsWith("image/");
    if (isImage && file.size > MAX_IMAGE_MB * 1024 * 1024) continue;
    const id = uuid();
    const kind = isImage ? "image" : "video";
    db.prepare("INSERT INTO request_media (id, request_id, path, kind) VALUES (?,?,?,?)")
      .run(id, req.params.requestId, file.filename, kind);
    saved.push({ id, kind, path: file.filename });
  }
  res.json({ saved });
});

// List media for a request (must be allowed to see it)
router.get("/:requestId", requireAuth, (req, res) => {
  const request = db.prepare("SELECT * FROM service_requests WHERE id = ?").get(req.params.requestId);
  if (!request) return res.status(404).json({ error: "Not found" });
  if (!canSeeRequest(req.user, request.dept, request.customer_id)) return res.status(403).json({ error: "Not allowed" });

  const rows = db.prepare("SELECT id, path, kind FROM request_media WHERE request_id = ?").all(req.params.requestId);
  res.json(rows.map((r) => ({ ...r, url: `/uploads/${r.path}` })));
});

module.exports = router;
