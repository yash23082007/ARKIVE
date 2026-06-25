from typing import List, Dict, Any

class ReconstructionSimulator:
    @staticmethod
    def generate_simulation_steps(archive_info: Dict[str, Any], decompressed_text: str) -> List[Dict[str, Any]]:
        """
        Creates a structured list of steps to animate the reconstruction process
        of an archive from first principles.
        """
        bootstrap = archive_info["bootstrap_data"]
        codebook = archive_info["huffman_codebook"]
        graph = archive_info["knowledge_graph"]
        
        steps = [
            {
                "step": 0,
                "title": "Layer 0: Cosmic Signal Detection",
                "status": "active",
                "log": "Beacon detected. Scanning header for mathematical anomalies...",
                "code": f"Primes found: {archive_info['layer0_primes']}\nSignal strength high. Source confirmed as intelligent origin.",
                "data": {"primes": archive_info["layer0_primes"]}
            },
            {
                "step": 1,
                "title": "Stage 1: Quantity Alignment",
                "status": "pending",
                "log": "Parsing dots representation of integer values...",
                "code": "\n".join(f"'{item['representation']}' => {item['numeric']}" for item in bootstrap["stage_1_quantity"]["data"]),
                "data": bootstrap["stage_1_quantity"]["data"]
            },
            {
                "step": 2,
                "title": "Stage 2 & 3: Operators & Arithmetic Primer",
                "status": "pending",
                "log": "Deducing mathematical operators (+, -, *, /) and equivalence (=)...",
                "code": "\n".join(f"{item['eq']}  ({item['numerical']})" for item in bootstrap["stage_3_operations"]["equations"]),
                "data": bootstrap["stage_3_operations"]["equations"]
            },
            {
                "step": 3,
                "title": "Stage 4 & 5: Universal Constants",
                "status": "pending",
                "log": "Mapping ratios and physics invariants (pi, phi, speed of light)...",
                "code": "\n".join(f"{item['symbol']} ({item['name']}) = {item['value']}" for item in bootstrap["stage_5_physics"]["constants"]),
                "data": bootstrap["stage_5_physics"]["constants"]
            },
            {
                "step": 4,
                "title": "Stage 6: Semantic Translation (Word Mapping)",
                "status": "pending",
                "log": "Loading word-to-glyph Rosetta dictionary...",
                "code": f"Loaded {len(bootstrap['stage_6_symbols']['vocabulary'])} vocabulary mappings.\nExample: 'human' = {bootstrap['stage_6_symbols']['vocabulary'].get('human', '웃')}\n'earth' = {bootstrap['stage_6_symbols']['vocabulary'].get('earth', '🜨')}",
                "data": list(bootstrap["stage_6_symbols"]["vocabulary"].items())[:12]
            },
            {
                "step": 5,
                "title": "Stage 7: Grammatical Logic Rules",
                "status": "pending",
                "log": "Compiling syntax parser constraints based on logical connectives...",
                "code": "\n".join(f"[{rule['concept']}]: {rule['symbolic_example']}" for rule in bootstrap["stage_7_rules"]["rules"] if "rules" in bootstrap["stage_7_rules"]) if "stage_7_rules" in bootstrap and "rules" in bootstrap["stage_7_rules"] else "\n".join(f"[{rule['concept']}]: {rule['symbolic_example']}" for rule in bootstrap["stage_7_grammar"]["rules"]),
                "data": bootstrap.get("stage_7_rules", bootstrap.get("stage_7_grammar", {}))
            },
            {
                "step": 6,
                "title": "Layer 3: Huffman Codebook Extraction",
                "status": "pending",
                "log": "Synthesizing Huffman prefix-free decoding tree...",
                "code": f"Codebook size: {len(codebook)} keys. Total bits to read: {archive_info['bit_length']}.",
                "data": list(codebook.items())[:15]
            },
            {
                "step": 7,
                "title": "Layer 3: Text Decompression & Extraction",
                "status": "pending",
                "log": "Decompressing Huffman byte stream and parsing LZ77 token arrays...",
                "code": f"Decoded Text Sample:\n{decompressed_text[:250]}...",
                "data": {"text_length": len(decompressed_text), "savings": f"{round((1 - (len(archive_info['compressed_content_bytes']) / max(1, len(decompressed_text)))) * 100, 1)}% savings"}
            },
            {
                "step": 8,
                "title": "Layer 2: Knowledge Graph Assembly",
                "status": "pending",
                "log": "Reassembling concept nodes and relationship edges...",
                "code": f"Nodes created: {len(graph['nodes'])}\nEdges resolved: {len(graph['links'])}\nArchive status: ACTIVE AND READABLE",
                "data": graph
            }
        ]
        return steps
