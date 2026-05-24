from supabase import create_client, Client
from app.core.config import settings
from app.models.job import Job

class JobVectorStore:
    def __init__(self):
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
            print("[vector_store] WARNING: Supabase credentials missing!")
            self.client = None
        else:
            self.client: Client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_KEY,
            )
        self.table_name = settings.JOBS_TABLE
        self.rpc_name = settings.MATCH_JOBS_RPC

    def _row_from(self, job: Job, embedding: list[float]) -> dict:
        return {
            "job_id": job.job_id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "remote": job.remote,
            "employment_type": job.employment_type,
            "description": job.description,
            "required_skills": job.required_skills,
            "nice_to_have_skills": job.nice_to_have_skills,
            "required_experience_years": job.required_experience_years,
            "seniority": job.seniority,
            "apply_link": job.apply_link,
            "posted_date": job.posted_date,
            "source": job.source,
            "job_json": job.model_dump(),
            "embedding": embedding,
        }

    def add_job(self, job: Job, embedding: list[float]) -> None:
        """Upsert a single job. Uses job_id as the primary key."""
        if not self.client: return
        row = self._row_from(job, embedding)
        self.client.table(self.table_name).upsert(row, on_conflict="job_id").execute()
        print(f"[vector_store] Added job: {job.title} ({job.job_id})")

    def add_jobs_batch(self, jobs: list[Job], embeddings: list[list[float]]) -> None:
        """Batched upsert for efficiency."""
        if not self.client: return
        rows = [
            self._row_from(job, emb)
            for job, emb in zip(jobs, embeddings)
        ]
        self.client.table(self.table_name).upsert(rows, on_conflict="job_id").execute()
        print(f"[vector_store] Added batch of {len(rows)} jobs.")

    def search(
        self,
        query_embedding: list[float],
        top_k: int = 20,
        filter_remote: bool | None = None,
        filter_seniority: str | None = None,
    ) -> list[dict]:
        """
        Calls the SQL RPC 'match_jobs'.
        Returns list of dicts: {job: Job, similarity_score: float}.
        """
        if not self.client: return []
        
        response = self.client.rpc(
            self.rpc_name,
            {
                "query_embedding": query_embedding,
                "match_count": top_k,
                "filter_remote": filter_remote,
                "filter_seniority": filter_seniority,
            },
        ).execute()

        results = []
        for row in response.data or []:
            job = Job(**row["job_json"])
            results.append({
                "job": job,
                "similarity_score": float(row["similarity"]),
            })
        return results

    def count(self) -> int:
        if not self.client: return 0
        response = (
            self.client.table(self.table_name)
            .select("job_id", count="exact")
            .execute()
        )
        return response.count or 0

    def reset(self) -> None:
        """Delete all rows from the jobs table (DANGEROUS)."""
        if not self.client: return
        self.client.table(self.table_name).delete().neq("job_id", "").execute()
        print("[vector_store] Database reset.")

if __name__ == "__main__":
    # Smoke test
    print("[vector_store] Running smoke test...")
    store = JobVectorStore()
    if not store.client:
        print("[vector_store] Skipping test: Supabase client not initialized.")
    else:
        try:
            current_count = store.count()
            print(f"[vector_store] Current jobs in DB: {current_count}")
            
            # Dummy job
            from app.models.job import Job
            import uuid
            dummy_job = Job(
                job_id=str(uuid.uuid4()),
                title="Smoke Test Engineer",
                company="Antigravity",
                description="Testing the vector store connection."
            )
            dummy_embedding = [0.1] * 768
            
            store.add_job(dummy_job, dummy_embedding)
            search_results = store.search(dummy_embedding, top_k=1)
            if search_results:
                print(f"[vector_store] Found dummy job: {search_results[0]['job'].title}")
                print(f"[vector_store] Similarity: {search_results[0]['similarity_score']}")
            
        except Exception as e:
            print(f"[vector_store] Smoke test failed: {e}")
