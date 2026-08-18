require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { attachUser } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(attachUser);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/services", require("./routes/services"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/media", require("./routes/media"));
app.use("/api/track", require("./routes/track"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/admin", require("./routes/admin"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Faizan Motor Workshop API running on http://localhost:${PORT}`);
});
