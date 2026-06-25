from typing import Dict, List, Tuple

class SymbolMapper:
    # Common core words and their universal mathematical/logical representations
    GLYPH_MAP = {
        "human": "웃",
        "man": "♂",
        "woman": "♀",
        "earth": "🜨",
        "sun": "☉",
        "water": "H₂O",
        "hydrogen": "H",
        "oxygen": "O",
        "carbon": "C",
        "nitrogen": "N",
        "light": "γ",
        "energy": "E",
        "time": "t",
        "mass": "m",
        "force": "F",
        "gravity": "g",
        "distance": "d",
        "velocity": "v",
        "acceleration": "a",
        "atom": "⚛",
        "planet": "🪐",
        "star": "★",
        "heat": "Q",
        "temperature": "T",
        "agriculture": "🌾",
        "death": "☠",
        "life": "🧬",
        "equal": "=",
        "plus": "+",
        "minus": "-",
        "multiply": "×",
        "divide": "÷"
    }

    @classmethod
    def get_symbol(cls, word: str) -> str:
        """
        Retrieves the symbol associated with a word (case-insensitive).
        Returns the original word if no symbol is mapped.
        """
        return cls.GLYPH_MAP.get(word.lower(), word)

    @classmethod
    def map_text(cls, text: str) -> List[Tuple[str, str]]:
        """
        Scans a text and extracts words that map to universal glyphs,
        returning a list of (word, symbol) tuples found.
        """
        words = text.lower().split()
        found_mappings = []
        seen = set()
        
        for w in words:
            # Strip punctuation
            w_clean = "".join(char for char in w if char.isalnum())
            if w_clean in cls.GLYPH_MAP and w_clean not in seen:
                found_mappings.append((w_clean, cls.GLYPH_MAP[w_clean]))
                seen.add(w_clean)
                
        return found_mappings
