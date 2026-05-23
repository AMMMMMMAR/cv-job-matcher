import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Paths
    CORE_DIR = Path(__file__).resolve().parent
    APP_DIR = CORE_DIR.parent
    BACKEND_DIR = APP_DIR.parent
    PROJECT_ROOT = BACKEND_DIR.parent

    DATA_DIR = PROJECT_ROOT / "data"
    RAW_JOBS_DIR = DATA_DIR / "raw_jobs"
    NORMALIZED_JOBS_DIR = DATA_DIR / "normalized_jobs"
    PARSED_CVS_DIR = DATA_DIR / "parsed_cvs"
    SAMPLE_CVS_DIR = DATA_DIR / "sample_cvs"
    UPLOADS_DIR = DATA_DIR / "uploads"
    EVAL_DIR = DATA_DIR / "eval"
    EVAL_RESULTS_DIR = EVAL_DIR / "results"

    # Gemini
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_CHAT_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    GEMINI_EMBED_MODEL = os.getenv("GEMINI_EMBED_MODEL", "gemini-embedding-001")
    EMBED_DIMENSIONS = int(os.getenv("EMBED_DIMENSIONS", "768"))

    # JSearch (RapidAPI)
    RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
    RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST", "jsearch.p.rapidapi.com")

    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
    JOBS_TABLE = "jobs"
    MATCH_JOBS_RPC = "match_jobs"

    # Matching
    TOP_K_RETRIEVAL = 20
    TOP_K_FINAL = 5

    def ensure_dirs(self) -> None:
        """Create all necessary data directories if they don't exist."""
        dirs = [
            self.DATA_DIR,
            self.RAW_JOBS_DIR,
            self.NORMALIZED_JOBS_DIR,
            self.PARSED_CVS_DIR,
            self.SAMPLE_CVS_DIR,
            self.UPLOADS_DIR,
            self.EVAL_DIR,
            self.EVAL_RESULTS_DIR,
        ]
        for d in dirs:
            d.mkdir(parents=True, exist_ok=True)
            # Create .gitkeep for directories that should be tracked but empty
            gitkeep = d / ".gitkeep"
            if not gitkeep.exists():
                gitkeep.touch()

settings = Settings()
settings.ensure_dirs()

if __name__ == "__main__":
    print("[core.config] Settings initialized.")
    print(f"[core.config] Project Root: {settings.PROJECT_ROOT}")
    print(f"[core.config] Gemini Model: {settings.GEMINI_CHAT_MODEL}")
