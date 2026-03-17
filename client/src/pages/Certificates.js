import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyCerts, getProfile, checkCertificate } from '../api';
import toast from 'react-hot-toast';

export default function Certificates() {
  const [certs, setCerts]         = useState([]);
  const [pending, setPending]     = useState([]);  // registered but no cert yet
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('issued');

  useEffect(() => {
    const load = async () => {
      try {
        // Issued certificates
        const { data: certsData } = await getMyCerts();
        setCerts(certsData.certs || []);

        // Check all my registrations for pending certificate status
        const { data: profileData } = await getProfile();
        const regs = profileData.registrations || [];
        const issuedEventIds = new Set((certsData.certs || []).map(c => c.event?._id));

        const pendingList = [];
        for (const reg of regs) {
          if (!reg.event) continue;
          if (issuedEventIds.has(reg.event._id)) continue;
          // Check cert status for this event
          try {
            const { data: cs } = await checkCertificate(reg.event._id);
            pendingList.push({ reg, certStatus: cs });
          } catch {}
        }
        setPending(pendingList);
      } catch {
        toast.error('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg" /></div>;

  const tabStyle = active => ({
    padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
    background: active ? '#8B1A1A' : 'transparent', color: active ? '#fff' : '#6B7280',
    transition: 'all .2s',
  });

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>My Certificates</h1>
          <p>Track and download your participation certificates</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#F3F4F6', padding: 4, borderRadius: 10, width: 'fit-content' }}>
          <button style={tabStyle(activeTab === 'issued')}  onClick={() => setActiveTab('issued')}>
            🏆 Issued ({certs.length})
          </button>
          <button style={tabStyle(activeTab === 'pending')} onClick={() => setActiveTab('pending')}>
            ⏳ Pending ({pending.length})
          </button>
        </div>

        {/* Issued certs */}
        {activeTab === 'issued' && (
          certs.length === 0 ? (
            <div className="empty card"><div className="empty-icon">🏆</div><div className="empty-title">No certificates yet</div><p className="text-sm text-muted">Attend events to earn certificates</p><Link to="/events" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Events</Link></div>
          ) : (
            <div className="grid-2">
              {certs.map(cert => (
                <div key={cert._id} className="card" style={{ borderTop: '3px solid #C9963A' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#8B1A1A,#C9963A)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🏆</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{cert.event?.title}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
                        📅 {cert.event?.date ? new Date(cert.event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} &nbsp;·&nbsp; 📍 {cert.event?.venue}
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: 11, background: '#fdf0f0', color: '#8B1A1A', padding: '3px 10px', borderRadius: 6, display: 'inline-block', marginBottom: 12 }}>{cert.certificateId}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {cert.fileUrl && (
                          <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">⬇ Download PDF</a>
                        )}
                        <Link to={`/verify/${cert.certificateId}`} className="btn btn-ghost btn-sm">🔍 Verify</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Pending certs */}
        {activeTab === 'pending' && (
          pending.length === 0 ? (
            <div className="empty card"><div className="empty-icon">⏳</div><div className="empty-title">No pending certificates</div><p className="text-sm text-muted">All eligible certificates have been issued</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {pending.map(({ reg, certStatus }) => (
                <div key={reg._id} className="card" style={{ borderLeft: `4px solid ${certStatus.attended ? '#C9963A' : '#E5E0D8'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <Link to={`/events/${reg.event?._id}`} style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}>{reg.event?.title}</Link>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                        📅 {reg.event?.date ? new Date(reg.event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} &nbsp;·&nbsp; 📍 {reg.event?.venue}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`badge ${certStatus.attended ? 'badge-ongoing' : 'badge-upcoming'}`}>
                        {certStatus.attended ? '✅ Attended' : '⏳ Not yet attended'}
                      </span>
                      <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>Certificate Pending</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 13, color: '#6B7280' }}>
                    {!certStatus.attended
                      ? '👉 Attend this event and get your QR scanned to become eligible for a certificate.'
                      : '👉 You attended! The organizer will issue certificates after the event ends.'}
                  </div>
                  {certStatus.attended && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#9CA3AF' }}>
                      Attended on {new Date(certStatus.attendedAt).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
