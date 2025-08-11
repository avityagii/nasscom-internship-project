import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a resume first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRole(res.data.role);
    } catch (err) {
      console.error(err);
      alert("Error predicting role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Career Role Prediction</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={styles.input} />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Predicting..." : "Upload & Predict"}
        </button>
      </form>
      {role && <div style={styles.result}>Predicted Role: <b>{role}</b></div>}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    marginTop: "50px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "inline-block",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    marginBottom: "10px",
    display: "block",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    fontSize: "20px",
    color: "#222",
  },
};
