'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, Sparkles, BookOpen, Code2, Terminal, Cpu, Database, 
  ShieldCheck, Server, Smartphone, Search, ArrowRight, Loader2, CheckCircle2, 
  Send, Mic, Plus, ChevronRight, ExternalLink, Layers, GraduationCap, DollarSign, Table, Trash2
} from 'lucide-react';
import { getChatbotResponse, generateAIRoadmap } from '@/services/geminiService';
import { useAuth } from '@/context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

interface DetailedRoadmap {
  title: string;
  icon: any;
  overview: string;
  languages: string[];
  techStack: string[];
  phases: {
    phase: string;
    title: string;
    topics: string[];
  }[];
  resources: {
    title: string;
    type: 'Free Course' | 'Documentation' | 'Practice' | 'YouTube';
    url: string;
  }[];
  projectIdeas: string[];
  salaryBD: string;
}

export const AICareerGuidance: React.FC = () => {
  const { authUser } = useAuth();
  const userId = authUser?.id || 'guest';

  const [selectedTrack, setSelectedTrack] = useState<string>('Full-Stack Developer');
  const [activeTab, setActiveTab] = useState<'roadmap' | 'chatbot'>('roadmap');
  
  // AI Roadmap Generator State
  const [aiGeneratedRoadmaps, setAiGeneratedRoadmaps] = useState<Record<string, DetailedRoadmap>>({});
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState<boolean>(false);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');

  // Gemini CSE Chatbot State
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'gemini',
      text: `👋 **Welcome! I am your Gemini AI Computer Science & Career Assistant.**\n\nYou can ask me about any CSE topic (e.g. *C++, Data Structures, TCP vs UDP, OS Pointers, System Design*) or request custom career guidance!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load candidate specific chat history on mount & when userId changes
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      const savedUser = localStorage.getItem(`cp_ai_career_chat_${userId}`);
      const savedGeneric = localStorage.getItem('cp_ai_career_chat');
      const saved = savedUser || savedGeneric;

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatMessages(parsed);
          }
        } catch {}
      }
    }
  }, [userId]);

  // Save chat history bound to candidate user ID
  useEffect(() => {
    if (typeof window !== 'undefined' && chatMessages.length > 0 && userId) {
      localStorage.setItem(`cp_ai_career_chat_${userId}`, JSON.stringify(chatMessages));
      localStorage.setItem('cp_ai_career_chat', JSON.stringify(chatMessages));
    }
  }, [chatMessages, userId]);

  const handleClearHistory = () => {
    const defaultMsg: ChatMessage[] = [
      {
        id: 'msg_init',
        sender: 'gemini',
        text: `👋 **Welcome! I am your Gemini AI Computer Science & Career Assistant.**\n\nYou can ask me about any CSE topic (e.g. *C++, Data Structures, TCP vs UDP, OS Pointers, System Design*) or request custom career guidance!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setChatMessages(defaultMsg);
    if (typeof window !== 'undefined' && userId) {
      localStorage.removeItem(`cp_ai_career_chat_${userId}`);
      localStorage.removeItem('cp_ai_career_chat');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const careerTracks: Record<string, DetailedRoadmap> = {
    'Full-Stack Developer': {
      title: 'Full-Stack Software Developer',
      icon: Code2,
      overview: 'Master client-side interfaces, server-side APIs, database systems, and cloud deployment pipelines.',
      languages: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML5/CSS3'],
      techStack: ['React 18', 'Next.js 14 App Router', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Docker', 'Redis'],
      phases: [
        {
          phase: 'Phase 1',
          title: 'Foundations & Programming',
          topics: ['JavaScript ES6+ & TypeScript Syntax', 'Data Structures & Algorithms', 'Git & Version Control', 'DOM & Responsive Layouts']
        },
        {
          phase: 'Phase 2',
          title: 'Frontend Mastery',
          topics: ['React Components, Hooks & State', 'Next.js SSR & Server Components', 'Tailwind CSS Design Tokens', 'Client-side Performance Optimization']
        },
        {
          phase: 'Phase 3',
          title: 'Backend & Database Architecture',
          topics: ['REST APIs & GraphQL', 'Node.js Event Loop & Microservices', 'PostgreSQL Schema Design & Indexing', 'Redis Caching & Session Management']
        },
        {
          phase: 'Phase 4',
          title: 'DevOps & Production Launch',
          topics: ['Docker Containerization', 'CI/CD Pipelines with GitHub Actions', 'AWS/Vercel Cloud Deployment', 'System Monitoring & Error Tracking']
        }
      ],
      resources: [
        { title: 'Official Next.js Documentation', type: 'Documentation', url: 'https://nextjs.org/docs' },
        { title: 'Full Stack Open (University of Helsinki)', type: 'Free Course', url: 'https://fullstackopen.com/en/' },
        { title: 'FreeCodeCamp Responsive Web Design', type: 'Free Course', url: 'https://freecodecamp.org' },
        { title: 'PostgreSQL Official Manual', type: 'Documentation', url: 'https://postgresql.org/docs/' }
      ],
      projectIdeas: [
        'AI-Powered Job Application Platform with Kanban Screening',
        'Real-time Multi-room Chat & Collaboration App with WebSockets',
        'E-commerce Storefront with BKash/Nagad Payment Gateway & Admin Dashboard'
      ],
      salaryBD: '৳45,000 – ৳1,80,000+ / month (Dhaka / Remote BD)'
    },

    'Data Analyst / Data Scientist': {
      title: 'Data Analyst & Machine Learning Engineer',
      icon: Database,
      overview: 'Extract business insights from data, build predictive ML models, and design intelligent AI pipelines.',
      languages: ['Python', 'SQL', 'R', 'LaTeX'],
      techStack: ['Pandas', 'NumPy', 'Scikit-learn', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'Tableau', 'PowerBI', 'Jupyter'],
      phases: [
        {
          phase: 'Phase 1',
          title: 'Python & Statistical Fundamentals',
          topics: ['Python Data Structures & OOP', 'Linear Algebra & Calculus for ML', 'Probability & Descriptive Statistics', 'SQL Querying & Joins']
        },
        {
          phase: 'Phase 2',
          title: 'Data Manipulation & Visualization',
          topics: ['Pandas DataFrames & Cleaning', 'Matplotlib & Seaborn Plotting', 'Tableau & PowerBI Dashboards', 'Feature Engineering']
        },
        {
          phase: 'Phase 3',
          title: 'Machine Learning & AI Models',
          topics: ['Supervised & Unsupervised Learning', 'Regression, Classification & Clustering', 'Neural Networks & Deep Learning', 'Model Evaluation (Precision, Recall, F1)']
        },
        {
          phase: 'Phase 4',
          title: 'LLMs & Production MLOps',
          topics: ['RAG Architectures & Vector DBs', 'Fine-tuning LLMs with LoRA', 'FastAPI Model Deployment', 'Streamlit Interactive Apps']
        }
      ],
      resources: [
        { title: 'Kaggle Data Science Tutorials', type: 'Practice', url: 'https://kaggle.com' },
        { title: 'Andrew Ng Machine Learning Specialization', type: 'Free Course', url: 'https://coursera.org' },
        { title: 'Pandas Official User Guide', type: 'Documentation', url: 'https://pandas.pydata.org/docs/' },
        { title: 'PyTorch Tutorials', type: 'Documentation', url: 'https://pytorch.org/tutorials/' }
      ],
      projectIdeas: [
        'Customer Churn Prediction Dashboard using Scikit-Learn',
        'Bangla Sentiment Analysis AI Model with HuggingFace',
        'Stock Market Price Forecasting & Vector Search RAG Pipeline'
      ],
      salaryBD: '৳50,000 – ৳2,00,000+ / month (Dhaka / Global Remote)'
    },

    'DevOps & Cloud Architect': {
      title: 'DevOps & Cloud Systems Architect',
      icon: Server,
      overview: 'Automate deployment pipelines, orchestrate cloud infrastructure, and manage high-availability clusters.',
      languages: ['Bash/Shell', 'Python', 'Go', 'YAML', 'HCL (Terraform)'],
      techStack: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Terraform', 'Ansible', 'GitHub Actions', 'Prometheus', 'Grafana', 'Nginx'],
      phases: [
        {
          phase: 'Phase 1',
          title: 'Linux Systems & Shell Administration',
          topics: ['Linux SysAdmin & Command Line', 'Networking Basics (TCP/IP, DNS, HTTP)', 'Bash Scripting Automation', 'SSH & Security Permissions']
        },
        {
          phase: 'Phase 2',
          title: 'Containerization & Build Automation',
          topics: ['Docker Containers & Multi-stage Builds', 'Docker Compose Orchestration', 'CI/CD Pipelines with GitHub Actions', 'Artifact Management']
        },
        {
          phase: 'Phase 3',
          title: 'Kubernetes & Cloud Infrastructure',
          topics: ['Kubernetes Pods, Services & Ingress', 'Helm Package Manager', 'Infrastructure as Code with Terraform', 'AWS EC2, S3, RDS, IAM Security']
        },
        {
          phase: 'Phase 4',
          title: 'Monitoring, Security & Reliability',
          topics: ['Prometheus Metrics & Grafana Dashboards', 'Log Aggregation (ELK Stack / Loki)', 'Zero-Trust Cloud Architecture', 'Chaos Engineering']
        }
      ],
      resources: [
        { title: 'Kubernetes Official Documentation', type: 'Documentation', url: 'https://kubernetes.io/docs/' },
        { title: 'DevOps Roadmap (roadmap.sh)', type: 'Practice', url: 'https://roadmap.sh/devops' },
        { title: 'Terraform Learn Guides', type: 'Documentation', url: 'https://developer.hashicorp.com/terraform/tutorials' },
        { title: 'Docker Captain YouTube Masterclass', type: 'YouTube', url: 'https://youtube.com' }
      ],
      projectIdeas: [
        'Zero-Downtime Rolling Kubernetes Deployment for Microservices',
        'Terraform AWS Multi-Region Infrastructure Provisioning',
        'Automated Security Vulnerability Scanning CI/CD Pipeline'
      ],
      salaryBD: '৳60,000 – ৳2,50,000+ / month (Dhaka / Global Remote)'
    },

    'Cyber Security Specialist': {
      title: 'Cyber Security & Ethical Hacking Specialist',
      icon: ShieldCheck,
      overview: 'Protect software systems, perform penetration testing, analyze security threats, and ensure regulatory compliance.',
      languages: ['Python', 'C/C++', 'Bash', 'PowerShell', 'SQL'],
      techStack: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Metasploit', 'Nmap', 'OWASP Top 10', 'Splunk', 'Snort'],
      phases: [
        {
          phase: 'Phase 1',
          title: 'Networking & OS Security Fundamentals',
          topics: ['TCP/IP Stack, Subnetting & Routing', 'Linux/Windows Internal Security', 'Cryptography (AES, RSA, Hashing)', 'Network Protocol Analysis']
        },
        {
          phase: 'Phase 2',
          title: 'Web Application Security',
          topics: ['OWASP Top 10 Vulnerabilities', 'SQL Injection, XSS, CSRF Testing', 'Burp Suite Interception', 'API Security Auditing']
        },
        {
          phase: 'Phase 3',
          title: 'Penetration Testing & Exploitation',
          topics: ['Nmap Network Scanning', 'Metasploit Framework Exploits', 'Privilege Escalation Techniques', 'Reverse Engineering Basics']
        },
        {
          phase: 'Phase 4',
          title: 'Defensive Security & Incident Response',
          topics: ['SIEM Logging with Splunk', 'Snort Intrusion Detection', 'Threat Hunting & Malware Analysis', 'ISO 27001 Security Standards']
        }
      ],
      resources: [
        { title: 'TryHackMe Cybersecurity Labs', type: 'Practice', url: 'https://tryhackme.com' },
        { title: 'Hack The Box Penetration Testing', type: 'Practice', url: 'https://hackthebox.com' },
        { title: 'OWASP Foundation Guides', type: 'Documentation', url: 'https://owasp.org' }
      ],
      projectIdeas: [
        'Automated Web Vulnerability Scanner written in Python',
        'SIEM Security Log Monitoring Dashboard with Splunk',
        'CTF (Capture The Flag) Penetration Test Audit Report'
      ],
      salaryBD: '৳55,000 – ৳2,20,000+ / month (Dhaka / Remote)'
    },

    'Mobile App Developer': {
      title: 'Cross-Platform Mobile Application Engineer',
      icon: Smartphone,
      overview: 'Build high-performance iOS and Android applications with fluid animations and native device integration.',
      languages: ['TypeScript', 'Dart', 'Kotlin', 'Swift'],
      techStack: ['React Native', 'Expo', 'Flutter', 'Firebase', 'SQLite', 'Redux Toolkit', 'Tailwind / NativeWind', 'App Store / Play Store'],
      phases: [
        {
          phase: 'Phase 1',
          title: 'Mobile Programming Foundations',
          topics: ['TypeScript & Modern ES6+', 'Dart & Object-Oriented Patterns', 'Async Programming & Futures', 'Mobile UI Layout Constraints']
        },
        {
          phase: 'Phase 2',
          title: 'Framework Mastery (React Native / Flutter)',
          topics: ['Component Lifecycle & State', 'Navigation Systems (React Navigation / GoRouter)', 'Styling & Dark Mode System Tokens', 'Offline Storage with SQLite / MMKV']
        },
        {
          phase: 'Phase 3',
          title: 'Native Device Integration & APIs',
          topics: ['Camera, GPS Location & Biometrics', 'Push Notifications (FCM / OneSignal)', 'REST & GraphQL API Integration', 'Native Modules & Bridges']
        },
        {
          phase: 'Phase 4',
          title: 'Testing & App Store Publishing',
          topics: ['Jest & React Native Testing Library', 'Fastlane Automation', 'Google Play Console & Apple App Store Publishing', 'Crashlytics Performance Monitoring']
        }
      ],
      resources: [
        { title: 'React Native Official Docs', type: 'Documentation', url: 'https://reactnative.dev/docs' },
        { title: 'Flutter Official Documentation', type: 'Documentation', url: 'https://flutter.dev/docs' },
        { title: 'Firebase Mobile Guide', type: 'Documentation', url: 'https://firebase.google.com/docs/mobile' }
      ],
      projectIdeas: [
        'Fintech Mobile Wallet with QR Payments & Expense Analytics',
        'Fitness Tracking App with GPS Map Routes & Sensor Data',
        'Real-time Ride Sharing App with Driver Location Tracking'
      ],
      salaryBD: '৳45,000 – ৳1,70,000+ / month (Dhaka / Remote)'
    },

    'Network & Systems Engineer': {
      title: 'Network & Systems Infrastructure Engineer',
      icon: Terminal,
      overview: 'Design enterprise network topology, configure routers and switches, manage firewalls, and ensure uptime.',
      languages: ['Cisco CLI', 'Python', 'Bash', 'PowerShell'],
      techStack: ['Cisco Packet Tracer', 'GNS3', 'Wireshark', 'PFsense', 'MikroTik', 'Linux Kernel', 'Windows Server AD'],
      phases: [
        {
          phase: 'Phase 1',
          title: 'Network Protocol Fundamentals',
          topics: ['OSI 7-Layer Model & TCP/IP Stack', 'IP Addressing, VLSM & Subnetting', 'Ethernet, VLANs & Trunking (802.1Q)', 'DNS, DHCP & NAT Protocols']
        },
        {
          phase: 'Phase 2',
          title: 'Routing & Switching Configuration',
          topics: ['Cisco IOS CLI Navigation', 'OSPF & BGP Routing Protocols', 'Spanning Tree Protocol (STP)', 'Router & Switch Hardening']
        },
        {
          phase: 'Phase 3',
          title: 'Firewall & Network Security',
          topics: ['MikroTik & PFsense Configuration', 'IPsec & OpenVPN Tunneling', 'Access Control Lists (ACLs)', 'DDoS Protection & Traffic Shaping']
        },
        {
          phase: 'Phase 4',
          title: 'Enterprise Infrastructure & Cloud Networks',
          topics: ['Active Directory & LDAP Domain Control', 'Software-Defined Networking (SDN)', 'Fiber Optic & Wireless Network Design', 'Network Disaster Recovery']
        }
      ],
      resources: [
        { title: 'Cisco Networking Academy (NetAcad)', type: 'Free Course', url: 'https://netacad.com' },
        { title: 'Wireshark Official User Guide', type: 'Documentation', url: 'https://wireshark.org/docs/' },
        { title: 'MikroTik Documentation Wiki', type: 'Documentation', url: 'https://wiki.mikrotik.com' }
      ],
      projectIdeas: [
        'Enterprise Multi-VLAN Office Network Simulation with OSPF',
        'Site-to-Site IPsec VPN Tunnel Setup between Branch Offices',
        'Network Traffic Analysis & Bandwidth Optimization Audit'
      ],
      salaryBD: '৳40,000 – ৳1,60,000+ / month (Dhaka / Chittagong / Remote)'
    }
  };

  const selectedRoadmap = aiGeneratedRoadmaps[selectedTrack] || careerTracks[selectedTrack] || {
    title: `${selectedTrack} Specialist`,
    icon: Sparkles,
    overview: `Master key programming tools, software architecture, and production workflows for ${selectedTrack}.`,
    languages: ['TypeScript', 'Python', 'C++', 'SQL'],
    techStack: ['Core Frameworks', 'System Architecture', 'Database Systems', 'Cloud DevOps'],
    phases: [
      { phase: 'Phase 1', title: 'Foundations & Basics', topics: ['Syntax & Core Concepts', 'Data Structures & Algorithms', 'Version Control with Git'] },
      { phase: 'Phase 2', title: 'Core Frameworks & Tools', topics: ['Primary Role Frameworks', 'API & Database Integration', 'Tooling & Testing'] },
      { phase: 'Phase 3', title: 'Advanced Concepts', topics: ['System Design & Performance', 'Security Best Practices', 'Optimization & Scaling'] },
      { phase: 'Phase 4', title: 'Production & Portfolio', topics: ['CI/CD Pipelines', 'Cloud Deployment', 'Portfolio Projects'] }
    ],
    resources: [
      { title: 'FreeCodeCamp Interactive Learning', type: 'Free Course', url: 'https://freecodecamp.org' },
      { title: 'MDN Developer Documentation', type: 'Documentation', url: 'https://developer.mozilla.org' }
    ],
    projectIdeas: [
      `Production-ready ${selectedTrack} application with real-time features`,
      `Scalable REST API & Microservices platform`,
      `End-to-end portfolio project for BD tech market`
    ],
    salaryBD: '৳45,000 – ৳1,80,000+ / month (Dhaka / Remote BD)'
  };

  const handleSendChatMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const replyText = await getChatbotResponse(textToSend, 'candidate');
      const geminiMsg: ChatMessage = {
        id: `gem_${Date.now()}`,
        sender: 'gemini',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, geminiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `gem_${Date.now()}`,
        sender: 'gemini',
        text: `🤖 **Gemini AI Reply for "${textToSend}":**\n\nThis is a fundamental Computer Science concept. In system engineering, choose between speed, reliability, and architectural trade-offs depending on your production requirements.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectOrGenerateRoadmap = async (trackKey: string) => {
    setSelectedTrack(trackKey);
    
    // Check if AI roadmap is already generated
    if (!aiGeneratedRoadmaps[trackKey]) {
      setIsGeneratingRoadmap(true);
      try {
        const aiData = await generateAIRoadmap(trackKey);
        const matchingIcon = careerTracks[trackKey]?.icon || Sparkles;

        const formattedRoadmap: DetailedRoadmap = {
          title: aiData.title || trackKey,
          icon: matchingIcon,
          overview: aiData.overview,
          salaryBD: aiData.salaryBD || '৳45,000 – ৳1,80,000+ / month (Dhaka / Remote BD)',
          languages: aiData.languages || ['TypeScript', 'Python', 'SQL'],
          techStack: aiData.techStack || ['React', 'Next.js', 'PostgreSQL', 'Docker'],
          phases: aiData.phases || [],
          resources: aiData.resources || [],
          projectIdeas: aiData.projectIdeas || []
        };

        setAiGeneratedRoadmaps(prev => ({ ...prev, [trackKey]: formattedRoadmap }));
      } catch (err) {
        console.error('Error generating AI roadmap:', err);
      } finally {
        setIsGeneratingRoadmap(false);
      }
    }
  };

  // Render text with bold formatting
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split('**').map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-black text-slate-900 dark:text-white">{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-red-950/60 dark:text-red-300 border border-brand-200 dark:border-red-800 text-xs font-bold mb-1">
            <Compass className="w-3.5 h-3.5 text-brand-500" /> Powered by Gemini AI Model
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            AI CSE Career Guidance & Real-Time Gemini Agent
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full interactive tech career roadmaps and real-time Gemini AI chat agent for any CSE topic.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Full Career Roadmaps
          </button>

          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'chatbot'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Ask Gemini AI Agent
          </button>
        </div>
      </div>

      {/* VIEW 1: FULL INTERACTIVE CAREER ROADMAP GENERATOR */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Select Tech Track Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Select a Tech Career Track to View Interactive Roadmap:
              </h3>
              {isGeneratingRoadmap && (
                <span className="text-xs font-bold text-brand-600 dark:text-red-400 flex items-center gap-1.5 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating AI Roadmap...
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.keys(careerTracks).map(trackKey => {
                const track = careerTracks[trackKey];
                const IconComp = track.icon;
                const isSelected = selectedTrack === trackKey;
                return (
                  <button
                    key={trackKey}
                    onClick={() => handleSelectOrGenerateRoadmap(trackKey)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center text-center space-y-1.5 ${
                      isSelected
                        ? 'bg-brand-500 text-white border-brand-600 shadow-md ring-2 ring-brand-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="text-[11px] font-bold leading-tight">{trackKey}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom AI Role Generator Input */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Or type any custom role (e.g. AI/ML Engineer, Game Dev, Embedded Systems)..."
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customRoleInput.trim()) {
                      handleSelectOrGenerateRoadmap(customRoleInput.trim());
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
              <button
                onClick={() => customRoleInput.trim() && handleSelectOrGenerateRoadmap(customRoleInput.trim())}
                disabled={isGeneratingRoadmap || !customRoleInput.trim()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
              >
                {isGeneratingRoadmap ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate AI Roadmap
              </button>
            </div>
          </div>

          {/* ROADMAP DASHBOARD DISPLAY */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-6 relative overflow-hidden">
            
            {/* Loading Overlay when generating AI Roadmap */}
            {isGeneratingRoadmap && (
              <div className="absolute inset-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-red-950/70 text-brand-600 dark:text-red-400 flex items-center justify-center animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Generating AI Tech Roadmap...</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Google Gemini AI is customizing career milestones, tools, and project ideas for <span className="font-bold text-brand-600 dark:text-red-400">"{selectedTrack}"</span>.
                  </p>
                </div>
              </div>
            )}
            
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="space-y-1">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-100 text-brand-700 dark:bg-red-950 dark:text-red-300 uppercase flex items-center gap-1 w-max">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {aiGeneratedRoadmaps[selectedTrack] ? 'AI-Generated Gemini Roadmap' : 'Verified Tech Roadmap'}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {selectedRoadmap.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  {selectedRoadmap.overview}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs flex-shrink-0">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">BANGLADESH SALARY RANGE</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{selectedRoadmap.salaryBD}</span>
              </div>
            </div>

            {/* Core Languages & Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-brand-500" /> Core Programming Languages
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedRoadmap.languages.map(lang => (
                    <span key={lang} className="px-3 py-1 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 dark:bg-red-950/40 dark:text-red-300 border border-brand-200 dark:border-red-800">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" /> Essential Frameworks & Tools
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedRoadmap.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 4-Phase Step-by-Step Milestones */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-500" /> Step-by-Step Learning Milestones
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedRoadmap.phases.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {p.phase}
                      </span>
                    </div>
                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">{p.title}</h5>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {p.topics.map((t, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Resources & Documentation */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" /> Curated Courses & Official Documentation
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {selectedRoadmap.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 w-max">
                      {res.type}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-500 flex items-center justify-between">
                      {res.title}
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </h5>
                  </a>
                ))}
              </div>
            </div>

            {/* Portfolio Project Ideas */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-500" /> Recommended Portfolio Project Ideas
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedRoadmap.projectIdeas.map((idea, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-red-950 text-brand-600 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{idea}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: REAL-TIME GEMINI AI CSE CHATBOT AGENT (UI Styled like official Gemini!) */}
      {activeTab === 'chatbot' && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Chat Canvas (Dark Mode Gemini Theme) */}
          <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-4 sm:p-6 space-y-4 min-h-[480px] flex flex-col justify-between">
            
            {/* Top Gemini Agent Banner */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Gemini 2.5 Flash Real-Time AI Agent</h3>
                  <p className="text-[10px] text-slate-400">Ask any Computer Science topic, request full tech roadmaps, or interview prep</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearHistory}
                  title="Clear Chat History"
                  className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 transition-colors flex items-center gap-1 border border-slate-700 font-medium"
                >
                  <Trash2 className="w-3 h-3" /> Clear History
                </button>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-900 text-emerald-400 border border-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Gemini 2.5 Flash Online
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 max-h-[420px] pr-2 custom-scrollbar">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 space-y-1.5 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-red-500 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.sender === 'gemini' && (
                      <div className="flex items-center space-x-1.5 text-brand-400 font-extrabold text-[11px] mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Gemini 2.5 Flash Agent</span>
                      </div>
                    )}

                    <div className="text-xs leading-relaxed font-sans">
                      {renderFormattedText(msg.text)}
                    </div>

                    <span className="text-[9px] text-slate-400 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center space-x-3 text-slate-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                    <span>Gemini 2.5 Flash Agent is analyzing and generating response...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Topic Prompts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-800">
              {[
                'Generate Full Roadmap for Data Science & AI ML',
                'Generate Full Roadmap for DevOps & Cloud Engineering',
                'Generate Full Roadmap for Cyber Security & Ethical Hacking',
                'TCP vs UDP networking protocols comparison',
                'Explain C++ pointers, references, and memory allocation',
                'Database Normalization (1NF, 2NF, 3NF, BCNF)',
                'Operating System Process vs Thread & Scheduling'
              ].map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChatMessage(promptText)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white whitespace-nowrap transition-colors flex-shrink-0"
                >
                  💡 {promptText}
                </button>
              ))}
            </div>

            {/* FLOATING GEMINI CHAT INPUT BAR (Matches user screenshot) */}
            <form onSubmit={e => { e.preventDefault(); handleSendChatMessage(); }} className="relative flex items-center">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask Gemini any CSE topic (e.g. C++, DSA, OS, Compiler, Networking...)"
                className="w-full pl-5 pr-28 py-3.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-inner"
              />

              <div className="absolute right-3 flex items-center space-x-2">
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                  Flash 1.5 Extended
                </span>
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  className="p-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-md disabled:opacity-40 transition-transform hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

    </div>
  );
};
