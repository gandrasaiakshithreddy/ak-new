import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const DEPTS = ['Computer Science','Information Technology','Electronics','Mechanical','Civil','Electrical','Mathematics','Physics','Chemistry','MBA'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:'', email:'', password:'', confirmPassword:'',
    dept:'Computer Science', year:'1', dob:'', phone:'', address:''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    setTimeout(() => {
      const res = register(form);
      if (res.success) navigate('/dashboard');
      else setError(res.error);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="auth-shell">
      <div className="auth-bg">
        <div className="bg-blob b1" />
        <div className="bg-blob b2" />
        <div className="grid-lines" />
      </div>

      <div className="auth-card" style={{width: 560}}>
        <div className="auth-brand">
          <span className="auth-brand-icon">⬡</span>
          <span className="auth-brand-name">EduVault</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join the student management portal</p>

        <form onSubmit={submit} className="auth-form">
          {error && <div className="error-msg">{error}</div>}

          <div className="reg-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" placeholder="John Smith" value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" placeholder="you@university.edu" value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" placeholder="Min 6 chars" value={form.password} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select name="dept" value={form.dept} onChange={handle}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Year of Study</label>
              <select name="year" value={form.year} onChange={handle}>
                {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input name="dob" type="date" value={form.dob} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" placeholder="10-digit number" value={form.phone} onChange={handle} required />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" rows={2} placeholder="Full address" value={form.address} onChange={handle} required style={{resize:'none'}} />
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Register →'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
