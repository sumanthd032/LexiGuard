/**
 * @file ChatPanel.tsx
 * @description A responsive, floating chat component that functions as a "bottom sheet" modal on mobile
 * and a fixed-position widget on larger screens. It allows users to interact with an AI assistant.
 */

import React, { useEffect, useRef, useState } from 'react';

import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftRightIcon,
  XMarkIcon 
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @interface ChatMessage
 * @description Defines the structure for a single message in the chat history.
 */
export interface ChatMessage {
  role: 'user' | 'model' | 'loading'; // 'user' for messages from the user, 'model' for AI responses, 'loading' for a placeholder.
  content: string; // The text content of the message.
}

/**
 * @interface ChatPanelProps
 * @description Defines the props for the ChatPanel component.
 */
interface ChatPanelProps {
  onSendMessage: (message: string) => void; // Callback function to execute when the user sends a message.
  chatHistory: ChatMessage[]; // An array of ChatMessage objects representing the conversation history.
}

/**
 * The ChatPanel component provides a user interface for a conversational AI.
 * It features a floating action button to open a modal window where users can
 * send and receive messages.
 * @param {ChatPanelProps} props - The props for the component.
 */
const ChatPanel: React.FC<ChatPanelProps> = ({ onSendMessage, chatHistory }) => {
  // State to manage the visibility of the chat modal.
  const [isOpen, setIsOpen] = useState(false);
  // State to manage the content of the text input field.
  const [input, setInput] = useState('');
  // A ref to the DOM element that contains the chat messages.
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // This effect hook automatically scrolls the chat container to the bottom
  // whenever a new message is added to the history, ensuring the latest message is visible.
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]); // Reruns when chatHistory changes or the panel opens/closes.

  /**
   * Handles sending a message. It calls the onSendMessage prop if the input is not empty,
   * then clears the input field.
   */
  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  /**
   * Allows users to send a message by pressing the 'Enter' key.
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* A semi-transparent backdrop that appears behind the chat modal.
        Clicking it will close the chat window.
      */}
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
      
      {/* The main chat modal window. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            // On small screens (mobile), it acts as a "bottom sheet" taking up most of the screen height.
            // On larger screens (sm: and up), it becomes a fixed-size widget in the bottom-right corner.
            className="fixed bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl sm:h-[32rem] sm:w-96 sm:left-auto sm:right-8 sm:bottom-24 z-50 bg-white shadow-2xl flex flex-col origin-bottom-right"
          >
            {/* Header section with title and close button. */}
            <div className="flex justify-between items-center p-4 border-b bg-brand-gray rounded-t-2xl flex-shrink-0">
              <h3 className="text-lg font-bold text-brand-blue font-display">Ask "What If?"</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-brand-blue">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable area for displaying chat messages. */}
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
              {/* Display a welcome/prompt message if the chat history is empty. */}
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
                    {/* Show a loading indicator for pending AI responses. */}
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

            {/* Input field and send button area. */}
            <div className="p-4 border-t bg-brand-gray rounded-b-2xl flex-shrink-0">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='e.g., What if I pay late?'
                  className="w-full border-gray-300 rounded-full px-4 py-2 shadow-sm focus:border-brand-green focus:ring-brand-green"
                  // Disable input while waiting for a response.
                  disabled={chatHistory.some((m: { role: string; }) => m.role === 'loading')}
                />
                <button
                  onClick={handleSend}
                  disabled={chatHistory.some((m: { role:string; }) => m.role === 'loading')}
                  className="ml-3 bg-brand-green hover:bg-opacity-90 text-white p-2.5 rounded-full disabled:bg-gray-400 transition-transform hover:scale-110"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Floating Action Button (FAB) to open the chat.
        It is only visible when the chat modal is closed.
      */}
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