import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api';
import { GEU_CLUBS } from '../data/clubs';

export default function Home() {
  const [events, setEvents] = useState([]);
  useEffect(() => { getEvents({ status: 'upcoming', limit: 3 }).then(r => setEvents(r.data.events || [])).catch(() => {}); }, []);

  return (
    <div>
      {/* Ticker */}
      <div style={{ background: '#8B1A1A', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
        <span style={{ background: '#C9963A', color: '#5c0f0f', fontSize: 10, fontWeight: 800, padding: '2px 10px', borderRadius: 4, flexShrink: 0, textTransform: 'uppercase' }}>Live</span>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'ticker 22s linear infinite', fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
            {['📅 GEU Hackathon 2025 — Registration Open', '🏆 AI Workshop certificates issued', '🔐 QR gate entry live for GRAFEST 2025', '📊 Zero fake entries — QR guard active'].map((t, i) => (
              <span key={i}>{t} &nbsp;|&nbsp;</span>
            ))}
            {['📅 GEU Hackathon 2025 — Registration Open', '🏆 AI Workshop certificates issued', '🔐 QR gate entry live for GRAFEST 2025', '📊 Zero fake entries — QR guard active'].map((t, i) => (
              <span key={i + 10}>{t} &nbsp;|&nbsp;</span>
            ))}
          </div>
        </div>
        <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(120deg,#5c0f0f,#8B1A1A,#a82626)', padding: '68px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.06) 1px,transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 56, position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(201,150,58,0.2)', border: '1px solid rgba(201,150,58,0.4)', borderRadius: 20, padding: '5px 14px', marginBottom: 20, fontSize: 11, fontWeight: 600, color: '#e8b84b', letterSpacing: 1, textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8b84b', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              GEU · FS-VI-T154 · ByteForge
            </div>
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 48, color: '#fff', lineHeight: 1.08, letterSpacing: -1.5, marginBottom: 16 }}>
              The Campus<br /><em style={{ fontStyle: 'normal', color: '#e8b84b' }}>Operating System</em><br />for GEU
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, maxWidth: 460, marginBottom: 28 }}>
              Events · QR Attendance · Auto Certificates · Fest Access — built natively for Graphic Era University.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/events"   className="btn btn-gold btn-lg">Browse Events</Link>
              <Link to="/register" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}>Join UniVerse</Link>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
            {[['🎓','12K+','GEU students'],['✅','100%','Auto certificates'],['🔐','0','Fake entries'],['🏛️','NAAC A+','Accredited']].map(([ic,val,label],i)=>(
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, minWidth: 190 }}>
                <span style={{ fontSize: 20 }}>{ic}</span>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}`}</style>
      </div>

      {/* Features
      <section style={{ background: '#fff', padding: '60px 0' }}>
        <div className="container">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8B1A1A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 20, height: 2, background: '#C9963A' }} />What it does
          </div>
          <h2 style={{ fontSize: 30, marginBottom: 8 }}>Six modules. One GEU portal.</h2>
          <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 36, maxWidth: 500 }}>Every step of the campus event lifecycle managed in one system.</p>
          <div className="grid-3">
            {[
              { icon: '📅', title: 'Event Management',    desc: 'Clubs and faculty publish events. Students browse and enroll in real time.', tag: 'React + Express', bg: '#fdf0f0' },
              { icon: '🎟️', title: 'Smart Registration',  desc: 'College-credential enrollment. Unique encrypted QR generated per registration.', tag: 'JWT + MongoDB', bg: '#fdf8ee' },
              { icon: '✅', title: 'QR Attendance',       desc: 'Organizer scans QR — MongoDB validates, marks attendance, prevents duplicates.', tag: 'qrcode + MongoDB', bg: '#edf7f0' },
              { icon: '🏆', title: 'Auto Certificates',   desc: 'Attendance-triggered PDF certificates emailed to every present student.', tag: 'PDFKit + Nodemailer', bg: '#f0eeff' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Live charts of registrations, attendance rates, and feedback for organizers.', tag: 'MongoDB Aggregation', bg: '#edf4ff' },
              { icon: '🔐', title: 'GRAFEST Access',      desc: 'QR-based gate verification during large fests. Flags unauthorized access.', tag: 'Entry Logs', bg: '#edfaf9' },
            ].map(({ icon, title, desc, tag, bg }) => (
              <div key={title} className="card card-hover" style={{ borderTop: '3px solid transparent' }}
                onMouseEnter={e => e.currentTarget.style.borderTopColor = '#8B1A1A'}
                onMouseLeave={e => e.currentTarget.style.borderTopColor = 'transparent'}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
                <span style={{ display: 'inline-block', marginTop: 10, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: '#fdf0f0', color: '#8B1A1A' }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Upcoming events */}
      {events.length > 0 && (
        <section style={{ background: '#FBF7F2', padding: '60px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
              <h2 style={{ fontSize: 28 }}>Upcoming Events</h2>
              <Link to="/events" className="btn btn-outline">View All →</Link>
            </div>
            <div className="grid-3">
              {events.map(ev => (
                <Link key={ev._id} to={`/events/${ev._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card card-hover" style={{ height: '100%', borderTop: '3px solid #8B1A1A' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span className={`badge badge-${ev.category?.toLowerCase().replace(/ /g,'')}`}>{ev.category}</span>
                      <span className={`badge badge-${ev.status}`}>{ev.status}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, marginBottom: 8 }}>{ev.title}</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.description}</p>
                    <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span>📅 {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {ev.time}</span>
                      <span>📍 {ev.venue}</span>
                      <span style={{ color: ev.spotsLeft > 0 ? '#15803d' : '#dc2626', fontWeight: 600 }}>{ev.spotsLeft > 0 ? `${ev.spotsLeft} spots left` : 'Full'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Clubs Section */}
      <section style={{ background: '#fff', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8B1A1A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 20, height: 2, background: '#C9963A' }} />Campus Clubs
              </div>
              <h2 style={{ fontSize: 28, marginBottom: 4 }}>4 Active Student Clubs</h2>
              <p style={{ color: '#6B7280', fontSize: 13 }}>Powered by passionate students & expert faculty mentors</p>
            </div>
            <Link to="/clubs" className="btn btn-outline">All Clubs →</Link>
          </div>

          <div className="grid-2" style={{ gap: 18 }}>
            {GEU_CLUBS.map(c => (
              <Link key={c.id} to={`/events?club=${encodeURIComponent(c.name)}`} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ display: 'flex', gap: 16, alignItems: 'center', borderLeft: `4px solid ${c.accentColor}`, padding: '16px 18px' }}>
                  {/* Logo */}
                  <div style={{ width: 54, height: 54, borderRadius: 12, background: c.logoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                    {c.logo}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{c.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, background: c.logoBg, color: c.accentColor, padding: '1px 7px', borderRadius: 20 }}>{c.category}</span>
                    </div>
                    <div style={{ fontSize: 11, color: c.accentColor, fontWeight: 600, fontStyle: 'italic', marginBottom: 4 }}>"{c.tagline}"</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: c.accentColor, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                        {c.mentor.name.split(' ').pop().charAt(0)}
                      </span>
                      Mentor: {c.mentor.name} · {c.members}+ members
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: c.accentColor, fontWeight: 700, flexShrink: 0 }}>
                    {c.eventsOrganized}+ events →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#8B1A1A', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 34, color: '#fff', marginBottom: 12 }}>Ready to join UniVerse?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>Register with your GEU credentials and start exploring campus events.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-gold btn-lg">Get Started</Link>
            <Link to="/events"   className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}>Browse Events</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
