import React, { useState } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import AnalysisPanel from './components/AnalysisPanel';
import type { AnalysisResult, ChatMessage } from './types';
import { useAuth } from './AuthContext';

function App() {
  const { user } = useAuth(); 
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<string>('General User');
  const [language, setLanguage] = useState<string>('English');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handleFileSelect = (file: File | null) => {
    setUploadedFile(file);
    setAnalysis(null);
    setError(null);
    setChatHistory([]);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setChatHistory([]);

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('persona', persona);
    formData.append('language', language);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed. Please try again.');
      }

      const result: AnalysisResult = await response.json();
      setAnalysis(result);

       if (user) {
        const token = await user.getIdToken();
        await fetch("http://127.0.0.1:8000/api/analyses", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            file_name: uploadedFile.name,
            analysis_data: result
          })
        });
      }

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!analysis?.full_text) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    const loadingMessage: ChatMessage = { role: 'loading', content: '...' };

    setChatHistory(prev => [...prev, userMessage, loadingMessage]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_context: analysis.full_text,
          message: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Chat API failed.');
      }

      const result = await response.json();
      const modelMessage: ChatMessage = { role: 'model', content: result.reply };
      
      setChatHistory(prev => [...prev.slice(0, -1), modelMessage]);

    } catch (err: any) {
      const errorMessage: ChatMessage = { role: 'model', content: `Sorry, I encountered an error: ${err.message}` };
      setChatHistory(prev => [...prev.slice(0, -1), errorMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          <div className="h-full">
            <UploadZone 
              uploadedFile={uploadedFile}
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              error={error}
              persona={persona}
              onPersonaChange={setPersona}
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>
          <div className="h-full">
            <AnalysisPanel 
              analysis={analysis}
              isLoading={isLoading}
              error={error && !analysis ? "Failed to generate analysis." : null}
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;