import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = p => pathname === p || pathname.startsWith(p + '/');

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/login'); };

  const linkStyle = p => ({
    fontSize: 13, fontWeight: active(p) ? 700 : 500,
    color: active(p) ? '#8B1A1A' : '#4B5563',
    padding: '6px 11px', borderRadius: 6, textDecoration: 'none',
    background: active(p) ? 'rgba(139,26,26,0.07)' : 'transparent',
  });

  return (
    <>
      {/* Top bar */}
      <div style={{ background: '#5c0f0f', padding: '5px 28px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
        <span>🎓 Graphic Era (Deemed to be University) · Dehradun · <span style={{ color: '#e8b84b', fontWeight: 700 }}>NAAC A+</span></span>
        <div style={{ display: 'flex', gap: 14 }}>
          {[['ERP','https://student.geu.ac.in'],['Alumni','https://geu.almaconnect.com'],['geu.ac.in','https://geu.ac.in']].map(([l,h])=>(
            <a key={l} href={h} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ background: '#fff', borderBottom: '3px solid #8B1A1A', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: '#8B1A1A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display,serif', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>GE</div>
            <div>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, fontWeight: 700, color: '#8B1A1A', lineHeight: 1.1 }}>Uni<span style={{ color: '#C9963A' }}>Verse</span></div>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>GEU Campus Portal</div>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link to="/events" style={linkStyle('/events')}>Events</Link>
            <Link to="/clubs"  style={linkStyle('/clubs')}>Clubs</Link>
            {user && <Link to="/profile" style={linkStyle('/profile')}>My Profile</Link>}
            {user && <Link to="/certificates" style={linkStyle('/certificates')}>Certificates</Link>}
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <>
                <Link to="/dashboard"    style={linkStyle('/dashboard')}>Dashboard</Link>
                <Link to="/scan"         style={linkStyle('/scan')}>📷 Scan QR</Link>
                <Link to="/create-event" style={linkStyle('/create-event')}>+ Event</Link>
                <Link to="/analytics"    style={linkStyle('/analytics')}>Analytics</Link>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ fontSize: 13, color: '#6B7280' }}>
                  <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{user.name.split(' ')[0]}</span>
                  <span style={{ marginLeft: 6, fontSize: 10, background: '#fdf0f0', color: '#8B1A1A', padding: '2px 8px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase' }}>{user.role}</span>
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
