// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const app = express();
const PORT = 5000;

// Enable CORS for frontend requests
app.use(cors());

// Set up Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Resume upload endpoint
app.post("/predict", upload.single("resume"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Full path of uploaded file
    const filePath = path.join(__dirname, req.file.path);

    // Call Python script for ML prediction
    const pythonProcess = spawn("python", ["predict.py", filePath]);

    let prediction = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
        prediction += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
        // Delete uploaded file after processing
        fs.unlinkSync(filePath);

        if (code === 0) {
            res.json({ role: prediction.trim() });
        } else {
            res.status(500).json({ error: "Prediction failed", details: errorOutput });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
