import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [show, setShow] = useState(false);
  const nav = useNavigate();

  const load = () => api.get('/projects').then(r => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name) return alert('Name required');
    await api.post('/projects', form);
    setForm({ name: '', description: '' });
    setShow(false);
    load();
  };

  const del = async (id) => {
    if (!confirm('Delete project and all its tasks?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}} className="mb-4">
        <h2>📁 Projects</h2>
        <button className="btn btn-primary" onClick={() => setShow(!show)}>+ New Project</button>
      </div>
      {show && (
        <div className="card mb-4">
          <h3>New Project</h3>
          <input className="input mt-2" placeholder="Project name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input className="input" placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={create}>Create</button>
            <button className="btn" style={{background:'#334155',color:'#fff'}} onClick={() => setShow(false)}>Cancel</button>
          </div>
        </div>
      )}
      {projects.length === 0 && <p>No projects yet. Create one!</p>}
      <div className="grid">
        {projects.map(p => (
          <div key={p.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
              </div>
              <button className="btn btn-danger" style={{padding:'6px 12px',fontSize:'12px'}} onClick={() => del(p.id)}>Delete</button>
            </div>
            <button className="btn btn-primary mt-2" style={{fontSize:'13px'}} onClick={() => nav(`/tasks?project_id=${p.id}&project_name=${p.name}`)}>View Tasks →</button>
          </div>
        ))}
      </div>
    </div>
  );
}