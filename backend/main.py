import hashlib
import json
import os
import random
import sqlite3
import time
from collections import defaultdict
from pathlib import Path

import sympy as sp
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sympy.parsing.sympy_parser import (
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

from . import auth
from . import database as db
from .nodes import get_generator, list_nodes

_ratelimit: dict[str, list[float]] = {}


def _check_ratelimit(key: str, max_attempts: int = 5, window: int = 300):
    now = time.time()
    entries = _ratelimit.get(key, [])
    entries = [t for t in entries if now - t < window]
    if len(entries) >= max_attempts:
        raise HTTPException(429, "Troppi tentativi. Riprova più tardi.")
    entries.append(now)
    _ratelimit[key] = entries

app = FastAPI(title="MathLingo API")

_cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_exercise_store: dict[str, str] = {}
_skilltree_path = Path(__file__).parent.parent / "skilltree.json"
_content_dir = Path(__file__).parent.parent / "content" / "nodes"
_PLACEMENT_SKIP_KEY = os.environ.get("PLACEMENT_SKIP_KEY", "skip-placement")


@app.on_event("startup")
def startup():
    db.init()


@app.get("/")
def root():
    return {"message": "MathLingo API", "nodes": list_nodes()}


# ── Auth ─────────────────────────────────────────────────────────


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/auth/register")
def register(req: RegisterRequest, request: Request):
    _check_ratelimit(f"register:{request.client.host}", max_attempts=3, window=600)
    return auth.register(auth.RegisterRequest(**req.model_dump()))


@app.post("/auth/login")
def login(req: LoginRequest, request: Request):
    _check_ratelimit(f"login:{request.client.host}", max_attempts=5, window=300)
    return auth.login(auth.LoginRequest(**req.model_dump()))


# ── Progress ─────────────────────────────────────────────────────


class ProgressUpdate(BaseModel):
    node_id: str
    level: int = Field(ge=1, le=3)
    score: float = Field(ge=0, le=100)
    completed: bool


@app.get("/progress")
def get_progress(user: dict = Depends(auth.get_current_user)):
    rows = db.query(
        "SELECT node_id, level, score, completed FROM progress WHERE user_id = ?",
        user["user_id"],
    )
    progress = {}
    for row in rows:
        key = row["node_id"]
        if key not in progress:
            progress[key] = {}
        progress[key][str(row["level"])] = {
            "score": row["score"],
            "completed": bool(row["completed"]),
        }
    return progress


@app.post("/progress")
def update_progress(
    body: ProgressUpdate,
    user: dict = Depends(auth.get_current_user),
):
    try:
        db.execute(
            """INSERT INTO progress (user_id, node_id, level, score, completed, updated_at)
               VALUES (?, ?, ?, ?, ?, datetime('now'))
               ON CONFLICT(user_id, node_id, level)
               DO UPDATE SET score = excluded.score,
                             completed = excluded.completed,
                             updated_at = datetime('now')""",
            user["user_id"],
            body.node_id,
            body.level,
            body.score,
            int(body.completed),
        )
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=401, detail="User not found — token invalido")
    return {"ok": True}


# ── Auth / Me ────────────────────────────────────────────────────


@app.get("/auth/me")
def auth_me(user: dict = Depends(auth.get_current_user)):
    u = db.get_user(user["user_id"])
    if u is None:
        raise HTTPException(status_code=404, detail="User not found")
    return u


# ── Placement Test ──────────────────────────────────────────────


_placement_store: dict[str, dict] = {}
_PLACEMENT_QUESTIONS = 10


@app.post("/placement/start")
def placement_start(user: dict = Depends(auth.get_current_user)):
    u = db.get_user(user["user_id"])
    if u and u["placement_done"]:
        raise HTTPException(status_code=400, detail="Placement test already completed")

    skilltree = json.loads(_skilltree_path.read_text()) if _skilltree_path.exists() else {"nodes": [], "edges": []}
    nodes = skilltree.get("nodes", [])

    by_cat: dict[str, list[dict]] = {}
    for n in nodes:
        by_cat.setdefault(n["category"], []).append(n["id"])

    cat_order = ["aritmetica", "algebra", "geometria", "logica", "geometria-analitica", "analisi", "probabilita"]
    cat_counts = [2, 2, 1, 1, 1, 1, 2]
    selected: list[tuple[str, str]] = []
    for cat, count in zip(cat_order, cat_counts):
        pool = by_cat.get(cat, [])
        chosen = random.sample(pool, min(count, len(pool)))
        for nid in chosen:
            selected.append((cat, nid))

    raw = f"{user['user_id']}{random.random()}"
    placement_id = hashlib.sha256(raw.encode()).hexdigest()[:16]

    questions = []
    solutions: dict[str, str] = {}
    for i, (cat, nid) in enumerate(selected):
        gen = get_generator(nid)
        ex = gen.generate(1)
        qid = f"q{i}"
        questions.append({
            "id": qid,
            "node_id": nid,
            "category": cat,
            "level": 1,
            "question": ex.question,
            "hints": ex.hints,
        })
        solutions[qid] = ex.solution

    _placement_store[placement_id] = {
        "user_id": user["user_id"],
        "solutions": solutions,
        "answers": {},
        "cat_map": {q["id"]: q["category"] for q in questions},
    }

    return {"placement_id": placement_id, "questions": questions}


@app.post("/placement/answer")
def placement_answer(
    body: dict,
    user: dict = Depends(auth.get_current_user),
):
    placement_id = body.get("placement_id")
    question_id = body.get("question_id")
    user_answer = body.get("user_answer", "")

    store = _placement_store.get(placement_id)
    if store is None or store["user_id"] != user["user_id"]:
        raise HTTPException(status_code=404, detail="Placement session not found")

    if user_answer.strip() == _PLACEMENT_SKIP_KEY:
        _placement_store.pop(placement_id, None)
        db.set_placement_done(user["user_id"])
        return {"correct": True, "expected": "", "skipped": True}

    solution = store["solutions"].get(question_id)
    if solution is None:
        raise HTTPException(status_code=400, detail="Invalid question_id")

    transformations = standard_transformations + (implicit_multiplication_application,)

    def _parse(expr_str: str):
        return parse_expr(expr_str, transformations=transformations)

    try:
        user_expr = _parse(user_answer)
        sol_expr = _parse(solution)
        is_correct = sp.simplify(user_expr - sol_expr) == 0
    except Exception:
        is_correct = user_answer.strip() == solution.strip()

    store["answers"][question_id] = is_correct

    return {"correct": is_correct, "expected": solution}


@app.post("/placement/finish")
def placement_finish(
    body: dict,
    user: dict = Depends(auth.get_current_user),
):
    placement_id = body.get("placement_id")

    store = _placement_store.pop(placement_id, None)
    if store is None or store["user_id"] != user["user_id"]:
        raise HTTPException(status_code=404, detail="Placement session not found")

    skilltree = json.loads(_skilltree_path.read_text()) if _skilltree_path.exists() else {"nodes": [], "edges": []}
    nodes = skilltree.get("nodes", [])

    cat_correct: dict[str, int] = {}
    cat_total: dict[str, int] = {}
    for n in nodes:
        cat = n["category"]
        if cat not in cat_correct:
            cat_correct[cat] = 0
            cat_total[cat] = 0

    for qid, correct in store["answers"].items():
        cat = store["cat_map"][qid]
        cat_total[cat] = cat_total.get(cat, 0) + 1
        if correct:
            cat_correct[cat] = cat_correct.get(cat, 0) + 1

    by_cat: dict[str, list[dict]] = defaultdict(list)
    for n in nodes:
        by_cat[n["category"]].append(n)

    for cat, cat_nodes in by_cat.items():
        total = cat_total.get(cat, 0)
        correct = cat_correct.get(cat, 0)
        pct = (correct / total * 100) if total > 0 else 0
        skip = int(len(cat_nodes) * pct / 100)
        for n in cat_nodes[:skip]:
            try:
                db.execute(
                    """INSERT INTO progress (user_id, node_id, level, score, completed, updated_at)
                       VALUES (?, ?, 1, 100, 1, datetime('now'))
                       ON CONFLICT(user_id, node_id, level)
                       DO UPDATE SET score = 100, completed = 1, updated_at = datetime('now')""",
                    user["user_id"],
                    n["id"],
                )
            except Exception as exc:
                print(f"[placement] Failed to insert progress for node {n['id']}: {exc}")

    db.set_placement_done(user["user_id"])

    stats = {}
    for cat in cat_correct:
        stats[cat] = {
            "correct": cat_correct.get(cat, 0),
            "total": cat_total.get(cat, 0),
        }

    return {"ok": True, "stats": stats}


# ── Content / Theory ─────────────────────────────────────────────


@app.get("/content/{node_id}")
def get_content(node_id: str):
    if not node_id.replace("-", "").isalnum():
        raise HTTPException(status_code=400, detail="Invalid node_id")
    filepath = _content_dir / f"{node_id}.md"
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Theory not found")
    return {"node_id": node_id, "content": filepath.read_text(encoding="utf-8")}


# ── Skill Tree ───────────────────────────────────────────────────


@app.get("/skilltree")
def get_skilltree():
    if not _skilltree_path.exists():
        return {"nodes": [], "edges": []}
    return json.loads(_skilltree_path.read_text())


# ── Exercise ─────────────────────────────────────────────────────


class GenerateRequest(BaseModel):
    node_id: str
    level: int = Field(default=1, ge=1, le=3)


class ValidateRequest(BaseModel):
    exercise_id: str
    user_answer: str


@app.post("/exercise/generate")
def generate_exercise(
    body: GenerateRequest,
    user: dict = Depends(auth.get_current_user),
):
    try:
        generator = get_generator(body.node_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    exercise = generator.generate(body.level)

    raw = f"{body.node_id}{body.level}{exercise.question}{exercise.solution}{random.random()}"
    exercise_id = hashlib.sha256(raw.encode()).hexdigest()[:16]
    _exercise_store[exercise_id] = exercise.solution

    return {
        "exercise_id": exercise_id,
        "question": exercise.question,
        "hints": exercise.hints,
        "node_id": body.node_id,
        "level": body.level,
    }


@app.post("/exercise/validate")
def validate_answer(
    body: ValidateRequest,
    user: dict = Depends(auth.get_current_user),
):
    solution_str = _exercise_store.pop(body.exercise_id, None)
    if solution_str is None:
        raise HTTPException(status_code=404, detail="Exercise not found or already validated")

    transformations = standard_transformations + (implicit_multiplication_application,)

    def _parse(expr_str: str):
        return parse_expr(expr_str, transformations=transformations)

    try:
        user_expr = _parse(body.user_answer)
        sol_expr = _parse(solution_str)
        is_correct = sp.simplify(user_expr - sol_expr) == 0
    except Exception:
        is_correct = body.user_answer.strip() == solution_str.strip()

    return {
        "correct": is_correct,
        "expected": solution_str,
    }
