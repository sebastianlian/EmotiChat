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

        // If the user does not exist, create them
        if (!user) {
            console.log(`User ${username} not found. Creating new user.`);
            user = new User({
                username,
                mentalHealthStatus: 'Neutral',
                averageSentiment: 0,
                recentSentimentScores: []
            });
            await user.save();
        }

        // Retrieve or create a conversation (corrected to use `user._id`)
        let conversation = await Conversation.findOne({ user: user._id });

        // if (!conversation) {
        //     console.log(`Conversation for ${username} not found. Creating new conversation.`);
        //     conversation = new Conversation({
        //         user: user._id,
        //         username: username,
        //         messages: []
        //     });
        //     await conversation.save();
        // }

        if (!conversation) {
            console.log(`Creating a new conversation for user: ${username}`);

            if (!username) {
                console.error("❌ Error: Username is missing before saving conversation!");
            }

            conversation = new Conversation({
                user: user._id,
                username: username,  // Fallback to prevent validation error
                messages: []
            });

            console.log(username);
            await conversation.save();
            console.log("✅ Conversation successfully saved with username:", username);
        }


        // Retrieve the last 10 messages to maintain context
        const recentMessages = conversation.messages.slice(-10);
        const chatHistory = recentMessages.map(msg => `${msg.sender}: ${msg.text}`).join("\n");

        console.log(`Analyzing sentiment for message: "${message}"`);
        const sentimentData = await analyzeSentimentAndEntities(message);
        console.log(`Sentiment Analysis Result:`, sentimentData);

        // Generate AI response with chat history for context
        const prompt = `
    You are an AI mental health chatbot focused on providing support and actionable suggestions.
    
    Consider the following conversation history:

    ${chatHistory}

    The user has just said: "${message}"

    - **Acknowledge the user's emotions empathetically.** 
    - **Provide 2-3 coping strategies formatted as a numbered list (1., 2., 3.).**
    - **Ensure the suggestions are practical and supportive.**
    - **Keep responses concise and easy to read.**

    Example format:

    "I understand that you're feeling overwhelmed. Here are some things that might help:  

    1. Try taking deep breaths and focusing on slow exhales.
    2. Write down your thoughts in a journal to clear your mind.
    3. Reach out to a friend or support network for guidance."

    Now, based on the user's message, provide a response in this structured format.
`;


        console.log(`Generating AI response...`);
        const botResponse = await generateResponse(prompt);
        console.log(`AI Response: ${botResponse}`);

        // Save user and bot messages in MongoDB
        conversation.messages.push(
            { sender: 'user', username: username, text: message, sentimentScore: sentimentData.score, magnitude: sentimentData.magnitude, entities: sentimentData.entities },
            { sender: 'bot', username: 'bot', text: botResponse  }
        );

        await conversation.save();
        console.log(`Conversation updated for user: ${username}`);

        // Track user’s sentiment trends over time
        const last5Messages = conversation.messages.slice(-5);
        const averageSentiment = last5Messages.reduce((sum, msg) => sum + (msg.sentimentScore || 0), 0) / last5Messages.length;

        console.log(`Updating mental health status for ${username}. Avg Sentiment: ${averageSentiment}`);

        user = await User.findOneAndUpdate(
            { _id: user._id },
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
        console.error('Error in chatbot route:', error.message);
        console.log(error.stack); // Log full error stack trace
        res.status(500).json({ error: `Error processing message: ${error.message}` });
    }
});

module.exports = router;
