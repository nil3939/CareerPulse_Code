'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Eye, EyeOff, Loader2, User, Briefcase, ShieldAlert, Mail, Lock, Key, X,
  CheckCircle2, ArrowLeft, Send, Phone, MapPin, FileText, Tag, Link2, 
  UploadCloud, FileCheck, Trash2 
} from 'lucide-react';

type ModalView = 'login' | 'register_candidate' | 'register_recruiter' | 'forgot_password' | 'otp_verify' | 'reset_password';
type LoginRoleTab = 'candidate' | 'recruiter' | 'admin';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, registerCandidate, registerRecruiter, sendOtp, verifyOtp, resetPassword } = useAuth();
  const [view, setView] = useState<ModalView>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState('');

  // Login fields (clean & empty for candidate, recruiter, admin)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginRoleTab, setLoginRoleTab] = useState<LoginRoleTab>('candidate');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);

  // Candidate registration fields
  const [cFullName, setCFullName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [cBio, setCBio] = useState('');
  const [cResumeFile, setCResumeFile] = useState<File | null>(null);
  const [cResumeText, setCResumeText] = useState('');
  const [cSkills, setCSkills] = useState('');
  const [cExpLevel, setCExpLevel] = useState('Fresher (0 yrs)');
  const [cGithub, setCGithub] = useState('');
  const [cLinkedin, setCLinkedin] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recruiter registration fields
  const [rFullName, setRFullName] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [rOfficeName, setROfficeName] = useState('');
  const [rOfficeAddress, setROfficeAddress] = useState('');
  const [rWebsite, setRWebsite] = useState('');

  // OTP & Reset Password fields
  const [fpEmail, setFpEmail] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');

  if (!isOpen) return null;

  const handleSelectRoleTab = (tab: LoginRoleTab) => {
    setLoginRoleTab(tab);
    setError('');
    setSuccess('');
    setLoginEmail('');
    setLoginPassword('');
    setIsEmailFocused(false);
    setIsPassFocused(false);
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
        setError('Please upload a valid PDF or DOC/DOCX document.');
        return;
      }
      setError('');
      setCResumeFile(file);
      
      const syntheticResumeText = `${cFullName || 'Candidate'} - Resume (${file.name})
Contact: ${cEmail || 'email@example.com'} | ${cPhone || '+880'} | ${cAddress || 'Dhaka, Bangladesh'}
Bio: ${cBio || 'Engineering Specialist'}
Skills: ${cSkills || 'React, Node.js, Python, SQL'}
Experience: ${cExpLevel}

Attached Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      
      setCResumeText(syntheticResumeText);
    }
  };

  const handleCandidateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!cResumeFile) {
      setError('Please upload your resume in PDF or DOC format.');
      return;
    }

    setLoading(true);
    const skillsArr = cSkills.split(',').map(s => s.trim()).filter(Boolean);

    const result = await registerCandidate({
      fullName: cFullName,
      email: cEmail,
      password: cPassword,
      phone: cPhone,
      address: cAddress,
      bio: cBio,
      resumeText: cResumeText,
      skills: skillsArr,
      expLevel: cExpLevel,
      githubUrl: cGithub,
      linkedinUrl: cLinkedin,
    });

    setLoading(false);

    if (result.success) {
      setSuccess('Candidate registration successful! Welcome to CareerPulse.');
      setTimeout(() => { onClose(); setSuccess(''); }, 1500);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleRecruiterRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);

    const result = await registerRecruiter({
      fullName: rFullName,
      email: rEmail,
      password: rPassword,
      officeName: rOfficeName,
      officeAddress: rOfficeAddress,
      websiteUrl: rWebsite,
    });

    setLoading(false);

    if (result.success) {
      setSuccess('Recruiter account created successfully! Welcome to CareerPulse.');
      setTimeout(() => { onClose(); setSuccess(''); }, 1500);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (result.success) {
      setSuccess('Sign in successful! Directing to Dashboard...');
      setTimeout(() => { onClose(); setSuccess(''); }, 1000);
    } else {
      setError(result.error || 'Sign in failed');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const result = await sendOtp(fpEmail);
    setLoading(false);
    if (result.success && result.otp) {
      setOtpSent(result.otp);
      setView('otp_verify');
      setSuccess(`OTP sent to ${fpEmail}. (Demo OTP: ${result.otp})`);
    } else {
      setError('No account found with this email address.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const valid = await verifyOtp(fpEmail, fpOtp);
    setLoading(false);
    if (valid) { setView('reset_password'); setSuccess(''); }
    else setError('Invalid or expired OTP. Please try again.');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const done = await resetPassword(fpEmail, fpNewPassword);
    setLoading(false);
    if (done) {
      setSuccess('Password reset successfully! You can now log in.');
      setTimeout(() => { setView('login'); setSuccess(''); }, 2000);
    } else setError('Failed to reset password.');
  };

  const inputClass = "w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 placeholder:text-slate-400 transition-all";
  const labelClass = "text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {view !== 'login' && (
                <button onClick={() => { setView('login'); setError(''); setSuccess(''); }} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <div
                  onClick={() => { if (typeof window !== 'undefined') window.location.reload(); }}
                  className="flex items-center gap-2 mb-1 cursor-pointer group"
                  title="Click logo to refresh"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center text-white font-black text-sm group-hover:scale-105 transition-transform">C</div>
                  <span className="font-black text-slate-900 dark:text-white text-lg">CareerPulse</span>
                </div>
                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {view === 'login' && (
                    loginRoleTab === 'candidate' ? 'Sign In as Candidate' :
                    loginRoleTab === 'recruiter' ? 'Sign In as Recruiter' :
                    'Sign In as Admin'
                  )}
                  {view === 'register_candidate' && 'Create your Candidate profile & Upload Resume'}
                  {view === 'register_recruiter' && 'Create your Recruiter account'}
                  {view === 'forgot_password' && 'Recover your account via Email OTP'}
                  {view === 'otp_verify' && 'Enter the OTP sent to your email'}
                  {view === 'reset_password' && 'Set your new password'}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Error / Success banners */}
          {error && <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300">{error}</div>}
          {success && <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{success}</div>}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <>
              {/* 3 DISTINCT LOGIN TYPES (Candidate, Recruiter, Admin) */}
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleSelectRoleTab('candidate')}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginRoleTab === 'candidate'
                      ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Candidate
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRoleTab('recruiter')}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginRoleTab === 'recruiter'
                      ? 'bg-blue-600 text-white shadow-md font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" /> Recruiter
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRoleTab('admin')}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginRoleTab === 'admin'
                      ? 'bg-purple-600 text-white shadow-md font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Admin
                </button>
              </div>

              <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
                {/* Dummy hidden inputs to defeat Chrome/Edge password autofill */}
                <input type="text" name="prevent_autofill_email" className="hidden" tabIndex={-1} />
                <input type="password" name="prevent_autofill_pass" className="hidden" tabIndex={-1} />

                <div>
                  <label className={labelClass}><Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address</label>
                  <input
                    type="text"
                    name="cp_email_field_clean"
                    required
                    autoComplete="off"
                    readOnly={!isEmailFocused}
                    onFocus={() => setIsEmailFocused(true)}
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder={
                      loginRoleTab === 'candidate' ? 'Enter candidate email' :
                      loginRoleTab === 'recruiter' ? 'Enter recruiter work email' :
                      'Enter admin email'
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}><Lock className="w-3.5 h-3.5 text-slate-400" /> Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="cp_pass_field_clean"
                      required
                      autoComplete="new-password"
                      readOnly={!isPassFocused}
                      onFocus={() => setIsPassFocused(true)}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className={inputClass + ' pr-12'}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => { setView('forgot_password'); setError(''); }} className="text-xs font-bold text-brand-600 dark:text-red-400 hover:underline">
                    Forgot Password? (OTP Reset)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all ${
                    loginRoleTab === 'candidate'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-emerald-500/20'
                      : loginRoleTab === 'recruiter'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-blue-500/20'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/20'
                  }`}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
                  ) : (
                    `Sign In as ${loginRoleTab === 'candidate' ? 'Candidate' : loginRoleTab === 'recruiter' ? 'Recruiter' : 'Admin'}`
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">New to CareerPulse?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setView('register_candidate'); setError(''); }} className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Register as Candidate
                  </button>
                  <button onClick={() => { setView('register_recruiter'); setError(''); }} className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Register as Recruiter
                  </button>
                </div>
              </div>
            </>
          )}

          {/* CANDIDATE REGISTRATION (PDF / DOC RESUME UPLOAD) */}
          {view === 'register_candidate' && (
            <form onSubmit={handleCandidateRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}><User className="w-3.5 h-3.5 text-slate-400" /> Full Name *</label>
                  <input required value={cFullName} onChange={e => setCFullName(e.target.value)} placeholder="Full Name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Mail className="w-3.5 h-3.5 text-slate-400" /> Email *</label>
                  <input type="email" required value={cEmail} onChange={e => setCEmail(e.target.value)} placeholder="you@email.com" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}><Lock className="w-3.5 h-3.5 text-slate-400" /> Password *</label>
                  <input type="password" required minLength={6} value={cPassword} onChange={e => setCPassword(e.target.value)} placeholder="Min 6 characters" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number</label>
                  <input value={cPhone} onChange={e => setCPhone(e.target.value)} placeholder="+880 17XX-XXXXXX" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}><MapPin className="w-3.5 h-3.5 text-slate-400" /> Address</label>
                <input value={cAddress} onChange={e => setCAddress(e.target.value)} placeholder="Gulshan-2, Dhaka, Bangladesh" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}><FileText className="w-3.5 h-3.5 text-slate-400" /> Professional Bio</label>
                <textarea rows={2} value={cBio} onChange={e => setCBio(e.target.value)} placeholder="Full-Stack Engineer passionate about React, Next.js, and AI..." className={inputClass} />
              </div>

              <div className="space-y-1">
                <label className={labelClass}>
                  <UploadCloud className="w-3.5 h-3.5 text-emerald-500" /> Submit Resume Document (PDF / DOC) *
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeFileUpload}
                  className="hidden"
                />

                {!cResumeFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Click to upload your Resume (PDF or DOC)
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOC, DOCX files up to 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-2 rounded-xl bg-emerald-500 text-white flex-shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{cResumeFile.name}</p>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {(cResumeFile.size / 1024).toFixed(1)} KB • Attached & Parsed
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setCResumeFile(null); setCResumeText(''); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-900 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}><Tag className="w-3.5 h-3.5 text-slate-400" /> Skills (comma-separated) *</label>
                  <input required value={cSkills} onChange={e => setCSkills(e.target.value)} placeholder="React, Node.js, Python, SQL" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Experience Level *</label>
                  <select required value={cExpLevel} onChange={e => setCExpLevel(e.target.value)} className={inputClass}>
                    <option value="Fresher (0 yrs)">Fresher (0 yrs)</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}><Link2 className="w-3.5 h-3.5 text-slate-400" /> GitHub URL</label>
                  <input value={cGithub} onChange={e => setCGithub(e.target.value)} placeholder="https://github.com/youruser" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Link2 className="w-3.5 h-3.5 text-slate-400" /> LinkedIn URL</label>
                  <input value={cLinkedin} onChange={e => setCLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className={inputClass} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Profile...</> : <><CheckCircle2 className="w-4 h-4" /> Create Candidate Profile</>}
              </button>
            </form>
          )}

          {/* RECRUITER REGISTRATION */}
          {view === 'register_recruiter' && (
            <form onSubmit={handleRecruiterRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}><User className="w-3.5 h-3.5 text-slate-400" /> Full Name *</label>
                  <input required value={rFullName} onChange={e => setRFullName(e.target.value)} placeholder="Full Name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Mail className="w-3.5 h-3.5 text-slate-400" /> Work Email *</label>
                  <input type="email" required value={rEmail} onChange={e => setREmail(e.target.value)} placeholder="recruiter@company.com" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}><Lock className="w-3.5 h-3.5 text-slate-400" /> Password *</label>
                <input type="password" required minLength={6} value={rPassword} onChange={e => setRPassword(e.target.value)} placeholder="Min 6 characters" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Briefcase className="w-3.5 h-3.5 text-slate-400" /> Office / Company Name *</label>
                <input required value={rOfficeName} onChange={e => setROfficeName(e.target.value)} placeholder="TechVenture Bangladesh Ltd." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><MapPin className="w-3.5 h-3.5 text-slate-400" /> Office Address *</label>
                <input required value={rOfficeAddress} onChange={e => setROfficeAddress(e.target.value)} placeholder="Bashundhara R/A, Dhaka-1229, Bangladesh" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Link2 className="w-3.5 h-3.5 text-slate-400" /> Website URL</label>
                <input value={rWebsite} onChange={e => setRWebsite(e.target.value)} placeholder="https://company.com.bd" className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <><CheckCircle2 className="w-4 h-4" /> Create Recruiter Account</>}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {view === 'forgot_password' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className={labelClass}><Mail className="w-3.5 h-3.5 text-slate-400" /> Account Email</label>
                <input type="email" required value={fpEmail} onChange={e => setFpEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP...</> : <><Send className="w-4 h-4" /> Send OTP to Email</>}
              </button>
            </form>
          )}

          {/* OTP VERIFICATION */}
          {view === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className={labelClass}><Key className="w-3.5 h-3.5 text-slate-400" /> 6-Digit OTP</label>
                <input type="text" required maxLength={6} value={fpOtp} onChange={e => setFpOtp(e.target.value)} placeholder="123456" className={inputClass + ' font-mono text-center tracking-widest text-lg'} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : 'Verify OTP & Reset Password'}
              </button>
            </form>
          )}

          {/* RESET PASSWORD */}
          {view === 'reset_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className={labelClass}><Lock className="w-3.5 h-3.5 text-slate-400" /> New Password</label>
                <input type="password" required minLength={6} value={fpNewPassword} onChange={e => setFpNewPassword(e.target.value)} placeholder="New password" className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Save New Password'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
