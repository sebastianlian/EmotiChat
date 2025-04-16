const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
    username: { type: String, required: true },
    entry: { type: String, required: true },
    emotion: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
