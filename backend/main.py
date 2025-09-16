from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from ai_processor import extract_text_from_document, analyze_clauses_from_text

app = FastAPI(
    title="LexiGuard API",
    description="API for demystifying legal documents using Google's Generative AI.",
    version="0.1.0"
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the LexiGuard API!"}

@app.post("/api/analyze")
async def analyze_document_endpoint(file: UploadFile = File(...)):
    """
    Orchestrates the two-step AI analysis pipeline.
    1. Extracts text using Gemini Vision.
    2. Analyzes clauses using Gemini Pro.
    """
    try:
        file_content = await file.read()
        mime_type = file.content_type

        print("Step 1: Extracting text from document...")
        extracted_text = extract_text_from_document(file_content, mime_type)
        if not extracted_text:
            raise HTTPException(status_code=500, detail="AI failed to extract text from the document.")

        print("Step 2: Analyzing clauses from extracted text...")
        analysis_result_str = analyze_clauses_from_text(extracted_text)
        
        try:
            analysis_result_json = json.loads(analysis_result_str)
            return analysis_result_json
        except json.JSONDecodeError:
            print("Error: AI returned an invalid JSON format.")
            print("Raw AI output:", analysis_result_str)
            raise HTTPException(status_code=500, detail="AI returned an invalid format.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))