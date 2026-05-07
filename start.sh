#!/usr/bin/env bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; exit 1; }

cd "$(dirname "$0")"

info "=== MathLingo — Avvio locale ==="
echo ""

# ── Node.js ─────────────────────────────────────────────────────
info "Controllo Node.js..."
if command -v node &>/dev/null; then
    NODE_VER=$(node --version)
    ok "Node.js $NODE_VER"
else
    fail "Node.js non trovato. Installa Node.js 18+ da https://nodejs.org"
fi

if command -v npm &>/dev/null; then
    NPM_VER=$(npm --version)
    ok "npm $NPM_VER"
else
    fail "npm non trovato"
fi

# ── Python ──────────────────────────────────────────────────────
info "Controllo Python..."
PYTHON=""
for cmd in python3 python; do
    if command -v "$cmd" &>/dev/null; then
        VER=$("$cmd" --version 2>&1 | grep -oP '\d+\.\d+')
        MAJOR=$(echo "$VER" | cut -d. -f1)
        MINOR=$(echo "$VER" | cut -d. -f2)
        if [ "$MAJOR" -ge 3 ] && [ "$MINOR" -ge 10 ]; then
            PYTHON="$cmd"
            break
        fi
    fi
done

if [ -n "$PYTHON" ]; then
    ok "$($PYTHON --version 2>&1)"
else
    fail "Python 3.10+ non trovato. Installa Python 3.10+ da https://python.org"
fi

# ── Backend dependencies ────────────────────────────────────────
info "Controllo backend..."
if [ ! -d "venv" ]; then
    info "Creazione ambiente virtuale..."
    $PYTHON -m venv venv
    ok "Virtual environment creato"
fi

source venv/bin/activate

if [ -f "backend/requirements.txt" ]; then
    pip install --quiet -r backend/requirements.txt 2>&1 | tail -1
    ok "Dipendenze Python installate"
fi

# ── Frontend dependencies ───────────────────────────────────────
info "Controllo frontend..."
if [ -d "frontend" ]; then
    if [ ! -d "frontend/node_modules" ]; then
        info "Installazione dipendenze frontend..."
        (cd frontend && npm install --silent) || warn "npm install fallito, riprova con npm install"
        ok "Dipendenze frontend installate"
    else
        ok "Dipendenze frontend già presenti"
    fi
fi

# ── Avvio ───────────────────────────────────────────────────────
echo ""
info "Tutto pronto! Avvio backend e frontend..."
echo ""

cleanup() {
    echo ""
    info "Arresto server in corso..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait 2>/dev/null
    ok "Server arrestati"
}
trap cleanup EXIT INT TERM

# Backend
source venv/bin/activate
uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!
info "Backend:  http://localhost:8000"

# Frontend
(cd frontend && npm run dev) &
FRONTEND_PID=$!
info "Frontend: http://localhost:3000"

echo ""
info "Premi Ctrl+C per fermare tutto."
echo ""

wait
