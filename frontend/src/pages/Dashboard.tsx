import React, { useState } from 'react';
import Header from '../components/Header';
import UploadZone from '../components/UploadZone';
import AnalysisPanel from '../components/AnalysisPanel';
import type { AnalysisResult, ChatMessage } from '../types';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const apiUrl = import.meta.env.VITE_API_BASE_URL || "https://lexiguard-backend-service-59259575711.asia-south1.run.app";

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    
    // UI State: Determines whether to show the upload zone or the analysis report
    const [view, setView] = useState<'upload' | 'analysis'>('upload');

    // Data & Control State
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
        setAnalysis(null); // Clear previous analysis
        setView('analysis'); // Switch to the analysis view
    
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('persona', persona);
        formData.append('language', language);
    
        try {
          const response = await fetch(`${apiUrl}/api/analyze`, {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Analysis failed. Please try again.');
          }
    
          const result: AnalysisResult = await response.json();
          result.file_name = uploadedFile.name; // Add filename to result
          setAnalysis(result);
    
          // Save analysis if user is logged in
          if (user) {
            const token = await user.getIdToken();
            await fetch(`${apiUrl}/api/analyses`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                file_name: uploadedFile.name,
                analysis_data: result,
                timestamp: new Date().toISOString()
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
          const response = await fetch(`${apiUrl}/api/chat`, {
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
    
    // Function to switch back to the upload view
    const startNewAnalysis = () => {
        setView('upload');
        setAnalysis(null);
        setUploadedFile(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-brand-gray flex flex-col">
            <Header />
            <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    {view === 'upload' ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
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
                        </motion.div>
                    ) : (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="h-full"
                        >
                            <AnalysisPanel 
                                analysis={analysis}
                                isLoading={isLoading}
                                error={error}
                                onNewAnalysis={startNewAnalysis}
                                chatHistory={chatHistory}
                                onSendMessage={handleSendMessage}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Dashboard;