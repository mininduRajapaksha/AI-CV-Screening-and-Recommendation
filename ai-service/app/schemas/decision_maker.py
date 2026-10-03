from pydantic import BaseModel
from typing import List, Literal


class ExperienceEvaluation(BaseModel):
    summary: str
    relevant_experience: str


class EvaluatorResult(BaseModel):
    matchPercentage: float
    matchedSkills: List[str]
    missingSkills: List[str]
    experienceEvaluation: ExperienceEvaluation


class DecisionRequest(BaseModel):
    evaluatorResult: EvaluatorResult


class DecisionResponse(BaseModel):
    aiRecommendation: Literal[
        "Highly Recommended",
        "Recommended",
        "Not Recommended"
    ]

    justification: str