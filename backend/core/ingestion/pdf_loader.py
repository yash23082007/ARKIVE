import io
from PyPDF2 import PdfReader

def load_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts text from binary PDF data using PyPDF2.
    """
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        text_content = []
        
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_content.append(page_text)
                
        return "\n\n".join(text_content).strip()
    except Exception as e:
        raise ValueError(f"Failed to parse PDF file: {str(e)}")
