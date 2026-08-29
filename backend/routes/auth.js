const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const db = require("../db");
const { signToken, requireAuth, getRoles } = require("../middleware/auth");

const router = express.Router();

const PK_PHONE = /^(\+92\d{10}|03\d{9})$/;

router.post("/register", async (req, res) => {
  const { fullName, phone, email, password } = req.body || {};
  if (!fullName || fullName.trim().length < 2) return res.status(400).json({ error: "Enter your full name" });
  if (!PK_PHONE.test(String(phone || "").trim())) return res.status(400).json({ error: "Use a Pakistani number like 03001234567" });
  if (!/^\S+@\S+\.\S+$/.test(String(email || ""))) return res.status(400).json({ error: "Enter a valid email" });
  if (!password || password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.trim().toLowerCase());
  if (existing) return res.status(400).json({ error: "An account with this email already exists" });

  const id = uuid();
  const hash = await bcrypt.hash(password, 10);
  db.prepare(
    "INSERT INTO users (id, full_name, email, phone, whatsapp, password_hash) VALUES (?,?,?,?,?,?)",
  ).run(id, fullName.trim(), email.trim().toLowerCase(), phone.trim(), phone.trim(), hash);

  // Every self-registered account is a plain customer. The only admin account
  // is the fixed one seeded in db.js — nobody can become admin by registering.
  db.prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?,?,?)").run(uuid(), id, "customer");

  const token = signToken(id);
  res.json({ token, user: { id, full_name: fullName.trim(), email: email.trim().toLowerCase(), roles: ["customer"] } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(String(email || "").trim().toLowerCase());
  if (!user) return res.status(400).json({ error: "Invalid email or password" });
  const ok = await bcrypt.compare(String(password || ""), user.password_hash);
  if (!ok) return res.status(400).json({ error: "Invalid email or password" });
  const token = signToken(user.id);
  const roles = getRoles(user.id);
  res.json({
    token,
    user: { id: user.id, full_name: user.full_name, email: user.email, phone: user.phone, roles },
  });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
