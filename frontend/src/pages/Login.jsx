import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    } catch (e) {
      setError(e.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h2>🚀 TaskManager</h2>
        {error && <p style={{color:'#ef4444',marginBottom:'12px'}}>{error}</p>}
        <label>Email</label>
        <input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com" />
        <label>Password</label>
        <input className="input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
        <button className="btn btn-primary" style={{width:'100%'}} onClick={submit}>Login</button>
        <p style={{textAlign:'center',marginTop:'16px'}}>No account? <Link to="/register" style={{color:'#3b82f6'}}>Register</Link></p>
      </div>
    </div>
  );
}