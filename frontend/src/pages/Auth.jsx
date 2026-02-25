import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const { data } = await axios.post(`http://localhost:8000${endpoint}`, { email, password });
      if (isLogin) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
        window.location.reload();
      } else {
        alert("Account created! Please login.");
        setIsLogin(true);
      }
    } catch (err) { alert(err.response?.data?.message || "Auth Failed"); }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#fff' }}>
      <form onSubmit={handleSubmit} style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#38bdf8' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <input type="email" placeholder="Email" required style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', background: '#334155', border: 'none', color: '#fff' }} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', background: '#334155', border: 'none', color: '#fff' }} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" style={{ width: '100%', padding: '12px', marginTop: '20px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p onClick={() => setIsLogin(!isLogin)} style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#94a3b8' }}>
          {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
        </p>
      </form>
    </div>
  );
}