const mongoose = require('mongoose');

const CopingStrategySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    title: { type: String, required: true },
    details: { type: String },
    order: { type: Number, required: true }, // Helps with rearranging
    completed: { type: Boolean, default: false } // Marking completion
}, { timestamps: true });

module.exports = mongoose.model('CopingStrategy', CopingStrategySchema);
