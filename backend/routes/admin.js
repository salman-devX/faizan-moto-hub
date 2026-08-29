const express = require("express");
const { v4: uuid } = require("uuid");
const db = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// All registered users (for the "assign role" dropdown)
router.get("/users", requireAuth, requireRole("admin"), (req, res) => {
  const rows = db.prepare("SELECT id, full_name AS name, email, phone FROM users ORDER BY full_name").all();
  res.json(rows);
});

// All staff/admin role assignments
router.get("/roles", requireAuth, requireRole("admin"), (req, res) => {
  const rows = db
    .prepare(
      `SELECT ur.id, ur.user_id, ur.role, u.full_name AS name, u.email, u.phone
       FROM user_roles ur JOIN users u ON u.id = ur.user_id
       WHERE ur.role != 'customer'
       ORDER BY u.full_name`,
    )
    .all();
  res.json(rows);
});

router.post("/roles", requireAuth, requireRole("admin"), (req, res) => {
  const { user_id, role } = req.body || {};
  const validRoles = ["motor", "electrical", "denter", "painter"];
  if (!user_id || !validRoles.includes(role)) return res.status(400).json({ error: "Invalid user or role" });
  const exists = db.prepare("SELECT id FROM user_roles WHERE user_id = ? AND role = ?").get(user_id, role);
  if (exists) return res.status(400).json({ error: "This user already has that role" });
  db.prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?,?,?)").run(uuid(), user_id, role);
  res.json({ ok: true });
});

router.delete("/roles/:id", requireAuth, requireRole("admin"), (req, res) => {
  const row = db.prepare("SELECT * FROM user_roles WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  if (row.user_id === req.user.id && row.role === "admin") {
    return res.status(400).json({ error: "You cannot remove your own admin role" });
  }
  db.prepare("DELETE FROM user_roles WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
