import os
import json

import firebase_admin
from firebase_admin import credentials, auth, firestore
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from ai_processor import (
    extract_text_from_document,
    analyze_clauses_from_text,
    get_chat_response,
)


# Firebase Initialization
# Let's connect to Firebase.
SECRET_PATH = "/etc/secrets/firebase-service-account/latest"
db = None

try:
    # Check if we're running in a secure cloud environment.
    if os.path.exists(SECRET_PATH):
        cred = credentials.Certificate(SECRET_PATH)
    else:
        # If not, use the local key file.
        cred = credentials.Certificate("serviceAccountKey.json")

    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    # If this fails, the app is pretty much useless, so we print a critical error.
    print(f"CRITICAL: Error initializing Firebase Admin SDK: {e}")


# FastAPI App Setup
app = FastAPI(title="LexiGuard API")

# Specify exact origins for security in production.
origins = [
    "http://localhost:5173", 
    "http://localhost:3000", 
    "https://lexi-guard.vercel.app", # deployed Vercel frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication
token_auth_scheme = HTTPBearer()


async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(token_auth_scheme),
):
    """Verifies the Firebase ID token from the request header to protect endpoints."""
    try:
        # Ask Firebase to verify the token.
        decoded_token = auth.verify_id_token(token.credentials, check_revoked=False)
        return decoded_token
    except Exception as e:
        # If the token is bad, we kick them out with a 401 Unauthorized error.
        print(f"Firebase Auth Error: {e}")
        raise HTTPException(
            status_code=401, detail=f"Invalid authentication credentials: {e}"
        )


# Data Models : Pydantic models help FastAPI understand the structure of incoming JSON data.

class ChatRequest(BaseModel):
    """Defines what a user needs to send for the chat feature."""
    document_context: str
    message: str


class SaveAnalysisRequest(BaseModel):
    """Defines the structure for saving an analysis report."""
    file_name: str
    analysis_data: dict
    timestamp: str


# API Endpoints


@app.get("/")
def read_root():
    """A simple 'hello world' endpoint to check if the API is running."""
    return {"status": "ok", "message": "LexiGuard API is running."}


@app.post("/api/analyze")
async def analyze_document_endpoint(
    file: UploadFile = File(...), persona: str = Form(...), language: str = Form(...)
):
    """The main endpoint. It takes a document, extracts text, and runs our AI analysis."""
    try:
        # Grab the file content.
        file_content = await file.read()

        # Use gemini model to get the text from the document.
        extracted_text = extract_text_from_document(file_content, file.content_type)
        if not extracted_text:
            raise HTTPException(
                status_code=500, detail="AI failed to extract text from the document."
            )

        # Send the text to our analysis model for the heavy lifting.
        analysis_result_str = analyze_clauses_from_text(
            extracted_text, persona, language
        )

        # Convert the AI's string response into a proper JSON object.
        analysis_result_json = json.loads(analysis_result_str)

        # We also add the full extracted text to the response, so the frontend can use it.
        analysis_result_json["full_text"] = extracted_text

        return analysis_result_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat_with_document(request: ChatRequest):
    """Handles the 'What If?' chat feature, answering questions about a document."""
    try:
        # The AI needs the document text and the user's question to answer.
        response_text = get_chat_response(request.document_context, request.message)
        return {"reply": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyses")
async def save_analysis(
    request: SaveAnalysisRequest, user: dict = Depends(get_current_user)
):
    """Saves a user's analysis report to their Firestore history. Requires login."""
    if not db:
        raise HTTPException(status_code=500, detail="Database is not connected.")

    uid = user["uid"]
    try:
        # Find the document for this user (or create it if it's their first time).
        user_doc_ref = db.collection("analyses").document(uid)

        # Add the new analysis to their 'history' array.
        user_doc_ref.set({"history": firestore.ArrayUnion([request.dict()])}, merge=True)

        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save the analysis: {e}")


@app.get("/api/analyses")
async def get_analyses(user: dict = Depends(get_current_user)):
    """Retrieves a logged-in user's entire analysis history."""
    if not db:
        raise HTTPException(status_code=500, detail="Database is not connected.")

    uid = user["uid"]
    try:
        # Get the user's document from the 'analyses' collection.
        doc = db.collection("analyses").document(uid).get()

        # If the user exists and has a history, return it. Otherwise, return an empty list.
        return doc.to_dict().get("history", []) if doc.exists else []
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Could not retrieve analyses: {e}"
        )