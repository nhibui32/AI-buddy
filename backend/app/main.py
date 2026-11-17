from fastapi import FastAPI

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