import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

mandi_reg = joblib.load(os.path.join(MODEL_DIR, "mandi_regressor.pkl"))
price_reg = joblib.load(os.path.join(MODEL_DIR, "price_regressor.pkl"))
iso_forest = joblib.load(os.path.join(MODEL_DIR, "isolation_forest.pkl"))
trans_clf = joblib.load(os.path.join(MODEL_DIR, "transport_classifier.pkl"))
weather_clf = joblib.load(os.path.join(MODEL_DIR, "weather_classifier.pkl"))

def analyze_market_data(month, commodity_id, market_id, actual_price):
    mandi_val = float(mandi_reg.predict([[month, commodity_id, market_id]])[0])
    expected_price = float(price_reg.predict([[month, commodity_id, market_id, mandi_val]])[0])

    feat = [[month, commodity_id, market_id, mandi_val, actual_price]]
    is_outlier = iso_forest.predict(feat)[0]
    ratio = actual_price / expected_price

    is_anomaly = (is_outlier == -1) or (ratio > 1.3)

    reason = "Consistent Market Price"
    if is_anomaly:
        if trans_clf.predict(feat)[0]:
            reason = "Transport/Supply Chain Disruption"
        elif weather_clf.predict(feat)[0]:
            reason = "Severe Weather Impact"
        else:
            reason = "Potential Market Hoarding"

    return {
        "mandi_benchmark": round(mandi_val, 2),
        "expected_price": round(expected_price, 2),
        "is_anomaly": bool(is_anomaly),
        "reason": reason,
        "deviation": f"{round((ratio - 1) * 100, 1)}%"
    }
