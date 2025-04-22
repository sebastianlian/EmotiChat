# Combined this into trainEmotionaModel.py to automate workflow
import pymongo
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DB_URI = os.getenv("DB_URI")
DB_NAME = "test"  # Update if your DB name is different

# Connect to MongoDB
client = pymongo.MongoClient(DB_URI)
db = client[DB_NAME]

# Access collections
conversation_collection = db["conversations"]

# Path to CSV
csv_path = "sentiment_data.csv"

# **Step 1: Load existing CSV to check last timestamp**
if os.path.exists(csv_path):
    existing_df = pd.read_csv(csv_path)
    if "timestamp" in existing_df.columns:
        existing_df["timestamp"] = pd.to_datetime(existing_df["timestamp"])  # Convert timestamp to datetime
        latest_timestamp = existing_df["timestamp"].max()  # Get latest timestamp in CSV
        print(f"Last processed timestamp: {latest_timestamp}")
    else:
        latest_timestamp = None
else:
    existing_df = pd.DataFrame()  # Empty DataFrame if no existing CSV
    latest_timestamp = None

# **Step 2: Fetch new data from MongoDB**
query = {} if latest_timestamp is None else {"messages.timestamp": {"$gt": latest_timestamp}}

conversation_data = conversation_collection.find(query, {"_id": 0, "username": 1, "messages": 1})

# **Step 3: Extract & Flatten Data**
new_data = []
for convo in conversation_data:
    username = convo["username"]

    for msg in convo["messages"]:
        msg_timestamp = msg.get("timestamp")

        # **Filter only user messages & new messages**
        if msg.get("sender") == "user" and (latest_timestamp is None or msg_timestamp > latest_timestamp):
            new_data.append({
                "username": username,
                "sentimentScore": msg.get("sentimentScore", 0),
                "magnitude": msg.get("magnitude", abs(msg.get("sentimentScore", 0))),
                "timestamp": msg_timestamp
            })

# **Step 4: Convert to DataFrame & Append**
if new_data:
    new_df = pd.DataFrame(new_data)
    new_df["timestamp"] = pd.to_datetime(new_df["timestamp"])  # Ensure datetime format

    # **Append to CSV if existing, else create new CSV**
    if os.path.exists(csv_path):
        new_df.to_csv(csv_path, mode='a', header=False, index=False)  # Append without headers
    else:
        new_df.to_csv(csv_path, index=False)  # Create new CSV with headers

    print(f"{len(new_data)} new messages added to {csv_path}")
else:
    print("No new data found. CSV is up to date.")

