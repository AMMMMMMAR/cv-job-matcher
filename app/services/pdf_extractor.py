import fitz  # PyMuPDF
import re
from pathlib import Path
from backend.app.core.config import settings

def _clean_text(text: str) -> str:
    """
    Apply whitespace cleanup and basic normalization.
    """
    # Replace multiple newlines with single ones
    text = re.sub(r'\n+', '\n', text)
    # Replace multiple spaces with single ones
    text = re.sub(r' +', ' ', text)
    # Strip leading/trailing whitespace
    text = text.strip()
    return text

def extract_text_from_pdf(pdf_path: str | Path) -> str:
    """
    Extract clean text from a PDF file using PyMuPDF.
    """
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    print(f"[pdf_extractor] Extracting text from: {pdf_path.name}")
    
    doc = fitz.open(pdf_path)
    full_text = ""
    
    for page in doc:
        full_text += page.get_text("text") + "\n"
    
    doc.close()
    
    return _clean_text(full_text)

if __name__ == "__main__":
    # Smoke test
    print("[pdf_extractor] Running smoke test...")
    # Try to find a sample PDF in data/sample_cvs
    samples = list(settings.SAMPLE_CVS_DIR.glob("*.pdf"))
    if samples:
        sample_path = samples[0]
        try:
            text = extract_text_from_pdf(sample_path)
            print(f"[pdf_extractor] Extracted {len(text)} characters.")
            print("-" * 20)
            print(text[:500] + "...")
            print("-" * 20)
        except Exception as e:
            print(f"[pdf_extractor] Error: {e}")
    else:
        print("[pdf_extractor] No sample PDF found in data/sample_cvs/ for smoke test.")
