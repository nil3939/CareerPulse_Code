'use client';

import React from 'react';
import { Application } from '@/types';
import { Sparkles, Award, Github, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CandidateEvaluationCardProps {
  application: Application;
  canModify?: boolean;
  onOpenGithub: (app: Application) => void;
  onOpenScheduler: (app: Application) => void;
  onOpenChat: (app: Application) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const CandidateEvaluationCard: React.FC<CandidateEvaluationCardProps> = ({
  application,
  canModify = true,
  onOpenGithub,
  onOpenScheduler,
  onOpenChat,
  onNext,
  onPrev,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
      
      {/* Top Header: Avatar & Name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={application.candidateAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={application.candidateName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
          />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
              {application.candidateName}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {application.candidateEmail}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-slate-400">
          {application.appliedAt}
        </span>
      </div>

      {/* Dual Assessment Metrics */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* ATS Score */}
        <div className="p-2.5 rounded-xl bg-brand-50/60 dark:bg-slate-800/60 border border-brand-200 dark:border-slate-700 flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-brand-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> ATS Match
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {application.atsMatchScore}%
          </span>
        </div>

        {/* 50-MCQ Quiz Score */}
        <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-200 dark:border-slate-700 flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3 h-3" /> Skill Quiz
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {application.quizScore}%
          </span>
        </div>
      </div>

      {/* Skills Badges */}
      <div className="flex items-center gap-1 flex-wrap">
        {application.candidateSkills.slice(0, 4).map(skill => (
          <span
            key={skill}
            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1.5 text-center">
        <button
          onClick={() => onOpenGithub(application)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
          title="View AI GitHub Repo Summary"
        >
          <Github className="w-3.5 h-3.5" /> Summary
        </button>

        <button
          onClick={() => onOpenScheduler(application)}
          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
          title="Schedule Calendar Interview"
        >
          <Calendar className="w-3.5 h-3.5" /> Schedule
        </button>

        <button
          onClick={() => onOpenChat(application)}
          className="p-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-brand-700 dark:text-red-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
          title="Direct Recruiter Message"
        >
          Message
        </button>
      </div>

      {/* Stage Advance & Prev Controls */}
      {canModify && (onNext || onPrev) && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          {onPrev ? (
            <button
              onClick={onPrev}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-0.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {onNext ? (
            <button
              onClick={onNext}
              className="text-[11px] font-extrabold text-brand-600 dark:text-red-400 hover:underline flex items-center gap-0.5 ml-auto"
            >
              Advance <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : <div />}
        </div>
      )}

    </div>
  );
};
