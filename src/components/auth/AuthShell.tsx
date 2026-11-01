import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Code2,
  BrainCircuit,
  FileText,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { CareerLaunchData, UserProfile, StoredUserAccount } from '../../types';
import { StorageService } from '../../services/storage';
import { BrandLogo, AppWatermark } from '../BrandLogo';

interface AuthShellProps {
  data: CareerLaunchData;
  onLoginSuccess: (user: UserProfile, remember: boolean) => void;
  onUpdateData: (newData: CareerLaunchData) => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export const AuthShell: React.FC<AuthShellProps> = ({
  data,
  onLoginSuccess,
  onUpdateData
}) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Recovery flow states
  const [recoveryCode, setRecoveryCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Preset demo auto-fill
  const fillDemoAccount = () => {
    setEmail('aarav.sharma@campus.edu');
    setPassword('demoPass123!');
    setErrorMsg(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please provide a valid college or personal email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check registered users in local dev state
      const matchingUser = data.registeredUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (matchingUser) {
        if (matchingUser.passwordHashSimulated && matchingUser.passwordHashSimulated !== password) {
          setErrorMsg('Incorrect password. For the demo account, you may use "demoPass123!".');
          return;
        }

        const avatarText = matchingUser.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'ST';

        const profile: UserProfile = {
          id: matchingUser.id,
          name: matchingUser.name,
          email: matchingUser.email,
          college: matchingUser.college || 'Engineering Institute',
          graduationYear: matchingUser.graduationYear || '2026',
          targetRole: 'Software Development Engineer',
          avatarText
        };

        onLoginSuccess(profile, rememberMe);
      } else {
        // If it's a first time email in local dev mode, create an account seamlessly or error
        // Let's create account directly or advise
        const newUserId = `user-${Date.now()}`;
        const avatarText = email.substring(0, 2).toUpperCase();
        const profile: UserProfile = {
          id: newUserId,
          name: email.split('@')[0].replace('.', ' '),
          email: email.trim(),
          college: 'University Campus',
          graduationYear: '2026',
          targetRole: 'Software Engineer',
          avatarText
        };

        const newAccount: StoredUserAccount = {
          id: newUserId,
          name: profile.name,
          email: profile.email,
          passwordHashSimulated: password,
          college: profile.college,
          graduationYear: profile.graduationYear,
          createdAt: new Date().toISOString()
        };

        const updatedData: CareerLaunchData = {
          ...data,
          profile,
          registeredUsers: [...data.registeredUsers, newAccount]
        };

        onUpdateData(updatedData);
        onLoginSuccess(profile, rememberMe);
      }
    }, 450);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const exists = data.registeredUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (exists) {
        setErrorMsg('An account with this email already exists locally. Please login.');
        return;
      }

      const newUserId = `user-${Date.now()}`;
      const avatarText = name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'ST';

      const newProfile: UserProfile = {
        id: newUserId,
        name: name.trim(),
        email: email.trim(),
        college: college.trim() || 'Institute of Technology',
        graduationYear: graduationYear || '2026',
        targetRole: targetRole.trim() || 'Software Engineer',
        avatarText
      };

      const newAccount: StoredUserAccount = {
        id: newUserId,
        name: newProfile.name,
        email: newProfile.email,
        passwordHashSimulated: password,
        college: newProfile.college,
        graduationYear: newProfile.graduationYear,
        createdAt: new Date().toISOString()
      };

      const updated = {
        ...data,
        profile: newProfile,
        registeredUsers: [...data.registeredUsers, newAccount]
      };

      onUpdateData(updated);
      setSuccessMsg('Account created successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(newProfile, rememberMe);
      }, 500);
    }, 450);
  };

  const handleForgotInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid registered email address.');
      return;
    }

    // In local dev prototype mode, simulate sending a 6-digit verification code
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(mockCode);
    setMode('reset');
    setSuccessMsg(`Simulated local verification code generated: ${mockCode}`);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (recoveryCode !== generatedCode && recoveryCode !== '123456') {
      setErrorMsg('Invalid verification code. Enter the 6-digit code shown above.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    // Update password in local registeredUsers
    const updatedUsers = data.registeredUsers.map((u) => {
      if (u.email.toLowerCase() === email.toLowerCase().trim()) {
        return { ...u, passwordHashSimulated: password };
      }
      return u;
    });

    const updated = {
      ...data,
      registeredUsers: updatedUsers
    };
    onUpdateData(updated);

    setSuccessMsg('Password has been reset successfully. You can now login with your new password.');
    setTimeout(() => {
      setMode('login');
      setPassword('');
      setConfirmPassword('');
      setRecoveryCode('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#EFE5D6] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Watermark */}
      <AppWatermark variant="diagonal-tile" />
      <AppWatermark variant="subtle-corner" />

      {/* Top Brand Centering */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <div className="flex justify-center mb-3">
          <BrandLogo size="xl" showText={false} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#171411] tracking-tight">
          Career<span className="text-[#76533C]">Launch</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#82786F] max-w-sm mx-auto">
          The structured placement-preparation engine for college engineers
        </p>

        {/* Local Dev Mode Disclaimer Banner */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBF8F2] border border-[rgba(56,37,28,0.18)] shadow-xs text-xs text-[#38251C]">
          <span className="w-2 h-2 rounded-full bg-[#69745E] animate-pulse"></span>
          <span className="font-semibold">Local Development Mode</span>
          <span className="text-[#82786F]">· Offline LocalStorage</span>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FBF8F2] py-8 px-6 sm:px-10 rounded-xl shadow-lg border border-[rgba(56,37,28,0.14)]">
          {/* Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-md bg-[#985F51]/10 border border-[#985F51]/30 text-xs text-[#985F51] font-medium flex items-start gap-2">
              <span className="shrink-0 font-bold">!</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-md bg-[#69745E]/10 border border-[#69745E]/30 text-xs text-[#69745E] font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C] focus:border-transparent transition-all placeholder:text-[#B5A99B]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-[#76533C] hover:text-[#38251C] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C] focus:border-transparent transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#82786F] hover:text-[#171411]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#39332E]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[rgba(56,37,28,0.3)] text-[#76533C] focus:ring-[#76533C] accent-[#76533C]"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo quick sign-in helper */}
              <div className="pt-3 border-t border-[rgba(56,37,28,0.12)]">
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="w-full py-2 px-3 rounded-md bg-[#E6D8C7]/50 hover:bg-[#E6D8C7] text-xs font-semibold text-[#38251C] border border-[rgba(56,37,28,0.14)] transition-colors"
                >
                  Quick Fill Demo Account (Aarav Sharma)
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-[#82786F]">
                  Don't have a local profile?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-bold text-[#76533C] hover:text-[#38251C] hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Patel"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya.patel@campus.edu"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Delhi"
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
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
                  placeholder="Software Engineer / Data Analyst"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating Local Profile...' : 'Complete Registration'}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-[#82786F]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-bold text-[#76533C] hover:text-[#38251C] hover:underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotInitiate} className="space-y-4">
              <div className="text-xs text-[#82786F]">
                Enter your registered email address. Since CareerLaunch runs in Local Development Mode, a simulated verification code will be displayed right here.
              </div>
              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] font-semibold text-sm transition-colors"
              >
                Generate Reset Code
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-semibold text-[#76533C] hover:text-[#38251C]"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {/* MODE: RESET PASSWORD */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div className="p-2.5 rounded bg-[#E6D8C7]/50 border border-[rgba(56,37,28,0.15)] text-xs text-[#38251C]">
                <p className="font-semibold">Local Verification Code:</p>
                <p className="font-mono text-sm tracking-wider font-bold text-[#76533C]">
                  {generatedCode || '123456'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Enter 6-digit Code
                </label>
                <input
                  type="text"
                  required
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-sm focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] font-semibold text-sm transition-colors"
              >
                Reset Password & Log In
              </button>
            </form>
          )}
        </div>

        {/* Feature summary cards below */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-[#FBF8F2]/70 border border-[rgba(56,37,28,0.1)]">
            <Code2 className="w-4 h-4 mx-auto text-[#76533C] mb-1" />
            <p className="text-[11px] font-bold text-[#171411]">DSA Tracker</p>
            <p className="text-[10px] text-[#82786F]">Categorized problems</p>
          </div>
          <div className="p-3 rounded-lg bg-[#FBF8F2]/70 border border-[rgba(56,37,28,0.1)]">
            <BrainCircuit className="w-4 h-4 mx-auto text-[#76533C] mb-1" />
            <p className="text-[11px] font-bold text-[#171411]">Aptitude Tests</p>
            <p className="text-[10px] text-[#82786F]">Timed quizzes & review</p>
          </div>
          <div className="p-3 rounded-lg bg-[#FBF8F2]/70 border border-[rgba(56,37,28,0.1)]">
            <FileText className="w-4 h-4 mx-auto text-[#76533C] mb-1" />
            <p className="text-[11px] font-bold text-[#171411]">Resume Generator</p>
            <p className="text-[10px] text-[#82786F]">ATS print & export</p>
          </div>
        </div>
      </div>
    </div>
  );
};
