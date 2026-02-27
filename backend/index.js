import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Models
import Prediction from './models/Prediction.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Environment Variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); 
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected: Ghost-Churn Cluster'))
    .catch(err => console.error(' MongoDB Connection Error:', err));

// --- HELPER FUNCTION: Remedy Logic ---
const calculateRemedy = (prediction, data) => {
    if (prediction === 0) return "Customer is stable. Maintain current engagement.";
    
    if (data.Contract_Two_year === 0) {
        return "Action Required: Offer a discounted 1-year or 2-year contract to increase loyalty.";
    } else if (data.MonthlyCharges > 80) {
        return "Action Required: High monthly bill detected. Offer a loyalty bundle.";
    } else {
        return "Action Required: Schedule a personalized check-in call.";
    }
};

// --- ROUTES ---

app.get('/', (req, res) => res.send('Ghost-Churn API is running...'));

// --- AUTHENTICATION ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
});

// --- ML PREDICTIONS ---

// 1. Single Prediction
app.post('/api/predict', async (req, res) => {
    try {
        const response = await axios.post(process.env.FLASK_URL, req.body);
        const aiResult = response.data;

        const remedy = calculateRemedy(aiResult.prediction, req.body);

        const newRecord = new Prediction({
            customerData: req.body,
            prediction: aiResult.prediction,
            churn_probability: aiResult.churn_probability,
            remedy: remedy 
        });
        await newRecord.save();

        res.json({ ...aiResult, remedy });
    } catch (error) {
        console.error("Pipeline Error:", error.message);
        res.status(500).json({ error: "Prediction failed" });
    }
});

// 2. Bulk Prediction (Excel/CSV) with Auto-Pruning
app.post('/api/predict/bulk', async (req, res) => {
    try {
        const customers = req.body; 
        const results = [];

        for (const customer of customers) {
            const aiResponse = await axios.post('http://localhost:5000/predict', customer);
            const aiData = aiResponse.data;
            const remedy = calculateRemedy(aiData.prediction, customer);

            const record = new Prediction({
                customerData: customer,
                prediction: aiData.prediction,
                churn_probability: aiData.churn_probability,
                remedy: remedy
            });
            await record.save();
            results.push({ ...customer, ...aiData, remedy });
        }

        // AUTO-PRUNING: Keeps database size under control
        const count = await Prediction.countDocuments();
        if (count > 100) {
            const oldest = await Prediction.find().sort({ timestamp: 1 }).limit(count - 100);
            const idsToDelete = oldest.map(doc => doc._id);
            await Prediction.deleteMany({ _id: { $in: idsToDelete } });
            console.log(`🧹 Pruned ${idsToDelete.length} old records.`);
        }

        res.json(results);
    } catch (error) {
        console.error("Bulk Error:", error.message);
        res.status(500).json({ error: "Bulk processing failed" });
    }
});

// 3. Prediction History
app.get('/api/history', async (req, res) => {
    try {
        const history = await Prediction.find().sort({ timestamp: -1 }).limit(20);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

// 4. Manual Clear History
app.delete('/api/history/clear', async (req, res) => {
    try {
        await Prediction.deleteMany({}); 
        res.json({ message: "Logs cleared successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear logs" });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend Server active on port ${PORT}`));