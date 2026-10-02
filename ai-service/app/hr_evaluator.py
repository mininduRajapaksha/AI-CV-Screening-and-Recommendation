import os
import json
import requests

from dotenv import load_dotenv


# ------------------------------------------------
# Load Gemini API key
# ------------------------------------------------

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

    Agent 03 is responsible for:
    - AI recommendation
    - Justification
    """

    # ------------------------------------------------
    # 1. Check Gemini API key
    # ------------------------------------------------

    if not api_key or api_key == "your_api_key_here":
        return {
            "error": "Please update the .env file with the real Gemini API Key."
        }


    # ------------------------------------------------
    # 2. AI Prompt
    # ------------------------------------------------

    prompt = f"""
You are an expert HR evaluation AI.

Your task is to evaluate a candidate against a job description.

You will receive:

1. Structured candidate information extracted from a CV.
2. A job description.

Evaluate ONLY the candidate's suitability based on the information provided.

Important:

- Use only information provided in the candidate data and job description.
- Do not invent candidate information.
- Do not assume experience that is not listed.
- Do not assume skills that are not listed.
- Do not make a hiring recommendation.
- Do not make a final hiring decision.
- Do not provide a hiring justification.

Evaluation rules:

1. matchPercentage

Calculate an overall percentage from 0 to 100.

Consider:

- Required technical skills
- Relevant experience
- Experience level
- Other clearly stated job requirements

Base the score only on the provided candidate information
and job description.

2. matchedSkills

List skills from the job description that the candidate
clearly possesses.

Compare skills semantically when appropriate.

Do not invent skills that are not supported by the candidate information.

3. missingSkills

List important required skills from the job description
that are not present in the candidate information.

Do not list optional skills as missing unless the job description
clearly requires them.

4. experienceEvaluation

Evaluate how relevant the candidate's experience is to the job.

Use only the candidate's provided experience.

If the candidate has no professional experience,
state that clearly.

Do not invent companies, job titles, or durations.

5. Agent 03 responsibility

Do NOT provide:

- Hiring recommendation
- Final hiring decision
- "Recommended"
- "Not Recommended"
- "Highly Recommended"
- Hiring justification

Agent 03 will handle recommendation and justification later.

Candidate Information:

{json.dumps(candidate, indent=2)}

Job Description:

{job_description}
"""


    try:

        # ------------------------------------------------
        # 3. Gemini API request
        # ------------------------------------------------

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
            ],

            "generationConfig": {

                "responseMimeType": "application/json",

                "responseSchema": {

                    "type": "OBJECT",

                    "properties": {

                        "matchPercentage": {
                            "type": "NUMBER"
                        },

                        "matchedSkills": {
                            "type": "ARRAY",
                            "items": {
                                "type": "STRING"
                            }
                        },

                        "missingSkills": {
                            "type": "ARRAY",
                            "items": {
                                "type": "STRING"
                            }
                        },

                        "experienceEvaluation": {

                            "type": "OBJECT",

                            "properties": {

                                "summary": {
                                    "type": "STRING"
                                },

                                "relevant_experience": {
                                    "type": "STRING"
                                }

                            },

                            "required": [
                                "summary",
                                "relevant_experience"
                            ]
                        }

                    },

                    "required": [
                        "matchPercentage",
                        "matchedSkills",
                        "missingSkills",
                        "experienceEvaluation"
                    ]
                }
            }
        }


        # ------------------------------------------------
        # 4. Send request
        # ------------------------------------------------

        print("Connecting to Gemini for HR evaluation...")


        url = (
            "https://generativelanguage.googleapis.com/"
            "v1beta/models/gemini-3.5-flash:generateContent"
        )


        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=60
        )


        data = response.json()


        # ------------------------------------------------
        # 5. Check Gemini API errors
        # ------------------------------------------------

        if "error" in data:

            return {
                "error": (
                    "Google API Error: "
                    f"{data['error'].get('message', 'Unknown error')}"
                )
            }


        # ------------------------------------------------
        # 6. Check candidates
        # ------------------------------------------------

        if "candidates" not in data:

            return {
                "error": "Gemini did not return any candidates."
            }


        if not data["candidates"]:

            return {
                "error": "Gemini returned an empty candidates list."
            }


        # ------------------------------------------------
        # 7. Extract structured JSON
        # ------------------------------------------------

        raw_ai_text = (
            data["candidates"][0]
            ["content"]["parts"][0]["text"]
        )


        print("\n--- GEMINI HR EVALUATION RESPONSE ---")
        print(raw_ai_text)
        print("--- END GEMINI HR EVALUATION RESPONSE ---\n")


        evaluation = json.loads(raw_ai_text)


        # ------------------------------------------------
        # 8. Validate match percentage
        # ------------------------------------------------

        match_percentage = evaluation.get(
            "matchPercentage",
            0
        )


        if match_percentage < 0:
            match_percentage = 0

        if match_percentage > 100:
            match_percentage = 100


        evaluation["matchPercentage"] = match_percentage


        print("HR evaluation successful.")


        return evaluation


    # ------------------------------------------------
    # 9. JSON parsing error
    # ------------------------------------------------

    except json.JSONDecodeError as error:

        return {
            "error": f"Invalid JSON returned by Gemini: {str(error)}"
        }


    # ------------------------------------------------
    # 10. Request error
    # ------------------------------------------------

    except requests.RequestException as error:

        return {
            "error": f"Gemini request failed: {str(error)}"
        }


    # ------------------------------------------------
    # 11. Other errors
    # ------------------------------------------------

    except Exception as error:

        return {
            "error": str(error)
        }