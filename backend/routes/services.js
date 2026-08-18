const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  const { dept } = req.query;
  const rows = dept
    ? db.prepare("SELECT * FROM services WHERE active = 1 AND dept = ? ORDER BY sort_order").all(dept)
    : db.prepare("SELECT * FROM services WHERE active = 1 ORDER BY dept, sort_order").all();
  res.json(rows);
});

module.exports = router;
