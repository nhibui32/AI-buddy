import json
import random
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data" / "questions.json"


def load_questions() -> list[dict]:
    with open(DATA_FILE, encoding="utf-8") as f:
        return json.load(f)


def get_random_question(topic: str | None = None) -> dict | None:
    questions = load_questions()
    if topic:
        questions = [q for q in questions if q["topic"].lower() == topic.lower()]
    return random.choice(questions) if questions else None


def get_question_by_id(question_id: int) -> dict | None:
    for q in load_questions():
        if q["id"] == question_id:
            return q
    return None


def public_view(question: dict) -> dict:
    """Return a question WITHOUT the answer/explanation."""
    return {
        "id": question["id"],
        "topic": question["topic"],
        "question": question["question"],
        "choices": question["choices"],
    }