'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BookOpen, ExternalLink, Star, CheckCircle, Clock, Sparkles, Youtube, FileText, Award } from 'lucide-react';
import { Course } from '@/types';

export const CourseAllocationHub: React.FC = () => {
  const { courses, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Free Courses', 'Paid Courses', 'Official Documentation', 'YouTube Courses'];

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const getCategoryBadge = (cat: Course['category']) => {
    switch (cat) {
      case 'Free Courses':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Paid Courses':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'Official Documentation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'YouTube Courses':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600 dark:text-red-400" />
            AI Career Suggestion & Course Allocation Hub
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured learning pathways automatically allocated based on your skill gap analysis.
          </p>
        </div>

        {/* Skill Gap Alert Pill */}
        <div className="px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Recommended for candidate: <b>GraphQL & Microservices</b></span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Learning Resources' : cat}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getCategoryBadge(course.category)}`}>
                  {course.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2 leading-snug">
                {course.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Provider: <span className="font-semibold text-slate-700 dark:text-slate-300">{course.provider}</span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                {course.price && <span className="font-bold text-emerald-600 dark:text-emerald-400">{course.price}</span>}
              </div>

              <a
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-brand-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 shadow-sm transition-colors"
              >
                Access Hub <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
