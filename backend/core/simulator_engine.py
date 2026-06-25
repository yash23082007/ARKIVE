class CivilizationSimulator:
    """
    Simulates a 'clean-slate' civilization decoding the archive.
    Each step shows what the civilization has learned.
    """

    def __init__(self, archive_bytes: bytes):
        self.archive = archive_bytes
        self.known_concepts = set()
        self.current_layer = 0
        self.steps = []

    def run_simulation(self) -> list:
        """
        Run full simulation, returning list of steps.
        Each step represents a civilizational discovery.
        """
        self.steps = []

        # Step 1: Discover the magic bytes (prime sequence)
        self._step_discover_primes()

        # Step 2: Decode the header (learn the language)
        self._step_decode_header()

        # Step 3-8: Decode each layer
        for layer in range(7):
            self._step_decode_layer(layer)

        return self.steps

    def _step_discover_primes(self):
        self.steps.append({
            "step": 1,
            "title": "Discovery: The Signal",
            "description": "An unknown archive is found. The first 8 bytes, when converted to numbers, are: 2, 3, 5, 7, 11, 13, 17, 19. A mathematician recognizes this immediately — prime numbers. This is a signal from another intelligence.",
            "concepts_unlocked": ["prime_numbers", "mathematical_signal"],
            "visualization": "prime_discovery",
            "layer": 0,
            "emotional_weight": "This is the moment contact is made."
        })

    def _step_decode_header(self):
        self.steps.append({
            "step": 2,
            "title": "Decoding: The Rosetta Key",
            "description": "Following the primes, the header encodes a counting system, logic operators, and geometric primitives — all using only patterns derivable from mathematics. No language required. The civilization now has a decoder.",
            "concepts_unlocked": ["counting", "logic", "geometry"],
            "visualization": "header_decode",
            "layer": 0,
            "emotional_weight": "The archive is teaching you how to read it."
        })

    def _step_decode_layer(self, layer: int):
        layer_names = {
            0: "Mathematical Foundation",
            1: "Laws of Physics",
            2: "Chemistry & Matter",
            3: "Biology & Life",
            4: "Cognition & Language",
            5: "Human Civilization",
            6: "Meta: This Archive's Manual"
        }
        
        # Determine unlocked concepts based on layer
        layer_unlocked = {
            0: ["counting", "prime_number", "zero", "infinity", "logic_and", "logic_or", "logic_not", "equivalence"],
            1: ["distance", "time", "velocity", "force", "gravity", "energy", "light_speed"],
            2: ["hydrogen", "oxygen", "atom", "molecule", "water"],
            3: ["cell", "dna", "photosynthesis", "evolution"],
            4: ["pattern_recognition", "language"],
            5: ["soil", "agriculture", "medicine", "mathematics"],
            6: ["meta_specifications", "transcription_log"]
        }
        
        self.steps.append({
            "step": layer + 3,
            "title": f"Layer {layer}: {layer_names.get(layer, 'Unknown')}",
            "description": f"Using concepts learned in previous layers, the civilization decodes Layer {layer} of the packed archive, unlocking fundamental conceptual blocks.",
            "layer": layer,
            "concepts_unlocked": layer_unlocked.get(layer, []),
            "visualization": f"layer_{layer}_decode",
            "emotional_weight": f"Layer {layer} decoded. Unlocking {len(layer_unlocked.get(layer, []))} core principles."
        })

    def get_step(self, step_number: int) -> dict:
        if 0 <= step_number < len(self.steps):
            return self.steps[step_number]
        return {}
