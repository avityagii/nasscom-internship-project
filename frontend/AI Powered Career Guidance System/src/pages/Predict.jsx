// frontend/src/pages/Predict.jsx
import React, { useState } from "react";
import { sendFeatures, sendResumeFile } from "../services/api";

export default function Predict() {
  // Update these keys to match your model's feature names (feature_columns from train.py)
  const defaultFeatures = {
    // example numeric feature names — **replace** with your actual feature names
    "Analytical": 5,
    "Communication": 5,
    "Creativity": 5,
    "ProblemSolving": 5
  };

  const [features, setFeatures] = useState(defaultFeatures);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const onRangeChange = (k, v) => setFeatures(prev => ({ ...prev, [k]: Number(v) }));

  const predictFromFeatures = async () => {
    setLoading(true);
    setResult("");
    try {
      const data = await sendFeatures(features);
      setResult(data.prediction || JSON.stringify(data));
    } catch (err) {
      setResult("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const predictFromFile = async () => {
    if (!file) return alert("Select a resume file first");
    setLoading(true);
    setResult("");
    try {
      const data = await sendResumeFile(file);
      setResult(data.prediction || data.message || JSON.stringify(data));
    } catch (err) {
      setResult("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">AI Career Predictor</h2>

      <div className="card p-4 mb-4 shadow">
        <h5>Quick test: change skill sliders</h5>
        {Object.keys(features).map((k) => (
          <div className="mb-3" key={k}>
            <label className="form-label">{k}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={features[k]}
              onChange={(e) => onRangeChange(k, e.target.value)}
              className="form-range"
            />
            <div>{features[k]}</div>
          </div>
        ))}

        <button className="btn btn-primary" onClick={predictFromFeatures} disabled={loading}>
          {loading ? "Predicting..." : "Predict from features"}
        </button>
      </div>

      <div className="card p-4 mb-4 shadow">
        <h5>Upload your resume (PDF/DOCX)</h5>
        <input type="file" accept=".pdf,.doc,.docx" className="form-control mb-2" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn btn-success" onClick={predictFromFile} disabled={loading}>
          {loading ? "Uploading..." : "Predict from resume"}
        </button>
      </div>

      {result && (
        <div className="alert alert-info mt-3">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}
