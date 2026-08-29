import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  insertApplication,
  getByInstagram,
  getById,
  getAllApplications,
  approveApplication,
  rejectApplication,
  deleteApplication,
  revokeApplication
} from './db.js';
import { sendApprovalEmail, sendRejectionEmail, sendWelcomeEmail } from './email.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_KEY = process.env.ADMIN_KEY || 'KING1323';
const IS_PROD = process.env.NODE_ENV === 'production';

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: IS_PROD ? false : 'http://localhost:3000' }));
app.use(express.json());

// Serve React build in production
if (IS_PROD) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
}

// ── Admin Auth Middleware ─────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized — Invalid imperial key.' });
  }
  next();
}

// ── PUBLIC API ────────────────────────────────────────────────────────────

// POST /api/apply  — Submit new citizenship application
app.post('/api/apply', (req, res) => {
  const { full_name, email, instagram, age, quiz_answers, royal_title } = req.body;

  // Basic validation
  if (!full_name?.trim() || !email?.trim() || !instagram?.trim() || !age || !royal_title) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (Number(age) < 16) {
    return res.status(400).json({ error: 'Applicant must be at least 16 years old.' });
  }
  if (!instagram.startsWith('@') || instagram.length < 4) {
    return res.status(400).json({ error: 'Invalid Instagram handle.' });
  }

  // Check for duplicate
  const existing = getByInstagram(instagram);
  if (existing) {
    return res.status(409).json({
      error: 'duplicate',
      status: existing.status,
      national_code: existing.national_code || null,
      message: `This Instagram handle has already submitted an application. Status: ${existing.status}.`
    });
  }

  try {
    const id = insertApplication({ full_name, email, instagram, age, quiz_answers, royal_title });
    const createdApp = getById(id);

    // Send welcome email asynchronously
    sendWelcomeEmail(createdApp).catch(e => console.error('[EMAIL] Error:', e));

    res.status(201).json({
      id,
      status: 'pending',
      submitted_at: createdApp.submitted_at,
      message: 'Application received. Await royal approval.'
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'duplicate', message: 'This Instagram handle is already registered.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/status/:instagram — Poll application status
app.get('/api/status/:instagram', (req, res) => {
  const handle = decodeURIComponent(req.params.instagram);
  const record = getByInstagram(handle);

  if (!record) {
    return res.status(404).json({ found: false });
  }

  res.json({
    found: true,
    id: record.id,
    status: record.status,
    full_name: record.full_name,
    instagram: record.instagram,
    royal_title: record.royal_title,
    national_code: record.national_code || null,
    submitted_at: record.submitted_at,
    approved_at: record.approved_at || null,
    rejection_note: record.rejection_note || null
  });
});

// ── ADMIN API ─────────────────────────────────────────────────────────────

// GET /api/admin/applications — List all applications
app.get('/api/admin/applications', requireAdmin, (req, res) => {
  const apps = getAllApplications();
  res.json({ applications: apps });
});

// POST /api/admin/approve/:id
app.post('/api/admin/approve/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const result = approveApplication(id);
  if (!result) return res.status(404).json({ error: 'Application not found.' });

  // Send approval email (async, don't block response)
  sendApprovalEmail(result).catch(e => console.error('[EMAIL] Error:', e));

  res.json({ success: true, application: result });
});

// POST /api/admin/reject/:id
app.post('/api/admin/reject/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { note = 'Your application did not meet imperial standards.' } = req.body;
  const result = rejectApplication(id, note);
  if (!result) return res.status(404).json({ error: 'Application not found.' });

  // Send rejection email (async)
  sendRejectionEmail(result).catch(e => console.error('[EMAIL] Error:', e));

  res.json({ success: true, application: result });
});

// DELETE /api/admin/applications/:id
app.delete('/api/admin/applications/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const result = deleteApplication(id);
  if (!result) return res.status(404).json({ error: 'Application not found.' });
  res.json({ success: true, deleted: result });
});

// POST /api/admin/revoke/:id — Revoke status back to pending
app.post('/api/admin/revoke/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const result = revokeApplication(id);
  if (!result) return res.status(404).json({ error: 'Application not found.' });
  res.json({ success: true, revoked: result });
});

// ── SPA Fallback (production) ─────────────────────────────────────────────
if (IS_PROD) {
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏛️  Macedonian Imperial Server running on port ${PORT}`);
  console.log(`   Environment: ${IS_PROD ? 'PRODUCTION' : 'DEVELOPMENT'}`);
});
