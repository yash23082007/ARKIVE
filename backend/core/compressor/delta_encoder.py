from typing import List, Union

Numeric = Union[int, float]

class DeltaEncoder:
    @staticmethod
    def encode(data: List[Numeric]) -> List[Numeric]:
        """
        Encodes a list of numbers as their sequential differences.
        [X0, X1, X2, ...] -> [X0, X1-X0, X2-X1, ...]
        """
        if not data:
            return []
            
        encoded = [data[0]]
        for i in range(1, len(data)):
            diff = data[i] - data[i-1]
            # Keep precision high but round to prevent float representation noise
            if isinstance(diff, float):
                diff = round(diff, 6)
            encoded.append(diff)
            
        return encoded

    @staticmethod
    def decode(encoded_data: List[Numeric]) -> List[Numeric]:
        """
        Decodes delta-encoded numbers back to their original sequence.
        """
        if not encoded_data:
            return []
            
        decoded = [encoded_data[0]]
        for i in range(1, len(encoded_data)):
            val = decoded[-1] + encoded_data[i]
            if isinstance(val, float):
                val = round(val, 6)
            decoded.append(val)
            
        return decoded
