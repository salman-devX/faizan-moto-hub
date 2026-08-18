const express = require("express");
const { v4: uuid } = require("uuid");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");
const { canSeeRequest, canManageRequest, ALL_STATUSES } = require("../constants");

const router = express.Router();

const PK_PHONE = /^(\+92\d{10}|03\d{9})$/;

function nextCode() {
  const row = db.prepare("SELECT n FROM request_seq").get();
  const n = (row?.n || 0) + 1;
  db.prepare("UPDATE request_seq SET n = ?").run(n);
  const year = new Date().getFullYear();
  return `FMW-${year}-${String(n).padStart(4, "0")}`;
}

function attachServiceName(row) {
  if (!row) return row;
  const service = row.service_id
    ? db.prepare("SELECT name FROM services WHERE id = ?").get(row.service_id)
    : null;
  return { ...row, service_name: service?.name || null };
}

// Create a new request (customer only)
router.post("/", requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.full_name || b.full_name.trim().length < 2) return res.status(400).json({ error: "Enter your full name" });
  if (!PK_PHONE.test(String(b.phone || "").trim())) return res.status(400).json({ error: "Enter a valid Pakistani phone number" });
  if (!["motor", "electrical", "denting", "painting"].includes(b.dept)) return res.status(400).json({ error: "Choose a department" });
  if (!b.service_id) return res.status(400).json({ error: "Choose the service you need" });
  if (!b.problem || b.problem.trim().length < 15) return res.status(400).json({ error: "Please describe the problem (at least 15 characters)" });

  const id = uuid();
  const code = nextCode();
  db.prepare(
    `INSERT INTO service_requests
      (id, code, customer_id, full_name, phone, whatsapp, car_make, car_model, reg_no, dept, service_id, problem, preferred_date, preferred_time, notes, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'received')`,
  ).run(
    id, code, req.user.id, b.full_name.trim(), b.phone.trim(), b.whatsapp?.trim() || b.phone.trim(),
    b.car_make?.trim() || null, b.car_model?.trim() || null, b.reg_no?.trim() || null,
    b.dept, b.service_id, b.problem.trim(), b.preferred_date || null, b.preferred_time || null, b.notes?.trim() || null,
  );
  db.prepare("INSERT INTO request_status_history (id, request_id, status, changed_by) VALUES (?,?,?,?)")
    .run(uuid(), id, "received", req.user.id);

  res.json({ id, code });
});

// List: customer sees own, staff sees their dept, admin sees all
router.get("/", requireAuth, (req, res) => {
  let rows;
  if (req.user.isAdmin) {
    rows = db.prepare("SELECT * FROM service_requests ORDER BY created_at DESC").all();
  } else {
    const staffDepts = Object.entries(require("../constants").DEPT_ROLE)
      .filter(([, role]) => req.user.roles.includes(role))
      .map(([dept]) => dept);
    if (staffDepts.length > 0) {
      const placeholders = staffDepts.map(() => "?").join(",");
      rows = db.prepare(`SELECT * FROM service_requests WHERE dept IN (${placeholders}) ORDER BY created_at DESC`).all(...staffDepts);
    } else {
      rows = db.prepare("SELECT * FROM service_requests WHERE customer_id = ? ORDER BY created_at DESC").all(req.user.id);
    }
  }
  res.json(rows.map(attachServiceName));
});

// Update status (staff of dept or admin)
router.patch("/:id/status", requireAuth, (req, res) => {
  const request = db.prepare("SELECT * FROM service_requests WHERE id = ?").get(req.params.id);
  if (!request) return res.status(404).json({ error: "Not found" });
  if (!canManageRequest(req.user, request.dept)) return res.status(403).json({ error: "Not allowed" });
  const { status } = req.body || {};
  if (!ALL_STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status" });

  db.prepare("UPDATE service_requests SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, request.id);
  db.prepare("INSERT INTO request_status_history (id, request_id, status, changed_by) VALUES (?,?,?,?)")
    .run(uuid(), request.id, status, req.user.id);
  res.json({ ok: true });
});

// Get one (must be able to see it)
router.get("/:id", requireAuth, (req, res) => {
  const request = db.prepare("SELECT * FROM service_requests WHERE id = ?").get(req.params.id);
  if (!request) return res.status(404).json({ error: "Not found" });
  if (!canSeeRequest(req.user, request.dept, request.customer_id)) return res.status(403).json({ error: "Not allowed" });
  res.json(attachServiceName(request));
});

module.exports = router;
