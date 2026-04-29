import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api';
import toast from 'react-hot-toast';
import { GEU_CLUBS } from '../data/clubs';

const DEPTS = ['All Departments','Computer Science and Engineering','Electronics and Communication Engineering','Mechanical Engineering','Civil Engineering','Electrical Engineering','Aerospace Engineering','Biotechnology','Management','Computer Application','Law','Design'];
const CATS  = ['Technical','Cultural','Sports','Workshop','Seminar','Fest','Club Activity','Other'];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', date:'', time:'10:00', venue:'', capacity:100, category:'Technical', department:'All Departments', tags:'' });
  const [loading, setLoading] = useState(false);

  const handle = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await createEvent({ ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) });
      toast.success('Event created!');
      navigate(`/events/${data.event._id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const f = k => ({ value: form[k], onChange: e => setForm({...form, [k]: e.target.value}) });

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="page-header"><h1>Create New Event</h1><p>Publish an event for GEU students</p></div>
        <div className="card">
          <form onSubmit={handle}>
            <div className="form-group"><label className="form-label">Event Title *</label><input className="form-input" placeholder="e.g. GEU Hackathon 2025" required {...f('title')} /></div>
            <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" style={{ minHeight:110 }} placeholder="Describe the event..." required {...f('description')} /></div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Date *</label><input className="form-input" type="date" required {...f('date')} /></div>
              <div className="form-group"><label className="form-label">Time *</label><input className="form-input" type="time" required {...f('time')} /></div>
            </div>
            <div className="form-group"><label className="form-label">Venue *</label><input className="form-input" placeholder="e.g. CS Block, Lab 301" required {...f('venue')} /></div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Category *</label>
                <select className="form-select" required {...f('category')}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
              </div>
              <div className="form-group"><label className="form-label">Capacity *</label><input className="form-input" type="number" min="1" required {...f('capacity')} /></div>
            </div>
            <div className="form-group"><label className="form-label">Department</label>
              <select className="form-select" {...f('department')}>{DEPTS.map(d=><option key={d}>{d}</option>)}</select>
            </div>
            <div className="form-group"><label className="form-label">Club (optional)</label>
              <select className="form-select" {...f('club')}>
                <option value="">No club</option>
                {GEU_CLUBS.map(club => (
                  <option key={club.id} value={club.name}>{club.name} {club.logo}</option>
                ))}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Tags (comma-separated)</label><input className="form-input" placeholder="hackathon, coding, AI" {...f('tags')} /></div>
            <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent:'center' }} disabled={loading}>
              {loading ? 'Creating...' : '📅 Publish Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
