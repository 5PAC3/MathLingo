# MathLingo

App web open source stile Duolingo per la matematica. Dalle addizioni agli argomenti di quinta superiore, estendibile. Niente AI, tutto generato proceduralmente con validazione simbolica SymPy.

## Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Python + FastAPI + SymPy + SQLite
- **Autenticazione**: JWT + bcrypt

## Requisiti

- Python 3.10+
- Node.js 18+

## Avvio rapido

### 1. Backend

```bash
# Crea e attiva l'ambiente virtuale
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# oppure: venv\Scripts\activate  # Windows

# Installa le dipendenze
pip install -r backend/requirements.txt

# Avvia il server (hot-reload attivo)
uvicorn backend.main:app --reload --port 8000
```

Il backend è disponibile su `http://localhost:8000`.

### 2. Frontend

In un altro terminale:

```bash
cd frontend

# Installa le dipendenze
npm install

# Avvia il dev server
npm run dev
```

Il frontend è disponibile su `http://localhost:3000`.

> **Nota**: Il frontend si aspetta il backend su `http://localhost:8000`. Per cambiare URL, imposta la variabile d'ambiente `NEXT_PUBLIC_API_URL`.

## Struttura del progetto

```
mathlingo/
├── frontend/                # Next.js App Router
│   ├── src/
│   │   ├── app/             # Pagine (login, tree, node/[id])
│   │   ├── components/      # LoginForm, SkillTree, NodeView, ExerciseInput
│   │   └── lib/             # API client, auth context
│   └── package.json
│
├── backend/
│   ├── main.py              # FastAPI, route, CORS
│   ├── auth.py              # Registrazione, login, JWT
│   ├── database.py          # SQLite (users, progress)
│   ├── nodes/               # Generatori esercizi procedurali
│   │   ├── base.py          # Classe astratta NodeGenerator
│   │   ├── aritmetica/
│   │   └── algebra/
│   └── requirements.txt
│
├── content/nodes/           # Teoria in Markdown (in arrivo)
├── skilltree.json           # Grafo della conoscenza (nodi + archi)
└── README.md
```

## API

| Metodo | Endpoint             | Auth | Descrizione                          |
| ------ | -------------------- | ---- | ------------------------------------ |
| GET    | `/`                  | No   | Root + lista nodi disponibili        |
| POST   | `/auth/register`     | No   | Crea account (username + password)   |
| POST   | `/auth/login`        | No   | Login, restituisce token JWT         |
| GET    | `/skilltree`         | No   | Restituisce il grafo della conoscenza|
| GET    | `/progress`          | Sì   | Progressi dell'utente                |
| POST   | `/progress`          | Sì   | Aggiorna progressi                   |
| POST   | `/exercise/generate` | Sì   | Genera esercizio (node_id, level)    |
| POST   | `/exercise/validate` | Sì   | Valida risposta con SymPy            |

## Aggiungere un nuovo argomento

1. Crea il generatore Python in `backend/nodes/` (estendi `NodeGenerator`)
2. Scrivi la teoria in `content/nodes/` (Markdown + LaTeX)
3. Aggiungi il nodo a `skilltree.json`

Nessun altro file da toccare.

## Hosting

- **Frontend**: GitHub Pages (o Vercel)
- **Backend**: Render piano free (o qualsiasi host Python)
