from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Load the Brain
model = joblib.load('model.pkl')
model_cols = joblib.load('model_columns.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        df = pd.DataFrame([data])

        # If the frontend sends these, we calculate the velocity
        if 'MonthlyCharges' in df.columns and 'TotalCharges' in df.columns:
            df['ChargeVelocity'] = pd.to_numeric(df['MonthlyCharges']) / (pd.to_numeric(df['TotalCharges']) + 1)

        # 2. Align columns with model_columns.pkl
        # Fill missing columns with 0 and ensure correct order
        for col in model_cols:
            if col not in df.columns:
                df[col] = 0
        
        final_df = df[model_cols]

        # 3. Predict
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

if __name__ == '__main__':
    # Running on 5000. Node.js server will talk to this.
    app.run(port=5000, debug=True)