import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#38bdf8' }}>Ghost-Churn</h2>
        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', border: '1px solid #38bdf8', padding: '8px 20px', borderRadius: '5px' }}>Login</Link>
      </nav>

      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Stop Losing Customers to <span style={{ color: '#38bdf8' }}>The Void</span></h1>
        <p style={{ fontSize: '1.5rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto 40px' }}>
          Deploy industrial-grade Machine Learning to predict churn before it happens and get AI-powered remedies to save your revenue.
        </p>
        <Link to="/login" style={{ backgroundColor: '#38bdf8', color: '#0f172a', padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '8px', textDecoration: 'none' }}>
          Get Started for Free
        </Link>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '50px 20px' }}>
        <Feature icon={<Zap color="#38bdf8"/>} title="Real-time Prediction" desc="Get churn scores in milliseconds via our Flask-powered ML engine." />
        <Feature icon={<ShieldCheck color="#38bdf8"/>} title="AI Remedies" desc="Don't just see the risk; get a plan to fix it immediately." />
        <Feature icon={<BarChart3 color="#38bdf8"/>} title="History Tracking" desc="Monitor trends over time with our persistent MongoDB audit trail." />
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div style={{ padding: '30px', backgroundColor: '#1e293b', borderRadius: '12px', textAlign: 'center' }}>
      <div style={{ marginBottom: '15px' }}>{icon}</div>
      <h3>{title}</h3>
      <p style={{ color: '#94a3b8' }}>{desc}</p>
    </div>
  );
}