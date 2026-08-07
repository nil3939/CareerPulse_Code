'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Message } from '@/types';
import { 
  X, Send, Paperclip, Calendar, CheckCheck, Sparkles, FileText, ExternalLink, UserCheck 
} from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetCandidateName?: string;
  initialTargetCandidate?: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ 
  isOpen, 
  onClose, 
  targetCandidateName,
  initialTargetCandidate 
}) => {
  const { messages, sendMessage, currentUser } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | undefined>(undefined);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() && !attachedFile) return;

    sendMessage(inputMsg, attachedFile);
    setInputMsg('');
    setAttachedFile(undefined);
  };

  const recipientName = initialTargetCandidate || targetCandidateName || 'Recruiter / Candidate';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-600 dark:text-red-400 font-black flex items-center justify-center border border-brand-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {recipientName}
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[10px] text-slate-400">Direct Messages · CareerPulse Real-Time Sync</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="text-center">
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
              🔒 End-to-End Encrypted Career Messaging
            </span>
          </div>

          {messages.map(msg => {
            const isMe = msg.senderId === currentUser?.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-400">
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.createdAt}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-gradient-to-r from-brand-600 to-red-500 text-white rounded-tr-none font-medium'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional File Attachment rendering */}
                  {msg.fileUrl && (
                    <div className="mt-2 p-2 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-between gap-2 text-[11px]">
                      <span className="flex items-center gap-1 font-mono truncate">
                        <FileText className="w-3.5 h-3.5" /> Resume_Portfolio.pdf
                      </span>
                      <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="underline font-bold">
                        View
                      </a>
                    </div>
                  )}

                  {/* Calendar Link preview */}
                  {msg.calendarLink && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-300" /> Google Meet Interview Link
                      </div>
                      <a
                        href={msg.calendarLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold underline flex items-center gap-1 text-white dark:text-amber-300"
                      >
                        Join Video Interview Room <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-[10px] text-slate-400 px-1">
                  {isMe && <CheckCheck className="w-3 h-3 text-brand-500" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAttachedFile('https://example.com/demo-resume.pdf')}
            className={`p-2 rounded-xl border transition-colors ${
              attachedFile
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
            title="Attach Resume PDF"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            placeholder="Type a message or candidate interview question..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />

          <button
            type="submit"
            disabled={!inputMsg.trim() && !attachedFile}
            className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-red-500 text-white disabled:opacity-40 transition-all hover:scale-105 shadow-md shadow-red-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
