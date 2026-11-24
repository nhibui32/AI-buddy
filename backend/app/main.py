from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import ai, db, knowledge, quiz
from pydantic import BaseModel, Field

app = FastAPI(
    title="Nhi's Cyber Buddy",
    description="An AI-powered cybersecurity learning companion.",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
db.init_db()

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


class ExplainRequest(BaseModel):
    question_id: int
    choice: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
       
@app.get("/api/quiz/random")
def random_question(topic: str | None = None):
    question = quiz.get_random_question(topic)
    if question is None:
        raise HTTPException(status_code=404, detail="No question for this topic")
    return quiz.public_view(question)

@app.post("/api/quiz/answer")
def check_answer(req: AnswerRequest):
    question = quiz.get_question_by_id(req.question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    choice = req.choice.strip().upper()
    if choice not in question["choices"]:
        raise HTTPException(status_code=422, detail="Invalid choice")

    correct = choice == question["answer"]
    db.save_answer(question["id"], question["topic"], choice, correct)

    return {
        "correct": correct,
        "correct_answer": question["answer"],
        "explanation": question["explanation"],
    }

@app.get("/api/review")
def review_mistakes():
    wrong_ids = db.get_wrong_question_ids()
    questions = [quiz.get_question_by_id(i) for i in wrong_ids]
    return [quiz.public_view(q) for q in questions if q]


@app.get("/api/stats")
def stats():
    return db.get_stats()

def call_tutor(prompt: str) -> str:
    try:
        return ai.ask_tutor(prompt)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=502, detail="AI service error")

@app.post("/api/tutor/chat")
def tutor_chat(req: ChatRequest):
    return {"reply": call_tutor(req.message)}

@app.post("/api/tutor/explain")
def tutor_explain(req: ExplainRequest):
    question = quiz.get_question_by_id(req.question_id)

    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    choice = req.choice.strip().upper()

    if choice not in question["choices"]:
        raise HTTPException(status_code=422, detail="Invalid choice")

    prompt = (
        f"Question: {question['question']}\n"
        f"Choices: {question['choices']}\n"
        f"Correct answer: {question['answer']}\n"
        f"Reference explanation: {question['explanation']}\n"
        f"The student chose: {choice}\n\n"
        "Explain why the student's choice is right or wrong, "
        "and give one simple real-life example."
    )

    return {"reply": call_tutor(prompt)}

@app.get("/api/learn/topics")
def learn_topics():
    return knowledge.list_topics()



@app.get("/api/learn/{slug}")
def learn_topic(slug: str, language: str = "en"):
    if language not in {"en", "vi"}:
        raise HTTPException(
            status_code=400,
            detail="Language must be 'en' or 'vi'",
        )

    topic = knowledge.get_topic(slug, language)

    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")

    return topic



@app.get("/api/review/next")
def review_next():
    wrong_ids = db.get_wrong_question_ids()
    if not wrong_ids:
        return {"message": "No mistakes to review. Nice work!"}
    return quiz.public_view(quiz.get_question_by_id(wrong_ids[0]))