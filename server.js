const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store (resets when the app restarts)
let students = [
  { id: 1, name: 'Ravi Kumar', rollNo: '22CS001', branch: 'CSE', year: 3 },
  { id: 2, name: 'Sneha Reddy', rollNo: '22CS002', branch: 'CSE', year: 3 }
];
let nextId = 3;

// Health check (used by Kubernetes probes)
app.get('/health', (req, res) => res.json({ status: 'UP' }));

// Get all students
app.get('/api/students', (req, res) => res.json(students));

// Get one student
app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// Add a student
app.post('/api/students', (req, res) => {
  const { name, rollNo, branch, year } = req.body;
  if (!name || !rollNo) {
    return res.status(400).json({ error: 'name and rollNo are required' });
  }
  const student = { id: nextId++, name, rollNo, branch: branch || '', year: Number(year) || 1 };
  students.push(student);
  res.status(201).json(student);
});

// Update a student
app.put('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  Object.assign(student, req.body, { id: student.id });
  res.json(student);
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
  const before = students.length;
  students = students.filter(s => s.id !== Number(req.params.id));
  if (students.length === before) return res.status(404).json({ error: 'Student not found' });
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Student Management app running on port ${PORT}`));
