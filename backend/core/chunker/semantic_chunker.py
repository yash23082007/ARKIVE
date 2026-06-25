import re
from typing import List, Dict, Any

class SemanticChunker:
    def __init__(self, target_chunk_size: int = 500, overlap_size: int = 100):
        self.target_chunk_size = target_chunk_size
        self.overlap_size = overlap_size

    def split_sentences(self, text: str) -> List[str]:
        # Split sentences using regular expressions (split on punctuation followed by space/newline)
        sentence_end = re.compile(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s')
        sentences = sentence_end.split(text)
        return [s.strip() for s in sentences if s.strip()]

    def chunk_text(self, text: str) -> List[Dict[str, Any]]:
        """
        Splits text into semantic chunks based on sentence boundaries, keeping chunk length
        around target_chunk_size with overlap_size.
        """
        if not text:
            return []

        # Step 1: Split into paragraphs first to respect hard breaks
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        chunks = []
        chunk_idx = 0

        for p_idx, paragraph in enumerate(paragraphs):
            sentences = self.split_sentences(paragraph)
            
            current_chunk = []
            current_length = 0
            
            for sentence in sentences:
                sentence_len = len(sentence)
                
                # If adding this sentence exceeds target size and current chunk is not empty
                if current_length + sentence_len > self.target_chunk_size and current_chunk:
                    chunk_text = " ".join(current_chunk)
                    chunks.append({
                        "id": chunk_idx,
                        "text": chunk_text,
                        "word_count": len(chunk_text.split()),
                        "char_count": len(chunk_text),
                        "paragraph_index": p_idx
                    })
                    chunk_idx += 1
                    
                    # Implement overlap: carry forward the last few sentences
                    overlap_chunk = []
                    overlap_len = 0
                    for s in reversed(current_chunk):
                        if overlap_len + len(s) < self.overlap_size:
                            overlap_chunk.insert(0, s)
                            overlap_len += len(s) + 1
                        else:
                            break
                    current_chunk = overlap_chunk
                    current_length = overlap_len
                
                current_chunk.append(sentence)
                current_length += sentence_len + 1 # +1 for space
                
            if current_chunk:
                chunk_text = " ".join(current_chunk)
                chunks.append({
                    "id": chunk_idx,
                    "text": chunk_text,
                    "word_count": len(chunk_text.split()),
                    "char_count": len(chunk_text),
                    "paragraph_index": p_idx
                })
                chunk_idx += 1

        return chunks
