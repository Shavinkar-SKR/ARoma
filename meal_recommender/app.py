from flask import Flask, request, jsonify
from flask_cors import CORS
from content_based import recommend_meals  # Import the content-based recommendation function
from collaborative import recommend_restaurants  # Import the collaborative filtering function

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/recommend', methods=['GET'])
def recommend():
    meal_name = request.args.get('meal_name')
    user_id = request.args.get('user_id')  # Add user_id parameter for collaborative filtering

    if not meal_name or not user_id:
        return jsonify({"error": "Please provide both 'meal_name' and 'user_id' parameters."}), 400

    # Get meal recommendations from the content-based model
    meal_recommendations = recommend_meals(meal_name)

    # Get restaurant recommendations from the collaborative filtering model
    restaurant_recommendations = recommend_restaurants(user_id)

    # Return both recommendations
    return jsonify({
        "meal_recommendations": meal_recommendations,
        "restaurant_recommendations": restaurant_recommendations
    })

if __name__ == '__main__':
    app.run(debug=True)