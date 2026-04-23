'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API = 'http://localhost:3001/api';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetch(`${API}/auth/verify`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { if (d.valid) router.push('/admin/dashboard'); })
        .catch(() => {});
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Could not connect to server. Make sure Next.js is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2F4466' }}>
      <div style={{ background: 'white', borderRadius: 12, padding: '2.5rem', width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2F4466', fontFamily: 'Georgia, serif', fontSize: '1.6rem', margin: 0 }}>Encounter Coffee</h1>
          <p style={{ color: '#7C090F', margin: '0.4rem 0 0', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Admin Panel</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} required autoFocus />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
          </div>
          {error && <div style={{ background: '#fce4e4', color: '#7C090F', padding: '0.7rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#2F4466' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid #ddd', borderRadius: 8, fontSize: '1rem', outline: 'none', boxSizing: 'border-box' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', background: '#7C090F', color: 'white', border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' };
