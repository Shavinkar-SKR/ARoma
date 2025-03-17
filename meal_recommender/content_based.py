from pymongo import MongoClient
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def recommend_meals(user_id, top_n=3):
    try:
        # Connect to MongoDB
        MONGO_URI = "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/?retryWrites=true&w=majority"
        client = MongoClient(MONGO_URI)

        # Connect to the correct database
        db = client["ARoma"]

        # Fetch user purchase history from the history collection
        history_collection = db["history"]
        history = list(history_collection.find({"username": user_id}, {"food_items": 1, "_id": 0}))

        if not history:
            return {"error": f"No purchase history found for user '{user_id}'."}

        # Convert to DataFrame
        history_df = pd.DataFrame(history)

        # Explode the food_items array to get individual food items
        history_df = history_df.explode('food_items')

        # Extract relevant fields from the food_items dictionary
        history_df['name'] = history_df['food_items'].apply(lambda x: x['name'] if x else None)
        history_df['category'] = history_df['food_items'].apply(lambda x: x['category'] if x else None)

        # Drop missing values
        history_df = history_df.dropna(subset=['name', 'category'])

        # Combine features into a single string for each meal
        history_df['features'] = history_df.apply(lambda row: f"{row['name']} {row['category']}", axis=1)

        # Vectorize the features
        vectorizer = CountVectorizer()
        feature_matrix = vectorizer.fit_transform(history_df['features'])

        # Calculate similarity matrix
        similarity_matrix = cosine_similarity(feature_matrix)

        # Get the most recent meal the user purchased
        recent_meal = history_df.iloc[-1]['name']

        # Find the index of the meal
        meal_index = history_df[history_df['name'] == recent_meal].index[0]

        # Get similarity scores for the meal
        similarity_scores = list(enumerate(similarity_matrix[meal_index]))

        # Sort by similarity scores
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

        # Get top N similar meals (excluding the meal itself)
        recommended_indices = [i for i, score in similarity_scores[1:top_n+1]]

        # Prepare recommendations
        recommendations = []
        for idx in recommended_indices:
            recommendations.append({
                "name": history_df.iloc[idx]['name'],
                "category": history_df.iloc[idx]['category'],
            })

        return recommendations

    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": str(e)}

# Test the function
if __name__ == '__main__':
    user_id = "Ann Cruise"  # Replace with actual user ID
    recommendations = recommend_meals(user_id)
    print(f"\nRecommendations for user '{user_id}':")
    for meal in recommendations:
        print(f" - {meal['name']} (Category: {meal['category']})")