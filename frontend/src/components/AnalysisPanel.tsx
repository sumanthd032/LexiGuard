// frontend/src/components/AnalysisPanel.tsx
import React from 'react';
import type { AnalysisResult, Clause, ChatMessage } from '../types';
import { Disclosure } from '@headlessui/react';
import { 
  ChevronUpIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ShieldExclamationIcon, 
  Bars3BottomLeftIcon,
  InformationCircleIcon, 
  ShieldCheckIcon,
  CpuChipIcon
} from '@heroicons/react/24/solid'; // Added missing comma
import ChatPanel from './ChatPanel';
import AudioPlayer from './AudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-l-4 ${styles.borderColor} ${styles.bgColor} rounded-r-md mb-3`}
    >
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
              {clause.rag_warning && (
                <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: clause.rag_warning.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                  </div>
                </div>
              )}
              <p className="font-semibold mb-2">Plain Language Explanation:</p>
              <p className="mb-4">{clause.explanation}</p>
              <p className="font-semibold mb-2 text-gray-500">Original Clause Text:</p>
              <blockquote className="text-gray-600 border-l-2 border-gray-300 pl-3 italic">
                {clause.clause_text}
              </blockquote>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </motion.div>
  );
};

const AnalysisInProgress: React.FC = () => {
  const steps = [
    "Parsing document structure...",
    "Identifying key clauses and provisions...",
    "Assessing risks with Gemini's advanced logic...",
    "Generating plain-language explanations...",
    "Finalizing your personalized report...",
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 5500); // Increased duration for each step

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="mb-6">
          <svg className="animate-spin h-12 w-12 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
      </div>
      <h2 className="text-2xl font-bold text-brand-blue font-display mb-4">Gemini is on the case!</h2>
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
            <motion.p 
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-brand-text font-semibold"
            >
                {steps[currentStep]}
            </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center h-full">
         <div className="p-6 bg-gradient-to-br from-brand-green to-teal-400 rounded-full mb-6 shadow-lg">
            <ShieldCheckIcon className="h-12 w-12 text-white" />
         </div>
        <h2 className="text-2xl font-bold text-brand-blue font-display mb-2">Your Analysis Appears Here</h2>
        <p className="text-brand-text max-w-sm">
            Once you upload a document, this panel will come alive with AI-powered insights, risk analysis, and interactive tools.
        </p>
    </div>
);

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading, error, chatHistory, onSendMessage }) => {
  const renderContent = () => {
    if (isLoading) return <AnalysisInProgress />;
    if (error) return <div className="text-danger p-4 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
    if (analysis && analysis.clauses) {
      const textForSpeech = `
        Summary: ${analysis.summary}. 
        Now, for the clause analysis. 
        ${analysis.clauses.map((c, i) => `Clause ${i + 1}. Risk level: ${c.risk_level}. Explanation: ${c.explanation}.`).join(' ')}
      `;

      return (
        <div className="h-full flex flex-col">
          <div className="mb-4 p-4 bg-brand-gray/80 rounded-lg">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-brand-blue font-display flex items-center mb-2">
                  <Bars3BottomLeftIcon className="h-6 w-6 mr-2 text-brand-green" />
                  AI Summary
              </h3>
              <AudioPlayer textToRead={textForSpeech} />
            </div>
            <p className="text-sm text-brand-text">{analysis.summary}</p>
          </div>
          <div className="flex-grow overflow-y-auto pr-2">
              {analysis.clauses.map((clause, index) => (
                  <ClauseItem key={index} clause={clause} />
              ))}
          </div>
          <ChatPanel 
            chatHistory={chatHistory}
            onSendMessage={onSendMessage}
          />
        </div>
      );
    }
    return <InitialState />;
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-lg shadow-lg h-full">
        <AnimatePresence mode="wait">
            <motion.div
                key={analysis ? 'analysis' : 'initial'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
    </div>
  );
};

export default AnalysisPanel;