
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserIcon } from './icons/UserIcon';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am Aapda Mitra. How can I help you today regarding disaster safety and preparedness?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await getChatbotResponse([...messages, userMessage], input.trim());
      const botMessage: ChatMessage = { sender: 'bot', text: botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Log the detailed error for debugging purposes.
      console.error("Failed to get chatbot response:", error);
      const errorMessage: ChatMessage = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handleSend();
      }
  }

  return (
    <div className="bg-brand-gray-800 rounded-2xl shadow-2xl border border-brand-gray-700 flex flex-col h-full w-full">
      <div className="p-4 border-b border-brand-gray-700 flex items-center gap-3 bg-brand-gray-900/50 rounded-t-2xl">
        <SparklesIcon />
        <h3 className="text-lg font-bold text-brand-blue">Aapda Mitra AI</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0 text-white">
                <SparklesIcon />
              </div>
            )}
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'bot' ? 'bg-brand-gray-700 text-brand-gray-200 rounded-tl-none' : 'bg-brand-blue text-white rounded-br-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-brand-gray-700 flex items-center justify-center flex-shrink-0 text-brand-gray-300">
                <UserIcon />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0 text-white">
                    <SparklesIcon />
                </div>
                <div className="max-w-[80%] p-3 rounded-2xl bg-brand-gray-700 text-brand-gray-200 rounded-tl-none">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-brand-gray-400 animate-pulse" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-brand-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-brand-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-brand-gray-700 bg-brand-gray-800 rounded-b-2xl">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="w-full p-3 pr-12 bg-brand-gray-700 border border-brand-gray-600 rounded-lg text-brand-gray-100 focus:ring-2 focus:ring-brand-blue"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-blue rounded-md text-white disabled:bg-brand-gray-600"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
