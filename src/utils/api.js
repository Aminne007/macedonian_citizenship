const BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';

export async function submitApplication(data) {
  const res = await fetch(`${BASE}/api/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, ...json };
  return json;
}

export async function checkStatus(instagram) {
  const res = await fetch(`${BASE}/api/status/${encodeURIComponent(instagram)}`);
  return res.json();
}

export async function getAdminApplications(key) {
  const res = await fetch(`${BASE}/api/admin/applications`, {
    headers: { 'x-admin-key': key }
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function adminApprove(id, key) {
  const res = await fetch(`${BASE}/api/admin/approve/${id}`, {
    method: 'POST',
    headers: { 'x-admin-key': key, 'Content-Type': 'application/json' }
  });
  return res.json();
}

export async function adminReject(id, key, note = '') {
  const res = await fetch(`${BASE}/api/admin/reject/${id}`, {
    method: 'POST',
    headers: { 'x-admin-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });
  return res.json();
}

export async function adminDelete(id, key) {
  const res = await fetch(`${BASE}/api/admin/applications/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': key }
  });
  return res.json();
}

export async function adminRevoke(id, key) {
  const res = await fetch(`${BASE}/api/admin/revoke/${id}`, {
    method: 'POST',
    headers: { 'x-admin-key': key }
  });
  return res.json();
}


