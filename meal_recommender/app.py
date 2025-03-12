from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from content_based import recommend_meals

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/recommend', methods=['GET'])
def recommend():
    meal_name = request.args.get('meal_name')
    if not meal_name:
        return jsonify({"error": "Please provide a 'meal_name' parameter."}), 400

    recommendations = recommend_meals(meal_name)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
