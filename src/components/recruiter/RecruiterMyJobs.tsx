'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import { Job, Application } from '@/types';
import { 
  Building2, MapPin, DollarSign, Edit3, Trash2, Users, X, CheckCircle2, 
  PlusCircle, Sparkles, Eye, FileText, ChevronRight, AlertCircle, Save
} from 'lucide-react';

export const RecruiterMyJobs: React.FC = () => {
  const { jobs, updateJob, deleteJob, applications, updateApplicationStage } = useApp();
  const { authUser } = useAuth();
  const user = authUser || mockUsers.recruiter;

  const recruiterJobs = jobs.filter(j => j.recruiterId === user.id || j.company === user.companyName || j.company === user.officeName);

  // Edit Job State
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSkills, setEditSkills] = useState('');

  // Applicants Modal State
  const [viewingApplicantsJob, setViewingApplicantsJob] = useState<Job | null>(null);

  const handleStartEdit = (job: Job) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditSalary(job.salaryRange);
    setEditLocation(job.location);
    setEditDesc(job.description);
    setEditSkills(job.skillsRequired.join(', '));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    updateJob(editingJob.id, {
      title: editTitle,
      salaryRange: editSalary,
      location: editLocation,
      description: editDesc,
      skillsRequired: editSkills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setEditingJob(null);
  };

  const handleDelete = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      deleteJob(jobId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            My Posted Job Openings ({recruiterJobs.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your company job listings, edit details, delete posts, and inspect applicant profiles.
          </p>
        </div>
      </div>

      {/* Jobs Grid */}
      {recruiterJobs.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
          <Building2 className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No jobs posted yet.</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">Use the "Post New Job" button to publish job openings for Bangladeshi candidates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recruiterJobs.map(job => {
            const jobApps = applications.filter(a => a.jobId === job.id);

            return (
              <div
                key={job.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-black text-base text-slate-900 dark:text-white leading-snug">{job.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {job.company}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${job.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'}`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {job.salaryRange}</span>
                    <span>• {job.type}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {job.skillsRequired.map(skill => (
                      <span key={skill} className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewingApplicantsJob(job)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" /> Applicants ({jobApps.length})
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStartEdit(job)}
                      className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Job"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-500" /> Edit Job Opening
              </h4>
              <button onClick={() => setEditingJob(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Title</label>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Salary Range</label>
                  <input value={editSalary} onChange={e => setEditSalary(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location</label>
                  <input value={editLocation} onChange={e => setEditLocation(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Skills (comma-separated)</label>
                <input value={editSkills} onChange={e => setEditSkills(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none" />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Applicants Modal */}
      {viewingApplicantsJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" /> Applicants for {viewingApplicantsJob.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{viewingApplicantsJob.company} • {viewingApplicantsJob.location}</p>
              </div>
              <button onClick={() => setViewingApplicantsJob(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {applications.filter(a => a.jobId === viewingApplicantsJob.id).length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-bold">No candidates have applied for this position yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.filter(a => a.jobId === viewingApplicantsJob.id).map(app => (
                  <div key={app.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img src={app.candidateAvatar} alt={app.candidateName} className="w-11 h-11 rounded-xl object-cover" />
                      <div>
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">{app.candidateName}</h5>
                        <p className="text-xs text-slate-400">{app.candidateEmail} • {app.candidatePhone || 'No phone'}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            ATS: {app.atsMatchScore}%
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            Quiz: {app.quizScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={app.stage}
                        onChange={e => updateApplicationStage(app.id, e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Screening">Screening</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Offer Extended">Offer Extended</option>
                        <option value="Hired">Hired 🎉</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
