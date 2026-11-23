
import os
from app import knowledge
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
    chunks = knowledge.search(message)

    if chunks:
        context = "\n\n".join(
            f"[{chunk['source']}]\n{chunk['text']}"
            for chunk in chunks
        )

        user_content = (
            f"Study notes:\n{context}\n\n"
            f"Student question: {message}\n\n"
            "Use the study notes as your primary source. "
            "If the notes do not cover the question, "
            "clearly say so before adding general knowledge. "
            "Do not invent information or claim that something "
            "comes from the notes if it does not."
        )

    else:
        user_content = (
            f"Student question: {message}\n\n"
            "No matching study notes were found. "
            "Tell the student that this topic is not covered "
            "in the current knowledge base. You may provide "
            "brief general knowledge, but clearly label it."
        )

    response = get_client().chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
    )

    return response.choices[0].message.content

