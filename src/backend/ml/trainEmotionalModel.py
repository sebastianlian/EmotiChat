import pandas as pd
import numpy as np
import pickle
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
num_clusters = 7  # You can experiment with different values
kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
df["cluster"] = kmeans.fit_predict(df_scaled)

# Save the model and scaler
with open("src/backend/ml/model.pkl", "wb") as f:
    pickle.dump((kmeans, scaler), f)

print(f"Model trained successfully with {num_clusters} clusters!")
print("Cluster assignments preview:")
print(df.head())

# Save clustered dataset (for later analysis)
df.to_csv("src/backend/ml/clustered_sentiment_data.csv", index=False)

# Print the cluster centers
print("\nCluster Centers:")
print(kmeans.cluster_centers_)
