import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h2>🚀 Create Account</h2>
        {error && <p style={{color:'#ef4444',marginBottom:'12px'}}>{error}</p>}
        <label>Name</label>
        <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" />
        <label>Email</label>
        <input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com" />
        <label>Password</label>
        <input className="input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
        <label>Role</label>
        <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn btn-primary" style={{width:'100%'}} onClick={submit}>Register</button>
        <p style={{textAlign:'center',marginTop:'16px'}}>Have account? <Link to="/" style={{color:'#3b82f6'}}>Login</Link></p>
      </div>
    </div>
  );
}