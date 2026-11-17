from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app import quiz
app = FastAPI(
    title="Nhi's Cyber Buddy",
    description="An AI-powered cybersecurity learning companion.",
    version="0.1.0",
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Nhi's Cyber Buddy!",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": "Nhi's Cyber Buddy",
    }


@app.get("/api/info")
def get_project_info():
    return {
        "name": "Nhi's Cyber Buddy",
        "purpose": "AI-powered learning, companion",
        "current_mode": "Security+ Tutor",
    }

class AnswerRequest(BaseModel):
    question_id: int
    choice: str


@app.get("/api/quiz/random")
def random_question():
    return quiz.public_view(quiz.get_random_question())


@app.post("/api/quiz/answer")
def check_answer(req: AnswerRequest):
    question = quiz.get_question_by_id(req.question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    choice = req.choice.strip().upper()
    if choice not in question["choices"]:
        raise HTTPException(status_code=422, detail="Invalid choice")

    return {
        "correct": choice == question["answer"],
        "correct_answer": question["answer"],
        "explanation": question["explanation"],
    }