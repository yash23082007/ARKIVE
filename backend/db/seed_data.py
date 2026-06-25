from backend.db.mongodb import get_db
from dotenv import load_dotenv
import os

load_dotenv()

SEED_CONCEPTS = [
    # Layer 0: Mathematical Foundation
    {"name": "prime_number", "layer": 0, "importance": 10.0,
     "definition": "A number divisible only by 1 and itself. Used as a signature of intelligent origin.", "prerequisites": []},
    {"name": "counting", "layer": 0, "importance": 10.0,
     "definition": "Sequential enumeration of quantities. The foundation of mathematical thought.", "prerequisites": ["prime_number"]},
    {"name": "zero", "layer": 0, "importance": 10.0,
     "definition": "The additive identity — representing the complete absence of quantity.", "prerequisites": ["counting"]},
    {"name": "infinity", "layer": 0, "importance": 9.0,
     "definition": "Unbounded quantity with no largest value or final boundary.", "prerequisites": ["counting"]},
    {"name": "logic_and", "layer": 0, "importance": 9.5,
     "definition": "Logical operator returning true only when all inputs are true.", "prerequisites": []},
    {"name": "logic_or", "layer": 0, "importance": 9.0,
     "definition": "Logical operator returning true if at least one input is true.", "prerequisites": []},
    {"name": "logic_not", "layer": 0, "importance": 9.5,
     "definition": "Logical negation operator that inverts the truth value of its operand.", "prerequisites": []},
    {"name": "equivalence", "layer": 0, "importance": 9.8,
     "definition": "The relation of equality or identical logical truth values.", "prerequisites": ["counting"]},

    # Layer 1: Physics
    {"name": "distance", "layer": 1, "importance": 9.0,
     "definition": "Spatial separation between two coordinates or bodies.", "prerequisites": ["counting"]},
    {"name": "time", "layer": 1, "importance": 9.5,
     "definition": "Measurement of progression of events from past to future.", "prerequisites": ["counting"]},
    {"name": "velocity", "layer": 1, "importance": 9.0,
     "definition": "Rate of change of displacement with respect to time.", "prerequisites": ["distance", "time"]},
    {"name": "force", "layer": 1, "importance": 9.6,
     "definition": "Any interaction that, when unopposed, will change the motion of an object.", "prerequisites": ["velocity"]},
    {"name": "gravity", "layer": 1, "importance": 9.5,
     "definition": "Attraction between masses proportional to product of masses and inversely to square of distance.", "prerequisites": ["counting", "distance", "force"]},
    {"name": "energy", "layer": 1, "importance": 9.8,
     "definition": "Capacity to do work, conserved across transformations in closed systems.", "prerequisites": ["force", "distance"]},
    {"name": "light_speed", "layer": 1, "importance": 9.0,
     "definition": "Maximum travel velocity in vacuum: 299,792,458 m/s.", "prerequisites": ["distance", "time"]},

    # Layer 2: Chemistry
    {"name": "hydrogen", "layer": 2, "importance": 9.0,
     "definition": "The lightest and most abundant chemical element in the universe.", "prerequisites": ["counting"]},
    {"name": "oxygen", "layer": 2, "importance": 9.5,
     "definition": "Highly reactive element, essential for respiration and water formation.", "prerequisites": ["counting"]},
    {"name": "atom", "layer": 2, "importance": 9.5,
     "definition": "Smallest unit of matter holding the chemical properties of an element.", "prerequisites": ["energy", "force"]},
    {"name": "molecule", "layer": 2, "importance": 9.2,
     "definition": "Group of atoms bonded together, representing the smallest fundamental unit of a compound.", "prerequisites": ["atom"]},
    {"name": "water", "layer": 2, "importance": 10.0,
     "definition": "H₂O — universal solvent, compound essential for all known life forms.", "prerequisites": ["atom", "hydrogen", "oxygen", "molecule"]},

    # Layer 3: Biology
    {"name": "dna", "layer": 3, "importance": 9.8,
     "definition": "Deoxyribonucleic acid, storing hereditary codes for development and functioning.", "prerequisites": ["molecule"]},
    {"name": "cell", "layer": 3, "importance": 10.0,
     "definition": "Basic unit of life — membrane-bound self-replicating structural system.", "prerequisites": ["water", "dna"]},
    {"name": "photosynthesis", "layer": 3, "importance": 9.0,
     "definition": "Conversion of light energy to chemical energy (glucose) by plants.", "prerequisites": ["light_speed", "water", "molecule"]},
    {"name": "evolution", "layer": 3, "importance": 9.5,
     "definition": "Change in heritable traits over generations driven by natural selection.", "prerequisites": ["dna", "cell"]},

    # Layer 4: Cognition
    {"name": "pattern_recognition", "layer": 4, "importance": 9.0,
     "definition": "Cognitive ability to identify regularities and recurrence in sensory input.", "prerequisites": ["cell"]},
    {"name": "language", "layer": 4, "importance": 9.5,
     "definition": "Symbolic communication system regulated by grammar, syntax, and semantics.", "prerequisites": ["pattern_recognition"]},

    # Layer 5: Civilization
    {"name": "soil", "layer": 5, "importance": 8.0,
     "definition": "Top layer of earth where plants grow, composed of organic remains and rock particles.", "prerequisites": ["water"]},
    {"name": "agriculture", "layer": 5, "importance": 9.5,
     "definition": "Deliberate cultivation of plants and animals to sustain human food supply.", "prerequisites": ["soil", "water"]},
    {"name": "medicine", "layer": 5, "importance": 9.5,
     "definition": "Science and practice of diagnosis, treatment, and prevention of biological disease.", "prerequisites": ["cell", "water"]},
    {"name": "mathematics", "layer": 5, "importance": 10.0,
     "definition": "Study of numbers, shapes, logic, patterns, and mathematical relationships.", "prerequisites": ["counting", "logic_and", "pattern_recognition"]}
]

SEED_RELATIONSHIPS = [
    {"from_concept": "counting", "to_concept": "prime_number", "strength": 0.9},
    {"from_concept": "zero", "to_concept": "counting", "strength": 0.8},
    {"from_concept": "infinity", "to_concept": "counting", "strength": 0.7},
    {"from_concept": "distance", "to_concept": "counting", "strength": 0.8},
    {"from_concept": "time", "to_concept": "counting", "strength": 0.8},
    {"from_concept": "velocity", "to_concept": "distance", "strength": 0.9},
    {"from_concept": "velocity", "to_concept": "time", "strength": 0.9},
    {"from_concept": "force", "to_concept": "velocity", "strength": 0.85},
    {"from_concept": "gravity", "to_concept": "force", "strength": 0.9},
    {"from_concept": "gravity", "to_concept": "distance", "strength": 0.9},
    {"from_concept": "energy", "to_concept": "force", "strength": 0.88},
    {"from_concept": "light_speed", "to_concept": "distance", "strength": 0.8},
    {"from_concept": "atom", "to_concept": "energy", "strength": 0.9},
    {"from_concept": "molecule", "to_concept": "atom", "strength": 0.95},
    {"from_concept": "water", "to_concept": "hydrogen", "strength": 0.95},
    {"from_concept": "water", "to_concept": "oxygen", "strength": 0.95},
    {"from_concept": "water", "to_concept": "molecule", "strength": 0.9},
    {"from_concept": "dna", "to_concept": "molecule", "strength": 0.95},
    {"from_concept": "cell", "to_concept": "water", "strength": 0.9},
    {"from_concept": "cell", "to_concept": "dna", "strength": 0.9},
    {"from_concept": "photosynthesis", "to_concept": "light_speed", "strength": 0.85},
    {"from_concept": "photosynthesis", "to_concept": "water", "strength": 0.9},
    {"from_concept": "evolution", "to_concept": "dna", "strength": 0.9},
    {"from_concept": "evolution", "to_concept": "cell", "strength": 0.88},
    {"from_concept": "pattern_recognition", "to_concept": "cell", "strength": 0.75},
    {"from_concept": "language", "to_concept": "pattern_recognition", "strength": 0.9},
    {"from_concept": "agriculture", "to_concept": "water", "strength": 0.9},
    {"from_concept": "medicine", "to_concept": "cell", "strength": 0.9},
    {"from_concept": "mathematics", "to_concept": "counting", "strength": 0.95},
    {"from_concept": "mathematics", "to_concept": "pattern_recognition", "strength": 0.85}
]

def seed():
    try:
        print("Connecting to database for seeding...")
        db = get_db()
        
        # Seed concepts
        db.concepts.delete_many({})
        print(f"Clearing concepts, inserting {len(SEED_CONCEPTS)} entries...")
        db.concepts.insert_many(SEED_CONCEPTS)
        
        # Seed relationships
        db.relationships.delete_many({})
        print(f"Clearing relationships, inserting {len(SEED_RELATIONSHIPS)} entries...")
        db.relationships.insert_many(SEED_RELATIONSHIPS)
        
        print("Database seeding complete.")
    except Exception as e:
        print(f"Database seed failed: {e}")

if __name__ == "__main__":
    seed()
