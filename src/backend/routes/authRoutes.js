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
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Login endpoint
router.post('/login', (req, res, next) => {
    // Use Passport Local Strategy for login
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).send(info.message || 'Login failed');
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    })(req, res, next);
});

// Protected route (example)
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(`Hello ${req.user.username}, welcome to the dashboard!`);
});

module.exports = router;
