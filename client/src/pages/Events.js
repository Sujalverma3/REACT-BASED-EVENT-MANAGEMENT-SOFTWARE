import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getEvents } from '../api';
import toast from 'react-hot-toast';
import { GEU_CLUBS, CLUB_BY_NAME } from '../data/clubs';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ClubBadge({ clubName, compact = false }) {
  const c = CLUB_BY_NAME[clubName];
  if (!c) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: compact ? 10 : 11, fontWeight: 700,
      padding: compact ? '2px 7px' : '3px 10px',
      borderRadius: 20, background: c.logoBg, color: c.accentColor,
      border: `1px solid ${c.accentColor}33`,
    }}>
      {c.logo} {c.shortName}
    </span>
  );
}

export default function Events() {
  const query = useQuery();
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [filters, setFilters] = useState({
    category: query.get('category') || '',
    status: 'upcoming',
    search: '',
    club: query.get('club') || '',
  });

  useEffect(() => {
    setLoading(true);
    getEvents({ category: filters.category, status: filters.status, search: filters.search, limit: 20 })
      .then(r => {
        let evs = r.data.events || [];
        if (filters.club) evs = evs.filter(ev => ev.club === filters.club);
        setEvents(evs);
        setTotal(filters.club ? evs.length : (r.data.total || 0));
      })
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, [filters]);

  const cats = ['', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Fest', 'Club Activity', 'Other'];
  const statuses = [{ v: '', l: 'All' }, { v: 'upcoming', l: 'Upcoming' }, { v: 'ongoing', l: 'Ongoing' }, { v: 'completed', l: 'Completed' }];

  return (
    <div className="page">
      <div className="container">

        {/* Page header */}
        <div style={{ background: 'linear-gradient(120deg,#5c0f0f,#8B1A1A)', borderRadius: 14, padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.05) 1px,transparent 0)', backgroundSize: '24px 24px' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 30, color: '#fff', marginBottom: 6 }}>Campus Events</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{total} events · Graphic Era University, Dehradun</p>
          </div>
        </div>

        {/* Club Quick-Filter Pills */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginRight: 4 }}>Filter by club:</span>
          <button
            onClick={() => setFilters(f => ({ ...f, club: '' }))}
            className="btn btn-sm"
            style={{ background: !filters.club ? '#8B1A1A' : '#fff', color: !filters.club ? '#fff' : '#6B7280', border: '1px solid', borderColor: !filters.club ? '#8B1A1A' : '#E5E0D8', fontWeight: 700 }}
          >All Clubs</button>
          {GEU_CLUBS.map(c => (
            <button
              key={c.id}
              onClick={() => setFilters(f => ({ ...f, club: f.club === c.name ? '' : c.name }))}
              className="btn btn-sm"
              style={{
                background: filters.club === c.name ? c.accentColor : c.logoBg,
                color: filters.club === c.name ? '#fff' : c.accentColor,
                border: `1px solid ${c.accentColor}44`, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >{c.logo} {c.shortName}</button>
          ))}
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 22, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <input className="form-input" style={{ flex: 1, minWidth: 180 }} placeholder="🔍 Search events..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
          <select className="form-select" style={{ width: 160 }} value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
            {cats.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 4 }}>
            {statuses.map(({ v, l }) => (
              <button key={v} onClick={() => setFilters({ ...filters, status: v })} className="btn btn-sm"
                style={{ background: filters.status === v ? '#8B1A1A' : '#fff', color: filters.status === v ? '#fff' : '#6B7280', border: '1px solid', borderColor: filters.status === v ? '#8B1A1A' : '#E5E0D8' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Active club banner */}
        {filters.club && (() => {
          const c = CLUB_BY_NAME[filters.club];
          if (!c) return null;
          return (
            <div style={{ background: c.logoBg, border: `1.5px solid ${c.accentColor}44`, borderRadius: 12, padding: '12px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 28 }}>{c.logo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: c.accentColor }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Mentor: {c.mentor.name} · {c.mentor.designation}</div>
              </div>
              <button onClick={() => setFilters(f => ({ ...f, club: '' }))} className="btn btn-sm" style={{ background: c.accentColor, color: '#fff', border: 'none' }}>✕ Clear</button>
            </div>
          );
        })()}

        {loading ? (
          <div className="loading-center"><div className="spinner spinner-lg" /></div>
        ) : events.length === 0 ? (
          <div className="empty card">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No events found</div>
            <p className="text-muted text-sm">Try different filters</p>
          </div>
        ) : (
          <div className="grid-3">
            {events.map(ev => {
              const clubData = ev.club ? CLUB_BY_NAME[ev.club] : null;
              return (
                <Link key={ev._id} to={`/events/${ev._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="card card-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `3px solid ${clubData ? clubData.accentColor : '#8B1A1A'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                      <span className={`badge badge-${ev.category?.toLowerCase().replace(/ /g, '')}`}>{ev.category}</span>
                      <span className={`badge badge-${ev.status}`}>{ev.status}</span>
                    </div>
                    {ev.club && <div style={{ marginBottom: 8 }}><ClubBadge clubName={ev.club} /></div>}
                    <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, marginBottom: 8, flex: 1 }}>{ev.title}</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.description}</p>
                    <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span>📅 {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {ev.time}</span>
                      <span>📍 {ev.venue}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span>👥 {ev.registeredCount}/{ev.capacity}</span>
                        <span style={{ color: ev.spotsLeft > 0 ? '#15803d' : '#dc2626', fontWeight: 600 }}>{ev.spotsLeft > 0 ? `${ev.spotsLeft} left` : 'Full'}</span>
                      </div>
                    </div>
                    {(ev.organizer || clubData) && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #E5E0D8', fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {clubData ? (
                          <><span style={{ fontSize: 14 }}>{clubData.logo}</span><span>Mentor: <strong style={{ color: '#6B7280' }}>{clubData.mentor.name.split(' ').slice(-1)[0]}</strong></span></>
                        ) : (
                          <span>By {ev.organizer?.name}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
