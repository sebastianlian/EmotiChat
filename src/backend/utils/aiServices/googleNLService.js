// This service is used to analyze sentiment and entities using Google Cloud Natural Language API.
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

async function analyzeSentimentAndEntities(message) {
    const document = {
        content: message,
        type: 'PLAIN_TEXT',
    };

    // Sentiment Analysis
    const [sentimentResult] = await client.analyzeSentiment({ document });
    const sentiment = sentimentResult.documentSentiment;

    // Entity Analysis
    const [entityResult] = await client.analyzeEntities({ document });

    return {
        score: sentiment.score,
        magnitude: sentiment.magnitude,
        entities: entityResult.entities.map(entity => ({
            name: entity.name,
            type: entity.type,
            salience: entity.salience
        }))
    };
}

module.exports = { analyzeSentimentAndEntities };