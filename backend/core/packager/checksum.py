import zlib

class ChecksumProvider:
    @staticmethod
    def calculate_crc32(data: bytes) -> int:
        """
        Calculates the CRC32 checksum of a byte buffer.
        """
        return zlib.crc32(data) & 0xffffffff

    @staticmethod
    def verify_crc32(data: bytes, expected_checksum: int) -> bool:
        """
        Verifies if the CRC32 checksum of data matches expected_checksum.
        """
        return ChecksumProvider.calculate_crc32(data) == expected_checksum
