from pymongo import MongoClient
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# Connect to MongoDB
MONGO_URI = "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)

# Connect to the correct database and collections
db = client["ARoma"]
feedbacks_collection = db["feedbacks"]  # Collection for user reviews
restaurants_collection = db["restaurants"]  # Collection for restaurant details

# Fetch user reviews data
reviews = list(feedbacks_collection.find({}, {"username": 1, "restaurantName": 1, "rating": 1, "_id": 0}))

# Debug: Print fetched data
print("Fetched Reviews Data:")
for review in reviews:
    print(review)

# Convert to DataFrame
reviews_df = pd.DataFrame(reviews)

# Rename columns to match expected fields
reviews_df.rename(columns={"username": "userId", "restaurantName": "restaurantId"}, inplace=True)

# Debug: Print DataFrame columns
print("\nDataFrame Columns:")
print(reviews_df.columns)

# Check if the DataFrame is empty or missing required fields
required_fields = ["userId", "restaurantId", "rating"]
if reviews_df.empty or not all(field in reviews_df.columns for field in required_fields):
    print("Error: No valid reviews found or required fields are missing.")
    print("Ensure that the feedbacks collection contains documents with 'username', 'restaurantName', and 'rating' fields.")
    exit(1)

# Drop documents without a rating (if any)
reviews_df = reviews_df.dropna(subset=['rating'])

# Check if the DataFrame is empty after dropping NaN values
if reviews_df.empty:
    print("Error: No reviews with valid ratings found.")
    exit(1)

# Pivot the DataFrame to get a user-restaurant matrix
try:
    user_restaurant_matrix = reviews_df.pivot_table(index='userId', columns='restaurantId', values='rating', fill_value=0)
    print("\nUser-Restaurant Matrix:")
    print(user_restaurant_matrix)
except KeyError as e:
    print(f"Error creating pivot table: {e}")
    print("Ensure that 'userId', 'restaurantId', and 'rating' fields exist in all documents.")
    exit(1)

# Calculate similarity matrix using cosine similarity
user_similarity = cosine_similarity(user_restaurant_matrix)
restaurant_similarity = cosine_similarity(user_restaurant_matrix.T)

def recommend_restaurants(user_id, top_n=3):
    if user_id not in user_restaurant_matrix.index:
        print(f"User '{user_id}' not found in the user-restaurant matrix.")
        return {"error": f"User '{user_id}' not found in the database."}  # Return an error object

    # Get the user's ratings
    user_ratings = user_restaurant_matrix.loc[user_id]

    # Debug: Print user's ratings
    print(f"\nRatings for user '{user_id}':")
    print(user_ratings)

    # Calculate weighted average of similar users' ratings
    similar_users = user_similarity[user_restaurant_matrix.index.get_loc(user_id)]
    weighted_ratings = user_restaurant_matrix.T.dot(similar_users)

    # Debug: Print weighted ratings
    print("\nWeighted Ratings:")
    print(weighted_ratings)

    # Filter out restaurants the user has already rated
    unrated_restaurants = weighted_ratings[user_ratings == 0]

    # Debug: Print unrated restaurants
    print("\nUnrated Restaurants:")
    print(unrated_restaurants)

    if unrated_restaurants.empty:
        print(f"No unrated restaurants found for user '{user_id}'.")
        return {"message": "No new recommendations available. You've rated all restaurants!"}  # Return a message object

    # Sort by weighted ratings
    recommended_restaurant_ids = unrated_restaurants.sort_values(ascending=False).index[:top_n]

    # Debug: Print recommended restaurant IDs
    print("\nRecommended Restaurant IDs:")
    print(recommended_restaurant_ids)

    # Fetch restaurant details, including the image
    recommended_restaurants = []
    for restaurant_id in recommended_restaurant_ids:
        restaurant = restaurants_collection.find_one({"name": restaurant_id}, {"name": 1, "rating": 1, "location": 1, "image": 1, "_id": 0})
        if restaurant:
            recommended_restaurants.append(restaurant)

    # Debug: Print final recommendations
    print(f"\nRecommendations for user '{user_id}': {recommended_restaurants}")
    return recommended_restaurants  # Return an array of recommendations

# Test the model
if __name__ == '__main__':
    user_id = "ann jay"  # Replace with actual user manually
    recommendations = recommend_restaurants(user_id)
    print(f"\nRecommendations for user '{user_id}':")
    for restaurant in recommendations:
        print(f" - {restaurant['name']} (Rating: {restaurant['rating']}, Location: {restaurant['location']}, Image: {restaurant['image']})")