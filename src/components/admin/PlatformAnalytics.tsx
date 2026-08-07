'use client';

import React from 'react';
import { BarChart2, TrendingUp, Cpu, Server, Lock, Globe } from 'lucide-react';

export const PlatformAnalytics: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-purple-500" />
          Platform Traffic Trends & System Health Settings
        </h3>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> All Systems Operational
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Server className="w-3.5 h-3.5" /> API Server Latency
            </span>
            <span className="font-mono text-emerald-500 font-bold">18ms avg</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[25%]" />
          </div>
          <p className="text-[10px] text-slate-400">Next.js API routes & database connection pool optimal</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> AI Engine Processing
            </span>
            <span className="font-mono text-blue-500 font-bold">99.9% success</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[90%]" />
          </div>
          <p className="text-[10px] text-slate-400">Resume Tailor & Audio Interview inference queue active</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Security & Auth RBAC
            </span>
            <span className="font-mono text-purple-500 font-bold">Zero Violations</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[100%]" />
          </div>
          <p className="text-[10px] text-slate-400">JWT Token verification & role policies enforced</p>
        </div>

      </div>
    </div>
  );
};
