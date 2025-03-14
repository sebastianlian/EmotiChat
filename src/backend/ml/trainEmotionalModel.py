import matplotlib
matplotlib.use("Agg")  # Use a non-GUI backend

import pandas as pd
import numpy as np
import pickle
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


# Load the preprocessed dataset
df = pd.read_csv("src/backend/ml/sentiment_data.csv")

# Keep only necessary columns (sentiment score & magnitude)
df = df[["sentimentScore", "magnitude"]]

# Normalize the data (important for clustering)
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df)

# Train K-Means clustering model
num_clusters = 9  # Adjust based on data size & distribution
kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
df["cluster"] = kmeans.fit_predict(df_scaled)

# **Analyze Cluster Characteristics**
cluster_means = df.groupby("cluster")[["sentimentScore", "magnitude"]].mean()
print("\nCluster Analysis (Mean Sentiment Scores & Magnitudes):")
print(cluster_means)

# 🏷 **Improved Emotion Assignment Based on Sentiment & Magnitude**
def map_cluster_to_emotion(cluster, cluster_means):
    avg_sentiment = cluster_means.loc[cluster, "sentimentScore"]
    avg_magnitude = cluster_means.loc[cluster, "magnitude"]

    # **POSITIVE HIGH-ENERGY EMOTIONS**
    if avg_sentiment > 0.6 and avg_magnitude > 1.2:
        return "Joy / Excitement"  # High positivity, high intensity
    elif avg_sentiment > 0.3 and avg_magnitude > 2.5:
        return "Excitement / Overwhelm"  # Extremely intense positivity
    elif avg_sentiment > 0.3:
        return "Hopefulness / Optimism"  # Mild-to-moderate positivity

    # **CALM / NEUTRAL STATES**
    elif avg_sentiment > 0.1 and avg_magnitude < 1.5:
        return "Contentment / Calmness"  # Mild positivity, low intensity
    elif avg_sentiment > -0.1 and avg_magnitude < 1.5:
        return "Neutral / Indifference"

    # **NEGATIVE HIGH-ENERGY EMOTIONS**
    elif avg_sentiment > -0.5 and avg_magnitude > 1.5:
        return "Anxiety / Worry"  #  Moderate negativity, high intensity
    elif avg_sentiment > -0.5:
        return "Sadness / Frustration"  # Mild negativity

    # **EXTREME NEGATIVE EMOTIONS**
    elif avg_sentiment > -1.2 and avg_magnitude < 2.0:
        return "Frustration / Irritation"  # Persistent frustration
    elif avg_sentiment > -1.7 and avg_magnitude > 2.5:
        return "Panic / Overwhelm"  # Extreme negativity, high intensity
    else:
        return "Melancholy / Disappointment"  # Deep sadness


# Apply new mapping logic
df["emotionalState"] = df["cluster"].apply(lambda x: map_cluster_to_emotion(x, cluster_means))

# Save the model & scaler
with open("src/backend/ml/model.pkl", "wb") as f:
    pickle.dump((kmeans, scaler), f)

print(f"\nModel trained successfully with {num_clusters} clusters!")
print("Cluster assignments preview:")
print(df.head())

# Save clustered dataset (for later analysis)
df.to_csv("src/backend/ml/clustered_sentiment_data.csv", index=False)

import matplotlib.pyplot as plt

# Visualizing clusters
plt.figure(figsize=(8, 6))
scatter = plt.scatter(df["sentimentScore"], df["magnitude"], c=df["cluster"], cmap="viridis", alpha=0.6)
plt.colorbar(label="Cluster")
plt.xlabel("Sentiment Score")
plt.ylabel("Magnitude")
plt.title("Sentiment Clusters - Emotion Mapping")

# Label each cluster with its assigned emotion
for i, center in enumerate(kmeans.cluster_centers_):
    plt.text(center[0], center[1], f'Cluster {i}', fontsize=12, color='red', fontweight='bold')

plt.show()


# Print the cluster centers with emotions assigned
print("\n**Cluster Centers with Emotion Assignments:**")
for i, center in enumerate(kmeans.cluster_centers_):
    emotion = map_cluster_to_emotion(i, cluster_means)
    print(f"Cluster {i}: {center} → Emotion: {emotion}")
