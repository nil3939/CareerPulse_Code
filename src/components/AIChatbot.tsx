'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '@/services/geminiService';
import { useAuth } from '@/context/AuthContext';
import { ChatbotMessage } from '@/types';
import { 
  MessageSquare, Send, Loader2, Bot, User, X, Minimize2, Maximize2,
  Sparkles, ChevronDown
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What is the average salary for a React developer in Dhaka?',
  'How do I improve my ATS resume score?',
  'Tips for technical interview preparation?',
  'What skills are most in-demand in Bangladesh?',
  'How to write a compelling cover letter?',
  'How do I apply for jobs on CareerPulse?',
];

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const { authUser, role } = useAuth();
  const [messages, setMessages] = useState<ChatbotMessage[]>([
    {
      id: 'init',
      sender: 'bot',
      text: `👋 Hi ${authUser?.name?.split(' ')[0] || 'there'}! I'm **CareerPulse AI**, powered by Google Gemini 🤖\n\nI can help you with:\n• Career guidance & salary insights in Bangladesh\n• Resume optimization & ATS tips\n• Interview preparation strategies\n• Job search & application advice\n• Skill learning pathway recommendations\n\nWhat can I help you with today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatbotMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);
    try {
      const responseText = await getChatbotResponse(text, role);
      const botMsg: ChatbotMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`, sender: 'bot',
        text: "I'm sorry, I couldn't process that. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  // Parse basic markdown-like bold text
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split('**').map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 ${
      isMinimized ? 'w-72 h-16' : 'w-80 sm:w-96 h-[560px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-red-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black text-white leading-none flex items-center gap-1">
              CareerPulse AI <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 font-mono">2.5 Flash</span>
            </p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Online · Gemini 2.5 Flash Powered
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.sender === 'bot' 
                    ? 'bg-gradient-to-tr from-brand-600 to-red-500' 
                    : 'bg-gradient-to-tr from-slate-700 to-slate-600'
                }`}>
                  {msg.sender === 'bot' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'bot'
                      ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                      : 'bg-gradient-to-br from-brand-600 to-red-500 text-white rounded-tr-sm'
                  }`}>
                    {renderText(msg.text)}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="bg-white dark:bg-slate-900 px-3 py-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1"><ChevronDown className="w-3 h-3" /> Suggested Questions</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="flex-shrink-0 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-800 hover:border-brand-300 dark:hover:border-red-700 transition-colors max-w-[140px] text-left leading-tight"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask CareerPulse AI..."
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-brand-600 to-red-500 flex items-center justify-center text-white disabled:opacity-40 transition-all hover:scale-105 shadow-md shadow-red-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

// Floating launcher button
export const ChatbotLauncher: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-red-500 shadow-xl shadow-red-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform group"
    title="Chat with CareerPulse AI"
  >
    <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
  </button>
);
