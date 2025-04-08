const express = require("express");
const router = express.Router();
const Sentiment = require("../models/Sentiment");
const User = require("../models/User");

// Store new sentiment score
router.post("/add-sentiment", async (req, res) => {
    const { username, sentimentScore } = req.body;

    if (!username || sentimentScore === undefined) {
        return res.status(400).json({ error: "Username and sentimentScore are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        // MONGO STORING LAST 8 HOURS AVG SENTIMENT
        const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000);

        const recentScores = await Sentiment.find({
            user: user._id,
            timestamps: { $gte: eightHoursAgo }
        });

        const allScores = [...recentScores.map(s => s.sentimentScore), sentimentScore]; // Include current one
        const rollingAvg = allScores.length > 0
            ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length
            : sentimentScore;

        const newSentiment = new Sentiment({
            user: user._id,
            username,
            sentimentScore,
            timestamps: new Date(),
            averageSentiment: rollingAvg
        });

        await newSentiment.save();

        console.log(`Stored new sentiment for ${username}: ${sentimentScore} | Rolling Avg: ${rollingAvg}`);
        res.json({ message: "Sentiment stored successfully", sentimentScore, averageSentiment: rollingAvg });
    } catch (error) {
        console.error("Error storing sentiment:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Fetch user's sentiment history
router.get("/sentiment-history/:username", async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const sentimentRecord = await Sentiment.findOne({ user: user._id });

        if (!sentimentRecord) {
            return res.status(404).json({ error: "No sentiment data found for user" });
        }

        res.json({
            sentimentScores: sentimentRecord.sentimentScores,
            timestamps: sentimentRecord.timestamps,
            averageSentiment: sentimentRecord.averageSentiment,
        });
    } catch (error) {
        console.error("Error fetching sentiment history:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
