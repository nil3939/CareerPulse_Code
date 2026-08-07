'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Building2, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export const CompanyVerificationTable: React.FC = () => {
  const { verifyRecruiterCompany } = useApp();

  const [recruiters, setRecruiters] = useState([
    { id: 'rec_1', name: 'Priya Mehta', company: 'TechInnovators India', location: 'Bengaluru', status: 'verified', domain: 'techinnovators.in' },
    { id: 'rec_2', name: 'Vikramaditya Roy', company: 'Nexus AI Labs', location: 'Hyderabad', status: 'pending', domain: 'nexusai.io' },
    { id: 'rec_3', name: 'Neha Sharma', company: 'Creata UI Studio', location: 'Mumbai', status: 'pending', domain: 'creataui.com' },
  ]);

  const handleVerify = (id: string) => {
    setRecruiters(prev => prev.map(r => r.id === id ? { ...r, status: 'verified' } : r));
    verifyRecruiterCompany(id);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-500" />
          Verify Recruiter Companies & Badges
        </h3>
        <span className="text-xs font-semibold text-slate-400">Admin Audit Queue</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-3">Company & Recruiter</th>
              <th className="py-2.5 px-3">Domain</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3 text-right">Badge Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {recruiters.map(rec => (
              <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {rec.company}
                    {rec.status === 'verified' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />}
                  </div>
                  <div className="text-[11px] text-slate-400">{rec.name}</div>
                </td>

                <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                  {rec.domain}
                </td>

                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                  {rec.location}
                </td>

                <td className="py-3 px-3 text-right">
                  {rec.status === 'verified' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      ✓ Verified Badge Active
                    </span>
                  ) : (
                    <button
                      onClick={() => handleVerify(rec.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm"
                    >
                      Issue Verified Badge
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
