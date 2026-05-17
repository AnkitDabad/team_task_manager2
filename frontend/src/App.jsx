import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

function Nav() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const logout = () => { localStorage.clear(); nav('/'); };
  if (!localStorage.getItem('token')) return null;
  return (
    <div className="nav">
      <h1>🚀 TaskManager</h1>
      <div className="nav-links">
        <Link to="/dashboard" style={{color:'#94a3b8',textDecoration:'none'}}>Dashboard</Link>
        <Link to="/projects" style={{color:'#94a3b8',textDecoration:'none'}}>Projects</Link>
        <span style={{color:'#64748b',fontSize:'13px'}}>{user.name}</span>
        <button className="btn" style={{background:'#334155',color:'#fff',padding:'6px 14px'}} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}