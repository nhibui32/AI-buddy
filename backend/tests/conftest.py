import pytest

from app import db


@pytest.fixture(autouse=True)
def temp_db(tmp_path, monkeypatch):
    monkeypatch.setattr(db, "DB_FILE", tmp_path / "test.db")
    db.init_db()