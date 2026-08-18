const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM testimonials WHERE approved = 1 ORDER BY created_at DESC LIMIT 6")
    .all();
  res.json(rows);
});

module.exports = router;
