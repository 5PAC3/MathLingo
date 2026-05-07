#!/usr/bin/env bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; exit 1; }

cd "$(dirname "$0")"

info "=== MathLingo — Avvio locale ==="
echo ""

# ── Porte ──────────────────────────────────────────────────────────
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

port_in_use() {
    if command -v ss &>/dev/null; then
        ss -tlnp "sport = :$1" 2>/dev/null | grep -q . && return 0
    elif command -v lsof &>/dev/null; then
        lsof -i :"$1" &>/dev/null && return 0
    fi
    return 1
}

if port_in_use "$BACKEND_PORT"; then
    fail "La porta $BACKEND_PORT è già in uso. Imposta BACKEND_PORT=xxxx per usarne un'altra."
fi

if port_in_use "$FRONTEND_PORT"; then
    warn "La porta $FRONTEND_PORT è già in uso. Imposta FRONTEND_PORT=xxxx per usarne un'altra."
fi

# ── Node.js ─────────────────────────────────────────────────────────
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

# ── Python ──────────────────────────────────────────────────────────
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

# ── Backend dependencies ────────────────────────────────────────────
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

# ── Frontend dependencies ───────────────────────────────────────────
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

# ── Avvio ───────────────────────────────────────────────────────────
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
info "Avvio backend sulla porta $BACKEND_PORT..."
uvicorn backend.main:app --reload --port "$BACKEND_PORT" &
BACKEND_PID=$!

# Frontend
info "Avvio frontend sulla porta $FRONTEND_PORT..."
(cd frontend && npm run dev -- --port "$FRONTEND_PORT") &
FRONTEND_PID=$!

# ── Attesa e verifica ──────────────────────────────────────────────
sleep 2

if ! kill -0 $BACKEND_PID 2>/dev/null; then
    fail "Il backend non si è avviato correttamente."
fi

if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    fail "Il frontend non si è avviato correttamente."
fi

# ── Riepilogo finale ───────────────────────────────────────────────
echo ""
echo -e "  ${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "  ${GREEN}║        MathLingo — Avviato!           ║${NC}"
echo -e "  ${GREEN}╠═══════════════════════════════════════╣${NC}"
echo -e "  ${GREEN}║${NC}                                       ${GREEN}║${NC}"
echo -e "  ${GREEN}║${NC}  ${BOLD}Backend${NC}  http://localhost:${BACKEND_PORT}     ${GREEN}║${NC}"
echo -e "  ${GREEN}║${NC}  ${BOLD}Frontend${NC} http://localhost:${FRONTEND_PORT}     ${GREEN}║${NC}"
echo -e "  ${GREEN}║${NC}                                       ${GREEN}║${NC}"
echo -e "  ${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
info "Premi Ctrl+C per fermare tutto."
echo ""

wait
