import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      
      {/* Navbar */}
      <nav style={{ 
        padding: '20px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #1e293b' 
      }}>
        <h2 style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.5rem' }}>Ghost-Churn</h2>
        <Link 
          to="/login" 
          style={{ 
            color: '#fff', 
            textDecoration: 'none', 
            border: '1px solid #38bdf8', 
            padding: '10px 24px', 
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#38bdf8';
            e.target.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#fff';
          }}
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '120px 40px' }}>
        <h1 style={{ fontSize: '3.2rem', marginBottom: '20px', lineHeight: '1.2', fontWeight: '700' }}>
          Stop Losing Customers to <span style={{ color: '#38bdf8' }}>The Void</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '720px', margin: '0 auto 50px', lineHeight: '1.6' }}>
          Deploy industrial-grade Machine Learning to predict churn before it happens and get AI-powered remedies to save your revenue.
        </p>
        <Link 
          to="/login" 
          style={{ 
            backgroundColor: '#38bdf8', 
            color: '#0f172a', 
            padding: '16px 40px', 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            borderRadius: '8px', 
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(56, 189, 248, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.4)';
          }}
        >
          Get Started for Free
        </Link>
      </div>

      {/* Features */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '40px', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '60px 40px' 
      }}>
        <Feature icon={<Zap color="#38bdf8" size={40}/>} title="Real-time Prediction" desc="Get churn scores in milliseconds via our Flask-powered ML engine." />
        <Feature icon={<ShieldCheck color="#38bdf8" size={40}/>} title="AI Remedies" desc="Don't just see the risk; get a plan to fix it immediately." />
        <Feature icon={<BarChart3 color="#38bdf8" size={40}/>} title="History Tracking" desc="Monitor trends over time with our persistent MongoDB audit trail." />
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div style={{ 
      padding: '30px', 
      backgroundColor: '#1e293b', 
      borderRadius: '12px', 
      textAlign: 'center', 
      transition: 'transform 0.2s ease' 
    }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ marginBottom: '15px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', fontWeight: '600' }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.5' }}>{desc}</p>
    </div>
  );
}