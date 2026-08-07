'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Filter, Sparkles, X, MapPin, DollarSign, Briefcase, RotateCcw, Clock } from 'lucide-react';

export const JobFilter: React.FC = () => {
  const { 
    searchQuery, setSearchQuery,
    selectedSkills, setSelectedSkills,
    selectedLocations, setSelectedLocations,
    selectedExpLevels, setSelectedExpLevels,
    selectedJobTypes, setSelectedJobTypes,
    resetAllFilters
  } = useApp();

  const expLevels = ['Fresher (0 yrs)', '1-2 Years', '3-5 Years', '5+ Years'];
  const locations = ['Dhaka, Bangladesh', 'Chittagong, Bangladesh', 'Sylhet, Bangladesh', 'Rajshahi, Bangladesh', 'Khulna, Bangladesh', 'Remote (BD)'];
  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Hybrid'];
  const topSkills = ['React', 'Python', 'Node.js', 'TypeScript', 'SQL', 'DevOps', 'JavaScript', 'Java', 'Go', 'Rust', 'PHP', 'Flutter', 'React Native', 'AWS', 'Kubernetes', 'Docker', 'PostgreSQL', 'MongoDB', 'Angular', 'Vue.js', 'Django', 'FastAPI'];

  const toggleItem = (list: string[], item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const hasActiveFilters = searchQuery !== '' || selectedSkills.length > 0 || selectedLocations.length > 0 || selectedExpLevels.length > 0 || selectedJobTypes.length > 0;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600 dark:text-red-400" /> Multi-Option Job Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search job title, company, or keywords..."
          className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* FILTER SECTION 1: Locations (Multi-select Checkboxes) */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Locations (BD)
        </label>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {locations.map(loc => {
            const isChecked = selectedLocations.includes(loc);
            return (
              <label key={loc} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(selectedLocations, loc, setSelectedLocations)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>{loc}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* FILTER SECTION 2: Experience Levels */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Experience Level
        </label>
        <div className="space-y-1.5">
          {expLevels.map(exp => {
            const isChecked = selectedExpLevels.includes(exp);
            return (
              <label key={exp} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(selectedExpLevels, exp, setSelectedExpLevels)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>{exp}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* FILTER SECTION 3: Job Types */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-purple-500" /> Job Type
        </label>
        <div className="flex items-center gap-1.5 flex-wrap">
          {jobTypes.map(type => {
            const isChecked = selectedJobTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleItem(selectedJobTypes, type, setSelectedJobTypes)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  isChecked
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER SECTION 4: Skills (Multi-select Pill Tags) */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tech Stack Skills
        </label>
        <div className="flex items-center gap-1.5 flex-wrap max-h-56 overflow-y-auto pr-1">
          {topSkills.map(skill => {
            const isChecked = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleItem(selectedSkills, skill, setSelectedSkills)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  isChecked
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
