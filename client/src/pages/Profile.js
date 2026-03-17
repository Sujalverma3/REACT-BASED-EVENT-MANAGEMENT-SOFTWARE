// This file exports Profile as default
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, updateProfile, getMyCerts, checkCertificate } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [regs, setRegs]   = useState([]);
  const [certs, setCerts] = useState({});  // eventId -> cert info
  const [editing, setEditing] = useState(false);
  const [form, setForm]   = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then(r => {
      setRegs(r.data.registrations || []);
      setForm({ name: r.data.user.name, phone: r.data.user.phone || '' });
    }).catch(() => toast.error('Failed to load profile'));

    getMyCerts().then(r => {
      const map = {};
      (r.data.certs || []).forEach(c => { if (c.event) map[c.event._id] = c; });
      setCerts(map);
    }).catch(() => {});
  }, []);

  const handleSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const { data } = await updateProfile(form);
      setUser(data.user); toast.success('Profile updated!'); setEditing(false);
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const initials = user?.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Profile card */}
          <div>
            <div className="card" style={{ textAlign: 'center', marginBottom: 14, borderTop: '3px solid #8B1A1A' }}>
              <div style={{ width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#8B1A1A,#b52020)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Playfair Display,serif',fontSize:26,fontWeight:800,color:'#fff',margin:'0 auto 14px' }}>{initials}</div>
              <h2 style={{ fontSize: 19, marginBottom: 4 }}>{user?.name}</h2>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{user?.email}</div>
              <span style={{ fontSize: 11, background: '#fdf0f0', color: '#8B1A1A', padding: '3px 12px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase' }}>{user?.role}</span>
              <div className="divider" />
              {[['🆔','College ID',user?.collegeId],['🏛️','Department',user?.department],['📞','Phone',user?.phone||'Not set']].map(([ic,lb,vl])=>(
                <div key={lb} style={{ display:'flex',alignItems:'center',gap:9,padding:'6px 0',textAlign:'left' }}>
                  <span>{ic}</span>
                  <div>
                    <div style={{ fontSize:10,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:.5 }}>{lb}</div>
                    <div style={{ fontSize:13,fontWeight:500 }}>{vl}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => setEditing(!editing)} className="btn btn-outline w-full" style={{ marginTop: 14 }}>
                {editing ? 'Cancel' : '✏️ Edit Profile'}
              </button>
              {editing && (
                <form onSubmit={handleSave} style={{ marginTop: 14, textAlign: 'left' }}>
                  <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                  <button type="submit" className="btn btn-primary w-full" style={{ justifyContent:'center' }} disabled={saving}>{saving?'Saving...':'Save'}</button>
                </form>
              )}
            </div>
            <Link to="/certificates" className="btn btn-gold w-full" style={{ justifyContent:'center' }}>🏆 My Certificates</Link>
          </div>

          {/* Registrations */}
          <div>
            <h2 style={{ fontSize: 22, color: '#8B1A1A', marginBottom: 20 }}>My Registrations</h2>
            {regs.length === 0 ? (
              <div className="empty card"><div className="empty-icon">📭</div><div className="empty-title">No registrations yet</div><Link to="/events" className="btn btn-primary" style={{ marginTop: 12 }}>Browse Events</Link></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {regs.map(reg => {
                  const cert = certs[reg.event?._id];
                  return (
                    <div key={reg._id} className="card" style={{ borderLeft: `4px solid ${reg.attended ? '#15803d' : '#8B1A1A'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <Link to={`/events/${reg.event?._id}`} style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}>{reg.event?.title}</Link>
                          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                            📅 {reg.event?.date ? new Date(reg.event.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'} &nbsp;·&nbsp; 📍 {reg.event?.venue}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <span className={`badge badge-${reg.event?.status}`}>{reg.event?.status}</span>
                          <span className="badge" style={{ background: reg.attended ? '#dcfce7' : '#f3f4f6', color: reg.attended ? '#166534' : '#4b5563' }}>
                            {reg.attended ? '✅ Attended' : '⏳ Registered'}
                          </span>
                          {cert ? (
                            <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>🏆 Cert Issued</span>
                          ) : reg.attended ? (
                            <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>Cert Pending</span>
                          ) : null}
                        </div>
                      </div>
                      {cert && (
                        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                          {cert.fileUrl && <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">⬇ Download Certificate</a>}
                          <Link to={`/verify/${cert.certificateId}`} className="btn btn-ghost btn-sm">🔍 Verify</Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
