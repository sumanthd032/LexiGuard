from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import json
import firebase_admin
from firebase_admin import credentials, auth, firestore
from pydantic import BaseModel
from ai_processor import extract_text_from_document, analyze_clauses_from_text, get_chat_response


try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    db = None


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

token_auth_scheme = HTTPBearer()

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(token_auth_scheme)):
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {e}")

class ChatRequest(BaseModel):
    document_context: str
    message: str

class SaveAnalysisRequest(BaseModel):
    file_name: str
    analysis_data: dict

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the LexiGuard API!"}

@app.post("/api/analyze")
async def analyze_document_endpoint(file: UploadFile = File(...), persona: str = Form(...), language: str = Form(...)):
    """
    Orchestrates the two-step AI analysis pipeline.
    1. Extracts text using Gemini Vision.
    2. Analyzes clauses using Gemini Pro.
    """
    try:
        file_content = await file.read()
        mime_type = file.content_type

        print(f"Step 1: Extracting text for persona: {persona}, language: {language}...")
        extracted_text = extract_text_from_document(file_content, mime_type)
        if not extracted_text:
            raise HTTPException(status_code=500, detail="AI failed to extract text from the document.")

        print("Step 2: Analyzing clauses with persona and language context...")
        analysis_result_str = analyze_clauses_from_text(extracted_text, persona, language)
        
        try:
            analysis_result_json = json.loads(analysis_result_str)
            analysis_result_json['full_text'] = extracted_text
            return analysis_result_json
        except json.JSONDecodeError:
            print("Error: AI returned an invalid JSON format.")
            print("Raw AI output:", analysis_result_str)
            raise HTTPException(status_code=500, detail="AI returned an invalid format.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/chat")
async def chat_with_document(request: ChatRequest):
    """
    Handles conversational Q&A about the document.
    """
    try:
        print(f"Received chat message: {request.message}")
        response_text = get_chat_response(
            document_context=request.document_context,
            question=request.message
        )
        return {"reply": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/analyses")
async def save_analysis(
    request: SaveAnalysisRequest,
    user: dict = Depends(get_current_user)
):
    """Saves a new analysis to the user's document in Firestore."""
    if not db:
        raise HTTPException(status_code=500, detail="Firestore client not initialized.")
    
    uid = user['uid']
    try:
        user_doc_ref = db.collection('analyses').document(uid)
        user_doc_ref.set({
            'history': firestore.ArrayUnion([request.dict()])
        }, merge=True)
        return {"status": "success", "message": "Analysis saved."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save analysis: {e}")

@app.get("/api/analyses")
async def get_analyses(user: dict = Depends(get_current_user)):
    """Retrieves all past analyses for the authenticated user."""
    if not db:
        raise HTTPException(status_code=500, detail="Firestore client not initialized.")
        
    uid = user['uid']
    try:
        user_doc_ref = db.collection('analyses').document(uid)
        doc = user_doc_ref.get()
        if doc.exists:
            return doc.to_dict().get('history', [])
        else:
            return [] 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not retrieve analyses: {e}")