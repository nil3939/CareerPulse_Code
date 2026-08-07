'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  User, UserRole, Job, Application, ApplicationStage, QuizSubmission,
  Message, CalendarSlot, NotificationItem, ExperienceFilter, Course, FlaggedPost
} from '../types';
import {
  mockJobs, mockApplications, mockQuizCategories,
  mockQuizLeaderboard, mockMessages, mockCalendarSlots,
  mockNotifications, mockCourses, mockFlaggedPosts, mockUsers
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  jobs: Job[];
  addJob: (newJob: Omit<Job, 'id' | 'postedAt' | 'applicantCount'>) => void;
  updateJob: (jobId: string, updatedFields: Partial<Job>) => void;
  deleteJob: (jobId: string) => void;
  approveJob: (jobId: string) => void;
  rejectJob: (jobId: string) => void;
  applications: Application[];
  updateApplicationStage: (appId: string, newStage: ApplicationStage) => void;
  submitNewApplication: (jobId: string, coverLetter: string) => void;
  messages: Message[];
  sendMessage: (text: string, fileUrl?: string, calendarLink?: string) => void;
  calendarSlots: CalendarSlot[];
  addCalendarSlot: (slot: Omit<CalendarSlot, 'id' | 'status'>) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  quizLeaderboard: QuizSubmission[];
  addQuizSubmission: (submission: Omit<QuizSubmission, 'id' | 'candidateId' | 'candidateName' | 'candidateAvatar' | 'completedAt' | 'percentage'>) => void;
  courses: Course[];
  flaggedPosts: FlaggedPost[];
  resolveFlaggedPost: (id: string, action: 'removed' | 'reviewed') => void;
  verifyRecruiterCompany: (userId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedExpFilter: ExperienceFilter;
  setSelectedExpFilter: (exp: ExperienceFilter) => void;
  selectedSkillFilter: string;
  setSelectedSkillFilter: (skill: string) => void;
  selectedLocationFilter: string;
  setSelectedLocationFilter: (loc: string) => void;
  selectedSalaryFilter: string;
  setSelectedSalaryFilter: (salary: string) => void;
  // Multi-select filters
  selectedSkills: string[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLocations: string[];
  setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>;
  selectedExpLevels: string[];
  setSelectedExpLevels: React.Dispatch<React.SetStateAction<string[]>>;
  selectedJobTypes: string[];
  setSelectedJobTypes: React.Dispatch<React.SetStateAction<string[]>>;
  resetAllFilters: () => void;

  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  hiredEmailSent: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, role } = useAuth();

  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>(mockCalendarSlots);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [quizLeaderboard, setQuizLeaderboard] = useState<QuizSubmission[]>(mockQuizLeaderboard);
  const [courses] = useState<Course[]>(mockCourses);
  const [flaggedPosts, setFlaggedPosts] = useState<FlaggedPost[]>(mockFlaggedPosts);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job_1']);
  const [hiredEmailSent, setHiredEmailSent] = useState<string[]>([]);

  // Single filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpFilter, setSelectedExpFilter] = useState<ExperienceFilter>('all');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
  const [selectedSalaryFilter, setSelectedSalaryFilter] = useState<string>('all');

  // Multi-select filters
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExpLevels, setSelectedExpLevels] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

  // Load MongoDB Atlas jobs, applications, and direct messages
  useEffect(() => {
    const fetchMongoData = async () => {
      try {
        const [jobsRes, appsRes, msgsRes] = await Promise.all([
          fetch('/api/jobs'),
          fetch('/api/applications'),
          fetch('/api/messages'),
        ]);

        if (jobsRes.ok) {
          const mongoJobs = await jobsRes.json();
          if (Array.isArray(mongoJobs) && mongoJobs.length > 0) {
            setJobs(mongoJobs);
          }
        }

        if (appsRes.ok) {
          const mongoApps = await appsRes.json();
          if (Array.isArray(mongoApps) && mongoApps.length > 0) {
            setApplications(mongoApps);
          }
        }

        if (msgsRes.ok) {
          const mongoMsgs = await msgsRes.json();
          if (Array.isArray(mongoMsgs) && mongoMsgs.length > 0) {
            setMessages(mongoMsgs);
          }
        }
      } catch (err) {
        console.error('Failed to sync from MongoDB API:', err);
      }
    };

    fetchMongoData();
  }, []);

  const currentUser = authUser || mockUsers[role];

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedExpFilter('all');
    setSelectedSkillFilter('all');
    setSelectedLocationFilter('all');
    setSelectedSalaryFilter('all');
    setSelectedSkills([]);
    setSelectedLocations([]);
    setSelectedExpLevels([]);
    setSelectedJobTypes([]);
  };

  // Requirement 4: Jobs posted by recruiters require Admin approval (status: 'pending')
  const addJob = async (newJobData: Omit<Job, 'id' | 'postedAt' | 'applicantCount'>) => {
    const isPending = role === 'recruiter';
    
    // Save to MongoDB Atlas via API
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newJobData,
          status: isPending ? 'pending' : 'active',
        }),
      });
      const data = await res.json();
      if (res.ok && data.job) {
        setJobs(prev => [data.job, ...prev]);
        return;
      }
    } catch (err) {
      console.error('Error saving job to MongoDB Atlas:', err);
    }

    const newJob: Job = {
      ...newJobData,
      id: `job_${Date.now()}`,
      status: isPending ? 'pending' : 'active',
      postedAt: 'Just now',
      applicantCount: 0,
    };

    setJobs(prev => {
      const updated = [newJob, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_jobs', JSON.stringify(updated));
      }
      return updated;
    });

    if (isPending) {
      const adminNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: 'admin_1',
        title: 'New Job Pending Approval',
        message: `${newJobData.company} posted "${newJobData.title}". Review and approve to publish on CareerPulse.`,
        type: 'system',
        isRead: false,
        createdAt: 'Just now',
      };
      setNotifications(n => [adminNotif, ...n]);
    }
  };

  const approveJob = (jobId: string) => {
    setJobs(prev => {
      const updated = prev.map(j => j.id === jobId ? { ...j, status: 'active' as const } : j);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_jobs', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const rejectJob = (jobId: string) => {
    setJobs(prev => {
      const updated = prev.map(j => j.id === jobId ? { ...j, status: 'rejected' as const } : j);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_jobs', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateJob = (jobId: string, updatedFields: Partial<Job>) => {
    setJobs(prev => {
      const updated = prev.map(j => j.id === jobId ? { ...j, ...updatedFields } : j);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_jobs', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => {
      const updated = prev.filter(j => j.id !== jobId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_jobs', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateApplicationStage = (appId: string, newStage: ApplicationStage) => {
    setApplications(prev => {
      const updatedList = prev.map(app => {
        if (app.id === appId) {
          const updated = { ...app, stage: newStage };
          const newNotif: NotificationItem = {
            id: `notif_${Date.now()}`,
            userId: app.candidateId,
            title: `Application Status: ${newStage}`,
            message: `Your application for ${app.jobTitle} at ${app.company} is now ${newStage}.`,
            type: newStage === 'Hired' ? 'email_hired' : 'application',
            isRead: false,
            createdAt: 'Just now',
          };
          setNotifications(n => [newNotif, ...n]);

          if (newStage === 'Hired' && !hiredEmailSent.includes(appId)) {
            setHiredEmailSent(h => [...h, appId]);
            const hiredEmailNotif: NotificationItem = {
              id: `email_${Date.now()}`,
              userId: app.candidateId,
              title: '🎉 Congratulations! You Are Hired!',
              message: `We are thrilled to inform you that you have been officially hired for ${app.jobTitle} at ${app.company}. A formal offer letter has been sent to ${app.candidateEmail}. Welcome to the team!`,
              type: 'email_hired',
              isRead: false,
              createdAt: 'Just now',
            };
            setTimeout(() => setNotifications(n => [hiredEmailNotif, ...n]), 500);
          }
          return updated;
        }
        return app;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_apps', JSON.stringify(updatedList));
      }
      return updatedList;
    });
  };

  const submitNewApplication = async (jobId: string, coverLetter: string) => {
    if (!currentUser) return;
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    // Check if already applied
    const existing = applications.find(a => a.jobId === jobId && a.candidateId === currentUser.id);
    if (existing) return;

    const userSkills = currentUser.skills || [];
    const requiredSkills = targetJob.skillsRequired || [];
    const matched = requiredSkills.filter(s => userSkills.includes(s)).length;
    const matchScore = requiredSkills.length > 0 ? Math.round((matched / requiredSkills.length) * 100) : 85;

    // POST to MongoDB Atlas Applications API
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          jobTitle: targetJob.title,
          company: targetJob.company,
          candidateId: currentUser.id,
          candidateName: currentUser.name,
          candidateEmail: currentUser.email,
          candidatePhone: currentUser.phone || '',
          candidateAddress: currentUser.address || '',
          candidateSkills: currentUser.skills || ['React', 'JavaScript'],
          atsMatchScore: matchScore > 0 ? matchScore : 80,
          coverLetter,
          resumeText: currentUser.resumeText || '',
        }),
      });
    } catch (err) {
      console.error('Error saving application to MongoDB Atlas:', err);
    }

    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId,
      jobTitle: targetJob.title,
      company: targetJob.company,
      candidateId: currentUser.id,
      candidateName: currentUser.name,
      candidateEmail: currentUser.email,
      candidatePhone: currentUser.phone,
      candidateAddress: currentUser.address,
      candidateAvatar: currentUser.avatar,
      candidateSkills: currentUser.skills || ['React', 'JavaScript'],
      candidateGithub: currentUser.githubUrl || 'github.com/user',
      stage: 'Applied',
      atsMatchScore: matchScore > 0 ? matchScore : 80,
      quizScore: 92,
      coverLetter,
      appliedAt: new Date().toISOString().split('T')[0],
      githubSummary: {
        topLanguages: ['TypeScript', 'JavaScript', 'Python'],
        contributionsThisYear: 1240,
        starCount: 290,
        topRepos: ['personal-portfolio', 'fullstack-job-portal'],
        commitFrequency: 'Very Active',
      },
    };

    setApplications(prev => [newApp, ...prev]);

    setJobs(prev => {
      const updatedJobs = prev.map(j => j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j);
      return updatedJobs;
    });
  };

  const sendMessage = async (text: string, fileUrl?: string, calendarLink?: string) => {
    if (!currentUser) return;

    // POST to MongoDB Atlas Messages API
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: role === 'candidate' ? 'rec_1' : 'cand_1',
          senderRole: role,
          senderName: currentUser.name,
          text,
          fileUrl,
          calendarLink,
        }),
      });
    } catch (err) {
      console.error('Error saving message to MongoDB Atlas:', err);
    }

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: role === 'candidate' ? 'rec_1' : 'cand_1',
      senderRole: role,
      senderName: currentUser.name,
      text,
      fileUrl,
      calendarLink,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setMessages(prev => [...prev, newMsg]);

    // Route notification to recipient (Recruiter if candidate sent, Candidate if recruiter sent)
    const targetUserId = role === 'candidate' ? 'rec_1' : 'cand_1';
    const notifTitle = role === 'candidate' ? `New Candidate Message from ${currentUser.name}` : `New Recruiter Message from ${currentUser.name}`;
    
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: targetUserId,
      title: notifTitle,
      message: `"${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"`,
      type: 'application',
      isRead: false,
      createdAt: 'Just now',
    };

    setNotifications(n => [notif, ...n]);
  };

  const addCalendarSlot = (slotData: Omit<CalendarSlot, 'id' | 'status'>) => {
    const newSlot: CalendarSlot = { ...slotData, id: `slot_${Date.now()}`, status: 'confirmed' };
    setCalendarSlots(prev => [...prev, newSlot]);
    sendMessage(`Interview slot confirmed for ${slotData.date} at ${slotData.time}!`, undefined, slotData.meetLink);
  };

  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const markAllNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const addQuizSubmission = (submissionData: Omit<QuizSubmission, 'id' | 'candidateId' | 'candidateName' | 'candidateAvatar' | 'completedAt' | 'percentage'>) => {
    if (!currentUser) return;
    const percentage = Math.round((submissionData.score / submissionData.total) * 100);
    const newSub: QuizSubmission = {
      ...submissionData,
      id: `sub_${Date.now()}`,
      candidateId: currentUser.id,
      candidateName: currentUser.name,
      candidateAvatar: currentUser.avatar,
      percentage,
      completedAt: new Date().toISOString().split('T')[0],
    };
    setQuizLeaderboard(prev => [newSub, ...prev].sort((a, b) => b.percentage - a.percentage));
  };

  const resolveFlaggedPost = (id: string, action: 'removed' | 'reviewed') =>
    setFlaggedPosts(prev => prev.map(fp => fp.id === id ? { ...fp, status: action } : fp));

  const verifyRecruiterCompany = (userId: string) => { /* admin action */ };
  const toggleSaveJob = (jobId: string) =>
    setSavedJobIds(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);

  return (
    <AppContext.Provider value={{
      currentUser, jobs, addJob, updateJob, deleteJob, approveJob, rejectJob, applications, updateApplicationStage, submitNewApplication,
      messages, sendMessage, calendarSlots, addCalendarSlot,
      notifications, markNotificationRead, markAllNotificationsRead,
      quizLeaderboard, addQuizSubmission, courses, flaggedPosts,
      resolveFlaggedPost, verifyRecruiterCompany,
      searchQuery, setSearchQuery,
      selectedExpFilter, setSelectedExpFilter,
      selectedSkillFilter, setSelectedSkillFilter,
      selectedLocationFilter, setSelectedLocationFilter,
      selectedSalaryFilter, setSelectedSalaryFilter,
      selectedSkills, setSelectedSkills,
      selectedLocations, setSelectedLocations,
      selectedExpLevels, setSelectedExpLevels,
      selectedJobTypes, setSelectedJobTypes,
      resetAllFilters,
      savedJobIds, toggleSaveJob,
      hiredEmailSent,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
