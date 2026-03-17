import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { verifyCert } from '../api';

export default function VerifyCert() {
  const { certId } = useParams();
  const [cert, setCert]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    verifyCert(certId)
      .then(r => { setCert(r.data.cert); setLoading(false); })
      .catch(() => { setError('Certificate not found or invalid ID.'); setLoading(false); });
  }, [certId]);

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg"/></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 540 }}>
        <div className="card" style={{ borderTop: `3px solid ${error?'#dc2626':'#15803d'}` }}>
          {error ? (
            <div style={{ textAlign:'center',padding:'24px 0' }}>
              <div style={{ fontSize:48,marginBottom:14 }}>❌</div>
              <h2 style={{ fontSize:22,color:'#dc2626',marginBottom:8 }}>Invalid Certificate</h2>
              <p style={{ color:'#6B7280' }}>{error}</p>
            </div>
          ) : cert ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:48,marginBottom:14 }}>✅</div>
              <h2 style={{ fontSize:22,color:'#15803d',marginBottom:4 }}>Certificate Verified</h2>
              <p style={{ fontSize:13,color:'#6B7280',marginBottom:22 }}>This certificate is authentic and issued by GEU UniVerse</p>
              <div style={{ background:'#fdf8f2',borderRadius:10,padding:'20px 24px',textAlign:'left',marginBottom:16 }}>
                {[
                  ['🎓','Student',cert.user?.name],
                  ['🆔','College ID',cert.user?.collegeId],
                  ['🏛️','Department',cert.user?.department],
                  ['📅','Event',cert.event?.title],
                  ['📍','Venue',cert.event?.venue],
                  ['🗓️','Event Date',cert.event?.date?new Date(cert.event.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):'—'],
                  ['🔖','Certificate ID',cert.certificateId],
                  ['📆','Issued On',new Date(cert.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})],
                ].map(([ic,lb,vl])=>(
                  <div key={lb} style={{ display:'flex',gap:10,padding:'8px 0',borderBottom:'1px solid #E5E0D8' }}>
                    <span style={{flexShrink:0}}>{ic}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:.5}}>{lb}</div>
                      <div style={{fontSize:14,fontWeight:600}}>{vl}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:12,color:'#9CA3AF' }}>Issued by Graphic Era (Deemed to be University) · NAAC A+ · Dehradun</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
