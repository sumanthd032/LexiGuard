import React, { useState } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import AnalysisPanel from './components/AnalysisPanel';
import type { AnalysisResult } from './types'; 

function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // Update the state to use our new, structured type
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    setUploadedFile(file);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

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

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... JSX remains exactly the same as Phase 2 ...
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
            />
          </div>
          <div className="h-full">
            <AnalysisPanel 
              analysis={analysis}
              isLoading={isLoading}
              error={error && !analysis ? "Failed to generate analysis." : null}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
