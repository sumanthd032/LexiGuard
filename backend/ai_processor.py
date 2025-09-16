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
    vision_model = GenerativeModel("gemini-2.5-pro")
    document_part = Part.from_data(data=file_content, mime_type=mime_type)
    prompt = "Extract all text from this document. Maintain the original structure and line breaks."
    response = vision_model.generate_content([document_part, prompt], stream=False)
    return response.text

def analyze_clauses_from_text(text_content: str, persona: str) -> str:
    """
    Uses Gemini 1.0 Pro to analyze extracted text, with explanations
    tailored to a specific user persona.
    """
    pro_model = GenerativeModel("gemini-2.5-pro")
    
    prompt = f"""
    You are a meticulous legal analyst AI. Your task is to dissect the provided document text into individual clauses and evaluate each one for potential risks.

    *** VERY IMPORTANT CONTEXT ***
    Your entire analysis and all explanations MUST be tailored to the perspective of a "{persona}".
    - For a "Student", focus on deposit returns, guest policies, noise complaints, and short-term lease penalties.
    - For a "Small Business", focus on liability, commercial use clauses, insurance requirements, and termination notice periods.
    - For a "Senior Citizen", focus on accessibility, long-term stability, rent control, and clauses related to health or assistance services.
    - For a "General User", provide balanced, general-purpose advice.
    The `explanation` for each clause must directly address the concerns of the "{persona}".

    Analyze the document text and provide a response in a single, clean JSON object. Do not include any text, markdown, or formatting outside of the JSON object.
    The JSON object must have the exact structure as defined below:
    {{
      "summary": "A concise, one-paragraph summary of the document's purpose, written from the perspective of a {persona}.",
      "clauses": [
        {{
          "clause_text": "The original text of the clause...",
          "risk_level": "Neutral | Attention | Critical",
          "explanation": "A simple, one-sentence explanation of this clause, specifically tailored for a {persona}."
        }}
      ]
    }}

    Assign a `risk_level` based on the following criteria:
    - Neutral: Standard, informational clauses.
    - Attention: Clauses requiring specific awareness (e.g., payment schedules, late fees).
    - Critical: Potentially unfair or high-risk clauses (e.g., waiver of rights, automatic renewals).
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