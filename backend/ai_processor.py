import os
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def initialize_vertexai():
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    if not project_id:
        raise ValueError("GOOGLE_CLOUD_PROJECT environment variable not set.")
    
    vertexai.init(project=project_id, location="us-central1")

def analyze_document_with_gemini(file_content: bytes, mime_type: str):
    initialize_vertexai()
    
    document_part = Part.from_data(data=file_content, mime_type=mime_type)

    prompt = """
    You are an expert legal document assistant. Your task is to analyze the provided document.
    Perform the following actions:
    1.  Extract every piece of visible text from the document. Maintain original formatting, like line breaks, as much as possible.
    2.  Based on the extracted text, write a concise, one-paragraph summary of the document's primary purpose.

    Provide the output in a single, clean JSON object. Do not include any text or formatting outside of the JSON object.
    The JSON object must have these exact keys:
    {
      "extracted_text": "...",
      "summary": "..."
    }
    """

    model = GenerativeModel("gemini-1.0-pro-vision-001")

    generation_config = {
        "max_output_tokens": 8192,
        "temperature": 0.1,
        "top_p": 0.95,
    }
    
    safety_settings = {
        generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    }

    try:
        response = model.generate_content(
            [document_part, prompt],
            generation_config=generation_config,
            safety_settings=safety_settings,
            stream=False,
        )
        
        response_text = response.text.strip().replace("```json", "").replace("```", "")
        
        return response_text

    except Exception as e:
        print(f"An error occurred while calling the Gemini API: {e}")
        return {
            "error": "Failed to analyze document with AI.",
            "details": str(e)
        }
