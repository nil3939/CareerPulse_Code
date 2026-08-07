'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatDrawer } from '@/components/messaging/ChatDrawer';
import { JobFilter } from '@/components/jobs/JobFilter';
import { JobCard } from '@/components/jobs/JobCard';
import { useApp } from '@/context/AppContext';
import { Briefcase, Sparkles, Filter } from 'lucide-react';

export default function JobsPage() {
  const { 
    jobs, searchQuery, 
    selectedSkills, selectedLocations, selectedExpLevels, selectedJobTypes, resetAllFilters 
  } = useApp();
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply multi-option sidebar filtering logic
  const filteredJobs = jobs.filter(job => {
    // Only show active approved jobs to candidates
    if (job.status && job.status !== 'active') return false;
    // 1. Search Query
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Locations (Multi-select)
    const matchesLocation = selectedLocations.length === 0 || 
      selectedLocations.some(loc => job.location.includes(loc.split(',')[0]));

    // 3. Experience Levels (Multi-select)
    const matchesExp = selectedExpLevels.length === 0 || 
      selectedExpLevels.includes(job.expRequired);

    // 4. Job Types (Multi-select)
    const matchesType = selectedJobTypes.length === 0 || 
      selectedJobTypes.includes(job.type);

    // 5. Skills (Multi-select)
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => job.skillsRequired.includes(skill));

    return matchesSearch && matchesLocation && matchesExp && matchesType && matchesSkills;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onOpenChat={() => setChatOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> AI Multi-Filter Tech Job Search (Bangladesh)
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Explore Tech Opportunities in Bangladesh
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Filter by locations, experience level, job types, and primary tech stack skills.
            </p>
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-xs"
          >
            <Filter className="w-4 h-4 text-brand-500" /> Multi-Filters
          </button>
        </div>

        {/* Layout: Sidebar Filter + Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Sidebar Filter (Col-span-4) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-20">
            <JobFilter />
          </div>

          {/* Mobile Filter Toggle Overlay */}
          {mobileFilterOpen && (
            <div className="lg:hidden col-span-1">
              <JobFilter />
            </div>
          )}

          {/* Main Content Jobs Grid (Col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Results Header */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-brand-500" />
                Showing {filteredJobs.length} Active Openings
              </h2>
              {jobs.length !== filteredJobs.length && (
                <span className="text-[11px] font-bold text-slate-400">
                  (Filtered from {jobs.length} total)
                </span>
              )}
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
                  <Briefcase className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No jobs match your selected multi-filters.</p>
                  <p className="text-xs text-slate-500">Try checking more skills or resetting location filters.</p>
                  <button
                    onClick={resetAllFilters}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))
              )}
            </div>

          </div>

        </div>

      </main>

      <Footer />
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
