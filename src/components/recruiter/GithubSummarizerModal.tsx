'use client';

import React from 'react';
import { Application } from '@/types';
import { X, Github, Star, GitCommit, Code2, ExternalLink, Sparkles, Trophy } from 'lucide-react';

interface GithubSummarizerModalProps {
  application: Application | null;
  onClose: () => void;
}

export const GithubSummarizerModal: React.FC<GithubSummarizerModalProps> = ({ application, onClose }) => {
  if (!application) return null;

  const gh = application.githubSummary || {
    topLanguages: ['TypeScript', 'JavaScript', 'Python'],
    contributionsThisYear: 1420,
    starCount: 384,
    topRepos: ['next-ai-resume-builder', 'fullstack-job-portal', 'react-kanban-board'],
    commitFrequency: 'Very Active',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <img
              src={application.candidateAvatar}
              alt={application.candidateName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {application.candidateName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1">
                  <Github className="w-3 h-3" /> AI Summarized
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {application.candidateGithub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <GitCommit className="w-3.5 h-3.5 text-emerald-500" /> Contributions (2026)
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {gh.contributionsThisYear}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Total Stars
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {gh.starCount}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-purple-500" /> Activity Level
            </span>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-2">
              {gh.commitFrequency}
            </div>
          </div>
        </div>

        {/* Contribution Heatmap Mockup */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <Code2 className="w-4 h-4 text-emerald-400" /> Contribution Activity Heatmap
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1,420 contributions in last year</span>
          </div>

          <div className="grid grid-cols-12 gap-1.5 pt-2">
            {Array.from({ length: 48 }).map((_, idx) => {
              const intensity = idx % 4 === 0 ? 'bg-emerald-500' : idx % 3 === 0 ? 'bg-emerald-700' : idx % 5 === 0 ? 'bg-emerald-400' : 'bg-slate-800';
              return (
                <div key={idx} className={`h-4 rounded-sm ${intensity}`} title="Active commit day" />
              );
            })}
          </div>
        </div>

        {/* Top Tech Languages & Repos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary Language Stack
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {gh.topLanguages.map(lang => (
                <span
                  key={lang}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 dark:bg-red-950/40 dark:text-red-300 border border-brand-200 dark:border-red-800"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Highlighted Open-Source Projects
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono">
              {gh.topRepos.map(repo => (
                <li key={repo} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold">{repo}</span>
                  <a href={`https://${application.candidateGithub}`} target="_blank" rel="noreferrer" className="text-brand-600 dark:text-red-400">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
