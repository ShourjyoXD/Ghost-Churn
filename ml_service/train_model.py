import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

# 1. Load the cleaned data
df = pd.read_csv('cleaned_data.csv')

# 2. Prepare Features and Target
X = df.drop('Churn', axis=1)
y = df['Churn']

# 3. Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train with 'class_weight' 
# Since churners are usually a minority, balanced weight helps the model not ignore them
model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)

# 5. Evaluation
y_pred = model.predict(X_test)
print("--- Model Performance ---")
print(classification_report(y_test, y_pred))


importances = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n--- Top 5 Churn Drivers ---")
print(importances.head(5))

joblib.dump(model, 'model.pkl')
joblib.dump(X.columns.tolist(), 'model_columns.pkl')

print(" 'model.pkl' and 'model_columns.pkl' created.")