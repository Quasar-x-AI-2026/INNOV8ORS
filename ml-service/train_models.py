import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, IsolationForest

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")

os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_csv(os.path.join(DATA_DIR, "encoded_delhi_historical_10k.csv"))

X_mandi = df[['month', 'commodity_id', 'market_id']]
y_mandi = df['mandi_avg']
mandi_model = RandomForestRegressor(n_estimators=100, random_state=42).fit(X_mandi, y_mandi)

features_reg = ['month', 'commodity_id', 'market_id', 'mandi_avg']
X_reg = df[df['is_anomaly'] == 0][features_reg]
y_reg = df[df['is_anomaly'] == 0]['observed_price']
price_model = RandomForestRegressor(n_estimators=100, random_state=42).fit(X_reg, y_reg)

features_full = ['month', 'commodity_id', 'market_id', 'mandi_avg', 'observed_price']
X_full = df[features_full]
iso_forest = IsolationForest(contamination=0.1, random_state=42).fit(X_full)
trans_model = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_full, df['transport_issue'])
weather_model = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_full, df['weather_impact'])

joblib.dump(mandi_model, os.path.join(MODEL_DIR, "mandi_regressor.pkl"))
joblib.dump(price_model, os.path.join(MODEL_DIR, "price_regressor.pkl"))
joblib.dump(iso_forest, os.path.join(MODEL_DIR, "isolation_forest.pkl"))
joblib.dump(trans_model, os.path.join(MODEL_DIR, "transport_classifier.pkl"))
joblib.dump(weather_model, os.path.join(MODEL_DIR, "weather_classifier.pkl"))

print("Models trained and saved.")
