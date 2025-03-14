import pickle
import sys
import numpy as np
import os
import pandas as pd  # 🔥 Add pandas to format input correctly

# Get absolute path to model.pkl
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")

try:
    with open(model_path, "rb") as f:
        loaded_data = pickle.load(f)
        if isinstance(loaded_data, tuple) and len(loaded_data) == 2:
            model, scaler = loaded_data  # Unpack KMeans model & scaler
        else:
            raise ValueError("Invalid model.pkl structure! Expected a tuple (model, scaler).")
except FileNotFoundError:
    print(f"❌ Error: model.pkl file not found at {model_path}! Ensure the training script has been run.")
    model, scaler = None, None

def map_cluster_to_emotion(cluster):
    """Maps a KMeans cluster label to an emotional state."""
    cluster_emotion_map = {
        0: "Neutral / Indifference",
        1: "Anxiety / Worry",
        2: "Joy / Excitement",
        3: "Panic / Overwhelm",
        4: "Sadness / Grief",
        5: "Contentment / Calmness",
        6: "Frustration / Irritation",
        7: "Melancholy / Disappointment",  # Added missing Cluster 7
        8: "Hopefulness / Optimism"  # Added Cluster 8 for full coverage
    }
    return cluster_emotion_map.get(cluster, "Unknown")

def predict_emotional_state(sentiment_score, magnitude):
    """Predicts emotional state based on sentiment score & magnitude."""
    if model is None or scaler is None:
        return "❌ Model not loaded. Please retrain."

    # Pass column names to match scaler training format
    features = pd.DataFrame([[float(sentiment_score), float(magnitude)]], columns=["sentimentScore", "magnitude"])

    # Apply the same scaling as during training
    scaled_features = scaler.transform(features)  # Ensures input is correctly normalized

    # Predict Cluster
    cluster = model.predict(scaled_features)[0]

    # Convert cluster to emotion label
    predicted_emotion = map_cluster_to_emotion(cluster)

    # Debugging Output
    print(f"Sentiment Score: {sentiment_score}, Magnitude: {magnitude}")
    print(f"Predicted Cluster: {cluster}")
    print(f"Predicted Emotion: {predicted_emotion}")

    return predicted_emotion

# Accept input arguments from command line (for Node.js integration)
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python emotionPredictor.py <sentiment_score> <magnitude>")
        sys.exit(1)

    sentiment_score = float(sys.argv[1])
    magnitude = float(sys.argv[2])

    emotion = predict_emotional_state(sentiment_score, magnitude)
    print(emotion)  # This will be captured in Node.js

    # Run test cases to validate model output
    test_cases = [
        (0.8, 0.2),    # Should return Contentment
        (-0.7, 0.8),   # Should return Anxiety / Worry
        (-1.9, 3.0),   # Should return Panic / Overwhelm
        (1.5, 1.2),    # Should return Joy / Excitement
        (-0.5, 0.2),   # Should return Melancholy / Disappointment
        (-0.2, 2.5),   # Should return Hopefulness / Optimism
    ]

    print("\nRunning Emotional State Prediction Tests...\n")

    for score, mag in test_cases:
        emotion = predict_emotional_state(score, mag)
        print(f"Sentiment Score: {score}, Magnitude: {mag} → Predicted Emotion: {emotion}")
