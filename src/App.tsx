/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, CareerLaunchData, UserProfile } from './types';
import { StorageService } from './services/storage';
import { ToastProvider, useToast } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthShell } from './components/auth/AuthShell';
import { DashboardView } from './components/views/DashboardView';
import { CodingTrackerView } from './components/views/CodingTrackerView';
import { AptitudePracticeView } from './components/views/AptitudePracticeView';
import { ApplicationsView } from './components/views/ApplicationsView';
import { CompaniesView } from './components/views/CompaniesView';
import { InterviewPrepView } from './components/views/InterviewPrepView';
import { ResumeBuilderView } from './components/views/ResumeBuilderView';
import { ProgressView } from './components/views/ProgressView';
import { SettingsView } from './components/views/SettingsView';
import { PracticeLabView } from './components/views/PracticeLabView';
import { AppWatermark } from './components/BrandLogo';

function CareerLaunchApp() {
  const { showToast } = useToast();

  // Load state from localStorage
  const [data, setData] = useState<CareerLaunchData>(() => StorageService.loadData());
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick modals triggers
  const [quickCodingModal, setQuickCodingModal] = useState(false);
  const [quickAppModal, setQuickAppModal] = useState(false);

  // Save changes to localStorage whenever data changes
  const handleUpdateData = (newData: CareerLaunchData) => {
    setData(newData);
    StorageService.saveData(newData);
  };

  // Authentication handlers
  const handleLoginSuccess = (user: UserProfile, remember: boolean) => {
    const updated: CareerLaunchData = {
      ...data,
      profile: user,
      authenticationState: {
        isAuthenticated: true,
        currentUser: user,
        rememberMe: remember,
        token: `local-token-${Date.now()}`
      }
    };
    handleUpdateData(updated);
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    const updated: CareerLaunchData = {
      ...data,
      authenticationState: {
        isAuthenticated: false,
        currentUser: null,
        rememberMe: false
      }
    };
    handleUpdateData(updated);
    showToast('Signed out of local session', 'info');
  };

  // Reset demo data handler
  const handleResetDemoData = () => {
    if (confirm('Reset to starter demo data? Any custom items will be overwritten with the placement starter set.')) {
      const reset = StorageService.resetDemoData();
      setData(reset);
      showToast('Loaded starter demo dataset');
    }
  };

  // Export JSON backup handler
  const handleExportBackup = () => {
    const jsonString = StorageService.exportJSON(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareerLaunch_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported CareerLaunch JSON backup');
  };

  // If not authenticated, show complete auth experience
  if (!data.authenticationState.isAuthenticated || !data.profile) {
    return (
      <AuthShell
        data={data}
        onLoginSuccess={handleLoginSuccess}
        onUpdateData={handleUpdateData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EFE5D6] text-[#171411] flex flex-col md:flex-row antialiased selection:bg-[#76533C]/20 selection:text-[#38251C] relative">
      {/* Background Watermark Elements */}
      <AppWatermark variant="diagonal-tile" />
      <AppWatermark variant="subtle-corner" />

      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setQuickCodingModal(false);
          setQuickAppModal(false);
        }}
        data={data}
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setQuickCodingModal(false);
            setQuickAppModal(false);
          }}
          data={data}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          onResetDemo={handleResetDemoData}
          onExport={handleExportBackup}
        />

        {/* Scrollable Viewport Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              data={data}
              onNavigate={(page) => setActivePage(page)}
              onQuickAddCoding={() => {
                setActivePage('coding');
                setQuickCodingModal(true);
              }}
              onQuickAddApplication={() => {
                setActivePage('applications');
                setQuickAppModal(true);
              }}
            />
          )}

          {activePage === 'coding' && (
            <CodingTrackerView
              data={data}
              onUpdateData={handleUpdateData}
              initialAddModalOpen={quickCodingModal}
            />
          )}

          {activePage === 'aptitude' && (
            <AptitudePracticeView
              data={data}
              onUpdateData={handleUpdateData}
            />
          )}

          {activePage === 'applications' && (
            <ApplicationsView
              data={data}
              onUpdateData={handleUpdateData}
              initialAddModalOpen={quickAppModal}
            />
          )}

          {activePage === 'companies' && (
            <CompaniesView
              data={data}
              onUpdateData={handleUpdateData}
            />
          )}

          {activePage === 'interviews' && (
            <InterviewPrepView
              data={data}
              onUpdateData={handleUpdateData}
            />
          )}

          {activePage === 'resume' && (
            <ResumeBuilderView
              data={data}
              onUpdateData={handleUpdateData}
            />
          )}

          {activePage === 'progress' && (
            <ProgressView
              data={data}
            />
          )}

          {activePage === 'lab' && (
            <PracticeLabView
              data={data}
              onUpdateData={handleUpdateData}
            />
          )}

          {activePage === 'settings' && (
            <SettingsView
              data={data}
              onUpdateData={handleUpdateData}
              onLogout={handleLogout}
              onResetDemo={handleResetDemoData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CareerLaunchApp />
      </ToastProvider>
    </ThemeProvider>
  );
}
