const express = require('express');
const router = express.Router();
const { processMessage } = require('../utils/chatbotUtil');
const User = require('../models/user');
const Conversation = require('../models/Conversation');

router.post('/message', async (req, res) => {
    const { message, username } = req.body;

    console.log('Request body:', req.body); // Debug: Log the incoming request body
    console.log('Username received:', username); // Debug: Log the username specifically

    try {
        // Validate username and message
        if (!username || typeof username !== 'string' || username.trim() === '') {
            console.error('Invalid or missing username');
            return res.status(400).json({ error: 'Invalid or missing username' });
        }
        if (!message || typeof message !== 'string' || message.trim() === '') {
            console.error('Invalid or missing message');
            return res.status(400).json({ error: 'Invalid or missing message' });
        }

        // Verify that the user exists
        const user = await User.findOne({ username });
        if (!user) {
            console.error(`User not found: ${username}`);
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate bot response using chatbot logic
        const botResponse = await processMessage(message);

        // Retrieve or create the user's conversation
        let conversation = await Conversation.findOne({ username });
        if (!conversation) {
            console.log(`No conversation found for user: ${username}. Creating a new conversation.`);
            conversation = new Conversation({ username, messages: [] });
        }

        console.log('Conversation object:', conversation);


        // Save the user's message and bot's response
        conversation.messages.push(
            { sender: 'user', text: message },
            { sender: 'bot', text: botResponse }
        );

        await conversation.save(); // Save the updated conversation to MongoDB

        // Respond to the frontend with the bot's response
        res.status(200).json({ response: botResponse });
    } catch (error) {
        console.error('Error in chatbot route:', error); // Debug: Log the full error
        res.status(500).json({ error: 'Failed to process message' });
    }
});

module.exports = router;
