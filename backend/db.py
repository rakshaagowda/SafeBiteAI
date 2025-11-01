# backend/db.py
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# -------------------- Load Environment Variables -------------------- #
load_dotenv()

POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", 5432)
POSTGRES_DB = os.getenv("POSTGRES_DB", "safebite")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")


# -------------------- PostgreSQL Connection -------------------- #
def get_connection():
    """Return a new PostgreSQL connection."""
    conn = psycopg2.connect(
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
        dbname=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD
    )
    return conn


# -------------------- Prediction Logging -------------------- #
def log_prediction(
    file_name: str,
    predicted_food: str,
    sickness_prediction: str = None,
    user_id: str = None,
    blood_sugar_level: float = None,
    electrolytes: str = None,
    symptoms: str = None
):
    """Insert a new prediction into the predictions table."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO predictions
        (file_name, predicted_food, sickness_prediction, user_id, blood_sugar_level, electrolytes, symptoms)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (file_name, predicted_food, sickness_prediction, user_id, blood_sugar_level, electrolytes, symptoms))
    conn.commit()
    cur.close()
    conn.close()


# -------------------- Fetch Recent Meals -------------------- #
def get_meals(limit: int = 50):
    """Fetch the most recent predictions (meals)."""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT * FROM predictions
        ORDER BY timestamp DESC
        LIMIT %s
    """, (limit,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


# -------------------- Weekly Risk Advice -------------------- #
def get_weekly_risks(risky_foods: list):
    """Return weekly advice for risky foods."""
    advice = {}
    for food in risky_foods:
        advice[food] = (
            "Avoid this food this week. Drink plenty of water, "
            "eat light meals, and include fruits and probiotics."
        )
    return advice
