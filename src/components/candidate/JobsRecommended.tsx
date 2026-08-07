'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import { Sparkles, Building2, MapPin, DollarSign, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const JobsRecommended: React.FC = () => {
  const { jobs, currentUser, submitNewApplication, applications } = useApp();
  const { authUser } = useAuth();

  const user = authUser || currentUser || mockUsers.candidate;

  const candidateSkills = user.skills || ['React', 'Next.js', 'TypeScript', 'Node.js'];

  // Calculate AI match score for each job
  const recommendedJobs = jobs.map(job => {
    const matched = job.skillsRequired.filter(s => candidateSkills.includes(s)).length;
    const matchScore = job.skillsRequired.length > 0
      ? Math.round((matched / job.skillsRequired.length) * 100)
      : 80;
    return { ...job, matchScore };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-red-400" />
            Jobs Recommended For You
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            AI skill-matched based on your tags: {candidateSkills.join(', ')}
          </p>
        </div>
        <Link href="/jobs" className="text-xs font-bold text-brand-600 dark:text-red-400 hover:underline flex items-center gap-1">
          View All Jobs <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {recommendedJobs.slice(0, 3).map(job => {
          const hasApplied = applications.some(a => a.jobId === job.id && a.candidateId === user.id);

          return (
            <div
              key={job.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{job.title}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {job.matchScore}% Match
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap gap-y-1">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {job.salaryRange}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {job.skillsRequired.map(skill => (
                      <span
                        key={skill}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                          candidateSkills.includes(skill)
                            ? 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-2">
                {hasApplied ? (
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => submitNewApplication(job.id, 'I am excited to submit my tailored resume and application for this position.')}
                    className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    1-Click Apply
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
