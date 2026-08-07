'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatDrawer } from '@/components/messaging/ChatDrawer';
import { AIChatbot, ChatbotLauncher } from '@/components/AIChatbot';
import { AIResumeChecker } from '@/components/candidate/AIResumeChecker';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { JobCard } from '@/components/jobs/JobCard';
import { 
  Sparkles, Briefcase, Building2, Users, Award, ShieldCheck, 
  ArrowRight, CheckCircle2, Video, FileText, Layers, MessageSquare, Wand2,
  FileCheck, MapPin, Search, ChevronRight, X
} from 'lucide-react';

export default function HomePage() {
  const { jobs, searchQuery, setSearchQuery, selectedLocationFilter, setSelectedLocationFilter } = useApp();
  const { authUser, role } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [botOpen, setBotOpen] = useState(false);
  const [showResumeCheckerModal, setShowResumeCheckerModal] = useState(false);

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = searchQuery === '' || 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLoc = selectedLocationFilter === 'all' || j.location.includes(selectedLocationFilter);
    return matchesSearch && matchesLoc;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onOpenChat={() => setChatOpen(true)} />

      <main className="flex-1 space-y-16 py-8">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-red-400 animate-pulse" />
                <span>#1 AI-Powered Job Platform in Bangladesh</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Land Your Dream Tech Role In <span className="bg-gradient-to-r from-brand-600 via-red-500 to-amber-500 bg-clip-text text-transparent">Bangladesh</span> With AI
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Empowering job seekers across Dhaka, Chittagong, and Sylhet with Gemini AI resume scoring, 50-MCQ skill quizzes, automated recruiter candidate pipelines, and real-time AI career guidance.
              </p>

              {/* Search Bar */}
              <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 w-full">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search titles, skills (e.g. React, Python, Node)..."
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={selectedLocationFilter}
                  onChange={e => setSelectedLocationFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none w-full sm:w-auto"
                >
                  <option value="all">📍 All BD Locations</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Remote">Remote (BD)</option>
                </select>
                <Link
                  href="/jobs"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Search Jobs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={() => setShowResumeCheckerModal(true)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <FileCheck className="w-4 h-4" /> AI Resume Checker & ATS Score
                </button>

                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Wand2 className="w-4 h-4 text-brand-500" /> Launch Career Dashboard
                </Link>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">10k+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Active BD Jobs</div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">5k+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Verified BD Companies</div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">50k+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Job Seekers</div>
                </div>
              </div>
            </div>

            {/* Right Hero Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 p-6 sm:p-8 shadow-2xl text-white overflow-hidden space-y-6">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Gemini AI Suite Active</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-brand-500/20 text-brand-300 border border-brand-500/30">CareerPulse 2.0</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-200"><FileCheck className="w-4 h-4 text-emerald-400" /> ATS Resume Match Score</span>
                      <span className="text-emerald-400 font-black text-sm">94%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[94%]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-200"><Award className="w-4 h-4 text-amber-400" /> 50-MCQ React Skill Quiz</span>
                      <span className="text-amber-400 font-black text-sm">48/50 (96%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full w-[96%]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Recruiter Email Notification</p>
                        <p className="text-[10px] text-slate-400">Auto-sent when hired by TechVenture BD</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Triggered</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-400 border-t border-white/10">
                  <span>Candidate Perspective</span>
                  <button onClick={() => setBotOpen(true)} className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1">
                    Ask Gemini Chatbot <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURED JOBS IN BANGLADESH */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Featured Engineering Jobs in Bangladesh
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">High-growth tech opportunities in Dhaka, Chittagong, Sylhet & Remote</p>
            </div>
            <Link href="/jobs" className="text-xs font-bold text-brand-600 dark:text-red-400 hover:underline flex items-center gap-1">
              View All Jobs ({jobs.length}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.slice(0, 6).map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* CAREERPULSE PLATFORM FEATURES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Why Software Engineers & Recruiters Choose CareerPulse</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to hire or land tech roles with AI efficiency.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">AI Resume Checker & ATS</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Upload PDF or DOC resumes. Get real-time ATS match scoring, bullet point improvement recommendations, and course suggestions tailored to Bangladesh market demands.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">AI Voice Mock Interviewer</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Practice real technical interview questions with live Gemini evaluation of your technical accuracy, clarity, and communication confidence.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-purple-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">50-MCQ Skill Quizzes</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Validate your skills in React, Python, Node.js, and SQL with rigorous 50-MCQ assessments and gain global leaderboard badges.</p>
            </div>
          </div>
        </section>

      </main>

      {/* AI Resume Checker Modal */}
      {showResumeCheckerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowResumeCheckerModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <AIResumeChecker />
          </div>
        </div>
      )}

      {/* Chat Drawers */}
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <AIChatbot isOpen={botOpen} onClose={() => setBotOpen(false)} />
      <ChatbotLauncher onClick={() => setBotOpen(true)} />

      <Footer />
    </div>
  );
}
