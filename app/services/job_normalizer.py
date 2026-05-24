import json
import uuid
from pathlib import Path
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.utils import get_gemini_schema
from app.models.job import Job

client = genai.Client(api_key=settings.GEMINI_API_KEY)

SYSTEM_INSTRUCTION = (
    "You are an expert technical recruiter and data analyst. Your goal is to normalize raw job posting data into a structured Job format. "
    "Extract technical skills as short tokens. Infer seniority (junior, mid, senior) based on the description and title. "
    "Required experience years should be a float. Never invent data. Output must strictly follow the provided JSON schema."
)

def normalize_job(raw_job: dict) -> Job:
    """
    Convert a raw JSearch job dictionary into a structured Job object using Gemini.
    """
    print(f"[job_normalizer] Normalizing job: {raw_job.get('job_title', 'Unknown')}")
    
    # Pre-extract job_id to ensure consistency
    job_id = raw_job.get("job_id")
    if not job_id:
        job_id = str(uuid.uuid4())
        
    # Prepare the prompt with raw data
    raw_data_str = json.dumps(raw_job, indent=2)
    
    response = client.models.generate_content(
        model=settings.GEMINI_CHAT_MODEL,
        contents=f"Normalize this raw job data:\n\n{raw_data_str}",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=get_gemini_schema(Job),
            temperature=0.1,
        ),
    )
    
    normalized_job = None
    if response.parsed:
        if isinstance(response.parsed, dict):
            normalized_job = Job(**response.parsed)
        else:
            normalized_job = response.parsed
    else:
        try:
            data = json.loads(response.text)
            normalized_job = Job(**data)
        except Exception as e:
            print(f"[job_normalizer] Error parsing Gemini response: {e}")
            raise ValueError("Failed to normalize job into structured format.")
            
    # Ensure job_id is carried over if LLM missed it or we want the original
    normalized_job.job_id = job_id
    return normalized_job

def normalize_jobs_from_file(filepath: Path) -> list[Job]:
    """
    Load raw jobs from a JSON file and normalize each one.
    """
    if not filepath.exists():
        print(f"[job_normalizer] File not found: {filepath}")
        return []
        
    with open(filepath, "r", encoding="utf-8") as f:
        raw_jobs = json.load(f)
        
    normalized_jobs = []
    for raw_job in raw_jobs:
        try:
            job = normalize_job(raw_job)
            normalized_jobs.append(job)
        except Exception as e:
            print(f"[job_normalizer] Failed to normalize job: {e}")
            
    return normalized_jobs

if __name__ == "__main__":
    # Smoke test
    print("[job_normalizer] Running smoke test...")
    if not settings.GEMINI_API_KEY:
        print("[job_normalizer] Skipping test: GEMINI_API_KEY not set.")
    else:
        test_raw_job = {
            "job_id": "test_123",
            "job_title": "Senior Python Developer",
            "employer_name": "CloudWorks",
            "job_description": "We are looking for a Senior Python Developer with 5+ years of experience in Django and AWS.",
            "job_city": "New York",
            "job_is_remote": True,
            "job_employment_type": "FULLTIME",
            "job_apply_link": "https://example.com/apply"
        }
        try:
            job = normalize_job(test_raw_job)
            print(f"[job_normalizer] Successfully normalized: {job.title} at {job.company}")
            print(f"[job_normalizer] Skills: {job.required_skills}")
            print(f"[job_normalizer] Seniority: {job.seniority}")
        except Exception as e:
            print(f"[job_normalizer] Smoke test failed: {e}")
