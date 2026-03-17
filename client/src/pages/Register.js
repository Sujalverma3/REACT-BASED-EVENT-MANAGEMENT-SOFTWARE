import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerAPI } from '../api';
import toast from 'react-hot-toast';

const DEPTS = ['Computer Science and Engineering','Electronics and Communication Engineering','Mechanical Engineering','Civil Engineering','Electrical Engineering','Aerospace Engineering','Biotechnology','Management','Computer Application','Humanities and Social Science','Commerce','Law','Design','Nursing'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', collegeId: '', department: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handle = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await registerAPI(form);
      loginUser(data.token, data.user);
      toast.success('Account created!');
      navigate('/events');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const f = k => ({ value: form[k], onChange: e => setForm({ ...form, [k]: e.target.value }) });

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }} className="anim-fade-up">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, background: '#8B1A1A', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 auto 14px' }}>GE</div>
          <h1 style={{ fontSize: 26, color: '#8B1A1A' }}>Join UniVerse</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Create your GEU student account</p>
        </div>
        <div className="card">
          <form onSubmit={handle}>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Dhruv Rawat" required {...f('name')} /></div>
              <div className="form-group"><label className="form-label">College ID *</label><input className="form-input" placeholder="230211487" required {...f('collegeId')} /></div>
            </div>
            <div className="form-group"><label className="form-label">GEU Email *</label><input className="form-input" type="email" placeholder="name@geu.ac.in" required {...f('email')} /></div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select className="form-select" required {...f('department')}>
                <option value="">Select Department</option>
                {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Password *</label><input className="form-input" type="password" placeholder="Min 6 chars" minLength={6} required {...f('password')} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" placeholder="9876543210" {...f('phone')} /></div>
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Creating...</> : 'Create Account'}
            </button>
          </form>
          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280' }}>Already registered? <Link to="/login" style={{ color: '#8B1A1A', fontWeight: 600 }}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
