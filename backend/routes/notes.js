const express = require("express");
const { v4: uuid } = require("uuid");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");
const { canManageRequest } = require("../constants");

const router = express.Router();

router.get("/:requestId", requireAuth, (req, res) => {
  const request = db.prepare("SELECT * FROM service_requests WHERE id = ?").get(req.params.requestId);
  if (!request) return res.status(404).json({ error: "Not found" });
  if (!canManageRequest(req.user, request.dept)) return res.status(403).json({ error: "Not allowed" });
  const rows = db
    .prepare("SELECT id, body, author_name, created_at FROM staff_notes WHERE request_id = ? ORDER BY created_at DESC")
    .all(req.params.requestId);
  res.json(rows);
});

router.post("/:requestId", requireAuth, (req, res) => {
  const request = db.prepare("SELECT * FROM service_requests WHERE id = ?").get(req.params.requestId);
  if (!request) return res.status(404).json({ error: "Not found" });
  if (!canManageRequest(req.user, request.dept)) return res.status(403).json({ error: "Not allowed" });
  const body = String(req.body?.body || "").trim();
  if (body.length < 2 || body.length > 800) return res.status(400).json({ error: "Note must be 2-800 characters" });

  const id = uuid();
  const authorName = req.user.full_name || "Staff";
  db.prepare("INSERT INTO staff_notes (id, request_id, author_id, author_name, body) VALUES (?,?,?,?,?)")
    .run(id, req.params.requestId, req.user.id, authorName, body);
  res.json({ id, body, author_name: authorName, created_at: new Date().toISOString() });
});

module.exports = router;
