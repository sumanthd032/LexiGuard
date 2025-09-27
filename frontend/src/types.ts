/**
 * @file types.ts
 * @description This file contains the central TypeScript type definitions and interfaces
 * used across the LexiGuard application to ensure data consistency.
 */

/**
 * @interface Clause
 * @description Represents a single, parsed clause from a legal document,
 * complete with its risk analysis and explanation.
 */
export interface Clause {
  // The original, verbatim text of the clause from the document.
  clause_text: string;
  // The AI-assigned risk level for the clause.
  risk_level: 'Neutral' | 'Attention' | 'Critical';
  // A plain-language explanation of the clause's meaning and implications.
  explanation: string;
  // An optional, evidence-based warning from the RAG system for critical clauses.
  rag_warning?: string;
}

/**
 * @interface AnalysisResult
 * @description Represents the complete output of a successful document analysis.
 */
export interface AnalysisResult {
  // A concise, executive summary of the entire document's purpose and key risks.
  summary: string;
  // An array of all the individual clauses found and analyzed in the document.
  clauses: Clause[];
  // The full, extracted text of the entire document for context-aware chat.
  full_text: string; 
  // The original name of the uploaded file.
  file_name: string;
}

/**
 * @interface ChatMessage
 * @description Represents a single message within the chat interface.
 */
export interface ChatMessage {
  // The origin of the message (the user, the AI model, or a temporary loading state).
  role: 'user' | 'model' | 'loading';
  // The text content of the message.
  content: string;
}