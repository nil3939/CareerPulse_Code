'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserRole } from '@/types';
import { 
  Sun, Moon, Bell, MessageSquare, Briefcase, UserCheck, 
  ShieldAlert, Sparkles, CheckCircle2, Menu, X, LogOut, LogIn, User
} from 'lucide-react';

interface NavbarProps {
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const { isAuthenticated, authUser, role, logout } = useAuth();
  
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string }> = {
    candidate: { label: 'Candidate', icon: UserCheck, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    recruiter: { label: 'Recruiter', icon: Briefcase, color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    admin: { label: 'Admin', icon: ShieldAlert, color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Quiz', href: '/quiz' },
    { name: 'About', href: '/about' },
  ];

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const IconComponent = roleLabels[role].icon;

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo (Acts as Refresh Button) */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
              className="flex items-center space-x-2 group cursor-pointer"
              title="CareerPulse — Click to refresh page"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
                C
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Career<span className="bg-gradient-to-r from-brand-600 to-red-500 bg-clip-text text-transparent">Pulse</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-brand-600 dark:text-red-400 bg-brand-50 dark:bg-slate-800'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {isAuthenticated && (
              <>
                {/* Role Badge - Locked to User's Registered Role */}
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold border shadow-xs ${roleLabels[role].color}`}>
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{roleLabels[role].label} View</span>
                </div>

                {/* Chat Launcher */}
                <button
                  onClick={onOpenChat}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors relative"
                  title="Real-Time Messaging"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </button>

                {/* Notification Tray */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-brand-600 text-white shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Bell className="w-4 h-4 text-brand-600 dark:text-red-400" /> Notifications
                        </h4>
                        {unreadCount > 0 && (
                          <button onClick={markAllNotificationsRead} className="text-xs font-semibold text-brand-600 dark:text-red-400 hover:underline">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 py-1">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-xs text-slate-400">No notifications yet</div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => markNotificationRead(n.id)}
                              className={`py-2.5 px-2 rounded-xl transition-colors cursor-pointer ${
                                !n.isRead ? 'bg-brand-50/50 dark:bg-slate-800/80 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</p>
                                <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Auth: User Avatar OR Login Button */}
            {isAuthenticated && authUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800"
                >
                  <img
                    src={authUser.avatar}
                    alt={authUser.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/20"
                  />
                  <div className="hidden xl:block text-left leading-tight">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {authUser.name}
                      {authUser.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">{role} Account</div>
                  </div>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{authUser.name}</p>
                      <p className="text-[10px] text-slate-400">{authUser.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <User className="w-3.5 h-3.5 text-brand-500" /> View & Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-red-500 hover:from-brand-700 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all"
              >
                <LogIn className="w-4 h-4" /> Sign In / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 top-16 bg-white dark:bg-slate-900 p-6 space-y-4 animate-in slide-in-from-top-4">
          <nav className="space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-base font-bold ${
                  pathname === link.href
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {isAuthenticated && authUser ? (
              <>
                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <img src={authUser.avatar} alt={authUser.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{authUser.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{role} Account</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> View & Edit Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full py-3 rounded-2xl bg-red-50 text-red-600 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-red-500 text-white font-bold text-sm shadow-md"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
