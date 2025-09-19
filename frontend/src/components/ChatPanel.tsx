import React from 'react';
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat
  React.useEffect(() => {
    if (chatContainerRef.current) {
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
              <div className="flex justify-between items-center p-4 border-b bg-brand-gray rounded-t-2xl">
                <h3 className="text-lg font-bold text-brand-blue font-display">Ask "What If?"</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-brand-blue">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-brand-green text-white rounded-br-none'
                          : msg.role === 'model'
                          ? 'bg-gray-100 text-brand-text rounded-bl-none'
                          : 'bg-gray-200 text-brand-text'
                      }`}
                    >
                      {msg.role === 'loading' ? (
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse-fast"></span>
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse-medium"></span>
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse-slow"></span>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t bg-brand-gray rounded-b-2xl">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='e.g., What if I pay late?'
                    className="w-full border-gray-300 rounded-full px-4 py-2 shadow-sm focus:border-brand-green focus:ring-brand-green"
                    disabled={chatHistory.some((m) => m.role === 'loading')}
                  />
                  <button
                    onClick={handleSend}
                    disabled={chatHistory.some((m) => m.role === 'loading')}
                    className="ml-3 bg-brand-green hover:bg-opacity-90 text-white p-2.5 rounded-full disabled:bg-gray-400 transition-transform hover:scale-110"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-brand-blue text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
          {isOpen ? <XMarkIcon className="h-8 w-8" /> : <ChatBubbleLeftRightIcon className="h-8 w-8" />}
        </motion.button>
      </div>
    </>
  );
};

export default ChatPanel;
