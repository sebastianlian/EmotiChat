const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SentimentData = require('../models/Sentiment'); // Assume you have a Sentiment model

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

        // Fetch sentiment data for the last 7 days
        const sentiments = await SentimentData.find({ username }).sort({ date: -1 }).limit(7);

        // Calculate average sentiment
        const avgSentiment = sentiments.length > 0
            ? sentiments.reduce((sum, entry) => sum + entry.sentimentScore, 0) / sentiments.length
            : 0;

        // Detect anomalies
        const anomalies = detectAnomalies(sentiments);

        res.json({
            sentiments,
            avgSentiment,
            mentalStatus: avgSentiment > 0.25 ? "Positive" : avgSentiment < -0.25 ? "Negative" : "Neutral",
            detectedAnomalies: anomalies,
        });
    } catch (error) {
        console.error("Error fetching progress data:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
