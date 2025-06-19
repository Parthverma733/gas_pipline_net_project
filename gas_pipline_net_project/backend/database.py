from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId
import os

MONGO_DETAILS = os.getenv('MONGO_URI', 'mongodb+srv://spidyxv2:spidyxv2@cluster0.6swlpp0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client['optimal_gas_pipeline']
maps_collection = database.get_collection('maps')

# Helper to serialize MongoDB document
def map_helper(map_doc):
    return {
        "id": str(map_doc.get("_id")),
        "map_id": map_doc.get("map_id"),
        "gasStations": map_doc.get("gasStations", []),
        "houses": map_doc.get("houses", []),
        "timestamp": map_doc.get("timestamp")
    }

async def fetch_map(map_id: int):
    map_doc = await maps_collection.find_one({"map_id": map_id})
    if map_doc:
        return map_helper(map_doc)
    return None

async def fetch_all_maps():
    maps = []
    async for doc in maps_collection.find().sort("timestamp", 1):
        maps.append(map_helper(doc))
    return maps

async def insert_or_update_map(map_id: int, gasStations, houses, timestamp):
    existing = await maps_collection.find_one({"map_id": map_id})
    if existing:
        # Only update if data is different
        if existing["gasStations"] != gasStations or existing["houses"] != houses:
            await maps_collection.update_one(
                {"map_id": map_id},
                {"$set": {"gasStations": gasStations, "houses": houses, "timestamp": timestamp}}
            )
            return True  # Updated
        return False  # No update needed
    else:
        # If more than 2 maps, delete the oldest
        count = await maps_collection.count_documents({})
        if count >= 3:
            oldest = await maps_collection.find().sort("timestamp", 1).to_list(1)
            if oldest:
                await maps_collection.delete_one({"_id": oldest[0]["_id"]})
        await maps_collection.insert_one({
            "map_id": map_id,
            "gasStations": gasStations,
            "houses": houses,
            "timestamp": timestamp
        })
        return True  # Inserted 