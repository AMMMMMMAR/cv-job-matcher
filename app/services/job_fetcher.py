import requests
import json
from pathlib import Path
from app.core.config import settings

def fetch_jobs(query: str, pages: int = 1, country: str = "us", date_posted: str = "all") -> list[dict]:
    """
    Fetch jobs from JSearch API via RapidAPI.
    """
    url = f"https://{settings.RAPIDAPI_HOST}/search"
    
    headers = {
        "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
        "X-RapidAPI-Host": settings.RAPIDAPI_HOST
    }
    
    all_jobs = []
    
    for page in range(1, pages + 1):
        querystring = {
            "query": query,
            "page": str(page),
            "num_pages": "1",
            "date_posted": date_posted,
            "country": country
        }
        
        print(f"[job_fetcher] Fetching page {page} for query: {query} ({country})...")
        try:
            response = requests.get(url, headers=headers, params=querystring)
            response.raise_for_status()
            data = response.json()
            jobs = data.get("data", [])
            all_jobs.extend(jobs)
        except Exception as e:
            print(f"[job_fetcher] Error fetching page {page}: {e}")
            break
            
    return all_jobs

def save_jobs(jobs: list[dict], query_tag: str) -> Path:
    """
    Save raw job postings to a JSON file.
    """
    filename = f"jobs_{query_tag.replace(' ', '_')}.json"
    filepath = settings.RAW_JOBS_DIR / filename
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=2, ensure_ascii=False)
        
    print(f"[job_fetcher] Saved {len(jobs)} jobs to {filepath}")
    return filepath

def preview_job(job: dict) -> None:
    """
    Print a summary of a single job.
    """
    print(f"--- Job Preview ---")
    print(f"Title: {job.get('job_title')}")
    print(f"Company: {job.get('employer_name')}")
    print(f"Location: {job.get('job_city')}, {job.get('job_country')}")
    print(f"ID: {job.get('job_id')}")
    print(f"-------------------")

if __name__ == "__main__":
    # Smoke test
    print("[job_fetcher] Running smoke test...")
    if not settings.RAPIDAPI_KEY:
        print("[job_fetcher] Skipping test: RAPIDAPI_KEY not set.")
    else:
        test_jobs = fetch_jobs("python developer", pages=1, country="us")
        if test_jobs:
            preview_job(test_jobs[0])
            save_jobs(test_jobs, "test_python")
        else:
            print("[job_fetcher] No jobs found in smoke test.")
