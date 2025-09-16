# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    """A simple endpoint to check if the API is running."""
    return {"status": "ok", "message": "Welcome to the LexiGuard API!"}