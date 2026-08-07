'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import { ExperienceFilter } from '@/types';
import { PlusCircle, X, Sparkles, Building2, MapPin, DollarSign } from 'lucide-react';

interface JobPostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JobPostFormModal: React.FC<JobPostFormModalProps> = ({ isOpen, onClose }) => {
  const { addJob, currentUser } = useApp();
  const { authUser } = useAuth();
  const user = authUser || currentUser || mockUsers.recruiter;

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(user.companyName || user.officeName || 'TechVenture Bangladesh Ltd.');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [type, setType] = useState<'Full-time' | 'Part-time' | 'Remote' | 'Contract' | 'Hybrid'>('Full-time');
  const [salaryRange, setSalaryRange] = useState('৳80,000 - ৳1,20,000/month');
  const [expRequired, setExpRequired] = useState<'Fresher (0 yrs)' | '1-2 Years' | '3-5 Years' | '5+ Years'>('3-5 Years');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('React, Next.js, Node.js, TypeScript');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsRequired = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    
    addJob({
      recruiterId: user.id,
      title,
      company,
      companyLogo: user.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      location,
      type,
      salaryRange,
      expRequired,
      description,
      requirements: [
        `3+ years experience with ${skillsRequired.slice(0, 2).join(', ')}`,
        'Strong backend experience with database optimization',
        'Familiarity with REST APIs and WebSockets'
      ],
      skillsRequired,
      status: 'active',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-brand-600 dark:text-red-400" />
              Post New Tech Job Opening
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Recruiter: <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span> ({company})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Job Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Job Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer (React & Node)"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-500" /> Company *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Exp */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Exp Level</label>
              <select
                value={expRequired}
                onChange={e => setExpRequired(e.target.value as any)}
                className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Fresher (0 yrs)">Fresher (0 yrs)</option>
                <option value="1-2 Years">1-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            {/* Salary */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Salary Range</label>
              <input
                type="text"
                required
                value={salaryRange}
                onChange={e => setSalaryRange(e.target.value)}
                className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Primary Tech Skills (comma-separated) *
            </label>
            <input
              type="text"
              required
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Job Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the role responsibilities, team structure, and project goals..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" /> Publish Job Opening
          </button>
        </form>

      </div>
    </div>
  );
};
