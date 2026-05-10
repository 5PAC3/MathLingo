# MathLingo

App web open source stile Duolingo per la matematica. Dalle addizioni agli argomenti di quinta superiore. Niente AI, tutto generato proceduralmente con validazione simbolica SymPy. 28 nodi su 4 categorie.

## Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript (static export su Netlify)
- **Backend**: Python + FastAPI + SymPy + SQLite (su Railway)
- **Autenticazione**: JWT + bcrypt
- **Teoria**: Markdown + LaTeX via KaTeX

## Avvio rapido (sviluppo locale)

### 1. Backend

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

Frontend su `http://localhost:3000`, backend su `http://localhost:8000`.

## Variabili d'ambiente (backend)

| Variabile | Default | Obbligatoria |
|-----------|---------|--------------|
| `JWT_SECRET_KEY` | `dev-secret-key...` (insecure) | Sì in produzione |
| `CORS_ORIGINS` | `http://localhost:3000` | Sì in produzione |
| `DATABASE_PATH` | `backend/mathlingo.db` | No |

## Struttura del progetto

```
mathlingo/
├── frontend/                  # Next.js (static export)
│   ├── src/
│   │   ├── app/               # Route: /tree, /node/[id], /login, /placement
│   │   ├── components/        # Navbar, SkillTree, NodeView, ExerciseInput, ecc.
│   │   └── lib/               # API client, auth context, theme, hotkeys
│   └── next.config.mjs        # output: 'export'
│
├── backend/
│   ├── main.py                # FastAPI, route, CORS, rate limiting
│   ├── auth.py                # Registrazione, login, JWT
│   ├── database.py            # SQLite con migrazioni automatiche
│   └── nodes/                 # Generatori esercizi procedurali
│       ├── aritmetica/        # 12 nodi
│       ├── algebra/           # 9 nodi
│       ├── geometria/         # 4 nodi
│       └── probabilita/       # 3 nodi
│
├── content/nodes/             # 29 file .md con teoria + LaTeX
├── skilltree.json             # Grafo: 4 macro, 28 nodi, 31 archi
├── railway.json               # Config deploy Railway
├── netlify.toml               # Config deploy Netlify
└── README.md
```

## API

| Metodo | Endpoint | Auth | Descrizione |
|--------|----------|------|-------------|
| GET | `/` | No | Root + lista nodi |
| POST | `/auth/register` | No | Crea account (min 8 caratteri) |
| POST | `/auth/login` | No | Login, restituisce token JWT |
| GET | `/auth/me` | Sì | Info utente (username, placement_done) |
| GET | `/skilltree` | No | Grafo della conoscenza (macro, nodi, archi) |
| GET | `/content/{node_id}` | No | Teoria in Markdown |
| GET | `/progress` | Sì | Progressi dell'utente |
| POST | `/progress` | Sì | Aggiorna progressi (level 1-3, score 0-100) |
| POST | `/exercise/generate` | Sì | Genera esercizio (node_id, level) |
| POST | `/exercise/validate` | Sì | Valida risposta con SymPy |
| POST | `/placement/start` | Sì | Avvia test di posizionamento (10 domande) |
| POST | `/placement/answer` | Sì | Valida risposta singola del placement |
| POST | `/placement/finish` | Sì | Conclude placement, pre-fill progressi |

## Aggiungere un nuovo argomento

1. Crea il generatore in `backend/nodes/<categoria>/<nome>.py` (estendi `NodeGenerator`)
2. Importalo in `backend/nodes/__init__.py`
3. Scrivi la teoria in `content/nodes/<nome>.md`
4. Aggiungi nodo + archi in `skilltree.json`

Nessun altro file da toccare.

## Deploy

- **Frontend**: build statico su Netlify (da `frontend/out/`) — o Vercel
- **Backend**: Python FastAPI su Railway (SQLite persistente su `/data`) — auto-detection
- **Database**: SQLite (locale) — per Railway serve volume persistente o migrazione a PostgreSQL
- **Trigger**: push su `main` → deploy automatico su entrambi

> ⚠️ **Non modificare `railway.json`** — Railway usa auto-detection per Python/FastAPI e il file
> è configurato con `"deploy": {}` apposta. La build usa `--break-system-packages` per PEP 668.
> Anche se sembra "vuoto" o "sbagliato", funziona. Non toccare.
