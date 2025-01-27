const tf = require('@tensorflow/tfjs');

// Initialize an in-memory context object - will have to store it into MongoDB when it works

let context = {};

const processMessage = async (message, username) => {
    // If there is no context initialize it
    if (!context[username]) {
        context[username] = [];
    }

    // Save the user's msg to the context
    context[username].push({ sender: 'user', text: message });

    // Generate a response
    let botResponse;
    if (message.toLowerCase().includes('mood')) {
        botResponse = 'It sounds like you want to discuss you mood. Can you tell me more about how you are feeling?';
    } else if (message.toLowerCase().includes('anxiety')) {
        botResponse = `Anxiety can be overwhelming. Have you tried any relaxation techniques?`;
    } else {
        botResponse = `You said: "${message}". I'm here to help with mental health topics.`;
    }

    // Save the bot's response to the context
    context[username].push({ sender: 'bot', text: botResponse });

    // Return the bot's response
    return botResponse;
};

module.exports = { processMessage };