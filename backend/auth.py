from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

import os

from . import database as db

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not SECRET_KEY:
    import sys
    is_production = os.environ.get("RAILWAY_ENVIRONMENT") or os.environ.get("RENDER")
    if is_production:
        raise RuntimeError("JWT_SECRET_KEY environment variable is required in production")
    print("WARNING: JWT_SECRET_KEY not set, using insecure default (set it in production)", file=sys.stderr)
    SECRET_KEY = "dev-secret-key-do-not-use-in-production"
ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 30

security = HTTPBearer()


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    token: str
    username: str
    placement_done: bool


class UserInfo(BaseModel):
    id: int
    username: str


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_token(user_id: int, username: str) -> str:
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": datetime.now(timezone.utc) + timedelta(days=TOKEN_EXPIRE_DAYS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    return verify_token(credentials.credentials)


def register(req: RegisterRequest) -> TokenResponse:
    username = req.username.strip()
    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(req.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    existing = db.query_one("SELECT id FROM users WHERE username = ?", username)
    if existing:
        raise HTTPException(status_code=409, detail="Username already taken")

    pw_hash = hash_password(req.password)
    user_id = db.execute(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        username,
        pw_hash,
    )
    token = create_token(user_id, username)
    return TokenResponse(token=token, username=username, placement_done=False)


def login(req: LoginRequest) -> TokenResponse:
    username = req.username.strip()
    user = db.query_one(
        "SELECT id, username, password_hash, placement_done FROM users WHERE username = ?",
        username,
    )
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_token(user["id"], user["username"])
    return TokenResponse(
        token=token,
        username=user["username"],
        placement_done=bool(user["placement_done"]),
    )
