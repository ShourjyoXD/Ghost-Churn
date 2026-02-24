import pandas as pd
import numpy as np

def clean_data(file_path='data.csv'):
    # 1. Load Data with sniffing
    df = pd.read_csv(file_path, sep=None, engine='python')
    df.columns = df.columns.str.strip()

    # 2. Force Numeric 'TotalCharges'
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())

    # 3. Handle Binary Columns (Yes/No, Male/Female)
    # This covers 'gender' and all the 'Yes/No' services
    binary_map = {'Yes': 1, 'No': 0, 'Male': 1, 'Female': 0, 'No internet service': 0, 'No phone service': 0}
    
    # Apply mapping to every column that is currently an 'object' (string)
    for col in df.select_dtypes(include=['object']).columns:
        if col != 'customerID': 
            df[col] = df[col].replace(binary_map)

    # 4. Feature Engineering
    df['ChargeVelocity'] = df['MonthlyCharges'] / (df['TotalCharges'] + 1)
    
    # 5. One-Hot Encoding for remaining text (Contract, PaymentMethod, etc.)
    # This converts remaining strings into 1s and 0s automatically
    text_cols = df.select_dtypes(include=['object']).columns.tolist()
    if 'customerID' in text_cols: text_cols.remove('customerID')
    
    df = pd.get_dummies(df, columns=text_cols, drop_first=True)

    # 6. Final Cleanup
    if 'customerID' in df.columns:
        df.drop('customerID', axis=1, inplace=True)

    # 7. Save
    df.to_csv('cleaned_data.csv', index=False)
    print(f"✅ Success! All strings converted. Shape: {df.shape}")
    
    # VERIFICATION: This must print an empty list
    remaining_strings = df.select_dtypes(include=['object']).columns.tolist()
    print(f"Remaining string columns: {remaining_strings}")

    if 'Churn_Yes' in df.columns:
        df.rename(columns={'Churn_Yes': 'Churn'}, inplace=True)
    elif 'Churn_1' in df.columns:
        df.rename(columns={'Churn_1': 'Churn'}, inplace=True)

    # 7. Save
    df.to_csv('cleaned_data.csv', index=False)
    print(f"Success! Data is ready. Target 'Churn' is in columns.")

if __name__ == "__main__":
    clean_data()