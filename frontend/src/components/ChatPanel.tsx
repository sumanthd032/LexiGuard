import React from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

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
  const [input, setInput] = React.useState('');
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

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
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-bold text-brand-blue font-display mb-4">
        Ask "What If?"
      </h3>
      <div className="bg-brand-gray p-4 rounded-lg h-64 flex flex-col">
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto space-y-4 pr-2"
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-brand-green text-white'
                    : msg.role === 'model'
                    ? 'bg-white text-brand-text'
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
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='e.g., What happens if I pay rent 5 days late?'
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-brand-green focus:ring-brand-green"
            disabled={chatHistory.some((m) => m.role === 'loading')}
          />
          <button
            onClick={handleSend}
            disabled={chatHistory.some((m) => m.role === 'loading')}
            className="ml-3 bg-brand-green hover:bg-opacity-90 text-white p-2 rounded-full disabled:bg-gray-400"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
