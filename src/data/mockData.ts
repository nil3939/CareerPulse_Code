import { User, Job, Application, QuizCategory, QuizSubmission, Message, CalendarSlot, NotificationItem, Course, FlaggedPost } from '../types';
import { extraJobs } from './extraJobs';

export const mockUsers: Record<'candidate' | 'recruiter' | 'admin', User> = {
  candidate: {
    id: 'cand_1',
    name: 'Candidate User',
    email: 'candidate@careerpulse.com.bd',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Full-Stack Developer passionate about React, Next.js, Node.js, and AI integrations. Based in Dhaka, Bangladesh.',
    phone: '+880 1712-345678',
    address: 'Gulshan-2, Dhaka, Bangladesh',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'SQL'],
    expLevel: '3-5 Years',
    resumeText: `Candidate User - Full Stack Software Engineer
Email: candidate@careerpulse.com.bd | Phone: +880 1712-345678 | Dhaka, Bangladesh
GitHub: github.com/candidateuser | LinkedIn: linkedin.com/in/candidateuser

EXPERIENCE:
Senior Full Stack Developer - TechVenture BD (2022 - Present)
- Built scalable React & Next.js applications serving 50,000+ daily users
- Designed Node.js microservices with PostgreSQL handling 100k+ API requests/day
- Improved Core Web Vitals by 45% through code splitting and lazy loading

SKILLS: React, Next.js, TypeScript, Node.js, Python, PostgreSQL, SQL, Tailwind CSS, Docker, REST APIs

EDUCATION:
B.Sc. in Computer Science & Engineering - BUET (2019)`,
    githubUrl: 'https://github.com/candidateuser',
    linkedinUrl: 'https://linkedin.com/in/candidateuser',
  },
  recruiter: {
    id: 'rec_1',
    name: 'Recruiter User',
    email: 'recruiter@careerpulse.com.bd',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    officeName: 'TechVenture Bangladesh Ltd.',
    companyName: 'TechVenture Bangladesh Ltd.',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    officeAddress: 'Bashundhara R/A, Dhaka-1229, Bangladesh',
    websiteUrl: 'https://techventure.com.bd',
    isVerified: true,
  },
  admin: {
    id: 'admin_1',
    name: 'CareerPulse Admin',
    email: 'admin@careerpulse.com.bd',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    isVerified: true,
  },
};

export const mockJobs: Job[] = [
  {
    id: 'job_1',
    recruiterId: 'rec_1',
    title: 'Senior Full Stack React & Node Engineer',
    company: 'TechVenture Bangladesh Ltd.',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    salaryRange: '৳80,000 - ৳1,20,000/month',
    expRequired: '3-5 Years',
    description: 'We are seeking a high-performance Full Stack Engineer to lead our enterprise cloud applications team. Build accessible, modern interfaces with React, Next.js and Node.js microservices.',
    requirements: [
      '3+ years experience with React, Next.js, TypeScript',
      'Strong backend experience with Node.js, Express, and PostgreSQL',
      'Familiarity with REST APIs and WebSockets',
      'Experience in performance optimization (Core Web Vitals)'
    ],
    skillsRequired: ['React', 'Next.js', 'Node.js', 'TypeScript', 'SQL'],
    status: 'active',
    postedAt: '2 days ago',
    applicantCount: 42,
  },
  {
    id: 'job_2',
    recruiterId: 'rec_1',
    title: 'AI & Data Science Specialist',
    company: 'Nexus AI Labs BD',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200',
    location: 'Chittagong, Bangladesh',
    type: 'Full-time',
    salaryRange: '৳1,00,000 - ৳1,50,000/month',
    expRequired: '3-5 Years',
    description: 'Join our cutting-edge AI team developing LLM applications, RAG pipelines, and automated intelligence models for fintech and e-commerce sectors in Bangladesh.',
    requirements: [
      'Expert proficiency in Python, PyTorch/TensorFlow, and LangChain',
      'Hands-on experience fine-tuning open-source LLMs',
      'Strong mathematical foundation in linear algebra & statistics',
      'Experience deploying models with FastAPI and Docker'
    ],
    skillsRequired: ['Python', 'AI/ML', 'SQL', 'FastAPI', 'PyTorch'],
    status: 'active',
    postedAt: '1 day ago',
    applicantCount: 29,
  },
  {
    id: 'job_3',
    recruiterId: 'rec_2',
    title: 'Frontend UI/UX Engineer (React & Tailwind)',
    company: 'Creata UI Studio BD',
    companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200',
    location: 'Remote (BD)',
    type: 'Remote',
    salaryRange: '৳50,000 - ৳80,000/month',
    expRequired: '1-2 Years',
    description: 'Looking for a design-obsessed Frontend Developer to craft visually stunning web applications with micro-interactions, dark mode, and glassmorphism aesthetics for Bangladeshi clients.',
    requirements: [
      'Strong mastery over React, Tailwind CSS, Framer Motion',
      'Eye for modern web design system tokens and glassmorphic UI',
      'Experience with responsive design and CSS animations'
    ],
    skillsRequired: ['React', 'Tailwind CSS', 'TypeScript'],
    status: 'active',
    postedAt: '3 days ago',
    applicantCount: 68,
  },
  {
    id: 'job_4',
    recruiterId: 'rec_3',
    title: 'Junior Software Engineer (Fresher Hiring)',
    company: 'NextGen Solutions BD',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=200',
    location: 'Sylhet, Bangladesh',
    type: 'Full-time',
    salaryRange: '৳25,000 - ৳40,000/month',
    expRequired: 'Fresher (0 yrs)',
    description: 'Kickstart your career with our fast-paced graduate engineering program! Work with lead architects to solve real-world problems using modern web technologies.',
    requirements: [
      'B.Sc./B.Eng in CSE, IT or related (2025/2026 graduates)',
      'Basic knowledge of JavaScript/Python and SQL',
      'Great problem-solving mindset & logic'
    ],
    skillsRequired: ['JavaScript', 'Python', 'SQL', 'HTML/CSS'],
    status: 'active',
    postedAt: 'Just now',
    applicantCount: 114,
  },
  {
    id: 'job_5',
    recruiterId: 'rec_1',
    title: 'Principal Lead DevOps & Cloud Architect',
    company: 'TechVenture Bangladesh Ltd.',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    salaryRange: '৳1,50,000 - ৳2,00,000/month',
    expRequired: '5+ Years',
    description: 'Manage infrastructure scaling, Kubernetes clusters, CI/CD pipelines, and zero-trust cloud security protocols across multi-cloud infrastructure for Bangladesh operations.',
    requirements: [
      '5+ years managing Kubernetes, AWS/GCP architecture',
      'Deep expertise in Terraform, Docker, CI/CD pipelines',
      'Strong monitoring setup (Prometheus, Grafana)',
      'Security compliance and infrastructure scaling mastery'
    ],
    skillsRequired: ['DevOps', 'Kubernetes', 'AWS', 'Docker', 'Python'],
    status: 'active',
    postedAt: '4 days ago',
    applicantCount: 15,
  },
  {
    id: 'job_6',
    recruiterId: 'rec_2',
    title: 'Mobile App Developer (React Native)',
    company: 'AppWave BD',
    companyLogo: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=200',
    location: 'Rajshahi, Bangladesh',
    type: 'Hybrid',
    salaryRange: '৳60,000 - ৳90,000/month',
    expRequired: '1-2 Years',
    description: 'Build cross-platform mobile applications for leading Bangladeshi fintech and e-commerce companies using React Native and Expo.',
    requirements: [
      '1+ years React Native experience',
      'Familiarity with Firebase, REST APIs',
      'iOS and Android deployment experience',
    ],
    skillsRequired: ['React Native', 'JavaScript', 'TypeScript', 'Firebase'],
    status: 'active',
    postedAt: '5 days ago',
    applicantCount: 37,
  },
  ...extraJobs,
];

export const mockApplications: Application[] = [
  {
    id: 'app_1',
    jobId: 'job_1',
    jobTitle: 'Senior Full Stack React & Node Engineer',
    company: 'TechVenture Bangladesh Ltd.',
    candidateId: 'cand_1',
    candidateName: 'Candidate User',
    candidateEmail: 'candidate@careerpulse.com.bd',
    candidatePhone: '+880 1712-345678',
    candidateAddress: 'Gulshan-2, Dhaka, Bangladesh',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    candidateSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'SQL'],
    candidateGithub: 'github.com/rafiquldev',
    stage: 'Interview Scheduled',
    atsMatchScore: 94,
    quizScore: 92,
    coverLetter: 'I am thrilled to apply for the Senior Full Stack Engineer role at TechVenture Bangladesh Ltd.',
    appliedAt: '2026-08-01',
    githubSummary: {
      topLanguages: ['TypeScript', 'JavaScript', 'Python', 'HTML'],
      contributionsThisYear: 1420,
      starCount: 384,
      topRepos: ['next-ai-resume-builder', 'fullstack-job-portal', 'react-kanban-board'],
      commitFrequency: 'Very Active (Daily average 6 commits)',
    },
  },
  {
    id: 'app_2',
    jobId: 'job_1',
    jobTitle: 'Senior Full Stack React & Node Engineer',
    company: 'TechVenture Bangladesh Ltd.',
    candidateId: 'cand_2',
    candidateName: 'Sumaiya Akter',
    candidateEmail: 'sumaiya@example.com',
    candidatePhone: '+880 1815-234567',
    candidateAddress: 'Dhanmondi, Dhaka, Bangladesh',
    candidateAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    candidateSkills: ['React', 'Node.js', 'JavaScript', 'CSS', 'MongoDB'],
    candidateGithub: 'github.com/sumaiyadev',
    stage: 'Shortlisted',
    atsMatchScore: 88,
    quizScore: 86,
    coverLetter: 'Experienced frontend developer eager to contribute my React expertise.',
    appliedAt: '2026-08-02',
    githubSummary: {
      topLanguages: ['JavaScript', 'React', 'CSS'],
      contributionsThisYear: 890,
      starCount: 142,
      topRepos: ['ecommerce-ui-kit', 'react-dashboard-template'],
      commitFrequency: 'Active (4-5 days/week)',
    },
  },
  {
    id: 'app_3',
    jobId: 'job_1',
    jobTitle: 'Senior Full Stack React & Node Engineer',
    company: 'TechVenture Bangladesh Ltd.',
    candidateId: 'cand_3',
    candidateName: 'Tanvir Ahmed',
    candidateEmail: 'tanvir@example.com',
    candidatePhone: '+880 1911-456789',
    candidateAddress: 'Mirpur, Dhaka, Bangladesh',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    candidateSkills: ['Node.js', 'Python', 'Docker', 'PostgreSQL'],
    candidateGithub: 'github.com/tanvirdev',
    stage: 'Screening',
    atsMatchScore: 78,
    quizScore: 80,
    coverLetter: 'Backend specialist with deep experience in scaling Node.js microservices.',
    appliedAt: '2026-08-03',
    githubSummary: {
      topLanguages: ['Python', 'TypeScript', 'Go'],
      contributionsThisYear: 610,
      starCount: 95,
      topRepos: ['fastapi-auth-starter', 'postgres-query-analyzer'],
      commitFrequency: 'Moderate (3-4 days/week)',
    },
  },
  {
    id: 'app_4',
    jobId: 'job_1',
    jobTitle: 'Senior Full Stack React & Node Engineer',
    company: 'TechVenture Bangladesh Ltd.',
    candidateId: 'cand_4',
    candidateName: 'Mahmudul Hasan',
    candidateEmail: 'mahmud@example.com',
    candidatePhone: '+880 1615-789012',
    candidateAddress: 'Chittagong, Bangladesh',
    candidateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    candidateSkills: ['HTML', 'CSS', 'JavaScript'],
    candidateGithub: 'github.com/mahmudhasan',
    stage: 'Applied',
    atsMatchScore: 62,
    quizScore: 68,
    coverLetter: 'Enthusiastic web developer looking to transition into full-stack engineering.',
    appliedAt: '2026-08-04',
    githubSummary: {
      topLanguages: ['JavaScript', 'HTML'],
      contributionsThisYear: 240,
      starCount: 12,
      topRepos: ['portfolio-website'],
      commitFrequency: 'Occasional',
    },
  },
  {
    id: 'app_5',
    jobId: 'job_1',
    jobTitle: 'Senior Full Stack React & Node Engineer',
    company: 'TechVenture Bangladesh Ltd.',
    candidateId: 'cand_5',
    candidateName: 'Nusrat Jahan',
    candidateEmail: 'nusrat@example.com',
    candidatePhone: '+880 1755-890123',
    candidateAddress: 'Sylhet, Bangladesh',
    candidateAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    candidateSkills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Node.js', 'SQL'],
    candidateGithub: 'github.com/nusratdev',
    stage: 'Offer Extended',
    atsMatchScore: 96,
    quizScore: 94,
    coverLetter: 'Senior frontend architect with a proven track record leading engineering teams.',
    appliedAt: '2026-07-28',
    githubSummary: {
      topLanguages: ['TypeScript', 'React', 'GraphQL', 'Rust'],
      contributionsThisYear: 1840,
      starCount: 520,
      topRepos: ['graphql-cache-client', 'react-accessible-primitives'],
      commitFrequency: 'Very Active (Daily)',
    },
  },
];

const generate50Questions = (skill: string) => {
  const baseQuestions = [
    {
      question: `What is the primary function of ${skill} in modern software architecture?`,
      options: [
        'To build scalable and efficient application logic',
        'To style pure legacy HTML elements without dynamic state',
        'To manage low-level hardware memory registers directly',
        'To compile assembly instructions into machine binary code'
      ],
      correctAnswer: 0,
      explanation: `${skill} is primarily used to build modern, efficient, and scalable software applications.`
    },
    {
      question: `Which feature best highlights the advantage of using ${skill}?`,
      options: [
        'Reusable modular architecture and strong ecosystem',
        'Inability to handle asynchronous network calls',
        'Single-threaded synchronous blocking execution only',
        'Lack of community documentation and tooling'
      ],
      correctAnswer: 0,
      explanation: `${skill} provides modular design, high performance, and an extensive ecosystem.`
    },
    {
      question: `In ${skill}, how is state or data binding typically managed?`,
      options: [
        'Through reactive data flow, props, or state hooks/stores',
        'By manually mutating global window objects directly',
        'By hardcoding absolute memory pointers',
        'State management is impossible in this technology'
      ],
      correctAnswer: 0,
      explanation: 'Modern state management relies on reactive hooks, data binding, or centralized stores.'
    },
    {
      question: `What is a common best practice when optimizing performance in ${skill}?`,
      options: [
        'Minimizing unnecessary re-computations & using memoization',
        'Loading all uncompressed static assets synchronously on startup',
        'Disabling browser caching and compression',
        'Running heavy tasks directly on the main UI execution thread'
      ],
      correctAnswer: 0,
      explanation: 'Performance optimization involves memoization, lazy loading, and avoiding heavy main-thread work.'
    },
    {
      question: `How does error handling typically operate within a ${skill} codebase?`,
      options: [
        'Using try/catch blocks, error boundaries, or middleware',
        'Errors automatically crash the system without logs',
        'Ignoring exceptions and returning null silently always',
        'By disabling compiler assertions completely'
      ],
      correctAnswer: 0,
      explanation: 'Robust applications catch exceptions using structured error boundaries and try/catch middleware.'
    }
  ];
  const full50 = [];
  for (let i = 1; i <= 50; i++) {
    const base = baseQuestions[(i - 1) % baseQuestions.length];
    full50.push({ id: i, question: `Q${i}. ${base.question} (${skill} Question #${i})`, options: base.options, correctAnswer: base.correctAnswer, explanation: base.explanation });
  }
  return full50;
};

export const mockQuizCategories: QuizCategory[] = [
  { id: 'quiz_react', title: 'React & Next.js Mastery Assessment', skillTag: 'React', questionsCount: 50, durationMinutes: 45, questions: generate50Questions('React & Next.js') },
  { id: 'quiz_python', title: 'Python & Data Structures 50-MCQ Quiz', skillTag: 'Python', questionsCount: 50, durationMinutes: 45, questions: generate50Questions('Python') },
  { id: 'quiz_node', title: 'Node.js & Backend Architecture 50-MCQ Quiz', skillTag: 'Node.js', questionsCount: 50, durationMinutes: 45, questions: generate50Questions('Node.js') },
  { id: 'quiz_sql', title: 'SQL & Database Optimization 50-MCQ Quiz', skillTag: 'SQL', questionsCount: 50, durationMinutes: 45, questions: generate50Questions('SQL') },
];

export const mockQuizLeaderboard: QuizSubmission[] = [
  { id: 'sub_1', candidateId: 'cand_5', candidateName: 'Nusrat Jahan', candidateAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', skill: 'React', score: 48, total: 50, percentage: 96, completedAt: '2026-08-03' },
  { id: 'sub_2', candidateId: 'cand_1', candidateName: 'Rafiqul Islam', candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', skill: 'React', score: 46, total: 50, percentage: 92, completedAt: '2026-08-02' },
  { id: 'sub_3', candidateId: 'cand_2', candidateName: 'Sumaiya Akter', candidateAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400', skill: 'React', score: 43, total: 50, percentage: 86, completedAt: '2026-08-01' },
  { id: 'sub_4', candidateId: 'cand_3', candidateName: 'Tanvir Ahmed', candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', skill: 'Node.js', score: 40, total: 50, percentage: 80, completedAt: '2026-07-30' },
];

export const mockMessages: Message[] = [
  { id: 'msg_1', senderId: 'rec_1', receiverId: 'cand_1', senderRole: 'recruiter', senderName: 'Lead Recruiter', text: 'Hi! We reviewed your profile and impressive ATS score. We\'d love to schedule a technical interview round with our lead architect.', createdAt: '10:30 AM', read: true },
  { id: 'msg_2', senderId: 'cand_1', receiverId: 'rec_1', senderRole: 'candidate', senderName: 'Candidate User', text: 'Thank you! I am really excited about this opportunity. I am available this Thursday or Friday afternoon.', createdAt: '10:34 AM', read: true },
];

export const mockCalendarSlots: CalendarSlot[] = [
  { id: 'slot_1', recruiterId: 'rec_1', candidateId: 'cand_1', candidateName: 'Rafiqul Islam', jobTitle: 'Senior Full Stack React & Node Engineer', date: '2026-08-06', time: '03:00 PM BST', meetLink: 'https://meet.google.com/abc-careerpulse-interview', status: 'confirmed' },
];

export const mockNotifications: NotificationItem[] = [
  { id: 'notif_1', userId: 'cand_1', title: 'Shortlisted for Interview!', message: 'Your application for Senior Full Stack React & Node Engineer has been moved to Interview Scheduled.', type: 'interview', isRead: false, createdAt: '10 min ago' },
  { id: 'notif_2', userId: 'cand_1', title: 'New Direct Message', message: 'Fatema Khatun sent you an interview calendar link.', type: 'message', isRead: false, createdAt: '1 hour ago' },
  { id: 'notif_3', userId: 'cand_1', title: '50-MCQ Skill Quiz Complete', message: 'You scored 92% (46/50) in React Mastery! Ranked #2 globally on leaderboard.', type: 'system', isRead: true, createdAt: 'Yesterday' },
];

export const mockCourses: Course[] = [
  { id: 'c_1', title: 'Advanced React & Next.js App Router Masterclass', category: 'Free Courses', provider: 'React Core Team', skillTag: 'React', rating: 4.9, url: 'https://react.dev/learn', duration: '12 Hours', price: 'Free' },
  { id: 'c_2', title: 'Node.js Microservices Architecture & Redis Caching', category: 'Paid Courses', provider: 'Udemy', skillTag: 'Node.js', rating: 4.8, url: 'https://udemy.com', duration: '24 Hours', price: '৳999' },
  { id: 'c_3', title: 'Official React Documentation & Server Components', category: 'Official Documentation', provider: 'React Core Team', skillTag: 'React', rating: 5.0, url: 'https://react.dev', duration: 'Self-Paced', price: 'Free' },
  { id: 'c_4', title: 'Full Stack Web Development Bootcamp (Complete Course)', category: 'YouTube Courses', provider: 'freeCodeCamp YouTube', skillTag: 'JavaScript', rating: 4.9, url: 'https://youtube.com/c/freecodecamp', duration: '18 Hours Video', price: 'Free' },
  { id: 'c_5', title: 'Python for Data Science and Machine Learning', category: 'Paid Courses', provider: 'Coursera', skillTag: 'Python', rating: 4.7, url: 'https://coursera.org', duration: '30 Hours', price: '৳1,499' },
  { id: 'c_6', title: 'PostgreSQL for Beginners to Advanced', category: 'YouTube Courses', provider: 'Traversy Media', skillTag: 'SQL', rating: 4.8, url: 'https://youtube.com', duration: '10 Hours Video', price: 'Free' },
];

export const mockFlaggedPosts: FlaggedPost[] = [
  { id: 'flag_1', jobId: 'job_99', jobTitle: 'Earn 50k/day Work From Home (Unverified)', company: 'Unknown Entity', reportedBy: 'User_492', reason: 'Suspected spam/phishing offer', status: 'pending', createdAt: '2 hours ago' },
];
