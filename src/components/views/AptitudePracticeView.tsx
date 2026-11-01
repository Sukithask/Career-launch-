import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ChevronRight,
  HelpCircle,
  BarChart3,
  ListFilter
} from 'lucide-react';
import {
  AptitudeCategory,
  AptitudeQuestion,
  AptitudeAttempt,
  AptitudeAnswerRecord,
  CareerLaunchData
} from '../../types';
import { APTITUDE_QUESTION_BANK, StorageService } from '../../services/storage';
import { useToast } from '../Toast';

interface AptitudePracticeViewProps {
  data: CareerLaunchData;
  onUpdateData: (newData: CareerLaunchData) => void;
}

type QuizState = 'selection' | 'in_progress' | 'results';

export const AptitudePracticeView: React.FC<AptitudePracticeViewProps> = ({
  data,
  onUpdateData
}) => {
  const { showToast } = useToast();

  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [selectedCategory, setSelectedCategory] = useState<AptitudeCategory | 'Comprehensive'>('Comprehensive');
  const [quizQuestions, setQuizQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<AptitudeAttempt | null>(null);
  const [historyFilter, setHistoryFilter] = useState<string>('All');
  const [inspectingAttempt, setInspectingAttempt] = useState<AptitudeAttempt | null>(null);

  // Timer effect during quiz
  useEffect(() => {
    let interval: any;
    if (quizState === 'in_progress') {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizState]);

  // Start Quiz handler
  const startQuiz = (cat: AptitudeCategory | 'Comprehensive') => {
    setSelectedCategory(cat);
    let questions: AptitudeQuestion[] = [];

    if (cat === 'Comprehensive') {
      // Pick 2 from each of Quant, Logic, Verbal
      const quant = APTITUDE_QUESTION_BANK.filter((q) => q.category === 'Quantitative Aptitude').slice(0, 2);
      const logic = APTITUDE_QUESTION_BANK.filter((q) => q.category === 'Logical Reasoning').slice(0, 2);
      const verbal = APTITUDE_QUESTION_BANK.filter((q) => q.category === 'Verbal Ability').slice(0, 2);
      questions = [...quant, ...logic, ...verbal];
    } else {
      questions = APTITUDE_QUESTION_BANK.filter((q) => q.category === cat);
    }

    setQuizQuestions(questions);
    setCurrentIndex(0);
    setSelectedOptions({});
    setSecondsElapsed(0);
    setQuizState('in_progress');
  };

  // Option selection
  const handleSelectOption = (optionIndex: number) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentIndex]: optionIndex
    });
  };

  // Next or Finish Quiz
  const handleNextOrFinish = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate score and build answer records
      let score = 0;
      const answerRecords: AptitudeAnswerRecord[] = quizQuestions.map((q, idx) => {
        const chosen = selectedOptions[idx] !== undefined ? selectedOptions[idx] : -1;
        const isCorrect = chosen === q.correctIndex;
        if (isCorrect) score += 1;
        return {
          questionId: q.id,
          questionText: q.question,
          selectedOptionIndex: chosen,
          correctOptionIndex: q.correctIndex,
          isCorrect,
          explanation: q.explanation
        };
      });

      const percentage = Math.round((score / quizQuestions.length) * 100);
      const newAttempt: AptitudeAttempt = {
        id: `att-${Date.now()}`,
        category: selectedCategory,
        totalQuestions: quizQuestions.length,
        score,
        percentage,
        date: new Date().toISOString().split('T')[0],
        timeTakenSeconds: secondsElapsed,
        answers: answerRecords
      };

      const updatedAttempts = [newAttempt, ...data.aptitudeAttempts];
      const updatedData = {
        ...data,
        aptitudeAttempts: updatedAttempts
      };
      const logged = StorageService.logActivity(updatedData, 'aptitude');
      onUpdateData(logged);

      setLastAttempt(newAttempt);
      setQuizState('results');
      showToast(`Quiz completed: ${score}/${quizQuestions.length} (${percentage}%)`);
    }
  };

  // Format seconds mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Aggregate stats
  const allAttempts = data.aptitudeAttempts;
  const bestScore = allAttempts.length > 0 ? Math.max(...allAttempts.map((a) => a.percentage)) : 0;
  const avgScore = allAttempts.length > 0
    ? Math.round(allAttempts.reduce((acc, a) => acc + a.percentage, 0) / allAttempts.length)
    : 0;

  const filteredHistory = allAttempts.filter((a) =>
    historyFilter === 'All' ? true : a.category === historyFilter
  );

  return (
    <div className="space-y-6">
      {/* Quiz Screen or Category Selection Screen */}
      {quizState === 'selection' && (
        <div className="space-y-6">
          {/* Top Performance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
            <div>
              <span className="text-xs text-[#82786F]">Tests Completed</span>
              <p className="text-xl font-bold text-[#171411]">{allAttempts.length}</p>
            </div>
            <div>
              <span className="text-xs text-[#82786F]">Best Score</span>
              <p className="text-xl font-bold text-[#69745E]">{bestScore}%</p>
            </div>
            <div>
              <span className="text-xs text-[#82786F]">Average Score</span>
              <p className="text-xl font-bold text-[#76533C]">{avgScore}%</p>
            </div>
            <div>
              <span className="text-xs text-[#82786F]">Question Pool</span>
              <p className="text-xl font-bold text-[#171411]">{APTITUDE_QUESTION_BANK.length} Qs</p>
            </div>
          </div>

          {/* Test Categories */}
          <div>
            <div className="mb-3">
              <h3 className="text-base font-bold text-[#171411]">Choose a Placement Practice Module</h3>
              <p className="text-xs text-[#82786F]">
                Standard timed assessments covering core on-campus hiring patterns
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Quant */}
              <div className="bg-[#FBF8F2] p-5 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs flex flex-col justify-between hover:border-[#76533C]/50 transition-all group">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#E6D8C7] text-[#38251C] flex items-center justify-center font-bold text-xs mb-3">
                    QA
                  </div>
                  <h4 className="text-sm font-bold text-[#171411] group-hover:text-[#76533C] transition-colors">
                    Quantitative Aptitude
                  </h4>
                  <p className="text-xs text-[#82786F] mt-1 leading-relaxed">
                    Time & work, trains, speed math, percentages, permutations, and averages.
                  </p>
                  <div className="mt-3 text-[11px] text-[#82786F]">
                    5 Questions · 5 mins recommended
                  </div>
                </div>
                <button
                  onClick={() => startQuiz('Quantitative Aptitude')}
                  className="mt-4 w-full py-2 px-3 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Quant Test</span>
                </button>
              </div>

              {/* Logical */}
              <div className="bg-[#FBF8F2] p-5 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs flex flex-col justify-between hover:border-[#76533C]/50 transition-all group">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#E6D8C7] text-[#38251C] flex items-center justify-center font-bold text-xs mb-3">
                    LR
                  </div>
                  <h4 className="text-sm font-bold text-[#171411] group-hover:text-[#76533C] transition-colors">
                    Logical Reasoning
                  </h4>
                  <p className="text-xs text-[#82786F] mt-1 leading-relaxed">
                    Number series, blood relations, syllogisms, seating arrangements, coding-decoding.
                  </p>
                  <div className="mt-3 text-[11px] text-[#82786F]">
                    5 Questions · 5 mins recommended
                  </div>
                </div>
                <button
                  onClick={() => startQuiz('Logical Reasoning')}
                  className="mt-4 w-full py-2 px-3 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Logic Test</span>
                </button>
              </div>

              {/* Verbal */}
              <div className="bg-[#FBF8F2] p-5 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs flex flex-col justify-between hover:border-[#76533C]/50 transition-all group">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#E6D8C7] text-[#38251C] flex items-center justify-center font-bold text-xs mb-3">
                    VA
                  </div>
                  <h4 className="text-sm font-bold text-[#171411] group-hover:text-[#76533C] transition-colors">
                    Verbal Ability
                  </h4>
                  <p className="text-xs text-[#82786F] mt-1 leading-relaxed">
                    Vocabulary, sentence correction, synonyms, antonyms, and subject-verb agreement.
                  </p>
                  <div className="mt-3 text-[11px] text-[#82786F]">
                    5 Questions · 4 mins recommended
                  </div>
                </div>
                <button
                  onClick={() => startQuiz('Verbal Ability')}
                  className="mt-4 w-full py-2 px-3 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Verbal Test</span>
                </button>
              </div>

              {/* Comprehensive */}
              <div className="bg-[#E6D8C7]/50 p-5 rounded-xl border border-[rgba(56,37,28,0.2)] shadow-xs flex flex-col justify-between hover:border-[#76533C] transition-all group">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#38251C] text-[#FBF8F2] flex items-center justify-center font-bold text-xs mb-3">
                    ALL
                  </div>
                  <h4 className="text-sm font-bold text-[#171411] group-hover:text-[#76533C] transition-colors">
                    Comprehensive Mock OA
                  </h4>
                  <p className="text-xs text-[#82786F] mt-1 leading-relaxed">
                    Mixed simulation combining Quantitative, Logical, and Verbal in one timed assessment.
                  </p>
                  <div className="mt-3 text-[11px] text-[#82786F]">
                    6 Questions · Full assessment
                  </div>
                </div>
                <button
                  onClick={() => startQuiz('Comprehensive')}
                  className="mt-4 w-full py-2 px-3 rounded-md bg-[#76533C] hover:bg-[#38251C] text-[#FBF8F2] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Comprehensive OA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Attempt History Table */}
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)] p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#171411]">Attempt History & Review</h3>
                <p className="text-xs text-[#82786F]">Review past scores, time spent, and performance</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#82786F]">Filter:</span>
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="px-2 py-1 rounded border border-[rgba(56,37,28,0.18)] bg-[#FBF8F2] text-[#171411] font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="Quantitative Aptitude">Quantitative</option>
                  <option value="Logical Reasoning">Logical</option>
                  <option value="Verbal Ability">Verbal</option>
                  <option value="Comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>

            {filteredHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(56,37,28,0.14)] text-[#82786F] font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Percentage</th>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(56,37,28,0.08)]">
                    {filteredHistory.map((att) => (
                      <tr key={att.id} className="hover:bg-[#E6D8C7]/30 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#171411]">{att.category}</td>
                        <td className="py-3 px-3 text-[#82786F]">{att.date}</td>
                        <td className="py-3 px-3 font-mono font-medium text-[#38251C]">
                          {att.score} / {att.totalQuestions}
                        </td>
                        <td className="py-3 px-3 font-bold">
                          <span
                            className={
                              att.percentage >= 80
                                ? 'text-[#69745E]'
                                : att.percentage >= 60
                                ? 'text-[#76533C]'
                                : 'text-[#985F51]'
                            }
                          >
                            {att.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#82786F] font-mono">
                          {formatTime(att.timeTakenSeconds)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {att.answers && att.answers.length > 0 ? (
                            <button
                              onClick={() => setInspectingAttempt(att)}
                              className="text-xs text-[#76533C] hover:text-[#38251C] font-semibold hover:underline"
                            >
                              Inspect Answers
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#B5A99B]">Saved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#82786F]">
                No attempts recorded yet for this category. Take a practice quiz above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUIZ IN PROGRESS MODE */}
      {quizState === 'in_progress' && quizQuestions.length > 0 && (
        <div className="max-w-2xl mx-auto bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.18)] p-6 sm:p-8 shadow-md">
          {/* Quiz Top bar: Step and Timer */}
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(56,37,28,0.14)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#76533C]">
                {selectedCategory}
              </span>
              <span className="text-xs text-[#82786F]">·</span>
              <span className="text-xs text-[#82786F]">
                Question {currentIndex + 1} of {quizQuestions.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#38251C] bg-[#E6D8C7]/60 px-2.5 py-1 rounded">
              <Clock className="w-3.5 h-3.5 text-[#76533C]" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-[#E6D8C7] h-1.5 rounded-full overflow-hidden my-4">
            <div
              className="bg-[#76533C] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="my-6">
            <h3 className="text-base sm:text-lg font-bold text-[#171411] leading-relaxed">
              {quizQuestions[currentIndex].question}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {quizQuestions[currentIndex].options.map((opt, optIdx) => {
              const isSelected = selectedOptions[currentIndex] === optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#E6D8C7]/70 border-[#76533C] text-[#171411] shadow-xs'
                      : 'bg-[#FBF8F2] border-[rgba(56,37,28,0.2)] text-[#39332E] hover:bg-[#E6D8C7]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                        isSelected ? 'bg-[#38251C] text-[#FBF8F2]' : 'bg-[#E6D8C7] text-[#38251C]'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#76533C]" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 pt-4 border-t border-[rgba(56,37,28,0.14)] flex items-center justify-between">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to exit the quiz? Current progress will not be saved.')) {
                  setQuizState('selection');
                }
              }}
              className="text-xs text-[#82786F] hover:text-[#985F51]"
            >
              Cancel Assessment
            </button>

            <button
              onClick={handleNextOrFinish}
              disabled={selectedOptions[currentIndex] === undefined}
              className="px-5 py-2.5 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>{currentIndex === quizQuestions.length - 1 ? 'Finish & View Score' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {quizState === 'results' && lastAttempt && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.18)] p-6 sm:p-8 text-center shadow-md">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E6D8C7] text-[#38251C] mb-3">
              <Award className="w-7 h-7 text-[#76533C]" />
            </div>

            <h3 className="text-xl font-extrabold text-[#171411]">Assessment Completed!</h3>
            <p className="text-xs text-[#82786F] mt-1">{lastAttempt.category} Assessment</p>

            <div className="my-6 grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="p-3 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.1)]">
                <span className="text-[11px] text-[#82786F]">Final Score</span>
                <p className="text-xl font-bold text-[#171411]">
                  {lastAttempt.score} / {lastAttempt.totalQuestions}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.1)]">
                <span className="text-[11px] text-[#82786F]">Percentage</span>
                <p className="text-xl font-bold text-[#69745E]">{lastAttempt.percentage}%</p>
              </div>
              <div className="p-3 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.1)]">
                <span className="text-[11px] text-[#82786F]">Time Taken</span>
                <p className="text-xl font-bold font-mono text-[#38251C]">
                  {formatTime(lastAttempt.timeTakenSeconds)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => startQuiz(selectedCategory)}
                className="px-4 py-2 rounded-md bg-[#38251C] text-[#FBF8F2] text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={() => setQuizState('selection')}
                className="px-4 py-2 rounded-md border border-[rgba(56,37,28,0.2)] text-[#38251C] text-xs font-semibold hover:bg-[#E6D8C7]/50"
              >
                Back to Modules
              </button>
            </div>
          </div>

          {/* Detailed Question by Question Review */}
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)] p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#171411] pb-2 border-b border-[rgba(56,37,28,0.14)]">
              Detailed Question Review & Explanations
            </h4>

            <div className="space-y-4">
              {lastAttempt.answers.map((rec, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border text-xs space-y-2 ${
                    rec.isCorrect
                      ? 'bg-[#69745E]/5 border-[#69745E]/30'
                      : 'bg-[#985F51]/5 border-[#985F51]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-[#171411]">
                      Q{i + 1}. {rec.questionText}
                    </p>
                    {rec.isCorrect ? (
                      <span className="text-[#69745E] font-semibold flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="text-[#985F51] font-semibold flex items-center gap-1 shrink-0">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[rgba(56,37,28,0.08)] text-[#39332E]">
                    <p className="font-semibold text-[#76533C]">Solution & Explanation:</p>
                    <p className="mt-0.5 leading-relaxed text-[#82786F]">{rec.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inspect Past Attempt Modal */}
      {inspectingAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/50 backdrop-blur-xs">
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.2)] max-w-xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(56,37,28,0.14)]">
              <div>
                <h3 className="text-base font-bold text-[#171411]">
                  Review: {inspectingAttempt.category}
                </h3>
                <p className="text-xs text-[#82786F]">
                  Score: {inspectingAttempt.score}/{inspectingAttempt.totalQuestions} ({inspectingAttempt.percentage}%) · Time: {formatTime(inspectingAttempt.timeTakenSeconds)}
                </p>
              </div>
              <button
                onClick={() => setInspectingAttempt(null)}
                className="text-[#82786F] hover:text-[#171411] text-xs font-semibold p-1"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto my-4 pr-1 flex-1">
              {inspectingAttempt.answers.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                    ans.isCorrect ? 'bg-[#69745E]/5 border-[#69745E]/30' : 'bg-[#985F51]/5 border-[#985F51]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-[#171411]">Q{idx + 1}. {ans.questionText}</span>
                    <span className={ans.isCorrect ? 'text-[#69745E] font-bold' : 'text-[#985F51] font-bold'}>
                      {ans.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#82786F] leading-relaxed">
                    <strong className="text-[#38251C]">Explanation:</strong> {ans.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[rgba(56,37,28,0.14)] text-right">
              <button
                onClick={() => setInspectingAttempt(null)}
                className="px-4 py-2 rounded-md bg-[#38251C] text-[#FBF8F2] text-xs font-semibold"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
