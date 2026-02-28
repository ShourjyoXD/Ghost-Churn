import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, AlertTriangle, CheckCircle, Smartphone, 
  History, LogOut, Lightbulb, FileSpreadsheet, Upload, Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

export default function Dashboard() {
  const navigate = useNavigate();

  // 1. State Management
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
  const [bulkLoading, setBulkLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 2. Auth Logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  // 3. API Logic: Fetch History
  const fetchHistory = async () => {
    try {
      const res = await axios.get('https://ghost-churn-backend.onrender.com/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error("History fetch failed");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 4. API Logic: Clear Logs
  const clearLogs = async () => {
    if (window.confirm("⚠️ Are you sure? This will permanently delete all prediction history from the database.")) {
        try {
            await axios.delete('https://ghost-churn-backend.onrender.com/api/history/clear');
            setHistory([]); 
            alert("Database logs cleared successfully.");
        } catch (err) {
            alert("Failed to clear logs. Check if the server is running.");
        }
    }
  };

  // 5. API Logic: Bulk File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    setBulkLoading(true);

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Send the parsed Excel data to the bulk backend route
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/predict/bulk`, jsonData);
        alert(`Batch Complete! Processed ${response.data.length} records.`);
        fetchHistory(); 
      } catch (err) {
        console.error(err);
        alert("Bulk upload failed. Ensure your Excel headers match the model features (tenure, MonthlyCharges, etc).");
      } finally {
        setBulkLoading(false);
        e.target.value = null; // Reset file input
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 6. API Logic: Single Prediction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://ghost-churn-backend.onrender.com/api/predict', formData);
      setResult(response.data);
      fetchHistory();
    } catch (error) {
      alert("System Offline: Check your Backend, Flask, and MongoDB connection.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      
      {/* NAVIGATION BAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', maxWidth: '1100px', margin: '0 auto 40px auto' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8', margin: 0 }}>
          <Activity size={28} /> GHOST-CHURN ANALYTICS
        </h2>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#fb7185', border: '1px solid #fb7185', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* BULK UPLOAD SECTION */}
        <div style={{ marginBottom: '30px', padding: '30px', border: '2px dashed #334155', backgroundColor: '#1e293b', borderRadius: '16px', textAlign: 'center' }}>
          <FileSpreadsheet color="#38bdf8" size={40} style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '0 0 10px 0' }}>Enterprise Batch Processing</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Upload an Excel file to analyze large datasets instantly.</p>
          
          <label style={{ 
            backgroundColor: bulkLoading ? '#64748b' : '#38bdf8', 
            color: '#0f172a', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            cursor: bulkLoading ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {bulkLoading ? 'Analyzing Records...' : <><Upload size={18} /> Upload Data Sheet</>}
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload} 
              disabled={bulkLoading}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* INPUT FORM SECTION */}
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Smartphone size={20} color="#38bdf8" /> Individual Analysis
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Tenure (Months)</label>
              <input 
                type="number" 
                value={formData.tenure} 
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff', outline: 'none' }} 
                onChange={(e) => setFormData({...formData, tenure: Number(e.target.value)})} 
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Monthly Charges ($)</label>
              <input 
                type="number" 
                value={formData.MonthlyCharges} 
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff', outline: 'none' }} 
                onChange={(e) => setFormData({...formData, MonthlyCharges: Number(e.target.value)})} 
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Contract Plan</label>
              <select 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff', outline: 'none', cursor: 'pointer' }} 
                onChange={(e) => setFormData({
                  ...formData, 
                  Contract_Two_year: e.target.value === '2' ? 1 : 0, 
                  Contract_One_year: e.target.value === '1' ? 1 : 0
                })}
              >
                <option value="0">Month-to-Month</option>
                <option value="1">One Year</option>
                <option value="2">Two Year</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              {loading ? 'AI IS THINKING...' : 'RUN PREDICTION'}
            </button>
          </form>

          {/* AI OUTPUT SECTION */}
          <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {!result ? (
              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <Activity size={48} style={{ marginBottom: '10px', opacity: 0.3 }} />
                <p>Awaiting Customer Data...</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', width: '100%' }}>
                {result.prediction === 1 ? <AlertTriangle size={64} color="#fb7185" /> : <CheckCircle size={64} color="#4ade80" />}
                <h2 style={{ fontSize: '24px', margin: '15px 0', color: result.prediction === 1 ? '#fb7185' : '#4ade80' }}>
                  {result.prediction === 1 ? 'HIGH CHURN RISK' : 'LOYAL CUSTOMER'}
                </h2>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Probability Score</p>
                  <p style={{ fontSize: '40px', fontWeight: 'bold', margin: '5px 0' }}>{result.churn_probability}%</p>
                </div>
                <div style={{ padding: '20px', background: '#0f172a', borderRadius: '12px', borderLeft: '4px solid #38bdf8', textAlign: 'left' }}>
                  <h4 style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
                    <Lightbulb size={18} /> AI Recommended Remedy
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>{result.remedy}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* HISTORY LOG SECTION */}
        <div style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f1f5f9', margin: 0 }}>
              <History size={20} color="#38bdf8" /> Prediction Audit Log
            </h3>
            <button 
              onClick={clearLogs} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: 'rgba(251, 113, 133, 0.1)', 
                color: '#fb7185', 
                border: '1px solid #fb7185', 
                padding: '6px 14px', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              <Trash2 size={16} /> Clear All History
            </button>
          </div>

          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
            {history.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No previous records found in the system.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '13px' }}>
                      <th style={{ padding: '12px' }}>Customer Stats</th>
                      <th style={{ padding: '12px' }}>Churn Risk</th>
                      <th style={{ padding: '12px' }}>Action Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #0f172a', fontSize: '14px' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 'bold', color: '#f1f5f9' }}>{item.customerData.tenure} Months</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>${item.customerData.MonthlyCharges}/mo</div>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: item.prediction === 1 ? '#fb7185' : '#4ade80' }}>
                          {item.churn_probability}%
                        </td>
                        <td style={{ padding: '12px', color: '#cbd5e1', fontSize: '13px', maxWidth: '300px' }}>
                          {item.remedy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}