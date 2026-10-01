from pydantic import BaseModel, Field
from typing import List


class PersonalInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""


class Education(BaseModel):
    degree: str = ""
    institution: str = ""


class Experience(BaseModel):
    title: str = ""
    duration: str = ""
    company: str = ""


class CandidateInput(BaseModel):
    personalInfo: PersonalInfo
    education: List[Education] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    technicalSkills: List[str] = Field(default_factory=list)


class EvaluationRequest(BaseModel):
    candidate: CandidateInput
    job_description: str


class ExperienceEvaluation(BaseModel):
    summary: str
    relevant_experience: str


class EvaluationResponse(BaseModel):
    matchPercentage: float
    matchedSkills: List[str]
    missingSkills: List[str]
    experienceEvaluation: ExperienceEvaluation