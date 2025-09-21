import React, { useState, useEffect, useRef } from 'react';
import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftRightIcon,
  XMarkIcon 
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

// Define the ChatMessage type
export interface ChatMessage {
  role: 'user' | 'model' | 'loading';
  content: string;
}

interface ChatPanelProps {
  onSendMessage: (message: string) => void;
  chatHistory: ChatMessage[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onSendMessage, chatHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat when new messages appear
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
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Backdrop for closing the modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            // Responsive positioning: "Bottom Sheet" on mobile, fixed widget on desktop
            className="fixed bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl sm:h-[32rem] sm:w-96 sm:left-auto sm:right-8 sm:bottom-24 z-50 bg-white shadow-2xl flex flex-col origin-bottom-right"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-brand-gray rounded-t-2xl flex-shrink-0">
              <h3 className="text-lg font-bold text-brand-blue font-display">Ask "What If?"</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-brand-blue">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Message Area */}
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
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-lg shadow-sm ${
                      msg.role === 'user' ? 'bg-brand-green text-white rounded-br-none' : 'bg-gray-100 text-brand-text rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'loading' ? (
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-brand-gray rounded-b-2xl flex-shrink-0">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='e.g., What if I pay late?'
                  className="w-full border-gray-300 rounded-full px-4 py-2 shadow-sm focus:border-brand-green focus:ring-brand-green"
                  disabled={chatHistory.some((m: { role: string; }) => m.role === 'loading')}
                />
                <button
                  onClick={handleSend}
                  disabled={chatHistory.some((m: { role: string; }) => m.role === 'loading')}
                  className="ml-3 bg-brand-green hover:bg-opacity-90 text-white p-2.5 rounded-full disabled:bg-gray-400 transition-transform hover:scale-110"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button - Now only shows when chat is closed */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
        <AnimatePresence>
            {!isOpen && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-brand-blue text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                    aria-label="Open Chat"
                >
                    <ChatBubbleLeftRightIcon className="h-8 w-8" />
                </motion.button>
            )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ChatPanel;
