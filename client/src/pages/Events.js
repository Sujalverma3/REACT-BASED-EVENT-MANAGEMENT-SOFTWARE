import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api';
import toast from 'react-hot-toast';

export default function Events() {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [filters, setFilters] = useState({ category: '', status: 'upcoming', search: '' });

  useEffect(() => {
    setLoading(true);
    getEvents({ ...filters, limit: 20 })
      .then(r => { setEvents(r.data.events || []); setTotal(r.data.total || 0); })
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, [filters]);

  const cats = ['','Technical','Cultural','Sports','Workshop','Seminar','Fest','Club Activity','Other'];
  const statuses = [{ v:'', l:'All' },{ v:'upcoming', l:'Upcoming' },{ v:'ongoing', l:'Ongoing' },{ v:'completed', l:'Completed' }];

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

        {loading ? (
          <div className="loading-center"><div className="spinner spinner-lg" /></div>
        ) : events.length === 0 ? (
          <div className="empty card"><div className="empty-icon">📭</div><div className="empty-title">No events found</div><p className="text-muted text-sm">Try different filters</p></div>
        ) : (
          <div className="grid-3">
            {events.map(ev => (
              <Link key={ev._id} to={`/events/${ev._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="card card-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: '3px solid #8B1A1A' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span className={`badge badge-${ev.category?.toLowerCase().replace(/ /g,'')}`}>{ev.category}</span>
                    <span className={`badge badge-${ev.status}`}>{ev.status}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, marginBottom: 8, flex: 1 }}>{ev.title}</h3>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.description}</p>
                  <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span>📅 {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {ev.time}</span>
                    <span>📍 {ev.venue}</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span>👥 {ev.registeredCount}/{ev.capacity}</span>
                      <span style={{ color: ev.spotsLeft > 0 ? '#15803d' : '#dc2626', fontWeight: 600 }}>
                        {ev.spotsLeft > 0 ? `${ev.spotsLeft} left` : 'Full'}
                      </span>
                    </div>
                  </div>
                  {ev.organizer && <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #E5E0D8', fontSize: 11, color: '#9CA3AF' }}>By {ev.organizer.name}</div>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
