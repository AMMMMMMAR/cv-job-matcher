import json
from pydantic import BaseModel
from google import genai
from google.genai import types
from app.core.config import settings
from app.models.cv import CV
from app.models.job import Job
from app.services.embedder import embed_cv
from app.services.vector_store import JobVectorStore

client = genai.Client(api_key=settings.GEMINI_API_KEY)

class MatchResult(BaseModel):
    job: Job
    similarity_score: float           # cosine, 0–1
    match_score: int                  # LLM-given, 0–100
    explanation: str                  # 2–3 sentences
    matching_strengths: list[str]
    skill_gaps: list[str]
    learning_suggestions: list[str]

class MatchResponse(BaseModel):
    cv_summary: str
    matches: list[MatchResult]

# Helper for Gemini parsing
class MatchResultRaw(BaseModel):
    job_index: int
    match_score: int
    explanation: str
    matching_strengths: list[str]
    skill_gaps: list[str]
    learning_suggestions: list[str]

SYSTEM_PROMPT = (
    "You are an expert career advisor and technical recruiter. Given a candidate's CV and a list of candidate jobs, rank them by fit. "
    "For each match: explain in 2–3 sentences why it fits, list the candidate's matching strengths, list required skills they're missing, "
    "and suggest specific things to learn. Be honest about gaps. Output JSON only."
)

def find_matches(cv: CV, top_k: int | None = None) -> MatchResponse:
    """
    RAG PIPELINE for matching a CV to jobs.
    """
    store = JobVectorStore()
    k = top_k or settings.TOP_K_RETRIEVAL
    
    # 1. Embed CV
    query_vector = embed_cv(cv)
    
    # 2. Vector Search (Retriever)
    print(f"[matcher] Retrieving top {k} jobs from Supabase...")
    retrieved_results = store.search(query_vector, top_k=k)
    
    if not retrieved_results:
        print("[matcher] No jobs found in vector store.")
        return MatchResponse(cv_summary="No jobs available for matching.", matches=[])

    # 3. Build RAG Prompt
    cv_data = cv.model_dump_json()
    jobs_list = []
    for i, res in enumerate(retrieved_results):
        job = res["job"]
        jobs_list.append({
            "index": i,
            "title": job.title,
            "company": job.company,
            "description": job.description[:1000] # Truncate for prompt efficiency
        })
        
    prompt = f"CV Data:\n{cv_data}\n\nCandidate Jobs:\n{json.dumps(jobs_list, indent=2)}"
    
    # 4. LLM Ranking & Insights (Generator)
    print("[matcher] Generating AI insights for matches...")
    response = client.models.generate_content(
        model=settings.GEMINI_CHAT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=list[MatchResultRaw],
            temperature=0.2,
        ),
    )
    
    raw_matches = []
    if response.parsed:
        raw_matches = response.parsed
    else:
        try:
            raw_matches = [MatchResultRaw(**m) for m in json.loads(response.text)]
        except:
            print("[matcher] Error parsing LLM results.")
            
    # 5. Merge and Format Results
    final_matches = []
    for rm in raw_matches:
        if rm.job_index < len(retrieved_results):
            retrieved = retrieved_results[rm.job_index]
            final_matches.append(MatchResult(
                job=retrieved["job"],
                similarity_score=retrieved["similarity_score"],
                match_score=rm.match_score,
                explanation=rm.explanation,
                matching_strengths=rm.matching_strengths,
                skill_gaps=rm.skill_gaps,
                learning_suggestions=rm.learning_suggestions
            ))
            
    # Sort by match_score then similarity_score
    final_matches.sort(key=lambda x: (x.match_score, x.similarity_score), reverse=True)
    
    # Limit to TOP_K_FINAL
    final_matches = final_matches[:settings.TOP_K_FINAL]
    
    return MatchResponse(
        cv_summary=cv.summary or "Parsed CV",
        matches=final_matches
    )

if __name__ == "__main__":
    # Smoke test
    print("[matcher] Running smoke test...")
    if not settings.GEMINI_API_KEY:
        print("[matcher] Skipping test: GEMINI_API_KEY not set.")
    else:
        from app.models.cv import CV
        dummy_cv = CV(
            full_name="Jane Doe",
            title="Python Developer",
            skills=["Python", "FastAPI", "PostgreSQL"],
            summary="Experienced backend developer."
        )
        try:
            results = find_matches(dummy_cv)
            print(f"[matcher] Found {len(results.matches)} matches.")
            for i, m in enumerate(results.matches):
                print(f"{i+1}. {m.job.title} at {m.job.company} (Score: {m.match_score})")
        except Exception as e:
            print(f"[matcher] Smoke test failed: {e}")
