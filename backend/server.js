import dotenv from 'dotenv';

dotenv.config(); 

import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import cors from 'cors';

const app = express();
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This tells dotenv to look specifically in the current folder for .env
dotenv.config({ path: path.join(__dirname, '.env') });
// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected: Ghost-Churn Cluster'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Test Route
app.get('/', (req, res) => {
    res.send('Ghost-Churn API is running...');
});

// Bridge to Python AI
app.post('/api/predict', async (req, res) => {
    try {
        // We forward the web form data to our Flask service on port 5000
        const response = await axios.post('http://localhost:5000/predict', req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Flask Error:", error.message);
        res.status(500).json({ error: "Intelligence Layer (Python) is unreachable." });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Backend Server active on port ${PORT}`);
});