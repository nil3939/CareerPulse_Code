'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Users, Briefcase, CheckCircle2, ShieldAlert, TrendingUp, Sparkles, Building2, BarChart2, Check, X, Clock, MapPin, DollarSign } from 'lucide-react';
import { CompanyVerificationTable } from './CompanyVerificationTable';
import { ContentModeration } from './ContentModeration';
import { PlatformAnalytics } from './PlatformAnalytics';

export const AdminOverview: React.FC = () => {
  const { jobs, approveJob, rejectJob, applications, flaggedPosts } = useApp();

  const totalUsers = 52400;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const pendingVerifications = 3;
  const pendingFlagged = flaggedPosts.filter(f => f.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Users</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">52,400</h3>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +14% growth this month
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Approved Jobs</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeJobs}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Across 5,200+ verified companies
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Job Approvals</p>
              <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingJobs.length}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Requires Admin Review
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Flagged Posts</p>
              <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{pendingFlagged}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Content Safety queue
          </div>
        </div>

      </div>

      {/* REQUIREMENT 4: REAL-TIME RECRUITER JOB POST APPROVAL SECTION */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Recruiter Job Post Approvals ({pendingJobs.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review job postings submitted by recruiters. Approve to publish live on CareerPulse or reject.
            </p>
          </div>
        </div>

        {pendingJobs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
            No pending job posts awaiting approval. All recruiter posts are up to date!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingJobs.map(job => (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-base text-slate-900 dark:text-white">{job.title}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Pending Admin Review
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400 flex-wrap gap-y-1">
                    <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-blue-500" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" /> {job.salaryRange}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => approveJob(job.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Approve & Publish
                  </button>

                  <button
                    onClick={() => rejectJob(job.id)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Reject / Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CompanyVerificationTable />
      <ContentModeration />
      <PlatformAnalytics />

    </div>
  );
};
