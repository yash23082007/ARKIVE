import re
from typing import List, Dict, Any

class ConceptExtractor:
    """
    Extracts structured knowledge concepts from raw text.
    Uses spaCy for NLP, with a robust regex-based fallback if spaCy model is not found.
    """

    def __init__(self):
        self.layer_keywords = {
            0: ["number", "prime", "count", "logic", "zero", "one", "infinity", "math", "equivalence"],
            1: ["gravity", "force", "energy", "light", "wave", "particle", "mass", "speed", "distance", "time", "velocity"],
            2: ["atom", "molecule", "element", "bond", "reaction", "compound", "hydrogen", "oxygen", "water"],
            3: ["cell", "dna", "protein", "evolution", "organism", "life", "photosynthesis"],
            4: ["language", "symbol", "thought", "pattern", "communication", "recognition"],
            5: ["civilization", "medicine", "agriculture", "technology", "society", "metallurgy", "compass"],
        }
        
        try:
            import spacy
            self.nlp = spacy.load("en_core_web_sm")
            self.has_spacy = True
            print("✓ spaCy loaded 'en_core_web_sm'.")
        except Exception as e:
            self.has_spacy = False
            print(f"Notice: spaCy model load failed ({e}). Using first-principles rule-based chunker.")

    def extract_concepts(self, text: str) -> List[Dict[str, Any]]:
        if not text or not text.strip():
            return []

        if self.has_spacy:
            return self._extract_with_spacy(text)
        else:
            return self._extract_with_rules(text)

    def _extract_with_spacy(self, text: str) -> List[Dict[str, Any]]:
        doc = self.nlp(text)
        concepts = []

        # Extract noun chunks as concept candidates
        for chunk in doc.noun_chunks:
            concept_name = chunk.root.lemma_.lower().strip()
            # Clean and sanitize concept name
            concept_name = re.sub(r'[^a-zA-Z0-9_]', '_', concept_name)
            
            if len(concept_name) > 2 and not concept_name.isdigit():
                layer = self._assign_layer(concept_name, text)
                concepts.append({
                    "name": concept_name,
                    "layer": layer,
                    "definition": self._extract_definition_spacy(concept_name, doc),
                    "prerequisites": self._find_prerequisites(concept_name, layer),
                    "importance": round(self._score_importance_spacy(chunk, doc), 1)
                })

        return self._deduplicate(concepts)

    def _extract_with_rules(self, text: str) -> List[Dict[str, Any]]:
        # Basic regex to split sentences
        sentences = [s.strip() for s in re.split(r'(?:\.|\?|!)\s', text) if s.strip()]
        concepts = []

        # List of common stops to avoid
        stopwords = {"this", "that", "these", "those", "their", "there", "what", "which", "with", "from", "they"}

        for sentence in sentences:
            # Match capitalized words or words around nouns
            words = re.findall(r'\b[a-zA-Z]{3,}\b', sentence)
            for word in words:
                word_lower = word.lower()
                if word_lower in stopwords:
                    continue
                # Simple condition for concept: appears in the layer keywords or holds scientific weight
                is_candidate = False
                for layer, keywords in self.layer_keywords.items():
                    if word_lower in keywords:
                        is_candidate = True
                        break
                
                if is_candidate:
                    layer = self._assign_layer(word_lower, text)
                    concepts.append({
                        "name": word_lower,
                        "layer": layer,
                        "definition": sentence,
                        "prerequisites": self._find_prerequisites(word_lower, layer),
                        "importance": 8.0 if word_lower in ["water", "gravity", "cell", "counting"] else 5.0
                    })

        return self._deduplicate(concepts)

    def _assign_layer(self, concept: str, context: str) -> int:
        """Assign concept to bootstrap layer based on keywords."""
        concept_lower = concept.lower()
        context_lower = context.lower()
        
        # Check if the concept itself is a keyword
        for layer, keywords in sorted(self.layer_keywords.items()):
            if concept_lower in keywords:
                return layer
                
        # Check context
        for layer, keywords in sorted(self.layer_keywords.items()):
            if any(kw in context_lower for kw in keywords):
                return layer
        return 5  # Default: civilizational layer

    def _score_importance_spacy(self, chunk, doc) -> float:
        """Score how foundational this concept is (0–10)."""
        freq = sum(1 for t in doc if t.lemma_.lower() == chunk.root.lemma_.lower())
        position_score = 1 - (chunk.start / max(1, len(doc)))
        return min(10.0, freq * 1.5 + position_score * 3.0)

    def _extract_definition_spacy(self, concept: str, doc) -> str:
        """Extract the sentence most likely to define this concept."""
        for sent in doc.sents:
            if concept in sent.text.lower():
                return sent.text.strip()
        return "A fundamental concept in human knowledge."

    def _find_prerequisites(self, concept: str, layer: int) -> List[str]:
        """Find concepts this concept depends on (always lower layers)."""
        prereq_map = {
            "photosynthesis": ["light_speed", "water", "molecule"],
            "gravity": ["distance", "force", "counting"],
            "dna": ["molecule"],
            "cell": ["water", "dna"],
            "water": ["hydrogen", "oxygen", "molecule"],
            "molecule": ["atom"],
            "counting": ["prime_number"],
            "zero": ["counting"],
            "infinity": ["counting"],
            "agriculture": ["water", "soil"],
            "medicine": ["cell", "water"],
            "mathematics": ["counting", "logic_and", "pattern_recognition"]
        }
        return prereq_map.get(concept.lower(), [])

    def _deduplicate(self, concepts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        seen = set()
        unique = []
        for c in concepts:
            if c["name"] not in seen:
                seen.add(c["name"])
                unique.append(c)
        return unique
