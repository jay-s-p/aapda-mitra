import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname functionality for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory data store for mock backend
const users = [];
let nextUserId = 1;

let userProfile = {
  id: 1,
  name: 'New User',
  phone: '1234567890',
  age: 25,
  gender: 'Prefer not to say',
};
let personalContacts = [];
let nextContactId = 1;

// Middleware
app.use(cors());
app.use(express.json());

// --- MOCK API ROUTES ---

// Auth
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User with this email already exists.' });
  }

  const newUser = { id: nextUserId++, name, email, password };
  users.push(newUser);
  console.log('Users:', users); // For debugging
  res.status(201).json({ success: true, message: 'Signed up successfully.' });
});


app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }
  
  res.json({ success: true, message: 'Signed in successfully.' });
});


// Profile
app.get('/api/profile', (req, res) => {
  res.json(userProfile);
});

app.put('/api/profile', (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  res.json({ success: true, profile: userProfile });
});

// Contacts
app.get('/api/contacts', (req, res) => {
  res.json(personalContacts);
});

app.post('/api/contacts', (req, res) => {
  const newContact = { id: nextContactId++, ...req.body };
  personalContacts.push(newContact);
  res.status(201).json(newContact);
});

app.delete('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  personalContacts = personalContacts.filter(c => c.id !== id);
  res.status(204).send();
});

// Incidents
app.post('/api/incidents', (req, res) => {
  console.log('Received incident report:', req.body);
  res.status(201).json({ success: true, message: 'Incident reported.' });
});


// --- SERVE REACT APP ---

// This tells Express to serve the built static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// This is the catch-all route. For any GET request that doesn't match an API route,
// it sends back the main index.html file from the built React app.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});