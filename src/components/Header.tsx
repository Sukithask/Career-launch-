import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  User,
  Settings as SettingsIcon,
  LogOut,
  Download,
  RotateCcw
} from 'lucide-react';
import { ActivePage, CareerLaunchData } from '../types';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  data: CareerLaunchData;
  onToggleMobileMenu: () => void;
  onLogout: () => void;
  onResetDemo: () => void;
  onExport: () => void;
}

const PAGE_TITLES: Record<ActivePage, { title: string; subtitle: string }> = {
  dashboard: { title: 'Placement Overview', subtitle: 'Real-time metrics, upcoming tasks, and preparation readiness' },
  coding: { title: 'Coding Tracker', subtitle: 'DSA problem solving logs, topics, and algorithmic solutions' },
  aptitude: { title: 'Aptitude Practice', subtitle: 'Quantitative, logical reasoning, and verbal timed assessments' },
  applications: { title: 'Application Pipeline', subtitle: 'Track on-campus and off-campus recruitment stages' },
  companies: { title: 'Company Preparation', subtitle: 'Hiring patterns, interview rounds, and tailored checklists' },
  interviews: { title: 'Interview Preparation', subtitle: 'Technical, behavioral, and HR questions with STAR answers' },
  resume: { title: 'Placement Resume Builder', subtitle: 'Single-page ATS-optimized resume generator with live preview' },
  progress: { title: 'Analytics & Progress', subtitle: 'Preparation streak, category mastery, and conversion rates' },
  settings: { title: 'Settings & Data', subtitle: 'Profile preferences, local data management, and backups' },
  lab: { title: 'Practice Lab & Hardware Bench', subtitle: 'Live JavaScript/DSA execution, BenchTwin digital circuits, and cognitive brain games' }
};

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  data,
  onToggleMobileMenu,
  onLogout,
  onResetDemo,
  onExport
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // Generate dynamic contextual notifications from current data
  const upcomingInterview = data.applications.find((a) => a.interviewDate && a.status.includes('Interview'));
  const unsolvedCodingCount = data.codingQuestions.filter((q) => !q.solved).length;

  const notifications = [
    ...(upcomingInterview
      ? [
          {
            id: 'n1',
            title: `Interview Scheduled: ${upcomingInterview.companyName}`,
            detail: `${upcomingInterview.position} on ${upcomingInterview.interviewDate}`,
            time: 'Upcoming'
          }
        ]
      : []),
    {
      id: 'n2',
      title: 'Daily Goal Check',
      detail: `You have ${unsolvedCodingCount} unsolved coding problems in your queue.`,
      time: 'Today'
    },
    {
      id: 'n3',
      title: 'Local Storage Synced',
      detail: 'All updates are stored automatically in your browser localStorage.',
      time: 'Local'
    }
  ];

  const pageInfo = PAGE_TITLES[activePage] || { title: 'CareerLaunch', subtitle: 'Placement Preparation' };

  return (
    <header className="sticky top-0 z-20 bg-[#FBF8F2]/95 backdrop-blur-md border-b border-[rgba(56,37,28,0.14)] px-4 sm:px-6 py-3.5 no-print">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger, Mobile Logo & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 -ml-1 text-[#38251C] hover:bg-[#E6D8C7]/50 rounded-md transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="md:hidden">
            <BrandLogo size="sm" showText={false} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#171411] tracking-tight flex items-center gap-2">
              {pageInfo.title}
            </h1>
            <p className="hidden sm:block text-xs text-[#82786F]">{pageInfo.subtitle}</p>
          </div>
        </div>

        {/* Right: Actions, Date, Dev Mode Badge, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Date pill */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#82786F] font-medium px-2.5 py-1 rounded bg-[#E6D8C7]/40 border border-[rgba(56,37,28,0.08)]">
            <Calendar className="w-3.5 h-3.5 text-[#76533C]" />
            <span>{todayFormatted}</span>
          </div>

          {/* Local Dev Mode status indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E6D8C7]/70 text-[#38251C] border border-[rgba(56,37,28,0.14)] text-xs font-semibold"
            title="Local Prototype Mode: All data stored in localStorage without external cloud dependencies."
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#69745E]" />
            <span className="hidden xs:inline">Local Dev</span>
          </div>

          {/* Theme & Palette Toggle */}
          <ThemeToggle />

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#38251C] hover:bg-[#E6D8C7]/50 rounded-md transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#985F51]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-[#FBF8F2] border border-[rgba(56,37,28,0.2)] rounded-lg shadow-xl p-3 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(56,37,28,0.12)]">
                  <span className="text-xs font-bold text-[#171411] tracking-wide uppercase">
                    Preparation Alerts
                  </span>
                  <span className="text-[11px] text-[#82786F]">{notifications.length} alerts</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded bg-[#EFE5D6]/60 border border-[rgba(56,37,28,0.08)] text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-semibold text-[#171411]">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-[#82786F] font-normal">{n.time}</span>
                      </div>
                      <p className="text-[#82786F] text-[11px] leading-relaxed">{n.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Quick Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-[#E6D8C7]/50 transition-colors"
              aria-label="User profile options"
            >
              <div className="w-8 h-8 rounded-md bg-[#38251C] text-[#FBF8F2] text-xs font-semibold flex items-center justify-center">
                {data.profile?.avatarText || 'ST'}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#FBF8F2] border border-[rgba(56,37,28,0.2)] rounded-lg shadow-xl py-1 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-3.5 py-2.5 border-b border-[rgba(56,37,28,0.12)]">
                  <p className="text-xs font-bold text-[#171411] truncate">{data.profile?.name || 'Aarav Sharma'}</p>
                  <p className="text-[11px] text-[#82786F] truncate">{data.profile?.email || 'aarav.sharma@campus.edu'}</p>
                </div>
                <div className="py-1 text-xs text-[#39332E]">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#E6D8C7]/60 text-left transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-[#76533C]" />
                    <span>Account & Preferences</span>
                  </button>
                  <button
                    onClick={() => {
                      onExport();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#E6D8C7]/60 text-left transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#76533C]" />
                    <span>Export JSON Backup</span>
                  </button>
                  <button
                    onClick={() => {
                      onResetDemo();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#E6D8C7]/60 text-left transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#76533C]" />
                    <span>Reset Starter Demo Data</span>
                  </button>
                  <div className="my-1 border-t border-[rgba(56,37,28,0.12)]" />
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#985F51]/10 text-[#985F51] text-left transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
