import heapq
from collections import Counter
from typing import Dict, Tuple

class HuffmanNode:
    def __init__(self, char: str = None, freq: int = 0):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None
    
    def __lt__(self, other):
        return self.freq < other.freq

class HuffmanEncoder:
    @staticmethod
    def encode(text: str) -> Tuple[bytes, Dict[str, str], int]:
        """
        Encodes a string using custom Huffman coding.
        Returns:
            - encoded_bytes: Compressed data as bytes
            - codebook: Dictionary mapping characters to binary strings
            - bit_length: Total number of active bits in the encoded bit stream
        """
        if not text:
            return b"", {}, 0
            
        # Edge case: only one character type exists
        frequency = Counter(text)
        if len(frequency) == 1:
            char = list(frequency.keys())[0]
            codebook = {char: "0"}
            encoded_bits = "0" * len(text)
            encoded_bytes = int(encoded_bits, 2).to_bytes(
                (len(encoded_bits) + 7) // 8, byteorder='big'
            )
            return encoded_bytes, codebook, len(encoded_bits)

        # Build Heap
        heap = [HuffmanNode(char, freq) for char, freq in frequency.items()]
        heapq.heapify(heap)
        
        while len(heap) > 1:
            left = heapq.heappop(heap)
            right = heapq.heappop(heap)
            merged = HuffmanNode(None, left.freq + right.freq)
            merged.left = left
            merged.right = right
            heapq.heappush(heap, merged)
        
        codebook = {}
        HuffmanEncoder._generate_codes(heap[0], "", codebook)
        
        encoded_bits = "".join(codebook[char] for char in text)
        bit_length = len(encoded_bits)
        
        # Convert binary string to bytes (padding with zeros at the end to make it a multiple of 8)
        padding_needed = (8 - (bit_length % 8)) % 8
        padded_bits = encoded_bits + ("0" * padding_needed)
        
        encoded_bytes = bytearray()
        for i in range(0, len(padded_bits), 8):
            byte_segment = padded_bits[i:i+8]
            encoded_bytes.append(int(byte_segment, 2))
            
        return bytes(encoded_bytes), codebook, bit_length

    @staticmethod
    def _generate_codes(node: HuffmanNode, code: str, codebook: Dict[str, str]):
        if node is None:
            return
        if node.char is not None:
            codebook[node.char] = code
            return
        HuffmanEncoder._generate_codes(node.left, code + "0", codebook)
        HuffmanEncoder._generate_codes(node.right, code + "1", codebook)

    @staticmethod
    def decode(encoded_bytes: bytes, codebook: Dict[str, str], bit_length: int) -> str:
        """
        Decodes a bytes object back into text using the Huffman codebook and bit_length.
        """
        if not encoded_bytes or not codebook:
            return ""
            
        # Reverse the codebook for decoding
        reverse_codebook = {v: k for k, v in codebook.items()}
        
        # Build binary string from bytes
        binary_str = ""
        for byte in encoded_bytes:
            binary_str += f"{byte:08b}"
            
        # Trim to the exact active bits
        binary_str = binary_str[:bit_length]
        
        decoded_chars = []
        current_code = ""
        
        for bit in binary_str:
            current_code += bit
            if current_code in reverse_codebook:
                decoded_chars.append(reverse_codebook[current_code])
                current_code = ""
                
        return "".join(decoded_chars)
