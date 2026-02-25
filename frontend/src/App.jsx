import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, CheckCircle, Smartphone, CreditCard } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    tenure: 12,
    MonthlyCharges: 70,
    TotalCharges: 840,
    Contract_Two_year: 0,
    Contract_One_year: 0,
    InternetService_Fiber_optic: 1,
    PaymentMethod_Electronic_check: 1
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Connects to Node.js (8000) -> Flask (5000) -> ML Model
      const response = await axios.post('http://localhost:8000/api/predict', formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("System Offline: Check if both Backend and Flask are running.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', color: '#38bdf8' }}>
          <Activity size={40} /> GHOST-CHURN AI
        </h1>
        <p style={{ color: '#94a3b8' }}>Predictive Analytics for Customer Retention</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* INPUT SECTION */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Smartphone size={20}/> Usage Profile</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Tenure (Months)</label>
            <input type="number" value={formData.tenure} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff' }} 
              onChange={(e) => setFormData({...formData, tenure: e.target.value})} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Monthly Charges ($)</label>
            <input type="number" value={formData.MonthlyCharges} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff' }} 
              onChange={(e) => setFormData({...formData, MonthlyCharges: e.target.value})} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Contract Plan</label>
            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff' }} 
              onChange={(e) => setFormData({...formData, Contract_Two_year: e.target.value === '2' ? 1 : 0, Contract_One_year: e.target.value === '1' ? 1 : 0})}>
              <option value="0">Month-to-Month</option>
              <option value="1">One Year</option>
              <option value="2">Two Year</option>
            </select>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {loading ? 'RUNNING AI...' : 'ANALYZE CUSTOMER'}
          </button>
        </form>

        {/* OUTPUT SECTION */}
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {!result ? (
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <Activity size={48} style={{ marginBottom: '10px', opacity: 0.3 }} />
              <p>Awaiting Customer Data Input...</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              {result.prediction === 1 ? (
                <AlertTriangle size={80} color="#fb7185" />
              ) : (
                <CheckCircle size={80} color="#4ade80" />
              )}
              
              <h2 style={{ fontSize: '28px', margin: '20px 0', color: result.prediction === 1 ? '#fb7185' : '#4ade80' }}>
                {result.prediction === 1 ? 'CRITICAL RISK' : 'STABLE CUSTOMER'}
              </h2>
              
              <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: 0, color: '#94a3b8' }}>Churn Probability</p>
                <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '5px 0' }}>{result.churn_probability}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;