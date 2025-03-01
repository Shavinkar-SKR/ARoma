import pandas as pd
import numpy as np
import re
import joblib
import nltk

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder, SimpleImputer
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from xgboost import XGBRegressor

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Ensure required NLTK data is available
nltk.download('stopwords')
nltk.download('wordnet')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# === Helper Function: Clean Ingredients Text ===
def clean_ingredients(text):
    if pd.isna(text): 
        return ''
    text = re.sub(r'\b\d+[/\d\s]*\b', '', text.lower())  # Remove quantities
    words = [lemmatizer.lemmatize(w) for w in re.findall(r'\b[a-z]+\b', text) if w not in stop_words and len(w) > 2]
    return ' '.join(words)

# === Helper Function: Convert Time to Minutes ===
def convert_time(time_str):
    if pd.isna(time_str): 
        return np.nan
    total = 0
    total += sum(int(d) * 1440 for d in re.findall(r'(\d+)\s*d', time_str, re.IGNORECASE))
    total += sum(int(h) * 60 for h in re.findall(r'(\d+)\s*h', time_str, re.IGNORECASE))
    total += sum(int(m) for m in re.findall(r'(\d+)\s*m', time_str, re.IGNORECASE))
    return total or np.nan

# === Feature Extraction Logic ===
def extract_features(df):
    time_features = ['total', 'prep', 'cook']
    for feature in time_features:
        df[f'{feature}_time'] = df['process'].apply(
            lambda x: convert_time(re.search(fr'{feature}:\s*([\w\s]+)', x, re.IGNORECASE).group(1))
            if pd.notna(x) and re.search(fr'{feature}:', x, re.IGNORECASE) else np.nan
        )
    
    df['servings'] = pd.to_numeric(df['process'].str.extract(r'Servings:\s*(\d+)', re.IGNORECASE)[0], errors='coerce')
    
    df['time_per_serving'] = df['total_time'] / (df['servings'] + 1e-6)
    df['cook_prep_ratio'] = df['cook_time'] / (df['prep_time'] + 1e-6)

    df['clean_ingredients'] = df['ingredient'].apply(clean_ingredients)
    df['summary_clean'] = df['summary'].str.lower().str.replace(r'[^a-z\s]', '', regex=True)

    df['num_ingredients'] = df['clean_ingredients'].str.count(' ') + 1
    df['ingredient_diversity'] = df['clean_ingredients'].apply(
        lambda x: len(set(x.split())) / (len(x.split()) + 1e-6) if x else 0
    )
    return df.dropna(subset=['total_time']).reset_index(drop=True)

# === Load Dataset & Apply Preprocessing ===
df = pd.read_excel('dataset_orderTimePrediction3.xlsx')
df = extract_features(df)

# === Features and Target Separation ===
y = df['total_time']
X = df.drop(columns=['total_time'])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# === ColumnTransformer Definition ===
preprocessor = ColumnTransformer([
    ('text_ingredients', TfidfVectorizer(max_features=300, ngram_range=(1, 2)), 'clean_ingredients'),
    ('text_summary', TfidfVectorizer(max_features=150, stop_words='english'), 'summary_clean'),
    ('num', SimpleImputer(strategy='median'), 
        ['rating', 'n_rater', 'n_reviewer', 'servings', 
         'prep_time', 'cook_time', 'num_ingredients', 
         'time_per_serving', 'cook_prep_ratio', 'ingredient_diversity']),
    ('cat', OneHotEncoder(handle_unknown='ignore'), ['group'])
])

# === Model Pipeline ===
model_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', XGBRegressor(objective='reg:squarederror', random_state=42, n_jobs=-1))
])

# === Hyperparameter Grid ===
param_grid = {
    'regressor__n_estimators': [300, 500],
    'regressor__learning_rate': [0.01, 0.05],
    'regressor__max_depth': [5, 7],
    'regressor__subsample': [0.8, 1.0],
    'regressor__colsample_bytree': [0.8, 1.0]
}

# === Grid Search with Cross Validation ===
grid_search = GridSearchCV(
    model_pipeline,
    param_grid,
    cv=3,
    scoring='neg_root_mean_squared_error',
    verbose=2
)

grid_search.fit(X_train, y_train)

# === Save Best Model ===
best_model = grid_search.best_estimator_
joblib.dump(best_model, 'recipe_time_predictor.pkl')

# === Evaluation on Test Set ===
y_pred = best_model.predict(X_test)

print(f"Optimized RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")
print(f"Optimized MAE: {mean_absolute_error(y_test, y_pred):.2f}")
print(f"Optimized R²: {r2_score(y_test, y_pred):.2f}")

# === Error Analysis ===
error_df = pd.DataFrame({
    'actual': y_test,
    'predicted': y_pred,
    'error': np.abs(y_pred - y_test)
}).join(X_test.reset_index(drop=True))

print("\nTop 5 Worst Predictions:")
print(error_df.nlargest(5, 'error')[['group', 'actual', 'predicted', 'error', 'clean_ingredients']])

