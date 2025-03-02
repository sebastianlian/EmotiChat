import pickle
import numpy as np

# Load Trained Model
try:
    with open("src/backend/ml/model.pkl", "rb") as f:
        loaded_data = pickle.load(f)

    if isinstance(loaded_data, tuple) and len(loaded_data) == 2:
        model, label_encoder = loaded_data  # Unpack the model and label encoder
    else:
        raise ValueError("Invalid model.pkl structure! Expected a tuple (model, label_encoder).")

except FileNotFoundError:
    print("Error: model.pkl file not found! Ensure the training script has been run.")
    model, label_encoder = None, None  # Prevent crashing if file is missing
except Exception as e:
    print(f"Error loading model: {e}")
    model, label_encoder = None, None

def map_cluster_to_emotion(cluster):
    """Maps a KMeans cluster label to an emotional state."""
    cluster_emotion_map = {
        0: "Neutral / Indifference",
        1: "Sadness / Frustration",
        2: "Happiness / Excitement",
        3: "Anger / Distress",
        4: "Anxiety / Nervousness",
        5: "Contentment",
        6: "Disappointment / Worry"
    }
    return cluster_emotion_map.get(cluster, "Unknown")

def predict_emotional_state(sentiment_score, magnitude):
    """Predicts emotional state based on sentiment score & magnitude."""
    if model is None:
        return "Model not loaded. Please retrain."

    features = np.array([[float(sentiment_score), float(magnitude)]])  # Ensure correct input format

    # Predict Cluster
    prediction = model.predict(features)

    # Convert cluster to emotion label
    predicted_emotion = map_cluster_to_emotion(prediction[0])

    return predicted_emotion

# Example usage for testing
if __name__ == "__main__":
    test_sentiment_score = -0.36
    test_magnitude = 1.2
    emotion = predict_emotional_state(test_sentiment_score, test_magnitude)
    print(f"Predicted Emotional State: {emotion}")
