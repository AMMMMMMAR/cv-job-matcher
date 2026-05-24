import json
from pathlib import Path
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.utils import get_gemini_schema
from app.models.cv import CV
from app.services.pdf_extractor import extract_text_from_pdf

client = genai.Client(api_key=settings.GEMINI_API_KEY)

SYSTEM_INSTRUCTION = (
    "You are an expert CV/resume parser. Your goal is to extract structured information from the provided CV text. "
    "Never invent data. If information is missing, leave it as null or an empty list. "
    "Extract technical skills as short, canonical tokens (e.g., 'Python', 'React', 'AWS'). "
    "Output must strictly follow the provided JSON schema."
)

def parse_cv_text(cv_text: str) -> CV:
    """
    Convert raw CV text into a structured CV object using Gemini.
    """
    print("[cv_parser] Sending CV text to Gemini for parsing...")
    
    response = client.models.generate_content(
        model=settings.GEMINI_CHAT_MODEL,
        contents=cv_text,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=get_gemini_schema(CV),
            temperature=0.1,
        ),
    )
    
    if response.parsed:
        if isinstance(response.parsed, dict):
            return CV(**response.parsed)
        return response.parsed
    
    # Fallback to manual parsing if response.parsed is not available
    try:
        data = json.loads(response.text)
        return CV(**data)
    except Exception as e:
        print(f"[cv_parser] Error parsing Gemini response: {e}")
        raise ValueError("Failed to parse CV into structured format.")

def parse_cv_pdf(pdf_path: str | Path) -> CV:
    """
    Extract text from PDF and then parse it using Gemini.
    """
    text = extract_text_from_pdf(pdf_path)
    return parse_cv_text(text)

def save_cv(cv_obj: CV, source_filename: str) -> Path:
    """
    Save the parsed CV object to a JSON file.
    """
    filename = f"parsed_{Path(source_filename).stem}.json"
    filepath = settings.PARSED_CVS_DIR / filename
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(cv_obj.model_dump_json(indent=2))
        
    print(f"[cv_parser] Saved parsed CV to {filepath}")
    return filepath

if __name__ == "__main__":
    # Smoke test
    print("[cv_parser] Running smoke test...")
    if not settings.GEMINI_API_KEY:
        print("[cv_parser] Skipping test: GEMINI_API_KEY not set.")
    else:
        # Create a dummy CV text
        test_text = """
        John Doe
        Software Engineer
        Skills: Python, FastAPI, Docker, PostgreSQL
        Experience:
        Senior Developer at TechCorp (2020-Present)
        - Built a high-performance matching engine.
        Education:
        B.S. Computer Science, Stanford University (2016-2020)
        """
        try:
            cv = parse_cv_text(test_text)
            print(f"[cv_parser] Successfully parsed CV for: {cv.full_name}")
            save_cv(cv, "test_cv.txt")
        except Exception as e:
            print(f"[cv_parser] Smoke test failed: {e}")
