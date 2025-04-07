// Mapping sentiment scores & magnitude to emotional states
function mapSentimentToEmotionalState(score, magnitude) {
    if (score <= -0.6) return magnitude > 1.5 ? "Very Angry" : "Upset";
    if (score <= -0.2) return "Sad";
    if (score <= 0.2) return "Neutral";
    if (score <= 0.6) return magnitude > 1.5 ? "Excited" : "Content";
    return "Very Happy";
}

// Calc the average emotional state in the conversation
function calculateAverageEmotionalState(sentimentScores, magnitudes, averageSentiment) {
    if (!sentimentScores || sentimentScores.length === 0) return "Neutral";

    // Filter out `undefined` values
    const validSentiments = sentimentScores.filter(score => score !== undefined);
    const validMagnitudes = magnitudes.filter(mag => mag !== undefined);

    if (validSentiments.length === 0) return "Neutral";

    // Compute weighted sentiment average (recent messages count more)
    const avgSentiment = validSentiments.reduce((sum, score) => sum + score, 0) / validSentiments.length;

    // Compute the average magnitude (to adjust emotional intensity)
    const avgMagnitude = validMagnitudes.length > 0
        ? validMagnitudes.reduce((sum, mag) => sum + mag, 0) / validMagnitudes.length
        : 0;  // Default to 0 if no valid magnitudes

    // Combine weighted sentiment with `averageSentiment` for better accuracy
    const adjustedSentiment = (avgSentiment + averageSentiment) / 2;

    console.log("Final Adjusted Sentiment:", adjustedSentiment);

    // Ensure adjustedSentiment isn't NaN
    if (isNaN(adjustedSentiment)) {
        console.error("Error: Adjusted sentiment is NaN, defaulting to Neutral.");
        return "Neutral";
    }

    return mapSentimentToEmotionalState(adjustedSentiment, avgMagnitude);
}


module.exports = {
    calculateAverageEmotionalState
};
