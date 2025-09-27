/**
 * @file Dashboard.tsx
 * @description The main page of the application where users can upload documents
 * for analysis and view the results. This component acts as the primary state
 * container for the core user workflow.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '../components/Header';
import UploadZone from '../components/UploadZone';
import AnalysisPanel from '../components/AnalysisPanel';
import type { AnalysisResult, ChatMessage } from '../types';
import { useAuth } from '../AuthContext';

// The base URL for the backend API, loaded from environment variables.
const apiUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * The Dashboard component orchestrates the main application flow, managing state
 * for file uploads, analysis results, and the chat functionality.
 */
const Dashboard: React.FC = () => {
    const { user } = useAuth();

    // UI State: Determines whether to show the upload zone or the analysis report.
    const [view, setView] = useState<'upload' | 'analysis'>('upload');

    // Data & Control State: Manages the core data flow of the application.
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [persona, setPersona] = useState<string>('General User');
    const [language, setLanguage] = useState<string>('English');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    
    /**
     * Resets the state when a new file is selected or the current one is removed.
     * @param file The new file object, or null if removed.
     */
    const handleFileSelect = (file: File | null) => {
        setUploadedFile(file);
        setAnalysis(null);
        setError(null);
        setChatHistory([]);
    };

    /**
     * Handles the entire analysis process: sends the file to the backend,
     * receives the result, and saves it to the user's history if they are logged in.
     */
    const handleAnalyze = async () => {
        if (!uploadedFile) {
          setError("Please select a file first.");
          return;
        }
    
        // Set loading state and switch to the analysis view.
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setView('analysis');
    
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('persona', persona);
        formData.append('language', language);
    
        try {
          // Make the API call to the analysis endpoint.
          const response = await fetch(`${apiUrl}/api/analyze`, {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Analysis failed. Please try again.');
          }
    
          const result: AnalysisResult = await response.json();
          result.file_name = uploadedFile.name; // Manually add the filename to the result object.
          setAnalysis(result);
    
          // If the user is logged in, save the analysis to their history.
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
    
    /**
     * Sends a user's message to the chat API and updates the chat history.
     * @param message The message content from the user.
     */
    const handleSendMessage = async (message: string) => {
        if (!analysis?.full_text) return;
    
        // Optimistically update the UI with the user's message and a loading indicator.
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
          
          // Replace the loading indicator with the actual response from the model.
          setChatHistory(prev => [...prev.slice(0, -1), modelMessage]);
    
        } catch (err: any) {
          // Replace the loading indicator with an error message if the API call fails.
          const errorMessage: ChatMessage = { role: 'model', content: `Sorry, I encountered an error: ${err.message}` };
          setChatHistory(prev => [...prev.slice(0, -1), errorMessage]);
        }
    };
    
    /**
     * Resets the application state to allow the user to start a new analysis.
     */
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
                {/* AnimatePresence handles the transition between the upload and analysis views. */}
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