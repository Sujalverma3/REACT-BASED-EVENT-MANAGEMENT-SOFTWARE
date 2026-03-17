import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: '#1a0505', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 36, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, background: '#8B1A1A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display,serif', fontSize: 14, fontWeight: 800, color: '#fff' }}>GE</div>
              <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, fontWeight: 700, color: '#fff' }}>Uni<span style={{ color: '#C9963A' }}>Verse</span></span>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 270 }}>
              Campus Event & Access Management System for Graphic Era University, Dehradun. Team ByteForge · FS-VI-T154.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>System</div>
            {['Events','My Certificates','QR Scanner','Dashboard','Analytics'].map(l=>(
              <div key={l} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', marginBottom: 7 }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>GEU Links</div>
            {[['geu.ac.in','https://geu.ac.in'],['Student Area','https://student.geu.ac.in'],['Alumni','https://geu.almaconnect.com'],['Library','https://geu.knimbus.com']].map(([l,h])=>(
              <a key={l} href={h} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: 12.5, color: 'rgba(255,255,255,0.4)', marginBottom: 7, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>ByteForge</div>
            {['Dhruv Rawat (Lead)','Ayush Gupta','Sujal Verma','Sachin Rawat'].map(m=>(
              <div key={m} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', marginBottom: 7 }}>{m}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 18, fontSize: 11.5, color: 'rgba(255,255,255,0.3)' }}>
          <span>Graphic Era (Deemed to be University) © 2026 · NAAC A+</span>
          <div style={{ display: 'flex', gap: 14 }}>
            {[['Privacy Policy','https://geu.ac.in/privacy-policy/'],['Disclaimer','https://geu.ac.in/disclaimer/'],['Terms','https://geu.ac.in/terms-conditions/']].map(([l,h])=>(
              <a key={l} href={h} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
