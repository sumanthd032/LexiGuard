from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from ai_processor import analyze_document_with_gemini

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
    Accepts a document, sends it to the Gemini API for analysis,
    and returns the extracted text and summary.
    """
    try:
        file_content = await file.read()
        mime_type = file.content_type

        analysis_result_str = analyze_document_with_gemini(file_content, mime_type)
        
        try:
            analysis_result_json = json.loads(analysis_result_str)
            return analysis_result_json
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="AI returned an invalid format.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))