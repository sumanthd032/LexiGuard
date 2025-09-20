import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { AnalysisResult, Clause, ChatMessage } from '../types';
import { Disclosure } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUpIcon, CheckCircleIcon, ExclamationTriangleIcon, ShieldExclamationIcon, 
  InformationCircleIcon, DocumentCheckIcon, MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon
} from '@heroicons/react/24/solid';
import AudioPlayer from './AudioPlayer';

interface AnalysisPanelProps {
  analysis: (AnalysisResult & { file_name?: string }) | null;
  isLoading: boolean;
  error: string | null;
  onNewAnalysis: () => void;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
}

// Visual Gauge for the Wellness Score
const RiskScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    let color = 'text-green-500';
    let ringColor = 'ring-green-500';
    if (score < 50) {
        color = 'text-red-500';
        ringColor = 'ring-red-500';
    } else if (score < 80) {
        color = 'text-yellow-500';
        ringColor = 'ring-yellow-500';
    }

    return (
        <div className="text-center flex flex-col items-center justify-center">
             <p className="text-sm font-medium text-gray-500 mb-2">Legal Wellness Score</p>
            <div className={`relative w-32 h-32 flex items-center justify-center rounded-full bg-gray-50 ring-4 ${ringColor} ring-opacity-50 shadow-inner`}>
                <p className={`text-5xl font-bold font-display ${color}`}>{score}</p>
            </div>
        </div>
    );
}

// Redesigned Clause Item for better readability
const ClauseItem: React.FC<{ clause: Clause }> = ({ clause }) => {
  const riskLevelStyles = {
    Neutral: { icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />, borderColor: 'border-green-500' },
    Attention: { icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />, borderColor: 'border-yellow-500' },
    Critical: { icon: <ShieldExclamationIcon className="h-5 w-5 text-red-500" />, borderColor: 'border-red-500' },
  };
  const styles = riskLevelStyles[clause.risk_level];

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm mb-3 border"
    >
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className={`flex w-full justify-between items-center text-left text-sm font-medium p-4 rounded-lg border-l-4 ${styles.borderColor} ${open ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-50`}>
              <div className="flex items-center flex-1 min-w-0">
                {styles.icon}
                <p className="ml-3 truncate text-brand-text">{clause.clause_text}</p>
              </div>
              <div className="flex items-center ml-4 flex-shrink-0">
                  <span className="font-semibold text-gray-700">{clause.risk_level}</span>
                  <ChevronUpIcon className={`${open ? 'rotate-180' : ''} h-5 w-5 text-gray-500 ml-2 transition-transform`} />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-5 text-sm text-brand-text border-t border-gray-200">
              {clause.rag_warning && (
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0"><InformationCircleIcon className="h-5 w-5 text-yellow-500" /></div>
                    <div className="ml-3" dangerouslySetInnerHTML={{ __html: clause.rag_warning.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                </div>
              )}
              <h4 className="font-semibold mb-2 text-brand-blue">AI Explanation:</h4>
              <p className="leading-relaxed">{clause.explanation}</p>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </motion.div>
  );
};

// Engaging "In Progress" component with animated text
const AnalysisInProgress: React.FC = () => {
  const steps = [
    "Parsing document structure...",
    "Identifying key clauses and provisions...",
    "Assessing risks with Gemini's advanced logic...",
    "Cross-referencing legal guidelines...",
    "Generating your personalized report...",
  ];
  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-brand-green border-gray-200 rounded-full" />
        <h2 className="mt-6 text-brand-blue font-bold text-2xl font-display">Analyzing Your Document</h2>
        <div className="w-full max-w-md mt-4 h-6">
            <AnimatePresence mode="wait">
                <motion.p 
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }} className="text-brand-text font-semibold">
                    {steps[currentStep]}
                </motion.p>
            </AnimatePresence>
      </div>
    </div>
  );
};

// Floating Chat Widget Component
const ChatWidget: React.FC<{ chatHistory: ChatMessage[]; onSendMessage: (message: string) => void }> = ({ chatHistory, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-[24rem] h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col origin-bottom-right"
            >
              <div className="flex justify-between items-center p-4 border-b bg-brand-gray rounded-t-2xl flex-shrink-0">
                <h3 className="text-lg font-bold text-brand-blue font-display">AI Assistant</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-brand-blue">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 && (
                     <div className="text-center text-sm text-gray-400 h-full flex flex-col justify-center">
                        <p>Ask questions about your document like:</p>
                        <p className="mt-2 font-medium text-gray-500">"What are the penalties for late payment?"</p>
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${ msg.role === 'user' ? 'bg-brand-green text-white rounded-br-none' : 'bg-gray-100 text-brand-text rounded-bl-none'}`}>
                      {msg.role === 'loading' ? (
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                      ) : ( <p className="text-sm whitespace-pre-wrap">{msg.content}</p> )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t bg-brand-gray rounded-b-2xl flex-shrink-0">
                <div className="flex items-center">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
                    placeholder='Ask a "What If?" question...'
                    className="w-full border-gray-300 rounded-full px-4 py-2 shadow-sm focus:border-brand-green focus:ring-brand-green"
                    disabled={chatHistory.some((m) => m.role === 'loading')} />
                  <button onClick={handleSend} disabled={chatHistory.some((m) => m.role === 'loading')}
                    className="ml-3 bg-brand-green hover:bg-opacity-90 text-white p-2.5 rounded-full disabled:bg-gray-400 transition-transform hover:scale-110">
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-brand-blue text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
          {isOpen ? <XMarkIcon className="h-8 w-8" /> : <ChatBubbleLeftRightIcon className="h-8 w-8" />}
        </motion.button>
      </div>
    </>
  );
};

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading, error, onNewAnalysis, chatHistory, onSendMessage }) => {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Attention'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const wellnessScore = useMemo(() => {
    if (!analysis?.clauses) return 0;
    const critical = analysis.clauses.filter(c => c.risk_level === 'Critical').length;
    const attention = analysis.clauses.filter(c => c.risk_level === 'Attention').length;
    return Math.max(0, 100 - (critical * 10) - (attention * 3));
  }, [analysis]);

  const filteredClauses = useMemo(() => {
    if (!analysis?.clauses) return [];
    return analysis.clauses.filter(clause => {
      const matchesFilter = filter === 'All' || clause.risk_level === filter;
      const matchesSearch = searchTerm === '' || 
        clause.clause_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clause.explanation.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [analysis, filter, searchTerm]);

  if (isLoading) return <AnalysisInProgress />;
  if (error) return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-red-50 rounded-lg">
          <ShieldExclamationIcon className="h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-xl font-bold text-red-800">Analysis Failed</h3>
          <p className="text-red-700 mt-2">{error}</p>
          <button onClick={onNewAnalysis} className="mt-6 flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
              Try a New Analysis
          </button>
      </div>
  );
  if (!analysis) return null;

  const textForSpeech = `Summary: ${analysis.summary}.`;

  return (
    <div className="h-full flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 flex-shrink-0">
            <div>
                <h1 className="text-3xl font-bold text-brand-blue font-display">Analysis Report</h1>
                <p className="text-gray-500">For <span className="font-semibold text-brand-text">{analysis.file_name || 'your document'}</span></p>
            </div>
            <AudioPlayer textToRead={textForSpeech} />
        </div>

        <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-8 flex-shrink-0">
            <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.1 }} className="md:col-span-2 bg-white/80 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-brand-blue flex items-center mb-3"><DocumentCheckIcon className="h-6 w-6 mr-2 text-brand-green"/>Executive Summary</h3>
                <p className="text-brand-text leading-relaxed">{analysis.summary}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.2 }} className="bg-white/80 p-6 rounded-lg shadow-md flex items-center justify-center">
                <RiskScoreGauge score={wellnessScore} />
            </motion.div>
        </div>

        <div className="flex flex-col flex-grow min-h-0">
            <h3 className="text-xl font-bold text-brand-blue font-display mb-4">Clause Breakdown</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-4 flex-shrink-0">
                <div className="flex-grow relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <input type="text" placeholder="Search clauses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green" />
                </div>
                <div className="flex-shrink-0">
                    <div className="flex items-center p-1 bg-gray-200/70 rounded-md">
                        {(['All', 'Critical', 'Attention'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-sm font-semibold rounded ${filter === f ? 'bg-white text-brand-blue shadow' : 'text-gray-600'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                <AnimatePresence>
                {filteredClauses.length > 0 ? ( filteredClauses.map((clause, index) => <ClauseItem key={`${clause.clause_text}-${index}`} clause={clause} />) ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-gray-500">
                        <p>No clauses match your search or filter.</p>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
        
        {/* Render the floating chat widget */}
        <ChatWidget chatHistory={chatHistory} onSendMessage={onSendMessage} />
    </div>
  );
};

export default AnalysisPanel;

