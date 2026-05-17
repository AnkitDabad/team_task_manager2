const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const { project_id } = req.query;
  let tasks;
  if (project_id) {
    tasks = db.prepare('SELECT t.*, u.name as assignee_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.project_id = ?').all(project_id);
  } else {
    tasks = db.prepare('SELECT t.*, u.name as assignee_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.assigned_to = ? OR t.created_by = ?').all(req.user.id, req.user.id);
  }
  res.json(tasks);
});

router.post('/', auth, (req, res) => {
  const { title, description, project_id, assigned_to, due_date } = req.body;
  if (!title || !project_id) return res.status(400).json({ error: 'Title and project required' });
  const result = db.prepare(
    'INSERT INTO tasks (title, description, project_id, assigned_to, due_date, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description, project_id, assigned_to || req.user.id, due_date, req.user.id, 'todo');
  res.json({ id: result.lastInsertRowid, title, status: 'todo' });
});

router.patch('/:id', auth, (req, res) => {
  const { status, title, description, assigned_to, due_date } = req.body;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE tasks SET status=?, title=?, description=?, assigned_to=?, due_date=? WHERE id=?').run(
    status || task.status, title || task.title, description || task.description,
    assigned_to || task.assigned_to, due_date || task.due_date, req.params.id
  );
  res.json({ success: true });
});

router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;