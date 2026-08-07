'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Trophy, Medal, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const QuizLeaderboard: React.FC = () => {
  const { quizLeaderboard } = useApp();

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Global 50-MCQ Skill Quiz Leaderboard
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Top ranked candidates scored on timed 50-multiple-choice skill assessments.
          </p>
        </div>
        <Link
          href="/quiz"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-transform hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5" /> Take 50-MCQ Assessment
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Assessed Skill</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Accuracy</th>
              <th className="py-3 px-4 text-right">Verified Badge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {quizLeaderboard.map((sub, idx) => {
              const rank = idx + 1;
              return (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-black">
                    {rank === 1 ? (
                      <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                        <Trophy className="w-4 h-4 fill-amber-500" /> #1
                      </span>
                    ) : rank === 2 ? (
                      <span className="flex items-center gap-1 text-slate-400 font-bold">
                        <Medal className="w-4 h-4 text-slate-400" /> #2
                      </span>
                    ) : rank === 3 ? (
                      <span className="flex items-center gap-1 text-amber-700 font-bold">
                        <Award className="w-4 h-4 text-amber-700" /> #3
                      </span>
                    ) : (
                      <span className="text-slate-500 pl-2">#{rank}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={sub.candidateAvatar}
                        alt={sub.candidateName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{sub.candidateName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {sub.skill}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {sub.score} / {sub.total}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {sub.percentage}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
