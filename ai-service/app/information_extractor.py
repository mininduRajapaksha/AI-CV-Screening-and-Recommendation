import os
import json
import requests
from dotenv import load_dotenv
from pdf_extractor import extract_text_from_pdf

# [SEC-2] Securely load API keys using environment variables (.env)
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

def process_cv_with_ai(file_path):
    """
    AI Agent 01 (Information Extractor)
    Aligns with [REQ-4.2]: Parses raw text and extracts structured JSON data.
    """
    
    raw_text = extract_text_from_pdf(file_path)
    if "Error" in raw_text:
        return raw_text

    if not api_key or api_key == "your_api_key_here":
        return "Error: Please update the .env file with the real Gemini API Key."

    # [REL-2] Strict Prompt Engineering to prevent hallucinations and enforce schema validation.
    # The JSON structure below exactly matches the expected MongoDB Candidate schema.
    prompt = f"""
    You are an expert HR AI Assistant. Extract the following information from the CV text below.
    Return ONLY a valid JSON object without any markdown tags.
    Ensure the JSON strictly follows this exact structure:
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
        "technicalSkills": ["Skill 1", "Skill 2"]
    }}
    
    CV Text:
    {raw_text}
    """

    try:
        # Utilizing standard header-based authentication for modern Gemini Agent Platform API Keys
        headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': api_key
        }
        
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        
        print("Connecting to Google Gemini API...")
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
        
        gemini_response = requests.post(url, headers=headers, json=payload)
        gemini_data = gemini_response.json()
        
        # Check for authentication or model execution errors
        if 'error' in gemini_data:
            return {"error": f"Google API Error: {gemini_data['error'].get('message', 'Unknown error')}"}
            
        # Clean AI output to ensure strictly valid JSON parsing
        raw_ai_text = gemini_data['candidates'][0]['content']['parts'][0]['text']
        clean_text = raw_ai_text.replace('```json', '').replace('```', '').strip()
        
        extracted_data = json.loads(clean_text)
        print("AI Extraction successful. Sending data to Node.js backend...")
        
        # --- PREPARE DATA FOR DATABASE ---
        # Append internal processing flags and dummy data representing Evaluator Agent outputs
        extracted_data["jobId"] = "1"
        extracted_data["matchPercentage"] = 85
        extracted_data["aiRecommendation"] = "Highly Recommended"
        extracted_data["justification"] = "Candidate possesses strong skills matching the core requirements based on the extracted profile."
        extracted_data["matchedSkills"] = extracted_data.get("technicalSkills", [])
        extracted_data["missingSkills"] = ["AWS", "GraphQL"]
        
        # Transmit structured data to the Node.js API (Microservice communication)
        node_api_url = "http://localhost:5000/api/candidates/save"
        api_response = requests.post(node_api_url, json=extracted_data)
        
        if api_response.status_code == 201:
            print("Successfully saved candidate to MongoDB!")
            return api_response.json()
        else:
            print(f"Failed to save to database. Status code: {api_response.status_code}")
            return {"error": api_response.text, "data": extracted_data}
            
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    print("--- AI Processing Pipeline Started ---")
    result = process_cv_with_ai("sample_cv.pdf")
    
    if isinstance(result, dict):
        print(json.dumps(result, indent=4))
    else:
        print(result)