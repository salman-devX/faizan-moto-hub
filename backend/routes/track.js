const express = require("express");
const db = require("../db");

const router = express.Router();

const digitsOnly = (v) => String(v || "").replace(/\D/g, "");

router.post("/", (req, res) => {
  const code = String(req.body?.code || "").trim().toUpperCase();
  const phone = digitsOnly(req.body?.phone).slice(-10);
  if (!code || !phone) return res.status(400).json({ error: "Enter tracking ID and phone number" });

  const row = db.prepare("SELECT * FROM service_requests WHERE upper(code) = ?").get(code);
  if (!row || digitsOnly(row.phone).slice(-10) !== phone) {
    return res.status(404).json({ error: "No request found" });
  }
  const service = row.service_id ? db.prepare("SELECT name FROM services WHERE id = ?").get(row.service_id) : null;
  res.json({
    code: row.code,
    status: row.status,
    dept: row.dept,
    car_make: row.car_make,
    car_model: row.car_model,
    reg_no: row.reg_no,
    created_at: row.created_at,
    updated_at: row.updated_at,
    service_name: service?.name || null,
  });
});

module.exports = router;
