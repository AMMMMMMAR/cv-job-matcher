from google import genai
from google.genai import types
from app.core.config import settings
from app.models.cv import CV
from app.models.job import Job

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def embed_text(text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> list[float]:
    """
    Convert text to a 768-dim vector via Gemini.
    task_type for gemini-embedding-001:
      - RETRIEVAL_DOCUMENT (stored items like jobs)
      - RETRIEVAL_QUERY    (incoming queries like a CV)
      - SEMANTIC_SIMILARITY
    """
    if not text:
        return [0.0] * settings.EMBED_DIMENSIONS

    result = client.models.embed_content(
        model=settings.GEMINI_EMBED_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            task_type=task_type,
            output_dimensionality=settings.EMBED_DIMENSIONS,
        ),
    )
    return result.embeddings[0].values

def embed_cv(cv: CV) -> list[float]:
    """
    Build text representation for a CV and embed as RETRIEVAL_QUERY.
    """
    # Combine relevant fields for semantic search
    parts = []
    if cv.title: parts.append(cv.title)
    if cv.summary: parts.append(cv.summary)
    if cv.skills: parts.append(", ".join(cv.skills))
    
    for exp in cv.work_experience:
        exp_text = f"{exp.job_title} at {exp.company}"
        if exp.description:
            exp_text += f": {exp.description}"
        parts.append(exp_text)
        
    for edu in cv.education:
        parts.append(f"{edu.degree} from {edu.institution}")
        
    for proj in cv.projects:
        proj_text = f"Project {proj.name}"
        if proj.description:
            proj_text += f": {proj.description}"
        if proj.technologies:
            proj_text += f" (Skills: {', '.join(proj.technologies)})"
        parts.append(proj_text)

    cv_text = "\n".join(parts)
    return embed_text(cv_text, task_type="RETRIEVAL_QUERY")

def embed_job(job: Job) -> list[float]:
    """
    Build text representation for a Job and embed as RETRIEVAL_DOCUMENT.
    """
    parts = [
        job.title,
        job.company,
        job.description,
        ", ".join(job.required_skills)
    ]
    job_text = "\n".join(parts)
    return embed_text(job_text, task_type="RETRIEVAL_DOCUMENT")

if __name__ == "__main__":
    # Smoke test
    print("[embedder] Running smoke test...")
    if not settings.GEMINI_API_KEY:
        print("[embedder] Skipping test: GEMINI_API_KEY not set.")
    else:
        test_text = "Python developer with machine learning experience."
        try:
            vector = embed_text(test_text)
            print(f"[embedder] Vector length: {len(vector)}")
            print(f"[embedder] First 5 values: {vector[:5]}")
        except Exception as e:
            print(f"[embedder] Smoke test failed: {e}")
