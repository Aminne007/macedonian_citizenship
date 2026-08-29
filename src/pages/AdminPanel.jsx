import React, { useState, useEffect, useCallback } from 'react';
import { Crown, Shield, CheckCircle2, X, Loader2, RefreshCw, LogOut, Eye, Clock3, AlertCircle, Search, Download, Trash2, HelpCircle, FileSpreadsheet, RotateCcw } from 'lucide-react';
import { getAdminApplications, adminApprove, adminReject, adminDelete, adminRevoke } from '../utils/api';

const STATUS_COLORS = {
  pending:  'bg-amber-900/40 text-amber-300 border-amber-500/40',
  approved: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40',
  rejected: 'bg-red-900/40 text-red-300 border-red-500/40',
};

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [rejectModal, setRejectModal] = useState(null); // { id, name }
  const [rejectNote, setRejectNote] = useState('');
  const [quizModalApp, setQuizModalApp] = useState(null); // app object
  const [filter, setFilter] = useState('all'); // all | pending | approved | rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchApps = useCallback(async (key = adminKey) => {
    setLoading(true);
    try {
      const data = await getAdminApplications(key);
      setApps(data.applications || []);
      setLastRefresh(new Date());
    } catch {
      setAuthed(false);
      setKeyError('Invalid imperial key or server error.');
    }
    setLoading(false);
  }, [adminKey]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setKeyError('');
    setLoading(true);
    try {
      const data = await getAdminApplications(keyInput);
      setApps(data.applications || []);
      setAdminKey(keyInput);
      setAuthed(true);
      setLastRefresh(new Date());
    } catch {
      setKeyError('Invalid imperial key. Access denied.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchApps(), 15000);
    return () => clearInterval(interval);
  }, [authed, fetchApps]);

  const handleApprove = async (id) => {
    setActionLoading(p => ({ ...p, [id]: 'approving' }));
    await adminApprove(id, adminKey);
    await fetchApps();
    setActionLoading(p => ({ ...p, [id]: null }));
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(p => ({ ...p, [rejectModal.id]: 'rejecting' }));
    await adminReject(rejectModal.id, adminKey, rejectNote);
    await fetchApps();
    setActionLoading(p => ({ ...p, [rejectModal.id]: null }));
    setRejectModal(null);
    setRejectNote('');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete record for "${name}"?\nThis allows their Instagram handle to re-apply.`)) return;
    setActionLoading(p => ({ ...p, [id]: 'deleting' }));
    try {
      const res = await adminDelete(id, adminKey);
      if (res.error) {
        alert(`Deletion error: ${res.error}`);
      } else {
        await fetchApps();
      }
    } catch (err) {
      alert(`Failed to delete record: ${err.message}`);
    } finally {
      setActionLoading(p => ({ ...p, [id]: null }));
    }
  };

  const handleRevoke = async (id, name) => {
    if (!window.confirm(`Revoke citizenship for "${name}" back to PENDING status?`)) return;
    setActionLoading(p => ({ ...p, [id]: 'revoking' }));
    try {
      const res = await adminRevoke(id, adminKey);
      if (res.error) {
        alert(`Revoke error: ${res.error}`);
      } else {
        await fetchApps();
      }
    } catch (err) {
      alert(`Failed to revoke status: ${err.message}`);
    } finally {
      setActionLoading(p => ({ ...p, [id]: null }));
    }
  };

  const handleExportCSV = () => {
    if (apps.length === 0) return;
    const headers = ['ID', 'Full Name', 'Email', 'Instagram', 'Age', 'Imperial Title', 'National Code', 'Status', 'Submitted At', 'Approved At'];
    const rows = apps.map(a => [
      a.id,
      `"${a.full_name.replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${a.instagram.replace(/"/g, '""')}"`,
      a.age,
      `"${a.royal_title.replace(/"/g, '""')}"`,
      `"${a.national_code || ''}"`,
      a.status,
      a.submitted_at,
      a.approved_at || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `macedonian_citizens_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = apps.filter(a => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const s = searchTerm.toLowerCase().trim();
    const matchesSearch = !s || (
      a.full_name?.toLowerCase().includes(s) ||
      a.email?.toLowerCase().includes(s) ||
      a.instagram?.toLowerCase().includes(s) ||
      a.royal_title?.toLowerCase().includes(s) ||
      a.national_code?.toLowerCase().includes(s)
    );
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#090514]" style={{
        background: 'radial-gradient(circle at 50% 30%, rgba(42,8,92,0.5) 0%, transparent 60%), #090514'
      }}>
        <div className="glass-card max-w-sm w-full p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[#2A085C] border-2 border-[#FFD700] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <Crown className="w-7 h-7 text-[#FFD700]" />
          </div>
          <h1 className="font-cinzel font-extrabold text-2xl gold-gradient-text mb-1">IMPERIAL CONTROL</h1>
          <p className="font-cinzel text-xs text-[#CBD5E1]/60 mb-6 uppercase tracking-widest">Administrative Court of Pella</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="royal-label text-left block mb-2">Imperial Access Key</label>
              <input
                type="password"
                value={keyInput}
                onChange={e => { setKeyInput(e.target.value); setKeyError(''); }}
                placeholder="Enter imperial key..."
                className="royal-input text-center"
                autoFocus
              />
            </div>
            {keyError && <p className="text-xs text-red-400 flex items-center justify-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {keyError}</p>}
            <button type="submit" disabled={loading} className="btn-gold !py-3 !px-6 w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {loading ? 'Authenticating...' : 'Enter the Court'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#090514] text-[#F8F9FA]" style={{
      background: 'radial-gradient(circle at 50% 0%, rgba(42,8,92,0.4) 0%, transparent 55%), #090514'
    }}>
      {/* Admin Navbar */}
      <header className="bg-[#0d0519]/90 border-b border-[#FFD700]/25 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-[#FFD700]" />
            <span className="font-cinzel font-bold text-base gold-gradient-text tracking-widest">IMPERIAL CONTROL PANEL</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FFD700]/40 text-[#FFD700] text-xs font-cinzel hover:bg-[#2A085C] transition-all"
              title="Export CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            {lastRefresh && (
              <span className="hidden md:flex items-center gap-1.5 text-[11px] text-[#CBD5E1]/40 font-inter">
                <Clock3 className="w-3 h-3" /> {lastRefresh.toLocaleTimeString()}
              </span>
            )}
            <button onClick={() => fetchApps()} disabled={loading} title="Refresh" className="p-2 rounded-full border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#2A085C] transition-all">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setAuthed(false)} title="Log out" className="p-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-900/30 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'all', label: 'Total Applications', color: 'border-[#FFD700]/40 text-[#FFD700]' },
            { key: 'pending', label: 'Pending Review', color: 'border-amber-500/40 text-amber-300' },
            { key: 'approved', label: 'Citizens Approved', color: 'border-emerald-500/40 text-emerald-300' },
            { key: 'rejected', label: 'Rejected', color: 'border-red-500/40 text-red-300' },
          ].map(s => (
            <div
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`glass-card cursor-pointer p-4 text-center border ${s.color} ${filter === s.key ? 'ring-1 ring-[#FFD700]/50' : ''} hover:bg-[#1a0840]/60 transition-all`}
            >
              <div className={`font-cinzel font-extrabold text-3xl ${s.color.split(' ')[1]}`}>{counts[s.key]}</div>
              <div className="font-cinzel text-xs text-[#CBD5E1]/60 mt-1 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls: Search & Filter Pills */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-6">
          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-semibold uppercase tracking-wider border transition-all ${
                  filter === f
                    ? 'bg-[#FFD700] text-[#0a0514] border-[#FFD700]'
                    : 'bg-transparent text-[#CBD5E1] border-[#FFD700]/25 hover:border-[#FFD700]/50'
                }`}
              >
                {f} ({counts[f]})
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, handle, code..."
              className="royal-input !py-1.5 !pl-9 !pr-4 text-xs w-full"
            />
            <Search className="w-3.5 h-3.5 text-[#FFD700]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Applications Table */}
        {loading && apps.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-[#CBD5E1]/50">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFD700] mr-3" />
            <span className="font-cinzel">Loading applications...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#CBD5E1]/40 font-cinzel text-lg">No matching applications found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => {
              const quizAnswers = (() => { try { return JSON.parse(app.quiz_answers); } catch { return {}; } })();
              return (
                <div
                  key={app.id}
                  className="glass-card p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start hover:border-[#FFD700]/40 transition-all"
                >
                  {/* Left: Applicant Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="font-cinzel text-[9px] text-[#FFD700]/70 uppercase tracking-widest block mb-0.5">Citizen</span>
                      <p className="font-cinzel font-bold text-sm text-white">{app.full_name}</p>
                      <p className="font-inter text-xs text-[#FFD700]">{app.instagram}</p>
                      <p className="font-inter text-[11px] text-[#CBD5E1]/60 truncate">{app.email}</p>
                    </div>
                    <div>
                      <span className="font-cinzel text-[9px] text-[#FFD700]/70 uppercase tracking-widest block mb-0.5">Title / Age</span>
                      <p className="font-inter text-xs text-white font-medium">{app.royal_title}</p>
                      <p className="font-inter text-xs text-[#CBD5E1]/60">Age: {app.age}</p>
                      <button
                        onClick={() => setQuizModalApp(app)}
                        className="text-[11px] text-[#FFD700] underline font-cinzel flex items-center gap-1 mt-1 hover:text-white"
                      >
                        <HelpCircle className="w-3 h-3" /> View Quiz
                      </button>
                    </div>
                    <div>
                      <span className="font-cinzel text-[9px] text-[#FFD700]/70 uppercase tracking-widest block mb-0.5">National Code</span>
                      <p className="font-mono text-xs text-[#FFF099] font-bold">{app.national_code || '—'}</p>
                      <p className="font-cinzel text-[9px] text-[#CBD5E1]/50">
                        {new Date(app.submitted_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                      </p>
                    </div>
                    <div>
                      <span className="font-cinzel text-[9px] text-[#FFD700]/70 uppercase tracking-widest block mb-0.5">Status</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold uppercase border ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex gap-2 sm:flex-col items-end">
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(app.id)}
                          disabled={!!actionLoading[app.id]}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 text-xs font-cinzel font-bold hover:bg-emerald-900 transition-all disabled:opacity-50 w-full justify-center"
                        >
                          {actionLoading[app.id] === 'approving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          Approve
                        </button>
                        <button
                          onClick={() => { setRejectModal({ id: app.id, name: app.full_name }); setRejectNote(''); }}
                          disabled={!!actionLoading[app.id]}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-cinzel font-bold hover:bg-red-900/60 transition-all disabled:opacity-50 w-full justify-center"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    )}
                    {app.status !== 'pending' && (
                      <button
                        onClick={() => handleRevoke(app.id, app.full_name)}
                        disabled={!!actionLoading[app.id]}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-amber-900/30 border border-amber-500/30 text-amber-300 text-[11px] font-cinzel hover:bg-amber-900/60 transition-all disabled:opacity-50"
                        title="Revoke status back to Pending"
                      >
                        {actionLoading[app.id] === 'revoking' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                        Revoke
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(app.id, app.full_name)}
                      disabled={!!actionLoading[app.id]}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-900/40 transition-all"
                      title="Permanently Delete Application"
                    >
                      {actionLoading[app.id] === 'deleting' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Quiz Answers Modal */}
      {quizModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-[#FFD700]/40 text-left">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-cinzel font-bold text-lg gold-gradient-text">Royal Trial Inspection</h3>
              <button onClick={() => setQuizModalApp(null)} className="text-[#CBD5E1] hover:text-white">✕</button>
            </div>
            <p className="text-xs text-[#CBD5E1]/70 font-inter mb-4">Applicant: <strong className="text-white">{quizModalApp.full_name}</strong> (@{quizModalApp.instagram.replace(/^@/,'')})</p>

            <div className="space-y-3 font-inter text-xs">
              {(() => {
                try {
                  const q = JSON.parse(quizModalApp.quiz_answers);
                  return (
                    <>
                      <div className="bg-[#120826] p-3 rounded border border-white/10">
                        <p className="text-[#FFD700] font-semibold mb-1">Q1: Insult to the King</p>
                        <p className="text-white">{q.q1 || '—'}</p>
                      </div>
                      <div className="bg-[#120826] p-3 rounded border border-white/10">
                        <p className="text-[#FFD700] font-semibold mb-1">Q2: Primary Realm Currency</p>
                        <p className="text-white">{q.q2 || '—'}</p>
                      </div>
                      <div className="bg-[#120826] p-3 rounded border border-white/10">
                        <p className="text-[#FFD700] font-semibold mb-1">Q3: Citizen Primary Duty</p>
                        <p className="text-white">{q.q3 || '—'}</p>
                      </div>
                    </>
                  );
                } catch {
                  return <p className="text-red-400">Error reading quiz responses.</p>;
                }
              })()}
            </div>

            <button onClick={() => setQuizModalApp(null)} className="btn-gold !py-2 !px-4 !text-xs w-full mt-5">Close</button>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-red-500/40 text-left">
            <h3 className="font-cinzel font-bold text-lg text-red-300 mb-1">Reject Application</h3>
            <p className="text-sm text-[#CBD5E1]/70 font-inter mb-4">
              Rejecting <strong className="text-white">{rejectModal.name}</strong>. Provide a reason (optional):
            </p>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="e.g. Insufficient loyalty demonstrated..."
              rows={3}
              className="royal-input resize-none text-sm mb-4 w-full"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal(null)}
                className="btn-outline-gold !py-2.5 !px-4 !text-sm flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2.5 px-4 rounded-full bg-red-900/50 border-2 border-red-500 text-red-200 font-cinzel font-bold text-sm hover:bg-red-900 transition-all"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
