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

        let sentimentRecord = await Sentiment.findOne({ user: user._id });

        if (!sentimentRecord) {
            sentimentRecord = new Sentiment({
                user: user._id,
                username,
                sentimentScores: [],
                timestamps: [],
                averageSentiment: 0, // Initialize it
            });
        }

        // ✅ Add new sentiment score
        sentimentRecord.sentimentScores.push(sentimentScore);
        sentimentRecord.timestamps.push(new Date());

        // ✅ Remove outdated scores older than 8 hours
        const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000); // 8 hours in milliseconds

        const validIndexes = sentimentRecord.timestamps
            .map((timestamp, index) => ({ timestamp, index }))
            .filter(entry => entry.timestamp > eightHoursAgo)
            .map(entry => entry.index);

        // ✅ Keep only recent scores
        sentimentRecord.sentimentScores = validIndexes.map(i => sentimentRecord.sentimentScores[i]);
        sentimentRecord.timestamps = validIndexes.map(i => sentimentRecord.timestamps[i]);

        // ✅ Recalculate rolling average based on last 8 hours
        const averageSentiment = sentimentRecord.sentimentScores.length > 0
            ? sentimentRecord.sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentRecord.sentimentScores.length
            : 0;

        sentimentRecord.averageSentiment = averageSentiment;

        await sentimentRecord.save();
        console.log(`✅ Stored sentiment for ${username}: Avg Sentiment (Last 8 Hours) = ${averageSentiment}`);

        res.json({ message: "Sentiment stored successfully", averageSentiment });
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
