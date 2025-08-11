# backend/app.py
import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "career_model.pkl")
COLS_PATH = os.path.join(BASE_DIR, "feature_columns.pkl")
LE_PATH = os.path.join(BASE_DIR, "role_encoder.pkl")

app = Flask(__name__)
CORS(app)

# Load model + metadata
if not os.path.exists(MODEL_PATH):
    raise SystemExit("No model found. Run train.py first to create career_model.pkl")
model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(COLS_PATH) if os.path.exists(COLS_PATH) else None
label_encoder = joblib.load(LE_PATH) if os.path.exists(LE_PATH) else None

@app.route("/")
def index():
    return jsonify({"status": "ok", "message": "Backend running"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # If file upload: handle file (resume)
        if "resume" in request.files:
            f = request.files["resume"]
            uploads = os.path.join(BASE_DIR, "uploads")
            os.makedirs(uploads, exist_ok=True)
            file_path = os.path.join(uploads, f.filename)
            f.save(file_path)

            # TODO: parse resume -> produce feature dict matching feature_columns
            # For now return placeholder response
            return jsonify({"message": "Resume received. Resume->features parser not implemented."})

        # Otherwise treat body as JSON feature dict
        data = request.get_json(force=True)
        if not isinstance(data, dict):
            return jsonify({"error": "JSON body must be a feature dict"}), 400

        # If feature_columns saved, check & order columns
        if feature_columns:
            missing = [c for c in feature_columns if c not in data]
            if missing:
                return jsonify({"error": "Missing features", "missing": missing}), 400
            row = [data[c] for c in feature_columns]
            input_df = pd.DataFrame([row], columns=feature_columns)
        else:
            input_df = pd.DataFrame([data])

        pred = model.predict(input_df)[0]
        if label_encoder is not None:
            pred_label = label_encoder.inverse_transform([pred])[0]
        else:
            pred_label = str(pred)
        return jsonify({"prediction": pred_label})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
