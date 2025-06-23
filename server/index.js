import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(cors());

const users = [];
const medications = [];
const appointments = [];

const JWT_SECRET = 'medisphere-secret-key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword
    };
    
    users.push(newUser);
    
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ 
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/medications', authenticateToken, (req, res) => {
  const userMedications = medications.filter(med => med.userId === req.user.id);
  res.json(userMedications);
});

app.post('/api/medications', authenticateToken, (req, res) => {
  const newMedication = {
    id: uuidv4(),
    userId: req.user.id,
    ...req.body,
    createdAt: new Date()
  };
  
  medications.push(newMedication);
  res.status(201).json(newMedication);
});

app.put('/api/medications/:id', authenticateToken, (req, res) => {
  const medicationIndex = medications.findIndex(
    med => med.id === req.params.id && med.userId === req.user.id
  );
  
  if (medicationIndex === -1) {
    return res.status(404).json({ message: 'Medication not found' });
  }
  
  medications[medicationIndex] = {
    ...medications[medicationIndex],
    ...req.body,
    updatedAt: new Date()
  };
  
  res.json(medications[medicationIndex]);
});

app.delete('/api/medications/:id', authenticateToken, (req, res) => {
  const medicationIndex = medications.findIndex(
    med => med.id === req.params.id && med.userId === req.user.id
  );
  
  if (medicationIndex === -1) {
    return res.status(404).json({ message: 'Medication not found' });
  }
  
  medications.splice(medicationIndex, 1);
  res.status(204).send();
});

app.get('/api/appointments', authenticateToken, (req, res) => {
  const userAppointments = appointments.filter(app => app.userId === req.user.id);
  res.json(userAppointments);
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  const newAppointment = {
    id: uuidv4(),
    userId: req.user.id,
    ...req.body,
    createdAt: new Date()
  };
  
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id', authenticateToken, (req, res) => {
  const appointmentIndex = appointments.findIndex(
    app => app.id === req.params.id && app.userId === req.user.id
  );
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  appointments[appointmentIndex] = {
    ...appointments[appointmentIndex],
    ...req.body,
    updatedAt: new Date()
  };
  
  res.json(appointments[appointmentIndex]);
});

app.delete('/api/appointments/:id', authenticateToken, (req, res) => {
  const appointmentIndex = appointments.findIndex(
    app => app.id === req.params.id && app.userId === req.user.id
  );
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  appointments.splice(appointmentIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
