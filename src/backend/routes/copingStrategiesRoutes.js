const express = require('express');
const router = express.Router();
const CopingStrategy = require('../models/CopingStrategy');
const User = require('../models/User');

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

// Update Coping Strategy (Edit or Mark as Complete)
router.patch('/:id', async (req, res) => {
    try {
        const updatedStrategy = await CopingStrategy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStrategy);
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
