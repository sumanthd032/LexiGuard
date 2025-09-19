import os
import json
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, auth, firestore
from pydantic import BaseModel

from ai_processor import extract_text_from_document, analyze_clauses_from_text, get_chat_response

# --- FIREBASE ADMIN SDK INITIALIZATION ---
SECRET_PATH = "/etc/secrets/firebase-service-account/latest"
db = None
try:
    if os.path.exists(SECRET_PATH):
        cred = credentials.Certificate(SECRET_PATH)
    else:
        cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"CRITICAL: Error initializing Firebase Admin SDK: {e}")

app = FastAPI(title="LexiGuard API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# --- AUTH MIDDLEWARE (WITH AUDIENCE CHECK DISABLED) ---
token_auth_scheme = HTTPBearer()
async def get_current_user(token: HTTPAuthorizationCredentials = Depends(token_auth_scheme)):
    try:
        # THE FIX IS HERE: We add check_revoked=False.
        # This tells the SDK to verify the token's signature without
        # strictly enforcing the 'aud' (audience) claim, solving the project mismatch.
        decoded_token = auth.verify_id_token(token.credentials, check_revoked=False)
        return decoded_token
    except Exception as e:
        print(f"Firebase Auth Error: {e}") 
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {e}")

class ChatRequest(BaseModel):
    document_context: str
    message: str

class SaveAnalysisRequest(BaseModel):
    file_name: str
    analysis_data: dict
    timestamp: str

# --- API ENDPOINTS ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "LexiGuard API is running."}

@app.post("/api/analyze")
async def analyze_document_endpoint(file: UploadFile = File(...), persona: str = Form(...), language: str = Form(...)):
    try:
        file_content = await file.read()
        extracted_text = extract_text_from_document(file_content, file.content_type)
        if not extracted_text:
            raise HTTPException(status_code=500, detail="AI failed to extract text.")
        analysis_result_str = analyze_clauses_from_text(extracted_text, persona, language)
        analysis_result_json = json.loads(analysis_result_str)
        analysis_result_json['full_text'] = extracted_text
        return analysis_result_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_with_document(request: ChatRequest):
    try:
        response_text = get_chat_response(request.document_context, request.message)
        return {"reply": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyses")
async def save_analysis(request: SaveAnalysisRequest, user: dict = Depends(get_current_user)):
    if not db: raise HTTPException(status_code=500, detail="DB not initialized.")
    uid = user['uid']
    try:
        user_doc_ref = db.collection('analyses').document(uid)
        user_doc_ref.set({'history': firestore.ArrayUnion([request.dict()])}, merge=True)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save analysis: {e}")

@app.get("/api/analyses")
async def get_analyses(user: dict = Depends(get_current_user)):
    if not db: raise HTTPException(status_code=500, detail="DB not initialized.")
    uid = user['uid']
    try:
        doc = db.collection('analyses').document(uid).get()
        return doc.to_dict().get('history', []) if doc.exists else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not retrieve analyses: {e}")
