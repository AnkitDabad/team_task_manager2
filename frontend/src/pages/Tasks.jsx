import { useEffect, useState } from 'react';
import api from '../api';
import { useSearchParams } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', assigned_to: '', due_date: '' });
  const [show, setShow] = useState(false);
  const [params] = useSearchParams();
  const project_id = params.get('project_id');
  const project_name = params.get('project_name');
  const today = new Date().toISOString().split('T')[0];

  const load = () => api.get(`/tasks?project_id=${project_id}`).then(r => setTasks(r.data));
  useEffect(() => {
    load();
    api.get('/users').then(r => setUsers(r.data));
  }, []);

  const create = async () => {
    if (!form.title) return alert('Title required');
    await api.post('/tasks', { ...form, project_id });
    setForm({ title: '', description: '', assigned_to: '', due_date: '' });
    setShow(false);
    load();
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}`, { status });
    load();
  };

  const del = async (id) => {
    await api.delete(`/tasks/${id}`);
    load();
  };

  const statusBadge = (t) => {
    if (t.status === 'done') return 'badge-done';
    if (t.due_date && t.due_date < today) return 'badge-overdue';
    if (t.status === 'in_progress') return 'badge-in_progress';
    return 'badge-todo';
  };

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}} className="mb-4">
        <h2>✅ {project_name || 'Tasks'}</h2>
        <button className="btn btn-primary" onClick={() => setShow(!show)}>+ Add Task</button>
      </div>
      {show && (
        <div className="card mb-4">
          <h3>New Task</h3>
          <input className="input mt-2" placeholder="Task title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <input className="input" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <select className="input" value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})}>
            <option value="">Assign to...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
          </select>
          <input className="input" type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} />
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={create}>Create</button>
            <button className="btn" style={{background:'#334155',color:'#fff'}} onClick={() => setShow(false)}>Cancel</button>
          </div>
        </div>
      )}
      {tasks.length === 0 && <p>No tasks. Add one above!</p>}
      <div className="grid">
        {tasks.map(t => (
          <div key={t.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
              <h3>{t.title}</h3>
              <span className={`badge ${statusBadge(t)}`}>{t.due_date && t.due_date < today && t.status !== 'done' ? 'overdue' : t.status}</span>
            </div>
            <p>{t.description}</p>
            {t.assignee_name && <p style={{fontSize:'12px',marginTop:'6px'}}>👤 {t.assignee_name}</p>}
            {t.due_date && <p style={{fontSize:'12px'}}>📅 {t.due_date}</p>}
            <div className="flex gap-2 mt-2">
              <select className="input" style={{margin:0,padding:'6px',fontSize:'12px'}} value={t.status} onChange={e => updateStatus(t.id, e.target.value)}>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button className="btn btn-danger" style={{padding:'6px 12px',fontSize:'12px'}} onClick={() => del(t.id)}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}