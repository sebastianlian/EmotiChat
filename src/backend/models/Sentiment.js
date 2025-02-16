const mongoose = require("mongoose");

const SentimentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true }, // Redundant but useful for queries
    sentimentScores: [{ type: Number }], // Array of sentiment scores
    timestamps: [{ type: Date, default: Date.now }], // Corresponding timestamps
    averageSentiment: [{ type: Number, default: 0 }] // Latest rolling avg sentiment
});

module.exports = mongoose.model("Sentiment", SentimentSchema);
