from backend.core.compressor.pipeline import CompressionPipeline

class ArchiveCompressor:
    def __init__(self):
        self.pipeline = CompressionPipeline()

    def compress(self, text: str) -> dict:
        """
        Compresses input string using Huffman and LZ77.
        """
        return self.pipeline.compress(text)

    def decompress(self, compressed_bytes: bytes, codebook: dict, bit_length: int) -> str:
        """
        Decompresses and returns the original text.
        """
        return self.pipeline.decompress(compressed_bytes, codebook, bit_length)
