const axios = require('axios');
const express = require('express');
const router = express.Router();
const moment = require('moment')
const {join} = require("node:path");
const { analyzeSentimentAndEntities } = require('../utils/aiServices/googleNLService'); // Google NLP
const { generateResponse } = require('../utils/aiServices/anthropicService'); // Claude AI
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const {calculateAverageEmotionalState} = require("../utils/sentimentUtils");
const { exec } = require("child_process");
const CopingStrategy = require('../models/CopingStrategy'); // Import coping strategies model

// Extract Coping Strategies from Chatbot Response
const extractCopingStrategies = (botResponse) => {
    // const strategyRegex = /^(\d+)\.\s+(.+?):\s*(.+)$/gm; // Captures strategy number, title, and description
    const strategyRegex = /\d+\.\s+(.+?)(?:\n\s*[-•]\s+(.+?))?(?=\n\d+\.|\n*$)/gs;

    const strategies = [];
    let match;

    while ((match = strategyRegex.exec(botResponse)) !== null) {
        strategies.push({
            title: match[1]?.trim() || "Coping Strategy", // Ensure title always has a fallback
            details: match[2] ? match[2].trim() : "", // Only trim details if they exist
        });
    }

    return strategies.length > 0 ? strategies : null;
};

// Get Emotional State from Python Predictor
async function getEmotionalState(sentimentScore, magnitude) {
    return new Promise((resolve, reject) => {
        const scriptPath = join(__dirname, '../ml/emotionPredictor.py'); // Adjust path

        exec(
            `python "${scriptPath}" ${sentimentScore} ${magnitude}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Error running emotion predictor:", stderr);
                    reject(error);
                }
                resolve(stdout.trim()); // Return the predicted emotion
            }
        );
    });
}

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

        if (!conversation) {
            console.log(`Creating a new conversation for user: ${username}`);

            if (!username) {
                console.error("Error: Username is missing before saving conversation!");
            }

            conversation = new Conversation({
                user: user._id,
                username: username,  // Fallback to prevent validation error
                messages: []
            });

            console.log(username);
            await conversation.save();
            console.log("Conversation successfully saved with username:", username);
        }


        // Retrieve the last 10 messages to maintain context
        const recentMessages = conversation.messages.slice(-10);
        const chatHistory = recentMessages.map(msg => `${msg.sender}: ${msg.text}`).join("\n");

        console.log(`Analyzing sentiment for message: "${message}"`);
        const sentimentData = await analyzeSentimentAndEntities(message);
        console.log(`Sentiment Analysis Result:`, sentimentData);

        // Map sentiment score & magnitude to an emotional state
        const emotionalState = await getEmotionalState(sentimentData.score, sentimentData.magnitude);
        console.log(`Predicted Emotional State: ${emotionalState}`);


        // Send sentiment data to sentimentRoutes to store in the new schema
        await axios.post("http://localhost:5000/api/sentiment/add-sentiment", {
            username,
            sentimentScore: sentimentData.score,
        }).catch(err => console.error("Error sending sentiment to API:", err));

        // Generate AI response with chat history for context
        const prompt = `
    You are an AI mental health chatbot focused on providing support, encouragement, and actionable guidance.
    
    Consider the following conversation history:

    ${chatHistory}

    The user has just said: "${message}"

    Your response should be warm, encouraging, and human-like. Make sure to:

    1. **Acknowledge the user's emotions empathetically.** Use a tone that is validating, supportive, and conversational.
    2. **Offer 2-3 practical coping strategies in a numbered list (1., 2., 3.).** The advice should be simple, encouraging, and not overwhelming.
    3. **Guide the user rather than solve everything for them.** Encourage self-reflection and goal-setting rather than just providing direct answers.
    4. **If the user asks for a more detailed expansion on self-care or self-improvement techniques, ask if they’d like to add that to their goals list.** This will help them take ownership of their progress.
    5. **Incorporate conversational and engaging language.** Avoid sounding robotic or overly clinical. Use emojis sparingly to add warmth.
    6. **Keep responses concise and easy to follow.** If needed, break long explanations into short, digestible sentences.

    ---
    
    ### **Example response when offering guidance:**
    
    "I hear you, and it sounds like you're going through a tough moment. That’s completely understandable, and I want you to know that you’re not alone. 💙 Here are a few things that might help right now:

    1. Try the 4-7-8 breathing technique—inhale for 4 seconds, hold for 7, and exhale for 8. It’s great for calming the mind.
    2. If your thoughts feel heavy, writing down your feelings (even just a few words) can help lighten the mental load.
    3. Moving your body, even in small ways (stretching, a quick walk), can shift your energy and ease tension.

    Would any of these feel helpful to you right now? I'm here to support you."

    ---
    
    ### **Example response when discussing self-improvement techniques:**
    
    "You’re interested in self-improvement— that’s great! 🎯 There are many ways to grow, and what works best depends on what resonates with you. Some popular methods include:

    1. Practicing mindfulness and meditation to develop self-awareness.
    2. Setting small, achievable goals to build consistency and confidence.
    3. Engaging in reflective journaling to track your growth over time.

    Would you like to add any of these to your goals list? This way, you can keep track and revisit them when you're ready."

    ---

    Now, based on the user's message and past conversation, generate a supportive and engaging response in this format.
`;

        console.log(`Generating AI response...`);
        const botResponse = await generateResponse(prompt);
        console.log(`AI Response: ${botResponse}`);

        // Extract Coping Strategies from AI Response
        const copingStrategies = extractCopingStrategies(botResponse);
        console.log(`Extracted Coping Strategies:`, copingStrategies);

        // Save extracted coping strategies in MongoDB
        if (copingStrategies && copingStrategies.length > 0) {
            await CopingStrategy.insertMany(
                copingStrategies.map((strategy, index) => ({
                    user: user._id,
                    username,
                    title: strategy.title,
                    details: strategy.details,
                    order: index, // Keep order for sorting
                    completed: false
                }))
            );
        }

        // Save user and bot messages in MongoDB
        conversation.messages.push(
            {
                sender: 'user',
                username: username,
                text: message,
                sentimentScore: sentimentData.score,
                magnitude: sentimentData.magnitude,
                entities: sentimentData.entities,
                emotionalState: emotionalState
            },
            {
                sender: 'bot',
                username: 'bot',
                text: botResponse
            }
        );

        const lastSentiments = conversation.messages
            .slice(-10)
            .map(msg => msg.sentimentScore)
            .filter(score => score !== undefined);  // Filter out undefined values

        const lastMagnitudes = conversation.messages
            .slice(-10)
            .map(msg => msg.magnitude || 0) // If magnitude is undefined, set to 0
            .filter(mag => mag !== undefined);  // Filter out undefined values

        console.log("Debugging Emotional State Calculation:");
        console.log("Last Sentiments:", lastSentiments);
        console.log("Last Magnitudes:", lastMagnitudes);
        console.log("User Average Sentiment:", user.averageSentiment || 0);

        // Ensure we pass `user.averageSentiment` to factor in long-term trends
        conversation.averageEmotionalState = calculateAverageEmotionalState(
            lastSentiments,
            lastMagnitudes,
            user.averageSentiment || 0 // Default to 0 if user is new
        );



        await conversation.save();
        console.log(`Conversation updated for user: ${username}`);

        // Update user's mental health status
        const averageSentiment = lastSentiments.reduce((sum, score) => sum + (score || 0), 0) / lastSentiments.length;

        console.log(`Updating mental health status for ${username}. Avg Sentiment: ${averageSentiment}`);

        user = await User.findOneAndUpdate(
            { _id: user._id },
            {
                mentalHealthStatus: averageSentiment > 0.25 ? 'Positive' : (averageSentiment < -0.25 ? 'Negative' : 'Neutral'),
                averageSentiment: averageSentiment
            },
            { new: true }
        );

        res.json({
            botResponse,
            emotionalState,
            averageEmotionalState: conversation.averageEmotionalState,
            mentalHealthStatus: user.mentalHealthStatus,
            copingStrategies: copingStrategies || [],
        });


    } catch (error) {
        console.error('Error in chatbot route:', error.message);
        console.log(error.stack); // Log full error stack trace
        res.status(500).json({ error: `Error processing message: ${error.message}` });
    }
});

// Get the latest conversation for a user
router.get("/latest-conversation/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the latest conversation for the user
        const conversation = await Conversation.findOne({ user: userId })
            .sort({ "messages.timestamp": -1 }) // Sort messages by timestamp
            .select("messages") // Only return messages
            .lean();

        if (!conversation || conversation.messages.length === 0) {
            return res.status(404).json({ message: "No recent conversation found." });
        }

        // Filter only user messages that have sentiment scores
        const userMessages = conversation.messages
            .filter(msg => msg.sender === 'user' && msg.sentimentScore !== undefined)
            .slice(-10); // Take the last 10 messages (adjust this number as needed)

        const averageSentiment = userMessages.length > 0
            ? userMessages.reduce((sum, msg) => sum + msg.sentimentScore, 0) / userMessages.length
            : 0; // Default to 0 if no user messages

        console.log(`Updating ${user}'s average sentiment using last ${userMessages.length} messages: ${averageSentiment}`);

        // Store the updated sentiment score in the User model
        user = await User.findOneAndUpdate(
            { _id: user._id },
            {
                $set: { averageSentiment },
                $push: { recentSentimentScores: { $each: [averageSentiment], $slice: -10 } } // Keep last 10 sentiment scores
            },
            { new: true }
        );

        console.log(`Updated ${username}'s average sentiment to:`, user.averageSentiment);

    } catch (error) {
        console.error("Error fetching recent chat:", error);
        res.status(500).json({ message: "Server error." });
    }
});

router.get('/first-message/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        let user = await User.findOne({ username });

        if (!user) {
            // Create a new user if they don't exist
            user = new User({
                username,
                mentalHealthStatus: 'Neutral',
                averageSentiment: 0,
                recentSentimentScores: []
            });
            await user.save();
        }

        let conversation = await Conversation.findOne({ user: user._id });

        if (!conversation) {
            conversation = new Conversation({
                user: user._id,
                username: username,
                messages: []
            });
            await conversation.save();
        }

        // Check last message timestamp
        const lastMessage = conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1] : null;
        const isFirstMessageToday = !lastMessage || !moment(lastMessage.timestamp).isSame(moment(), 'day');

        if (isFirstMessageToday) {
            let botResponse = `Good to see you again, ${username}! 😊 Hope you're doing well today.`;

            // **If user is new, send a fresh welcome message**
            if (!lastMessage) {
                botResponse += " Let's start fresh! How are you feeling today?";
            } else {
                // **Otherwise, summarize the last conversation**
                const lastUserMessages = conversation.messages
                    .filter(msg => msg.sender === 'user')
                    .slice(-3); // Get the last 3 user messages

                if (lastUserMessages.length > 0) {
                    const summary = lastUserMessages.map(msg => `"${msg.text}"`).join(" ");
                    botResponse += ` Last time, we talked about: ${summary}. How have you been feeling since then?`;
                } else {
                    botResponse += " Let's start fresh! How are you feeling today?";
                }
            }


            // Save bot message to conversation
            conversation.messages.push({ sender: 'bot', username: 'bot', text: botResponse, timestamp: new Date() });
            await conversation.save();

            return res.json({ botResponse });
        }

        res.json({ botResponse: null }); // No need to send a message if it's not the first interaction today.

    } catch (error) {
        console.error('Error checking first message:', error.message);
        res.status(500).json({ error: `Error checking first message: ${error.message}` });
    }
});

router.get('/strategies/:username', async (req, res) => {
    try {
        console.log("Fetching strategies for user:", req.params.username);
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const strategies = await CopingStrategy.find({ username }).sort({ order: 1 });

        if (!strategies.length) {
            return res.status(404).json({ message: "No coping strategies found." });
        }

        res.json(strategies);
    } catch (error) {
        console.error("Error fetching coping strategies:", error);
        res.status(500).json({ error: "Server error." });
    }
});


module.exports = router;
