import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';
import './StudentDetails.css';

export default function StudentDetails() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: user.phone, address: user.address });
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = () => {
    updateUser({ phone: form.phone, address: form.address });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const info = [
    { label: 'Full Name', value: user.name },
    { label: 'Student ID', value: user.id },
    { label: 'Email', value: user.email },
    { label: 'Date of Birth', value: user.dob },
    { label: 'Department', value: user.dept },
    { label: 'Year of Study', value: `Year ${user.year}` },
    { label: 'Current CGPA', value: user.cgpa || 'N/A' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Student Details</h1>
        <p>Your academic profile and personal information</p>
      </div>

      <div className="grid-2" style={{marginBottom:28}}>
        <div className="card">
          <div className="card-title"><span>◉</span> Personal Information</div>
          <div className="profile-hero">
            <div className="big-avatar">{user.name[0]}</div>
            <div>
              <div style={{fontSize:22,fontFamily:'var(--font-head)',fontWeight:800}}>{user.name}</div>
              <div style={{color:'var(--text2)',marginTop:4}}>{user.dept} • Year {user.year}</div>
              <div style={{marginTop:8}}>
                <span className="badge badge-green">Active Student</span>
              </div>
            </div>
          </div>
          <div className="info-list">
            {info.map(i => (
              <div key={i.label} className="info-row">
                <span className="info-label">{i.label}</span>
                <span className="info-value">{i.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{marginBottom:20}}>
            <div className="card-title"><span>◈</span> Contact Information</div>
            {saved && <div className="success-msg" style={{marginBottom:16}}>✓ Changes saved successfully</div>}
            {editing ? (
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handle} />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea name="address" rows={3} value={form.address} onChange={handle} style={{resize:'none'}} />
                </div>
                <div style={{display:'flex',gap:10}}>
                  <button className="btn-primary" onClick={save}>Save Changes</button>
                  <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="info-row">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{user.phone || '—'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Address</span>
                  <span className="info-value">{user.address || '—'}</span>
                </div>
                <button className="btn-secondary" style={{marginTop:16}} onClick={() => setEditing(true)}>
                  Edit Contact Info
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title"><span>◆</span> Academic Status</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[
                {label:'CGPA',value:user.cgpa||'N/A',badge:'badge-green'},
                {label:'Year',value:`Year ${user.year}`,badge:'badge-blue'},
                {label:'Fee Status',value:user.feesPaid?'Paid':'Pending',badge:user.feesPaid?'badge-green':'badge-red'},
                {label:'Scholarship',value:user.scholarshipApplied?'Applied':'Not Applied',badge:user.scholarshipApplied?'badge-gold':'badge-red'},
              ].map(s => (
                <div key={s.label} style={{background:'var(--bg3)',padding:'14px',borderRadius:'var(--radius-sm)'}}>
                  <div style={{fontSize:11,color:'var(--text3)',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>{s.label}</div>
                  <span className={`badge ${s.badge}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {user.courses && user.courses.length > 0 && (
        <div className="card">
          <div className="card-title"><span>◈</span> Enrolled Courses</div>
          <table>
            <thead>
              <tr><th>Code</th><th>Course Name</th><th>Credits</th><th>Grade</th><th>Points</th></tr>
            </thead>
            <tbody>
              {user.courses.map(c => {
                const pts = {A:10,'A+':10,'A-':9,'B+':8,'B':7,'B-':6,'C':5,'D':4,'F':0}[c.grade]||0;
                return (
                  <tr key={c.code}>
                    <td><span className="badge badge-blue">{c.code}</span></td>
                    <td style={{color:'var(--text)'}}>{c.name}</td>
                    <td>{c.credits}</td>
                    <td style={{fontWeight:700,color:'var(--accent)'}}>{c.grade}</td>
                    <td>{pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
