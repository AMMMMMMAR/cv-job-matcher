import sys
import json
from pathlib import Path

# Add project root to sys.path
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from app.core.config import settings
from app.services.evaluator import (
    load_test_set, evaluate_semantic, evaluate_bm25, save_report
)
from app.services.cv_parser import parse_cv_pdf
from app.models.job import Job
from app.services.vector_store import JobVectorStore

def run_evaluation():
    """
    Load test set, run semantic vs BM25 evaluation, and print results.
    """
    test_set_path = settings.EVAL_DIR / "test_set.json"
    if not test_set_path.exists():
        print(f"[evaluate] Test set not found at {test_set_path}")
        print("[evaluate] Please create a sample test set first.")
        return

    print("[evaluate] Loading test set...")
    test_set = load_test_set(test_set_path)
    
    # Pre-load all CVs mentioned in the test set
    cv_ids = {t.cv_id for t in test_set}
    cvs = {}
    for cv_id in cv_ids:
        # Expecting CVs to be in data/sample_cvs or similar
        # For simplicity in this script, we'll try to find any PDF that matches the ID
        pdf_path = settings.SAMPLE_CVS_DIR / f"{cv_id}.pdf"
        if pdf_path.exists():
            print(f"[evaluate] Parsing CV: {cv_id}")
            cvs[cv_id] = parse_cv_pdf(pdf_path)
        else:
            print(f"[evaluate] WARNING: CV file not found: {pdf_path}")

    # Pre-load jobs for BM25 (Semantic uses Supabase)
    print("[evaluate] Loading jobs from Supabase for BM25 baseline...")
    store = JobVectorStore()
    # Fetch all jobs (this might be slow if there are thousands)
    response = store.client.table(settings.JOBS_TABLE).select("job_json").execute()
    jobs = {row["job_json"]["job_id"]: Job(**row["job_json"]) for row in response.data}

    # 1. Run Semantic Evaluation
    print("[evaluate] Running Semantic evaluation...")
    semantic_report = evaluate_semantic(test_set, cvs, jobs)
    save_report(semantic_report, settings.EVAL_RESULTS_DIR / "semantic_report.json")

    # 2. Run BM25 Baseline
    print("[evaluate] Running BM25 baseline evaluation...")
    bm25_report = evaluate_bm25(test_set, cvs, jobs)
    save_report(bm25_report, settings.EVAL_RESULTS_DIR / "bm25_report.json")

    # 3. Print Comparison
    print("\n" + "="*40)
    print("EVALUATION RESULTS COMPARISON")
    print("="*40)
    print(f"{'Metric':<15} | {'Semantic':<10} | {'BM25':<10}")
    print("-" * 40)
    print(f"{'MRR':<15} | {semantic_report.mrr:.4f}    | {bm25_report.mrr:.4f}")
    
    for k in ["1", "3", "5"]:
        p_s = semantic_report.precision_at_k.get(k, 0.0)
        p_b = bm25_report.precision_at_k.get(k, 0.0)
        print(f"{'P@'+k:<15} | {p_s:.4f}    | {p_b:.4f}")
        
    for k in ["1", "3", "5"]:
        n_s = semantic_report.ndcg_at_k.get(k, 0.0)
        n_b = bm25_report.ndcg_at_k.get(k, 0.0)
        print(f"{'NDCG@'+k:<15} | {n_s:.4f}    | {n_b:.4f}")
    print("="*40)

if __name__ == "__main__":
    run_evaluation()
