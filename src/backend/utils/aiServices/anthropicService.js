const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper function for exponential backoff retry
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateResponse(userMessage) {
    const messages = [{ role: 'user', content: userMessage }];
    const maxRetries = 5;  // Increase retries to 5
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            console.log(`Attempt ${attempts + 1} to generate AI response...`);

            // Make API call with a timeout of 15 seconds
            const response = await Promise.race([
                anthropicClient.messages.create({
                    messages,
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 300,
                    temperature: 0.7,
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Claude AI request timeout!")), 15000) // Timeout after 15 sec
                )
            ]);

            // Extract the `text` content from the response
            const botText = response.content[0].text || "I'm here to help. Could you tell me more?";
            console.log("AI Response:", botText);
            return botText;

        } catch (error) {
            attempts++;

            // Check if Claude AI is overloaded (529) and has the `x-should-retry` header
            const shouldRetry = error.response?.status === 529 && error.response?.headers?.['x-should-retry'] === 'true';

            if (shouldRetry && attempts < maxRetries) {
                console.warn(`Claude AI Overloaded (Attempt ${attempts}/${maxRetries}) - Retrying in ${2 ** attempts} sec...`);
                await delay(2000 * (2 ** attempts)); // Wait 2s, 4s, 8s, 16s, 32s before retrying
            } else {
                console.error("Final Error in Claude API request:", error.message);
                break; // Exit loop if it's another type of error or max retries reached
            }
        }
    }

    console.error("Claude AI is still overloaded. Returning fallback message.");
    return "I'm experiencing a high volume of requests right now. Please try again later. 💙";
}

module.exports = { generateResponse };
