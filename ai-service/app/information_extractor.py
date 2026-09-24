import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from pdf_extractor import extract_text_from_pdf

# Load environment variables from the .env file (Aligns with SRS SEC-2: Security Requirements)
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Configure the Google Gemini AI with the retrieved API key
genai.configure(api_key=api_key)

def process_cv_with_ai(file_path):
    """
    AI Agent 01 (Information Extractor)
    Extracts structured JSON data from raw CV text.
    Aligns with SRS REQ-4.2.
    """
    # 1. Extract raw text from the provided PDF file using the pdf_extractor module
    raw_text = extract_text_from_pdf(file_path)
    
    # Check if text extraction failed
    if "Error" in raw_text:
        return raw_text

    # Return an error if the real API key is not yet configured in the .env file
    if not api_key or api_key == "your_api_key_here":
        return "Error: Please update the .env file with the real Gemini API Key."

    # 2. Define the prompt for the AI to extract specific fields
    prompt = f"""
    You are an expert HR AI Assistant. Extract the following information from the CV text below.
    Return ONLY a valid JSON object without any markdown tags.
    Keys to extract exactly as named: "Candidate Name", "Contact Info", "Education", "Experience", "Technical Skills".
    
    CV Text:
    {raw_text}
    """

    try:
        # 3. Initialize the Gemini 1.5 Flash model and generate the content
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        # 4. Clean the AI response to ensure it is a valid JSON format (remove markdown blocks if any)
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        
        # 5. Parse the cleaned text into a Python dictionary
        extracted_data = json.loads(clean_text)
        return extracted_data
        
    except Exception as e:
        # Return any errors encountered during AI processing or JSON parsing
        return {"error": str(e)}

# Main execution block for testing purposes
if __name__ == "__main__":
    print("--- AI Agent 01 Started ---")
    
    # Run the AI processor on the sample CV
    result = process_cv_with_ai("sample_cv.pdf")
    
    # Print the extracted data in a formatted JSON structure if successful
    if isinstance(result, dict):
        print(json.dumps(result, indent=4))
    else:
        print(result)