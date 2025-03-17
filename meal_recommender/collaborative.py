from pymongo import MongoClient
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def recommend_restaurants(user_id, top_n=3):
    try:
        # Connect to MongoDB
        MONGO_URI = "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/?retryWrites=true&w=majority"
        client = MongoClient(MONGO_URI)

        # Connect to the correct database and collections
        db = client["ARoma"]
        feedbacks_collection = db["feedbacks"]  # Collection for user reviews
        restaurants_collection = db["restaurants"]  # Collection for restaurant details

        # Fetch user reviews data
        reviews = list(feedbacks_collection.find({}, {"username": 1, "restaurantName": 1, "rating": 1, "_id": 0}))

        # Convert to DataFrame
        reviews_df = pd.DataFrame(reviews)

        # Rename columns to match expected fields
        reviews_df.rename(columns={"username": "userId", "restaurantName": "restaurantId"}, inplace=True)

        # Drop documents without a rating (if any)
        reviews_df = reviews_df.dropna(subset=['rating'])

        # Pivot the DataFrame to get a user-restaurant matrix
        user_restaurant_matrix = reviews_df.pivot_table(index='userId', columns='restaurantId', values='rating', fill_value=0)

        # Calculate similarity matrix using cosine similarity
        user_similarity = cosine_similarity(user_restaurant_matrix)
        restaurant_similarity = cosine_similarity(user_restaurant_matrix.T)

        if user_id not in user_restaurant_matrix.index:
            return {"error": f"User '{user_id}' not found in the database."}

        # Get the user's ratings
        user_ratings = user_restaurant_matrix.loc[user_id]

        # Calculate weighted average of similar users' ratings
        similar_users = user_similarity[user_restaurant_matrix.index.get_loc(user_id)]
        weighted_ratings = user_restaurant_matrix.T.dot(similar_users)

        # Filter out restaurants the user has already rated
        unrated_restaurants = weighted_ratings[user_ratings == 0]

        if unrated_restaurants.empty:
            return {"message": "No new recommendations available. You've rated all restaurants!"}

        # Sort by weighted ratings
        recommended_restaurant_ids = unrated_restaurants.sort_values(ascending=False).index[:top_n]

        # Fetch restaurant details, including the image
        recommended_restaurants = []
        for restaurant_id in recommended_restaurant_ids:
            restaurant = restaurants_collection.find_one({"name": restaurant_id}, {"name": 1, "rating": 1, "location": 1, "image": 1, "_id": 0})
            if restaurant:
                recommended_restaurants.append(restaurant)

        return recommended_restaurants

    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": str(e)}

# Test the function
if __name__ == '__main__':
    user_id = "Ann Cruise"  # Replace with actual user ID
    recommendations = recommend_restaurants(user_id)
    print(f"\nRecommendations for user '{user_id}':")
    for restaurant in recommendations:
        print(f" - {restaurant['name']} (Rating: {restaurant['rating']}, Location: {restaurant['location']}, Image: {restaurant['image']})")