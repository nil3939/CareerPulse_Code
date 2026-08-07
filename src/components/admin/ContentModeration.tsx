'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ContentModeration: React.FC = () => {
  const { flaggedPosts, resolveFlaggedPost } = useApp();

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          Content Moderation & Flagged Job Audits
        </h3>
        <span className="text-xs font-semibold text-slate-400">Spam Shield</span>
      </div>

      <div className="space-y-3">
        {flaggedPosts.map(post => (
          <div
            key={post.id}
            className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> {post.jobTitle}
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Reason: <span className="font-semibold text-rose-700 dark:text-rose-400">{post.reason}</span> (Reported by {post.reportedBy})
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {post.status === 'removed' ? (
                <span className="px-3 py-1 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  Removed
                </span>
              ) : post.status === 'reviewed' ? (
                <span className="px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Approved
                </span>
              ) : (
                <>
                  <button
                    onClick={() => resolveFlaggedPost(post.id, 'reviewed')}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Keep Post
                  </button>
                  <button
                    onClick={() => resolveFlaggedPost(post.id, 'removed')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
