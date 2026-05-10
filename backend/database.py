import os
import sqlite3
import threading
from pathlib import Path

_DEFAULT_DB = Path("/data/mathlingo.db") if Path("/data").exists() else Path(__file__).parent / "mathlingo.db"
_DB_PATH = Path(os.environ.get("DATABASE_PATH", _DEFAULT_DB))
_lock = threading.Lock()


def _get_conn() -> sqlite3.Connection:
    _DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(_DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init():
    conn = _get_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            placement_done INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id),
            node_id TEXT NOT NULL,
            level INTEGER NOT NULL DEFAULT 1,
            score REAL NOT NULL DEFAULT 0,
            completed INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, node_id, level)
        );
    """)
    _run_migrations(conn)
    conn.commit()
    conn.close()


def _run_migrations(conn: sqlite3.Connection):
    existing = [row["name"] for row in conn.execute("PRAGMA table_info(users)").fetchall()]
    if "placement_done" not in existing:
        conn.execute("ALTER TABLE users ADD COLUMN placement_done INTEGER NOT NULL DEFAULT 0")


def query(sql: str, *params: object) -> list[sqlite3.Row]:
    conn = _get_conn()
    try:
        return conn.execute(sql, params).fetchall()
    finally:
        conn.close()


def query_one(sql: str, *params: object) -> sqlite3.Row | None:
    conn = _get_conn()
    try:
        return conn.execute(sql, params).fetchone()
    finally:
        conn.close()


def execute(sql: str, *params: object) -> int:
    conn = _get_conn()
    try:
        with _lock:
            cursor = conn.execute(sql, params)
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close()


def get_user(user_id: int) -> dict | None:
    row = query_one("SELECT id, username, placement_done FROM users WHERE id = ?", user_id)
    if row is None:
        return None
    return {"id": row["id"], "username": row["username"], "placement_done": bool(row["placement_done"])}


def set_placement_done(user_id: int):
    execute("UPDATE users SET placement_done = 1 WHERE id = ?", user_id)
