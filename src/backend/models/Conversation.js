const mongoose = require('mongoose');

// Define the structure for a message in a conversation
const messageSchema = new mongoose.Schema( {
   sender: { type: String, enum: ['user', 'bot'], required: true },
   text: { type: String, required: true },
   timestamp: { type: Date, default: Date.now },
});

// Define the conversation schema
const conversationSchema = new mongoose.Schema({
    username: { type: String, required: true },
    messages: [messageSchema], // Array of msgs
});

// Export the Conversation model
module.exports = mongoose.model('Conversation', conversationSchema);