import os
import json
import requests

from dotenv import load_dotenv


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def make_decision(evaluator_result):

    if not GEMINI_API_KEY:
        return {
            "error": "GEMINI_API_KEY is not configured."
        }

    prompt = f"""
You are AI Agent 03 – Decision Maker for an AI-powered CV screening system.

Your task is to analyze the evaluation result produced by AI Agent 02
(HR Evaluator) and generate a final candidate recommendation.

IMPORTANT RESPONSIBILITIES:

1. Analyze the evaluator result.
2. Consider the match percentage.
3. Consider the matched skills.
4. Consider the missing skills.
5. Consider the candidate's relevant experience evaluation.
6. Generate one recommendation:
   - Highly Recommended
   - Recommended
   - Not Recommended
7. Generate a clear and concise justification explaining the recommendation.

IMPORTANT RULES:

- Do NOT invent candidate information.
- Do NOT introduce skills that are not present in the evaluator result.
- Do NOT change or recalculate the match percentage.
- Do NOT return any recommendation other than:
  "Highly Recommended",
  "Recommended",
  "Not Recommended".
- The recommendation must be based only on the evaluator result.
- The justification must explain the recommendation using the available
  evaluation information.
- Do not make decisions based on protected or personal characteristics.
- Return ONLY valid JSON.

Evaluator Result:

{json.dumps(evaluator_result, indent=2)}
"""

    url = (
        "https://generativelanguage.googleapis.com/"
        "v1beta/models/gemini-3.5-flash:generateContent"
    )

    headers = {
        "Content-Type": "application/json"
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
                    "aiRecommendation": {
                        "type": "STRING",

                        "enum": [
                            "Highly Recommended",
                            "Recommended",
                            "Not Recommended"
                        ]
                    },

                    "justification": {
                        "type": "STRING"
                    }
                },

                "required": [
                    "aiRecommendation",
                    "justification"
                ]
            }
        }
    }

    try:

        response = requests.post(
            f"{url}?key={GEMINI_API_KEY}",
            headers=headers,
            json=payload,
            timeout=60
        )

        response.raise_for_status()

        data = response.json()

        candidates = data.get("candidates", [])

        if not candidates:
            return {
                "error": "Gemini returned no candidates."
            }

        parts = (
            candidates[0]
            .get("content", {})
            .get("parts", [])
        )

        if not parts:
            return {
                "error": "Gemini returned an empty response."
            }

        raw_ai_text = parts[0].get("text", "").strip()

        if not raw_ai_text:
            return {
                "error": "Gemini returned an empty decision."
            }

        result = json.loads(raw_ai_text)

        recommendation = result.get(
            "aiRecommendation"
        )

        justification = result.get(
            "justification"
        )

        allowed_recommendations = [
            "Highly Recommended",
            "Recommended",
            "Not Recommended"
        ]

        if recommendation not in allowed_recommendations:
            return {
                "error": (
                    "AI returned an invalid recommendation: "
                    f"{recommendation}"
                )
            }

        if not isinstance(justification, str) or not justification.strip():
            return {
                "error": "AI returned an empty justification."
            }

        result["justification"] = justification.strip()

        print("\nAgent 03 - Decision Maker Result:")
        print(json.dumps(result, indent=2))

        return result

    except requests.exceptions.RequestException as error:

        print(
            "Agent 03 Gemini request error:",
            str(error)
        )

        return {
            "error": f"Google API Error: {str(error)}"
        }

    except json.JSONDecodeError as error:

        print(
            "Agent 03 JSON parsing error:",
            str(error)
        )

        return {
            "error": (
                "Agent 03 returned invalid JSON: "
                f"{str(error)}"
            )
        }

    except Exception as error:

        print(
            "Agent 03 unexpected error:",
            str(error)
        )

        return {
            "error": str(error)
        }