from typing import List, Dict, Any, Tuple

class LZ77Compressor:
    def __init__(self, window_size: int = 256, lookahead_buffer_size: int = 32):
        self.window_size = window_size
        self.lookahead_size = lookahead_buffer_size

    def compress(self, text: str) -> List[Dict[str, Any]]:
        """
        Compresses input text into a list of LZ77 tokens:
        Each token is a dictionary: {"o": offset, "l": length, "c": next_char}
        """
        tokens = []
        i = 0
        n = len(text)
        
        while i < n:
            match_offset = 0
            match_length = 0
            
            # Define search buffer and lookahead buffer boundaries
            search_start = max(0, i - self.window_size)
            search_buffer = text[search_start:i]
            lookahead_buffer = text[i:i + self.lookahead_size]
            
            # Find longest match
            for length in range(1, len(lookahead_buffer) + 1):
                substring = lookahead_buffer[:length]
                # Search for substring in search buffer
                idx = search_buffer.rfind(substring)
                if idx != -1:
                    # offset is distance from the current index i to the match start
                    offset = len(search_buffer) - idx
                    match_offset = offset
                    match_length = length
                else:
                    break
            
            # The next char is the character after the match
            next_char_idx = i + match_length
            next_char = text[next_char_idx] if next_char_idx < n else ""
            
            tokens.append({
                "o": match_offset,
                "l": match_length,
                "c": next_char
            })
            
            # Shift window
            i += match_length + 1
            
        return tokens

    def decompress(self, tokens: List[Dict[str, Any]]) -> str:
        """
        Decompresses LZ77 tokens back into the original string.
        """
        result = []
        for token in tokens:
            offset = token["o"]
            length = token["l"]
            char = token["c"]
            
            if length > 0:
                start_idx = len(result) - offset
                for j in range(length):
                    result.append(result[start_idx + j])
            
            if char:
                result.append(char)
                
        return "".join(result)
