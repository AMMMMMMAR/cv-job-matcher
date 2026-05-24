import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from app.core.config import settings
from app.services.cv_parser import parse_cv_pdf, save_cv
from app.services.matcher import find_matches, MatchResponse
from app.services.vector_store import JobVectorStore
from app.services.evaluator import (
    load_test_set, evaluate_semantic, evaluate_bm25, save_report
)
from app.models.cv import CV
from app.models.job import Job

router = APIRouter()

@router.get("/")
async def health_check():
    return {"status": "ok", "message": "CV-Job Matcher API is running"}

@router.post("/cv/upload", response_model=dict)
async def upload_cv(file: UploadFile = File(...)):
    """
    Upload a CV PDF, parse it, and return matches.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # 1. Save uploaded file
    file_id = str(uuid.uuid4())
    temp_path = settings.UPLOADS_DIR / f"{file_id}.pdf"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # 2. Parse CV
        cv = parse_cv_pdf(temp_path)
        save_cv(cv, file.filename)
        
        # 3. Find Matches
        match_response = find_matches(cv)
        
        return {
            "cv": cv.model_dump(),
            "matches": [m.model_dump() for m in match_response.matches]
        }
    except Exception as e:
        print(f"[api] Error processing CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/jobs/count")
async def get_jobs_count():
    store = JobVectorStore()
    return {"count": store.count()}

@router.post("/jobs/ingest")
async def trigger_ingestion(background_tasks: BackgroundTasks):
    """
    Trigger job ingestion in the background.
    """
    # In a real app, we'd call the ingestion script logic here.
    # For now, we'll just return a message as ingestion is usually run via CLI scripts.
    return {"message": "Ingestion triggered. Use scripts/ingest_jobs.py for full control."}

@router.post("/evaluate")
async def run_evaluation():
    """
    Run evaluation on the test set and return reports.
    """
    test_set_path = settings.EVAL_DIR / "test_set.json"
    if not test_set_path.exists():
        raise HTTPException(status_code=404, detail="Test set not found at data/eval/test_set.json")
        
    test_set = load_test_set(test_set_path)
    
    # Mocking CV and Job dictionaries for evaluation
    # In a real scenario, these would be loaded from disk/DB
    cvs = {} # Load from parsed_cvs
    jobs = {} # Load from Supabase
    
    # Note: Full evaluation logic is usually too heavy for an API call, 
    # but we'll return a placeholder or trigger it.
    return {"message": "Evaluation script ready. Run scripts/evaluate.py for full report."}
