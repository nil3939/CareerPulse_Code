'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatDrawer } from '@/components/messaging/ChatDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import { UserRole, Application } from '@/types';

// Candidate Components
import { CandidateMetrics } from '@/components/candidate/CandidateMetrics';
import { JobsRecommended } from '@/components/candidate/JobsRecommended';
import { ResumeTailor } from '@/components/candidate/ResumeTailor';
import { MockInterviewer } from '@/components/candidate/MockInterviewer';
import { CourseAllocationHub } from '@/components/candidate/CourseAllocationHub';
import { QuizLeaderboard } from '@/components/candidate/QuizLeaderboard';
import { CandidateProfileView } from '@/components/candidate/CandidateProfileView';
import { CandidateAppliedJobs } from '@/components/candidate/CandidateAppliedJobs';
import { AICareerGuidance } from '@/components/candidate/AICareerGuidance';

// Recruiter Components
import { KanbanBoard } from '@/components/recruiter/KanbanBoard';
import { JobPostFormModal } from '@/components/recruiter/JobPostForm';
import { RecruiterProfileView } from '@/components/recruiter/RecruiterProfileView';
import { RecruiterMyJobs } from '@/components/recruiter/RecruiterMyJobs';

// Admin Components
import { AdminOverview } from '@/components/admin/AdminOverview';

import { 
  UserCheck, Briefcase, ShieldAlert, Sparkles, Wand2, 
  Video, BookOpen, Trophy, PlusCircle, Layers, CheckCircle2,
  User, Building2, Lock, LogIn, Compass
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser } = useApp();
  const { isAuthenticated, role, authUser } = useAuth();

  const [chatOpen, setChatOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [targetCandidateName, setTargetCandidateName] = useState<string | undefined>(undefined);
  const [jobPostModalOpen, setJobPostModalOpen] = useState(false);

  // Candidate Sub-tab state
  const [candidateTab, setCandidateTab] = useState<'overview' | 'applied' | 'career' | 'resume' | 'interview' | 'learning' | 'quiz' | 'profile'>('overview');
  // Recruiter Sub-tab state
  const [recruiterTab, setRecruiterTab] = useState<'pipeline' | 'myjobs' | 'profile'>('pipeline');

  const activeUser = authUser || currentUser;

  const handleOpenRecruiterChat = (app: Application) => {
    setTargetCandidateName(app.candidateName);
    setChatOpen(true);
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'candidate':
        return <UserCheck className="w-5 h-5 text-emerald-500" />;
      case 'recruiter':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'admin':
        return <ShieldAlert className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar onOpenChat={() => setChatOpen(true)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* IF USER IS NOT LOGGED IN -> REQUIRE SIGN-IN LANDING SCREEN */}
        {!isAuthenticated ? (
          <div className="py-16 text-center space-y-5 max-w-lg mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl my-8">
            <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-red-950 text-brand-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Authentication Required</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Please sign in or register to access your personal Candidate, Recruiter, or Admin Dashboard on CareerPulse.
              </p>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Sign In / Register Account
            </button>
          </div>
        ) : (
          <>
            {/* Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/10 text-white backdrop-blur-md uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                    {getRoleIcon()}
                    {role === 'candidate' ? 'Candidate Dashboard' : role === 'recruiter' ? 'Recruiter Hub' : 'Admin Control Panel'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Welcome back, {activeUser?.name || 'User'} 👋
                </h1>
                <p className="text-xs text-slate-300 max-w-xl">
                  {role === 'candidate' && 'Track job applications, run AI resume checks, and take mock interviews.'}
                  {role === 'recruiter' && 'Manage job listings, screen applicants, and advance hiring stages.'}
                  {role === 'admin' && 'Approve recruiter job postings, verify companies, and moderate content safety.'}
                </p>
              </div>

              {/* Action Button */}
              <div>
                {role === 'recruiter' && (
                  <button
                    onClick={() => setJobPostModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-red-500/20 flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <PlusCircle className="w-4 h-4" /> Post New Job
                  </button>
                )}
              </div>
            </div>

            {/* CANDIDATE VIEW */}
            {role === 'candidate' && (
              <div className="space-y-6">
                
                {/* Candidate Sub-navigation Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
                  <button
                    onClick={() => setCandidateTab('overview')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      candidateTab === 'overview'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Overview
                  </button>

                  <button
                    onClick={() => setCandidateTab('applied')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      candidateTab === 'applied'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" /> My Applied Jobs
                  </button>

                  {/* REQUIREMENT 6: NEW AI CAREER GUIDANCE TAB */}
                  <button
                    onClick={() => setCandidateTab('career')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      candidateTab === 'career'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-300" /> AI Career Guidance
                  </button>

                  <button
                    onClick={() => setCandidateTab('resume')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      candidateTab === 'resume'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5" /> AI Resume & ATS
                  </button>

                  <button
                    onClick={() => setCandidateTab('interview')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      candidateTab === 'interview'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" /> Mock Interview
                  </button>

                  <button
                    onClick={() => setCandidateTab('learning')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      candidateTab === 'learning'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Learning Hub
                  </button>

                  <button
                    onClick={() => setCandidateTab('quiz')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      candidateTab === 'quiz'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" /> Quizzes & Ranks
                  </button>

                  <button
                    onClick={() => setCandidateTab('profile')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      candidateTab === 'profile'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Candidate Profile
                  </button>
                </div>

                {/* Sub-tab Content Rendering */}
                {candidateTab === 'overview' && (
                  <>
                    <CandidateMetrics />
                    <JobsRecommended />
                  </>
                )}

                {candidateTab === 'applied' && <CandidateAppliedJobs />}
                {candidateTab === 'career' && <AICareerGuidance />}
                {candidateTab === 'resume' && <ResumeTailor />}
                {candidateTab === 'interview' && <MockInterviewer />}
                {candidateTab === 'learning' && <CourseAllocationHub />}
                {candidateTab === 'quiz' && <QuizLeaderboard />}
                {candidateTab === 'profile' && <CandidateProfileView />}

              </div>
            )}

            {/* RECRUITER VIEW */}
            {role === 'recruiter' && (
              <div className="space-y-6">
                
                {/* Recruiter Sub-navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <button
                    onClick={() => setRecruiterTab('pipeline')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      recruiterTab === 'pipeline'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Applicant Kanban Pipeline
                  </button>

                  <button
                    onClick={() => setRecruiterTab('myjobs')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      recruiterTab === 'myjobs'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" /> My Posted Jobs & Applicants
                  </button>

                  <button
                    onClick={() => setRecruiterTab('profile')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      recruiterTab === 'profile'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Recruiter Company Profile
                  </button>
                </div>

                {recruiterTab === 'pipeline' && <KanbanBoard onOpenChat={handleOpenRecruiterChat} />}
                {recruiterTab === 'myjobs' && <RecruiterMyJobs />}
                {recruiterTab === 'profile' && <RecruiterProfileView />}

              </div>
            )}

            {/* ADMIN VIEW */}
            {role === 'admin' && (
              <AdminOverview />
            )}
          </>
        )}

      </main>

      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialTargetCandidate={targetCandidateName}
      />

      <JobPostFormModal
        isOpen={jobPostModalOpen}
        onClose={() => setJobPostModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
