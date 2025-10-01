# backend/app/routers/crowd_prediction.py
from fastapi import APIRouter, HTTPException
# Import both service functions
from ..services.crowd_prediction import get_crowd_forecast, get_daily_forecast_chart_data

router = APIRouter()

# --- NEW ENDPOINT FOR THE DAILY FORECAST CHART ---
@router.get("/forecast/daily")
def get_daily_forecast(date: str, special_day: str):
    """
    Provides a full day's crowd forecast, formatted for a chart.
    - date: YYYY-MM-DD
    - special_day: 'Normal Day', 'Festival', 'Tuesday/Friday Peak'
    Example: /api/forecast/daily?date=2025-11-10&special_day=Festival
    """
    chart_data = get_daily_forecast_chart_data(date_str=date, special_day=special_day)
    
    if not chart_data["labels"]:
         raise HTTPException(status_code=500, detail="Could not generate forecast data.")

    return {
        "forecast_date": date,
        "special_day_type": special_day,
        "chart_data": chart_data
    }


# --- ORIGINAL ENDPOINT FOR SINGLE PREDICTIONS (OPTIONAL) ---
@router.get("/forecast")
def get_single_forecast(date: str, time_slot: str, special_day: str):
    """
    Forecasts crowd level for a single, specific time slot.
    """
    predicted_level = get_crowd_forecast(date_str=date, time_slot=time_slot, special_day=special_day)
    
    if predicted_level == -999:
        raise HTTPException(status_code=503, detail="Model is not trained yet.")
    if predicted_level == -1:
        raise HTTPException(status_code=500, detail="Error during prediction.")

    status = "Low"
    if 100 < predicted_level <= 200:
        status = "Medium"
    elif predicted_level > 200:
        status = "High"
    
    return {
        "forecast_date": date, "time_slot": time_slot, "special_day_type": special_day,
        "predicted_crowd_level": predicted_level, "status": status
    }