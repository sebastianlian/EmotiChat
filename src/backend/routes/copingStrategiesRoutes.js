const express = require('express');
const router = express.Router();
const CopingStrategy = require('../models/CopingStrategy');
const User = require('../models/User');
const {join} = require("node:path");
const {readFileSync} = require("node:fs");

const getRandomMotivationalMessage = () => {
    try {
        // Adjust path to read from `data/motivational_messages.txt`
        const filePath = join(__dirname, '../data/motivational_msgs.txt');
        const messages = readFileSync(filePath, 'utf8').split('\n').filter(msg => msg.trim() !== '');

        if (messages.length === 0) return "Keep pushing forward! Every step matters. 🚀"; // Fallback

        return messages[Math.floor(Math.random() * messages.length)]; // Pick a random message
    } catch (error) {
        console.error("Error reading motivational messages:", error);
        return "You're doing great! Keep going. 💙"; // Fallback if file fails
    }
};

// Save Coping Strategies
router.post('/', async (req, res) => {
    const { username, strategies } = req.body;
    if (!username || !strategies || !Array.isArray(strategies)) {
        return res.status(400).json({ error: "Invalid request body" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const savedStrategies = await CopingStrategy.insertMany(
            strategies.map((strategy, index) => ({
                user: user._id,
                username,
                title: strategy.title,
                details: strategy.details,
                order: index, // Maintain order
            }))
        );

        res.json(savedStrategies);
    } catch (error) {
        console.error("Error saving coping strategies:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Fetch Coping Strategies
router.get('/:username', async (req, res) => {
    try {
        const strategies = await CopingStrategy.find({ username: req.params.username }).sort('order');
        res.json(strategies);
    } catch (error) {
        console.error("Error fetching coping strategies:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Toggle Coping Strategy Completion (Mark as Complete OR Undo)
router.patch('/:id', async (req, res) => {
    try {
        const strategy = await CopingStrategy.findById(req.params.id);
        if (!strategy) {
            return res.status(404).json({ error: "Strategy not found" });
        }

        // Toggle the completion status
        strategy.completed = !strategy.completed;
        await strategy.save();

        // Generate a motivational message only if the user **completes** a task
        let motivationalMessage = "";
        if (strategy.completed) {
            motivationalMessage = getRandomMotivationalMessage();
        }

        res.json({ strategy, motivationalMessage });
    } catch (error) {
        console.error("Error updating coping strategy:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete Coping Strategy
router.delete('/:id', async (req, res) => {
    try {
        await CopingStrategy.findByIdAndDelete(req.params.id);
        res.json({ message: "Strategy deleted" });
    } catch (error) {
        console.error("Error deleting coping strategy:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;