'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Shield, Globe, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-red-500/20">
                C
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Career<span className="bg-gradient-to-r from-brand-600 to-red-500 bg-clip-text text-transparent">Pulse</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bangladesh's #1 AI-Powered Modern Job Platform. Empowering candidates with Gemini AI resume scoring, ATS optimization, voice interview prep, and connecting recruiters with top tech talent.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> ISO Verified</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-blue-500" /> Bangladesh Tech Hub</span>
            </div>
          </div>

          {/* Col 2: Candidates */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              For Job Seekers
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/jobs" className="hover:text-brand-600 dark:hover:text-red-400">AI Job Recommendation</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-red-400">AI Resume & ATS Checker</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-red-400">Voice & Video Mock Interviewer</Link></li>
              <li><Link href="/quiz" className="hover:text-brand-600 dark:hover:text-red-400">50-MCQ Skill Assessments</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-red-400">Learning & Course Suggestions</Link></li>
            </ul>
          </div>

          {/* Col 3: Recruiters */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              For Recruiters & Employers
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-red-400">Kanban Candidate Pipeline</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-red-400">GitHub Profile Summarizer</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-red-400">Automated Hired Email Triggers</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-red-400">Dual ATS & Quiz Score Metrics</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-red-400">Company Verification Badge</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform Stats */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform Metrics
            </h4>
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <span className="text-xs text-slate-500">Active Listings</span>
                <span className="text-xs font-black text-brand-600 dark:text-red-400">10,480+</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <span className="text-xs text-slate-500">Verified BD Companies</span>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">5,200+</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <span className="text-xs text-slate-500">Placed Candidates</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">52,100+</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CareerPulse Bangladesh Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
