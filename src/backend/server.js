const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
require('./config/passport'); // Passport configuration file

dotenv.config();

// console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Environment variables
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

// MongoDB connection
mongoose
    .connect(DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection failed:', err));

// Passport middleware
app.use(passport.initialize());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/protected', protectedRoutes);

const chatbotRoutes = require('./routes/chatRoutes');
app.use('/api/chatbot', chatbotRoutes);

const sentimentRoutes = require('./routes/sentimentRoutes');
app.use('/api/sentiment', sentimentRoutes);

const copingStrategiesRoutes = require('./routes/copingStrategiesRoutes');
app.use('/api/coping-strategies', copingStrategiesRoutes);

const progressRoutes = require('./routes/progressRoutes');
app.use('/api/progress', progressRoutes);


// Basic route
app.get('/', (req, res) => res.send('API is running...'));

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
