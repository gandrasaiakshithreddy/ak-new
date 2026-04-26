import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';
import './Scholarship.css';

const SCHOLARSHIPS = [
  { id: 'merit', name: 'Merit Excellence Award', amount: '₹50,000', cgpa: 8.5, desc: 'Awarded to top-performing students with CGPA ≥ 8.5', deadline: 'May 30, 2025', seats: 20, color: 'var(--gold)' },
  { id: 'need', name: 'Financial Need Bursary', amount: '₹30,000', cgpa: 6.0, desc: 'For students demonstrating financial need with CGPA ≥ 6.0', deadline: 'May 30, 2025', seats: 50, color: 'var(--blue)' },
  { id: 'sports', name: 'Sports Achievement Grant', amount: '₹25,000', cgpa: 5.0, desc: 'For students representing college/state in sports events', deadline: 'June 10, 2025', seats: 15, color: 'var(--accent)' },
  { id: 'research', name: 'Research & Innovation Fund', amount: '₹75,000', cgpa: 9.0, desc: 'For students engaged in research projects or publications', deadline: 'June 1, 2025', seats: 10, color: 'var(--purple)' },
];

export default function Scholarship() {
  const { user, updateUser } = useAuth();
  const [applying, setApplying] = useState(null);
  const [form, setForm] = useState({ reason: '', income: '', achievement: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!user) return null;

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submitApp = () => {
    if (!form.reason) return;
    updateUser({ scholarshipApplied: true });
    setApplying(null);
    setSubmitted(true);
    setForm({ reason: '', income: '', achievement: '' });
  };

  const eligible = (s) => user.cgpa >= s.cgpa;

  return (
    <div>
      <div className="page-header">
        <h1>Scholarship Portal</h1>
        <p>Explore and apply for available scholarships</p>
      </div>

      {submitted && (
        <div className="success-msg" style={{marginBottom:24,fontSize:14}}>
          ✦ Your scholarship application has been submitted successfully! You'll receive a response by June 1, 2025.
        </div>
      )}

      {user.scholarshipApplied && (
        <div className="card" style={{marginBottom:28,display:'flex',alignItems:'center',gap:16}}>
          <span style={{fontSize:36}}>✦</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:18}}>Application Under Review</div>
            <div style={{color:'var(--text2)',marginTop:4}}>Your scholarship application is being reviewed by the committee. Expected decision: June 1, 2025.</div>
          </div>
          <span className="badge badge-gold">Pending Review</span>
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {SCHOLARSHIPS.map(s => {
          const isEligible = eligible(s);
          return (
            <div key={s.id} className="card schol-card" style={{borderColor: isEligible ? '#ffffff18':'var(--border)'}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:20}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                    <span style={{fontFamily:'var(--font-head)',fontWeight:800,fontSize:18,color: isEligible ? s.color : 'var(--text2)'}}>{s.name}</span>
                    {!isEligible && <span className="badge badge-red">Not Eligible</span>}
                    {isEligible && <span className="badge badge-green">Eligible</span>}
                  </div>
                  <p style={{color:'var(--text2)',fontSize:13,marginBottom:12}}>{s.desc}</p>
                  <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                    <div><span style={{fontSize:11,color:'var(--text3)',textTransform:'uppercase'}}>Amount</span><br/><strong style={{color:s.color}}>{s.amount}</strong></div>
                    <div><span style={{fontSize:11,color:'var(--text3)',textTransform:'uppercase'}}>Min CGPA</span><br/><strong>{s.cgpa}</strong></div>
                    <div><span style={{fontSize:11,color:'var(--text3)',textTransform:'uppercase'}}>Deadline</span><br/><strong>{s.deadline}</strong></div>
                    <div><span style={{fontSize:11,color:'var(--text3)',textTransform:'uppercase'}}>Seats</span><br/><strong>{s.seats}</strong></div>
                  </div>
                </div>
                <button
                  className={isEligible && !user.scholarshipApplied ? 'btn-gold' : 'btn-secondary'}
                  style={{whiteSpace:'nowrap',minWidth:120}}
                  disabled={!isEligible || user.scholarshipApplied}
                  onClick={() => setApplying(s)}
                >
                  {user.scholarshipApplied ? 'Applied' : isEligible ? 'Apply Now' : 'Not Eligible'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {applying && (
        <div className="modal-overlay" onClick={() => setApplying(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{fontFamily:'var(--font-head)',fontWeight:800,fontSize:20,marginBottom:4}}>Apply: {applying.name}</div>
            <div style={{color:'var(--text2)',fontSize:13,marginBottom:24}}>Fill out the application form below</div>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div className="form-group">
                <label>Reason for applying *</label>
                <textarea name="reason" rows={3} placeholder="Explain why you deserve this scholarship..." value={form.reason} onChange={handle} style={{resize:'none'}} />
              </div>
              <div className="form-group">
                <label>Annual Family Income</label>
                <input name="income" placeholder="e.g., ₹4,50,000" value={form.income} onChange={handle} />
              </div>
              <div className="form-group">
                <label>Achievements / Extra-curriculars</label>
                <textarea name="achievement" rows={2} placeholder="List any relevant achievements..." value={form.achievement} onChange={handle} style={{resize:'none'}} />
              </div>
              <div style={{display:'flex',gap:10,marginTop:4}}>
                <button className="btn-gold" onClick={submitApp} disabled={!form.reason}>Submit Application</button>
                <button className="btn-secondary" onClick={() => setApplying(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
