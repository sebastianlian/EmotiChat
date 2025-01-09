const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
require('./config/passport'); // Passport configuration file

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

// MongoDB connection
mongoose
    .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection failed:', err));

// Passport middleware
app.use(passport.initialize());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const protectedRoutes = require('./routes/protectedRoutes'); // For protected endpoints
app.use('/api/protected', protectedRoutes);

// Basic route
app.get('/', (req, res) => res.send('API is running...'));

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
