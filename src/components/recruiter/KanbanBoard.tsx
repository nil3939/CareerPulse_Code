'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Application, ApplicationStage } from '@/types';
import { CandidateEvaluationCard } from './CandidateEvaluationCard';
import { GithubSummarizerModal } from './GithubSummarizerModal';
import { CalendarSchedulerModal } from './CalendarScheduler';
import { Sparkles, Layers, ArrowRight, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Lock, Briefcase } from 'lucide-react';

interface KanbanBoardProps {
  onOpenChat: (app: Application) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onOpenChat }) => {
  const { applications, jobs, updateApplicationStage, currentUser } = useApp();
  const { isAuthenticated, role, authUser } = useAuth();

  const [selectedAppForGithub, setSelectedAppForGithub] = useState<Application | null>(null);
  const [selectedAppForScheduler, setSelectedAppForScheduler] = useState<Application | null>(null);

  const activeUser = authUser || currentUser;
  const canModifyPipeline = isAuthenticated && (role === 'recruiter' || role === 'admin');

  // Filter jobs posted by this specific recruiter
  const myJobIds = jobs
    .filter(j => j.recruiterId === activeUser?.id)
    .map(j => j.id);

  // If recruiter: ONLY show applications for jobs posted by THIS recruiter.
  // If admin: show all applications.
  const recruiterApps = (role === 'admin')
    ? applications
    : applications.filter(a => myJobIds.includes(a.jobId) || a.jobId === activeUser?.id);

  const stages: ApplicationStage[] = [
    'Applied',
    'Screening',
    'Shortlisted',
    'Interview Scheduled',
    'Offer Extended',
    'Hired',
  ];

  const getStageColor = (stage: ApplicationStage) => {
    switch (stage) {
      case 'Applied': return 'border-t-slate-400 bg-slate-500/10 text-slate-700 dark:text-slate-300';
      case 'Screening': return 'border-t-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300';
      case 'Shortlisted': return 'border-t-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'Interview Scheduled': return 'border-t-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300';
      case 'Offer Extended': return 'border-t-brand-500 bg-brand-500/10 text-brand-700 dark:text-red-400';
      case 'Hired': return 'border-t-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
      case 'Rejected': return 'border-t-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300';
    }
  };

  const handleAdvanceStage = (appId: string, currentStage: ApplicationStage, direction: 'next' | 'prev') => {
    if (!canModifyPipeline) return;
    const currentIndex = stages.indexOf(currentStage);
    if (direction === 'next' && currentIndex < stages.length - 1) {
      updateApplicationStage(appId, stages[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      updateApplicationStage(appId, stages[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600 dark:text-red-400" />
            Interactive Recruiter Application Pipeline (Kanban Board)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate candidate ATS match %, 50-MCQ Quiz scores, view GitHub breakdown, and advance pipeline stages.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Total Active: {recruiterApps.length}</span>
        </div>
      </div>

      {/* Empty State Banner when no jobs posted or no applications received */}
      {recruiterApps.length === 0 && (
        <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 my-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-500 mx-auto flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">No Candidate Applications Yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              {myJobIds.length === 0
                ? "You haven't posted any job openings yet. Post a job opening above, wait for admin approval, and candidate applications will automatically appear in your pipeline."
                : "You have active job postings, but no candidates have applied yet. Once candidates submit applications, they will appear right here in your pipeline."}
            </p>
          </div>
        </div>
      )}

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageApps = recruiterApps.filter(a => a.stage === stage);

          return (
            <div
              key={stage}
              className="flex flex-col min-w-[260px] md:min-w-[220px] rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-3 space-y-3 shadow-inner"
            >
              {/* Stage Header */}
              <div className={`p-3 rounded-2xl border-t-4 shadow-sm flex items-center justify-between ${getStageColor(stage)}`}>
                <span className="text-xs font-black uppercase tracking-wider">{stage}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white dark:bg-slate-900 shadow-sm">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1 min-h-[350px]">
                {stageApps.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-6 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    No candidates in {stage}
                  </div>
                ) : (
                  stageApps.map(app => (
                    <CandidateEvaluationCard
                      key={app.id}
                      application={app}
                      canModify={canModifyPipeline}
                      onOpenChat={() => onOpenChat(app)}
                      onOpenGithub={() => setSelectedAppForGithub(app)}
                      onOpenScheduler={() => setSelectedAppForScheduler(app)}
                      onNext={() => handleAdvanceStage(app.id, stage, 'next')}
                      onPrev={() => handleAdvanceStage(app.id, stage, 'prev')}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* GitHub & Calendar Modals */}
      {selectedAppForGithub && (
        <GithubSummarizerModal
          application={selectedAppForGithub}
          onClose={() => setSelectedAppForGithub(null)}
        />
      )}

      {selectedAppForScheduler && (
        <CalendarSchedulerModal
          application={selectedAppForScheduler}
          onClose={() => setSelectedAppForScheduler(null)}
        />
      )}
    </div>
  );
};
