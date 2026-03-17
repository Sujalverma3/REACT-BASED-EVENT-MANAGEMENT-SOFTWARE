// ScanQR.js
import React, { useState, useEffect, useRef } from 'react';
import { scanQR, getEvents } from '../api';
import toast from 'react-hot-toast';

export function ScanQR() {
  const [events, setEvents]         = useState([]);
  const [selectedEvent, setSel]     = useState('');
  const [scanning, setScanning]     = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lastResult, setResult]     = useState(null);
  const [manual, setManual]         = useState('');
  const scannerRef = useRef(null);
  const html5Ref   = useRef(null);

  useEffect(() => {
    getEvents({ limit: 50 }).then(r => setEvents(r.data.events || [])).catch(()=>{});
    return () => stopScanner();
  }, []);

  const startScanner = async () => {
    if (!selectedEvent) { toast.error('Select an event first'); return; }
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      html5Ref.current = new Html5Qrcode('qr-reader');
      await html5Ref.current.start({ facingMode:'environment' }, { fps:10, qrbox:{width:250,height:250} }, handleScan, ()=>{});
      setScanning(true);
    } catch { toast.error('Camera not available. Use manual entry below.'); }
  };

  const stopScanner = async () => {
    if (html5Ref.current) { try { await html5Ref.current.stop(); } catch {} html5Ref.current = null; }
    setScanning(false);
  };

  const doScan = async (token) => {
    if (processing) return;
    setProcessing(true);
    try {
      const { data } = await scanQR({ qrToken: token, eventId: selectedEvent });
      setResult({ success: true, ...data });
      toast.success(`✅ ${data.student?.name} — Attendance marked!`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid QR';
      setResult({ success: false, message: msg });
      toast.error(msg);
    } finally { setTimeout(() => setProcessing(false), 2000); }
  };

  const handleScan = async (text) => {
    try { const p = JSON.parse(text); await doScan(p.token); }
    catch { await doScan(text); }
  };

  const handleManual = async e => {
    e.preventDefault();
    if (!manual.trim()) return;
    await doScan(manual.trim());
    setManual('');
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="page-header"><h1>QR Scanner</h1><p>Scan student QR codes to mark attendance</p></div>

        <div className="card" style={{ marginBottom: 20 }}>
          <label className="form-label">Select Event</label>
          <select className="form-select" value={selectedEvent} onChange={e => { setSel(e.target.value); stopScanner(); }}>
            <option value="">-- Choose Event --</option>
            {events.filter(ev => ev.status==='upcoming'||ev.status==='ongoing').map(ev=>(
              <option key={ev._id} value={ev._id}>{ev.title} — {new Date(ev.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</option>
            ))}
          </select>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, color: '#8B1A1A', marginBottom: 14 }}>📷 Camera Scanner</h3>
          <div id="qr-reader" ref={scannerRef} style={{ borderRadius: 10, overflow: 'hidden', background: '#000', minHeight: scanning ? 300 : 0 }} />
          {!scanning
            ? <button onClick={startScanner} className="btn btn-primary w-full" style={{ justifyContent:'center', marginTop: 10 }} disabled={!selectedEvent}>Start Camera</button>
            : <button onClick={stopScanner} className="btn btn-danger w-full"  style={{ justifyContent:'center', marginTop: 10 }}>Stop Camera</button>
          }
          {scanning && <p style={{ textAlign:'center', fontSize:13, color:'#6B7280', marginTop:8 }}>{processing ? '⏳ Processing...' : '🔍 Point at student QR code'}</p>}
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, color: '#8B1A1A', marginBottom: 12 }}>⌨️ Manual Token Entry</h3>
          <form onSubmit={handleManual} style={{ display:'flex', gap:10 }}>
            <input className="form-input" style={{ flex:1 }} placeholder="Paste QR token here..." value={manual} onChange={e=>setManual(e.target.value)} />
            <button type="submit" className="btn btn-primary" disabled={!selectedEvent||!manual.trim()||processing}>Submit</button>
          </form>
        </div>

        {lastResult && (
          <div className="card anim-fade-up" style={{ borderLeft:`4px solid ${lastResult.success?'#15803d':'#dc2626'}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <span style={{ fontSize:32 }}>{lastResult.success?'✅':'❌'}</span>
              <div>
                <div style={{ fontSize:16,fontWeight:700,color:lastResult.success?'#15803d':'#dc2626' }}>
                  {lastResult.success ? 'Attendance Marked!' : 'Scan Failed'}
                </div>
                {lastResult.success ? (
                  <>
                    <div style={{ fontSize:15,fontWeight:600,marginTop:4 }}>{lastResult.student?.name}</div>
                    <div style={{ fontSize:13,color:'#6B7280' }}>{lastResult.student?.collegeId} · {lastResult.student?.department}</div>
                    <div style={{ fontSize:12,color:'#9CA3AF',marginTop:4 }}>at {new Date(lastResult.attendedAt).toLocaleTimeString('en-IN')}</div>
                  </>
                ) : <div style={{ fontSize:13,color:'#6B7280',marginTop:4 }}>{lastResult.message}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ScanQR;
