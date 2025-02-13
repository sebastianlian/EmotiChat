// This communicates with Anthropic’s API to generate responses based on user messages.

const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateResponse(userMessage) {
    const messages = [
        { role: 'user', content: userMessage }
    ];

    try {
        const response = await anthropicClient.messages.create({
            messages,
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 300,
            temperature: 0.7,
        });

        // Extract the `text` content from the response
        const botText = response.content[0].text || "I'm here to help. Could you tell me more?";
        console.log("Bot Text:", botText);  // Verify in logs
        return botText;
    } catch (error) {
        console.error('Error in generateResponse with Claude:', error);
        throw error;
    }
}


module.exports = { generateResponse };
