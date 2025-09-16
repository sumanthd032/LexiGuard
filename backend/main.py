from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil

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

# NEW ENDPOINT FOR PHASE 1
@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}, Content-Type: {file.content_type}")
    
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "File received successfully. Ready for analysis."
    }