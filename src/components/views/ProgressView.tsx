import React from 'react';
import {
  LineChart,
  Award,
  Flame,
  CheckCircle2,
  Code2,
  BrainCircuit,
  Briefcase,
  Users,
  FileText,
  Calendar,
  Building2,
  TrendingUp
} from 'lucide-react';
import { CareerLaunchData, CodingTopic } from '../../types';

interface ProgressViewProps {
  data: CareerLaunchData;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ data }) => {
  // Coding Metrics
  const totalCoding = data.codingQuestions.length;
  const solvedCoding = data.codingQuestions.filter((q) => q.solved).length;
  const codingPercent = totalCoding > 0 ? Math.round((solvedCoding / totalCoding) * 100) : 0;

  // Aptitude Metrics
  const aptitudeAttempts = data.aptitudeAttempts;
  const totalAttempts = aptitudeAttempts.length;
  const bestScore = totalAttempts > 0 ? Math.max(...aptitudeAttempts.map((a) => a.percentage)) : 0;
  const avgScore = totalAttempts > 0
    ? Math.round(aptitudeAttempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts)
    : 0;

  // Interview metrics
  const totalInterviews = data.interviewQuestions.length;
  const practicedInterviews = data.interviewQuestions.filter((q) => q.practiced).length;

  // Resume score
  const resume = data.resumeProfile;
  let resumeScore = 0;
  if (resume.personalDetails.fullName && resume.personalDetails.email) resumeScore += 20;
  if (resume.objective) resumeScore += 15;
  if (resume.education.length > 0) resumeScore += 15;
  if (resume.skills.technical.length >= 3) resumeScore += 20;
  if (resume.projects.length > 0) resumeScore += 15;
  if (resume.internships.length > 0 || resume.achievements.length > 0) resumeScore += 15;
  resumeScore = Math.min(100, resumeScore);

  // Preparation streak calculation (consecutive days with activity)
  const sortedDays = [...data.preparationActivity].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const day of sortedDays) {
    if (day.codingCount > 0 || day.aptitudeCount > 0 || day.interviewCount > 0) {
      streak += 1;
    } else {
      break;
    }
  }
  // If no activity today/yesterday, clamp
  if (streak === 0 && sortedDays.length > 0) streak = 1;

  // Topic-wise coding distribution
  const topicsMap: Record<string, { total: number; solved: number }> = {};
  data.codingQuestions.forEach((q) => {
    if (!topicsMap[q.topic]) {
      topicsMap[q.topic] = { total: 0, solved: 0 };
    }
    topicsMap[q.topic].total += 1;
    if (q.solved) topicsMap[q.topic].solved += 1;
  });

  // Applications by status
  const statusCounts: Record<string, number> = {};
  data.applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Streak & Readiness Banner */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#76533C] text-[#FBF8F2] flex items-center justify-center shadow-xs shrink-0">
            <Flame className="w-6 h-6 text-[#E6D8C7]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-[#171411]">
                {streak} Day Preparation Streak
              </span>
            </div>
            <p className="text-xs text-[#82786F]">
              Consistency is the single biggest predictor of campus interview success.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.12)] text-right">
            <span className="text-[10px] text-[#82786F] uppercase tracking-wider font-bold block">
              Daily Target
            </span>
            <span className="text-sm font-bold text-[#38251C]">
              {data.settings.dailyPreparationGoal} Tasks/day
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.12)] text-right">
            <span className="text-[10px] text-[#82786F] uppercase tracking-wider font-bold block">
              Best Aptitude
            </span>
            <span className="text-sm font-bold text-[#69745E]">{bestScore}%</span>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Coding */}
        <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
          <span className="text-xs text-[#82786F]">DSA Mastery</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#171411]">{solvedCoding}</span>
            <span className="text-xs text-[#82786F]">/ {totalCoding} solved</span>
          </div>
          <div className="mt-2 w-full bg-[#E6D8C7] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#76533C] h-1.5 rounded-full" style={{ width: `${codingPercent}%` }} />
          </div>
        </div>

        {/* Aptitude */}
        <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
          <span className="text-xs text-[#82786F]">Aptitude Average</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#171411]">{avgScore}%</span>
            <span className="text-xs text-[#82786F]">{totalAttempts} quizzes</span>
          </div>
          <div className="mt-2 w-full bg-[#E6D8C7] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#69745E] h-1.5 rounded-full" style={{ width: `${avgScore}%` }} />
          </div>
        </div>

        {/* Interviews */}
        <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
          <span className="text-xs text-[#82786F]">Interview Rehearsals</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#171411]">{practicedInterviews}</span>
            <span className="text-xs text-[#82786F]">/ {totalInterviews} practiced</span>
          </div>
          <div className="mt-2 w-full bg-[#E6D8C7] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#38251C] h-1.5 rounded-full"
              style={{
                width: `${totalInterviews > 0 ? (practicedInterviews / totalInterviews) * 100 : 0}%`
              }}
            />
          </div>
        </div>

        {/* Resume */}
        <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
          <span className="text-xs text-[#82786F]">Resume ATS Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#171411]">{resumeScore}%</span>
            <span className="text-xs text-[#82786F]">completeness</span>
          </div>
          <div className="mt-2 w-full bg-[#E6D8C7] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#76533C] h-1.5 rounded-full" style={{ width: `${resumeScore}%` }} />
          </div>
        </div>
      </div>

      {/* Two Column Section: Topic-wise Coding & Applications Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic-wise Coding Progress */}
        <div className="bg-[#FBF8F2] p-5 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(56,37,28,0.1)]">
            <div>
              <h3 className="text-sm font-bold text-[#171411]">Topic-Wise Coding Progress</h3>
              <p className="text-xs text-[#82786F]">Data structure and algorithmic domain breakdown</p>
            </div>
            <Code2 className="w-4 h-4 text-[#76533C]" />
          </div>

          <div className="space-y-3">
            {Object.keys(topicsMap).length > 0 ? (
              Object.entries(topicsMap).map(([topic, stat]) => {
                const percent = Math.round((stat.solved / stat.total) * 100);
                return (
                  <div key={topic} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#171411]">{topic}</span>
                      <span className="text-[#82786F] font-mono">
                        {stat.solved}/{stat.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#E6D8C7] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#76533C] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#82786F] text-center py-6">
                No coding questions tracked yet.
              </p>
            )}
          </div>
        </div>

        {/* Applications Status Pipeline Funnel */}
        <div className="bg-[#FBF8F2] p-5 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(56,37,28,0.1)]">
            <div>
              <h3 className="text-sm font-bold text-[#171411]">Application Pipeline Funnel</h3>
              <p className="text-xs text-[#82786F]">Distribution across recruitment milestones</p>
            </div>
            <Briefcase className="w-4 h-4 text-[#76533C]" />
          </div>

          <div className="space-y-2.5">
            {[
              'Interested',
              'Preparing',
              'Applied',
              'Online Test',
              'Technical Interview',
              'HR Interview',
              'Selected',
              'Rejected'
            ].map((st) => {
              const count = statusCounts[st] || 0;
              const max = Math.max(...Object.values(statusCounts), 1);
              const barWidth = (count / max) * 100;

              return (
                <div key={st} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#39332E] font-medium">{st}</span>
                    <span className="font-bold text-[#171411] font-mono">{count}</span>
                  </div>
                  <div className="w-full bg-[#E6D8C7]/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        st === 'Selected'
                          ? 'bg-[#69745E]'
                          : st === 'Rejected'
                          ? 'bg-[#985F51]'
                          : 'bg-[#76533C]'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress by Company Matrix */}
      <div className="bg-[#FBF8F2] p-5 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(56,37,28,0.14)] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#171411]">Target Company Preparation Readiness</h3>
            <p className="text-xs text-[#82786F]">Checklist completion rates across target organizations</p>
          </div>
          <Building2 className="w-4 h-4 text-[#76533C]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.companies.map((comp) => (
            <div
              key={comp.id}
              className="p-4 rounded-lg bg-[#EFE5D6]/40 border border-[rgba(56,37,28,0.12)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#171411]">{comp.name}</span>
                <span className="text-xs font-bold text-[#69745E]">
                  {comp.preparationProgress}%
                </span>
              </div>
              <p className="text-[11px] text-[#82786F]">{comp.role}</p>

              <div className="w-full bg-[#E6D8C7] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#69745E] h-1.5 rounded-full"
                  style={{ width: `${comp.preparationProgress}%` }}
                />
              </div>

              <div className="text-[10px] text-[#82786F] pt-1 flex justify-between">
                <span>
                  {comp.checklist.filter((c) => c.completed).length} / {comp.checklist.length} checklist items
                </span>
                {comp.applicationDeadline && <span>Due: {comp.applicationDeadline}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
