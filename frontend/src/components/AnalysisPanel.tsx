import React from 'react';
import type { AnalysisResult, ChatMessage, Clause } from '../types';
import { Disclosure } from '@headlessui/react';
import ChatPanel from './ChatPanel';
import { ChevronUpIcon, CheckCircleIcon, ExclamationTriangleIcon, ShieldExclamationIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/solid';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const riskLevelStyles = {
  Neutral: {
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50',
    buttonBg: 'bg-gray-100',
  },
  Attention: {
    icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-50',
    buttonBg: 'bg-yellow-100',
  },
  Critical: {
    icon: <ShieldExclamationIcon className="h-5 w-5 text-red-500" />,
    borderColor: 'border-red-500',
    bgColor: 'bg-red-50',
    buttonBg: 'bg-red-100',
  },
};

const ClauseItem: React.FC<{ clause: Clause }> = ({ clause }) => {
  const styles = riskLevelStyles[clause.risk_level];

  return (
    <div className={`border-l-4 ${styles.borderColor} ${styles.bgColor} rounded-r-md mb-3`}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className={`flex w-full justify-between rounded-t-md px-4 py-3 text-left text-sm font-medium text-brand-blue ${open ? '' : 'rounded-b-md'} ${styles.buttonBg} hover:bg-opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-brand-blue focus-visible:ring-opacity-75`}>
              <div className="flex items-center">
                {styles.icon}
                <span className="ml-2">{clause.risk_level}</span>
              </div>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-brand-blue`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-3 pb-4 text-sm text-brand-text">
              <p className="font-semibold mb-2">Plain English Explanation:</p>
              <p className="mb-4">{clause.explanation}</p>
              <p className="font-semibold mb-2 text-gray-500">Original Clause Text:</p>
              <blockquote className="text-gray-600 border-l-2 border-gray-300 pl-3 italic">
                {clause.clause_text}
              </blockquote>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <svg className="animate-spin h-12 w-12 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-brand-text font-semibold">Gemini is performing a deep analysis...</p>
    </div>
);

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center h-full">
         <ShieldExclamationIcon className="h-16 w-16 text-brand-green mb-4" />
        <h2 className="text-2xl font-bold text-brand-blue font-display mb-2">Detailed Risk Analysis</h2>
        <p className="text-brand-text max-w-sm">
            Upload your document to generate a clause-by-clause breakdown with risk ratings and simple explanations.
        </p>
    </div>
);

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading, error, chatHistory, onSendMessage }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-danger p-4 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
    if (analysis && analysis.clauses) {
      return (
        <div className="h-full flex flex-col">
          <div className="mb-4 p-4 bg-brand-gray rounded-lg">
              {/* ... Summary display ... */}
          </div>
          <div className="flex-grow overflow-y-auto pr-2">
              {analysis.clauses.map((clause, index) => (
                  <ClauseItem key={index} clause={clause} />
              ))}
          </div>
          {/* --- RENDER THE CHAT PANEL HERE --- */}
          <ChatPanel 
            chatHistory={chatHistory}
            onSendMessage={onSendMessage}
          />
        </div>
      );
    }
    return <InitialState />;
  };

  return <div className="bg-white p-6 rounded-lg shadow-lg h-full">{renderContent()}</div>;
};

export default AnalysisPanel;