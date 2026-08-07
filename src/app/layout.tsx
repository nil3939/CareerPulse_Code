import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProviders';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'CareerPulse | #1 AI-Powered Job Platform in Bangladesh',
  description: "Bangladesh's #1 AI-Powered Job Platform. AI Resume Checker, ATS scoring, Mock Interviews, Skill Quizzes, Recruiter Pipeline, Gemini AI Chatbot, and Real-Time Messaging.",
  keywords: 'jobs Bangladesh, Dhaka jobs, software engineer jobs BD, AI resume checker, career platform Bangladesh, CareerPulse',
  openGraph: {
    title: 'CareerPulse | #1 AI-Powered Job Platform in Bangladesh',
    description: 'Find your dream tech job in Dhaka, Chittagong, Sylhet. AI-powered matching, ATS resume scoring, and Gemini AI career guidance.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
