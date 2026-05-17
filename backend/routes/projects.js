const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const projects = db.prepare(`
    SELECT p.* FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE p.owner_id = ? OR pm.user_id = ?
  `).all(req.user.id, req.user.id);
  res.json(projects);
});

router.post('/', auth, (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const result = db.prepare('INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)').run(name, description, req.user.id);
  db.prepare('INSERT OR IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)').run(result.lastInsertRowid, req.user.id);
  res.json({ id: result.lastInsertRowid, name, description, owner_id: req.user.id });
});

router.delete('/:id', auth, (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  if (project.owner_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });
  db.prepare('DELETE FROM tasks WHERE project_id = ?').run(req.params.id);
  db.prepare('DELETE FROM project_members WHERE project_id = ?').run(req.params.id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;