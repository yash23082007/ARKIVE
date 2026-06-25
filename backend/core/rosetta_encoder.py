class RosettaEncoder:
    """
    Encodes knowledge using mathematical primitives.
    Layer 0 is always prime numbers — universal across all intelligence.
    """

    PRIME_SEQUENCE = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]

    def __init__(self):
        self.symbol_table = {}       # symbol -> binary representation
        self.concept_registry = {}   # concept_name -> encoded form
        self._bootstrap_symbol_table()

    def _bootstrap_symbol_table(self):
        """
        Build the base symbol table from pure mathematical primitives.
        Any intelligence that discovers prime numbers can read this.
        """
        # Represent concepts as prime-indexed binary sequences
        # Example: 'ONE' = position 1 in primes = 0b0010 (prime[0] = 2)
        for i, prime in enumerate(self.PRIME_SEQUENCE):
            binary = bin(prime)[2:].zfill(8)
            self.symbol_table[f"PRIMITIVE_{i}"] = binary

        # Logical operators encoded as binary operations
        self.symbol_table["AND"] = "00000001"
        self.symbol_table["OR"]  = "00000010"
        self.symbol_table["NOT"] = "00000011"
        self.symbol_table["IF"]  = "00000100"
        self.symbol_table["EQ"]  = "00000101"

    def encode_concept(self, concept: dict) -> str:
        """
        Encode a single knowledge concept into binary string.
        The concept must reference only lower-layer concepts.
        """
        layer = concept.get("layer", 5)
        name = concept.get("name", "")
        definition = concept.get("definition", "")
        prerequisites = concept.get("prerequisites", [])

        # Encode: [layer_bits][name_hash][prereq_count][prereq_hashes][definition]
        layer_bits = bin(layer)[2:].zfill(4)
        name_hash = self._stable_hash(name)
        prereq_count = bin(len(prerequisites))[2:].zfill(8)
        prereq_hashes = "".join([self._stable_hash(p) for p in prerequisites])
        definition_encoded = self._encode_text(definition)

        return f"{layer_bits}{name_hash}{prereq_count}{prereq_hashes}{definition_encoded}"

    def _stable_hash(self, text: str) -> str:
        """
        Deterministic hash using prime multiplication.
        Same input always gives same output — critical for decode integrity.
        """
        h = 1
        for char in text.lower():
            h = (h * ord(char)) % (2**32)
        return bin(h)[2:].zfill(32)

    def _encode_text(self, text: str) -> str:
        """
        Encode text as binary using ASCII → binary mapping.
        The decode instructions in the header explain this mapping.
        """
        return "".join([bin(ord(c))[2:].zfill(8) for c in text])

    def generate_archive(self, concepts: list) -> bytes:
        """
        Generate a complete self-decoding archive.
        Structure:
          [MAGIC_BYTES] [HEADER: decode instructions] [LAYERS 0-6]
        """
        # Magic bytes: first 8 primes in binary — universal signal
        magic = bytes([2, 3, 5, 7, 11, 13, 17, 19])

        # Header: bootstrap instructions in binary
        header = self._generate_header()

        # Sort concepts by layer (always encode prerequisites first)
        sorted_concepts = sorted(concepts, key=lambda c: c.get("layer", 5))

        # Encode each concept
        encoded_concepts = []
        for concept in sorted_concepts:
            encoded = self.encode_concept(concept)
            encoded_concepts.append(encoded)

        # Pack into bits
        all_bits = header + "".join(encoded_concepts)
        # Pad to byte boundary
        padding = (8 - len(all_bits) % 8) % 8
        all_bits += "0" * padding

        # Convert bit string to bytes
        byte_array = bytearray()
        for i in range(0, len(all_bits), 8):
            byte_array.append(int(all_bits[i:i+8], 2))

        return magic + bytes(byte_array)

    def _generate_header(self) -> str:
        """
        The header is the decode key.
        It explains itself using only patterns a mathematical mind would recognize.
        Starts with prime number counting — the universal 'hello'.
        """
        # Prime sequence as binary (the 'hello world' for any intelligence)
        prime_signal = "".join([bin(p)[2:].zfill(8) for p in self.PRIME_SEQUENCE])

        # Header version and structure description
        version = "00000001"  # Version 1

        return prime_signal + version
