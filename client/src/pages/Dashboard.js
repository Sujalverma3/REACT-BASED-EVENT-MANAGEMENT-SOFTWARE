import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, issueCerts } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#8B1A1A','#C9963A','#15803d','#1e40af','#7c3aed','#0891b2','#be185d','#92400e'];

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(null);

  useEffect(() => {
    getDashboard()
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load dashboard'); setLoading(false); });
  }, []);

  const handleIssueCerts = async (eventId, title) => {
    setIssuing(eventId);
    try {
      const { data: r } = await issueCerts(eventId);
      toast.success(`${r.issued} certificate(s) issued for "${title}"`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setIssuing(null); }
  };

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg" /></div>;
  if (!data)   return null;

  const { stats, deptStats, monthlyRegs, recentEvents } = data;
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const chartData = (monthlyRegs || []).map(m => ({ name: MONTHS[m._id.m-1], registrations: m.count }));
  const deptData  = (deptStats  || []).map(d => ({ name: d._id?.split(' ')[0] || 'Other', value: d.count }));

  return (
    <div className="page">
      <div className="container">
        <div className="flex-between mb-6">
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>Organizer Dashboard</h1>
            <p>UniVerse GEU — real-time campus overview</p>
          </div>
          <Link to="/create-event" className="btn btn-primary">+ Create Event</Link>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label:'Total Events',    value: stats.totalEvents,   sub:'All time',           icon:'📅' },
            { label:'Registrations',   value: stats.totalRegs?.toLocaleString(), sub:'Total enrollments', icon:'🎟️' },
            { label:'Attendance Rate', value: `${stats.attendanceRate}%`, sub:`${stats.totalAttended} attended`, icon:'✅' },
            { label:'Certs Issued',    value: stats.totalCerts?.toLocaleString(), sub:'Auto-generated',  icon:'🏆' },
            { label:'GEU Students',    value: stats.totalStudents?.toLocaleString(), sub:'Registered',   icon:'🎓' },
            { label:'Fake Attempts',   value: stats.fakeAttempts || 0, sub:'Blocked by QR',  icon:'🔐' },
          ].map(({ label, value, sub, icon }) => (
            <div key={label} className="stat-card">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6 }}>
                <div className="stat-label">{label}</div>
                <span style={{ fontSize: 20 }}>{icon}</span>
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, color: '#8B1A1A', marginBottom: 18 }}>Monthly Registrations</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontFamily: 'DM Sans', fontSize: 12 }} />
                  <Bar dataKey="registrations" fill="#8B1A1A" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="empty" style={{ padding: 40 }}><p className="text-sm text-muted">No data yet</p></div>}
          </div>
          <div className="card">
            <h3 style={{ fontSize: 16, color: '#8B1A1A', marginBottom: 18 }}>Dept. Attendance</h3>
            {deptData.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ResponsiveContainer width="55%" height={190}>
                  <PieChart>
                    <Pie data={deptData} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={2}>
                      {deptData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontFamily: 'DM Sans', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {deptData.slice(0,6).map((d,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:7 }}>
                      <div style={{ width:10,height:10,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0 }}/>
                      <span style={{ fontSize:11,color:'#4B5563',flex:1 }}>{d.name}</span>
                      <span style={{ fontSize:11,fontWeight:700 }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div className="empty" style={{ padding: 40 }}><p className="text-sm text-muted">No data yet</p></div>}
          </div>
        </div>

        {/* Events table */}
        <div className="card">
          <h3 style={{ fontSize: 18, color: '#8B1A1A', marginBottom: 18 }}>Recent Events</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Event</th><th>Date</th><th>Category</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead>
              <tbody>
                {(recentEvents || []).map(ev => (
                  <tr key={ev._id}>
                    <td><div style={{ fontWeight: 600 }}>{ev.title}</div><div style={{ fontSize: 12, color: '#9CA3AF' }}>{ev.venue}</div></td>
                    <td style={{ fontSize: 13 }}>{new Date(ev.date).toLocaleDateString('en-IN', { day:'numeric',month:'short',year:'numeric' })}</td>
                    <td><span className={`badge badge-${ev.category?.toLowerCase().replace(/ /g,'')}`}>{ev.category}</span></td>
                    <td><span className={`badge badge-${ev.status}`}>{ev.status}</span></td>
                    <td style={{ fontSize: 13 }}>{ev.registeredCount}/{ev.capacity}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <Link to={`/events/${ev._id}`}      className="btn btn-ghost btn-sm">View</Link>
                        <Link to={`/entry-logs/${ev._id}`}  className="btn btn-ghost btn-sm">Logs</Link>
                        <Link to={`/analytics?event=${ev._id}`} className="btn btn-ghost btn-sm">Stats</Link>
                        {ev.status === 'completed' && (
                          <button className="btn btn-sm" style={{ background:'#fdf8ee',color:'#92400e',border:'1px solid #fcd34d' }}
                            disabled={issuing === ev._id}
                            onClick={() => handleIssueCerts(ev._id, ev.title)}>
                            {issuing === ev._id ? '...' : '🏆 Issue Certs'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
