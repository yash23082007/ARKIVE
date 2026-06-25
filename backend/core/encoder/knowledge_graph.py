import networkx as nx
from typing import List, Dict, Any

class KnowledgeGraphBuilder:
    def __init__(self):
        pass

    def build_graph(self, chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Builds a NetworkX graph from a list of anchored knowledge chunks.
        Returns a JSON-serializable node-link graph dictionary.
        """
        G = nx.Graph()
        
        # 1. Add nodes (knowledge chunks)
        for chunk in chunks:
            G.add_node(
                chunk["id"], 
                text=chunk["text"][:100] + "..." if len(chunk["text"]) > 100 else chunk["text"],
                word_count=chunk["word_count"],
                paragraph_index=chunk["paragraph_index"],
                has_math=chunk.get("has_math", False)
            )

        # 2. Add sequential edges (adjacent paragraphs/chunks)
        for i in range(len(chunks) - 1):
            G.add_edge(chunks[i]["id"], chunks[i+1]["id"], type="sequential", weight=1.0)

        # 3. Add semantic edges (shared mathematical constants or equations)
        # We check which chunks share anchors and draw lines between them
        anchor_map = {} # anchor_name -> list of chunk_ids
        
        for chunk in chunks:
            anchors = chunk.get("math_anchors", [])
            for anchor in anchors:
                key = anchor["anchor"]
                if key not in anchor_map:
                    anchor_map[key] = []
                anchor_map[key].append(chunk["id"])
                
        for anchor_key, chunk_ids in anchor_map.items():
            if len(chunk_ids) > 1:
                # Connect all chunks that share this anchor
                for j in range(len(chunk_ids)):
                    for k in range(j + 1, len(chunk_ids)):
                        c1, c2 = chunk_ids[j], chunk_ids[k]
                        if G.has_edge(c1, c2):
                            # Increase weight if they already share a sequential connection
                            G[c1][c2]["weight"] += 0.5
                            if "type" in G[c1][c2]:
                                G[c1][c2]["type"] += f", shared_{anchor_key}"
                        else:
                            G.add_edge(c1, c2, type=f"shared_{anchor_key}", weight=0.8)

        # Serialize NetworkX graph into D3 node-link format
        nodes = []
        for node_id, data in G.nodes(data=True):
            nodes.append({
                "id": node_id,
                **data
            })
            
        links = []
        for source, target, data in G.edges(data=True):
            links.append({
                "source": source,
                "target": target,
                **data
            })
            
        return {
            "nodes": nodes,
            "links": links
        }
