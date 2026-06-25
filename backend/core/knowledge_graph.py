import networkx as nx
from typing import List, Dict, Any

class KnowledgeGraph:
    """
    Builds and analyzes the dependency graph of all human knowledge.
    Uses NetworkX for graph algorithms.
    """

    def __init__(self):
        self.graph = nx.DiGraph()

    def add_concept(self, concept: dict):
        self.graph.add_node(
            concept["name"],
            layer=concept.get("layer", 5),
            importance=concept.get("importance", 5.0),
            definition=concept.get("definition", "")
        )
        for prereq in concept.get("prerequisites", []):
            # Connect prerequisite to the concept (directed edge: prereq -> concept)
            self.graph.add_edge(prereq, concept["name"], weight=0.9)

    def get_foundation_concepts(self) -> list:
        """Return concepts with no prerequisites — the roots of knowledge."""
        return [n for n in self.graph.nodes if self.graph.in_degree(n) == 0]

    def get_critical_path(self, target_concept: str) -> list:
        """
        Find the minimal set of concepts needed to understand a target.
        Uses topological sort + dependency resolution.
        """
        if target_concept not in self.graph:
            return []
        ancestors = nx.ancestors(self.graph, target_concept)
        subgraph = self.graph.subgraph(ancestors | {target_concept})
        return list(nx.topological_sort(subgraph))

    def get_most_foundational(self, n: int = 10) -> list:
        """
        Return top-N most foundational concepts by PageRank.
        These are the concepts everything else depends on.
        """
        if not self.graph.nodes:
            return []
        try:
            pagerank = nx.pagerank(self.graph)
            sorted_concepts = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)
            return [c[0] for c in sorted_concepts[:n]]
        except Exception:
            # Fallback in case of empty or disconnected nodes
            return list(self.graph.nodes)[:n]

    def export_for_visualization(self) -> dict:
        """Export graph in D3-compatible format for frontend."""
        nodes = []
        for node in self.graph.nodes:
            nodes.append({
                "id": node,
                "label": node,
                "layer": self.graph.nodes[node].get("layer", 5),
                "importance": self.graph.nodes[node].get("importance", 5.0),
                "definition": self.graph.nodes[node].get("definition", ""),
                "group": self.graph.nodes[node].get("layer", 5)
            })
            
        links = []
        for u, v, d in self.graph.edges(data=True):
            links.append({
                "source": u,
                "target": v,
                "weight": d.get("weight", 0.5)
            })
            
        return {"nodes": nodes, "links": links}
