import json
import math
from pathlib import Path
from pydantic import BaseModel
from rank_bm25 import BM25Okapi
from app.core.config import settings
from app.models.cv import CV
from app.models.job import Job
from app.services.embedder import embed_cv
from app.services.vector_store import JobVectorStore

class EvalTriplet(BaseModel):
    cv_id: str
    job_id: str
    relevance: int   # 0 / 1 / 2

class EvalReport(BaseModel):
    method: str
    precision_at_k: dict[str, float]
    recall_at_k: dict[str, float]
    mrr: float
    ndcg_at_k: dict[str, float]
    num_queries: int

def precision_at_k(retrieved: list[str], relevant: set[str], k: int) -> float:
    if not retrieved or k <= 0: return 0.0
    top_k = retrieved[:k]
    hits = len([doc_id for doc_id in top_k if doc_id in relevant])
    return hits / k

def recall_at_k(retrieved: list[str], relevant: set[str], k: int) -> float:
    if not relevant or k <= 0: return 0.0
    top_k = retrieved[:k]
    hits = len([doc_id for doc_id in top_k if doc_id in relevant])
    return hits / len(relevant)

def mean_reciprocal_rank(retrieved: list[str], relevant: set[str]) -> float:
    for i, doc_id in enumerate(retrieved):
        if doc_id in relevant:
            return 1.0 / (i + 1)
    return 0.0

def ndcg_at_k(retrieved: list[str], relevances: dict[str, int], k: int) -> float:
    """
    Normalized Discounted Cumulative Gain.
    relevances: map of job_id -> relevance score (0/1/2)
    """
    if not retrieved or k <= 0: return 0.0
    
    top_k = retrieved[:k]
    dcg = 0.0
    for i, doc_id in enumerate(top_k):
        rel = relevances.get(doc_id, 0)
        dcg += (2**rel - 1) / math.log2(i + 2)
        
    # Ideal DCG
    sorted_relevances = sorted(relevances.values(), reverse=True)
    idcg = 0.0
    for i, rel in enumerate(sorted_relevances[:k]):
        idcg += (2**rel - 1) / math.log2(i + 2)
        
    return dcg / idcg if idcg > 0 else 0.0

def evaluate_semantic(test_set: list[EvalTriplet], cvs: dict[str, CV], jobs: dict[str, Job]) -> EvalReport:
    """
    Run evaluation using the semantic vector search pipeline.
    """
    store = JobVectorStore()
    k_list = [1, 3, 5, 10]
    
    metrics = {
        "p@k": {k: [] for k in k_list},
        "r@k": {k: [] for k in k_list},
        "mrr": [],
        "ndcg@k": {k: [] for k in k_list}
    }
    
    # Group test set by CV
    cv_queries = {}
    for triplet in test_set:
        if triplet.cv_id not in cv_queries:
            cv_queries[triplet.cv_id] = []
        cv_queries[triplet.cv_id].append(triplet)
        
    for cv_id, triplets in cv_queries.items():
        if cv_id not in cvs: continue
        
        relevant_ids = {t.job_id for t in triplets if t.relevance > 0}
        relevances = {t.job_id: t.relevance for t in triplets}
        
        # 1. Embed CV
        vec = embed_cv(cvs[cv_id])
        
        # 2. Search
        results = store.search(vec, top_k=20)
        retrieved_ids = [res["job"].job_id for res in results]
        
        # 3. Compute metrics
        for k in k_list:
            metrics["p@k"][k].append(precision_at_k(retrieved_ids, relevant_ids, k))
            metrics["r@k"][k].append(recall_at_k(retrieved_ids, relevant_ids, k))
            metrics["ndcg@k"][k].append(ndcg_at_k(retrieved_ids, relevances, k))
        metrics["mrr"].append(mean_reciprocal_rank(retrieved_ids, relevant_ids))
        
    return EvalReport(
        method="semantic",
        precision_at_k={str(k): sum(v)/len(v) for k, v in metrics["p@k"].items() if v},
        recall_at_k={str(k): sum(v)/len(v) for k, v in metrics["r@k"].items() if v},
        mrr=sum(metrics["mrr"])/len(metrics["mrr"]) if metrics["mrr"] else 0.0,
        ndcg_at_k={str(k): sum(v)/len(v) for k, v in metrics["ndcg@k"].items() if v},
        num_queries=len(cv_queries)
    )

def evaluate_bm25(test_set: list[EvalTriplet], cvs: dict[str, CV], jobs: dict[str, Job]) -> EvalReport:
    """
    BM25 baseline over the job pool.
    """
    all_jobs_list = list(jobs.values())
    if not all_jobs_list: return EvalReport(method="bm25", precision_at_k={}, recall_at_k={}, mrr=0, ndcg_at_k={}, num_queries=0)
    
    # Tokenize jobs
    tokenized_corpus = [
        (j.title + " " + j.description).lower().split()
        for j in all_jobs_list
    ]
    bm25 = BM25Okapi(tokenized_corpus)
    
    k_list = [1, 3, 5, 10]
    metrics = {"p@k": {k: [] for k in k_list}, "r@k": {k: [] for k in k_list}, "mrr": [], "ndcg@k": {k: [] for k in k_list}}
    
    cv_queries = {}
    for triplet in test_set:
        if triplet.cv_id not in cv_queries: cv_queries[triplet.cv_id] = []
        cv_queries[triplet.cv_id].append(triplet)
        
    for cv_id, triplets in cv_queries.items():
        if cv_id not in cvs: continue
        relevant_ids = {t.job_id for t in triplets if t.relevance > 0}
        relevances = {t.job_id: t.relevance for t in triplets}
        
        # Tokenize CV
        cv = cvs[cv_id]
        query = (cv.title + " " + (cv.summary or "") + " " + " ".join(cv.skills)).lower().split()
        
        # Rank jobs
        scores = bm25.get_scores(query)
        ranked_jobs = [all_jobs_list[i].job_id for i in sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)]
        
        for k in k_list:
            metrics["p@k"][k].append(precision_at_k(ranked_jobs, relevant_ids, k))
            metrics["r@k"][k].append(recall_at_k(ranked_jobs, relevant_ids, k))
            metrics["ndcg@k"][k].append(ndcg_at_k(ranked_jobs, relevances, k))
        metrics["mrr"].append(mean_reciprocal_rank(ranked_jobs, relevant_ids))
        
    return EvalReport(
        method="bm25",
        precision_at_k={str(k): sum(v)/len(v) for k, v in metrics["p@k"].items() if v},
        recall_at_k={str(k): sum(v)/len(v) for k, v in metrics["r@k"].items() if v},
        mrr=sum(metrics["mrr"])/len(metrics["mrr"]) if metrics["mrr"] else 0.0,
        ndcg_at_k={str(k): sum(v)/len(v) for k, v in metrics["ndcg@k"].items() if v},
        num_queries=len(cv_queries)
    )

def load_test_set(path: Path) -> list[EvalTriplet]:
    if not path.exists(): return []
    with open(path, "r") as f:
        data = json.load(f)
        return [EvalTriplet(**t) for t in data]

def save_report(report: EvalReport, path: Path) -> None:
    with open(path, "w") as f:
        f.write(report.model_dump_json(indent=2))
    print(f"[evaluator] Report saved to {path}")

if __name__ == "__main__":
    # Smoke test
    print("[evaluator] Running smoke test...")
    # This would require actual data, so just print a placeholder
    print("[evaluator] Evaluation functions initialized.")
