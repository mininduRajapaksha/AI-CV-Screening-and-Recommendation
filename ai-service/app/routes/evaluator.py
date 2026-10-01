from fastapi import APIRouter, HTTPException

from app.schemas.evaluator import (
    EvaluationRequest,
    EvaluationResponse
)

from app.hr_evaluator import evaluate_candidate

router = APIRouter()


@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(request: EvaluationRequest):

    result = evaluate_candidate(
        request.candidate.model_dump(),
        request.job_description
    )

    if "error" in result:
        raise HTTPException(
            status_code=502,
            detail=result["error"]
        )

    return result