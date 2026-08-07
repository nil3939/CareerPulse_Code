'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatDrawer } from '@/components/messaging/ChatDrawer';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockQuizCategories } from '@/data/mockData';
import { QuizCategory, QuizQuestion } from '@/types';
import { Trophy, Clock, CheckCircle2, Award, Sparkles, ArrowRight, RotateCcw, AlertCircle, Lock, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizPage() {
  const { addQuizSubmission, currentUser } = useApp();
  const { isAuthenticated, role } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<QuizCategory>(mockQuizCategories[0]);
  const [inProgress, setInProgress] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(45 * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<{ score: number; total: number; percentage: number } | null>(null);

  useEffect(() => {
    let timer: any;
    if (inProgress && !isCompleted && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && inProgress && !isCompleted) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [inProgress, isCompleted, timeLeftSeconds]);

  const handleStartQuiz = (cat: QuizCategory) => {
    if (!isAuthenticated || role !== 'candidate') return;
    setActiveCategory(cat);
    setInProgress(true);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeftSeconds(cat.durationMinutes * 60);
    setIsCompleted(false);
    setFinalScore(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    const questions = activeCategory.questions;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    setFinalScore({ score, total: questions.length, percentage });
    setIsCompleted(true);
    setInProgress(false);

    if (percentage >= 70) {
      try {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      } catch {
        // fallback
      }
    }

    addQuizSubmission({
      skill: activeCategory.skillTag,
      score,
      total: questions.length,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCandidate = isAuthenticated && role === 'candidate';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onOpenChat={() => setChatOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> Standardized 50-MCQ Skill Assessments
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Validate Engineering Skills with Timed Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Pass production-grade 50-MCQ assessments in React, Python, Node.js, and SQL to earn verified badge metrics on your candidate profile.
          </p>
        </div>

        {/* Access Restriction Alert for Non-Candidates */}
        {!isCandidate && (
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Candidate-Only Assessment Center</h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  Quiz participation and leaderboard rankings are reserved for Candidate accounts. Please sign in as a Candidate to take quizzes.
                </p>
              </div>
            </div>
          </div>
        )}

        {!inProgress && !isCompleted && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockQuizCategories.map(cat => (
              <div
                key={cat.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                    {cat.skillTag}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{cat.title}</h3>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-500" /> {cat.questionsCount} Questions</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" /> {cat.durationMinutes} mins</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(cat)}
                  disabled={!isCandidate}
                  className={`w-full py-3 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105 ${
                    isCandidate
                      ? 'bg-gradient-to-r from-brand-600 to-red-500 text-white shadow-red-500/20'
                      : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {isCandidate ? <><Sparkles className="w-4 h-4" /> Start 50-MCQ Assessment</> : <><Lock className="w-4 h-4" /> Candidates Only</>}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* In-Progress Quiz State */}
        {inProgress && !isCompleted && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-100 text-brand-700 dark:bg-red-950 dark:text-red-300">
                  {activeCategory.title}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Question {currentQIndex + 1} of {activeCategory.questions.length}
                </h3>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono font-bold text-sm border border-amber-200 dark:border-amber-800">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {activeCategory.questions[currentQIndex].question}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {activeCategory.questions[currentQIndex].options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-50 text-brand-900 dark:bg-red-950/60 dark:text-red-200 border-brand-500 ring-2 ring-brand-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-red-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold disabled:opacity-30"
              >
                Previous
              </button>

              {currentQIndex === activeCategory.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Submit Assessment & Score
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQIndex(prev => Math.min(activeCategory.questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold flex items-center gap-1"
                >
                  Next Question <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completed Quiz Results State */}
        {isCompleted && finalScore && (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center max-w-xl mx-auto space-y-6 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center border-4 border-amber-200 dark:border-amber-800 shadow-lg">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Assessment Complete!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You scored <span className="font-extrabold text-slate-800 dark:text-slate-200">{finalScore.score}</span> out of <span className="font-extrabold text-slate-800 dark:text-slate-200">{finalScore.total}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-3xl font-black text-brand-600 dark:text-red-400">{finalScore.percentage}%</div>
              <p className="text-xs text-slate-500 mt-1">Overall Skill Mastery Score</p>
            </div>

            <button
              onClick={() => setIsCompleted(false)}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> Retake Another Skill Quiz
            </button>
          </div>
        )}

      </main>

      <Footer />
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
