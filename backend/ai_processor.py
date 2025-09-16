import os
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models
from dotenv import load_dotenv
import json

load_dotenv()

project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
if not project_id:
    raise ValueError("GOOGLE_CLOUD_PROJECT environment variable not set.")
vertexai.init(project=project_id, location="us-central1")

def extract_text_from_document(file_content: bytes, mime_type: str) -> str:
    """Uses Gemini 1.0 Pro Vision to extract text from a document."""
    vision_model = GenerativeModel("gemini-2.5-pro")
    document_part = Part.from_data(data=file_content, mime_type=mime_type)
    
    prompt = "Extract all text from this document. Maintain the original structure and line breaks."
    
    response = vision_model.generate_content(
        [document_part, prompt],
        stream=False
    )
    return response.text

def analyze_clauses_from_text(text_content: str) -> str:
    """
    Uses Gemini 1.0 Pro to analyze extracted text, identify clauses,
    and assign risk scores.
    """
    pro_model = GenerativeModel("gemini-2.5-pro")
    
    prompt = """
    You are a meticulous legal analyst AI. Your task is to dissect the provided document text into individual clauses and evaluate each one for potential risks for the primary user (e.g., the tenant in a lease, the borrower in a loan).

    Analyze the document text and provide a response in a single, clean JSON object. Do not include any text, markdown, or formatting outside of the JSON object.

    The JSON object must have the following structure:
    {
      "summary": "A concise, one-paragraph summary of the document's primary purpose.",
      "clauses": [
        {
          "clause_text": "The original text of the first identified clause...",
          "risk_level": "Neutral",
          "explanation": "A simple, one-sentence explanation of this clause."
        },
        {
          "clause_text": "The clause text about penalties or fees...",
          "risk_level": "Attention",
          "explanation": "This clause outlines a specific obligation or minor penalty you should be aware of."
        },
        {
          "clause_text": "The clause text about automatic renewal or waiving rights...",
          "risk_level": "Critical",
          "explanation": "This is a high-risk clause that could have significant financial or legal consequences."
        }
      ]
    }

    Assign a `risk_level` based on the following criteria:
    - **Neutral**: Standard, informational, or benign clauses. (e.g., definitions, party names, standard legal boilerplate).
    - **Attention**: Clauses that require the user's specific awareness. (e.g., payment schedules, maintenance duties, notice periods, late fees).
    - **Critical**: Clauses that are potentially unfair, unusual, or carry significant hidden risks. (e.g., waiver of rights, automatic renewal, large non-refundable deposits, ambiguous termination terms, clauses that heavily favor the other party).
    """

    generation_config = {
        "max_output_tokens": 8192,
        "temperature": 0.2,
        "top_p": 0.95,
        "response_mime_type": "application/json", 
    }

    response = pro_model.generate_content(
        [text_content, prompt],
        generation_config=generation_config,
        stream=False
    )
    return response.text.strip().replace("```json", "").replace("```", "")