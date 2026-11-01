import React from 'react';
import {
  LayoutDashboard,
  Code2,
  BrainCircuit,
  Briefcase,
  Building2,
  Users,
  FileText,
  LineChart,
  Settings,
  LogOut,
  GraduationCap,
  Cpu
} from 'lucide-react';
import { ActivePage, CareerLaunchData } from '../types';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  data: CareerLaunchData;
  onLogout: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  data,
  onLogout,
  mobileOpen = false,
  onCloseMobile
}) => {
  const codingSolvedCount = data.codingQuestions.filter((q) => q.solved).length;
  const activeAppsCount = data.applications.filter(
    (a) => a.status !== 'Rejected' && a.status !== 'Selected'
  ).length;

  const navItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'coding' as ActivePage,
      label: 'Coding Tracker',
      icon: Code2,
      badge: `${codingSolvedCount}/${data.codingQuestions.length}`
    },
    {
      id: 'aptitude' as ActivePage,
      label: 'Aptitude Practice',
      icon: BrainCircuit,
      badge: null
    },
    {
      id: 'applications' as ActivePage,
      label: 'Applications',
      icon: Briefcase,
      badge: activeAppsCount > 0 ? `${activeAppsCount}` : null
    },
    {
      id: 'companies' as ActivePage,
      label: 'Companies',
      icon: Building2,
      badge: null
    },
    {
      id: 'interviews' as ActivePage,
      label: 'Interview Prep',
      icon: Users,
      badge: null
    },
    {
      id: 'resume' as ActivePage,
      label: 'Resume Builder',
      icon: FileText,
      badge: null
    },
    {
      id: 'progress' as ActivePage,
      label: 'Progress',
      icon: LineChart,
      badge: null
    },
    {
      id: 'lab' as ActivePage,
      label: 'Practice Lab & HW',
      icon: Cpu,
      badge: 'Interactive'
    },
    {
      id: 'settings' as ActivePage,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const handleItemClick = (pageId: ActivePage) => {
    onNavigate(pageId);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#FBF8F2] border-r border-[rgba(56,37,28,0.14)] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[rgba(56,37,28,0.14)]">
        <BrandLogo size="md" />
      </div>

      {/* Local Dev Mode Banner in Sidebar */}
      <div className="mx-4 mt-3 p-2.5 rounded-md bg-[#E6D8C7]/50 border border-[rgba(56,37,28,0.12)] text-xs text-[#39332E]">
        <div className="flex items-center justify-between font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#69745E] inline-block animate-pulse"></span>
            Local Dev Mode
          </span>
          <span className="text-[10px] text-[#82786F]">Offline</span>
        </div>
        <p className="text-[11px] text-[#82786F] mt-0.5 leading-snug">
          Data stored in local browser cache.
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                isActive
                  ? 'bg-[#38251C] text-[#FBF8F2] shadow-sm'
                  : 'text-[#39332E] hover:bg-[#E6D8C7]/60 hover:text-[#171411]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E6D8C7]' : 'text-[#76533C]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-[#171411] text-[#E6D8C7]'
                      : 'bg-[#E6D8C7] text-[#38251C]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-[rgba(56,37,28,0.14)] bg-[#FBF8F2]">
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => handleItemClick('settings')}
            className="flex items-center gap-3 min-w-0 cursor-pointer group"
            title="Open Profile Settings"
          >
            <div className="w-8 h-8 rounded-full bg-[#76533C] text-[#FBF8F2] font-semibold text-xs flex items-center justify-center shrink-0 group-hover:ring-2 group-hover:ring-[#38251C] transition-all">
              {data.profile?.avatarText || 'ST'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#171411] truncate group-hover:text-[#76533C]">
                {data.profile?.name || 'Student User'}
              </p>
              <p className="text-[10px] text-[#82786F] truncate">
                {data.profile?.targetRole || 'Placement Aspirant'}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Logout from session"
            className="text-[#82786F] hover:text-[#985F51] p-1.5 rounded-md hover:bg-[#E6D8C7]/50 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-30 no-print">
        {content}
      </aside>

      {/* Mobile drawer backdrop and slide-out */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#171411]/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#FBF8F2] shadow-xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
