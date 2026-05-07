# MathLingo — Documento di Progettazione (v2)

## Visione

App web open source stile Duolingo per la matematica. Dalle addizioni agli argomenti di quinta superiore, estendibile. Niente AI integrata, tutto generato proceduralmente. Pensata per essere usabile da chiunque, inclusi ragazzi di elementari e medie.

---

## Flusso utente

1. Apro il sito
2. **Scelgo username e password** (senza email) → account creato
3. Faccio un **placement test** (opzionale, saltabile)
4. Vedo lo **Skill Tree** con i nodi disponibili
5. Clicco su un nodo → teoria breve + esercizi a livelli
6. Scrivo la risposta → feedback immediato
7. Supero il 70% → nodo completato, prossimo sbloccato
8. Cambio dispositivo, rifaccio login → **ritrovo tutto automaticamente**

Zero esportazioni manuali, zero file, zero email.

---

## Autenticazione

- **Username + password**, senza verifica email
- Il backend genera un **token JWT** e lo restituisce al frontend
- Il frontend lo salva e lo allega a ogni richiesta
- Password hashate con bcrypt nel database
- Se dimentichi la password, crei un nuovo account (progetto didattico, non una banca)

Tecnologia: FastAPI + PyJWT + bcrypt

---

## Skill Tree

Grafo orientato aciclico (DAG). Ogni nodo è un argomento con prerequisiti. Definito in un file JSON pubblico modificabile per aggiungere nuovi rami.

Esempio: Algebra booleana richiede Equazioni di 1° grado E Divisibilità.

---

## Struttura di un nodo

- **Teoria**: file Markdown con formule LaTeX
- **Esercizi**: 3 livelli di difficoltà crescente
- **Input**: campo testo con sintassi matematica standard
- **Validazione simbolica**: SymPy confronta alberi sintattici, non stringhe. `(x+1)^2` e `x^2+2x+1` sono equivalenti.

---

## Generazione esercizi

Ogni nodo ha un generatore procedurale Python. Riceve il livello, restituisce quesito + soluzione + hints. Interfaccia uniforme per tutti i nodi. Nessuna AI.

---

## Backend — Route principali

| Metodo | Endpoint             | Scopo                                   |
| ------ | -------------------- | --------------------------------------- |
| POST   | `/auth/register`     | Crea account, restituisce token         |
| POST   | `/auth/login`        | Verifica credenziali, restituisce token |
| GET    | `/progress`          | Restituisce progressi utente            |
| POST   | `/progress`          | Aggiorna progressi                      |
| POST   | `/exercise/generate` | Genera esercizio per nodo e livello     |
| POST   | `/exercise/validate` | Valida risposta utente                  |

---

## Database

SQLite, un file locale senza server separato. Tabelle principali: `users` (id, username, password_hash), `progress` (user_id, node_id, level, score, completed).

---

## Estendibilità

Aggiungere un argomento richiede:
1. Creare il generatore Python in `nodes/`
2. Scrivere la teoria in `content/`
3. Aggiungere il nodo a `skilltree.json`

Nessun altro file da toccare.

---

## Tecnologie

- **Frontend**: React (o Next.js), web app
- **Backend**: Python, FastAPI, SymPy, SQLite
- **Hosting**: GitHub Pages (frontend), Render piano free (backend)

---

## Struttura file

```
mathlingo/
├── frontend/
│   ├── src/
│   │   ├── components/     # SkillTree, NodeView, ExerciseInput, LoginForm
│   │   ├── lib/            # API client, auth helpers
│   │   └── App.tsx
│   └── package.json
│
├── backend/
│   ├── main.py             # FastAPI, route
│   ├── auth.py             # Registrazione, login, JWT
│   ├── database.py         # Modelli SQLite
│   ├── nodes/              # Generatori esercizi
│   │   ├── base.py
│   │   ├── aritmetica/
│   │   ├── algebra/
│   │   └── informatica/
│   └── requirements.txt
│
├── content/                # Teoria in Markdown
│   └── nodes/
│
├── skilltree.json          # Grafo della conoscenza
└── README.md
```