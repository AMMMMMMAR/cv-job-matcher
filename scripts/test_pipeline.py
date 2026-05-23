import sys
from pathlib import Path

# Add project root to sys.path
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from backend.app.core.config import settings
from backend.app.services.cv_parser import parse_cv_text
from backend.app.services.matcher import find_matches

def test_pipeline():
    """
    End-to-end smoke test of the parsing and matching pipeline.
    """
    print("[test_pipeline] Starting end-to-end pipeline test...")
    
    if not settings.GEMINI_API_KEY:
        print("[test_pipeline] ERROR: GEMINI_API_KEY not set.")
        return

    # 1. Mock CV Text
    test_cv_text = """
    Sarah Smith
    Principal Cloud Architect
    Expertise: Kubernetes, Terraform, Go, AWS, Azure, CI/CD, Microservices
    Summary: 10+ years experience building scalable cloud-native platforms.
    """
    
    print("[test_pipeline] Step 1: Parsing Mock CV...")
    try:
        cv = parse_cv_text(test_cv_text)
        print(f"Parsed Name: {cv.full_name}")
        print(f"Parsed Title: {cv.title}")
        print(f"Parsed Skills: {cv.skills}")
        
        # 2. Match against Database
        print("\n[test_pipeline] Step 2: Finding Matches in Supabase...")
        results = find_matches(cv)
        
        print(f"\n[test_pipeline] Found {len(results.matches)} matches.")
        for i, m in enumerate(results.matches):
            print(f"\nMatch #{i+1}:")
            print(f"  Job: {m.job.title} at {m.job.company}")
            print(f"  Similarity Score: {m.similarity_score:.4f}")
            print(f"  AI Match Score: {m.match_score}/100")
            print(f"  Explanation: {m.explanation}")
            print(f"  Skill Gaps: {m.skill_gaps}")
            
    except Exception as e:
        print(f"[test_pipeline] Pipeline test failed: {e}")

if __name__ == "__main__":
    test_pipeline()
