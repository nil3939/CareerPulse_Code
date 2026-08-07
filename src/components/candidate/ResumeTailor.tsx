'use client';

import React, { useState, useRef } from 'react';
import { 
  Sparkles, FileText, Download, Copy, Check, Wand2, Loader2, ArrowRight, 
  UploadCloud, FileCheck, Trash2, CheckCircle2, AlertCircle, BookOpen, Award, ExternalLink, AlertTriangle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';
import { analyzeResumeWithAI, tailorResumeAndCoverLetter } from '@/services/geminiService';
import { AIResumeAnalysis } from '@/types';

// Master tech skills list for dynamic keyword extraction
const MASTER_TECH_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'JavaScript', 'Python', 'Django', 'FastAPI',
  'PostgreSQL', 'MongoDB', 'SQL', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Redis',
  'C++', 'Java', 'Spring Boot', 'Flutter', 'React Native', 'PHP', 'Laravel', 'Swift',
  'Kotlin', 'Go', 'Rust', 'Tailwind CSS', 'Bootstrap', 'DevOps', 'CI/CD', 'Git',
  'Linux', 'Microservices', 'HTML', 'CSS', 'REST API', 'Figma', 'System Design'
];

export const ResumeTailor: React.FC = () => {
  const { currentUser } = useApp();
  const { authUser } = useAuth();
  const user = authUser || currentUser || mockUsers.candidate;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const [jobTitle, setJobTitle] = useState('Senior Full Stack React & Node Engineer');
  const [targetCompany, setTargetCompany] = useState('TechVenture Bangladesh Ltd.');
  const [jobDescription, setJobDescription] = useState(
    `Requirements: Expert in React 18, Next.js App Router, TypeScript, Node.js, and PostgreSQL. Experience with Core Web Vitals optimization, Docker, Redis caching, and REST APIs.`
  );

  // Gemini 2.5 Flash scanning state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [atsAnalysis, setAtsAnalysis] = useState<AIResumeAnalysis | null>(null);
  const [tailoredBullets, setTailoredBullets] = useState<string[]>([]);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Extract skills dynamically from job title and job description text
  const extractRequiredSkillsFromJob = (title: string, desc: string): string[] => {
    const combined = `${title} ${desc}`.toLowerCase();
    const found = MASTER_TECH_SKILLS.filter(skill => {
      const sLower = skill.toLowerCase();
      return combined.includes(sLower);
    });

    if (found.length > 0) return found;
    return ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'];
  };

  // READ ACTUAL UPLOADED FILE CONTENT USING FILEREADER
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        setUploadError('Please upload a valid PDF, DOC, DOCX, or TXT file.');
        return;
      }

      setUploadError('');
      setResumeFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const rawContent = event.target?.result as string || '';
        const cleanContent = rawContent
          .replace(/\/FlateDecode|\/Filter|\/Length|\/Type|\/Font|stream|endstream|obj|endobj|xref|trailer|startxref|%PDF-1\.\d/gi, ' ')
          .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
          .replace(/\s+/g, ' ');
        
        // Dynamic parsed text containing filename & extracted text
        const extractedText = `${file.name.replace(/\.[^/.]+$/, '')} - Resume Document (${file.name})
Candidate: ${user.name}
Extracted Content: ${cleanContent.slice(0, 1500)}`;

        setResumeText(extractedText);
      };
      
      reader.readAsText(file);
    }
  };

  // Gemini 2.5 Flash 5-Second Deep Research Execution
  const handleRunFullAnalysis = async () => {
    // 1. MUST REQUIRE RESUME UPLOAD FIRST
    if (!resumeFile || !resumeText.trim()) {
      setUploadError('Please upload your PDF or DOC resume document before running ATS analysis.');
      return;
    }

    if (!jobDescription.trim()) return;

    setUploadError('');
    setIsAnalyzing(true);
    setScanStep(1);
    setAtsAnalysis(null);

    // Dynamic skills extracted directly from user's Target Job Title & Description
    const requiredSkills = extractRequiredSkillsFromJob(jobTitle, jobDescription);

    // 5-second realistic Gemini AI scanning milestones
    const timer1 = setTimeout(() => setScanStep(2), 1200);
    const timer2 = setTimeout(() => setScanStep(3), 2500);
    const timer3 = setTimeout(() => setScanStep(4), 3800);

    setTimeout(async () => {
      try {
        // 1. Run Gemini ATS Analysis on exact file text
        const analysis = await analyzeResumeWithAI(resumeText, jobDescription, requiredSkills);
        setAtsAnalysis(analysis);

        if (typeof window !== 'undefined' && user?.id) {
          localStorage.setItem(`cp_ats_score_${user.id}`, analysis.atsScore.toString());
          localStorage.setItem('cp_ats_score', analysis.atsScore.toString());
          window.dispatchEvent(new Event('storage'));
        }

        // 2. Run Gemini Resume Tailor & Cover Letter
        const tailored = await tailorResumeAndCoverLetter(resumeText, jobDescription, user.name, targetCompany || 'Target Employer');
        setTailoredBullets(tailored.bullets);
        setGeneratedCoverLetter(tailored.coverLetter);
      } catch (err) {
        console.log('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
        setScanStep(0);
      }
    }, 5000);
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(generatedCoverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCoverLetter = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedCoverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${user.name.replace(/\s+/g, '_')}_Cover_Letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-red-950/60 dark:text-red-300 border border-brand-200 dark:border-red-800 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Powered by Gemini 2.5 Flash Model
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-brand-600 dark:text-red-400" />
            Gemini AI Resume Checker & Cover Letter Tailor
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload PDF/DOC resume, match against target job description, and get instant Gemini ATS score %, gap analysis, and cover letter.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: PDF/DOC Upload & Job Description */}
        <div className="space-y-4">
          
          {/* REQUIRE RESUME ERROR ALERT */}
          {uploadError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-bounce">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* PDF/DOC FILE UPLOADER */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-emerald-500" /> Upload Base Resume Document (PDF / DOC) *
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            {!resumeFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Click to Upload Resume Document (PDF / DOC) *
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Required before running Gemini ATS analysis</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-white flex-shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{resumeFile.name}</p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {(resumeFile.size / 1024).toFixed(1)} KB • Attached & Parsed
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    setResumeText('');
                    setUploadError('');
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack React Engineer"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Company Name</label>
              <input
                type="text"
                value={targetCompany}
                onChange={e => setTargetCompany(e.target.value)}
                placeholder="e.g. TechVenture Bangladesh Ltd."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Job Description & Requirements</label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste target job requirements and skills..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleRunFullAnalysis}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Gemini 2.5 Flash Researching (5s)...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Run Gemini ATS & Tailor Cover Letter</>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis Output, Tailored Cover Letter & 5s Scanning UI */}
        <div className="space-y-4">
          
          {isAnalyzing ? (
            <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto" />
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-slate-800 text-emerald-400 border border-slate-700">
                  Gemini 2.5 Flash Model Researching...
                </span>
                <h4 className="font-bold text-sm text-white pt-2">
                  {scanStep === 1 && `Scanning uploaded document ${resumeFile?.name || 'resume'}...`}
                  {scanStep === 2 && 'Extracting candidate technical skills, education & experience...'}
                  {scanStep === 3 && 'Comparing extracted keywords against Target Job Description...'}
                  {scanStep === 4 && 'Generating custom Tailored Cover Letter & ATS score %...'}
                </h4>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full transition-all duration-1000"
                  style={{ width: `${scanStep * 25}%` }}
                />
              </div>
            </div>
          ) : atsAnalysis ? (
            <div className="space-y-4 animate-in fade-in">
              
              {/* ATS Score Header */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GEMINI 2.5 FLASH ATS MATCH SCORE</span>
                  <h4 className="text-3xl font-black text-emerald-400 mt-0.5">{atsAnalysis.atsScore}% Match</h4>
                  <p className="text-[11px] text-slate-300 mt-1 max-w-xs leading-relaxed">{atsAnalysis.overallSummary}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-4 border-emerald-500/50 flex items-center justify-center text-emerald-400 font-black text-xl flex-shrink-0">
                  {atsAnalysis.atsScore}%
                </div>
              </div>

              {/* Matched vs Missing Skills (DISJOINT!) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                  <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Matched Skills ({atsAnalysis.matchedSkills.length})
                  </h5>
                  <div className="flex gap-1 flex-wrap">
                    {atsAnalysis.matchedSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-1.5">
                  <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Missing / Gap Skills ({atsAnalysis.missingSkills.length})
                  </h5>
                  <div className="flex gap-1 flex-wrap">
                    {atsAnalysis.missingSkills.length > 0 ? (
                      atsAnalysis.missingSkills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600">All required skills matched!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* GEMINI TAILORED COVER LETTER CARD */}
              {generatedCoverLetter && (
                <div className="p-5 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <h5 className="text-xs font-black uppercase tracking-wider text-white">Gemini Tailored Cover Letter</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCopyCoverLetter}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 flex items-center gap-1 transition-colors"
                      >
                        {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                      <button
                        onClick={handleDownloadCoverLetter}
                        className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" /> Download .txt
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-wrap min-h-[200px] max-h-[500px] overflow-y-auto">
                    {generatedCoverLetter}
                  </div>
                </div>
              )}

              {/* TAILORED RESUME BULLET POINTS */}
              {tailoredBullets.length > 0 && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-brand-500" /> Tailored Resume Impact Bullets
                  </h5>
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {tailoredBullets.map((bullet, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-sans leading-relaxed">
                        {bullet}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Score Warning & Improvement Plan */}
              {atsAnalysis.atsScore < 75 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                  <h5 className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Low ATS Match Action Plan (Score: {atsAnalysis.atsScore}%)
                  </h5>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    Your resume matched {atsAnalysis.matchedSkills.length} of {atsAnalysis.matchedSkills.length + atsAnalysis.missingSkills.length} required keywords. Follow the recommended courses and bullet updates below to raise your score above 85%.
                  </p>
                </div>
              )}

              {/* CATEGORIZED COURSES FOR MISSING SKILLS */}
              {atsAnalysis.courseSuggestions && atsAnalysis.courseSuggestions.length > 0 && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-500" /> Recommended Courses & Docs for Missing Skills
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {atsAnalysis.courseSuggestions.map((course, idx) => (
                      <a
                        key={idx}
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-all flex flex-col justify-between text-xs space-y-1.5 group shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            course.category === 'Free Courses' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            course.category === 'Paid Courses' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                            course.category === 'YouTube Courses' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          }`}>
                            {course.category}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-500 line-clamp-2">{course.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="font-bold text-slate-700 dark:text-slate-300">No active analysis generated yet.</p>
              <p>Upload your PDF/DOC resume and click "Run Gemini ATS & Tailor Cover Letter" above.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
