# backend/train.py
import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")

# ---- Edit filenames here if different ----
original_csv = os.path.join(DATA_DIR, "data/CareerMap- Mapping Tech Roles With Personality & Skills.csv")
synthetic_csv = os.path.join(DATA_DIR, "data/synthetic_dataset.csv")  # optional

# ---- Load CSVs ----
dfs = []
if os.path.exists(original_csv):
    dfs.append(pd.read_csv(original_csv))
if os.path.exists(synthetic_csv):
    dfs.append(pd.read_csv(synthetic_csv))

if not dfs:
    raise SystemExit("No CSV files found in backend/data/ - put your CSV(s) there")

df = pd.concat(dfs, ignore_index=True)

# ---- Specify target column name in your CSV ----
target_column = "Role"   # <--- change this if your target column has a different name

if target_column not in df.columns:
    print("Available columns:", df.columns.tolist())
    raise SystemExit(f"Target column '{target_column}' not found in CSV")

# ---- Encode target if it's text ----
le = LabelEncoder()
df[target_column] = le.fit_transform(df[target_column])

# ---- Select features (all except target). If non-numeric columns exist, handle appropriately ----
X = df.drop(columns=[target_column])
y = df[target_column]

# If there are non-numeric columns, you MUST encode them. This example only keeps numeric columns:
numeric_cols = X.select_dtypes(include=["number"]).columns.tolist()
if len(numeric_cols) < X.shape[1]:
    print("Warning: Some non-numeric columns detected. Using numeric columns only:", numeric_cols)
X = X[numeric_cols]

# ---- Split and train ----
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Logistic Regression...")
model = LogisticRegression(max_iter=2000)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Test accuracy: {acc:.4f}")

# Save model and feature column names and label encoder
model_path = os.path.join(BASE_DIR, "career_model.pkl")
cols_path = os.path.join(BASE_DIR, "feature_columns.pkl")
le_path = os.path.join(BASE_DIR, "label_encoder.pkl")

joblib.dump(model, model_path)
joblib.dump(X.columns.tolist(), cols_path)
joblib.dump(le, le_path)

print("Saved model to:", model_path)
print("Saved feature columns to:", cols_path)
print("Saved label encoder to:", le_path)
