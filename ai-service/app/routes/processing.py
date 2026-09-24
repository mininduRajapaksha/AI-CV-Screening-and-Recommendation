from fastapi import APIRouter, UploadFile, File, Form

router = APIRouter()


@router.post("/process-cv")
async def process_cv(
    cv: UploadFile = File(...),
    job_description: str = Form(...)
):
    return {
        "success": True,
        "message": "CV received successfully",
        "cv": {
            "filename": cv.filename,
            "content_type": cv.content_type
        },
        "job_description": job_description
    }