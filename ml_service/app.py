from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Load the Brain
model = joblib.load('model.pkl')
model_cols = joblib.load('model_columns.pkl')

# Root route for health check
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ok",
        "message": "Ghost Churn ML service is running!"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        df = pd.DataFrame([data])

        # Feature engineering
        if 'MonthlyCharges' in df.columns and 'TotalCharges' in df.columns:
            df['ChargeVelocity'] = pd.to_numeric(df['MonthlyCharges']) / (pd.to_numeric(df['TotalCharges']) + 1)

        # Ensure all model columns exist
        for col in model_cols:
            if col not in df.columns:
                df[col] = 0

        final_df = df[model_cols]
        prediction = model.predict(final_df)[0]
        probability = model.predict_proba(final_df)[0]

        return jsonify({
            "status": "success",
            "prediction": int(prediction),
            "churn_probability": round(float(probability[1]) * 100, 2),
            "stay_probability": round(float(probability[0]) * 100, 2)
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)