import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
    customerData: {
        tenure: Number,
        MonthlyCharges: Number,
        TotalCharges: Number,
        Contract_Two_year: Number,
        InternetService_Fiber_optic: Number
    },
    prediction: Number,
    churn_probability: Number,
    remedy: String, 
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('Prediction', PredictionSchema);