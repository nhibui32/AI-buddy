import sqlite3
from pathlib import Path

DB_FILE = Path(__file__).parent.parent / "buddy.db"


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question_id INTEGER NOT NULL,
                topic TEXT NOT NULL,
                choice TEXT NOT NULL,
                correct INTEGER NOT NULL,
                answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


def save_answer(question_id: int, topic: str, choice: str, correct: bool) -> None:
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO answers (question_id, topic, choice, correct) VALUES (?, ?, ?, ?)",
            (question_id, topic, choice, int(correct)),
        )


def get_wrong_question_ids() -> list[int]:
    """Questions whose most recent attempt was wrong."""
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT question_id FROM answers a
            WHERE correct = 0
              AND id = (SELECT MAX(id) FROM answers WHERE question_id = a.question_id)
            GROUP BY question_id
            """
        ).fetchall()
    return [r["question_id"] for r in rows]


def get_stats() -> dict:
    with get_conn() as conn:
        total = conn.execute("SELECT COUNT(*) AS n FROM answers").fetchone()["n"]
        correct = conn.execute(
            "SELECT COUNT(*) AS n FROM answers WHERE correct = 1"
        ).fetchone()["n"]
        by_topic = conn.execute(
            """
            SELECT topic, COUNT(*) AS attempts, SUM(correct) AS correct
            FROM answers GROUP BY topic
            """
        ).fetchall()
    return {
        "total": total,
        "correct": correct,
        "accuracy": round(correct / total, 2) if total else 0,
        "by_topic": [
            {"topic": r["topic"], "attempts": r["attempts"], "correct": r["correct"]}
            for r in by_topic
        ],
    }