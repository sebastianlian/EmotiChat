const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SentimentData = require('../models/Sentiment');
const Conversation = require('../models/Conversation');
const Anomaly = require('../models/Anomaly');

// Function to detect anomalies (e.g., sudden mood drops)
const detectAnomalies = (sentiments) => {
    const anomalies = [];

    for (let i = 1; i < sentiments.length; i++) {
        const prev = sentiments[i - 1].sentimentScore;
        const curr = sentiments[i].sentimentScore;
        const drop = prev - curr;

        // You can adjust this threshold
        if (drop >= 0.5) {
            const rawTimestamp = new Date(sentiments[i].timestamps);
            const roundedTimestamp = new Date(Math.floor(rawTimestamp.getTime() / 1000) * 1000);

            anomalies.push({
                message: `Sharp drop from ${prev.toFixed(2)} to ${curr.toFixed(2)} on ${roundedTimestamp.toISOString()}`,
                sentimentScore: curr,
                timestamp: roundedTimestamp,
                emotionalState: sentiments[i]?.emotionalState || "Unknown"
            });
        }
    }

    return anomalies;
};



router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        // 1. Get emotional state from the latest conversation
        const conversation = await Conversation.findOne({ user: user._id });
        let emotionalState = "Not enough data";
        if (conversation) {
            const lastEmotional = [...conversation.messages]
                .reverse()
                .find(msg => msg.sender === 'user' && msg.emotionalState);
            if (lastEmotional) emotionalState = lastEmotional.emotionalState;
        }

        // 2. Fetch all sentiment data for anomaly detection
        const allSentiments = await SentimentData.find({ username }).sort({ timestamps: 1 });

        // 3. Detect anomalies from full history
        const anomalies = detectAnomalies(allSentiments);
        for (const anomaly of anomalies) {
            const roundedTimestamp = new Date(Math.floor(new Date(anomaly.timestamp).getTime() / 1000) * 1000);
            const exists = await Anomaly.findOne({
                username: user.username,
                timestamp: roundedTimestamp,
                description: anomaly.message
            });
            if (!exists) {
                await Anomaly.create({
                    user: user._id,
                    username: user.username,
                    sentimentScore: anomaly.sentimentScore,
                    timestamp: roundedTimestamp,
                    description: anomaly.message
                });
            }
        }

        // 4. Filter for only the last 8 hours for UI graph + avg
        const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000);
        const recentSentiments = allSentiments.filter(entry =>
            new Date(entry.timestamps) >= eightHoursAgo
        );

        // 5. Calculate 8-hour average sentiment
        const validScores = recentSentiments
            .map(entry => entry.sentimentScore)
            .filter(score => typeof score === 'number' && !isNaN(score));
        const avgSentiment = validScores.length > 0
            ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
            : 0;

        // 6. Send all necessary data to the frontend
        res.json({
            sentiments: recentSentiments,          // used for 8-hour summary
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

// POST /api/progress/detect-historical-anomalies
router.post("/detect-historical-anomalies", async (req, res) => {
    try {
        const users = await User.find({});
        console.log(`Starting historical anomaly detection for ${users.length} users`);

        for (const user of users) {
            const sentiments = await SentimentData.find({ username: user.username })
                .sort({ timestamps: 1 });

            console.log(`  → ${user.username} has ${sentiments.length} sentiment entries`);
            if (sentiments.length > 0) {
                console.log(`    🕒 Range: ${new Date(sentiments[0].timestamps).toISOString()} → ${new Date(sentiments[sentiments.length - 1].timestamps).toISOString()}`);
            }

            console.log(`  → ${user.username} has ${sentiments.length} sentiment entries`);

            const anomalies = detectAnomalies(sentiments);
            console.log(`  ↳ Found ${anomalies.length} anomalies for ${user.username}`);

            for (const anomaly of anomalies) {
                const roundedTimestamp = new Date(Math.floor(new Date(anomaly.timestamp).getTime() / 1000) * 1000);

                const exists = await Anomaly.findOne({
                    username: user.username,
                    sentimentScore: anomaly.sentimentScore,
                    timestamp: roundedTimestamp
                });

                if (!exists) {
                    await Anomaly.create({
                        user: user._id,
                        username: user.username,
                        sentimentScore: anomaly.sentimentScore,
                        timestamp: roundedTimestamp,
                        description: anomaly.message,
                        emotionalState: anomaly.emotionalState
                    });
                    console.log(`Created anomaly: ${anomaly.message}`);
                } else {
                    console.log(`Skipped duplicate anomaly: ${anomaly.message}`);
                }

            }

        }

        res.json({ message: "Historical anomalies processed." });
    } catch (error) {
        console.error("Error detecting historical anomalies:", error);
        res.status(500).json({ error: "Failed to process historical anomalies." });
    }
});

// GET /api/progress/anomalies/:username
router.get('/anomalies/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const anomalies = await Anomaly.find({ username }).sort({ timestamp: -1 });
        res.json({ anomalies });
    } catch (error) {
        console.error("Error fetching anomalies:", error);
        res.status(500).json({ error: "Failed to fetch anomalies" });
    }
});



module.exports = router;