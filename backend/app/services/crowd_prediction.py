# backend/app/services/crowd_prediction.py
import pandas as pd
import lightgbm as lgb
import joblib
from pathlib import Path

# Define file paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "crowd_forecaster.pkl"
DATA_PATH = BASE_DIR / "historical_data.csv"

def train_model():
    """Reads the CSV, trains the model, and saves it."""
    print("Starting model training...")
    df = pd.read_csv(DATA_PATH)
    
    df = df.drop(columns=['Full Name'])
    df['Visit Date'] = pd.to_datetime(df['Visit Date'])
    df['day_of_week'] = df['Visit Date'].dt.dayofweek
    df['month'] = df['Visit Date'].dt.month
    
    categorical_features = ['Age Group', 'Time Slot', 'Visit Purpose', 'Mode of Travel', 'Special Day Type']
    df_processed = pd.get_dummies(df, columns=categorical_features, drop_first=True)
    
    features = [col for col in df_processed.columns if col not in ['Visit Date', 'Crowd Level']]
    target = 'Crowd Level'
    
    X = df_processed[features]
    y = df_processed[target]

    model = lgb.LGBMRegressor(random_state=42)
    model.fit(X, y)

    joblib.dump({'model': model, 'columns': features}, MODEL_PATH)
    print(f"Model training complete. Saved to {MODEL_PATH}")

def get_crowd_forecast(date_str: str, time_slot: str, special_day: str) -> int:
    """Predicts the crowd level for a single future time slot."""
    try:
        saved_model_data = joblib.load(MODEL_PATH)
        model = saved_model_data['model']
        training_columns = saved_model_data['columns']

        future_date = pd.to_datetime(date_str)
        input_data = {
            'Visit Date': [future_date], 'Time Slot': [time_slot], 'Special Day Type': [special_day],
            'Age Group': ['20-40'], 'Visit Purpose': ['Pilgrimage'], 'Group Size': [2],
            'Mode of Travel': ['Car'], 'Waiting Tolerance': [3]
        }
        input_df = pd.DataFrame(input_data)
        
        input_df['day_of_week'] = input_df['Visit Date'].dt.dayofweek
        input_df['month'] = input_df['Visit Date'].dt.month
        input_processed = pd.get_dummies(input_df, columns=['Age Group', 'Time Slot', 'Visit Purpose', 'Mode of Travel', 'Special Day Type'])
        
        final_input = pd.DataFrame(columns=training_columns)._append(input_processed, sort=False).fillna(0)
        final_input = final_input[training_columns]

        prediction = model.predict(final_input)
        return int(prediction[0])

    except FileNotFoundError:
        return -999
    except Exception as e:
        print(f"Error during forecast: {e}")
        return -1

# --- NEW FUNCTION FOR DAILY CHART DATA ---
def get_daily_forecast_chart_data(date_str: str, special_day: str) -> dict:
    """
    Generates a full day's forecast data by predicting for each time slot.
    """
    # These are the time slots from your dataset
    time_slots = ['5-8 AM', '8-11 AM', '11-2 PM', '2-5 PM', '5-8 PM']
    
    chart_labels = []
    chart_data_points = []

    # Loop through each time slot and get a prediction
    for slot in time_slots:
        predicted_level = get_crowd_forecast(
            date_str=date_str,
            time_slot=slot,
            special_day=special_day
        )
        
        # Only add valid predictions to the chart data
        if predicted_level >= 0:
            chart_labels.append(slot)
            chart_data_points.append(predicted_level)
            
    return {
        "labels": chart_labels,
        "data": chart_data_points
    }

if __name__ == '__main__':
    train_model()