const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { registerValidation } = require('../utils/validateUser'); // Joi validation
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

router.post('/register', async (req, res) => {
    try {
        // Validate input data
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details.map((err) => err.message).join(', ') });
        }

        const { firstname, lastname, gender, username, pronouns, customPronouns, email, password } = req.body;

        // Check for existing email
        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: 'Email already registered' });

        // Final pronouns logic
        const finalPronouns = pronouns === 'other' ? customPronouns : pronouns;

        // Create user and save to database
        const user = new User({
            firstname,
            lastname,
            gender,
            username,
            pronouns: finalPronouns,
            email,
            password,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});



// Login endpoint
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.error('Missing email or password');
        return res.status(400).send('Email and password are required.');
    }

    // console.log('Login request received:', req.body);

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
        // console.log('Login successful, token generated:', token);
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
        const user = await User.findById(decoded.id).select('firstname username email gender');
        if (!user) return res.status(404).send('User not found');
        res.json({ user });
    } catch (err) {
        res.status(401).send('Invalid or expired token');
    }
});

// Update Password Route
router.put('/update-password', async (req, res) => {
    const { password } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
        const userId = decoded.id;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Failed to update password. Please try again.' });
    }
});

router.put('/update-info', async (req, res) => {
    const { gender, pronouns, email } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Extract token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        const userId = decoded.id;

        // Validate inputs (optional: add additional validations if needed)
        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }

        // Update user info in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { gender, pronouns, email },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'Information updated successfully!', user: updatedUser });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ message: 'Failed to update user information. Please try again.' });
    }
});

module.exports = router;
