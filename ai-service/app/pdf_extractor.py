import pdfplumber
import os

def extract_text_from_pdf(file_path):
    """
    Extracts raw text from a PDF document.
    Aligns with SRS REQ-4.1: Text Extraction.
    """
    text = ""
    try:
        # Open the PDF using pdfplumber as specified in SRS 5.3
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        return text.strip()
    except Exception as e:
        return f"Error reading PDF: {e}"

# Testing the extraction function
if __name__ == "__main__":
    # Ensure you have a file named 'sample_cv.pdf' in the same folder
    sample_pdf = "sample_cv.pdf"
    
    if os.path.exists(sample_pdf):
        print(f"--- Extracting text from {sample_pdf} ---\n")
        raw_text = extract_text_from_pdf(sample_pdf)
        print(raw_text)
        print("\n--- Extraction Complete ---")
    else:
        print(f"Error: '{sample_pdf}' not found.")
        print("Please place a sample PDF file named 'sample_cv.pdf' in the 'app' folder to test.")