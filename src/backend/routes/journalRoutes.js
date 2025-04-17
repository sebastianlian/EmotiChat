const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry'); // Make sure this exists!

// Route for journal entries
router.post('/entry', async (req, res) => {
    const { username, entry, emotion } = req.body;

    if (!username || !entry || !emotion) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newEntry = new JournalEntry({
            username,
            entry,
            emotion,
            timestamp: new Date(),
        });

        await newEntry.save();
        res.status(201).json({ message: 'Journal entry saved successfully!' });
    } catch (error) {
        console.error("Failed to save journal entry:", error);
        res.status(500).json({ message: 'Server error saving entry' });
    }
});

// Routes for users
router.get('/entries/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const entries = await JournalEntry.find({ username }).sort({ timestamp: -1 });
        res.json({ entries });
    } catch (error) {
        console.error("Error fetching journal entries:", error);
        res.status(500).json({ message: 'Failed to fetch journal entries.' });
    }
});

// Route for edited journal entries
router.put('/entry/:id', async (req, res) => {
    const { entry, emotion } = req.body;

    if (!entry || !emotion) {
        return res.status(400).json({ message: "Entry content is required." });
    }

    try {
        const updated = await JournalEntry.findByIdAndUpdate(
            req.params.id,
            { entry, emotion },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Entry not found." });
        }

        res.json({ message: "Journal entry updated successfully", updated });
    } catch (err) {
        console.error("Error updating journal entry:", err);
        res.status(500).json({ message: "Server error while updating entry." });
    }
});


module.exports = router;

