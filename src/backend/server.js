const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DB_URI  = process.env.DB_URI ;

// MongoDB connection
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection failed:', err));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
