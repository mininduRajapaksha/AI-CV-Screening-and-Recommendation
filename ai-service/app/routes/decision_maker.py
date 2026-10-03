from fastapi import APIRouter, HTTPException

from app.schemas.decision_maker import (
    DecisionRequest,
    DecisionResponse
)

from app.decision_maker import make_decision


router = APIRouter()


@router.post(
    "/decide",
    response_model=DecisionResponse
)
async def decide(request: DecisionRequest):

    result = make_decision(
        request.evaluatorResult.model_dump()
    )

    if "error" in result:

        raise HTTPException(
            status_code=502,
            detail=result["error"]
        )

    return result