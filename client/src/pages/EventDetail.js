import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, registerForEvent, checkCertificate, submitFeedback, checkFeedback } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event,       setEvent]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [registering, setRegistering] = useState(false);
  const [qrCode,      setQrCode]      = useState(null);
  const [certInfo,    setCertInfo]    = useState(null);   // ← certificate status
  const [certLoading, setCertLoading] = useState(false);
  const [fbDone,      setFbDone]      = useState(false);
  const [showFb,      setShowFb]      = useState(false);
  const [fb,          setFb]          = useState({ rating: 5, comment: '' });
  const [fbSaving,    setFbSaving]    = useState(false);

  useEffect(() => {
    getEvent(id)
      .then(r => { setEvent(r.data.event); setLoading(false); })
      .catch(() => { toast.error('Event not found'); navigate('/events'); });
  }, [id]);

  // Load cert + feedback status once we have user + event
  useEffect(() => {
    if (!user || !event) return;
    if (user.role === 'student') {
      // Check certificate status
      setCertLoading(true);
      checkCertificate(id)
        .then(r => { setCertInfo(r.data); setCertLoading(false); })
        .catch(() => setCertLoading(false));
      // Check feedback
      checkFeedback(id)
        .then(r => setFbDone(r.data.submitted))
        .catch(() => {});
    }
  }, [user, event]);

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return; }
    setRegistering(true);
    try {
      const { data } = await registerForEvent(id);
      setQrCode(data.qrCode);
      if (data.alreadyRegistered) toast('You were already registered — here is your QR', { icon: 'ℹ️' });
      else { toast.success('Registered! Your QR code is ready.'); setEvent(p => ({ ...p, registeredCount: p.registeredCount + 1 })); }
      // Refresh cert info
      const cr = await checkCertificate(id);
      setCertInfo(cr.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setRegistering(false); }
  };

  const handleFeedback = async e => {
    e.preventDefault(); setFbSaving(true);
    try {
      await submitFeedback(id, fb);
      toast.success('Feedback submitted!');
      setFbDone(true); setShowFb(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit feedback'); }
    finally { setFbSaving(false); }
  };

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg"/></div>;
  if (!event) return null;

  const dateStr  = new Date(event.date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const isFull   = event.registeredCount >= event.capacity;
  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);
  const isStudent = user?.role === 'student';
  const canRegister = isStudent && event.status === 'upcoming' && !isFull;
  const APIBASE  = '';  // proxy handles it

  return (
    <div className="page">
      <div className="container">
        <button onClick={() => navigate('/events')} className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>← Back</button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* ── Left ── */}
          <div>
            {/* Hero card */}
            <div style={{ background: 'linear-gradient(120deg,#5c0f0f,#8B1A1A)', borderRadius: 14, padding: '28px 32px', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <span className={`badge badge-${event.category?.toLowerCase().replace(/ /g,'')}`}>{event.category}</span>
                <span className={`badge badge-${event.status}`}>{event.status}</span>
              </div>
              <h1 style={{ fontFamily:'Playfair Display,serif', fontSize: 32, color: '#fff', marginBottom: 8, lineHeight: 1.15 }}>{event.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>By {event.organizer?.name} · {event.department}</p>
            </div>

            {/* Description */}
            <div className="card" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, color: '#8B1A1A', marginBottom: 12 }}>About this Event</h2>
              <p style={{ fontSize: 14.5, color: '#4B5563', lineHeight: 1.75 }}>{event.description}</p>
              {event.tags?.length > 0 && (
                <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {event.tags.map(t => <span key={t} style={{ fontSize: 12, background: '#fdf0f0', color: '#8B1A1A', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>#{t}</span>)}
                </div>
              )}
            </div>

            {/* Details grid */}
            <div className="card" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, color: '#8B1A1A', marginBottom: 16 }}>Event Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[['📅','Date',dateStr],['⏰','Time',event.time],['📍','Venue',event.venue],['🏷️','Category',event.category],['👥','Capacity',`${event.registeredCount}/${event.capacity}`],['🏛️','Department',event.department]].map(([ic,lb,vl])=>(
                  <div key={lb} style={{ display:'flex', gap:10 }}>
                    <span style={{ fontSize:18,flexShrink:0 }}>{ic}</span>
                    <div>
                      <div style={{ fontSize:10,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:.5,marginBottom:2 }}>{lb}</div>
                      <div style={{ fontSize:13.5,fontWeight:500 }}>{vl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CERTIFICATE STATUS for students ── */}
            {isStudent && (
              <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid #C9963A' }}>
                <h2 style={{ fontSize: 17, color: '#8B1A1A', marginBottom: 14 }}>🏆 Certificate Status</h2>
                {certLoading ? (
                  <div style={{ display:'flex', alignItems:'center', gap:10, color:'#6B7280', fontSize:13 }}>
                    <div className="spinner"/> Checking certificate...
                  </div>
                ) : !certInfo || !certInfo.registered ? (
                  <div style={{ fontSize: 13.5, color: '#6B7280' }}>Register for this event to be eligible for a certificate.</div>
                ) : (
                  <div>
                    {/* Step indicators */}
                    <div style={{ display:'flex', gap:0, marginBottom:18 }}>
                      {[
                        { label:'Registered', done: certInfo.registered },
                        { label:'Attended',   done: certInfo.attended },
                        { label:'Certificate Issued', done: certInfo.hasCertificate },
                      ].map((step, i, arr) => (
                        <React.Fragment key={step.label}>
                          <div style={{ flex:1, textAlign:'center' }}>
                            <div style={{ width:32,height:32,borderRadius:'50%',margin:'0 auto 6px',display:'flex',alignItems:'center',justifyContent:'center',background: step.done ? '#8B1A1A' : '#F3F4F6',color: step.done ? '#fff' : '#9CA3AF',fontWeight:700,fontSize:14 }}>
                              {step.done ? '✓' : i+1}
                            </div>
                            <div style={{ fontSize:11,fontWeight:step.done?700:400,color: step.done?'#8B1A1A':'#9CA3AF' }}>{step.label}</div>
                          </div>
                          {i < arr.length-1 && (
                            <div style={{ flex:0,alignSelf:'flex-start',marginTop:14,width:40,height:2,background: arr[i+1].done ? '#8B1A1A' : '#E5E7EB' }}/>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Status message */}
                    {!certInfo.attended && (
                      <div className="alert alert-info">⏳ Attend the event and get your QR scanned to become eligible for a certificate.</div>
                    )}
                    {certInfo.attended && !certInfo.hasCertificate && (
                      <div className="alert alert-warning">✅ You attended! Certificate will be issued by the organizer after the event ends.</div>
                    )}
                    {certInfo.hasCertificate && certInfo.certificate && (
                      <div>
                        <div className="alert alert-success">🎉 Your certificate has been issued!</div>
                        <div style={{ background:'#fdf8f2',borderRadius:10,padding:'14px 18px',marginTop:10 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                            <div>
                              <div style={{ fontSize:11,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:.5,marginBottom:4 }}>Certificate ID</div>
                              <div style={{ fontFamily:'monospace',fontSize:13,fontWeight:700,color:'#8B1A1A' }}>{certInfo.certificate.certificateId}</div>
                              <div style={{ fontSize:12,color:'#6B7280',marginTop:4 }}>
                                Issued on {new Date(certInfo.certificate.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
                              </div>
                            </div>
                            <div style={{ display:'flex', gap:8 }}>
                              {certInfo.certificate.fileUrl && (
                                <a href={`${APIBASE}${certInfo.certificate.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">⬇ Download PDF</a>
                              )}
                              <Link to={`/verify/${certInfo.certificate.certificateId}`} className="btn btn-outline btn-sm">🔍 Verify</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Feedback */}
            {isStudent && event.status === 'completed' && certInfo?.attended && (
              <div className="card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <h2 style={{ fontSize:17,color:'#8B1A1A' }}>💬 Feedback</h2>
                  {!fbDone && <button onClick={() => setShowFb(!showFb)} className="btn btn-outline btn-sm">{showFb?'Cancel':'Give Feedback'}</button>}
                  {fbDone  && <span className="badge" style={{ background:'#dcfce7',color:'#166534' }}>✅ Submitted</span>}
                </div>
                {showFb && !fbDone && (
                  <form onSubmit={handleFeedback}>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <div style={{ display:'flex', gap:6 }}>
                        {[1,2,3,4,5].map(r=>(
                          <button type="button" key={r} onClick={()=>setFb({...fb,rating:r})}
                            style={{ width:38,height:38,borderRadius:8,border:`2px solid ${fb.rating>=r?'#C9963A':'#E5E0D8'}`,background:fb.rating>=r?'#fdf8ee':'#fff',fontSize:16,cursor:'pointer' }}>⭐</button>
                        ))}
                        <span style={{ alignSelf:'center',fontSize:13,color:'#6B7280',marginLeft:6 }}>{fb.rating}/5</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Comment (optional)</label>
                      <textarea className="form-textarea" value={fb.comment} onChange={e=>setFb({...fb,comment:e.target.value})} placeholder="Share your experience..."/>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={fbSaving}>{fbSaving?'Submitting...':'Submit Feedback'}</button>
                  </form>
                )}
                {fbDone && <p style={{ fontSize:13,color:'#6B7280' }}>Thank you for your feedback!</p>}
              </div>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div style={{ position:'sticky', top:90 }}>

            {/* Registration card */}
            <div className="card" style={{ marginBottom:14,borderTop:'3px solid #8B1A1A' }}>
              <div style={{ textAlign:'center', marginBottom:18 }}>
                <div style={{ fontFamily:'Playfair Display,serif',fontSize:30,fontWeight:700,color:'#8B1A1A' }}>{spotsLeft}</div>
                <div style={{ fontSize:12,color:'#6B7280' }}>spots left of {event.capacity}</div>
                <div style={{ marginTop:8,height:6,background:'#F3F4F6',borderRadius:3,overflow:'hidden' }}>
                  <div style={{ height:'100%',width:`${Math.min(100,(event.registeredCount/event.capacity)*100)}%`,background:isFull?'#dc2626':'#8B1A1A',borderRadius:3 }}/>
                </div>
              </div>

              {!qrCode && !certInfo?.registered ? (
                <>
                  {canRegister && (
                    <button onClick={handleRegister} className="btn btn-primary w-full" style={{ justifyContent:'center',fontSize:15 }} disabled={registering}>
                      {registering ? <><div className="spinner" style={{width:16,height:16}}/> Registering...</> : '🎟️ Register Now'}
                    </button>
                  )}
                  {isStudent && isFull && <div className="alert alert-error" style={{textAlign:'center'}}>❌ Event Full</div>}
                  {isStudent && event.status==='completed' && <div className="alert alert-warning" style={{textAlign:'center'}}>Registration closed</div>}
                  {!user && <button onClick={()=>navigate('/login')} className="btn btn-primary w-full" style={{justifyContent:'center'}}>Login to Register</button>}
                </>
              ) : (
                <div className="alert alert-success" style={{ textAlign:'center' }}>✅ You are registered!</div>
              )}
            </div>

            {/* QR Code */}
            {qrCode && (
              <div className="card" style={{ textAlign:'center',marginBottom:14,borderTop:'3px solid #C9963A' }}>
                <h3 style={{ fontSize:15,color:'#8B1A1A',marginBottom:4 }}>Your QR Code</h3>
                <p style={{ fontSize:12,color:'#6B7280',marginBottom:12 }}>Show at venue for attendance</p>
                <img src={qrCode} alt="QR" style={{ width:'100%',maxWidth:200,borderRadius:8,border:'2px solid #E5E0D8' }}/>
                <p style={{ fontSize:11,color:'#9CA3AF',marginTop:8 }}>Do not share this QR code.</p>
                <button onClick={()=>{ const a=document.createElement('a');a.href=qrCode;a.download=`QR-${event.title}.png`;a.click(); }}
                  className="btn btn-outline btn-sm" style={{ marginTop:10 }}>⬇ Download QR</button>
              </div>
            )}

            {/* Show existing QR if already registered and cert loaded */}
            {!qrCode && certInfo?.registered && !certInfo?.hasCertificate && (
              <div className="card" style={{ textAlign:'center',marginBottom:14 }}>
                <button onClick={handleRegister} className="btn btn-ghost w-full btn-sm" style={{ justifyContent:'center' }} disabled={registering}>
                  {registering?'Loading...':'🔄 Show My QR Code'}
                </button>
              </div>
            )}

            {/* Organizer */}
            {event.organizer && (
              <div className="card">
                <div style={{ fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:.5,marginBottom:10 }}>Organized by</div>
                <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <div style={{ width:36,height:36,borderRadius:'50%',background:'#8B1A1A',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700 }}>{event.organizer.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize:14,fontWeight:600 }}>{event.organizer.name}</div>
                    <div style={{ fontSize:12,color:'#6B7280' }}>{event.organizer.department}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
