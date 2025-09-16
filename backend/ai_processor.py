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

def analyze_clauses_from_text(text_content: str, persona: str, language: str) -> str:
    """
    Uses Gemini 2.5 Pro to analyze extracted text, with explanations
    tailored to a specific user persona and translated to a target language.
    """
    pro_model = GenerativeModel("gemini-2.5-pro")
    
    prompt = f"""
    You are a meticulous legal analyst AI. Your task is to dissect the provided document text into individual clauses and evaluate each one for potential risks. Perform your analysis in English first, then translate as the final step.

    *** CONTEXT ***
    Your analysis and all explanations MUST be tailored to the perspective of a "{persona}".
    - For a "Student", focus on deposit returns, guest policies, etc.
    - For a "Small Business", focus on liability, commercial use, etc.
    - For a "Senior Citizen", focus on accessibility, long-term stability, etc.
    - For a "General User", provide balanced, general-purpose advice.

    *** OUTPUT STRUCTURE ***
    Provide a response in a single, clean JSON object with the exact structure defined below:
    {{
      "summary": "A concise summary of the document's purpose, from the perspective of a {persona}.",
      "clauses": [
        {{
          "clause_text": "The original text of the clause...",
          "risk_level": "Neutral | Attention | Critical",
          "explanation": "A simple explanation of this clause, tailored for a {persona}."
        }}
      ]
    }}

    *** FINAL AND MOST IMPORTANT INSTRUCTION ***
    After generating the entire JSON object in English, you MUST translate the text values for the "summary" key and for every "explanation" key into **{language}**.
    The keys themselves ("summary", "clauses", etc.) and the values for "clause_text" and "risk_level" MUST remain in English. Only translate the summary and explanations.
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

def get_chat_response(document_context: str, question: str, chat_history: list = []) -> str:
    """
    Generates a conversational response using the document context and a user's question.
    """
    pro_model = GenerativeModel("gemini-2.5-pro")

    prompt = f"""
    You are a helpful legal assistant named LexiGuard. Your task is to answer a user's question based *only* on the provided legal document context.

    **Rules:**
    1.  Base all your answers strictly on the "Document Context" provided below.
    2.  Do not invent information or provide general legal advice that is not in the document.
    3.  If the document does not contain the answer, you must state clearly: "The document does not provide specific information about this."
    4.  Keep your answers concise and easy to understand.

    ---
    **Document Context:**
    {document_context}
    ---

    **User's Question:**
    "{question}"
    """

    response = pro_model.generate_content(prompt)
    
    return response.text