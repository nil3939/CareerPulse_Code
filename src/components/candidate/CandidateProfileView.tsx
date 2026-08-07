'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import {
  User, Mail, Phone, MapPin, FileText, Code2, Github, Linkedin,
  Award, Edit3, Save, X, Briefcase, GraduationCap, CheckCircle2, FileCheck, UploadCloud
} from 'lucide-react';

export const CandidateProfileView: React.FC = () => {
  const { authUser, updateUserProfile } = useAuth();
  const user = authUser || mockUsers.candidate;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editAddress, setEditAddress] = useState(user.address || '');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editSkills, setEditSkills] = useState(user.skills?.join(', ') || '');
  const [editExpLevel, setEditExpLevel] = useState(user.expLevel || '3-5 Years');
  const [editGithub, setEditGithub] = useState(user.githubUrl || '');
  const [editLinkedin, setEditLinkedin] = useState(user.linkedinUrl || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUserProfile({
      name: editName,
      phone: editPhone,
      address: editAddress,
      bio: editBio,
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
      expLevel: editExpLevel,
      githubUrl: editGithub,
      linkedinUrl: editLinkedin,
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
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-brand-100 text-brand-700 dark:bg-red-950 dark:text-red-300 border border-brand-200 dark:border-red-800 uppercase">
                Candidate
              </span>
              {saved && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3 h-3" /> Profile Saved & Persisted!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {user.skills?.slice(0, 5).map(skill => (
                <span key={skill} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isEditing ? <><Save className="w-4 h-4" /> Save Profile</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Personal Info */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-brand-500" /> Personal Information
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              {isEditing ? (
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><User className="w-3.5 h-3.5 text-slate-400" /> {user.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</label>
              {isEditing ? (
                <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</label>
              {isEditing ? (
                <input value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {user.address || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bio</label>
              {isEditing ? (
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none" />
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{user.bio || 'No bio provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Professional Info */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" /> Professional Details
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience Level</label>
              {isEditing ? (
                <select value={editExpLevel} onChange={e => setEditExpLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none">
                  <option value="Fresher (0 yrs)">Fresher (0 yrs)</option>
                  <option value="1-2 Years">1-2 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-slate-400" /> {user.expLevel || '3-5 Years'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills (comma-separated)</label>
              {isEditing ? (
                <input value={editSkills} onChange={e => setEditSkills(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(user.skills || []).map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-red-950/40 dark:text-red-300 border border-brand-200 dark:border-red-800">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GitHub URL</label>
              {isEditing ? (
                <input value={editGithub} onChange={e => setEditGithub(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Github className="w-3.5 h-3.5 text-slate-400" /> {user.githubUrl || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LinkedIn URL</label>
              {isEditing ? (
                <input value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none" />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Linkedin className="w-3.5 h-3.5 text-slate-400" /> {user.linkedinUrl || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* REQUIREMENT 8: RESUME DOCUMENT PDF/DOC FILE PREVIEW CARD */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-500" /> Uploaded Resume Document (PDF / DOC)
        </h3>

        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-md">
              PDF
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                resume_{user.name.toLowerCase().replace(/\s+/g, '_')}.pdf
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Verified & Parsed
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Attached Document • PDF / DOC Format • Ready for ATS Matcher
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Parsed Resume Content Summary</span>
          <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-sans text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
            {user.resumeText || 'Candidate Resume Document Attached & Verified'}
          </pre>
        </div>
      </div>

    </div>
  );
};
