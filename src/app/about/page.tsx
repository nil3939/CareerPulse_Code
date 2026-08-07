'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatDrawer } from '@/components/messaging/ChatDrawer';
import { Sparkles, ShieldCheck, Heart, Award, Users, Globe, Zap, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenChat={() => setChatOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-red-400" /> Reimagining Tech Recruitment in Bangladesh
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            About CareerPulse
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            CareerPulse is built on a simple conviction: hiring top engineering talent in Bangladesh should be fast, transparent, and driven by verified skill metrics rather than arbitrary resume keywords.
          </p>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-red-400 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Candidate Intelligence</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time ATS resume scoring, bullet point tailoring, cover letter generation, and video/voice mock interviews with Gemini AI feedback.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verified Recruiter Badges</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Strict company and office verification in Dhaka, Chittagong, and Sylhet preventing spam job postings and protecting candidate privacy.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">50-MCQ Skill Assessments</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Standardized technical quizzes for React, Python, Node.js, and SQL with automated score metrics displayed on recruiter evaluation cards.
            </p>
          </div>
        </div>

      </main>

      <Footer />
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
