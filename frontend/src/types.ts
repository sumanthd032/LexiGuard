export interface Clause {
  clause_text: string;
  risk_level: 'Neutral' | 'Attention' | 'Critical';
  explanation: string;
  rag_warning?: string;
}

export interface AnalysisResult {
  summary: string;
  clauses: Clause[];
  full_text: string; 
  file_name: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'loading';
  content: string;
}