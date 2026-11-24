
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

    # Read English notes for AI Tutor's existing knowledge search
    for path in sorted(KB_DIR.rglob("en.md")):
        text = path.read_text(encoding="utf-8")

        title = (
            text.splitlines()[0].lstrip("# ").strip()
            if text else path.parent.name
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

    for folder in sorted(KB_DIR.iterdir()):
        if not folder.is_dir():
            continue

        english_file = folder / "en.md"

        if not english_file.exists():
            continue

        text = english_file.read_text(encoding="utf-8")

        title = (
            text.splitlines()[0].lstrip("# ").strip()
            if text else folder.name
        )

        topics.append({
            "slug": folder.name,
            "title": title,
        })

    return topics


def get_topic(slug: str, language: str = "en") -> dict | None:
    # Only allow supported languages
    if language not in {"en", "vi"}:
        language = "en"

    # Find the requested topic
    topic_folder = KB_DIR / slug

    # Prevent accessing files outside the knowledge base
    if not topic_folder.is_dir() or topic_folder.parent != KB_DIR:
        return None

    # Load requested language
    file_path = topic_folder / f"{language}.md"

    # Fallback to English if translation is not available
    if not file_path.exists():
        file_path = topic_folder / "en.md"

    if not file_path.exists():
        return None

    text = file_path.read_text(encoding="utf-8")

    title = (
        text.splitlines()[0].lstrip("# ").strip()
        if text else slug
    )

    return {
        "slug": slug,
        "title": title,
        "language": language if file_path.name == f"{language}.md" else "en",
        "content": text,
    }
