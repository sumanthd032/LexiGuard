import React from 'react';
import { LightBulbIcon, DocumentTextIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';

interface AnalysisResult {
  extracted_text: string;
  summary: string;
}

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <svg className="animate-spin h-12 w-12 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-brand-text font-semibold">Gemini is analyzing your document...</p>
    </div>
);

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center h-full">
        <LightBulbIcon className="h-16 w-16 text-brand-green mb-4" />
        <h2 className="text-2xl font-bold text-brand-blue font-display mb-2">Analysis Awaits</h2>
        <p className="text-brand-text max-w-sm">
            Upload your document and click "Analyze Now" to see the magic happen.
        </p>
    </div>
);


const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-danger">Error: {error}</div>;
    if (analysis) {
      return (
        <div className="h-full overflow-y-auto">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-brand-blue font-display flex items-center mb-2">
                    <Bars3BottomLeftIcon className="h-6 w-6 mr-2 text-brand-green" />
                    AI Summary
                </h3>
                <p className="text-brand-text bg-brand-gray p-4 rounded-lg">{analysis.summary}</p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-brand-blue font-display flex items-center mb-2">
                    <DocumentTextIcon className="h-6 w-6 mr-2 text-brand-green" />
                    Extracted Text
                </h3>
                <pre className="text-sm text-gray-600 bg-brand-gray p-4 rounded-lg whitespace-pre-wrap font-sans max-h-96 overflow-y-auto">
                    {analysis.extracted_text}
                </pre>
            </div>
        </div>
      );
    }
    return <InitialState />;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg h-full">
        {renderContent()}
    </div>
  );
};

export default AnalysisPanel;