const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    sentimentScore: Number,
    timestamp: Date,
    description: String
});

anomalySchema.index({ username: 1, sentimentScore: 1, timestamp: 1 }, { unique: true });


module.exports = mongoose.model('Anomaly', anomalySchema);
