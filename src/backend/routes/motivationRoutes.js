const express = require('express');
const router = express.Router();
const { join } = require("path");
const { readFileSync } = require("fs");

router.get("/:username", (req, res) => {
    try {
        const filePath = join(__dirname, '../data/motivational_msgs.txt');
        const messages = readFileSync(filePath, 'utf8').split('\n').filter(msg => msg.trim() !== '');
        const random = messages[Math.floor(Math.random() * messages.length)];
        res.json({ quote: random });
    } catch (err) {
        console.error("Error loading motivation:", err);
        res.status(500).json({ message: "Keep going — you're doing great!" });
    }
});

module.exports = router;
