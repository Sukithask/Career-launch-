import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  X,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw,
  Clock,
  Award,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { InterviewQuestion, InterviewCategory, ConfidenceLevel, CareerLaunchData } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../Toast';

interface InterviewPrepViewProps {
  data: CareerLaunchData;
  onUpdateData: (newData: CareerLaunchData) => void;
}

const ALL_CATEGORIES: InterviewCategory[] = ['Technical', 'HR', 'Behavioral', 'General'];
const ALL_CONFIDENCE_LEVELS: ConfidenceLevel[] = ['Low', 'Medium', 'High'];

type PrepViewMode = 'list' | 'mock' | 'mock_summary';

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({
  data,
  onUpdateData
}) => {
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<PrepViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('All');
  const [selectedPracticed, setSelectedPracticed] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('iq-1');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<InterviewQuestion | null>(null);

  // Form states
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState<InterviewCategory>('Behavioral');
  const [personalAnswer, setPersonalAnswer] = useState('');
  const [notes, setNotes] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>('Medium');
  const [practiced, setPracticed] = useState(false);

  // Mock Interview Mode States
  const [mockQuestions, setMockQuestions] = useState<InterviewQuestion[]>([]);
  const [mockCurrentIndex, setMockCurrentIndex] = useState(0);
  const [mockElapsedSeconds, setMockElapsedSeconds] = useState(0);
  const [mockShowAnswer, setMockShowAnswer] = useState(false);
  const [mockRatings, setMockRatings] = useState<Record<string, ConfidenceLevel>>({});
  const [mockPracticedMap, setMockPracticedMap] = useState<Record<string, boolean>>({});

  // Mock Interview Timer
  useEffect(() => {
    let timer: any;
    if (viewMode === 'mock') {
      timer = setInterval(() => {
        setMockElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewMode]);

  // Start Mock Interview Handler
  const handleStartMockInterview = () => {
    if (data.interviewQuestions.length === 0) {
      showToast('Please add at least one question to the bank first.', 'danger');
      return;
    }

    // Pick up to 5 randomly selected questions
    const shuffled = [...data.interviewQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
    const initialRatings: Record<string, ConfidenceLevel> = {};
    const initialPracticed: Record<string, boolean> = {};

    shuffled.forEach((q) => {
      initialRatings[q.id] = q.confidenceLevel;
      initialPracticed[q.id] = true; // Auto-mark as practiced for the mock session
    });

    setMockQuestions(shuffled);
    setMockCurrentIndex(0);
    setMockElapsedSeconds(0);
    setMockShowAnswer(false);
    setMockRatings(initialRatings);
    setMockPracticedMap(initialPracticed);
    setViewMode('mock');
    showToast(`Started Mock Interview with ${shuffled.length} questions`);
  };

  // Set confidence during mock
  const handleSetMockConfidence = (qId: string, level: ConfidenceLevel) => {
    setMockRatings((prev) => ({ ...prev, [qId]: level }));

    // Update in main database
    const updated = data.interviewQuestions.map((q) =>
      q.id === qId ? { ...q, confidenceLevel: level } : q
    );
    const updatedData = { ...data, interviewQuestions: updated };
    onUpdateData(updatedData);
  };

  // Toggle practiced status during mock
  const handleToggleMockPracticed = (qId: string) => {
    const nextVal = !mockPracticedMap[qId];
    setMockPracticedMap((prev) => ({ ...prev, [qId]: nextVal }));

    const updated = data.interviewQuestions.map((q) =>
      q.id === qId ? { ...q, practiced: nextVal } : q
    );
    const updatedData = { ...data, interviewQuestions: updated };
    onUpdateData(updatedData);
  };

  // Next / Previous navigation in mock
  const handleMockNext = () => {
    setMockShowAnswer(false);
    if (mockCurrentIndex < mockQuestions.length - 1) {
      setMockCurrentIndex(mockCurrentIndex + 1);
    } else {
      // Completed mock interview
      // Update practiced status and activity logs
      let updatedQuestions = [...data.interviewQuestions];
      mockQuestions.forEach((q) => {
        const isPracticed = mockPracticedMap[q.id] ?? true;
        const confidence = mockRatings[q.id] ?? q.confidenceLevel;
        updatedQuestions = updatedQuestions.map((item) =>
          item.id === q.id ? { ...item, practiced: isPracticed, confidenceLevel: confidence } : item
        );
      });

      const updatedData = { ...data, interviewQuestions: updatedQuestions };
      const logged = StorageService.logActivity(updatedData, 'interview');
      onUpdateData(logged);

      setViewMode('mock_summary');
      showToast('Mock Interview finished! Great practice session.');
    }
  };

  const handleMockPrev = () => {
    if (mockCurrentIndex > 0) {
      setMockShowAnswer(false);
      setMockCurrentIndex(mockCurrentIndex - 1);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Question CRUD handlers
  const openNewModal = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setCategory('Behavioral');
    setPersonalAnswer('');
    setNotes('');
    setConfidenceLevel('Medium');
    setPracticed(false);
    setIsModalOpen(true);
  };

  const openEditModal = (q: InterviewQuestion, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingQuestion(q);
    setQuestionText(q.question);
    setCategory(q.category);
    setPersonalAnswer(q.personalAnswer);
    setNotes(q.notes || '');
    setConfidenceLevel(q.confidenceLevel);
    setPracticed(q.practiced);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      showToast('Please enter a question prompt.', 'danger');
      return;
    }

    if (editingQuestion) {
      const updated = data.interviewQuestions.map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              question: questionText.trim(),
              category,
              personalAnswer: personalAnswer.trim(),
              notes: notes.trim() || undefined,
              confidenceLevel,
              practiced
            }
          : q
      );
      const updatedData = { ...data, interviewQuestions: updated };
      StorageService.saveData(updatedData);
      onUpdateData(updatedData);
      showToast('Updated interview question');
    } else {
      const newQ: InterviewQuestion = {
        id: `iq-${Date.now()}`,
        question: questionText.trim(),
        category,
        personalAnswer: personalAnswer.trim(),
        notes: notes.trim() || undefined,
        confidenceLevel,
        practiced,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      const updatedData = {
        ...data,
        interviewQuestions: [newQ, ...data.interviewQuestions]
      };
      const logged = StorageService.logActivity(updatedData, 'interview');
      onUpdateData(logged);
      showToast('Added interview question');
    }

    setIsModalOpen(false);
  };

  const handleTogglePracticed = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = data.interviewQuestions.map((q) => {
      if (q.id === id) {
        const nextState = !q.practiced;
        showToast(nextState ? 'Marked question as practiced' : 'Marked question as pending practice');
        return { ...q, practiced: nextState };
      }
      return q;
    });
    const updatedData = { ...data, interviewQuestions: updated };
    const logged = StorageService.logActivity(updatedData, 'interview');
    onUpdateData(logged);
  };

  const handleDelete = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete interview question: "${text.substring(0, 40)}..."?`)) {
      const updated = data.interviewQuestions.filter((q) => q.id !== id);
      const updatedData = { ...data, interviewQuestions: updated };
      StorageService.saveData(updatedData);
      onUpdateData(updatedData);
      showToast('Deleted interview question', 'info');
    }
  };

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return data.interviewQuestions.filter((q) => {
      const matchesSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.personalAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.notes && q.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
      const matchesConf = selectedConfidence === 'All' || q.confidenceLevel === selectedConfidence;
      const matchesPracticed =
        selectedPracticed === 'All' ||
        (selectedPracticed === 'Practiced' && q.practiced) ||
        (selectedPracticed === 'Pending' && !q.practiced);

      return matchesSearch && matchesCat && matchesConf && matchesPracticed;
    });
  }, [data.interviewQuestions, searchQuery, selectedCategory, selectedConfidence, selectedPracticed]);

  // Aggregate metrics
  const totalCount = data.interviewQuestions.length;
  const practicedCount = data.interviewQuestions.filter((q) => q.practiced).length;
  const highConfidence = data.interviewQuestions.filter((q) => q.confidenceLevel === 'High').length;

  return (
    <div className="space-y-6">
      {/* -------------------- MODE: MOCK INTERVIEW ACTIVE -------------------- */}
      {viewMode === 'mock' && mockQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.18)] p-6 sm:p-8 shadow-md">
            {/* Mock Header: Question Counter & Timer */}
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(56,37,28,0.14)]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#76533C]">
                  Mock Interview Session
                </span>
                <span className="text-xs text-[#82786F]">·</span>
                <span className="text-xs font-semibold text-[#171411]">
                  Question {mockCurrentIndex + 1} of {mockQuestions.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#38251C] bg-[#E6D8C7]/60 px-2.5 py-1 rounded">
                  <Clock className="w-3.5 h-3.5 text-[#76533C]" />
                  <span>{formatTimer(mockElapsedSeconds)}</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Exit mock interview? Any ratings saved so far will be preserved.')) {
                      setViewMode('list');
                    }
                  }}
                  className="text-xs text-[#82786F] hover:text-[#985F51] font-medium"
                >
                  Exit Session
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="w-full bg-[#E6D8C7] h-1.5 rounded-full overflow-hidden my-4">
              <div
                className="bg-[#76533C] h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((mockCurrentIndex + 1) / mockQuestions.length) * 100}%`
                }}
              />
            </div>

            {/* Question Card Body */}
            {mockQuestions[mockCurrentIndex] && (
              <div className="my-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#76533C] uppercase tracking-wider">
                    {mockQuestions[mockCurrentIndex].category} Interview Question
                  </span>
                  <span className="text-[11px] text-[#82786F]">
                    Target answer time: ~90 - 120 seconds
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#171411] leading-relaxed">
                  "{mockQuestions[mockCurrentIndex].question}"
                </h3>

                <div className="p-3 rounded-lg bg-[#EFE5D6]/40 border border-[rgba(56,37,28,0.1)] text-xs text-[#82786F]">
                  <p className="leading-relaxed">
                    💡 <strong>Interviewer Tip:</strong> Speak clearly and structure your response out loud. State context, specific actions taken, and quantified business or technical results.
                  </p>
                </div>

                {/* Model Answer Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setMockShowAnswer(!mockShowAnswer)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] hover:bg-[#E6D8C7]/50 text-xs font-semibold text-[#38251C] transition-colors"
                  >
                    {mockShowAnswer ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-[#76533C]" />
                        <span>Hide Prepared Answer & Notes</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-[#76533C]" />
                        <span>Reveal Prepared Answer & Outline</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Prepared Answer & Notes Preview */}
                {mockShowAnswer && (
                  <div className="p-4 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.14)] space-y-3 animate-in fade-in-50 duration-150 text-xs">
                    {mockQuestions[mockCurrentIndex].personalAnswer ? (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#76533C] block mb-1">
                          Your Drafted Response:
                        </span>
                        <p className="text-[#171411] leading-relaxed whitespace-pre-wrap">
                          {mockQuestions[mockCurrentIndex].personalAnswer}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[#82786F] italic">
                        No drafted answer was saved for this question yet.
                      </p>
                    )}

                    {mockQuestions[mockCurrentIndex].notes && (
                      <div className="pt-2 border-t border-[rgba(56,37,28,0.1)] text-[#38251C]">
                        <span className="font-bold text-[11px] block">Key Talking Points:</span>
                        <span className="text-[#82786F]">{mockQuestions[mockCurrentIndex].notes}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Self Evaluation Controls */}
                <div className="pt-4 border-t border-[rgba(56,37,28,0.12)] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#39332E]">
                      Rate Your Verbal Delivery Confidence:
                    </span>

                    <div className="flex items-center gap-1.5">
                      {ALL_CONFIDENCE_LEVELS.map((level) => {
                        const currentVal = mockRatings[mockQuestions[mockCurrentIndex].id];
                        const isSelected = currentVal === level;

                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              handleSetMockConfidence(mockQuestions[mockCurrentIndex].id, level)
                            }
                            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                              isSelected
                                ? level === 'High'
                                  ? 'bg-[#69745E] text-[#FBF8F2] shadow-xs'
                                  : level === 'Medium'
                                  ? 'bg-[#76533C] text-[#FBF8F2] shadow-xs'
                                  : 'bg-[#985F51] text-[#FBF8F2] shadow-xs'
                                : 'bg-[#E6D8C7]/50 text-[#39332E] hover:bg-[#E6D8C7]'
                            }`}
                          >
                            {level}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#39332E]">
                      <input
                        type="checkbox"
                        checked={mockPracticedMap[mockQuestions[mockCurrentIndex].id] ?? true}
                        onChange={() =>
                          handleToggleMockPracticed(mockQuestions[mockCurrentIndex].id)
                        }
                        className="w-4 h-4 rounded text-[#76533C] focus:ring-[#76533C] accent-[#76533C]"
                      />
                      <span>Mark question as rehearsed and practiced</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Stepper Buttons */}
            <div className="mt-8 pt-4 border-t border-[rgba(56,37,28,0.14)] flex items-center justify-between">
              <button
                type="button"
                onClick={handleMockPrev}
                disabled={mockCurrentIndex === 0}
                className="px-3.5 py-2 rounded-md border border-[rgba(56,37,28,0.2)] text-[#38251C] text-xs font-semibold hover:bg-[#E6D8C7]/50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleMockNext}
                className="px-5 py-2 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>
                  {mockCurrentIndex === mockQuestions.length - 1
                    ? 'Complete Mock Interview'
                    : 'Next Question'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODE: MOCK SUMMARY -------------------- */}
      {viewMode === 'mock_summary' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.18)] p-6 sm:p-8 text-center shadow-md">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E6D8C7] text-[#38251C] mb-3">
              <Award className="w-7 h-7 text-[#76533C]" />
            </div>

            <h3 className="text-xl font-extrabold text-[#171411]">
              Mock Interview Completed!
            </h3>
            <p className="text-xs text-[#82786F] mt-1">
              Practiced {mockQuestions.length} randomized questions from your personal bank
            </p>

            <div className="my-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="p-3 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.1)]">
                <span className="text-[11px] text-[#82786F]">Questions Covered</span>
                <p className="text-xl font-bold text-[#171411]">{mockQuestions.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.1)]">
                <span className="text-[11px] text-[#82786F]">Total Session Time</span>
                <p className="text-xl font-bold font-mono text-[#38251C]">
                  {formatTimer(mockElapsedSeconds)}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.1)]">
                <span className="text-[11px] text-[#82786F]">High Confidence</span>
                <p className="text-xl font-bold text-[#69745E]">
                  {Object.values(mockRatings).filter((r) => r === 'High').length}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleStartMockInterview}
                className="px-4 py-2 rounded-md bg-[#38251C] text-[#FBF8F2] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#171411] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Another Mock Session (Random 5)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-4 py-2 rounded-md border border-[rgba(56,37,28,0.2)] text-[#38251C] text-xs font-semibold hover:bg-[#E6D8C7]/50 transition-colors"
              >
                Return to Question Bank
              </button>
            </div>
          </div>

          {/* Rehearsed Questions Breakdown */}
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)] p-6 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-[#171411] pb-2 border-b border-[rgba(56,37,28,0.14)]">
              Session Question Breakdown
            </h4>

            <div className="divide-y divide-[rgba(56,37,28,0.08)]">
              {mockQuestions.map((q, idx) => {
                const conf = mockRatings[q.id] || q.confidenceLevel;
                return (
                  <div key={q.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-[#171411]">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="flex items-center gap-2 text-[#82786F] mt-0.5 text-[11px]">
                        <span>{q.category}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            conf === 'High'
                              ? 'text-[#69745E] font-medium'
                              : conf === 'Medium'
                              ? 'text-[#76533C] font-medium'
                              : 'text-[#985F51] font-medium'
                          }
                        >
                          {conf} Confidence
                        </span>
                      </div>
                    </div>
                    <span className="text-[#69745E] font-semibold flex items-center gap-1 shrink-0 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Rehearsed
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODE: STANDARD QUESTIONS LIST -------------------- */}
      {viewMode === 'list' && (
        <>
          {/* Top summary strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
            <div>
              <span className="text-xs text-[#82786F]">Questions Bank</span>
              <p className="text-xl font-bold text-[#171411]">{totalCount}</p>
            </div>
            <div>
              <span className="text-xs text-[#69745E] font-medium">Rehearsed & Practiced</span>
              <p className="text-xl font-bold text-[#171411]">
                {practicedCount} <span className="text-xs font-normal text-[#82786F]">/ {totalCount}</span>
              </p>
            </div>
            <div>
              <span className="text-xs text-[#76533C] font-medium">High Confidence</span>
              <p className="text-xl font-bold text-[#171411]">{highConfidence}</p>
            </div>
            <div>
              <span className="text-xs text-[#82786F]">Interview Readiness</span>
              <p className="text-xl font-bold text-[#38251C]">
                {totalCount > 0 ? Math.round((practicedCount / totalCount) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Filter and Action Bar */}
          <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#82786F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search interview questions by prompt, answer, or notes..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Mock Interview Mode Trigger Button */}
                <button
                  type="button"
                  onClick={handleStartMockInterview}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#76533C] hover:bg-[#38251C] text-[#FBF8F2] text-xs font-semibold shadow-xs transition-colors shrink-0"
                  title="Randomly picks 5 saved questions and runs a timed practice session"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mock Interview (5 Qs)</span>
                </button>

                <button
                  type="button"
                  onClick={openNewModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[rgba(56,37,28,0.1)] text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#82786F]">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2 py-1 rounded border border-[rgba(56,37,28,0.18)] bg-[#FBF8F2] text-[#171411] font-medium"
                >
                  <option value="All">All Categories</option>
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#82786F]">Confidence:</span>
                <select
                  value={selectedConfidence}
                  onChange={(e) => setSelectedConfidence(e.target.value)}
                  className="px-2 py-1 rounded border border-[rgba(56,37,28,0.18)] bg-[#FBF8F2] text-[#171411] font-medium"
                >
                  <option value="All">All Levels</option>
                  {ALL_CONFIDENCE_LEVELS.map((conf) => (
                    <option key={conf} value={conf}>
                      {conf} Confidence
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#82786F]">Status:</span>
                <select
                  value={selectedPracticed}
                  onChange={(e) => setSelectedPracticed(e.target.value)}
                  className="px-2 py-1 rounded border border-[rgba(56,37,28,0.18)] bg-[#FBF8F2] text-[#171411] font-medium"
                >
                  <option value="All">All Practice States</option>
                  <option value="Practiced">Practiced</option>
                  <option value="Pending">Pending Rehearsal</option>
                </select>
              </div>

              {(selectedCategory !== 'All' || selectedConfidence !== 'All' || selectedPracticed !== 'All' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedConfidence('All');
                    setSelectedPracticed('All');
                    setSearchQuery('');
                  }}
                  className="text-[#985F51] hover:underline text-xs ml-auto font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Questions Accordion / List */}
          <div className="space-y-3">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => {
                const isExpanded = expandedId === q.id;

                return (
                  <div
                    key={q.id}
                    className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)] p-4 sm:p-5 shadow-xs transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => handleTogglePracticed(q.id, e)}
                          className="mt-0.5 text-[#76533C] hover:text-[#38251C]"
                          title={q.practiced ? 'Practiced' : 'Mark as Practiced'}
                        >
                          {q.practiced ? (
                            <CheckCircle2 className="w-5 h-5 text-[#69745E]" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#B5A99B]" />
                          )}
                        </button>

                        <div
                          onClick={() => setExpandedId(isExpanded ? null : q.id)}
                          className="cursor-pointer min-w-0 flex-1 group"
                        >
                          <h4 className="text-sm font-bold text-[#171411] group-hover:text-[#76533C] transition-colors">
                            {q.question}
                          </h4>

                          {/* Clean Unboxed Metadata */}
                          <div className="flex items-center gap-2 text-xs text-[#82786F] mt-1">
                            <span className="font-semibold text-[#38251C]">{q.category}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={
                                q.confidenceLevel === 'High'
                                  ? 'text-[#69745E] font-medium'
                                  : q.confidenceLevel === 'Medium'
                                  ? 'text-[#76533C] font-medium'
                                  : 'text-[#985F51] font-medium'
                              }
                            >
                              {q.confidenceLevel} Confidence
                            </span>
                            {q.practiced && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#69745E] font-medium">Rehearsed</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => openEditModal(q, e)}
                          className="p-1.5 rounded hover:bg-[#E6D8C7]/50 text-[#82786F] hover:text-[#171411]"
                          title="Edit question"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(q.id, q.question, e)}
                          className="p-1.5 rounded hover:bg-[#985F51]/10 text-[#82786F] hover:text-[#985F51]"
                          title="Delete question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : q.id)}
                          className="p-1.5 rounded hover:bg-[#E6D8C7]/50 text-[#38251C]"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Answer Body */}
                    {isExpanded && (
                      <div className="mt-4 pt-3.5 border-t border-[rgba(56,37,28,0.12)] space-y-3 text-xs animate-in fade-in-50">
                        {q.personalAnswer ? (
                          <div className="p-3.5 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.1)]">
                            <span className="text-[10px] uppercase font-bold text-[#76533C] tracking-wider block mb-1">
                              Drafted Answer (STAR Structure)
                            </span>
                            <p className="text-[#171411] leading-relaxed whitespace-pre-wrap">
                              {q.personalAnswer}
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 rounded-lg bg-[#E6D8C7]/40 text-[#82786F] italic text-center">
                            No personal answer recorded yet. Click Edit to craft your response.
                          </div>
                        )}

                        {q.notes && (
                          <div className="p-2.5 rounded-lg bg-[#FBF8F2] border border-[rgba(56,37,28,0.14)] flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-[#76533C] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[#38251C] block text-[11px]">Interviewer Tip / Delivery Note</span>
                              <span className="text-[#82786F]">{q.notes}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-[#82786F] bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)]">
                <Users className="w-10 h-10 mx-auto text-[#B5A99B] mb-2" />
                <h4 className="text-sm font-bold text-[#171411]">No interview questions found</h4>
                <p className="text-xs text-[#82786F] mt-1">Add behavioral or technical questions to rehearse.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/50 backdrop-blur-xs">
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.2)] max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(56,37,28,0.14)]">
              <h3 className="text-base font-bold text-[#171411]">
                {editingQuestion ? 'Edit Interview Question' : 'Add Interview Question'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#82786F] hover:text-[#171411] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Question Prompt *
                </label>
                <input
                  type="text"
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. Tell me about a time you missed a project deadline."
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InterviewCategory)}
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Confidence Level
                  </label>
                  <select
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(e.target.value as ConfidenceLevel)}
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  >
                    {ALL_CONFIDENCE_LEVELS.map((conf) => (
                      <option key={conf} value={conf}>
                        {conf} Confidence
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Drafted Personal Answer
                </label>
                <textarea
                  rows={4}
                  value={personalAnswer}
                  onChange={(e) => setPersonalAnswer(e.target.value)}
                  placeholder="Use the STAR method: Situation, Task, Action, and Result with quantifiable metrics..."
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Interviewer Notes / Key Pointers
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keep under 90s, emphasize empathy, highlight Redis caching..."
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#39332E]">
                  <input
                    type="checkbox"
                    checked={practiced}
                    onChange={(e) => setPracticed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#76533C] focus:ring-[#76533C] accent-[#76533C]"
                  />
                  <span>Mark as Rehearsed / Practiced</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(56,37,28,0.14)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-md border border-[rgba(56,37,28,0.2)] text-xs font-semibold text-[#39332E] hover:bg-[#E6D8C7]/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold"
                >
                  {editingQuestion ? 'Save Changes' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
