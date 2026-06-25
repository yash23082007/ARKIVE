import re
from typing import List, Dict, Any

class MathDetector:
    # Scientific constants and their mathematical/physical values
    CONSTANTS = {
        "pi": {
            "symbol": "π", 
            "value": 3.14159265, 
            "description": "Ratio of a circle's circumference to its diameter",
            "regex": r"\b(pi|3\.14159|3\.14)\b"
        },
        "phi": {
            "symbol": "φ", 
            "value": 1.61803398, 
            "description": "Golden ratio",
            "regex": r"\b(phi|1\.6180|1\.618)\b"
        },
        "light_speed": {
            "symbol": "c", 
            "value": 299792458, 
            "description": "Speed of light in vacuum (m/s)",
            "regex": r"\b(speed of light|299,?792,?458|3\s*x\s*10\^8\s*m/s)\b"
        },
        "planck": {
            "symbol": "h", 
            "value": 6.62607015e-34, 
            "description": "Planck constant (J·s)",
            "regex": r"\b(Planck constant|6\.626\s*x\s*10\^-34)\b"
        },
        "gravity_const": {
            "symbol": "G", 
            "value": 6.6743e-11, 
            "description": "Newtonian constant of gravitation (m^3 kg^-1 s^-2)",
            "regex": r"\b(gravitational constant|6\.674\s*x\s*10\^-11)\b"
        },
        "electron_charge": {
            "symbol": "e", 
            "value": 1.60217663e-19, 
            "description": "Elementary charge of an electron (C)",
            "regex": r"\b(elementary charge|1\.602\s*x\s*10\^-19)\b"
        },
        "boltzmann": {
            "symbol": "k_B", 
            "value": 1.380649e-23, 
            "description": "Boltzmann constant (J/K)",
            "regex": r"\b(Boltzmann constant|1\.380\s*x\s*10\^-23)\b"
        }
    }

    # Equations patterns (e.g. E=mc^2, F=ma, y=mx+b, etc.)
    EQUATION_PATTERNS = [
        (r"\bE\s*=\s*m\s*c\^?2\b", "E=mc² (Mass-energy equivalence)"),
        (r"\bF\s*=\s*m\s*a\b", "F=ma (Newton's second law)"),
        (r"\ba\^?2\s*\+\s*b\^?2\s*=\s*c\^?2\b", "a² + b² = c² (Pythagorean theorem)"),
        (r"\bPV\s*=\s*nRT\b", "PV=nRT (Ideal gas law)"),
        (r"\bd\s*=\s*v\s*t\b", "d=vt (Distance-speed-time relation)"),
        (r"\bF\s*=\s*G\s*\(?m1\s*\*?\s*m2\)?\s*/\s*r\^?2\b", "Newtonian Gravity equation"),
        (r"\bV\s*=\s*I\s*R\b", "V=IR (Ohm's Law)"),
        (r"x\s*=\s*\(?-b\s*\+?-\s*\\?sqrt\(b\^?2\s*-\s*4ac\)\)?\s*/\s*\(?2a\)?", "Quadratic formula")
    ]

    def detect(self, text: str) -> Dict[str, Any]:
        """
        Scans text for mathematical constants and formula patterns.
        """
        detected_constants = []
        detected_equations = []
        
        # 1. Detect constants
        for name, info in self.CONSTANTS.items():
            if re.search(info["regex"], text, re.IGNORECASE):
                detected_constants.append({
                    "name": name,
                    "symbol": info["symbol"],
                    "value": info["value"],
                    "description": info["description"]
                })
                
        # 2. Detect equations
        for pattern, desc in self.EQUATION_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                detected_equations.append({
                    "expression": re.findall(pattern, text, re.IGNORECASE)[0],
                    "name": desc
                })

        # 3. Look for general mathematical expressions (like numbers, relations)
        # e.g., 2+3=5, numbers like 3.14159, or variables in mathematical contexts
        numeric_relations = re.findall(r"\b\d+\s*[\+\-\*\/=]\s*\d+\s*(?:=\s*\d+)?\b", text)
        for rel in numeric_relations:
            detected_equations.append({
                "expression": rel,
                "name": "Arithmetic expression"
            })

        return {
            "constants": detected_constants,
            "equations": detected_equations,
            "has_math": len(detected_constants) > 0 or len(detected_equations) > 0
        }
