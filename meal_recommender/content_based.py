from pymongo import MongoClient
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

try:
    # Connect to MongoDB
    MONGO_URI = "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(MONGO_URI)

    # Debug: List all databases
    print("Databases:")
    print(client.list_database_names())

    # Connect to the correct database
    db = client["ARoma"]

    # Debug: List all collections in the database
    print("\nCollections in 'ARoma':")
    print(db.list_collection_names())

    # Fetch meal data from the correct collection
    meals_collection = db["menus"]  # Correct collection name
    meals = list(meals_collection.find({}, {"name": 1, "description": 1, "category": 1, "price": 1, "image": 1, "restaurantId": 1, "_id": 0}))

    # Debug: Print fetched data
    print("\nFetched Data:")
    for meal in meals[:5]:  # Print only first 5 items to avoid clutter
        print(meal)

    # Convert to DataFrame
    meal_df = pd.DataFrame(meals)

    # Drop missing values
    meal_df = meal_df.dropna(subset=['name', 'description', 'category'])

    # Combine features into a single string for each meal
    meal_df['features'] = meal_df.apply(lambda row: f"{row['name']} {row['description']} {row['category']}", axis=1)

    # Vectorize the features
    vectorizer = CountVectorizer()
    feature_matrix = vectorizer.fit_transform(meal_df['features'])

    # Calculate similarity matrix
    similarity_matrix = cosine_similarity(feature_matrix)

    def recommend_meals(meal_name, top_n=3):
        if meal_name not in meal_df['name'].values:
            return {"error": f"Meal '{meal_name}' not found in the database."}

        # Find the index of the meal
        meal_index = meal_df[meal_df['name'] == meal_name].index[0]

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
                "name": meal_df.iloc[idx]['name'],
                "description": meal_df.iloc[idx]['description'],
                "category": meal_df.iloc[idx]['category'],
                "price": meal_df.iloc[idx]['price'],
                "image": meal_df.iloc[idx]['image']
            })

        return recommendations

    # Test the model
    if __name__ == '__main__':
        meal_name = "California Rolls"
        recommendations = recommend_meals(meal_name)
        print(f"\nRecommendations for '{meal_name}':")
        for meal in recommendations:
            print(f" - {meal['name']} (Category: {meal['category']}, Price: {meal['price']}, Image: {meal['image']})")

except Exception as e:
    print(f"An error occurred: {e}")
