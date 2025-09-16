import React from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';

const AnalysisPanel: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg h-full flex flex-col items-center justify-center text-center">
      <LightBulbIcon className="h-16 w-16 text-brand-green mb-4" />
      <h2 className="text-2xl font-bold text-brand-blue font-display mb-2">Analysis Awaits</h2>
      <p className="text-brand-text max-w-sm">
        Upload your legal document to the left, and our AI-powered analysis will appear here. We'll highlight key clauses, potential risks, and provide plain-language summaries.
      </p>
    </div>
  );
};

export default AnalysisPanel;