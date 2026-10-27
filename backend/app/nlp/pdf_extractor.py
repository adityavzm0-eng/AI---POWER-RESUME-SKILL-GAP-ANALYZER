"""
PDF text extraction engine supporting PyMuPDF (fitz) and pypdf with scanned document detection.
"""
import io
import logging
from typing import Tuple, Dict, Any, List

logger = logging.getLogger("skillsync.pdf")

def extract_text_from_pdf_bytes(pdf_bytes: bytes, filename: str = "uploaded.pdf") -> Dict[str, Any]:
    """
    Extracts text and metadata from PDF bytes.
    Returns:
        {
            "text": str,
            "page_count": int,
            "char_count": int,
            "word_count": int,
            "is_scanned": bool,
            "extraction_method": str,
            "pages": List[str],
            "warning": str or None
        }
    """
    extracted_text = ""
    pages_text: List[str] = []
    page_count = 0
    extraction_method = "none"
    warning = None

    # Method 1: Try PyMuPDF (fitz)
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        page_count = len(doc)
        for page_idx in range(page_count):
            page = doc[page_idx]
            page_content = page.get_text("text")
            pages_text.append(page_content)
        extracted_text = "\n\n".join(pages_text).strip()
        doc.close()
        extraction_method = "pymupdf"
    except Exception as e:
        logger.warning(f"PyMuPDF extraction failed: {e}. Falling back to pypdf...")

    # Method 2: Fallback to pypdf if PyMuPDF returned no text or failed
    if not extracted_text:
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            page_count = len(reader.pages)
            pages_text = []
            for page in reader.pages:
                txt = page.extract_text() or ""
                pages_text.append(txt)
            extracted_text = "\n\n".join(pages_text).strip()
            extraction_method = "pypdf"
        except Exception as e:
            logger.error(f"pypdf extraction also failed: {e}")
            warning = f"Could not extract text: {str(e)}"

    char_count = len(extracted_text)
    words = extracted_text.split()
    word_count = len(words)

    # Scanned PDF detection heuristic: if pages > 0 but fewer than 25 words
    is_scanned = False
    if page_count > 0 and word_count < 25:
        is_scanned = True
        warning = (
            f"Detected only {word_count} words across {page_count} page(s). "
            "This PDF appears to be a scanned image or flattened graphical resume. "
            "Please paste the text manually or use a text-based PDF for best analysis."
        )

    return {
        "text": extracted_text,
        "page_count": max(page_count, 1 if extracted_text else 0),
        "char_count": char_count,
        "word_count": word_count,
        "is_scanned": is_scanned,
        "extraction_method": extraction_method,
        "pages": pages_text,
        "warning": warning
    }
