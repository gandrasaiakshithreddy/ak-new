import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const res = login(form.email, form.password);
      if (res.success) navigate('/dashboard');
      else setError(res.error);
      setLoading(false);
    }, 600);
  };

  const demo = () => {
    setForm({ email: 'student@edu.com', password: 'password123' });
  };

  return (
    <div className="auth-shell">
      <div className="auth-bg">
        <div className="bg-blob b1" />
        <div className="bg-blob b2" />
        <div className="grid-lines" />
      </div>

      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon">⬡</span>
          <span className="auth-brand-name">EduVault</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your student portal</p>

        <form onSubmit={submit} className="auth-form">
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label>Email address</label>
            <input name="email" type="email" placeholder="you@university.edu" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
          <button type="button" className="btn-secondary auth-btn" onClick={demo}>
            Use Demo Account
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </div>
      </div>
    </div>
  );
}
