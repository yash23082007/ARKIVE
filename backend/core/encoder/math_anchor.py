from typing import List, Dict, Any
from backend.core.chunker.math_detector import MathDetector

class MathAnchorator:
    def __init__(self):
        self.detector = MathDetector()

    def anchor_chunks(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Augments chunks with mathematical anchors based on content analysis.
        """
        anchored_chunks = []
        for chunk in chunks:
            text = chunk["text"]
            detection = self.detector.detect(text)
            
            anchors = []
            # Gather symbols of constants as anchors
            for const in detection["constants"]:
                anchors.append({
                    "type": "constant",
                    "anchor": const["symbol"],
                    "details": const["name"]
                })
                
            # Gather equations as anchors
            for eq in detection["equations"]:
                anchors.append({
                    "type": "equation",
                    "anchor": eq["expression"],
                    "details": eq["name"]
                })

            new_chunk = dict(chunk)
            new_chunk["math_anchors"] = anchors
            new_chunk["has_math"] = detection["has_math"]
            anchored_chunks.append(new_chunk)
            
        return anchored_chunks
