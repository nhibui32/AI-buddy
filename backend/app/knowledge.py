
import re
from pathlib import Path

KB_DIR = (
    Path(__file__).parent.parent
    / "knowledge_base"
    / "security_plus"
)

STOPWORDS = {
    "the", "a", "an", "is", "are", "of", "to",
    "and", "or", "in", "on", "what", "how",
    "why", "does", "do", "for", "with",
    "between", "vs",
}


def tokenize(text: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", text.lower())

    return {
        word for word in words
        if word not in STOPWORDS and len(word) > 1
    }


def load_chunks() -> list[dict]:
    chunks = []

    for path in sorted(KB_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")

        title = (
            text.splitlines()[0].lstrip("# ").strip()
            if text else path.stem
        )

        sections = re.split(r"\n(?=## )", text)

        for section in sections:
            if section.strip():
                chunks.append({
                    "source": path.name,
                    "title": title,
                    "text": section.strip(),
                })

    return chunks


def search(query: str, limit: int = 3) -> list[dict]:
    query_words = tokenize(query)
    scored = []

    for chunk in load_chunks():
        chunk_words = tokenize(
            chunk["title"] + " " + chunk["text"]
        )

        score = len(query_words & chunk_words)

        if score > 0:
            scored.append((score, chunk))

    scored.sort(key=lambda item: item[0], reverse=True)

    return [chunk for _, chunk in scored[:limit]]

def list_topics() -> list[dict]:
    topics = []
    for path in sorted(KB_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        title = text.splitlines()[0].lstrip("# ").strip() if text else path.stem
        topics.append({"slug": path.stem, "title": title})
    return topics


def get_topic(slug: str) -> dict | None:
    for topic in list_topics():
        if topic["slug"] == slug:
            text = (KB_DIR / f"{slug}.md").read_text(encoding="utf-8")
            return {**topic, "content": text}
    return None