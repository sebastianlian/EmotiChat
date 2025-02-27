const mongoose = require('mongoose');

// Define the structure for a message in a conversation
const messageSchema = new mongoose.Schema( {
   sender: { type: String, enum: ['user', 'bot'], required: true },
    username: {
        type: String,
        required: function() { return this.sender === 'user'; } // ✅ Only required for users
    },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    sentimentScore: { type: Number }, // Optional, only for user messages
    magnitude: { type: Number },
    entities: [
        {
            name: String,
            sentiment: String,
            magnitude: Number,
        }
    ]
});

// Define the conversation schema
const conversationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    username: {
        type: String,
        required: function() { return this.sender === 'user'; } // ✅ Only required for users
    },
    messages: [messageSchema], // Array of msgs
});

// Export the Conversation model
module.exports = mongoose.model('Conversation', conversationSchema);