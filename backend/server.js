import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Prediction from './models/Prediction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single, clean config call
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected: Ghost-Churn Cluster'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => res.send('Ghost-Churn API is running...'));

// Bridge to Python AI + MongoDB Save
app.post('/api/predict', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5000/predict', req.body);
        const aiResult = response.data;

        // Save to Database
        const newRecord = new Prediction({
            customerData: req.body,
            prediction: aiResult.prediction,
            churn_probability: aiResult.churn_probability
        });
        await newRecord.save();

        res.json(aiResult);
    } catch (error) {
        console.error("Pipeline Error:", error.message);
        res.status(500).json({ error: "Storage or Prediction failed" });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        const history = await Prediction.find().sort({ timestamp: -1 }).limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend Server active on port ${PORT}`));