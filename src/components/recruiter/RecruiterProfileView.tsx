'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import {
  User, Mail, Building2, MapPin, Globe, Shield,
  Edit3, Save, CheckCircle2, Briefcase, ExternalLink
} from 'lucide-react';

export const RecruiterProfileView: React.FC = () => {
  const { authUser, updateUserProfile } = useAuth();
  const user = authUser || mockUsers.recruiter;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editOfficeName, setEditOfficeName] = useState(user.officeName || user.companyName || '');
  const [editOfficeAddress, setEditOfficeAddress] = useState(user.officeAddress || '');
  const [editWebsite, setEditWebsite] = useState(user.websiteUrl || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUserProfile({
      name: editName,
      officeName: editOfficeName,
      companyName: editOfficeName,
      officeAddress: editOfficeAddress,
      websiteUrl: editWebsite,
    });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">

      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-lg"
            />
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
                Recruiter
              </span>
              {user.isVerified && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Verified Employer
                </span>
              )}
              {saved && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3 h-3" /> Profile Saved & Persisted!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> {user.officeName || user.companyName || 'Company not set'}
            </p>
          </div>

          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              isEditing
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isEditing ? <><Save className="w-4 h-4" /> Save Profile</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
          </button>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Info */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> Recruiter Information
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              {isEditing ? (
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><User className="w-3.5 h-3.5 text-slate-400" /> {user.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}</p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-500" /> Company & Office Details
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Office / Company Name</label>
              {isEditing ? (
                <input value={editOfficeName} onChange={e => setEditOfficeName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-slate-400" /> {user.officeName || user.companyName || 'Not set'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Office Address</label>
              {isEditing ? (
                <input value={editOfficeAddress} onChange={e => setEditOfficeAddress(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {user.officeAddress || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website URL</label>
              {isEditing ? (
                <input value={editWebsite} onChange={e => setEditWebsite(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {user.websiteUrl ? (
                    <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      {user.websiteUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : 'Not provided'}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Status</label>
              <p className="text-sm font-semibold flex items-center gap-2">
                {user.isVerified ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><Shield className="w-4 h-4" /> Verified Employer ✓</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5"><Shield className="w-4 h-4" /> Pending Verification</span>
                )}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
