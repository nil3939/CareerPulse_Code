'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import { Job, Application } from '@/types';
import { 
  Briefcase, Clock, Building2, CheckCircle2, Sparkles, AlertCircle, FileText, 
  ChevronRight, Eye, X, MapPin, DollarSign, Tag 
} from 'lucide-react';
import Link from 'next/link';

export const CandidateAppliedJobs: React.FC = () => {
  const { applications, jobs } = useApp();
  const { authUser } = useAuth();
  const user = authUser || mockUsers.candidate;

  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);

  const userApps = applications.filter(a => a.candidateId === user.id);

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'Applied':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      case 'Screening':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Offer Extended':
        return 'bg-brand-100 text-brand-700 dark:bg-red-950 dark:text-red-300 border-brand-200 dark:border-red-800';
      case 'Hired':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-bold';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleOpenJobDetails = (jobId: string) => {
    const found = jobs.find(j => j.id === jobId);
    if (found) setSelectedJobForModal(found);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-600 dark:text-red-400" />
            My Applied Jobs ({userApps.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track your application stages (*Applied, Interview, Hired, Rejected*) and inspect original job post details.
          </p>
        </div>
        <Link href="/jobs" className="text-xs font-bold text-brand-600 dark:text-red-400 hover:underline flex items-center gap-1">
          Explore Openings <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {userApps.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <Briefcase className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">You haven't applied to any jobs yet.</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">Explore active tech openings in Bangladesh and submit 1-click applications.</p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md"
          >
            Browse Jobs Now
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {userApps.map(app => (
            <div
              key={app.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-black text-base text-slate-900 dark:text-white">{app.jobTitle}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStageBadge(app.stage)}`}>
                    {app.stage === 'Hired' ? '🎉 Hired' : app.stage}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-y-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Building2 className="w-3.5 h-3.5" /> {app.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Applied on {app.appliedAt}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> ATS Match: {app.atsMatchScore}%
                  </span>
                </div>

                {app.coverLetter && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-1">
                    "{app.coverLetter}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenJobDetails(app.jobId)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-500" /> Job Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* JOB DETAILS MODAL FOR CANDIDATE */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-start space-x-3">
                <img
                  src={selectedJobForModal.companyLogo}
                  alt={selectedJobForModal.company}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">
                    {selectedJobForModal.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {selectedJobForModal.company}
                  </p>
                </div>
              </div>

              <button onClick={() => setSelectedJobForModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedJobForModal.location}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1 font-bold">
                <DollarSign className="w-3.5 h-3.5 text-blue-500" /> {selectedJobForModal.salaryRange}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                {selectedJobForModal.type} • {selectedJobForModal.expRequired}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Required Skills</h4>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedJobForModal.skillsRequired.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 dark:bg-red-950/40 dark:text-red-300 border border-brand-200 dark:border-red-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Description</h4>
              <p>{selectedJobForModal.description}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Key Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                {selectedJobForModal.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
