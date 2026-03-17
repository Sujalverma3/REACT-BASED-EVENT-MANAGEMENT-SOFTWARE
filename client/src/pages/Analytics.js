import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getEvents, getEventStats } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function Analytics() {
  const location = useLocation();
  const preselect = new URLSearchParams(location.search).get('event') || '';
  const [events,   setEvents]   = useState([]);
  const [selected, setSelected] = useState(preselect);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => { getEvents({ limit: 50 }).then(r=>setEvents(r.data.events||[])).catch(()=>{}); }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    getEventStats(selected)
      .then(r => { setStats(r.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load stats'); setLoading(false); });
  }, [selected]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Event Analytics</h1><p>Detailed stats and feedback for GEU events</p></div>

        <div className="card" style={{ marginBottom: 24 }}>
          <label className="form-label">Select Event</label>
          <select className="form-select" value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">-- Choose an Event --</option>
            {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
          </select>
        </div>

        {loading && <div className="loading-center"><div className="spinner spinner-lg" /></div>}

        {stats && !loading && (
          <div className="anim-fade-up">
            <div className="grid-4" style={{ marginBottom: 24 }}>
              {[
                { label:'Registrations', value: stats.stats.regs,    icon:'🎟️' },
                { label:'Attended',      value: stats.stats.attended, icon:'✅' },
                { label:'Attend Rate',   value: `${stats.stats.rate}%`, icon:'📊' },
                { label:'Avg Rating',    value: `${stats.stats.avgRating}/5`, icon:'⭐' },
              ].map(({label,value,icon}) => (
                <div key={label} className="stat-card">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><div className="stat-label">{label}</div><span style={{fontSize:18}}>{icon}</span></div>
                  <div className="stat-value">{value}</div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
              <div className="card">
                <h3 style={{ fontSize:16,color:'#8B1A1A',marginBottom:16 }}>Rating Distribution</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={stats.ratingDist}>
                    <XAxis dataKey="rating" tickFormatter={v=>`${v}★`} tick={{fontSize:12}} />
                    <YAxis tick={{fontSize:12}} />
                    <Tooltip contentStyle={{fontFamily:'DM Sans',fontSize:12}} />
                    <Bar dataKey="count" fill="#C9963A" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <h3 style={{ fontSize:16,color:'#8B1A1A',marginBottom:14 }}>Department Breakdown</h3>
                {stats.deptBreakdown?.length > 0 ? (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Dept</th><th>Reg</th><th>Attended</th><th>Rate</th></tr></thead>
                      <tbody>
                        {stats.deptBreakdown.map(d=>(
                          <tr key={d._id}>
                            <td style={{fontSize:12}}>{d._id}</td>
                            <td>{d.registered}</td>
                            <td>{d.attended}</td>
                            <td><span style={{color:'#15803d',fontWeight:700}}>{Math.round((d.attended/d.registered)*100)}%</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <div className="empty"><p className="text-sm text-muted">No data</p></div>}
              </div>
            </div>

            {stats.comments?.length > 0 && (
              <div className="card">
                <h3 style={{ fontSize:16,color:'#8B1A1A',marginBottom:14 }}>Student Feedback</h3>
                <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  {stats.comments.map((c,i) => (
                    <div key={i} style={{ background:'#fdf8f2',borderRadius:8,padding:'12px 16px',borderLeft:'3px solid #C9963A' }}>
                      <div style={{ fontSize:13,color:'#C9963A',fontWeight:700,marginBottom:4 }}>{'⭐'.repeat(c.rating)} {c.rating}/5</div>
                      <p style={{ fontSize:13.5,color:'#4B5563',lineHeight:1.6 }}>{c.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!selected && !loading && (
          <div className="empty card"><div className="empty-icon">📊</div><div className="empty-title">Select an event above</div></div>
        )}
      </div>
    </div>
  );
}
