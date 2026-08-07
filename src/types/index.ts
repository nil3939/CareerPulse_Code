export type UserRole = 'candidate' | 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  address?: string;
  bio?: string;
  skills?: string[];
  expLevel?: string;
  resumeUrl?: string;
  resumeText?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  officeName?: string;
  officeAddress?: string;
  companyName?: string;
  companyLogo?: string;
  websiteUrl?: string;
  isVerified?: boolean;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  resumeText: string;
  skills: string[];
  expLevel: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  officeName: string;
  officeAddress: string;
  websiteUrl: string;
  logoUrl: string;
  isVerified: boolean;
}

export type ExperienceFilter = 'all' | 'Fresher (0 yrs)' | '1-2 Years' | '3-5 Years' | '5+ Years';

export interface Job {
  id: string;
  recruiterId: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string; // e.g. 'Dhaka, Bangladesh', 'Chittagong', 'Sylhet', 'Remote (BD)'
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract' | 'Hybrid';
  salaryRange: string;
  expRequired: 'Fresher (0 yrs)' | '1-2 Years' | '3-5 Years' | '5+ Years';
  description: string;
  requirements: string[];
  skillsRequired: string[];
  status: 'active' | 'pending' | 'rejected' | 'closed';
  postedAt: string;
  applicantCount: number;
}

export type ApplicationStage = 
  | 'Applied' 
  | 'Screening' 
  | 'Shortlisted' 
  | 'Interview Scheduled' 
  | 'Offer Extended' 
  | 'Hired' 
  | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateAddress?: string;
  candidateAvatar: string;
  candidateSkills: string[];
  candidateGithub: string;
  stage: ApplicationStage;
  atsMatchScore: number; // 0 - 100%
  quizScore: number;     // 0 - 100%
  coverLetter?: string;
  appliedAt: string;
  githubSummary?: {
    topLanguages: string[];
    contributionsThisYear: number;
    starCount: number;
    topRepos: string[];
    commitFrequency: string;
  };
}

export interface AIResumeAnalysis {
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  improvementBulletPoints: string[];
  courseSuggestions: {
    title: string;
    category: 'Free Courses' | 'Paid Courses' | 'Official Documentation' | 'YouTube Courses';
    url: string;
  }[];
  overallSummary: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  skillTag: string;
  questionsCount: number;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  skill: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  fileUrl?: string;
  calendarLink?: string;
  read: boolean;
  createdAt: string;
}

export interface CalendarSlot {
  id: string;
  recruiterId: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  date: string;
  time: string;
  meetLink: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'interview' | 'message' | 'system' | 'email_hired';
  isRead: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'Free Courses' | 'Paid Courses' | 'Official Documentation' | 'YouTube Courses';
  provider: string;
  skillTag: string;
  rating: number;
  url: string;
  duration: string;
  price?: string;
}

export interface FlaggedPost {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'removed';
  createdAt: string;
}

export interface ChatbotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
