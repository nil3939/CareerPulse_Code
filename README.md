# 🚀 CareerPulse — AI-Powered Job & Career Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://careerpulse-gamma.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![OpenRouter AI](https://img.shields.io/badge/OpenRouter_AI-Gemini_2.0-7C3AED?style=for-the-badge)](https://openrouter.ai/)

> **CareerPulse** is an end-to-end, AI-powered job application, candidate evaluation, and career guidance platform built specifically for Bangladesh's growing tech ecosystem.

---

## 🌟 Key Features

### 👤 Candidate Experience
- 📄 **AI ATS Resume Checker & Cover Letter Generator**: Upload `.pdf` or `.txt` resumes to receive an instant ATS match %, bullet point suggestions, executive summary card, and full 4-paragraph cover letter tailored to any job.
- 🗺️ **Interactive AI Tech Roadmaps**: Generate step-by-step career learning milestones, core programming languages, frameworks, salary ranges (BDT ৳), and portfolio project ideas for **any tech role** (*Full-Stack, Game Dev, Data Science, AI/ML, Cyber Security, etc.*).
- 🎙️ **Voice AI Mock Interviewer**: Practice real-time technical interviews using Web Speech API speech-to-text recording with instant AI feedback on technical accuracy and communication tone.
- 💬 **Two-Way Recruiter Messaging**: Communicate directly with recruiters regarding application status, interview schedules, and offer letters.
- 🏆 **50-MCQ Skill Quizzes & Leaderboard**: Take timed technical skill quizzes (React, Python, Node.js, DSA) with dynamic score updates on candidate profiles.

### 🏢 Recruiter Experience
- 📊 **6-Stage Interactive Kanban Pipeline**: Evaluate candidates across `Applied` ➔ `Screening` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Offer Extended` ➔ `Hired`. Candidates are strictly filtered by recruiter job ownership.
- 📝 **Job Posting Management**: Post new job openings with skill tags, salary ranges in BDT, and experience requirements.
- 📅 **Calendar Interview Scheduler**: Schedule Google Meet interview slots directly with candidates.
- 🐙 **AI GitHub Portfolio Summarizer**: View AI-generated summaries of candidate GitHub commits, top languages, and star counts.

### 🛡️ Admin Control Panel
- 🔍 **Job Posting Moderation**: Review and approve pending recruiter job listings (`status: 'pending'` ➔ `'active'`).
- 🏢 **Recruiter Company Verification**: Verify recruiter office profiles and manage flagged job posts.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React Icons, Canvas Confetti.
- **Backend API Server**: Next.js Server API Routes (`/api/auth`, `/api/jobs`, `/api/applications`, `/api/messages`, `/api/ai/chat`).
- **Database**: MongoDB Atlas Cloud Database (`mongoose` ODM).
- **AI Models**: OpenRouter API (`openrouter/free` auto-routing to Google Gemini 2.0 Flash Lite & DeepSeek R1).
- **Hosting**: Vercel Cloud Platform with continuous deployment via GitHub.

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in your root folder:

```env
# MongoDB Atlas Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/careerpulse?retryWrites=true&w=majority

# OpenRouter Free AI Config
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=openrouter/free
```

---

## 💻 Local Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nil3939/careerpulse.git
   cd careerpulse
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 Live Deployment

Live Web Application: **[https://careerpulse-gamma.vercel.app](https://careerpulse-gamma.vercel.app)**
