const express = require('express');
const router = express.Router();
const { processMessage } = require('../utils/chatbotUtil');
const User = require('../models/user');

router.post('/message', async (req, res) => {
    const { message, username } = req.body;

    console.log('Request body:', req.body); // Log the incoming request body
    console.log('Username received:', username); // Log the username specifically

    try {
        // Check if the username is valid
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ error: 'Invalid username' });
        }

        // Fetch the user from the database using the username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Pass the username to the chatbot processing function
        const response = await processMessage(message);
        res.status(200).json({ response });
    } catch (error) {
        console.error('Error in chatbot:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

module.exports = router;
