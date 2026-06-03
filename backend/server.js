require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/students');

const app = express();

// Connect Database
connectDB();

// CORS Configuration — allows requests from the frontend
const allowedOrigins = [
  'http://localhost:5173',                   // local dev
  'https://kba-project.vercel.app',          // Vercel production
  process.env.CLIENT_URL,                    // optional override via env
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} is not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Define Routes
app.use('/api/students', studentRoutes);

// Health Check Root Route
app.get('/', (req, res) => {
  res.send('Student Management API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
