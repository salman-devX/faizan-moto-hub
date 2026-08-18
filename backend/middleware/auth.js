const jwt = require("jsonwebtoken");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "fmw-dev-secret-change-me";

function getRoles(userId) {
  return db
    .prepare("SELECT role FROM user_roles WHERE user_id = ?")
    .all(userId)
    .map((r) => r.role);
}

// Verifies token if present, attaches req.user. Does NOT block if missing.
function attachUser(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.prepare("SELECT id, full_name, email, phone, whatsapp FROM users WHERE id = ?").get(payload.sub);
    if (user) {
      const roles = getRoles(user.id);
      req.user = { ...user, roles, isAdmin: roles.includes("admin") };
    }
  } catch {
    // ignore invalid token
  }
  next();
}

// Blocks request if not logged in.
function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Sign in required" });
  next();
}

// Blocks unless user has one of the given roles.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Sign in required" });
    const has = req.user.roles.some((r) => roles.includes(r));
    if (!has) return res.status(403).json({ error: "Not allowed" });
    next();
  };
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

module.exports = { attachUser, requireAuth, requireRole, signToken, getRoles, JWT_SECRET };
