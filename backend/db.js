const Database = require("better-sqlite3");
const path = require("path");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");

const db = new Database(path.join(__dirname, "fmw.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ---------- SCHEMA ----------
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  whatsapp TEXT,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin','motor','electrical','denter','painter','customer')),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  dept TEXT NOT NULL CHECK (dept IN ('motor','electrical','denting','painting')),
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS request_seq (n INTEGER);

CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  customer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  car_make TEXT,
  car_model TEXT,
  reg_no TEXT,
  dept TEXT NOT NULL,
  service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
  problem TEXT NOT NULL,
  preferred_date TEXT,
  preferred_time TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS request_media (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('image','video')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS request_status_history (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS staff_notes (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  author_id TEXT,
  author_name TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  body TEXT NOT NULL,
  approved INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

// ---------- SEED (only if empty) ----------
const serviceCount = db.prepare("SELECT COUNT(*) c FROM services").get().c;
if (serviceCount === 0) {
  const insertService = db.prepare(
    "INSERT INTO services (id, slug, name, dept, description, sort_order) VALUES (?,?,?,?,?,?)",
  );
  const services = [
    ["engine-problems", "Engine Problems", "motor", "Diagnosis and repair of engine faults, misfires and power loss.", 1],
    ["oil-change", "Oil & Filter Change", "motor", "Engine oil, oil filter and air filter replacement.", 2],
    ["brakes", "Brake Problems", "motor", "Brake pads, discs, drums and brake fluid service.", 3],
    ["suspension", "Suspension", "motor", "Shocks, struts, bushes and steering geometry.", 4],
    ["clutch", "Clutch", "motor", "Clutch plate, pressure plate and release bearing.", 5],
    ["gearbox", "Gearbox / Transmission", "motor", "Manual and automatic transmission repair.", 6],
    ["overheating", "Overheating", "motor", "Radiator, thermostat and cooling system repair.", 7],
    ["general-mechanical", "General Mechanical Issues", "motor", "Any other mechanical fault.", 8],
    ["inspection", "Vehicle Inspection", "motor", "Complete pre-purchase or health inspection.", 9],
    ["battery", "Battery Problems", "electrical", "Battery testing, charging and replacement.", 1],
    ["starter", "Starter Problems", "electrical", "Self starter repair and replacement.", 2],
    ["alternator", "Alternator", "electrical", "Charging system repair.", 3],
    ["wiring", "Vehicle Wiring", "electrical", "Complete or partial wiring repair.", 4],
    ["lights", "Lights", "electrical", "Headlights, indicators and interior lighting.", 5],
    ["sensors", "Sensors", "electrical", "Sensor diagnostics and replacement.", 6],
    ["central-locking", "Central Locking", "electrical", "Locking, remote and immobiliser issues.", 7],
    ["power-windows", "Power Windows", "electrical", "Window motors, switches and regulators.", 8],
    ["other-electrical", "Other Electrical Problems", "electrical", "Any other electrical fault.", 9],
    ["dent-repair", "Dent Repair", "denting", "Removal of dents of any size.", 1],
    ["accident-damage", "Accident Damage", "denting", "Full accident body restoration.", 2],
    ["bumper-repair", "Bumper Repair", "denting", "Bumper straightening and repair.", 3],
    ["door-repair", "Door Repair", "denting", "Door panel repair and alignment.", 4],
    ["fender-repair", "Fender Repair", "denting", "Fender and wing repair.", 5],
    ["body-repair", "Body Repair", "denting", "Complete body panel work.", 6],
    ["scratch-removal", "Scratch Repair", "denting", "Scratch removal and smoothing.", 7],
    ["full-paint", "Full Car Painting", "painting", "Complete repaint with oven finish.", 1],
    ["partial-paint", "Partial Painting", "painting", "Selected panels repaint.", 2],
    ["door-paint", "Door Painting", "painting", "Single or multiple door painting.", 3],
    ["bumper-paint", "Bumper Painting", "painting", "Bumper refinishing.", 4],
    ["fender-paint", "Fender Painting", "painting", "Fender refinishing.", 5],
    ["paint-scratch", "Scratch Repair & Touch Up", "painting", "Touch-up painting for scratches.", 6],
    ["color-matching", "Color Matching", "painting", "Computerised colour matching.", 7],
    ["polishing", "Finishing & Polishing", "painting", "Cutting, buffing and mirror polishing.", 8],
  ];
  const insertMany = db.transaction((rows) => {
    for (const [slug, name, dept, description, sort_order] of rows) {
      insertService.run(uuid(), slug, name, dept, description, sort_order);
    }
  });
  insertMany(services);

  const insertTestimonial = db.prepare(
    "INSERT INTO testimonials (id, name, city, rating, body) VALUES (?,?,?,?,?)",
  );
  const testimonials = [
    ["Usman Tariq", "Johar Town, Lahore", 5, "Meri Corolla ka engine noise doosri jagah se theek nahi hua tha. Faizan Motor Workshop ne diagnose kar ke same day theek kar diya. Very honest pricing."],
    ["Hafiz Bilal", "Model Town, Lahore", 5, "Auto electrician team is excellent. Wiring issue that three shops could not find was fixed in two hours."],
    ["Sana Ahmed", "Wapda Town, Lahore", 5, "Got the whole car painted here. Colour match is perfect and the finish looks factory fresh."],
    ["Rizwan Sheikh", "Faisalabad", 5, "Drove from Faisalabad for accident denting work. Worth the trip - panel gaps are perfect."],
    ["Ali Raza", "Gulberg, Lahore", 4, "Quick oil change and brake service. Clean workshop and they explain everything before starting work."],
    ["Kamran Javed", "Sheikhupura", 5, "Bumper repair and paint at a very reasonable rate. Highly recommended for Punjab customers."],
  ];
  const insertTestimonials = db.transaction((rows) => {
    for (const [name, city, rating, body] of rows) insertTestimonial.run(uuid(), name, city, rating, body);
  });
  insertTestimonials(testimonials);

  db.prepare("INSERT INTO request_seq (n) VALUES (0)").run();
}

// ---------- FIXED ADMIN ACCOUNT (only one admin ever exists) ----------
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin123@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

const existingAdmin = db.prepare("SELECT id FROM users WHERE email = ?").get(ADMIN_EMAIL);
if (!existingAdmin) {
  const adminId = uuid();
  const adminHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  db.prepare(
    "INSERT INTO users (id, full_name, email, phone, whatsapp, password_hash) VALUES (?,?,?,?,?,?)",
  ).run(adminId, "Admin", ADMIN_EMAIL, "", "", adminHash);
  db.prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?,?,?)").run(uuid(), adminId, "admin");
} else {
  // Make sure this account always keeps admin role even if it was touched before.
  const hasAdminRole = db.prepare("SELECT id FROM user_roles WHERE user_id = ? AND role = 'admin'").get(existingAdmin.id);
  if (!hasAdminRole) {
    db.prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?,?,?)").run(uuid(), existingAdmin.id, "admin");
  }
}

// Clean up any leftover admin roles from the old bug (any account other than
// the fixed admin email that previously got auto-promoted to admin).
const fixedAdminId = db.prepare("SELECT id FROM users WHERE email = ?").get(ADMIN_EMAIL)?.id;
db.prepare("DELETE FROM user_roles WHERE role = 'admin' AND user_id != ?").run(fixedAdminId || "");

module.exports = db;
