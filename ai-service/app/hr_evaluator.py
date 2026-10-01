import os
import json
import requests

from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")


def evaluate_candidate(candidate, job_description):
    """
    AI Agent 02 - HR Evaluator

    Compares the candidate's extracted information
    against the provided job description.

    Agent 02 is responsible for:
    - Match percentage
    - Matched skills
    - Missing skills
    - Experience evaluation
    """

    if not api_key or api_key == "your_api_key_here":
        return {
            "error": "Please update the .env file with the real Gemini API Key."
        }

    prompt = f"""
You are an expert HR evaluation AI.

Your task is to evaluate a candidate against a job description.

You will receive:
1. Structured candidate information extracted from a CV.
2. A job description.

Evaluate ONLY the candidate's suitability based on the information provided.

Return ONLY a valid JSON object.
Do not include markdown.
Do not include explanations outside the JSON.

Use exactly this structure:

{{
    "matchPercentage": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "experienceEvaluation": {{
        "summary": "",
        "relevant_experience": ""
    }}
}}

Evaluation rules:

1. matchPercentage
- Calculate an overall percentage from 0 to 100.
- Consider required technical skills, relevant experience,
  and other clearly stated job requirements.
- Base the score only on the provided candidate information
  and job description.

2. matchedSkills
- List skills from the job description that the candidate clearly possesses.
- Compare skills semantically when appropriate.
- Do not invent skills that are not supported by the candidate information.

3. missingSkills
- List important required skills from the job description
  that are not present in the candidate information.
- Do not list optional skills as missing unless the job description
  clearly requires them.

4. experienceEvaluation
- Evaluate how relevant the candidate's experience is to the job.
- Use only the candidate's provided experience.
- Do not invent companies, job titles, or durations.

5. Important:
- Do NOT provide a hiring recommendation.
- Do NOT say "Recommended", "Not Recommended",
  "Highly Recommended", etc.
- Do NOT provide a final hiring decision.
- Do NOT provide a hiring justification.
- Agent 03 will handle recommendation and justification later.

Candidate Information:
{json.dumps(candidate, indent=2)}

Job Description:
{job_description}
"""

    try:
        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": api_key
        }

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }

        url = (
            "https://generativelanguage.googleapis.com/"
            "v1beta/models/gemini-3.8-flash:generateContent"
        )

        print("Connecting to Gemini for HR evaluation...")

        response = requests.post(
            url,
            headers=headers,
            json=payload
        )

        data = response.json()

        if "error" in data:
            return {
                "error": (
                    "Google API Error: "
                    f"{data['error'].get('message', 'Unknown error')}"
                )
            }

        raw_ai_text = (
            data["candidates"][0]["content"]["parts"][0]["text"]
        )

        clean_text = (
            raw_ai_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        evaluation = json.loads(clean_text)

        print("HR evaluation successful.")

        return evaluation

    except json.JSONDecodeError as error:
        return {
            "error": f"Invalid JSON returned by Gemini: {str(error)}"
        }

    except Exception as error:
        return {
            "error": str(error)
        }