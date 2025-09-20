# LexiGuard - Your Personal Contract Guardian 

Live Demo: https://lexi-guard.vercel.app/

LexiGuard is an intelligent, AI-powered web application designed to demystify complex legal documents. It transforms impenetrable legal jargon into clear, actionable advice, empowering users to understand their contracts and make informed decisions with confidence.

---

## The Problem
Legal documents like rental agreements, loan contracts, and terms of service are filled with complex language that is incomprehensible to the average person. This information asymmetry creates significant risks, where individuals may unknowingly agree to unfavorable terms, exposing themselves to financial and legal liabilities. LexiGuard bridges this gap, making essential legal information accessible to everyone.

---

## Key Features
- **Multimodal Document Analysis**: Upload documents in various formats (PDF, DOCX, PNG, JPG). LexiGuard's AI extracts and understands the content, regardless of the format.
- **AI-Powered Risk Heatmap**: Automatically segments the document into individual clauses and assigns a clear risk level: <font color="green">Neutral</font>, <font color="orange">Attention</font>, or <font color="red">Critical</font>.
- **Legal Wellness Score**: A gamified score (out of 100) provides an at-a-glance summary of the document's overall risk profile, adding a compelling visual element.
- **Persona-Tailored Explanations**: Get advice tailored to your specific context. The AI adjusts its explanations whether you're a Student, Small Business Owner, or Senior Citizen.
- **Interactive "What If?" AI Assistant**: An integrated chat panel allows users to ask specific questions about the contract, using the document's content as its source of truth.
- **Evidence-Based Warnings (RAG)**: For critical clauses, LexiGuard cross-references a knowledge base of consumer protection laws to provide evidence-based warnings.
- **Multilingual & Accessible**: Analysis in multiple languages and text-to-speech support.
- **Secure User Accounts**: Save analysis history and revisit documents securely with Firebase Authentication.

---

## Tech Stack
| Category   | Technology |
|------------|------------|
| Frontend   | React (Vite), TypeScript, Tailwind CSS, Framer Motion |
| Backend    | FastAPI (Python), Uvicorn |
| AI Models  | Google Gemini Pro, Gemini Pro Vision (via Vertex AI) |
| RAG        | Google Vertex AI Search |
| Cloud      | Google Cloud Run, Firebase Hosting, Firestore, Secret Manager |

---

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Google Cloud SDK (`gcloud`) installed and authenticated (`gcloud auth login`)
- Firebase CLI (`npm install -g firebase-tools`) installed and authenticated (`firebase login`)
- A Google Cloud Project with Vertex AI, Firestore, and Secret Manager APIs enabled
- A Firebase project linked to your Google Cloud project

---

### Step 1: Clone and Set Up Project
```bash
git clone https://github.com/sumanthd032/lexi-guard.git
cd lexi-guard

# Authorize the SDK
gcloud auth application-default login
```

### Step 2: Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Set Up Credentials
- Go to your Firebase project settings → "Service accounts" → Generate new private key (JSON).  
- Rename this file to `serviceAccountKey.json` and place it in the backend directory.

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```
GOOGLE_CLOUD_PROJECT="your-gcp-project-id"
DATASTORE_ID="your-datastore-id"
```

#### Run the Backend Server
```bash
uvicorn main:app --reload
```
The backend will now run at: http://127.0.0.1:8000

---

### Step 3: Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

#### Configure Firebase
- In your Firebase project settings, add a new Web App.  
- Copy the `firebaseConfig` object provided.  
- Create a file at `frontend/src/firebase.ts` and paste the configuration.

#### Configure Environment Variables
Create `.env.local` in the `frontend` directory:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

#### Run the Frontend Server
```bash
npm run dev
```

---

### Step 4: Access the Application
Visit: [http://localhost:5173](http://localhost:5173)

You can now use the full application on your local machine.
