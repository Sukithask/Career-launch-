import React from 'react';
import {
  Code2,
  BrainCircuit,
  Briefcase,
  FileText,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Plus,
  Play,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { ActivePage, CareerLaunchData } from '../../types';

interface DashboardViewProps {
  data: CareerLaunchData;
  onNavigate: (page: ActivePage) => void;
  onQuickAddCoding: () => void;
  onQuickAddApplication: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onNavigate,
  onQuickAddCoding,
  onQuickAddApplication
}) => {
  const user = data.profile;
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  // Coding metrics
  const totalCoding = data.codingQuestions.length;
  const solvedCoding = data.codingQuestions.filter((q) => q.solved).length;
  const codingPercent = totalCoding > 0 ? Math.round((solvedCoding / totalCoding) * 100) : 0;

  // Aptitude metrics
  const totalAttempts = data.aptitudeAttempts.length;
  const avgAptitude = totalAttempts > 0
    ? Math.round(data.aptitudeAttempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts)
    : 0;

  // Applications metrics
  const activeApplications = data.applications.filter(
    (a) => a.status !== 'Rejected' && a.status !== 'Selected'
  );
  const interviewsScheduled = data.applications.filter((a) => a.status.includes('Interview'));

  // Resume completion calculation
  const resume = data.resumeProfile;
  let resumeScore = 0;
  if (resume.personalDetails.fullName && resume.personalDetails.email) resumeScore += 20;
  if (resume.objective) resumeScore += 15;
  if (resume.education.length > 0) resumeScore += 15;
  if (resume.skills.technical.length >= 3) resumeScore += 20;
  if (resume.projects.length > 0) resumeScore += 15;
  if (resume.internships.length > 0 || resume.achievements.length > 0) resumeScore += 15;
  resumeScore = Math.min(100, resumeScore);

  // Overall Preparation Composite Score (0-100)
  // Weighted: Coding 35%, Aptitude 25%, Applications 15%, Resume 15%, Interviews 10%
  const overallReadiness = Math.round(
    codingPercent * 0.35 +
    avgAptitude * 0.25 +
    (resumeScore / 100) * 15 +
    (Math.min(5, data.interviewQuestions.filter((q) => q.practiced).length) / 5) * 15 +
    (activeApplications.length > 0 ? 10 : 0)
  );

  // Weekly activity from the last 7 entries
  const recentDays = data.preparationActivity.slice(-7);
  const maxDayCount = Math.max(...recentDays.map((d) => d.codingCount + d.aptitudeCount + d.interviewCount), 6);

  // Next recommended actions
  const recommendations: { text: string; sub: string; action: () => void; tag: string }[] = [];

  const unsolvedHighPriority = data.codingQuestions.find((q) => !q.solved && (q.difficulty === 'Medium' || q.difficulty === 'Hard'));
  if (unsolvedHighPriority) {
    recommendations.push({
      text: `Solve "${unsolvedHighPriority.title}" (${unsolvedHighPriority.topic})`,
      sub: `High placement frequency for ${unsolvedHighPriority.difficulty} problems.`,
      action: () => onNavigate('coding'),
      tag: 'DSA Queue'
    });
  }

  if (data.aptitudeAttempts.length < 4) {
    recommendations.push({
      text: 'Take a Quantitative Aptitude Mock Test',
      sub: 'Speed math and time-work problems are key in initial campus online assessments.',
      action: () => onNavigate('aptitude'),
      tag: 'Aptitude'
    });
  }

  const unpracticedInterview = data.interviewQuestions.find((q) => !q.practiced);
  if (unpracticedInterview) {
    recommendations.push({
      text: `Prepare: "${unpracticedInterview.question}"`,
      sub: `Draft your personal answer in STAR structure for ${unpracticedInterview.category} interviews.`,
      action: () => onNavigate('interviews'),
      tag: 'Interview Prep'
    });
  }

  if (resumeScore < 100) {
    recommendations.push({
      text: 'Polish Placement Resume Projects & Metrics',
      sub: `Current completeness: ${resumeScore}%. Add quantifiable bullet points.`,
      action: () => onNavigate('resume'),
      tag: 'Resume'
    });
  }

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#FBF8F2] p-5 sm:p-7 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-[#76533C] mb-1">
            <span>{todayStr}</span>
            <span aria-hidden="true">·</span>
            <span>Local Prep Session</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#171411] tracking-tight">
            Welcome back, {firstName}.
          </h2>
          <p className="mt-1 text-sm text-[#82786F] leading-relaxed">
            Your placement readiness index is currently at{' '}
            <span className="font-semibold text-[#171411]">{overallReadiness}%</span>.
            {interviewsScheduled.length > 0
              ? ` You have ${interviewsScheduled.length} interview rounds scheduled.`
              : ' Keep building momentum with consistent daily problem solving.'}
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={onQuickAddCoding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Coding Problem</span>
            </button>
            <button
              onClick={() => onNavigate('aptitude')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E6D8C7] hover:bg-[#E6D8C7]/80 text-[#38251C] text-xs font-semibold border border-[rgba(56,37,28,0.14)] transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-[#76533C]" />
              <span>Start Quick Quiz</span>
            </button>
            <button
              onClick={onQuickAddApplication}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FBF8F2] hover:bg-[#E6D8C7]/50 text-[#39332E] text-xs font-semibold border border-[rgba(56,37,28,0.18)] transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#76533C]" />
              <span>Track Application</span>
            </button>
            <button
              onClick={() => onNavigate('lab')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#76533C] hover:bg-[#38251C] text-[#FBF8F2] text-xs font-semibold shadow-xs transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-[#E6D8C7]" />
              <span>Practice Lab & HW Bench</span>
            </button>
          </div>
        </div>

        {/* Readiness Meter Card on Desktop */}
        <div className="hidden lg:flex flex-col items-center justify-center absolute right-7 top-1/2 -translate-y-1/2 p-4 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.14)] w-48 text-center">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#E6D8C7]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#76533C]"
                strokeDasharray={`${overallReadiness}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-sm font-bold text-[#171411]">
              {overallReadiness}%
            </div>
          </div>
          <span className="text-xs font-bold text-[#171411] mt-1">Readiness Index</span>
          <span className="text-[10px] text-[#82786F]">Target: SDE Placements</span>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Coding */}
        <div
          onClick={() => onNavigate('coding')}
          className="p-4 rounded-xl bg-[#FBF8F2] border border-[rgba(56,37,28,0.14)] shadow-xs hover:border-[#76533C]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#82786F] mb-2">
            <span className="text-xs font-semibold text-[#39332E]">Coding Solved</span>
            <Code2 className="w-4 h-4 text-[#76533C] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#171411]">{solvedCoding}</span>
            <span className="text-xs text-[#82786F]">/ {totalCoding} tracked</span>
          </div>
          <div className="mt-2.5 w-full bg-[#E6D8C7] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#76533C] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${codingPercent}%` }}
            />
          </div>
        </div>

        {/* Aptitude */}
        <div
          onClick={() => onNavigate('aptitude')}
          className="p-4 rounded-xl bg-[#FBF8F2] border border-[rgba(56,37,28,0.14)] shadow-xs hover:border-[#76533C]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#82786F] mb-2">
            <span className="text-xs font-semibold text-[#39332E]">Aptitude Average</span>
            <BrainCircuit className="w-4 h-4 text-[#76533C] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#171411]">{avgAptitude}%</span>
            <span className="text-xs text-[#82786F]">{totalAttempts} tests taken</span>
          </div>
          <div className="mt-2.5 w-full bg-[#E6D8C7] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#69745E] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${avgAptitude}%` }}
            />
          </div>
        </div>

        {/* Applications */}
        <div
          onClick={() => onNavigate('applications')}
          className="p-4 rounded-xl bg-[#FBF8F2] border border-[rgba(56,37,28,0.14)] shadow-xs hover:border-[#76533C]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#82786F] mb-2">
            <span className="text-xs font-semibold text-[#39332E]">Active Pipeline</span>
            <Briefcase className="w-4 h-4 text-[#76533C] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#171411]">{activeApplications.length}</span>
            <span className="text-xs text-[#82786F]">companies</span>
          </div>
          <div className="mt-2 text-xs text-[#69745E] font-medium flex items-center gap-1">
            <span>{interviewsScheduled.length} round(s) scheduled</span>
          </div>
        </div>

        {/* Resume */}
        <div
          onClick={() => onNavigate('resume')}
          className="p-4 rounded-xl bg-[#FBF8F2] border border-[rgba(56,37,28,0.14)] shadow-xs hover:border-[#76533C]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#82786F] mb-2">
            <span className="text-xs font-semibold text-[#39332E]">Resume Score</span>
            <FileText className="w-4 h-4 text-[#76533C] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#171411]">{resumeScore}%</span>
            <span className="text-xs text-[#82786F]">ATS-ready</span>
          </div>
          <div className="mt-2.5 w-full bg-[#E6D8C7] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#76533C] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${resumeScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Weekly Activity Chart + Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Preparation Chart (Lightweight SVG) */}
        <div className="lg:col-span-2 bg-[#FBF8F2] p-5 sm:p-6 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#171411] tracking-tight">Weekly Preparation Activity</h3>
              <p className="text-xs text-[#82786F]">Daily tasks completed over the past 7 sessions</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#82786F]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#76533C]" />
                Coding
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#69745E]" />
                Aptitude
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#B5A99B]" />
                Interview
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-48 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-[rgba(56,37,28,0.14)]">
            {recentDays.map((day) => {
              const total = day.codingCount + day.aptitudeCount + day.interviewCount;
              const codingHeight = (day.codingCount / maxDayCount) * 100;
              const aptitudeHeight = (day.aptitudeCount / maxDayCount) * 100;
              const interviewHeight = (day.interviewCount / maxDayCount) * 100;

              const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
                new Date(day.date + 'T00:00:00')
              );

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono font-medium text-[#82786F] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {total}
                  </span>
                  <div className="w-full max-w-[28px] flex flex-col justify-end rounded-t-sm overflow-hidden bg-[#E6D8C7]/50">
                    <div
                      style={{ height: `${interviewHeight}%` }}
                      className="bg-[#B5A99B] w-full transition-all duration-300"
                      title={`Interviews: ${day.interviewCount}`}
                    />
                    <div
                      style={{ height: `${aptitudeHeight}%` }}
                      className="bg-[#69745E] w-full transition-all duration-300"
                      title={`Aptitude: ${day.aptitudeCount}`}
                    />
                    <div
                      style={{ height: `${codingHeight}%` }}
                      className="bg-[#76533C] w-full transition-all duration-300"
                      title={`Coding: ${day.codingCount}`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#39332E] mt-2">{dayLabel}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#82786F]">
            <span>Goal: {data.settings.dailyPreparationGoal} activities / day</span>
            <button
              onClick={() => onNavigate('progress')}
              className="text-[#76533C] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Detailed analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#171411] tracking-tight">Recommended Actions</h3>
            <Sparkles className="w-4 h-4 text-[#76533C]" />
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {recommendations.length > 0 ? (
              recommendations.map((rec, i) => (
                <div
                  key={i}
                  onClick={rec.action}
                  className="p-3 rounded-lg bg-[#EFE5D6]/50 hover:bg-[#E6D8C7]/70 border border-[rgba(56,37,28,0.1)] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#76533C] tracking-wider">
                      {rec.tag}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#82786F] group-hover:text-[#171411] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs font-bold text-[#171411] group-hover:text-[#76533C] transition-colors">
                    {rec.text}
                  </p>
                  <p className="text-[11px] text-[#82786F] mt-0.5 line-clamp-2">{rec.sub}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-[#82786F]">
                <CheckCircle2 className="w-6 h-6 mx-auto text-[#69745E] mb-2" />
                All priority queues clear. Great consistency!
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('companies')}
            className="w-full mt-4 py-2 px-3 rounded-md bg-[#E6D8C7] hover:bg-[#E6D8C7]/80 text-xs font-semibold text-[#38251C] transition-colors text-center"
          >
            Review Company Specific Checklists
          </button>
        </div>
      </div>

      {/* Recent Coding & Applications Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Coding Questions */}
        <div className="bg-[#FBF8F2] p-5 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#171411]">Recent Coding Questions</h3>
            <button
              onClick={() => onNavigate('coding')}
              className="text-xs font-semibold text-[#76533C] hover:underline"
            >
              View all ({data.codingQuestions.length})
            </button>
          </div>

          <div className="divide-y divide-[rgba(56,37,28,0.1)]">
            {data.codingQuestions.slice(0, 4).map((q) => (
              <div key={q.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#171411] truncate">{q.title}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#82786F]">
                    <span>{q.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        q.difficulty === 'Easy'
                          ? 'text-[#69745E]'
                          : q.difficulty === 'Medium'
                          ? 'text-[#76533C]'
                          : 'text-[#985F51]'
                      }
                    >
                      {q.difficulty}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {q.solved ? (
                    <span className="text-[11px] font-semibold text-[#69745E] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#82786F]">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interview Milestones */}
        <div className="bg-[#FBF8F2] p-5 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#171411]">Recruitment Pipeline</h3>
            <button
              onClick={() => onNavigate('applications')}
              className="text-xs font-semibold text-[#76533C] hover:underline"
            >
              View tracker ({data.applications.length})
            </button>
          </div>

          <div className="divide-y divide-[rgba(56,37,28,0.1)]">
            {data.applications.slice(0, 4).map((app) => (
              <div key={app.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#171411]">{app.companyName}</span>
                    <span className="text-[11px] text-[#82786F]">({app.position})</span>
                  </div>
                  <p className="text-[11px] text-[#82786F] truncate">{app.salaryOrPackage}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[11px] font-semibold text-[#38251C] px-2 py-0.5 rounded bg-[#E6D8C7]">
                    {app.status}
                  </span>
                  {app.interviewDate && (
                    <p className="text-[10px] text-[#76533C] mt-0.5 font-medium">{app.interviewDate}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
