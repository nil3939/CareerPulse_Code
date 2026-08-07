'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import { Briefcase, CheckCircle, Calendar, Award, TrendingUp } from 'lucide-react';

export const CandidateMetrics: React.FC = () => {
  const { applications, quizLeaderboard, currentUser } = useApp();
  const { authUser } = useAuth();
  const [atsScore, setAtsScore] = useState<number | null>(null);

  const user = authUser || currentUser || mockUsers.candidate;

  // Load saved ATS score for this candidate from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const savedAts = localStorage.getItem(`cp_ats_score_${user.id}`);
      if (savedAts) {
        const val = parseInt(savedAts, 10);
        if (!isNaN(val)) setAtsScore(val);
      }
    }
  }, [user?.id]);

  const userApps = applications.filter(a => a.candidateId === user.id);
  const totalApplied = userApps.length;
  const shortlisted = userApps.filter(a => ['Shortlisted', 'Interview Scheduled', 'Offer Extended', 'Hired'].includes(a.stage)).length;
  const interviews = userApps.filter(a => a.stage === 'Interview Scheduled').length;
  
  // Calculate candidate's quiz average
  const userQuizzes = quizLeaderboard.filter(q => q.candidateId === user.id);
  const avgQuizScore = userQuizzes.length > 0
    ? Math.round(userQuizzes.reduce((acc, curr) => acc + curr.percentage, 0) / userQuizzes.length)
    : null;

  // Calculate dynamic AVG MATCH & QUIZ SCORE (Default 0% for new candidate)
  let displayScore = 0;
  let scoreSubtitle = 'Take quiz or ATS check to calculate';

  if (avgQuizScore !== null && atsScore !== null) {
    displayScore = Math.round((avgQuizScore + atsScore) / 2);
    scoreSubtitle = `Combined Quiz (${avgQuizScore}%) & ATS (${atsScore}%)`;
  } else if (avgQuizScore !== null) {
    displayScore = avgQuizScore;
    scoreSubtitle = `Based on ${userQuizzes.length} completed ${userQuizzes.length === 1 ? 'quiz' : 'quizzes'}`;
  } else if (atsScore !== null) {
    displayScore = atsScore;
    scoreSubtitle = `Based on AI Resume ATS check`;
  }

  const metrics = [
    {
      title: 'Total Applications',
      value: totalApplied,
      subtitle: 'Active applications',
      icon: Briefcase,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Shortlisted',
      value: shortlisted,
      subtitle: 'Passed ATS screening',
      icon: CheckCircle,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Interviews Scheduled',
      value: interviews,
      subtitle: 'Calendar synced',
      icon: Calendar,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    },
    {
      title: 'Avg Match & Quiz Score',
      value: `${displayScore}%`,
      subtitle: scoreSubtitle,
      icon: Award,
      color: 'bg-brand-500/10 text-brand-600 dark:text-red-400 border-brand-200 dark:border-red-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{m.title}</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 group-hover:scale-105 transition-transform origin-left">
                  {m.value}
                </h3>
              </div>
              <div className={`p-3 rounded-2xl border ${m.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>{m.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
