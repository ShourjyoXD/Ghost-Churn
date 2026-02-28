👻 Ghost-Churn Analytics
An End-to-End Predictive Maintenance Platform for Customer Retention.

Ghost-Churn is a sophisticated MLOps application designed to predict customer churn using Machine Learning. It features a React-based executive dashboard, a Node.js/Express orchestration layer, and a Python Flask microservice for real-time AI inference.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS (Lucide Icons), Axios, XLSX (Excel Processing).

Backend: Node.js, Express.js, JWT Authentication, Mongoose.

AI Service: Python, Flask, Scikit-Learn, Joblib, Pandas.

Database: MongoDB Atlas.

Deployment: Vercel (Frontend), Render (Backend & ML).

✨ Key Features
AI-Powered Predictions: Real-time churn analysis with probability scoring.

Enterprise Bulk Upload: Process thousands of customer records instantly via Excel (.xlsx) upload.

Smart Remedies: AI-driven suggestions for customer retention based on specific risk factors.

Secure Audit Log: Persistent history of all predictions tied to user accounts via JWT.

Auto-Pruning: Automatic database maintenance to keep history logs optimized.

🏗️ System Architecture
The project follows a Microservices Architecture:

Client Layer: React handles the UI and processes Excel data locally before sending it to the API.

Orchestration Layer: Node.js handles Auth (Login/Register) and stores prediction metadata in MongoDB.

Inference Layer: Flask hosts the Scikit-Learn model (model.pkl) and returns the mathematical prediction.

💻 Local Setup
1. Clone the repository
Bash
git clone https://github.com/your-username/ghost-churn.git
cd ghost-churn
2. Configure Backend (.env)
Create a .env in the /backend folder:

Plaintext
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
FLASK_URL=http://127.0.0.1:5000
PORT=8000
3. Configure Frontend (.env)
Create a .env in the /frontend folder:

Plaintext
REACT_APP_API_URL=http://localhost:8000
4. Run the services
ML Service: python app.py (in /ml_service)

Backend: npm run dev (in /backend)

Frontend: npm start (in /frontend)

📊 Model Information
The underlying model is a Random Forest Classifier trained on the Telco Churn Dataset. It evaluates features like tenure, contract type, and monthly charges to determine the likelihood of a customer leaving the service.

🛡️ License
Distributed under the MIT License. See LICENSE for more information.