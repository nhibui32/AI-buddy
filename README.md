# Nhi's Cyber Buddy

An AI-powered learning companion for cybersecurity education, focused on CompTIA Security+. The project is built step by step, starting with a quiz backend that works on its own. An AI tutor and voice interaction will be added on top.

## Current Features

- **Quiz engine**: random Security+ questions served from a JSON question bank, without exposing the answer
- **Answer checking**: instant correct/incorrect feedback with an explanation
- **Answer history**: every attempt is stored in SQLite
- **Review mode**: lists questions whose most recent attempt was wrong
- **Stats**: overall accuracy and per-topic progress
- **Automated tests** with pytest

## Tech Stack

- Python 3
- FastAPI + Uvicorn
- SQLite
- Pytest

## Project Structure

```
nhi-cyber-buddy/
├── backend/
│   ├── app/
│   │   ├── main.py        # API endpoints
│   │   ├── quiz.py        # Question loading and quiz logic
│   │   ├── db.py          # SQLite storage (answers, review, stats)
│   │   └── data/
│   │       └── questions.json
│   ├── tests/
│   │   └── test_quiz.py
│   ├── knowledge_base/    # Security+ study material (for the future AI tutor)
│   └── pytest.ini
├── docs/
├── requirements.txt
└── README.md
```

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO

# 2. Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the server
cd backend
uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Interactive docs (Swagger UI) are at `http://127.0.0.1:8000/docs`.

## API Endpoints

| Method | Endpoint           | Description                                         |
|--------|--------------------|-----------------------------------------------------|
| GET    | `/`                | Welcome message                                     |
| GET    | `/health`          | Health check                                        |
| GET    | `/api/info`        | Project information                                 |
| GET    | `/api/quiz/random` | Get a random question (no answer included)          |
| POST   | `/api/quiz/answer` | Submit an answer, get result and explanation        |
| GET    | `/api/review`      | Questions whose latest attempt was wrong            |
| GET    | `/api/stats`       | Total, accuracy, and per-topic stats                |

Example request:

```json
POST /api/quiz/answer
{"question_id": 1, "choice": "A"}
```

## Running Tests

```bash
cd backend
pytest
```

## Roadmap

- [x] Project setup and FastAPI backend
- [x] Quiz engine with JSON question bank
- [x] Answer history, review mode, and stats (SQLite)
- [ ] AI tutor: explanations and chat in English and Vietnamese
- [ ] Knowledge base grounding to reduce incorrect AI answers
- [ ] Learn / Quiz / Review modes
- [ ] Simple web interface
- [ ] Voice interaction (speech-to-text and text-to-speech)

## Notes

Answer history is stored locally in `backend/buddy.db`, which is excluded from version control.