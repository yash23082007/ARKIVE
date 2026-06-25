from typing import List, Dict, Any

class GrammarPrimer:
    @staticmethod
    def get_grammar_rules() -> List[Dict[str, Any]]:
        """
        Returns a structured dictionary of grammar rules mapped from formal logic.
        This provides the grammatical foundation of the Rosetta Bootstrap.
        """
        return [
            {
                "rule_id": "G1_SVO",
                "concept": "Subject-Verb-Object (SVO)",
                "logic_analogue": "Predicate logic P(x, y)",
                "symbolic_example": "웃 (human) → 🌾 (agriculture) => 'Humans cultivate food'",
                "explanation": "Sentences are constructed with an Agent (subject), an Action (verb), and a Target (object)."
            },
            {
                "rule_id": "G2_NEGATION",
                "concept": "Negation",
                "logic_analogue": "NOT operator (¬)",
                "symbolic_example": "¬ Life = Death",
                "explanation": "Applying a negation prefix reverses the state or meaning of the subject."
            },
            {
                "rule_id": "G3_CONJUNCTION",
                "concept": "Conjunction & Disjunction",
                "logic_analogue": "AND (∧) / OR (∨) operators",
                "symbolic_example": "H ∧ O → H₂O (Hydrogen and Oxygen makes Water)",
                "explanation": "Combining terms establishes intersection or options between concept nodes."
            },
            {
                "rule_id": "G4_QUANTIFICATION",
                "concept": "Quantifiers",
                "logic_analogue": "Universal (∀) & Existential (∃) quantifiers",
                "symbolic_example": "∀ 웃 (All humans) : life → death",
                "explanation": "Specifies whether a statement applies to all nodes in a category, or at least one."
            },
            {
                "rule_id": "G5_CONDITIONAL",
                "concept": "Implication",
                "logic_analogue": "IF-THEN implication (→)",
                "symbolic_example": "☉ (sun) → Q (heat)",
                "explanation": "Specifies causal relationships: if condition A is true, then state B is achieved."
            }
        ]
