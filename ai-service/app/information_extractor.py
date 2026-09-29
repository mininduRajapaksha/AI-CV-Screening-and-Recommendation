import os
import json
import requests
from dotenv import load_dotenv
from pdf_extractor import extract_text_from_pdf

# [SEC-2] Securely load API keys using environment variables (.env)
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

#temp
# models_url = "https://generativelanguage.googleapis.com/v1beta/models"

# response = requests.get(
#     models_url,
#     headers={"X-goog-api-key": api_key}
# )

# print(response.status_code)
# print(response.text)
#temp

def process_cv_with_ai(file_path):
    """
    AI Agent 01 - Information Extractor

    Extracts structured candidate information from a CV.

    Agent 01 is responsible for:
    - Personal information
    - Education
    - Experience
    - Technical skills

    Agent 02 is responsible for:
    - Match percentage
    - Matched skills
    - Missing skills
    - Experience evaluation

    Agent 03 is responsible for:
    - AI recommendation
    - Justification
    """

    raw_text = extract_text_from_pdf(file_path)

    if "Error" in raw_text:
        return {"error": raw_text}

    if not api_key or api_key == "your_api_key_here":
        return {
            "error": "Please update the .env file with the real Gemini API Key."
        }

    # [REL-2] Strict prompt engineering
    prompt = f"""
    You are an expert HR AI Assistant.

    Extract candidate information from the CV text below.

    Return ONLY a valid JSON object.
    Do not include markdown tags.
    Do not include explanations outside the JSON object.

    Use exactly this structure:

    {{
        "personalInfo": {{
            "name": "Candidate Full Name",
            "email": "Email Address",
            "phone": "Phone Number"
        }},
        "education": [
            {{
                "degree": "Degree Name",
                "institution": "University or College Name"
            }}
        ],
        "experience": [
            {{
                "title": "Job Title",
                "duration": "Duration (e.g., 2 years)",
                "company": "Company Name"
            }}
        ],
        "technicalSkills": [
            "Skill 1",
            "Skill 2"
        ]
    }}

    Important:
    - Only extract information that is supported by the CV.
    - Do not invent candidate information.
    - If information is unavailable, use an empty string or empty array.
    - Do not calculate match percentage.
    - Do not recommend or reject the candidate.
    - Do not identify missing skills.
    - Do not provide a justification.

    CV Text:
    {raw_text}
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

        print("Connecting to Google Gemini API...")

        url = (
            "https://generativelanguage.googleapis.com/"
            "v1beta/models/gemini-3.8-flash:generateContent"
            # "v1beta/models/gemini-flash-latest:generateContent"
        )

        gemini_response = requests.post(
            url,
            headers=headers,
            json=payload
        )

        gemini_data = gemini_response.json()

        # Check Google API errors
        if "error" in gemini_data:
            return {
                "error": (
                    "Google API Error: "
                    f"{gemini_data['error'].get('message', 'Unknown error')}"
                )
            }

        # Extract Gemini response
        raw_ai_text = (
            gemini_data["candidates"][0]["content"]["parts"][0]["text"]
        )

        # Remove possible markdown JSON wrappers
        clean_text = (
            raw_ai_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        extracted_data = json.loads(clean_text)

        print("AI Extraction successful.")

        # Job ID is kept for the current backend structure.
        # The real Job Posting integration can replace this later.
        extracted_data["jobId"] = "1"

        return extracted_data

    except json.JSONDecodeError as error:
        return {
            "error": f"Invalid JSON returned by Gemini: {str(error)}"
        }

    except Exception as error:
        return {
            "error": str(error)
        }


if __name__ == "__main__":
    print("--- AI Information Extraction Started ---")

    result = process_cv_with_ai("app/sample_cv.pdf")

    print(json.dumps(result, indent=4))