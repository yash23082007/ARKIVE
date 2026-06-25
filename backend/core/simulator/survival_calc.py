from typing import Dict, Any

def calculate_survival_score(archive: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculates the longevity and threat scores of the archive based on parameters.
    Returns:
        - overall_score: 0-100 index
        - survival_years: calculated lifespan
        - grade: A/B/C/D
        - scenario_scores: dict of threats
    """
    # Extract parameters with fallbacks
    redundancy_count = archive.get("redundancy_count", 3)
    math_anchor_count = archive.get("math_anchor_count", 15)
    
    # Calculate score using user formula
    decoder_size_kb = 12.0
    bootstrap_completeness = 95.0
    is_hardware_agnostic = 1.0 # Boolean factor
    compression_ratio = 2.45
    
    factors = {
        'format_complexity': decoder_size_kb,
        'redundancy_layers': redundancy_count,
        'media_independence': is_hardware_agnostic,
        'bootstrap_completeness': bootstrap_completeness,
        'compression_ratio': compression_ratio,
        'mathematical_anchors': math_anchor_count
    }
    
    base_years = 50
    multiplier = (
        (100 - factors['format_complexity']) * 0.3 +
        factors['redundancy_layers'] * 10 +
        factors['media_independence'] * 100 +
        factors['bootstrap_completeness'] * 2 +
        factors['compression_ratio'] * 5 +
        factors['mathematical_anchors'] * 3
    ) / 100
    
    survival_years = int(base_years * multiplier)
    overall_score = min(100.0, round(multiplier * 30.0, 1))
    
    # Grade assignments
    if overall_score >= 80:
        grade = "A"
    elif overall_score >= 60:
        grade = "B"
    elif overall_score >= 40:
        grade = "C"
    else:
        grade = "D"
        
    # Scenario Scores
    emp_score = int(100 if is_hardware_agnostic else 10)
    nuclear_winter = int((bootstrap_completeness * 0.6) + (redundancy_count * 10))
    space_voyage = int(min(100, (redundancy_count * 20) + (math_anchor_count * 2)))
    dark_age = int((100 - decoder_size_kb) * 0.8 + (compression_ratio * 4))

    return {
        "overall_score": overall_score,
        "survival_years": survival_years,
        "grade": grade,
        "math_anchor_count": math_anchor_count,
        "scenario_scores": {
            "solar_emp": emp_score,
            "nuclear_winter": nuclear_winter,
            "space_decay": space_voyage,
            "dark_age": dark_age
        }
    }
