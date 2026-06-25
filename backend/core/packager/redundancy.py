from typing import List, Tuple

class XORRedundancy:
    @staticmethod
    def generate_parity(blocks: List[bytes]) -> bytes:
        """
        Generates a parity block by XORing a list of equal-sized byte blocks.
        """
        if not blocks:
            return b""
            
        block_len = len(blocks[0])
        parity = bytearray(block_len)
        
        for block in blocks:
            if len(block) != block_len:
                raise ValueError("All blocks must be of equal size to generate parity.")
            for i in range(block_len):
                parity[i] ^= block[i]
                
        return bytes(parity)

    @staticmethod
    def recover_block(remaining_blocks: List[bytes], parity_block: bytes) -> bytes:
        """
        Recovers a single lost block using the remaining blocks and the parity block.
        Since XOR is self-inverse: LostBlock = Parity XOR B1 XOR B2 XOR ...
        """
        all_blocks = remaining_blocks + [parity_block]
        return XORRedundancy.generate_parity(all_blocks)

    @staticmethod
    def create_redundancy_layer(data: bytes, num_data_blocks: int = 4) -> Tuple[List[bytes], bytes]:
        """
        Splits data into N equal blocks (with zero-padding) and computes a parity block.
        """
        data_len = len(data)
        block_size = (data_len + num_data_blocks - 1) // num_data_blocks
        
        blocks = []
        for i in range(num_data_blocks):
            start = i * block_size
            end = min(start + block_size, data_len)
            block = data[start:end]
            
            # Pad the block with zeros if it's smaller than the block_size
            if len(block) < block_size:
                block = block + b"\x00" * (block_size - len(block))
            blocks.append(block)
            
        parity = XORRedundancy.generate_parity(blocks)
        return blocks, parity
