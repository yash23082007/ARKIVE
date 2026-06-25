import struct
import json
from typing import Dict, Any, Tuple
from backend.core.packager.checksum import ChecksumProvider
from backend.core.packager.redundancy import XORRedundancy
from backend.core.bootstrap.prime_header import PrimeHeaderGenerator

class ArkivePackager:
    @staticmethod
    def pack(
        bootstrap_data: Dict[str, Any],
        knowledge_graph_data: Dict[str, Any],
        compressed_content_bytes: bytes,
        huffman_codebook: Dict[str, str],
        bit_length: int
    ) -> bytes:
        """
        Packs the archive layers into a custom .arkive structured byte stream.
        """
        # --- LAYER 0: Prime Sequence Header ---
        layer0_primes = PrimeHeaderGenerator.get_primes(20)
        layer0_str = ",".join(str(p) for p in layer0_primes)
        layer0_bytes = f"ARKIVE_L0_PRIMES:{layer0_str}\n".encode("utf-8")
        
        # --- LAYER 1: Rosetta Bootstrap ---
        bootstrap_json = json.dumps(bootstrap_data)
        bootstrap_bytes = bootstrap_json.encode("utf-8")
        layer1_header = f"ARKIVE_L1_BOOTSTRAP_LEN:{len(bootstrap_bytes)}\n".encode("utf-8")
        
        # --- LAYER 2: Knowledge Graph ---
        graph_json = json.dumps(knowledge_graph_data)
        graph_bytes = graph_json.encode("utf-8")
        layer2_header = f"ARKIVE_L2_GRAPH_LEN:{len(graph_bytes)}\n".encode("utf-8")
        
        # --- LAYER 3: Huffman Codebook and Compressed Content ---
        codebook_json = json.dumps(huffman_codebook)
        codebook_bytes = codebook_json.encode("utf-8")
        
        # Header detailing codebook length, active bit length, and content length
        layer3_meta = f"L3_CODEBOOK_LEN:{len(codebook_bytes)},BIT_LEN:{bit_length},CONTENT_LEN:{len(compressed_content_bytes)}\n".encode("utf-8")
        
        # --- LAYER 4: Redundancy + Checksums ---
        # Assemble everything from layer 0 to 3 to calculate checksums & parity
        core_data = (
            layer0_bytes + 
            layer1_header + bootstrap_bytes + 
            layer2_header + graph_bytes + 
            layer3_meta + codebook_bytes + compressed_content_bytes
        )
        
        # Calculate core checksum
        core_checksum = ChecksumProvider.calculate_crc32(core_data)
        
        # Generate XOR parity blocks for redundancy (4 blocks)
        blocks, parity_block = XORRedundancy.create_redundancy_layer(core_data, num_data_blocks=4)
        
        layer4_bytes = (
            f"ARKIVE_L4_CHECKSUM:{core_checksum}\n"
            f"PARITY_LEN:{len(parity_block)}\n"
        ).encode("utf-8") + parity_block
        
        # Final combined stream
        return core_data + b"\n===LAYER4_START===\n" + layer4_bytes

    @staticmethod
    def unpack(archive_bytes: bytes) -> Dict[str, Any]:
        """
        Unpacks a .arkive byte stream, verifying checksums and recovering layers.
        """
        try:
            # Separate the core data from the Layer 4 redundancy sector
            split_marker = b"\n===LAYER4_START===\n"
            if split_marker not in archive_bytes:
                raise ValueError("Corrupted file format: Layer 4 boundary not found.")
                
            core_data, layer4_sector = archive_bytes.split(split_marker, 1)
            
            # Read Checksum and Parity from Layer 4
            lines = layer4_sector.split(b"\n")
            checksum_line = lines[0].decode("utf-8")
            parity_len_line = lines[1].decode("utf-8")
            
            expected_checksum = int(checksum_line.split(":")[1])
            parity_len = int(parity_len_line.split(":")[1])
            
            # Extract parity bytes
            parity_header_len = len(lines[0]) + len(lines[1]) + 2 # +2 for newlines
            parity_block = layer4_sector[parity_header_len:parity_header_len + parity_len]
            
            # Verify Integrity
            is_valid = ChecksumProvider.verify_crc32(core_data, expected_checksum)
            
            # Now parse core_data
            offset = 0
            
            # 1. Parse Layer 0
            l0_end = core_data.find(b"\n", offset)
            l0_line = core_data[offset:l0_end].decode("utf-8")
            primes_str = l0_line.split(":")[1]
            primes = [int(p) for p in primes_str.split(",")]
            offset = l0_end + 1
            
            # 2. Parse Layer 1 Bootstrap
            l1_header_end = core_data.find(b"\n", offset)
            l1_header = core_data[offset:l1_header_end].decode("utf-8")
            bootstrap_len = int(l1_header.split(":")[1])
            offset = l1_header_end + 1
            
            bootstrap_bytes = core_data[offset:offset+bootstrap_len]
            bootstrap_data = json.loads(bootstrap_bytes.decode("utf-8"))
            offset += bootstrap_len
            
            # 3. Parse Layer 2 Graph
            l2_header_end = core_data.find(b"\n", offset)
            l2_header = core_data[offset:l2_header_end].decode("utf-8")
            graph_len = int(l2_header.split(":")[1])
            offset = l2_header_end + 1
            
            graph_bytes = core_data[offset:offset+graph_len]
            graph_data = json.loads(graph_bytes.decode("utf-8"))
            offset += graph_len
            
            # 4. Parse Layer 3 Content
            l3_meta_end = core_data.find(b"\n", offset)
            l3_meta = core_data[offset:l3_meta_end].decode("utf-8")
            # Parse parameters: L3_CODEBOOK_LEN:X,BIT_LEN:Y,CONTENT_LEN:Z
            meta_parts = l3_meta.split(",")
            codebook_len = int(meta_parts[0].split(":")[1])
            bit_length = int(meta_parts[1].split(":")[1])
            content_len = int(meta_parts[2].split(":")[1])
            offset = l3_meta_end + 1
            
            codebook_bytes = core_data[offset:offset+codebook_len]
            huffman_codebook = json.loads(codebook_bytes.decode("utf-8"))
            offset += codebook_len
            
            compressed_content_bytes = core_data[offset:offset+content_len]
            
            return {
                "is_valid": is_valid,
                "expected_checksum": expected_checksum,
                "layer0_primes": primes,
                "bootstrap_data": bootstrap_data,
                "knowledge_graph": graph_data,
                "huffman_codebook": huffman_codebook,
                "bit_length": bit_length,
                "compressed_content_bytes": compressed_content_bytes,
                "parity_block_size": parity_len
            }
        except Exception as e:
            raise ValueError(f"Failed to unpack .arkive file: {str(e)}")
