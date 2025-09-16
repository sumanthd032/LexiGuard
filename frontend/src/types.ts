export interface Clause {
  clause_text: string;
  risk_level: 'Neutral' | 'Attention' | 'Critical';
  explanation: string;
}

export interface AnalysisResult {
  summary: string;
  clauses: Clause[];
  full_text: string; 
}

export interface ChatMessage {
  role: 'user' | 'model' | 'loading';
  content: string;
}