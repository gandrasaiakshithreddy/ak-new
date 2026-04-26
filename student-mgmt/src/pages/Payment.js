import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';
import './Payment.css';

const FEE_ITEMS = [
  { id: 'tuition', label: 'Tuition Fee', amount: 45000, due: 'May 15, 2025', required: true },
  { id: 'hostel', label: 'Hostel Fee', amount: 30000, due: 'May 15, 2025', required: false },
  { id: 'lab', label: 'Lab & Library Fee', amount: 5000, due: 'May 15, 2025', required: true },
  { id: 'sports', label: 'Sports & Activities', amount: 2500, due: 'May 30, 2025', required: false },
  { id: 'exam', label: 'Examination Fee', amount: 3000, due: 'June 1, 2025', required: true },
];

const METHODS = ['Credit Card', 'Debit Card', 'Net Banking', 'UPI'];

export default function Payment() {
  const { user, updateUser } = useAuth();
  const [selected, setSelected] = useState(['tuition','lab','exam']);
  const [step, setStep] = useState('select'); // select | checkout | success
  const [method, setMethod] = useState('UPI');
  const [upi, setUpi] = useState('');
  const [processing, setProcessing] = useState(false);
  const [txnId] = useState('TXN' + Date.now());

  if (!user) return null;

  const toggle = (id) => {
    const item = FEE_ITEMS.find(f=>f.id===id);
    if (item.required) return;
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  };

  const total = FEE_ITEMS.filter(f=>selected.includes(f.id)).reduce((a,b)=>a+b.amount,0);

  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      updateUser({ feesPaid: true });
      setStep('success');
      setProcessing(false);
    }, 1800);
  };

  const HISTORY = [
    { date:'Nov 12, 2024', desc:'Semester 5 Fees', amount:'₹50,500', status:'Paid', txn:'TXN1731234567' },
    { date:'May 10, 2024', desc:'Semester 4 Fees', amount:'₹50,500', status:'Paid', txn:'TXN1715345678' },
  ];

  if (step === 'success') return (
    <div>
      <div className="page-header"><h1>Fee Payment</h1></div>
      <div className="card" style={{textAlign:'center',padding:'60px 40px'}}>
        <div style={{fontSize:64,marginBottom:16}}>✓</div>
        <h2 style={{fontSize:28,marginBottom:8}}>Payment Successful!</h2>
        <p style={{color:'var(--text2)',marginBottom:24}}>Your payment has been processed successfully.</p>
        <div style={{background:'var(--bg3)',borderRadius:'var(--radius-sm)',padding:'20px',display:'inline-block',marginBottom:24,textAlign:'left'}}>
          <div className="info-row"><span className="info-label">Transaction ID</span><span className="info-value">{txnId}</span></div>
          <div className="info-row"><span className="info-label">Amount Paid</span><span className="info-value" style={{color:'var(--accent)',fontWeight:700}}>₹{total.toLocaleString()}</span></div>
          <div className="info-row"><span className="info-label">Payment Method</span><span className="info-value">{method}</span></div>
          <div className="info-row"><span className="info-label">Date</span><span className="info-value">{new Date().toLocaleDateString()}</span></div>
        </div>
        <div><button className="btn-primary" onClick={() => setStep('select')}>Back to Payments</button></div>
      </div>
    </div>
  );

  if (step === 'checkout') return (
    <div>
      <div className="page-header"><h1>Checkout</h1><p>Complete your fee payment</p></div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title"><span>⬡</span> Order Summary</div>
          {FEE_ITEMS.filter(f=>selected.includes(f.id)).map(f=>(
            <div key={f.id} className="info-row">
              <span style={{color:'var(--text)'}}>{f.label}</span>
              <span style={{fontWeight:600}}>₹{f.amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="info-row" style={{borderTop:'2px solid var(--accent)',marginTop:8,paddingTop:16}}>
            <span style={{fontFamily:'var(--font-head)',fontWeight:800,fontSize:16}}>Total Amount</span>
            <span style={{fontFamily:'var(--font-head)',fontWeight:800,fontSize:20,color:'var(--accent)'}}>₹{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="card">
          <div className="card-title"><span>◆</span> Payment Method</div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
            {METHODS.map(m=>(
              <div key={m} className={`method-option ${method===m?'active':''}`} onClick={()=>setMethod(m)}>
                <span>{method===m?'◉':'○'}</span> {m}
              </div>
            ))}
          </div>
          {method==='UPI' && (
            <div className="form-group" style={{marginBottom:20}}>
              <label>UPI ID</label>
              <input placeholder="yourname@paytm" value={upi} onChange={e=>setUpi(e.target.value)} />
            </div>
          )}
          <div style={{display:'flex',gap:10}}>
            <button className="btn-primary" onClick={pay} disabled={processing} style={{flex:1}}>
              {processing ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
            </button>
            <button className="btn-secondary" onClick={()=>setStep('select')}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1>Fee Payment</h1>
        <p>Select fee items and complete your payment</p>
      </div>

      {user.feesPaid && (
        <div className="success-msg" style={{marginBottom:24}}>✓ All fees for this semester have been paid</div>
      )}

      <div className="grid-2" style={{marginBottom:28}}>
        <div className="card">
          <div className="card-title"><span>⬡</span> Select Fee Items</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {FEE_ITEMS.map(f => (
              <div key={f.id}
                className={`fee-item ${selected.includes(f.id)?'selected':''} ${f.required?'locked':''}`}
                onClick={()=>toggle(f.id)}
              >
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:18,color:selected.includes(f.id)?'var(--accent)':'var(--text3)'}}>
                    {selected.includes(f.id)?'☑':'☐'}
                  </span>
                  <div>
                    <div style={{fontWeight:600}}>{f.label} {f.required&&<span style={{fontSize:11,color:'var(--red)'}}>*required</span>}</div>
                    <div style={{fontSize:12,color:'var(--text3)'}}>Due: {f.due}</div>
                  </div>
                </div>
                <div style={{fontFamily:'var(--font-head)',fontWeight:700,color:selected.includes(f.id)?'var(--accent)':'var(--text2)'}}>
                  ₹{f.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="total-bar">
            <span>Total Selected</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <button className="btn-primary" style={{width:'100%',marginTop:16}} onClick={()=>setStep('checkout')} disabled={user.feesPaid}>
            {user.feesPaid ? 'Already Paid' : `Proceed to Pay ₹${total.toLocaleString()} →`}
          </button>
        </div>

        <div>
          <div className="card">
            <div className="card-title"><span>◈</span> Payment History</div>
            <table>
              <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {HISTORY.map(h=>(
                  <tr key={h.txn}>
                    <td>{h.date}</td>
                    <td style={{color:'var(--text)'}}>{h.desc}</td>
                    <td style={{fontWeight:600,color:'var(--accent)'}}>{h.amount}</td>
                    <td><span className="badge badge-green">{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
