import json
from typing import Dict, Any, Tuple
from backend.core.compressor.huffman import HuffmanEncoder
from backend.core.compressor.lz77 import LZ77Compressor

class CompressionPipeline:
    def __init__(self, lz77_window: int = 256, lz77_lookahead: int = 32):
        self.lz77 = LZ77Compressor(lz77_window, lz77_lookahead)
        self.huffman = HuffmanEncoder()

    def serialize_lz77(self, tokens: list[Dict[str, Any]]) -> str:
        """
        Serializes LZ77 tokens to an ultra-compact string.
        Format: "o,l,c|o,l,c|..."
        We escape pipe | and comma , characters in literals to prevent parse errors.
        """
        parts = []
        for t in tokens:
            # Escape separator characters
            escaped_char = t["c"].replace("\\", "\\\\").replace("|", "\\p").replace(",", "\\c")
            parts.append(f"{t['o']},{t['l']},{escaped_char}")
        return "|".join(parts)

    def deserialize_lz77(self, serialized: str) -> list[Dict[str, Any]]:
        """
        Deserializes a compact string back to LZ77 tokens.
        """
        if not serialized:
            return []
            
        tokens = []
        parts = serialized.split("|")
        for part in parts:
            if not part:
                continue
            subparts = part.split(",")
            if len(subparts) < 3:
                continue
            offset = int(subparts[0])
            length = int(subparts[1])
            # Unescape character
            escaped_char = ",".join(subparts[2:]) # handle case where character is comma
            char = escaped_char.replace("\\c", ",").replace("\\p", "|").replace("\\\\", "\\")
            tokens.append({"o": offset, "l": length, "c": char})
        return tokens

    def compress(self, text: str) -> Dict[str, Any]:
        """
        Compresses input text through LZ77 + Huffman serialization.
        Returns compression metadata and the compressed bytes.
        """
        lz77_tokens = self.lz77.compress(text)
        serialized_lz77 = self.serialize_lz77(lz77_tokens)
        
        compressed_bytes, codebook, bit_length = self.huffman.encode(serialized_lz77)
        
        original_size = len(text)
        compressed_size = len(compressed_bytes)
        ratio = original_size / max(1, compressed_size)
        
        return {
            "compressed_bytes": compressed_bytes,
            "codebook": codebook,
            "bit_length": bit_length,
            "lz77_tokens_count": len(lz77_tokens),
            "serialized_lz77_len": len(serialized_lz77),
            "original_size_bytes": original_size,
            "compressed_size_bytes": compressed_size,
            "compression_ratio": round(ratio, 2),
            "savings_percent": round((1 - (compressed_size / max(1, original_size))) * 100, 2)
        }

    def decompress(self, compressed_bytes: bytes, codebook: Dict[str, str], bit_length: int) -> str:
        """
        Decompresses the Huffman bytes and reconstructs the text via LZ77.
        """
        serialized_lz77 = self.huffman.decode(compressed_bytes, codebook, bit_length)
        lz77_tokens = self.deserialize_lz77(serialized_lz77)
        return self.lz77.decompress(lz77_tokens)
