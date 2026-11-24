# Matchi — Backend Service & RAG Engine

> High-performance FastAPI backend service powering **Matchi**, an AI-driven CV-to-Job matching platform built on a two-stage **Retrieval-Augmented Generation (RAG)** architecture with vector similarity search.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash%20%7C%20Embeddings-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-pgvector%20%28HNSW%29-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7.svg?logo=render&logoColor=white)](https://render.com/)

---

## 📌 Repository Navigation

This repository is split into dedicated branches for streamlined hosting and decoupled CI/CD deployments:

- 🏠 **[Main Portal (Documentation & Overview)](https://github.com/AMMMMMMAR/cv-job-matcher/tree/main)** — Central project hub and full architectural guide.
- 🎨 **[Frontend Branch (React 19 + Netlify)](https://github.com/AMMMMMMAR/cv-job-matcher/tree/frontend)** — Web client application and UI components.
- ⚙️ **[Backend Branch (FastAPI + Render)](https://github.com/AMMMMMMAR/cv-job-matcher/tree/backend)** *(You are here)* — Core AI/RAG matching service.

---

## 🧠 Two-Stage RAG Architecture

Matchi replaces rigid keyword searches (ATS) with a hybrid **Retrieve-and-Generate** pipeline:

```mermaid
flowchart TD
    PDF["Uploaded Candidate CV (PDF)"] -->|PyMuPDF Text Extraction| Extractor["pdf_extractor.py"]
    Extractor -->|Raw Text| Parser["cv_parser.py (Gemini 2.0 Flash)"]
    Parser -->|Structured CV Model| Embedder["embedder.py (gemini-embedding-001)"]
    Embedder -->|768-dim Vector (RETRIEVAL_QUERY)| VectorStore["vector_store.py (Supabase pgvector)"]
    
    subgraph Stage1 ["Stage 1: Semantic Retrieval (pgvector)"]
        VectorStore -->|match_jobs RPC (HNSW Cosine)| DB[(Supabase PostgreSQL)]
        DB -->|Top 20 Candidate Jobs (<50ms)| Reranker["matcher.py (Gemini 2.0 Flash)"]
    end
    
    subgraph Stage2 ["Stage 2: LLM Re-Ranking & Gap Analysis"]
        Parser -.->|CV Data| Reranker
        Reranker -->|Strict JSON Output| LLMEval["Evaluates Fit, Strengths & Gaps"]
        LLMEval -->|Ranked Top 5 Matches + Advice| Response["FastAPI JSON Response"]
    end
```

### The 5-Step Pipeline Lifecycle:
1. **PDF Text Extraction ([pdf_extractor.py](file:///e:/cv-matcher/app/services/pdf_extractor.py)):** PyMuPDF (`fitz`) parses text from candidate PDFs while preserving structural continuity.
2. **Structural Information Extraction ([cv_parser.py](file:///e:/cv-matcher/app/services/cv_parser.py)):** Gemini extracts personal info, career summary, work history, and standardizes technical skills into canonical tokens (e.g., transforming variations into `"Python"`, `"React"`, etc.).
3. **Dense Query Embedding ([embedder.py](file:///e:/cv-matcher/app/services/embedder.py)):** Gemini's `gemini-embedding-001` converts candidate experience into a 768-dimensional dense vector using the `RETRIEVAL_QUERY` task type.
4. **Sub-second Vector Retrieval ([vector_store.py](file:///e:/cv-matcher/app/services/vector_store.py)):** Supabase executes the `match_jobs` RPC function over an **HNSW index** using cosine similarity ($1 - \text{cosine distance}$), returning the top 20 candidate jobs in milliseconds.
5. **Generative Re-ranking & Insights ([matcher.py](file:///e:/cv-matcher/app/services/matcher.py)):** Gemini receives the candidate's profile and the 20 job descriptions. It scores each job (0–100), provides a rationale, lists verified matching strengths, pinpoints missing skill gaps, and suggests actionable learning steps. The top 5 matches are returned.

---

## 📂 Project Structure

```text
.
├── app/
│   ├── main.py                 # FastAPI application, CORS middleware, server entry point
│   ├── api/
│   │   └── routes.py           # REST endpoints (/api/cv/upload, /jobs/count, etc.)
│   ├── core/
│   │   ├── config.py           # Pydantic Settings & environment variables
│   │   └── utils.py            # Gemini JSON schema sanitizer
│   ├── models/
│   │   ├── cv.py               # Pydantic schema for structured CV representation
│   │   └── job.py              # Pydantic schema for normalized Job listings
│   └── services/
│       ├── pdf_extractor.py    # PyMuPDF binary PDF text extraction
│       ├── cv_parser.py        # Gemini-powered CV information parser
│       ├── embedder.py         # 768-dim vector embeddings via Gemini
│       ├── vector_store.py     # Supabase pgvector client & RPC caller
│       ├── matcher.py          # RAG pipeline & LLM re-ranking engine
│       ├── job_fetcher.py      # RapidAPI JSearch job aggregator
│       └── job_normalizer.py   # Job data standardization & skill extraction
├── data/                       # Local runtime data folders (uploads, parsed_cvs, etc.)
├── scripts/
│   ├── ingest_jobs.py          # Fetch, normalize, embed, and batch-upsert jobs
│   └── evaluate.py             # Evaluation benchmark (Semantic Search vs. BM25)
├── sql/
│   └── schema.sql              # Supabase table definition, HNSW index & match_jobs RPC
├── Dockerfile                  # Production container definition for Render
└── requirements.txt            # Python dependencies
```

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- **Python 3.11+** installed
- A **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))
- A **Supabase Project** with the `vector` extension enabled ([Supabase](https://supabase.com/))
- *(Optional for ingestion)* A **RapidAPI Key** for JSearch

### 2. Clone and Setup Virtual Environment
```bash
# Clone the backend branch
git clone -b backend https://github.com/AMMMMMMAR/cv-job-matcher.git cv-backend
cd cv-backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
GEMINI_EMBED_MODEL=gemini-embedding-001
EMBED_DIMENSIONS=768

# Supabase (PostgreSQL with pgvector)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# RapidAPI (for job ingestion)
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=jsearch.p.rapidapi.com

# Server Config
PORT=8000
```

### 4. Setup Database
Execute the SQL script in `sql/schema.sql` inside your **Supabase SQL Editor**:
- Enables the `vector` extension.
- Creates the `jobs` table with a `vector(768)` column.
- Creates an **HNSW** index (`vector_cosine_ops`).
- Deploys the `match_jobs` stored procedure for fast nearest-neighbor retrieval.

### 5. Run the Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The API will be available at `http://localhost:8000`. You can test endpoints via Swagger UI at `http://localhost:8000/docs`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check endpoint. |
| `POST` | `/api/cv/upload` | Upload a PDF resume (`multipart/form-data`), parses profile, runs RAG matching, returns ranked jobs with insights. |
| `GET` | `/api/jobs/count` | Returns total number of indexed jobs in Supabase. |
| `POST` | `/api/jobs/ingest` | Triggers background ingestion task. |
| `POST` | `/api/evaluate` | Runs retrieval benchmark against test datasets. |

---

## 🔄 Job Ingestion Pipeline

To populate the database with real-world job postings:
```bash
python scripts/ingest_jobs.py
```
This script queries RapidAPI JSearch for software engineering roles across multiple regions, normalizes them using Gemini, generates embeddings, and performs a batch upsert into Supabase.

---

## 🚢 Deployment (Render)

This branch is configured with a `Dockerfile` for seamless deployment as a Docker web service on **Render**:
1. Connect your GitHub repository to Render and choose the **`backend`** branch.
2. Select **Docker** runtime.
3. Configure your Environment Variables (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`).
4. Render will build and deploy the container on port `8000`.
