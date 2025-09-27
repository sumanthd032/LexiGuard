import os
import json

import vertexai
from dotenv import load_dotenv
from vertexai.generative_models import GenerativeModel, Part
from google.cloud import discoveryengine_v1 as discoveryengine

# Project Initialization 

# Load environment variables from a .env file for local development.
load_dotenv()

# Get project-specific configurations from environment variables.
project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
datastore_id = os.getenv("DATASTORE_ID")

# Initialize the Vertex AI SDK for Python.
vertexai.init(project=project_id, location="us-central1")


def extract_text_from_document(file_content: bytes, mime_type: str) -> str:
    """
    Extracts text from a document image or PDF using a multimodal model.

    Args:
        file_content: The raw bytes of the file.
        mime_type: The MIME type of the file (e.g., 'application/pdf', 'image/png').

    Returns:
        The extracted text as a single string.
    """
    # Initialize the Gemini Flash model, which is optimized for speed and multimodal tasks.
    vision_model = GenerativeModel("gemini-2.5-flash")

    # Prepare the document content as a 'Part' for the model's input.
    document_part = Part.from_data(data=file_content, mime_type=mime_type)
    prompt = "Extract all text from this document. Maintain the original structure and line breaks."

    # Send the document and prompt to the model.
    response = vision_model.generate_content([document_part, prompt], stream=False)

    return response.text


def analyze_clauses_from_text(text_content: str, persona: str, language: str) -> str:
    """
    Uses Gemini Pro to analyze text, tailor explanations to a persona,
    and translate the results into a target language.

    Args:
        text_content: The full text extracted from the document.
        persona: The user profile to tailor explanations for (e.g., "Student").
        language: The target language for translation (e.g., "Spanish").

    Returns:
        A JSON string containing the structured analysis, with some fields translated.
    """
    pro_model = GenerativeModel("gemini-2.5-pro")

    # This detailed prompt instructs the model on how to behave, what context to use,
    # the exact JSON structure to output, and the final translation step.
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

    # Configure the model to ensure it returns a JSON object and has enough token space.
    generation_config = {
        "max_output_tokens": 8192,
        "temperature": 0.2,
        "top_p": 0.95,
        "response_mime_type": "application/json",
    }

    # Generate the analysis from the model.
    initial_response = pro_model.generate_content(
        [text_content, prompt], generation_config=generation_config, stream=False
    )

    try:
        # Attempt to parse the model's response text as JSON.
        analysis_data = json.loads(initial_response.text)

        # Iterate through clauses to find any marked as "Critical".
        for clause in analysis_data.get("clauses", []):
            if clause.get("risk_level") == "Critical":
                print(
                    f"Found critical clause, running RAG check: {clause['clause_text'][:50]}..."
                )
                # For critical clauses, perform a RAG search for additional context.
                rag_warning = get_rag_warning_for_clause(clause["clause_text"])
                if rag_warning:
                    # If relevant info is found, add it to the clause object.
                    clause["rag_warning"] = rag_warning

        # Return the final, possibly augmented, analysis as a JSON string.
        return json.dumps(analysis_data)

    except (json.JSONDecodeError, Exception) as e:
        # If JSON parsing or the RAG check fails, return the raw text from the model.
        print(f"Error processing AI response or RAG: {e}")
        return initial_response.text


def get_chat_response(
    document_context: str, question: str, chat_history: list = []
) -> str:
    """
    Generates a conversational response using the document context and a user's question.

    Args:
        document_context: The full text of the document to be used as context.
        question: The user's question about the document.
        chat_history: (Optional) A list of previous conversation turns.

    Returns:
        A helpful, context-aware string response.
    """
    pro_model = GenerativeModel("gemini-2.5-pro")

    # The prompt strictly instructs the model to only use the provided document context
    # to avoid making up answers or giving general advice.
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


def get_rag_warning_for_clause(clause_text: str) -> str | None:
    """
    Searches a knowledge base (Vertex AI Search) for information related to a clause.
    This is a Retrieval-Augmented Generation (RAG) step.

    Args:
        clause_text: The specific text of the clause to research.

    Returns:
        A formatted warning string with findings, or None if no relevant results are found.
    """
    # If the datastore ID isn't configured, skip the search.
    if not datastore_id:
        print("Warning: DATASTORE_ID not set. Skipping RAG check.")
        return None

    client = discoveryengine.SearchServiceClient()
    serving_config = client.serving_config_path(
        project=project_id,
        location="global",
        data_store=datastore_id,
        serving_config="default_config",
    )

    # Prepare the search request for the Discovery Engine.
    request = discoveryengine.SearchRequest(
        serving_config=serving_config,
        query=f"potential issues or regulations related to the following contract clause: {clause_text}",
        page_size=1,  # We only need the top result for a concise warning.
    )

    try:
        # Execute the search.
        response = client.search(request)
        if response.results:
            # If results are found, extract key details from the top result.
            top_result = response.results[0].document
            source_title = top_result.derived_struct_data["title"]
            snippet = top_result.derived_struct_data["snippets"][0]["snippet"]

            # Format a user-friendly warning message with the source and a snippet.
            warning = f"**Evidence Found in '{source_title}':** This clause may be related to regulations on '{snippet}...'. You should review this carefully."
            return warning
        return None  # Return None if the search yielded no results.
    except Exception as e:
        print(f"Error during RAG search: {e}")
        return None