'use client';

import React, { useState } from 'react';
import { Job } from '@/types';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { mockUsers } from '@/data/mockData';
import { 
  Building2, MapPin, DollarSign, Clock, Sparkles, 
  Bookmark, BookmarkCheck, CheckCircle2, ChevronDown, ChevronUp, UserCheck, Lock, LogIn
} from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { currentUser, submitNewApplication, applications, savedJobIds, toggleSaveJob } = useApp();
  const { isAuthenticated, role, authUser } = useAuth();
  const user = authUser || currentUser || mockUsers.candidate;

  const [expanded, setExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const candidateSkills = user.skills || ['React', 'Next.js', 'TypeScript'];
  const matched = job.skillsRequired.filter(s => candidateSkills.includes(s)).length;
  const matchScore = job.skillsRequired.length > 0 ? Math.round((matched / job.skillsRequired.length) * 100) : 80;

  const hasApplied = applications.some(a => a.jobId === job.id && a.candidateId === user.id);
  const isSaved = savedJobIds.includes(job.id);

  const handleApply = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    submitNewApplication(job.id, 'I am excited to apply for this role via CareerPulse.');
  };

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4">
        
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                {job.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> {job.company}
              </p>
            </div>
          </div>

          {role === 'candidate' && (
            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                  : 'text-slate-400 hover:text-slate-600 border-slate-200 dark:border-slate-800'
              }`}
              title={isSaved ? 'Job Saved' : 'Save Job'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Badges Row */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" /> {matchScore}% AI Match
          </span>

          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
          </span>

          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1 font-bold">
            <DollarSign className="w-3.5 h-3.5 text-blue-500" /> {job.salaryRange}
          </span>
        </div>

        {/* Skills Required */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {job.skillsRequired.map(skill => (
            <span
              key={skill}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                candidateSkills.includes(skill)
                  ? 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Expanded Description */}
        {expanded && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-300 animate-in fade-in">
            <p className="leading-relaxed">{job.description}</p>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Key Requirements:</h4>
              <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer Action Controls */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
          >
            {expanded ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> View Details</>}
          </button>

          {/* REQUIREMENT 2: IF NOT SIGNED IN -> TRIGGER AUTH MODAL */}
          {!isAuthenticated ? (
            <button
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-transform hover:scale-105 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In to Apply
            </button>
          ) : role === 'candidate' ? (
            hasApplied ? (
              <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Applied
              </span>
            ) : (
              <button
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-transform hover:scale-105"
              >
                Apply Now
              </button>
            )
          ) : (
            <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> {role === 'recruiter' ? 'Recruiter View' : 'Admin View'}
            </span>
          )}
        </div>

      </div>
    </>
  );
};
