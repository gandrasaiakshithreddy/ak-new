import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';
import './CGPACalculator.css';

const GRADE_POINTS = { 'O':10,'A+':10,'A':9,'A-':9,'B+':8,'B':7,'B-':6,'C':5,'D':4,'F':0 };
const GRADES = Object.keys(GRADE_POINTS);

const GRADE_COLOR = {
  'O':'var(--accent)','A+':'var(--accent)','A':'var(--accent)','A-':'#86efac',
  'B+':'var(--blue)','B':'var(--blue)','B-':'#93c5fd',
  'C':'var(--gold)','D':'var(--red)','F':'var(--red)'
};

function getLetterGrade(cgpa) {
  if (cgpa >= 9) return { label:'Outstanding', color:'var(--accent)', icon:'⬡' };
  if (cgpa >= 8) return { label:'Excellent', color:'var(--blue)', icon:'◆' };
  if (cgpa >= 7) return { label:'Very Good', color:'var(--purple)', icon:'◉' };
  if (cgpa >= 6) return { label:'Good', color:'var(--gold)', icon:'◈' };
  if (cgpa >= 5) return { label:'Average', color:'#f97316', icon:'△' };
  return { label:'Below Average', color:'var(--red)', icon:'▽' };
}

export default function CGPACalculator() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([
    { name:'', credits:3, grade:'A' },
    { name:'', credits:3, grade:'A' },
  ]);
  const [prevSGPA, setPrevSGPA] = useState('');
  const [prevCredits, setPrevCredits] = useState('');

  const addCourse = () => setCourses(prev => [...prev, { name:'', credits:3, grade:'A' }]);
  const removeCourse = (i) => setCourses(prev => prev.filter((_,idx)=>idx!==i));
  const update = (i, field, val) => setCourses(prev => prev.map((c,idx) => idx===i ? {...c,[field]:val} : c));

  const totalCredits = courses.reduce((a,c)=>a+(parseInt(c.credits)||0),0);
  const weightedSum = courses.reduce((a,c)=>a+(parseInt(c.credits)||0)*(GRADE_POINTS[c.grade]||0),0);
  const sgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

  let cgpa = sgpa;
  if (prevSGPA && prevCredits) {
    const totalC = totalCredits + parseFloat(prevCredits);
    const totalW = weightedSum + parseFloat(prevSGPA)*parseFloat(prevCredits);
    cgpa = (totalW/totalC).toFixed(2);
  }

  const grade = getLetterGrade(parseFloat(cgpa));
  const percent = (parseFloat(cgpa)*10).toFixed(1);

  return (
    <div>
      <div className="page-header">
        <h1>CGPA Calculator</h1>
        <p>Calculate your semester GPA and cumulative GPA</p>
      </div>

      <div className="grid-2" style={{alignItems:'start'}}>
        <div>
          <div className="card" style={{marginBottom:20}}>
            <div className="card-title"><span>◆</span> Current Semester Courses</div>

            <div className="course-header">
              <span style={{flex:2}}>Course Name</span>
              <span style={{flex:1}}>Credits</span>
              <span style={{flex:1}}>Grade</span>
              <span style={{width:32}}></span>
            </div>

            {courses.map((c,i) => (
              <div key={i} className="course-row">
                <input
                  style={{flex:2}}
                  placeholder={`Course ${i+1}`}
                  value={c.name}
                  onChange={e=>update(i,'name',e.target.value)}
                />
                <select style={{flex:1}} value={c.credits} onChange={e=>update(i,'credits',e.target.value)}>
                  {[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}
                </select>
                <select style={{flex:1}} value={c.grade} onChange={e=>update(i,'grade',e.target.value)}>
                  {GRADES.map(g=><option key={g}>{g}</option>)}
                </select>
                <button
                  onClick={()=>removeCourse(i)}
                  style={{width:32,height:32,background:'#f8717120',border:'1px solid #f8717140',borderRadius:6,color:'var(--red)',fontSize:16,flexShrink:0}}
                  disabled={courses.length===1}
                >×</button>
              </div>
            ))}

            <button className="btn-secondary" style={{width:'100%',marginTop:12}} onClick={addCourse}>
              + Add Course
            </button>
          </div>

          <div className="card">
            <div className="card-title"><span>◈</span> Previous Semesters (Optional)</div>
            <p style={{color:'var(--text2)',fontSize:13,marginBottom:16}}>Include previous semester data to calculate cumulative CGPA</p>
            <div className="grid-2">
              <div className="form-group">
                <label>Previous Cumulative SGPA</label>
                <input type="number" min="0" max="10" step="0.01" placeholder="e.g., 8.5" value={prevSGPA} onChange={e=>setPrevSGPA(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Total Previous Credits</label>
                <input type="number" min="0" placeholder="e.g., 120" value={prevCredits} onChange={e=>setPrevCredits(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card result-card" style={{marginBottom:20}}>
            <div style={{textAlign:'center',padding:'12px 0 24px'}}>
              <div style={{fontSize:12,letterSpacing:2,textTransform:'uppercase',color:'var(--text3)',marginBottom:8}}>Your Result</div>
              <div style={{fontSize:72,fontFamily:'var(--font-head)',fontWeight:800,color:grade.color,lineHeight:1}}>
                {cgpa}
              </div>
              <div style={{fontSize:14,color:'var(--text2)',marginTop:8}}>CGPA / 10.0</div>
              <div style={{marginTop:12,display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}>
                <span style={{fontSize:20}}>{grade.icon}</span>
                <span style={{fontFamily:'var(--font-head)',fontWeight:700,color:grade.color,fontSize:18}}>{grade.label}</span>
              </div>
            </div>

            <div className="cgpa-bar-bg">
              <div className="cgpa-bar-fill" style={{width:`${parseFloat(cgpa)*10}%`,background:grade.color}} />
            </div>

            <div className="result-grid">
              <div className="result-stat">
                <div className="stat-label">Semester GPA</div>
                <div style={{fontFamily:'var(--font-head)',fontWeight:800,fontSize:24,color:'var(--accent)'}}>{sgpa}</div>
              </div>
              <div className="result-stat">
                <div className="stat-label">Total Credits</div>
                <div style={{fontFamily:'var(--font-head)',fontWeight:800,fontSize:24}}>{totalCredits}</div>
              </div>
              <div className="result-stat">
                <div className="stat-label">Percentage</div>
                <div style={{fontFamily:'var(--font-head)',fontWeight:800,fontSize:24,color:'var(--blue)'}}>{percent}%</div>
              </div>
              <div className="result-stat">
                <div className="stat-label">Courses</div>
                <div style={{fontFamily:'var(--font-head)',fontWeight:800,fontSize:24}}>{courses.length}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title"><span>◉</span> Grade Point Reference</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
              {GRADES.map(g=>(
                <div key={g} style={{textAlign:'center',padding:'10px',background:'var(--bg3)',borderRadius:'var(--radius-sm)'}}>
                  <div style={{fontFamily:'var(--font-head)',fontWeight:800,color:GRADE_COLOR[g]||'var(--text)'}}>{g}</div>
                  <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{GRADE_POINTS[g]} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
