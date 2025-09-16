// frontend/src/pages/Dashboard.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import UploadZone from '../components/UploadZone';
import AnalysisPanel from '../components/AnalysisPanel';
import HistoryPanel from '../components/HistoryPanel'; 
import type { AnalysisResult, ChatMessage } from '../types';
import { useAuth } from '../AuthContext';
import { ArrowUpOnSquareIcon, ClockIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [persona, setPersona] = useState<string>('General User');
    const [language, setLanguage] = useState<string>('English');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const { user } = useAuth();

    // ... (All handler functions: handleFileSelect, handleAnalyze, handleSendMessage remain exactly the same)
    const handleFileSelect = (file: File | null) => {
        setUploadedFile(file);
        setAnalysis(null);
        setError(null);
        setChatHistory([]);
    };

    const handleAnalyze = async () => { /* ... same as before ... */ };
    const handleSendMessage = async (message: string) => { /* ... same as before ... */ };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-gray to-gray-200">
            <Header />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
                
                {/* --- UPGRADED LEFT PANEL WITH TABS --- */}
                <div className="flex flex-col">
                    <div className="mb-4">
                        <div className="border-b border-gray-300">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    className={`${
                                        activeTab === 'upload'
                                        ? 'border-brand-green text-brand-blue'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" /> Upload Document
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`${
                                        activeTab === 'history'
                                        ? 'border-brand-green text-brand-blue'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    <ClockIcon className="h-5 w-5 mr-2" /> History
                                </button>
                            </nav>
                        </div>
                    </div>
                    <div className="flex-grow">
                        {activeTab === 'upload' ? (
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
                        ) : (
                            <HistoryPanel />
                        )}
                    </div>
                </div>

                {/* --- RIGHT PANEL --- */}
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
};

export default Dashboard;