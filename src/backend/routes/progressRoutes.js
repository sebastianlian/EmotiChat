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
            anomalies.push({ message: `Sudden mood drop detected on ${sentiments[i].date}` });
        }
    }
    return anomalies;
};

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ error: "User not found" });

        // Get the latest conversation
        const conversation = await Conversation.findOne({ user: user._id });

        let emotionalState = "Not enough data";

        if (conversation) {
            // Find most recent emotionalState from a user message
            const lastEmotional = [...conversation.messages]
                .reverse()
                .find(msg => msg.sender === 'user' && msg.emotionalState);

            if (lastEmotional) emotionalState = lastEmotional.emotionalState;
        }

        // Fetch sentiment data for the last 7 days
        const sentiments = await SentimentData.find({ username }).sort({ date: -1 }).limit(7);

        const validScores = sentiments
            .map(entry => entry.sentimentScore)
            .filter(score => typeof score === 'number' && !isNaN(score));

        const avgSentiment = validScores.length > 0
            ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
            : 0;

        console.log("Valid Sentiment Scores:", validScores);
        console.log("Avg Sentiment Score:", avgSentiment);

        const anomalies = detectAnomalies(sentiments);

        res.json({
            sentiments,
            avgSentiment,
            // mentalStatus: avgSentiment > 0.25 ? "Positive" : avgSentiment < -0.25 ? "Negative" : "Neutral",
            detectedAnomalies: anomalies,
            emotionalState
        });
    } catch (error) {
        console.error("Error fetching progress data:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
