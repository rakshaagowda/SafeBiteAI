# backend/utils.py

from typing import Dict, Any, List, Optional
from backend.db import log_prediction, get_weekly_risks, get_meals

# -------------------- Prediction Logging -------------------- #
def save_prediction_to_db(
    filename: str,
    food: str,
    sickness: Optional[Dict[str, Any]] = None,
    user_id: Optional[str] = None,
    blood_sugar: Optional[float] = None,
    electrolytes: Optional[str] = None,
    symptoms: Optional[str] = None
) -> None:
    """
    Store sickness prediction results in PostgreSQL.
    sickness = {'risk_level': ..., 'sickness_probability': ...}
    """
    try:
        log_prediction(
            file_name=filename,
            predicted_food=food,
            sickness_prediction=sickness.get("risk_level") if sickness else None,
            user_id=user_id,
            blood_sugar_level=blood_sugar,
            electrolytes=electrolytes,
            symptoms=symptoms
        )
        print(f"✅ Saved prediction to DB for {filename}")
    except Exception as e:
        print(f"[ERROR] Could not save prediction to DB: {e}")


# -------------------- Retrieve Recent Meals -------------------- #
def fetch_recent_meals(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch the most recent meals (predictions) from PostgreSQL.
    """
    try:
        return get_meals(limit=limit)
    except Exception as e:
        print(f"[ERROR] Could not fetch meals from DB: {e}")
        return []


# -------------------- Weekly Risk Advice -------------------- #
def get_weekly_advice(risky_foods: List[str]) -> Dict[str, str]:
    """
    Generate weekly advice for risky foods using DB helper.
    Returns a dictionary: {food_name: advice}
    """
    try:
        return get_weekly_risks(risky_foods)
    except Exception as e:
        print(f"[ERROR] Could not fetch weekly risks: {e}")
        return {}
