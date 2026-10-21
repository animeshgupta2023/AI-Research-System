# AI Research System

### AI research, from question to considered report.

Fieldnotes is a web-based research assistant. Submit a focused question to search the web for recent information, read a relevant source, draft a report, and receive a separate critique. The research desk displays the report, search and source notes, and critic review.

> **Research note:** AI-generated material can be incomplete or inaccurate. Verify important claims and sources independently.

## How it works

```text
Research question
  → Tavily web search (up to five results)
  → Read a relevant page (up to 3,000 characters)
  → Draft a structured report
  → Critique the report
  → Display the results in the research desk
```

The search and reader agents use LangChain with Google Gemini (`gemini-3.5-flash-lite`). The report writer and critic use the same model. The reader uses a scraping tool, so some sites may block access or return incomplete text.

## Project structure

```text
.
├── backend/
│   ├── agents.py       # Search and reader agents, report and critique chains
│   ├── api.py          # FastAPI application and HTTP endpoints
│   ├── pipeline.py     # End-to-end research workflow
│   ├── tools.py        # Tavily web search and page scraping
│   └── requirements.txt
└── frontend/
    ├── src/            # React research desk
    ├── index.html
    └── package.json
```

## Requirements

- Python 3.11 or newer
- [`uv`](https://docs.astral.sh/uv/)
- Node.js and npm
- A Google Gemini API key and a Tavily API key

Create a `.env` file in the repository root:

```dotenv
GOOGLE_API_KEY=your_google_api_key
TAVILY_API_KEY=your_tavily_api_key
```

The root `.gitignore` excludes `.env`. Keep your keys private; never put them in source code or commit them.

## Run locally

Open two terminals at the repository root.

### 1. Install Python dependencies and start the API

Create a virtual environment and install the backend requirements:

```powershell
uv venv
uv pip install --python .\.venv\Scripts\python.exe -r .\backend\requirements.txt
```

Start the API:

```powershell
uv run --python .\.venv\Scripts\python.exe uvicorn backend.api:app --reload --port 8000
```

The API health check is at [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health), and interactive API documentation is at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Install frontend dependencies and start the research desk

In the second terminal:

```powershell
Set-Location .\frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually [http://localhost:5173](http://localhost:5173). Keep both terminals running while using the app.

## API

### `GET /api/health`

Returns `{"status":"ok"}` when the backend is responding.

### `POST /api/research`

Runs the complete research workflow. The request body must contain a `topic` between 3 and 300 characters:

```json
{
  "topic": "How are cities adapting to extreme heat?"
}
```

The JSON response contains four text fields:

```json
{
  "search_results": "...",
  "scraped_content": "...",
  "report": "...",
  "feedback": "..."
}
```

Research can take a little while because it makes multiple search and model requests.

## Configuration

The frontend defaults to `http://127.0.0.1:8000` for the API. To point it at another backend URL, create `frontend/.env` and set:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

The backend currently allows browser requests from `http://localhost:5173` and `http://127.0.0.1:5173`. If you run the frontend on a different origin, update the CORS allowlist in `backend/api.py` as well.

## Production build

To create a static frontend build:

```powershell
Set-Location .\frontend
npm run build
```

Vite writes the generated files to `frontend/dist/`.
