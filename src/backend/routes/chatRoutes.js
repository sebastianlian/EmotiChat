// const express = require('express');
// const router = express.Router();
// const { analyzeSentimentAndEntities } = require('../utils/aiServices/googleNLService'); // Google NLP
// const { generateResponse } = require('../utils/aiServices/anthropicService'); // Claude AI
// const User = require('../models/User');
// const Conversation = require('../models/Conversation');
//
// router.post('/message', async (req, res) => {
//     const { message, username } = req.body;
//
//     console.log('Request body:', req.body); // Debugging: Log the request
//     if (!username || !message) {
//         return res.status(400).json({ error: 'Username and message are required' });
//     }
//
//     try {
//         // Find the user
//         let user = await User.findOne({ username });
//         if (!user) {
//             user = new User({
//                 username, mentalHealthStatus: 'Neutral',
//                 averageSentiment: 0,
//                 recentSentimentScores: []
//             });
//             await user.save();
//         }
//
//         // Get sentiment analysis from Google NLP
//         const sentimentData = await analyzeSentimentAndEntities(message);
//
//         // Generate AI chatbot response using Claude AI
//         const botResponse = await generateResponse(`
//             User: ${message}
//             Bot: Generate a response based on sentiment and conversation context.
//         `);
//
//         // Retrieve or create a conversation
//         let conversation = await Conversation.findOne({ username });
//         if (!conversation) {
//             conversation = new Conversation({ username, messages: [] });
//         }
//
//         // Store message and sentiment data
//         conversation.messages.push(
//             { sender: 'user', text: message, sentimentScore: sentimentData.score, magnitude: sentimentData.magnitude, entities: sentimentData.entities },
//             { sender: 'bot', text: botResponse }
//         );
//         await conversation.save();
//
//         // Update user's mental health status based on recent interactions
//         const recentMessages = conversation.messages.slice(-5); // Get last 5 messages
//         const averageSentiment = recentMessages.reduce((sum, msg) => sum + (msg.sentimentScore || 0), 0) / recentMessages.length;
//
//         user = await User.findOneAndUpdate(
//             { username },
//             { mentalHealthStatus: averageSentiment > 0.25 ? 'Positive' : (averageSentiment < -0.25 ? 'Negative' : 'Neutral') },
//             { new: true }
//         );
//
//         res.json({
//             botResponse,
//             sentiment: sentimentData.score,
//             mentalHealthStatus: user.mentalHealthStatus,
//             averageSentiment
//         });
//     } catch (error) {
//         console.error('Error in chatbot route:', error);
//         res.status(500).json({ error: 'Error processing message' });
//     }
// });
//
// module.exports = router;

const express = require('express');
const router = express.Router();
const { analyzeSentimentAndEntities } = require('../utils/aiServices/googleNLService'); // Google NLP
const { generateResponse } = require('../utils/aiServices/anthropicService'); // Claude AI
const User = require('../models/User');
const Conversation = require('../models/Conversation');

router.post('/message', async (req, res) => {
    const { message, username } = req.body;

    console.log('Request body:', req.body); // Debugging: Log the request
    if (!username || !message) {
        return res.status(400).json({ error: 'Username and message are required' });
    }

    try {
        // Find the user
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({
                username, mentalHealthStatus: 'Neutral',
                averageSentiment: 0,
                recentSentimentScores: []
            });
            await user.save();
        }

        // Retrieve or create a conversation
        let conversation = await Conversation.findOne({ username });
        if (!conversation) {
            conversation = new Conversation({ username, messages: [] });
        }

        // Retrieve the last 10 messages to maintain context
        const recentMessages = conversation.messages.slice(-10);
        const chatHistory = recentMessages.map(msg => `${msg.sender}: ${msg.text}`).join("\n");
        // Analyze sentiment
        const sentimentData = await analyzeSentimentAndEntities(message);

        // Generate AI response with chat history for context
        const prompt = `
            You are an AI mental health chatbot. Consider the following conversation history:

            ${chatHistory}

            The user has just said: "${message}"

            Respond empathetically, taking into account previous messages and sentiment trends.
        `;

        const botResponse = await generateResponse(prompt);

        // Save user and bot messages in MongoDB
        conversation.messages.push(
            { sender: 'user', text: message, sentimentScore: sentimentData.score, magnitude: sentimentData.magnitude, entities: sentimentData.entities },
            { sender: 'bot', text: botResponse }
        );
        await conversation.save();

        // Track user’s sentiment trends over time
        const last5Messages = conversation.messages.slice(-5);
        const averageSentiment = last5Messages.reduce((sum, msg) => sum + (msg.sentimentScore || 0), 0) / last5Messages.length;

        user = await User.findOneAndUpdate(
            { username },
            { mentalHealthStatus: averageSentiment > 0.25 ? 'Positive' : (averageSentiment < -0.25 ? 'Negative' : 'Neutral') },
            { new: true }
        );

        res.json({
            botResponse,
            sentiment: sentimentData.score,
            mentalHealthStatus: user.mentalHealthStatus,
            averageSentiment
        });

    } catch (error) {
        console.error('Error in chatbot route:', error);
        res.status(500).json({ error: 'Error processing message' });
    }
});

module.exports = router;