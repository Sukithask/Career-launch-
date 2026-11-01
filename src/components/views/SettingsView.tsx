import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  User,
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  LogOut,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Target,
  Sun,
  Moon,
  Palette,
  Check,
  Github,
  Key,
  Lock,
  Server
} from 'lucide-react';
import { CareerLaunchData, UserProfile, UserSettings } from '../../types';
import { StorageService, INITIAL_DEMO_DATA } from '../../services/storage';
import { useToast } from '../Toast';
import { useTheme, AccentColor } from '../../context/ThemeContext';
import { checkAIStatus, AIStatusResponse } from '../../services/aiService';

interface SettingsViewProps {
  data: CareerLaunchData;
  onUpdateData: (newData: CareerLaunchData) => void;
  onLogout: () => void;
  onResetDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  data,
  onUpdateData,
  onLogout,
  onResetDemo
}) => {
  const { showToast } = useToast();
  const { theme, setTheme, accent, setAccent } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const profile = data.profile || INITIAL_DEMO_DATA.profile!;
  const [name, setName] = useState(profile.name);
  const [email] = useState(profile.email); // Read-only / display
  const [college, setCollege] = useState(profile.college);
  const [graduationYear, setGraduationYear] = useState(profile.graduationYear);
  const [targetRole, setTargetRole] = useState(profile.targetRole);

  // Preferences form state
  const [dailyGoal, setDailyGoal] = useState(data.settings.dailyPreparationGoal);
  const [preferredTime, setPreferredTime] = useState(data.settings.preferredPreparationTime);
  const [notifications, setNotifications] = useState(data.settings.notificationPreference);

  // Destructive confirmations
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearInput, setClearInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Gemini AI Server Status
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);
  const [checkingAi, setCheckingAi] = useState(false);

  const refreshAiStatus = () => {
    setCheckingAi(true);
    checkAIStatus()
      .then((status) => setAiStatus(status))
      .finally(() => setCheckingAi(false));
  };

  useEffect(() => {
    refreshAiStatus();
  }, []);

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'danger');
      return;
    }

    const avatarText = name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'ST';

    const updatedProfile: UserProfile = {
      ...profile,
      name: name.trim(),
      college: college.trim(),
      graduationYear,
      targetRole: targetRole.trim(),
      avatarText
    };

    const updatedSettings: UserSettings = {
      ...data.settings,
      dailyPreparationGoal: dailyGoal,
      preferredPreparationTime: preferredTime,
      notificationPreference: notifications
    };

    const updatedData: CareerLaunchData = {
      ...data,
      profile: updatedProfile,
      settings: updatedSettings
    };

    StorageService.saveData(updatedData);
    onUpdateData(updatedData);
    showToast('Profile and preferences updated successfully');
  };

  // Export JSON file
  const handleExportJSON = () => {
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
    showToast('Exported CareerLaunch local data as JSON');
  };

  // Import JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.validateAndImport(content);
      if (res.success && res.data) {
        onUpdateData(res.data);
        showToast('Successfully imported and validated backup data!');
      } else {
        setImportError(res.error || 'Failed to import backup.');
        showToast('Failed to import backup file.', 'danger');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Clear All Data
  const handleConfirmClear = () => {
    if (clearInput.trim().toUpperCase() === 'RESET') {
      const cleared = StorageService.clearLocalData();
      onUpdateData(cleared);
      setShowClearConfirm(false);
      setClearInput('');
      showToast('All local storage data has been cleared.', 'info');
      onLogout();
    } else {
      showToast('Please type "RESET" to confirm deletion.', 'danger');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile & Target Role */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[rgba(56,37,28,0.14)] mb-4">
          <div className="w-10 h-10 rounded-full bg-[#38251C] text-[#FBF8F2] flex items-center justify-center font-bold text-sm">
            {profile.avatarText}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#171411]">Student Profile & Campus Credentials</h3>
            <p className="text-xs text-[#82786F]">Update placement preferences and academic affiliations</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                Registered Email (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.14)] bg-[#EFE5D6]/40 text-[#82786F] text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                College / Institution
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                Graduation Batch
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
              Target Placement Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Software Development Engineer (SDE-1)"
              className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
            />
          </div>

          {/* Preferences */}
          <div className="pt-4 border-t border-[rgba(56,37,28,0.12)] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                Daily Preparation Goal: <span className="text-[#76533C]">{dailyGoal} Tasks</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full accent-[#76533C] cursor-pointer"
              />
              <span className="text-[10px] text-[#82786F]">Target activities logged per day</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                Preferred Practice Time
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs"
              >
                <option value="Morning">Morning (8am - 12pm)</option>
                <option value="Afternoon">Afternoon (12pm - 5pm)</option>
                <option value="Evening">Evening (5pm - 9pm)</option>
                <option value="Night">Night (9pm - 1am)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#39332E]">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-[#76533C] focus:ring-[#76533C] accent-[#76533C]"
              />
              <span>Enable upcoming interview & practice reminders in dashboard</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile & Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appearance & Color Theme Customization */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(56,37,28,0.14)]">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-[#76533C]" />
            <div>
              <h3 className="text-sm font-bold text-[#171411]">Appearance & Color Themes</h3>
              <p className="text-xs text-[#82786F]">Switch between Light and Dark mode, and customize your vibrant accent</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#E6D8C7] text-[#171411] capitalize">
            {theme} Mode · {accent}
          </span>
        </div>

        {/* Light vs Dark Switcher */}
        <div>
          <span className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-2">
            Theme Mode
          </span>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                showToast('Switched to Light Mode');
              }}
              className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                theme === 'light'
                  ? 'bg-[#38251C] text-[#FBF8F2] shadow-sm'
                  : 'bg-[#FBF8F2] text-[#39332E] border-[rgba(56,37,28,0.2)] hover:bg-[#E6D8C7]/40'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                showToast('Switched to Dark Mode');
              }}
              className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#38251C] text-[#FBF8F2] shadow-sm'
                  : 'bg-[#FBF8F2] text-[#39332E] border-[rgba(56,37,28,0.2)] hover:bg-[#E6D8C7]/40'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Vibrant Accent Selector */}
        <div className="pt-3 border-t border-[rgba(56,37,28,0.1)]">
          <span className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-2">
            Vibrant Accent Palette
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'indigo', label: 'Vibrant Indigo', hex: '#6366F1' },
              { id: 'emerald', label: 'Electric Emerald', hex: '#10B981' },
              { id: 'cyan', label: 'Cyber Cyan', hex: '#06B6D4' },
              { id: 'violet', label: 'Royal Violet', hex: '#8B5CF6' },
              { id: 'amber', label: 'Solar Amber', hex: '#F59E0B' }
            ].map((col) => {
              const isSelected = accent === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => {
                    setAccent(col.id as AccentColor);
                    showToast(`Active accent: ${col.label}`);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-[#76533C] ring-2 ring-[#76533C]/30 bg-[#E6D8C7]/50'
                      : 'border-[rgba(56,37,28,0.18)] hover:bg-[#E6D8C7]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-4 h-4 rounded-full shadow-xs"
                      style={{ backgroundColor: col.hex }}
                    />
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#76533C]" />}
                  </div>
                  <span className="text-xs font-bold text-[#171411]">{col.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* GitHub Readiness & Environment Variable Security Card */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[rgba(56,37,28,0.14)] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#6366F1]/10 text-[#4F46E5]">
              <Lock className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171411]">GitHub & Gemini API Security</h3>
              <p className="text-xs text-[#82786F]">Environment variable loading & secret protection for public Git repositories</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded border flex items-center gap-1.5 ${
                aiStatus?.configured
                  ? 'bg-[#69745E]/15 border-[#69745E]/30 text-[#69745E]'
                  : 'bg-[#6366F1]/10 border-[#6366F1]/20 text-[#4F46E5]'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{aiStatus?.configured ? 'Key Loaded via ENV' : 'ENV Ready'}</span>
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#69745E]/15 border border-[#69745E]/30 text-[#69745E] flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" />
              <span>Git Safe</span>
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-[#39332E]">
          <p className="leading-relaxed">
            Your application is configured for safe pushing to <strong>GitHub</strong>. No secret API keys or credentials are hardcoded into frontend code or stored in committed files.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-[#EFE5D6]/40 border border-[rgba(56,37,28,0.1)] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#171411]">
                <Server className="w-3.5 h-3.5 text-[#76533C]" />
                <span>1. Server-Side Loading</span>
              </div>
              <p className="text-[11px] text-[#82786F] leading-normal">
                Loaded exclusively on the Express backend (<code className="font-mono bg-[#E6D8C7] px-1 rounded">server.ts</code>) using <code className="font-mono bg-[#E6D8C7] px-1 rounded">process.env.GEMINI_API_KEY</code>. Never exposed to browser bundles.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#EFE5D6]/40 border border-[rgba(56,37,28,0.1)] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#171411]">
                <Github className="w-3.5 h-3.5 text-[#76533C]" />
                <span>2. .gitignore Protected</span>
              </div>
              <p className="text-[11px] text-[#82786F] leading-normal">
                <code className="font-mono bg-[#E6D8C7] px-1 rounded">.env*</code> is ignored in <code className="font-mono bg-[#E6D8C7] px-1 rounded">.gitignore</code>. Your private local keys will never be committed or pushed to your GitHub repo.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#EFE5D6]/40 border border-[rgba(56,37,28,0.1)] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#171411]">
                <Key className="w-3.5 h-3.5 text-[#76533C]" />
                <span>3. Template Included</span>
              </div>
              <p className="text-[11px] text-[#82786F] leading-normal">
                A sanitized <code className="font-mono bg-[#E6D8C7] px-1 rounded">.env.example</code> is committed without secrets so collaborators can clone and set up their own environment.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#171411] text-[#F8FAFC] font-mono text-[11px] space-y-1 overflow-x-auto">
            <div className="text-[#818CF8] font-bold"># Local Setup for GitHub Clone:</div>
            <div>cp .env.example .env</div>
            <div className="text-[#94A3B8]"># Add your Gemini key to .env:</div>
            <div>GEMINI_API_KEY=your_gemini_api_key_here</div>
            <div>npm run dev</div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#82786F]">
              Server Status: <strong>{aiStatus?.message || 'Checking backend...'}</strong>
            </span>
            <button
              type="button"
              onClick={refreshAiStatus}
              disabled={checkingAi}
              className="px-3 py-1.5 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] hover:bg-[#E6D8C7]/60 text-xs font-semibold text-[#171411] flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-[#76533C] ${checkingAi ? 'animate-spin' : ''}`} />
              <span>{checkingAi ? 'Checking...' : 'Verify Key Status'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Local Development Mode & Storage Architecture */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(56,37,28,0.14)]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#69745E]" />
            <div>
              <h3 className="text-sm font-bold text-[#171411]">Local Development Mode Status</h3>
              <p className="text-xs text-[#82786F]">Offline browser-sandboxed local storage architecture</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#69745E] px-2.5 py-1 rounded bg-[#69745E]/15 border border-[#69745E]/30">
            Active · Offline
          </span>
        </div>

        <p className="text-xs text-[#39332E] leading-relaxed">
          CareerLaunch operates in <strong>Local Development Mode</strong> using browser <code className="bg-[#E6D8C7] px-1 py-0.5 rounded text-[11px] font-mono">localStorage</code> under the key <code className="bg-[#E6D8C7] px-1 py-0.5 rounded text-[11px] font-mono">careerLaunchData</code>. No personal data, passwords, or mock responses are sent to external cloud servers.
        </p>

        {/* Data Backup & Restore */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-[#EFE5D6]/50 border border-[rgba(56,37,28,0.1)] flex flex-col justify-between space-y-2">
            <div>
              <span className="font-bold text-xs text-[#171411] block">Export JSON Backup</span>
              <p className="text-[11px] text-[#82786F]">
                Download a JSON snapshot of your solved questions, aptitude logs, companies, applications, and resume.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="mt-2 w-full py-2 px-3 rounded-md bg-[#76533C] hover:bg-[#38251C] text-[#FBF8F2] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-[#EFE5D6]/50 border border-[rgba(56,37,28,0.1)] flex flex-col justify-between space-y-2">
            <div>
              <span className="font-bold text-xs text-[#171411] block">Import JSON Data</span>
              <p className="text-[11px] text-[#82786F]">
                Upload and validate a previously exported CareerLaunch JSON backup file.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 w-full py-2 px-3 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] hover:bg-[#E6D8C7]/60 text-xs font-semibold text-[#38251C] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[#76533C]" />
                <span>Upload JSON Backup</span>
              </button>
            </div>
          </div>
        </div>

        {importError && (
          <div className="p-3 rounded-md bg-[#985F51]/10 border border-[#985F51]/30 text-xs text-[#985F51]">
            <strong>Import Error:</strong> {importError}
          </div>
        )}
      </div>

      {/* Demo Reset & Danger Zone */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#171411] pb-2 border-b border-[rgba(56,37,28,0.14)]">
          Data Management & Destructive Controls
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-[rgba(56,37,28,0.14)] bg-[#EFE5D6]/30">
          <div>
            <p className="text-xs font-bold text-[#171411]">Reset to Starter Demo Dataset</p>
            <p className="text-[11px] text-[#82786F]">
              Restores standard campus seed data with 10 coding questions, aptitude tests, 4 companies, and sample resume.
            </p>
          </div>
          <button
            onClick={onResetDemo}
            className="px-3 py-1.5 rounded-md border border-[rgba(56,37,28,0.2)] text-xs font-semibold text-[#38251C] hover:bg-[#E6D8C7] flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#76533C]" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-[#985F51]/30 bg-[#985F51]/5">
          <div>
            <p className="text-xs font-bold text-[#985F51]">Wipe All Local Storage Data</p>
            <p className="text-[11px] text-[#82786F]">
              Irreversibly clears all student profiles, question attempts, and applications from browser memory.
            </p>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-1.5 rounded-md bg-[#985F51] hover:bg-[#985F51]/90 text-[#FBF8F2] text-xs font-semibold flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Data</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#82786F]">Current Session: {profile.name} ({profile.email})</span>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-xs text-[#985F51] hover:underline font-semibold flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* About CareerLaunch */}
      <div className="p-5 rounded-xl bg-[#E6D8C7]/40 border border-[rgba(56,37,28,0.12)] text-xs text-[#39332E] space-y-1">
        <p className="font-bold text-[#171411]">About CareerLaunch</p>
        <p className="text-[11px] text-[#82786F] leading-relaxed">
          Version 1.0.0 · Placement preparation software for collegiate software engineering and product campus hiring. Designed for rapid offline drill, progress analytics, and standard resume composition.
        </p>
      </div>

      {/* Confirmation Modal for Clearing Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/60 backdrop-blur-xs">
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.2)] max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-[#985F51] mb-2 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Permanent Data Clear</span>
            </div>
            <p className="text-xs text-[#82786F] mb-4">
              This action will wipe all local data stored under <code>careerLaunchData</code> in this browser. To confirm, type <strong>RESET</strong> below:
            </p>

            <input
              type="text"
              value={clearInput}
              onChange={(e) => setClearInput(e.target.value)}
              placeholder="RESET"
              className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-sm font-mono text-[#171411] mb-4 text-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#985F51]"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowClearConfirm(false);
                  setClearInput('');
                }}
                className="px-3 py-1.5 rounded-md border border-[rgba(56,37,28,0.2)] text-xs font-semibold text-[#39332E]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-1.5 rounded-md bg-[#985F51] text-[#FBF8F2] text-xs font-semibold"
              >
                Permanently Wipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
