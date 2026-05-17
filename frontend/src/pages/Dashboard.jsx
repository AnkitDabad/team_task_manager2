import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { api.get('/tasks').then(r => setTasks(r.data)); }, []);

  const today = new Date().toISOString().split('T')[0];
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const overdue = tasks.filter(t => t.due_date && t.due_date < today && t.status !== 'done').length;

  const statusBadge = (t) => {
    if (t.status === 'done') return 'badge-done';
    if (t.due_date && t.due_date < today) return 'badge-overdue';
    if (t.status === 'in_progress') return 'badge-in_progress';
    return 'badge-todo';
  };

  return (
    <div className="container">
      <h2>👋 Welcome, {user.name} <span style={{fontSize:'14px',color:'#64748b'}}>({user.role})</span></h2>
      <div className="stats">
        <div className="stat-card"><div className="num">{total}</div><div className="label">Total Tasks</div></div>
        <div className="stat-card"><div className="num" style={{color:'#10b981'}}>{done}</div><div className="label">Completed</div></div>
        <div className="stat-card"><div className="num" style={{color:'#3b82f6'}}>{inProgress}</div><div className="label">In Progress</div></div>
        <div className="stat-card"><div className="num" style={{color:'#ef4444'}}>{overdue}</div><div className="label">Overdue</div></div>
      </div>
      <h2>My Tasks</h2>
      {tasks.length === 0 && <p>No tasks yet. Create a project and add tasks!</p>}
      <div className="grid">
        {tasks.map(t => (
          <div key={t.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
              <h3>{t.title}</h3>
              <span className={`badge ${statusBadge(t)}`}>{t.due_date && t.due_date < today && t.status !== 'done' ? 'overdue' : t.status}</span>
            </div>
            <p>{t.description}</p>
            {t.due_date && <p style={{marginTop:'8px',fontSize:'12px'}}>📅 Due: {t.due_date}</p>}
            {t.assignee_name && <p style={{fontSize:'12px'}}>👤 {t.assignee_name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}