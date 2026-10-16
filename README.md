# Fieldnotes

### AI research, from question to considered report.

Fieldnotes is a single-purpose research agent. Give it a topic and it searches for recent information, reads a relevant source, drafts a report, and asks a critic agent to review the result. The React research desk presents the report, research notes, and critique in one place.

> **Research note**  AI-generated material can be incomplete or inaccurate. Check important claims and sources independently.

## How it works

```text
Question
	 → Web search (Tavily)
	 → Source reading and scraping
	 → Report writing (Gemini)
	 → Critical review (Gemini)
	 → Research desk
```

| Part | What it does |
| --- | --- |
| Search agent | Finds recent web results and source URLs. |
| Reader agent | Selects a relevant URL and extracts page text. |
| Writer | Produces a structured report with findings, a conclusion, and sources. |
| Critic | Reviews the report for strengths, gaps, and improvements. |
| Research desk | Submits topics and displays the report, research notes, and review. |

## Project structure

```text
.
├── backend/
│   ├── agents.py       # LangChain agents and report chains
│   ├── api.py          # FastAPI endpoints
│   ├── pipeline.py     # End-to-end research workflow
│   ├── tools.py        # Tavily search and page scraping
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

Create a `.env` file in the repository root with your own credentials:

```dotenv
GOOGLE_API_KEY=your_google_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Keep this file private. It is excluded from Git; never paste API keys into source code or commit them.

## Run locally

### 1. Start the API

From the repository root, install the Python dependencies:

```powershell
uv pip install -r .\backend\requirements.txt
```

Start the backend:

```powershell
uv run uvicorn backend.api:app --reload --port 8000
```

The API health check is available at [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health). Interactive API documentation is at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Start the research desk

In a second terminal:

```powershell
cd .\frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually [http://localhost:5173](http://localhost:5173). Leave both terminals running while you use the app.

## API

### `GET /api/health`

Confirms the backend is responding.

### `POST /api/research`

Starts the full research workflow.

```json
{
	"topic": "How are cities adapting to extreme heat?"
}
```

The response contains `search_results`, `scraped_content`, `report`, and `feedback` fields. Research can take a little while because the agents make several model and search requests.

## Configuration

The frontend uses `http://127.0.0.1:8000` for the API by default. To use a different backend URL, create `frontend/.env` and set:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```