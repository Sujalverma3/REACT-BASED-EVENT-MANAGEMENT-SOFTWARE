import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginAPI } from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handle = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await loginAPI(form);
      loginUser(data.token, data.user);
      toast.success(`Welcome, ${data.user.name.split(' ')[0]}!`);
      navigate(data.user.role === 'student' ? '/events' : '/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="anim-fade-up">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, background: '#8B1A1A', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 auto 14px' }}>GE</div>
          <h1 style={{ fontSize: 26, color: '#8B1A1A' }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Sign in to UniVerse GEU</p>
        </div>
        <div className="card">
          <form onSubmit={handle}>
            <div className="form-group">
              <label className="form-label">GEU Email</label>
              <input className="form-input" type="email" placeholder="name@geu.ac.in" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>
          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280' }}>No account? <Link to="/register" style={{ color: '#8B1A1A', fontWeight: 600 }}>Register here</Link></p>
          <div style={{ marginTop: 16, background: '#fdf8f2', borderRadius: 8, padding: '12px 14px', fontSize: 12, color: '#6B7280', lineHeight: 1.8 }}>
            <strong style={{ color: '#8B1A1A' }}>Demo accounts:</strong><br />
            Student&nbsp;&nbsp;&nbsp;: dhruv@geu.ac.in / student123<br />
            Organizer: sharma@geu.ac.in / organizer123<br />
            Admin&nbsp;&nbsp;&nbsp;&nbsp;: admin@geu.ac.in / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
