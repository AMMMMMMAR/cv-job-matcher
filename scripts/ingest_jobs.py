import sys
from pathlib import Path

# Add project root to sys.path for absolute imports
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from backend.app.services.job_fetcher import fetch_jobs, save_jobs
from backend.app.services.job_normalizer import normalize_job
from backend.app.services.embedder import embed_job
from backend.app.services.vector_store import JobVectorStore

INGESTION_QUERIES = [
    # United States (large English pool)
    {"query": "python developer", "country": "us", "pages": 2},
    {"query": "data scientist", "country": "us", "pages": 2},
    {"query": "machine learning engineer", "country": "us", "pages": 2},
    {"query": "backend engineer", "country": "us", "pages": 2},
    {"query": "frontend developer", "country": "us", "pages": 2},

    # Turkey (local market)
    {"query": "software engineer", "country": "tr", "pages": 2},
    {"query": "data analyst", "country": "tr", "pages": 2},

    # Remote / global
    {"query": "python developer remote", "country": "us", "pages": 2},
    {"query": "AI engineer remote", "country": "us", "pages": 2},
]

def run_ingestion():
    """
    Full ingestion pipeline: Fetch → Normalize → Embed → Store
    """
    print("[ingest_jobs] Starting full job ingestion pipeline...")
    store = JobVectorStore()
    
    total_processed = 0
    
    for q in INGESTION_QUERIES:
        query = q["query"]
        country = q["country"]
        pages = q["pages"]
        
        print(f"\n[ingest_jobs] Processing query: '{query}' in {country} ({pages} pages)")
        
        # 1. Fetch
        raw_jobs = fetch_jobs(query=query, pages=pages, country=country)
        if not raw_jobs:
            print(f"[ingest_jobs] No jobs found for '{query}'. skipping.")
            continue
            
        # 2. Save raw for auditing
        save_jobs(raw_jobs, f"{query}_{country}")
        
        # 3. Normalize, Embed, and Store
        for raw_job in raw_jobs:
            try:
                # Normalize
                job = normalize_job(raw_job)
                
                # Embed
                embedding = embed_job(job)
                
                # Store in Supabase
                store.add_job(job, embedding)
                
                total_processed += 1
                
                # Small delay to avoid rate limits
                import time
                time.sleep(5)
            except Exception as e:
                print(f"[ingest_jobs] Failed to process job {raw_job.get('job_id')}: {e}")
                import time
                time.sleep(5) # Delay even on failure to stay within limits
                
    print(f"\n[ingest_jobs] Ingestion complete. Processed {total_processed} jobs.")

if __name__ == "__main__":
    run_ingestion()
