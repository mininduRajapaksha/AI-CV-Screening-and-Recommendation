from fastapi import APIRouter, UploadFile, File, Form
import os
import tempfile

from app.information_extractor import process_cv_with_ai
from app.hr_evaluator import evaluate_candidate

router = APIRouter()


@router.post("/process-cv")
async def process_cv(
    cv: UploadFile = File(...),
    job_description: str = Form(...)
):
    temp_file_path = None

    try:
        # --------------------------------------------------
        # 1. Save uploaded CV temporarily
        # --------------------------------------------------

        file_extension = os.path.splitext(cv.filename)[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=file_extension
        ) as temp_file:

            temp_file.write(await cv.read())
            temp_file_path = temp_file.name

        print(f"CV temporarily saved: {temp_file_path}")

        # --------------------------------------------------
        # 2. Agent 01 - Information Extraction
        # --------------------------------------------------

        print("Starting Agent 01 - Information Extractor...")

        candidate_data = process_cv_with_ai(temp_file_path)

        if "error" in candidate_data:
            return {
                "success": False,
                "stage": "agent_01",
                "error": candidate_data["error"]
            }

        print("Agent 01 completed successfully.")

        # --------------------------------------------------
        # 3. Agent 02 - HR Evaluation
        # --------------------------------------------------

        print("Starting Agent 02 - HR Evaluator...")

        evaluation = evaluate_candidate(
            candidate_data,
            job_description
        )

        if "error" in evaluation:
            return {
                "success": False,
                "stage": "agent_02",
                "error": evaluation["error"]
            }

        print("Agent 02 completed successfully.")

        # --------------------------------------------------
        # 4. Return combined result
        # --------------------------------------------------

        return {
            "success": True,
            "candidate": candidate_data,
            "evaluation": evaluation
        }

    except Exception as error:

        return {
            "success": False,
            "error": str(error)
        }

    finally:

        # --------------------------------------------------
        # 5. Delete temporary CV
        # --------------------------------------------------

        if temp_file_path and os.path.exists(temp_file_path):

            os.remove(temp_file_path)

            print("Temporary CV deleted.")