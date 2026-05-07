import sqlite3
import threading
from pathlib import Path

_DB_PATH = Path(__file__).parent / "mathlingo.db"
_lock = threading.Lock()


def _get_conn() -> sqlite3.Connection:
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
    conn.commit()
    conn.close()


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
