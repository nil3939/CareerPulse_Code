'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthUser extends User {
  passwordHash?: string;
}

interface RegisterCandidateData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  bio: string;
  resumeText: string;
  skills: string[];
  expLevel: string;
  githubUrl: string;
  linkedinUrl: string;
}

interface RegisterRecruiterData {
  fullName: string;
  email: string;
  password: string;
  officeName: string;
  officeAddress: string;
  websiteUrl: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  authUser: User | null;
  role: UserRole;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerCandidate: (data: RegisterCandidateData) => Promise<{ success: boolean; error?: string }>;
  registerRecruiter: (data: RegisterRecruiterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  sendOtp: (email: string) => Promise<{ success: boolean; otp?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  setRole: (role: UserRole) => void;
  updateUserProfile: (updatedFields: Partial<User>) => void;
}

// Simulated user store
const userStore: AuthUser[] = [
  { ...mockUsers.candidate, passwordHash: 'candidate123' },
  { ...mockUsers.recruiter, passwordHash: 'recruiter123' },
  { ...mockUsers.admin, passwordHash: 'admin123' },
];

const otpStore: Record<string, { otp: string; expires: number }> = {};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('candidate');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuthUser = localStorage.getItem('cp_user');
      const savedRole = localStorage.getItem('cp_role') as UserRole | null;
      const savedAuth = localStorage.getItem('cp_auth');

      if (savedAuth && savedAuthUser) {
        try {
          const parsed = JSON.parse(savedAuthUser);
          setAuthUser(parsed);
          setRoleState(parsed.role || savedRole || 'candidate');
          setIsAuthenticated(true);
        } catch {
          // fallback
        }
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call MongoDB Atlas Login API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setAuthUser(data.user);
        setRoleState(data.user.role || 'candidate');
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cp_role', data.user.role || 'candidate');
          localStorage.setItem('cp_auth', '1');
          localStorage.setItem('cp_user', JSON.stringify(data.user));
        }
        return { success: true };
      }

      // Fallback check in local userStore if API route returns error
      const localUser = userStore.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password);
      if (localUser) {
        const { passwordHash, ...cleanUser } = localUser;
        setAuthUser(cleanUser);
        setRoleState(cleanUser.role);
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cp_role', cleanUser.role);
          localStorage.setItem('cp_auth', '1');
          localStorage.setItem('cp_user', JSON.stringify(cleanUser));
        }
        return { success: true };
      }

      return { success: false, error: data.error || 'Invalid email or password.' };
    } catch {
      const localUser = userStore.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password);
      if (localUser) {
        const { passwordHash, ...cleanUser } = localUser;
        setAuthUser(cleanUser);
        setRoleState(cleanUser.role);
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cp_role', cleanUser.role);
          localStorage.setItem('cp_auth', '1');
          localStorage.setItem('cp_user', JSON.stringify(cleanUser));
        }
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password.' };
    }
  };

  const registerCandidate = async (data: RegisterCandidateData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Save Candidate to MongoDB Atlas
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
          role: 'candidate',
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Registration failed.' };
      }

      const newUser: User = {
        id: resData.user.id || `cand_${Date.now()}`,
        name: data.fullName,
        email: data.email,
        role: 'candidate',
        avatar: resData.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=dc2626&color=fff`,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        resumeText: data.resumeText,
        skills: data.skills,
        expLevel: data.expLevel,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
      };

      setAuthUser(newUser);
      setRoleState('candidate');
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_role', 'candidate');
        localStorage.setItem('cp_auth', '1');
        localStorage.setItem('cp_user', JSON.stringify(newUser));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const registerRecruiter = async (data: RegisterRecruiterData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Save Recruiter to MongoDB Atlas
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
          role: 'recruiter',
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Registration failed.' };
      }

      const newUser: User = {
        id: resData.user.id || `rec_${Date.now()}`,
        name: data.fullName,
        email: data.email,
        role: 'recruiter',
        avatar: resData.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=2563eb&color=fff`,
        officeName: data.officeName,
        officeAddress: data.officeAddress,
        websiteUrl: data.websiteUrl,
      };

      setAuthUser(newUser);
      setRoleState('recruiter');
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_role', 'recruiter');
        localStorage.setItem('cp_auth', '1');
        localStorage.setItem('cp_user', JSON.stringify(newUser));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    setAuthUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cp_role');
      localStorage.removeItem('cp_auth');
      localStorage.removeItem('cp_user');
    }
  };

  const sendOtp = async (email: string): Promise<{ success: boolean; otp?: string }> => {
    await new Promise(r => setTimeout(r, 400));
    const user = userStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false };
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email.toLowerCase()] = { otp, expires: Date.now() + 5 * 60 * 1000 };
    return { success: true, otp };
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 300));
    const stored = otpStore[email.toLowerCase()];
    if (!stored) return false;
    if (Date.now() > stored.expires) return false;
    return stored.otp === otp;
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 400));
    const user = userStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return false;
    user.passwordHash = newPassword;
    delete otpStore[email.toLowerCase()];
    return true;
  };

  const setRole = (r: UserRole) => {
    setRoleState(r);
    const user = userStore.find(u => u.role === r);
    if (user) {
      const { passwordHash, ...cleanUser } = user;
      setAuthUser(cleanUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_role', r);
        localStorage.setItem('cp_user', JSON.stringify(cleanUser));
      }
    }
  };

  const updateUserProfile = (updatedFields: Partial<User>) => {
    if (!authUser) return;
    const updatedUser = { ...authUser, ...updatedFields };
    setAuthUser(updatedUser);

    // Update in user store
    const storedIdx = userStore.findIndex(u => u.id === authUser.id);
    if (storedIdx !== -1) {
      userStore[storedIdx] = { ...userStore[storedIdx], ...updatedFields };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      authUser,
      role,
      login,
      registerCandidate,
      registerRecruiter,
      logout,
      sendOtp,
      verifyOtp,
      resetPassword,
      setRole,
      updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
