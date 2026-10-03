from fastapi import APIRouter, UploadFile, File, Form

import os
import tempfile

from app.information_extractor import process_cv_with_ai
from app.hr_evaluator import evaluate_candidate
from app.decision_maker import make_decision


router = APIRouter()


@router.post("/process-cv")
async def process_cv(
    cv: UploadFile = File(...),
    job_description: str = Form(...)
):
    temp_file_path = None

    try:

        # ==================================================
        # 1. SAVE UPLOADED CV TEMPORARILY
        # ==================================================

        file_extension = os.path.splitext(cv.filename)[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=file_extension
        ) as temp_file:

            temp_file.write(await cv.read())
            temp_file_path = temp_file.name

        print("\n========================================")
        print("CV PROCESSING PIPELINE STARTED")
        print("========================================")

        print(f"CV temporarily saved: {temp_file_path}")


        # ==================================================
        # 2. AGENT 01 - INFORMATION EXTRACTOR
        # ==================================================

        print("\n----------------------------------------")
        print("Starting Agent 01 - Information Extractor")
        print("----------------------------------------")

        candidate_data = process_cv_with_ai(
            temp_file_path
        )

        # Check Agent 01 error

        if "error" in candidate_data:

            print("Agent 01 failed.")

            return {
                "success": False,
                "stage": "agent_01",
                "error": candidate_data["error"]
            }

        print("Agent 01 completed successfully.")

        print("\nAgent 01 Output:")
        print(candidate_data)


        # ==================================================
        # 3. AGENT 02 - HR EVALUATOR
        # ==================================================

        print("\n----------------------------------------")
        print("Starting Agent 02 - HR Evaluator")
        print("----------------------------------------")

        evaluation = evaluate_candidate(
            candidate_data,
            job_description
        )

        # Check Agent 02 error

        if "error" in evaluation:

            print("Agent 02 failed.")

            return {
                "success": False,
                "stage": "agent_02",
                "error": evaluation["error"]
            }

        print("Agent 02 completed successfully.")

        print("\nAgent 02 Output:")
        print(evaluation)


        # ==================================================
        # 4. AGENT 03 - DECISION MAKER
        # ==================================================

        print("\n----------------------------------------")
        print("Starting Agent 03 - Decision Maker")
        print("----------------------------------------")

        decision = make_decision(
            evaluation
        )

        # Check Agent 03 error

        if "error" in decision:

            print("Agent 03 failed.")

            return {
                "success": False,
                "stage": "agent_03",
                "error": decision["error"]
            }

        print("Agent 03 completed successfully.")

        print("\nAgent 03 Output:")
        print(decision)


        # ==================================================
        # 5. COMPLETE PIPELINE RESULT
        # ==================================================

        print("\n========================================")
        print("CV PROCESSING PIPELINE COMPLETED")
        print("========================================")

        return {
            "success": True,

            # ----------------------------------------------
            # Agent 01 result
            # ----------------------------------------------

            "candidate": candidate_data,

            # ----------------------------------------------
            # Agent 02 result
            # ----------------------------------------------

            "evaluation": evaluation,

            # ----------------------------------------------
            # Agent 03 result
            # ----------------------------------------------

            "decision": decision
        }


    # ======================================================
    # 6. UNEXPECTED ERROR
    # ======================================================

    except Exception as error:

        print("\n========================================")
        print("CV PROCESSING PIPELINE FAILED")
        print("========================================")

        print(f"Error: {str(error)}")

        return {
            "success": False,
            "error": str(error)
        }


    # ======================================================
    # 7. DELETE TEMPORARY CV
    # ======================================================

    finally:

        if (
            temp_file_path
            and os.path.exists(temp_file_path)
        ):

            os.remove(temp_file_path)

            print("\nTemporary CV deleted.")