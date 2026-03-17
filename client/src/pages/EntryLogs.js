import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEntryLogs, getEvent } from '../api';
import toast from 'react-hot-toast';

export default function EntryLogs() {
  const { eventId } = useParams();
  const [logs,  setLogs]  = useState([]);
  const [event, setEvent] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEntryLogs(eventId), getEvent(eventId)])
      .then(([lr, er]) => { setLogs(lr.data.logs||[]); setEvent(er.data.event); setLoading(false); })
      .catch(() => { toast.error('Failed to load logs'); setLoading(false); });
  }, [eventId]);

  const counts = { allowed: logs.filter(l=>l.status==='allowed').length, denied: logs.filter(l=>l.status==='denied').length, duplicate: logs.filter(l=>l.status==='duplicate').length };
  const filtered = filter ? logs.filter(l=>l.status===filter) : logs;

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg"/></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Entry Logs</h1><p>{event?.title}</p></div>

        <div className="grid-4" style={{ marginBottom: 22 }}>
          {[['Total',logs.length,'#1e40af','#dbeafe'],['Allowed',counts.allowed,'#15803d','#dcfce7'],['Denied',counts.denied,'#dc2626','#fee2e2'],['Duplicate',counts.duplicate,'#d97706','#fef3c7']].map(([label,val,color,bg])=>(
            <div key={label} className="stat-card" style={{ borderTop:`3px solid ${color}`,background:bg }}>
              <div className="stat-label">{label}</div>
              <div className="stat-value" style={{ color }}>{val}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display:'flex',gap:6,marginBottom:16 }}>
            {[['','All'],['allowed','Allowed'],['denied','Denied'],['duplicate','Duplicate']].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)} className="btn btn-sm"
                style={{ background:filter===v?'#8B1A1A':'#fff',color:filter===v?'#fff':'#6B7280',border:'1px solid',borderColor:filter===v?'#8B1A1A':'#E5E0D8' }}>
                {l} {v && `(${counts[v]||0})`}
              </button>
            ))}
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Status</th><th>Scanned By</th><th>Time</th><th>Reason</th></tr></thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan="5" style={{ textAlign:'center',color:'#9CA3AF',padding:28 }}>No logs found</td></tr>
                  : filtered.map(log=>(
                  <tr key={log._id}>
                    <td><div style={{fontWeight:600}}>{log.user?.name||'Unknown'}</div><div style={{fontSize:11,color:'#9CA3AF'}}>{log.user?.collegeId||'—'}</div></td>
                    <td><span className={`badge chip-${log.status}`}>{log.status}</span></td>
                    <td style={{fontSize:13}}>{log.scannedBy?.name||'—'}</td>
                    <td style={{fontSize:12,color:'#6B7280'}}>{new Date(log.timestamp).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</td>
                    <td style={{fontSize:12,color:'#6B7280'}}>{log.reason||'—'}</td>
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
