import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';
import './Dashboard.css';

const QUICK_LINKS = [
  { to: '/student-details', icon: '◉', label: 'View Profile', color: 'var(--blue)', desc: 'Check your academic details' },
  { to: '/scholarship', icon: '✦', label: 'Scholarship', color: 'var(--gold)', desc: 'Apply for financial aid' },
  { to: '/payment', icon: '⬡', label: 'Fee Payment', color: 'var(--accent)', desc: 'Pay tuition & dues' },
  { to: '/cgpa-calculator', icon: '◆', label: 'CGPA Calc', color: 'var(--purple)', desc: 'Calculate your GPA' },
];

const GRADE_COLOR = { 'A+':'#6ee7b7','A':'#6ee7b7','A-':'#86efac','B+':'#60a5fa','B':'#60a5fa','B-':'#93c5fd','C':'#fbbf24','D':'#f97316','F':'#f87171' };

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const announcements = [
    { type: 'gold', icon: '✦', text: 'Scholarship applications open until May 30, 2025' },
    { type: 'blue', icon: '◈', text: 'End-semester exams scheduled from June 10–25, 2025' },
    { type: 'green', icon: '◉', text: 'Semester fee payment deadline: May 15, 2025' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Good morning, {user.name.split(' ')[0]} 👋</h1>
        <p>Here's what's happening with your academics today</p>
      </div>

      <div className="grid-4" style={{marginBottom: 28}}>
        <div className="stat-card">
          <div className="stat-label">Student ID</div>
          <div className="stat-value" style={{fontSize:20, color:'var(--accent)'}}>{user.id}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Current CGPA</div>
          <div className="stat-value" style={{color:'var(--accent)'}}>{user.cgpa || '—'}</div>
          <div className="stat-sub">Out of 10.0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Department</div>
          <div className="stat-value" style={{fontSize:18}}>{user.dept}</div>
          <div className="stat-sub">Year {user.year}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Fee Status</div>
          <div className="stat-value" style={{fontSize:20}}>
            <span className={`badge ${user.feesPaid ? 'badge-green' : 'badge-red'}`}>
              {user.feesPaid ? '✓ Paid' : '✗ Pending'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{marginBottom:28}}>
        <div>
          <div className="dash-section-title">Quick Access</div>
          <div className="quick-grid">
            {QUICK_LINKS.map(q => (
              <Link to={q.to} key={q.to} className="quick-card">
                <div className="quick-icon" style={{color: q.color}}>{q.icon}</div>
                <div className="quick-label">{q.label}</div>
                <div className="quick-desc">{q.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="dash-section-title">Announcements</div>
          <div className="card" style={{display:'flex',flexDirection:'column',gap:12}}>
            {announcements.map((a,i) => (
              <div key={i} className={`announce badge-${a.type === 'gold' ? 'gold' : a.type === 'blue' ? 'blue' : 'green'}`} style={{borderRadius:'var(--radius-sm)',padding:'12px 16px'}}>
                <span style={{marginRight:8}}>{a.icon}</span>{a.text}
              </div>
            ))}
          </div>

          <div className="dash-section-title" style={{marginTop:24}}>Scholarship Status</div>
          <div className="card">
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:32}}>✦</span>
              <div>
                <div style={{fontWeight:600}}>{user.scholarshipApplied ? 'Application Submitted' : 'Not Applied'}</div>
                <div style={{color:'var(--text2)',fontSize:13}}>
                  {user.scholarshipApplied ? 'Under review – expected decision by June 1' : 'Apply before May 30, 2025'}
                </div>
              </div>
              <span className={`badge ${user.scholarshipApplied ? 'badge-gold' : 'badge-red'}`} style={{marginLeft:'auto'}}>
                {user.scholarshipApplied ? 'Pending' : 'Not Applied'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {user.courses && user.courses.length > 0 && (
        <div>
          <div className="dash-section-title">Current Semester Courses</div>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {user.courses.map(c => (
                  <tr key={c.code}>
                    <td><span className="badge badge-blue">{c.code}</span></td>
                    <td style={{color:'var(--text)'}}>{c.name}</td>
                    <td>{c.credits}</td>
                    <td>
                      <span style={{color: GRADE_COLOR[c.grade] || 'var(--text)', fontWeight:700}}>{c.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
