import React, { useState, useMemo } from 'react';
import {
  Code2,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  FileText,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { CodingQuestion, CodingTopic, Difficulty, CareerLaunchData } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../Toast';

interface CodingTrackerViewProps {
  data: CareerLaunchData;
  onUpdateData: (newData: CareerLaunchData) => void;
  initialAddModalOpen?: boolean;
}

const ALL_TOPICS: CodingTopic[] = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stacks and Queues',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Recursion',
  'Searching',
  'Sorting',
  'SQL',
  'Other'
];

const ALL_DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const CodingTrackerView: React.FC<CodingTrackerViewProps> = ({
  data,
  onUpdateData,
  initialAddModalOpen = false
}) => {
  const { showToast } = useToast();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedSolvedStatus, setSelectedSolvedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'difficulty' | 'title'>('date');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(initialAddModalOpen);
  const [editingQuestion, setEditingQuestion] = useState<CodingQuestion | null>(null);
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formTopic, setFormTopic] = useState<CodingTopic>('Arrays');
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('Medium');
  const [formSourceLink, setFormSourceLink] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formDatePracticed, setFormDatePracticed] = useState(new Date().toISOString().split('T')[0]);
  const [formSolved, setFormSolved] = useState(false);

  // Open modal for new question
  const openNewModal = () => {
    setEditingQuestion(null);
    setFormTitle('');
    setFormTopic('Arrays');
    setFormDifficulty('Medium');
    setFormSourceLink('');
    setFormNotes('');
    setFormDatePracticed(new Date().toISOString().split('T')[0]);
    setFormSolved(false);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (q: CodingQuestion) => {
    setEditingQuestion(q);
    setFormTitle(q.title);
    setFormTopic(q.topic);
    setFormDifficulty(q.difficulty);
    setFormSourceLink(q.sourceLink || '');
    setFormNotes(q.notes || '');
    setFormDatePracticed(q.datePracticed || new Date().toISOString().split('T')[0]);
    setFormSolved(q.solved);
    setIsModalOpen(true);
  };

  // Save question (Add or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Please provide a question title.', 'danger');
      return;
    }

    let updatedQuestions: CodingQuestion[];
    if (editingQuestion) {
      updatedQuestions = data.codingQuestions.map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              title: formTitle.trim(),
              topic: formTopic,
              difficulty: formDifficulty,
              sourceLink: formSourceLink.trim() || undefined,
              notes: formNotes.trim() || undefined,
              datePracticed: formDatePracticed,
              solved: formSolved
            }
          : q
      );
      showToast(`Updated "${formTitle.trim()}"`);
    } else {
      const newQuestion: CodingQuestion = {
        id: `code-${Date.now()}`,
        title: formTitle.trim(),
        topic: formTopic,
        difficulty: formDifficulty,
        sourceLink: formSourceLink.trim() || undefined,
        notes: formNotes.trim() || undefined,
        datePracticed: formDatePracticed,
        solved: formSolved,
        createdAt: new Date().toISOString()
      };
      updatedQuestions = [newQuestion, ...data.codingQuestions];
      showToast(`Added "${formTitle.trim()}"`);
    }

    const updatedData: CareerLaunchData = {
      ...data,
      codingQuestions: updatedQuestions
    };
    const logged = StorageService.logActivity(updatedData, 'coding');
    onUpdateData(logged);
    setIsModalOpen(false);
  };

  // Toggle solved status directly in table
  const handleToggleSolved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = data.codingQuestions.map((q) => {
      if (q.id === id) {
        const nextState = !q.solved;
        showToast(nextState ? `Marked "${q.title}" solved` : `Marked "${q.title}" pending`);
        return { ...q, solved: nextState };
      }
      return q;
    });

    const updatedData = { ...data, codingQuestions: updated };
    const logged = StorageService.logActivity(updatedData, 'coding');
    onUpdateData(logged);
  };

  // Delete question
  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = data.codingQuestions.filter((q) => q.id !== id);
      const updatedData = { ...data, codingQuestions: updated };
      StorageService.saveData(updatedData);
      onUpdateData(updatedData);
      showToast(`Deleted "${title}"`, 'info');
    }
  };

  // Filter and sort calculations
  const filteredQuestions = useMemo(() => {
    return data.codingQuestions
      .filter((q) => {
        // Search filter
        const matchSearch =
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (q.notes && q.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
          q.topic.toLowerCase().includes(searchQuery.toLowerCase());

        // Topic filter
        const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;

        // Difficulty filter
        const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

        // Solved filter
        const matchSolved =
          selectedSolvedStatus === 'All' ||
          (selectedSolvedStatus === 'Solved' && q.solved) ||
          (selectedSolvedStatus === 'Unsolved' && !q.solved);

        return matchSearch && matchTopic && matchDifficulty && matchSolved;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return (b.datePracticed || '').localeCompare(a.datePracticed || '');
        }
        if (sortBy === 'difficulty') {
          const weight = { Easy: 1, Medium: 2, Hard: 3 };
          return weight[b.difficulty] - weight[a.difficulty];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [data.codingQuestions, searchQuery, selectedTopic, selectedDifficulty, selectedSolvedStatus, sortBy]);

  // Statistics
  const totalCount = data.codingQuestions.length;
  const solvedCount = data.codingQuestions.filter((q) => q.solved).length;
  const easyCount = data.codingQuestions.filter((q) => q.difficulty === 'Easy' && q.solved).length;
  const mediumCount = data.codingQuestions.filter((q) => q.difficulty === 'Medium' && q.solved).length;
  const hardCount = data.codingQuestions.filter((q) => q.difficulty === 'Hard' && q.solved).length;

  return (
    <div className="space-y-6">
      {/* Top summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
        <div>
          <span className="text-xs text-[#82786F]">Solved Problems</span>
          <p className="text-xl font-bold text-[#171411]">
            {solvedCount} <span className="text-xs font-normal text-[#82786F]">/ {totalCount}</span>
          </p>
        </div>
        <div>
          <span className="text-xs text-[#69745E] font-medium">Easy Solved</span>
          <p className="text-xl font-bold text-[#171411]">{easyCount}</p>
        </div>
        <div>
          <span className="text-xs text-[#76533C] font-medium">Medium Solved</span>
          <p className="text-xl font-bold text-[#171411]">{mediumCount}</p>
        </div>
        <div>
          <span className="text-xs text-[#985F51] font-medium">Hard Solved</span>
          <p className="text-xl font-bold text-[#171411]">{hardCount}</p>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#82786F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, notes, or topic..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] focus:outline-none focus:ring-2 focus:ring-[#76533C]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#82786F] border border-[rgba(56,37,28,0.2)] rounded-md px-2.5 py-1.5 bg-[#FBF8F2]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#76533C]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#171411] font-medium focus:outline-none cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>

            {/* Add Problem Button */}
            <button
              onClick={openNewModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Problem</span>
            </button>
          </div>
        </div>

        {/* Filter chips / selects */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[rgba(56,37,28,0.1)] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#82786F]">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-2 py-1 rounded border border-[rgba(56,37,28,0.18)] bg-[#FBF8F2] text-[#171411] font-medium focus:outline-none"
            >
              <option value="All">All Topics</option>
              {ALL_TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#82786F]">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2 py-1 rounded border border-[rgba(56,37,28,0.18)] bg-[#FBF8F2] text-[#171411] font-medium focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              {ALL_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#82786F]">Status:</span>
            <select
              value={selectedSolvedStatus}
              onChange={(e) => setSelectedSolvedStatus(e.target.value)}
              className="px-2 py-1 rounded border border-[rgba(56,37,28,0.18)] bg-[#FBF8F2] text-[#171411] font-medium focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved Only</option>
              <option value="Unsolved">Unsolved Only</option>
            </select>
          </div>

          {(selectedTopic !== 'All' || selectedDifficulty !== 'All' || selectedSolvedStatus !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTopic('All');
                setSelectedDifficulty('All');
                setSelectedSolvedStatus('All');
                setSearchQuery('');
              }}
              className="text-[#985F51] hover:underline text-xs ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)] overflow-hidden shadow-xs">
        {filteredQuestions.length > 0 ? (
          <div className="divide-y divide-[rgba(56,37,28,0.1)]">
            {filteredQuestions.map((q) => {
              const isNotesExpanded = expandedNotesId === q.id;

              return (
                <div
                  key={q.id}
                  className="p-4 hover:bg-[#E6D8C7]/30 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Solved toggle checkbox */}
                      <button
                        onClick={(e) => handleToggleSolved(q.id, e)}
                        className="mt-0.5 text-[#76533C] hover:text-[#38251C] transition-colors"
                        title={q.solved ? 'Mark as Unsolved' : 'Mark as Solved'}
                      >
                        {q.solved ? (
                          <CheckCircle2 className="w-5 h-5 text-[#69745E]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#B5A99B]" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-sm font-bold tracking-tight ${
                              q.solved ? 'text-[#171411]' : 'text-[#39332E]'
                            }`}
                          >
                            {q.title}
                          </h4>
                          {q.sourceLink && (
                            <a
                              href={q.sourceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#76533C] hover:text-[#38251C] inline-flex items-center gap-0.5 text-xs"
                              title="Open problem link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {/* Unboxed Metadata (Rule: No pill enclosures on static text) */}
                        <div className="flex items-center gap-2 text-xs text-[#82786F] mt-1">
                          <span className="font-medium text-[#38251C]">{q.topic}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={`font-semibold ${
                              q.difficulty === 'Easy'
                                ? 'text-[#69745E]'
                                : q.difficulty === 'Medium'
                                ? 'text-[#76533C]'
                                : 'text-[#985F51]'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          {q.datePracticed && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Practiced {q.datePracticed}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions: Edit, Notes, Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      {q.notes && (
                        <button
                          onClick={() => setExpandedNotesId(isNotesExpanded ? null : q.id)}
                          className={`p-1.5 rounded hover:bg-[#E6D8C7]/60 text-xs transition-colors flex items-center gap-1 ${
                            isNotesExpanded ? 'text-[#38251C] bg-[#E6D8C7]/50' : 'text-[#82786F]'
                          }`}
                          title="View Solution Notes"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Notes</span>
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(q)}
                        className="p-1.5 rounded hover:bg-[#E6D8C7]/60 text-[#82786F] hover:text-[#171411] transition-colors"
                        title="Edit question"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(q.id, q.title, e)}
                        className="p-1.5 rounded hover:bg-[#985F51]/10 text-[#82786F] hover:text-[#985F51] transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Notes View */}
                  {isNotesExpanded && q.notes && (
                    <div className="mt-2 p-3 rounded-lg bg-[#EFE5D6]/70 border border-[rgba(56,37,28,0.14)] text-xs text-[#39332E] font-mono leading-relaxed whitespace-pre-wrap">
                      <div className="font-sans font-bold text-[#76533C] mb-1 text-[11px] uppercase tracking-wide">
                        Algorithm / Solution Notes
                      </div>
                      {q.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-[#82786F]">
            <Code2 className="w-10 h-10 mx-auto text-[#B5A99B] mb-2" />
            <h4 className="text-sm font-bold text-[#171411]">No coding questions found</h4>
            <p className="text-xs text-[#82786F] mt-1">
              Try adjusting your topic or difficulty filters, or log a new question.
            </p>
            <button
              onClick={openNewModal}
              className="mt-4 px-3.5 py-1.5 rounded-md bg-[#38251C] text-[#FBF8F2] text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Problem</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/50 backdrop-blur-xs">
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.2)] max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(56,37,28,0.14)]">
              <h3 className="text-base font-bold text-[#171411]">
                {editingQuestion ? 'Edit Coding Problem' : 'Log New Coding Problem'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#82786F] hover:text-[#171411] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Problem Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Course Schedule (Topological Sort)"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Topic
                  </label>
                  <select
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value as CodingTopic)}
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  >
                    {ALL_TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  >
                    {ALL_DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Source Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formSourceLink}
                    onChange={(e) => setFormSourceLink(e.target.value)}
                    placeholder="https://leetcode.com/..."
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Date Practiced
                  </label>
                  <input
                    type="date"
                    value={formDatePracticed}
                    onChange={(e) => setFormDatePracticed(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Solution Notes & Complexity
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Record edge cases, time/space complexity, or optimal approach..."
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#39332E]">
                  <input
                    type="checkbox"
                    checked={formSolved}
                    onChange={(e) => setFormSolved(e.target.checked)}
                    className="w-4 h-4 rounded text-[#76533C] focus:ring-[#76533C] accent-[#76533C]"
                  />
                  <span>Mark as Solved</span>
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
                  {editingQuestion ? 'Save Changes' : 'Add Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
