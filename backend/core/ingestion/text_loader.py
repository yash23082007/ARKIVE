def load_text(content: str) -> str:
    """
    Standardizes raw text content.
    """
    if not content:
        return ""
    # Strip leading/trailing whitespace and normalize line endings
    return content.strip().replace("\r\n", "\n")
