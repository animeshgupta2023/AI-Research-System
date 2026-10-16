# Fieldnotes Research Agent

## Project layout

- `backend/` contains the LangChain research pipeline and FastAPI service.
- `frontend/` contains the React research desk.
- Keep `.env` in the repository root. It is ignored by Git; never commit API keys.

## Install and run

Install backend dependencies from the repository root:

```powershell
uv pip install -r .\backend\requirements.txt
```

Start the API from the repository root:

```powershell
uv run uvicorn backend.api:app --reload --port 8000
```

In a second terminal, install and start the React app:

```powershell
cd .\frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`.
The frontend calls the API at `http://127.0.0.1:8000`; set `VITE_API_URL` in a frontend `.env` file to override it.