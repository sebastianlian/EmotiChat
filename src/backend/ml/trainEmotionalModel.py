import matplotlib
matplotlib.use("Agg")  # Use a non-GUI backend

import pandas as pd
import pickle
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
DB_URI = os.getenv("DB_URI")
DB_NAME = "test"  # Update this to match your DB name

# Connect to MongoDB
client = MongoClient(DB_URI)
db = client[DB_NAME]
conversation_collection = db["conversations"]

# **Step 1: Fetch the latest data from MongoDB**
cursor = conversation_collection.find({}, {"messages.sentimentScore": 1, "messages.magnitude": 1, "_id": 0})

# **Step 2: Process the data into a Pandas DataFrame**
data = []
for convo in cursor:
    for msg in convo.get("messages", []):
        if "sentimentScore" in msg:
            data.append({
                "sentimentScore": msg["sentimentScore"],
                "magnitude": msg.get("magnitude", abs(msg["sentimentScore"]))  # Default to abs(sentimentScore)
            })

df = pd.DataFrame(data)

# **Step 3: Validate and Preprocess the Data**
if df.empty:
    raise ValueError("❌ No sentiment data found in MongoDB.")

# Normalize the data (important for clustering)
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df)

# **Step 4: Train K-Means Clustering Model**
num_clusters = 9  # Adjust based on data distribution
kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
df["cluster"] = kmeans.fit_predict(df_scaled)

# **Step 5: Assign Emotions to Clusters**
cluster_means = df.groupby("cluster")[["sentimentScore", "magnitude"]].mean()

def map_cluster_to_emotion(cluster, cluster_means):
    avg_sentiment = cluster_means.loc[cluster, "sentimentScore"]
    avg_magnitude = cluster_means.loc[cluster, "magnitude"]

    # **POSITIVE HIGH-ENERGY EMOTIONS**
    if avg_sentiment > 0.6 and avg_magnitude > 1.2:
        return "Joy / Excitement"
    elif avg_sentiment > 0.3 and avg_magnitude > 2.5:
        return "Excitement / Overwhelm"
    elif avg_sentiment > 0.3:
        return "Hopefulness / Optimism"

    # **CALM / NEUTRAL STATES**
    elif avg_sentiment > 0.1 and avg_magnitude < 1.5:
        return "Contentment / Calmness"
    elif avg_sentiment > -0.1 and avg_magnitude < 1.5:
        return "Neutral / Indifference"

    # **NEGATIVE HIGH-ENERGY EMOTIONS**
    elif avg_sentiment > -0.5 and avg_magnitude > 1.5:
        return "Anxiety / Worry"
    elif avg_sentiment > -0.5:
        return "Sadness / Frustration"

    # **EXTREME NEGATIVE EMOTIONS**
    elif avg_sentiment > -1.2 and avg_magnitude < 2.0:
        return "Frustration / Irritation"
    elif avg_sentiment > -1.7 and avg_magnitude > 2.5:
        return "Panic / Overwhelm"
    else:
        return "Melancholy / Disappointment"

df["emotionalState"] = df["cluster"].apply(lambda x: map_cluster_to_emotion(x, cluster_means))

# **Step 6: Save Model & Scaler**
with open("src/backend/ml/model.pkl", "wb") as f:
    pickle.dump((kmeans, scaler), f)

print(f"\nModel trained successfully with {num_clusters} clusters!")

# **Step 7: Print Cluster Assignments**
print("\n**Cluster Centers with Emotion Assignments:**")
for i, center in enumerate(kmeans.cluster_centers_):
    emotion = map_cluster_to_emotion(i, cluster_means)
    print(f"Cluster {i}: {center} → Emotion: {emotion}")
