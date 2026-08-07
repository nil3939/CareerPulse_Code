'use client';

import React, { useState } from 'react';
import { Application } from '@/types';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import { X, Calendar, Clock, Video, CheckCircle2, Sparkles, Send } from 'lucide-react';

interface CalendarSchedulerModalProps {
  application: Application | null;
  onClose: () => void;
}

export const CalendarSchedulerModal: React.FC<CalendarSchedulerModalProps> = ({ application, onClose }) => {
  const { addCalendarSlot, currentUser } = useApp();
  const { authUser } = useAuth();
  const user = authUser || currentUser || mockUsers.recruiter;

  const [date, setDate] = useState('2026-08-06');
  const [time, setTime] = useState('03:00 PM BST');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/careerpulse-interview-room');
  const [isBooked, setIsBooked] = useState(false);

  if (!application) return null;

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    addCalendarSlot({
      recruiterId: user.id,
      candidateId: application.candidateId,
      candidateName: application.candidateName,
      jobTitle: application.jobTitle,
      date,
      time,
      meetLink,
    });
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600 dark:text-red-400" />
              Schedule Technical Interview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Candidate: <span className="font-bold text-slate-800 dark:text-slate-200">{application.candidateName}</span> ({application.jobTitle})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isBooked ? (
          <div className="py-12 text-center space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Interview Slot Confirmed!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Automated Google Meet link & direct message sent to {application.candidateName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleScheduleInterview} className="space-y-4">
            
            {/* Date Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-500" /> Select Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>

            {/* Time Slot Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" /> Select Time Slot (BST)
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 03:00 PM BST"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>

            {/* Video Meeting Room Link */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-emerald-500" /> Auto-Generated Meeting Link
              </label>
              <input
                type="url"
                required
                value={meetLink}
                onChange={e => setMeetLink(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Send className="w-4 h-4" /> Confirm & Send Calendar Invitation
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
