
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

MODEL = os.getenv("OPENAI_MODEL", "gpt-6-luna")

SYSTEM_PROMPT = """You are Nhi's Cyber Buddy, a friendly tutor for CompTIA Security+.
- Reply in the same language the student uses (Vietnamese or English).
- Keep explanations short, clear and beginner-friendly, with a simple example.
- Keep technical terms (phishing, MFA, ransomware...) in English.
- If you are not sure about something, say so instead of guessing.
- Stay on cybersecurity and Security+ topics."""

_client = None


def get_client() -> OpenAI:
    global _client

    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set")

        _client = OpenAI(api_key=api_key)

    return _client


def ask_tutor(message: str) -> str:
    response = get_client().chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": message},
        ],
    )

    return response.choices[0].message.content
