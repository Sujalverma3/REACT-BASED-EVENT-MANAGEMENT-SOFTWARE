import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GEU_CLUBS } from '../data/clubs';

export default function Clubs() {
  const [selected, setSelected] = useState(null);
  const club = selected ? GEU_CLUBS.find(c => c.id === selected) : null;

  return (
    <div className="page">
      <div className="container">

        {/* Page Header */}
        <div style={{ background: 'linear-gradient(120deg,#5c0f0f,#8B1A1A)', borderRadius: 14, padding: '32px 36px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.05) 1px,transparent 0)', backgroundSize: '24px 24px' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(201,150,58,0.2)', border: '1px solid rgba(201,150,58,0.4)', borderRadius: 20, padding: '4px 14px', marginBottom: 14, fontSize: 11, fontWeight: 600, color: '#e8b84b', textTransform: 'uppercase', letterSpacing: 1 }}>
              🏛️ GEU Campus Clubs
            </div>
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 32, color: '#fff', marginBottom: 8 }}>Student Clubs</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
              {GEU_CLUBS.length} active clubs · Graphic Era University, Dehradun
            </p>
          </div>
        </div>

        {/* Club Cards Grid */}
        <div className="grid-2" style={{ gap: 22, marginBottom: 36 }}>
          {GEU_CLUBS.map(c => (
            <div
              key={c.id}
              className="card card-hover"
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              style={{
                cursor: 'pointer',
                border: selected === c.id ? `2px solid ${c.accentColor}` : '1.5px solid #E5E0D8',
                borderRadius: 14,
                transition: 'all 0.2s',
                overflow: 'hidden',
              }}
            >
              {/* Club colour strip */}
              <div style={{ height: 4, background: c.accentColor, margin: '-20px -20px 18px -20px' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* Logo */}
                <div style={{ width: 64, height: 64, borderRadius: 14, background: c.logoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0, border: `2px solid ${c.accentColor}22` }}>
                  {c.logo}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: '#1a1a1a', margin: 0 }}>{c.name}</h2>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: c.logoBg, color: c.accentColor, textTransform: 'uppercase', letterSpacing: .5 }}>{c.category}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: c.accentColor, marginBottom: 6, fontStyle: 'italic' }}>"{c.tagline}"</div>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</p>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 0, marginTop: 16, paddingTop: 14, borderTop: '1px solid #F3F0EB' }}>
                {[
                  ['👥', c.members + '+', 'Members'],
                  ['📅', c.eventsOrganized + '+', 'Events'],
                  ['🎓', c.founded, 'Founded'],
                ].map(([ic, val, lbl]) => (
                  <div key={lbl} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11 }}>{ic}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: c.accentColor }}>{val}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{lbl}</div>
                  </div>
                ))}
              </div>

              {/* Expand hint */}
              <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: c.accentColor, fontWeight: 600 }}>
                {selected === c.id ? '▲ Less info' : '▼ More info'}
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Club Detail Panel */}
        {club && (
          <div style={{
            background: '#fff',
            border: `2px solid ${club.accentColor}`,
            borderRadius: 16,
            padding: '28px 32px',
            marginBottom: 32,
            animation: 'fadeIn .2s ease',
          }}>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>

              {/* Left — full description + tags */}
              <div style={{ flex: 2, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 16, background: club.logoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, border: `2px solid ${club.accentColor}44` }}>
                    {club.logo}
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, color: '#1a1a1a', margin: '0 0 4px' }}>{club.name}</h2>
                    <div style={{ fontSize: 13, fontStyle: 'italic', color: club.accentColor, fontWeight: 600 }}>"{club.tagline}"</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 14 }}>{club.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {club.tags.map(t => (
                    <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: club.logoBg, color: club.accentColor }}>#{t}</span>
                  ))}
                </div>
              </div>

              {/* Right — mentor card */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ background: '#FAFAF9', border: '1px solid #E5E0D8', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Club Mentor</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: club.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20 }}>
                      {club.mentor.name.split(' ').pop().charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{club.mentor.name}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{club.mentor.designation}</div>
                    </div>
                  </div>
                  <a href={`mailto:${club.mentor.email}`} style={{ fontSize: 12, color: club.accentColor, fontWeight: 600, textDecoration: 'none' }}>
                    ✉️ {club.mentor.email}
                  </a>
                </div>

                {/* CTA */}
                <Link
                  to={`/events?club=${encodeURIComponent(club.name)}`}
                  className="btn w-full"
                  style={{ marginTop: 14, background: club.accentColor, color: '#fff', justifyContent: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  View {club.shortName} Events →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ background: 'linear-gradient(120deg,#5c0f0f,#8B1A1A)', borderRadius: 14, padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, color: '#fff', marginBottom: 8 }}>Want to join a club?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 20 }}>Register for any club event to get started. Certificates included!</p>
          <Link to="/events?category=Club+Activity" className="btn btn-gold btn-lg">Browse Club Events</Link>
        </div>

      </div>
    </div>
  );
}
