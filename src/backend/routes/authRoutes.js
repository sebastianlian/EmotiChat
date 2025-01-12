const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { registerValidation } = require('../utils/validateUser'); // Joi validation
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register endpoint
router.post('/register', async (req, res) => {
    // Validate user input with Joi
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already registered');

    try {
        // Create and save user
        const { firstname, lastname, gender, username, pronouns, email, password } = req.body;
        const user = new User({ firstname, lastname, gender, pronouns, username, email, password });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Login endpoint
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.error('Missing email or password');
        return res.status(400).send('Email and password are required.');
    }

    console.log('Login request received:', req.body);

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).send('Internal server error');
        }

        if (!user) {
            console.error('Login failed:', info.message);
            return res.status(400).send(info.message || 'Invalid login');
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful, token generated:', token);
        res.json({ token });
    })(req, res, next);
});


// Protected route (example)
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(`Hello ${req.user.username}, welcome to the dashboard!`);
});

// Verify token endpoint
router.get('/verify-token', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password'); // Exclude password
        if (!user) return res.status(404).send('User not found');
        res.json({ user });
    } catch (err) {
        res.status(401).send('Invalid or expired token');
    }
});


module.exports = router;
