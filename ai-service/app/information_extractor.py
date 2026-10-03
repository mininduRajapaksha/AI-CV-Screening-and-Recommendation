import os
import json
import requests

from dotenv import load_dotenv
from app.pdf_extractor import extract_text_from_pdf


# [SEC-2] Securely load API key from .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")


# ---------------------------------------------------------
# Format candidate name
# ---------------------------------------------------------

def format_candidate_name(name):
    """
    Convert a candidate name into title case.

    Examples:
        MININDU RAJAPAKSHA
        -> Minindu Rajapaksha

        minindu rajapaksha
        -> Minindu Rajapaksha

        Minindu RAJAPAKSHA
        -> Minindu Rajapaksha

        MININDU K. RAJAPAKSHA
        -> Minindu K. Rajapaksha
    """

    if not name:
        return ""

    # Remove leading/trailing spaces
    name = name.strip()

    # Replace multiple spaces with a single space
    name = " ".join(name.split())

    # Convert each word to title case
    name = " ".join(
        word.capitalize()
        for word in name.split()
    )

    return name


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


    # ---------------------------------------------------------
    # Extract text from PDF
    # ---------------------------------------------------------

    raw_text = extract_text_from_pdf(file_path)

    if "Error" in raw_text:
        return {
            "error": raw_text
        }


    # ---------------------------------------------------------
    # Check Gemini API key
    # ---------------------------------------------------------

    if not api_key or api_key == "your_api_key_here":
        return {
            "error": "Please update the .env file with the real Gemini API Key."
        }


    # ---------------------------------------------------------
    # AI Prompt
    # ---------------------------------------------------------

    prompt = f"""
You are an expert HR AI Assistant.

Your task is to extract candidate information from the CV text below.

Extract ONLY information that is explicitly supported by the CV.

Do not invent information.

Return the candidate information using the provided JSON schema.

Important rules:

- Extract the candidate's name, email and phone number.
- Extract education information if available.
- Extract work experience if available.
- Extract technical skills if available.
- If information is unavailable, return an empty string or empty array.
- Do not guess missing information.
- Do not calculate match percentage.
- Do not compare the candidate with a job description.
- Do not identify missing skills.
- Do not recommend or reject the candidate.
- Do not provide a hiring justification.
- Do not perform Agent 02 or Agent 03 tasks.

CV Text:

{raw_text}
"""

    try:

        # -----------------------------------------------------
        # Gemini API request
        # -----------------------------------------------------

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
                        "personalInfo": {
                            "type": "OBJECT",
                            "properties": {
                                "name": {
                                    "type": "STRING"
                                },
                                "email": {
                                    "type": "STRING"
                                },
                                "phone": {
                                    "type": "STRING"
                                }
                            },
                            "required": [
                                "name",
                                "email",
                                "phone"
                            ]
                        },

                        "education": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "degree": {
                                        "type": "STRING"
                                    },
                                    "institution": {
                                        "type": "STRING"
                                    }
                                },
                                "required": [
                                    "degree",
                                    "institution"
                                ]
                            }
                        },

                        "experience": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "title": {
                                        "type": "STRING"
                                    },
                                    "duration": {
                                        "type": "STRING"
                                    },
                                    "company": {
                                        "type": "STRING"
                                    }
                                },
                                "required": [
                                    "title",
                                    "duration",
                                    "company"
                                ]
                            }
                        },

                        "technicalSkills": {
                            "type": "ARRAY",
                            "items": {
                                "type": "STRING"
                            }
                        }
                    },

                    "required": [
                        "personalInfo",
                        "education",
                        "experience",
                        "technicalSkills"
                    ]
                }
            }
        }

        print("Connecting to Google Gemini API...")

        url = (
            "https://generativelanguage.googleapis.com/"
            "v1beta/models/gemini-3.5-flash:generateContent"
        )

        gemini_response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=60
        )

        gemini_data = gemini_response.json()


        # -----------------------------------------------------
        # Check Gemini API errors
        # -----------------------------------------------------

        if "error" in gemini_data:
            return {
                "error": (
                    "Google API Error: "
                    f"{gemini_data['error'].get('message', 'Unknown error')}"
                )
            }


        # -----------------------------------------------------
        # Check candidates
        # -----------------------------------------------------

        if "candidates" not in gemini_data:
            return {
                "error": "Gemini did not return any candidates."
            }

        if not gemini_data["candidates"]:
            return {
                "error": "Gemini returned an empty candidates list."
            }


        # -----------------------------------------------------
        # Extract structured JSON response
        # -----------------------------------------------------

        raw_ai_text = (
            gemini_data["candidates"][0]
            ["content"]["parts"][0]["text"]
        )

        print("\n--- GEMINI RESPONSE ---")
        print(raw_ai_text)
        print("--- END GEMINI RESPONSE ---\n")

        extracted_data = json.loads(raw_ai_text)


        # -----------------------------------------------------
        # Normalize candidate name
        # -----------------------------------------------------

        if (
            "personalInfo" in extracted_data
            and isinstance(
                extracted_data["personalInfo"],
                dict
            )
        ):
            original_name = extracted_data[
                "personalInfo"
            ].get("name", "")

            formatted_name = format_candidate_name(
                original_name
            )

            extracted_data[
                "personalInfo"
            ]["name"] = formatted_name

            print(
                f"Candidate name formatted: "
                f"'{original_name}' -> '{formatted_name}'"
            )


        # -----------------------------------------------------
        # Extraction successful
        # -----------------------------------------------------

        print("AI Extraction successful.")

        return extracted_data


    # ---------------------------------------------------------
    # JSON parsing error
    # ---------------------------------------------------------

    except json.JSONDecodeError as error:
        return {
            "error": f"Invalid JSON returned by Gemini: {str(error)}"
        }


    # ---------------------------------------------------------
    # Request / other errors
    # ---------------------------------------------------------

    except requests.RequestException as error:
        return {
            "error": f"Gemini request failed: {str(error)}"
        }

    except Exception as error:
        return {
            "error": str(error)
        }


# ---------------------------------------------------------
# Local testing
# ---------------------------------------------------------

if __name__ == "__main__":

    print("--- AI Information Extraction Started ---")

    result = process_cv_with_ai(
        "app/sample_cv.pdf"
    )

    print(
        json.dumps(
            result,
            indent=4
        )
    )