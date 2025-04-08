const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SentimentData = require('../models/Sentiment');
const Conversation = require('../models/Conversation');

// Function to detect anomalies (e.g., sudden mood drops)
const detectAnomalies = (sentiments) => {
    const anomalies = [];
    for (let i = 1; i < sentiments.length; i++) {
        if (sentiments[i].sentimentScore < -0.7 && sentiments[i - 1].sentimentScore > 0) {
            anomalies.push({ message: `Sudden mood drop detected on ${sentiments[i].timestamps}` });
        }
    }
    return anomalies;
};

// ROUTE FOR GETTING EMOTIONAL STATE, CALCULATING 8 HOUR AVG, AND FUTURE ANOMALY DETECTION
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ error: "User not found" });

        // 1. Get emotional state from the most recent conversation
        const conversation = await Conversation.findOne({ user: user._id });

        let emotionalState = "Not enough data";
        if (conversation) {
            const lastEmotional = [...conversation.messages]
                .reverse()
                .find(msg => msg.sender === 'user' && msg.emotionalState);
            if (lastEmotional) emotionalState = lastEmotional.emotionalState;
        }

        // 2. Replace the 7-day range with an 8-hour range
        const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000);

        const sentiments = await SentimentData.find({
            username,
            timestamps: { $gte: eightHoursAgo }
        }).sort({ timestamps: 1 });


        // 3. Extract valid scores only
        const validScores = sentiments
            .map(entry => entry.sentimentScore)
            .filter(score => typeof score === 'number' && !isNaN(score));

        const avgSentiment = validScores.length > 0
            ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
            : 0;

        console.log("Valid Sentiment Scores (7 days):", validScores);
        console.log("Avg Sentiment Score:", avgSentiment);

        // 4. Detect anomalies in the last 7 days
        const anomalies = detectAnomalies(sentiments);

        // 5. Send response
        res.json({
            sentiments,
            avgSentiment,
            emotionalState,
            detectedAnomalies: anomalies,
            conversationMessages: conversation?.messages || []
        });

    } catch (error) {
        console.error("Error fetching progress data:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Route for last 7 days mood progression
router.get("/weekly/:username", async (req, res) => {
    const { username } = req.params;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    try {
        const sentiments = await SentimentData.find({
            username,
            timestamps: { $gte: sevenDaysAgo }
        }).sort({ timestamps: 1 });

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const conversation = await Conversation.findOne({ user: user._id });
        const userMessages = conversation?.messages?.filter(
            msg => msg.sender === 'user' && msg.emotionalState
        ) || [];

        const enriched = sentiments.map(sentiment => {
            let closest = null;
            let minDiff = Infinity;

            userMessages.forEach(msg => {
                const diff = Math.abs(new Date(msg.timestamp) - new Date(sentiment.timestamps));
                if (diff < minDiff && diff <= 10 * 60 * 1000) {
                    minDiff = diff;
                    closest = msg;
                }
            });

            return {
                ...sentiment.toObject(),
                emotionalState: closest?.emotionalState || "Unknown"
            };
        });

        res.json({ sentiments: enriched });
    } catch (err) {
        console.error("Error fetching weekly sentiments:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
