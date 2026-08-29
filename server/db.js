import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'applications.db'));

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    national_code TEXT,
    full_name     TEXT NOT NULL,
    email         TEXT NOT NULL,
    instagram     TEXT NOT NULL UNIQUE COLLATE NOCASE,
    age           INTEGER NOT NULL,
    quiz_answers  TEXT NOT NULL,
    royal_title   TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending',
    submitted_at  TEXT NOT NULL,
    approved_at   TEXT,
    rejected_at   TEXT,
    rejection_note TEXT
  );
`);

// ── Queries ──────────────────────────────────────────────────────────────

export function insertApplication({ full_name, email, instagram, age, quiz_answers, royal_title }) {
  const stmt = db.prepare(`
    INSERT INTO applications (full_name, email, instagram, age, quiz_answers, royal_title, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    full_name,
    email.toLowerCase(),
    instagram.toLowerCase(),
    age,
    JSON.stringify(quiz_answers),
    royal_title,
    new Date().toISOString()
  );
  return result.lastInsertRowid;
}

export function getByInstagram(instagram) {
  return db.prepare('SELECT * FROM applications WHERE instagram = ? COLLATE NOCASE').get(instagram.toLowerCase());
}

export function getById(id) {
  return db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
}

export function getAllApplications() {
  return db.prepare('SELECT * FROM applications ORDER BY submitted_at DESC').all();
}

export function approveApplication(id) {
  const existing = getById(id);
  if (!existing) return null;

  // Generate incremental national code
  const count = db.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'approved'").get().c;
  const padded = String(count + 1).padStart(4, '0');
  const national_code = `MKD-2026-${padded}`;

  db.prepare(`
    UPDATE applications SET status = 'approved', national_code = ?, approved_at = ? WHERE id = ?
  `).run(national_code, new Date().toISOString(), id);

  return { ...getById(id), national_code };
}

export function rejectApplication(id, note = '') {
  db.prepare(`
    UPDATE applications SET status = 'rejected', rejected_at = ?, rejection_note = ? WHERE id = ?
  `).run(new Date().toISOString(), note, id);
  return getById(id);
}

export function deleteApplication(id) {
  const existing = getById(id);
  if (!existing) return null;
  db.prepare('DELETE FROM applications WHERE id = ?').run(id);
  return existing;
}

export function revokeApplication(id) {
  const existing = getById(id);
  if (!existing) return null;
  db.prepare(`
    UPDATE applications SET status = 'pending', national_code = NULL, approved_at = NULL, rejected_at = NULL, rejection_note = NULL WHERE id = ?
  `).run(id);
  return getById(id);
}

export default db;

