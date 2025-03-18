const mongoose = require('mongoose');

const StrategySchema = new mongoose.Schema({
    title: { type: String, required: true },
    steps: { type: [String], required: true },  // Ensure it's an ARRAY of Strings
    completed: { type: Boolean, default: false }
});

const CopingStrategySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    overview: { type: String, required: true },
    strategies: { type: [StrategySchema], required: true }, // Fix: Ensure it's an array
    conclusion: { type: String, default: "" }
});

module.exports = mongoose.model('CopingStrategy', CopingStrategySchema);
