'use client';

import React, { useState, useRef } from 'react';
import { analyzeResumeWithAI } from '@/services/geminiService';
import { AIResumeAnalysis } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  Upload, FileText, Sparkles, CheckCircle2, XCircle, ChevronRight, 
  BookOpen, Youtube, DollarSign, ExternalLink, Loader2, TrendingUp,
  Target, AlertCircle, Zap, Brain
} from 'lucide-react';

interface JobContext {
  title: string;
  description: string;
  skills: string[];
}

interface AIResumeCheckerProps {
  defaultJob?: JobContext;
}

export const AIResumeChecker: React.FC<AIResumeCheckerProps> = ({ defaultJob }) => {
  const { authUser } = useAuth();
  const [resumeText, setResumeText] = useState(authUser?.resumeText || '');
  const [jobTitle, setJobTitle] = useState(defaultJob?.title || '');
  const [jobDescription, setJobDescription] = useState(defaultJob?.description || '');
  const [jobSkills, setJobSkills] = useState(defaultJob?.skills?.join(', ') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResumeAnalysis | null>(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      // For PDF/DOC: in production use pdf-parse or mammoth.js
      // For demo, we use the raw text or fallback
      setResumeText(text || authUser?.resumeText || 'Resume content from uploaded file...');
    };
    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // For PDF/DOC files in demo mode, use authUser's resumeText
      setResumeText(authUser?.resumeText || `Uploaded resume: ${file.name}. (In production, PDF/DOC parsing will extract full text using pdf-parse or mammoth.js.)`);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) { setError('Please paste your resume text or upload a file.'); return; }
    if (!jobTitle.trim()) { setError('Please enter a target job title.'); return; }
    setError(''); setLoading(true); setResult(null);
    try {
      const skills = jobSkills.split(',').map(s => s.trim()).filter(Boolean);
      const analysis = await analyzeResumeWithAI(resumeText, jobDescription || jobTitle, skills.length > 0 ? skills : ['JavaScript', 'React', 'Node.js']);
      setResult(analysis);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    }
    setLoading(false);
  };

  const scoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const scoreBg = (score: number) => {
    if (score >= 85) return 'from-emerald-500 to-teal-500';
    if (score >= 70) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const categoryIcon = (cat: string) => {
    if (cat.includes('YouTube')) return <Youtube className="w-3.5 h-3.5 text-red-500" />;
    if (cat.includes('Paid')) return <DollarSign className="w-3.5 h-3.5 text-amber-500" />;
    if (cat.includes('Official')) return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-red-500/20">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            AI Resume Checker <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">Gemini Powered</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Upload or paste your resume. Get ATS score, skill gap analysis, and personalized course suggestions.</p>
        </div>
      </div>

      {!result ? (
        <div className="grid md:grid-cols-2 gap-5">
          {/* Left: Resume Input */}
          <div className="space-y-4">
            {/* File Upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 dark:hover:border-red-500 transition-all group bg-slate-50 dark:bg-slate-800/50"
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileUpload} />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-brand-500 dark:group-hover:text-red-400 transition-colors" />
              {fileName ? (
                <div>
                  <p className="text-sm font-bold text-brand-600 dark:text-red-400">{fileName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">File loaded! Adjust text below if needed.</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Drop your Resume here</p>
                  <p className="text-xs text-slate-400 mt-0.5">PDF, DOC, DOCX, TXT supported</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Resume Text (paste or auto-filled from profile)</label>
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                rows={8}
                placeholder="Paste your resume content here, or upload a file above..."
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>

          {/* Right: Job Context */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-brand-600" /> Target Job Title *</label>
              <input
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack React Engineer"
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Job Description (optional — improves accuracy)</label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste the job description to get the most accurate ATS score match..."
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 placeholder:text-slate-400 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Required Skills (comma-separated)</label>
              <input
                value={jobSkills}
                onChange={e => setJobSkills(e.target.value)}
                placeholder="React, TypeScript, Node.js, PostgreSQL, Docker"
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 placeholder:text-slate-400"
              />
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white font-black text-sm shadow-lg shadow-red-500/20 flex items-center justify-center gap-2.5 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Gemini AI Analyzing Resume...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Analyze with Gemini AI</>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results Panel */
        <div className="space-y-5">
          {/* ATS Score Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 border border-slate-700 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-red-500/10" />
            <div className="relative flex items-center gap-6">
              {/* Circular Score */}
              <div className="relative flex-shrink-0">
                <svg className="w-28 h-28" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.atsScore / 100)}`}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={result.atsScore >= 85 ? '#10b981' : result.atsScore >= 70 ? '#f59e0b' : '#ef4444'} />
                      <stop offset="100%" stopColor={result.atsScore >= 85 ? '#14b8a6' : result.atsScore >= 70 ? '#f97316' : '#ec4899'} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${scoreColor(result.atsScore)}`}>{result.atsScore}</span>
                  <span className="text-[10px] text-slate-400 font-bold">ATS SCORE</span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-1">ATS Compatibility Analysis</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{result.overallSummary}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    result.atsScore >= 85 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    result.atsScore >= 70 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {result.atsScore >= 85 ? '🟢 Strong Match' : result.atsScore >= 70 ? '🟡 Moderate Match' : '🔴 Needs Work'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Matched Skills */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h4 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Skills ({result.matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h4 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" /> Missing Skills ({result.missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                    ✗ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h4 className="font-black text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> AI Improvement Suggestions
            </h4>
            <ul className="space-y-2.5">
              {result.improvementBulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <ChevronRight className="w-4 h-4 text-brand-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Suggestions */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h4 className="font-black text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Recommended Courses to Bridge Skill Gaps
            </h4>
            <div className="space-y-3">
              {result.courseSuggestions.map((course, i) => (
                <a
                  key={i}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-red-800 hover:bg-brand-50/50 dark:hover:bg-red-950/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {categoryIcon(course.category)}
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-red-400 transition-colors">{course.title}</p>
                      <p className="text-xs text-slate-400">{course.category}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-red-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Re-analyze button */}
          <button
            onClick={() => setResult(null)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-red-400 transition-all"
          >
            ↩ Analyze a Different Resume or Job
          </button>
        </div>
      )}
    </div>
  );
};
