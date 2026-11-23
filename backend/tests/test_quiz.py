from fastapi.testclient import TestClient
from app import knowledge
from app.main import app

client = TestClient(app)


def test_random_question_hides_answer():
    res = client.get("/api/quiz/random")
    assert res.status_code == 200
    data = res.json()
    assert "question" in data
    assert "choices" in data
    assert "answer" not in data
    assert "explanation" not in data


def test_correct_answer():
    res = client.post("/api/quiz/answer", json={"question_id": 1, "choice": "A"})
    assert res.status_code == 200
    assert res.json()["correct"] is True


def test_wrong_answer():
    res = client.post("/api/quiz/answer", json={"question_id": 1, "choice": "B"})
    assert res.status_code == 200
    assert res.json()["correct"] is False


def test_lowercase_choice_is_accepted():
    res = client.post("/api/quiz/answer", json={"question_id": 1, "choice": "a"})
    assert res.json()["correct"] is True


def test_unknown_question_returns_404():
    res = client.post("/api/quiz/answer", json={"question_id": 999, "choice": "A"})
    assert res.status_code == 404


def test_invalid_choice_returns_422():
    res = client.post("/api/quiz/answer", json={"question_id": 1, "choice": "Z"})
    assert res.status_code == 422

def test_review_and_stats():
    client.post("/api/quiz/answer", json={"question_id": 2, "choice": "A"})  # wrong
    review = client.get("/api/review").json()
    assert any(q["id"] == 2 for q in review)

    stats = client.get("/api/stats").json()
    assert stats["total"] >= 1

def test_tutor_chat_with_fake_ai(monkeypatch):
    monkeypatch.setattr("app.ai.ask_tutor", lambda msg: "fake reply")

    res = client.post(
        "/api/tutor/chat",
        json={"message": "hi"}
    )

    assert res.status_code == 200
    assert res.json()["reply"] == "fake reply"


def test_tutor_explain_unknown_question(monkeypatch):
    monkeypatch.setattr("app.ai.ask_tutor", lambda msg: "fake reply")

    res = client.post(
        "/api/tutor/explain",
        json={"question_id": 999, "choice": "A"}
    )

    assert res.status_code == 404


def test_knowledge_search_finds_relevant_chunk():
    results = knowledge.search(
        "what is integrity in the CIA triad"
    )

    assert len(results) > 0

def test_knowledge_search_no_match():
    assert knowledge.search("zzzz qqqq") == []