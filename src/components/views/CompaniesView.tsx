import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
  X,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Company, CompanyChecklistItem, CareerLaunchData } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../Toast';

interface CompaniesViewProps {
  data: CareerLaunchData;
  onUpdateData: (newData: CareerLaunchData) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  data,
  onUpdateData
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>('comp-1');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [topicsStr, setTopicsStr] = useState('');
  const [aptitudePattern, setAptitudePattern] = useState('');
  const [roundsStr, setRoundsStr] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');

  // Toggle checklist item
  const handleToggleChecklist = (companyId: string, itemId: string) => {
    const updatedCompanies = data.companies.map((comp) => {
      if (comp.id === companyId) {
        const updatedChecklist = comp.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const completedCount = updatedChecklist.filter((i) => i.completed).length;
        const progress = updatedChecklist.length > 0 ? Math.round((completedCount / updatedChecklist.length) * 100) : 0;

        return {
          ...comp,
          checklist: updatedChecklist,
          preparationProgress: progress
        };
      }
      return comp;
    });

    const updatedData = { ...data, companies: updatedCompanies };
    StorageService.saveData(updatedData);
    onUpdateData(updatedData);
  };

  // Open modal
  const openNewCompanyModal = () => {
    setEditingCompany(null);
    setName('');
    setRole('Software Engineer');
    setSkillsStr('Data Structures, Algorithms, System Design');
    setTopicsStr('Arrays, Trees, Dynamic Programming');
    setAptitudePattern('Online test (2 coding questions, 90 mins)');
    setRoundsStr('Online Assessment\nTechnical DSA Round\nSystem Design & Core CS\nHR & Culture Fit');
    setDeadline(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditCompanyModal = (comp: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCompany(comp);
    setName(comp.name);
    setRole(comp.role);
    setSkillsStr(comp.requiredSkills.join(', '));
    setTopicsStr(comp.commonCodingTopics.join(', '));
    setAptitudePattern(comp.aptitudePattern);
    setRoundsStr(comp.interviewRounds.join('\n'));
    setDeadline(comp.applicationDeadline || '');
    setNotes(comp.notes || '');
    setIsModalOpen(true);
  };

  // Delete company
  const handleDeleteCompany = (comp: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Remove "${comp.name}" preparation guide?`)) {
      const updated = data.companies.filter((c) => c.id !== comp.id);
      const updatedData = { ...data, companies: updated };
      StorageService.saveData(updatedData);
      onUpdateData(updatedData);
      showToast(`Removed "${comp.name}"`, 'info');
    }
  };

  // Save company
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a company name.', 'danger');
      return;
    }

    const skills = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const topics = topicsStr.split(',').map((t) => t.trim()).filter(Boolean);
    const rounds = roundsStr.split('\n').map((r) => r.trim()).filter(Boolean);
    const logoInitials = name.substring(0, 2).toUpperCase();

    if (editingCompany) {
      const updated = data.companies.map((c) =>
        c.id === editingCompany.id
          ? {
              ...c,
              name: name.trim(),
              role: role.trim(),
              requiredSkills: skills,
              commonCodingTopics: topics,
              aptitudePattern: aptitudePattern.trim(),
              interviewRounds: rounds,
              applicationDeadline: deadline || undefined,
              notes: notes.trim() || undefined
            }
          : c
      );
      const updatedData = { ...data, companies: updated };
      StorageService.saveData(updatedData);
      onUpdateData(updatedData);
      showToast(`Updated "${name.trim()}"`);
    } else {
      const defaultChecklist: CompanyChecklistItem[] = [
        { id: `c-${Date.now()}-1`, label: 'Solve 20+ company-tagged problems', completed: false },
        { id: `c-${Date.now()}-2`, label: 'Revise core CS subjects (OS, DBMS, CN)', completed: false },
        { id: `c-${Date.now()}-3`, label: 'Prepare 3 STAR stories for behavioral fit', completed: false }
      ];

      const newCompany: Company = {
        id: `comp-${Date.now()}`,
        name: name.trim(),
        logoInitials,
        role: role.trim() || 'Software Engineer',
        requiredSkills: skills.length > 0 ? skills : ['DSA', 'Problem Solving'],
        commonCodingTopics: topics.length > 0 ? topics : ['Arrays', 'Trees'],
        aptitudePattern: aptitudePattern.trim() || 'Online test and live coding screen.',
        interviewRounds: rounds.length > 0 ? rounds : ['Online Assessment', 'Technical Round 1', 'HR Round'],
        checklist: defaultChecklist,
        applicationDeadline: deadline || undefined,
        preparationProgress: 0,
        notes: notes.trim() || undefined
      };

      const updatedData = { ...data, companies: [...data.companies, newCompany] };
      StorageService.saveData(updatedData);
      onUpdateData(updatedData);
      showToast(`Added "${name.trim()}"`);
    }

    setIsModalOpen(false);
  };

  const filteredCompanies = data.companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#82786F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company guides by name, role, or skills..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] focus:outline-none focus:ring-2 focus:ring-[#76533C]"
          />
        </div>

        <button
          onClick={openNewCompanyModal}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Company Guide</span>
        </button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((comp) => {
            const isExpanded = expandedCompanyId === comp.id;

            return (
              <div
                key={comp.id}
                className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)] p-5 shadow-xs transition-all"
              >
                {/* Main Company Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#38251C] text-[#FBF8F2] font-black text-sm flex items-center justify-center shadow-xs shrink-0 tracking-wider">
                      {comp.logoInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#171411]">{comp.name}</h3>
                        <span className="text-xs text-[#82786F]">· {comp.role}</span>
                      </div>

                      {/* Clean Unboxed Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#82786F] mt-1">
                        {comp.applicationDeadline && (
                          <>
                            <span className="flex items-center gap-1 text-[#76533C] font-medium">
                              <Calendar className="w-3.5 h-3.5" />
                              Deadline: {comp.applicationDeadline}
                            </span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span>{comp.interviewRounds.length} Rounds</span>
                        <span aria-hidden="true">·</span>
                        <span>{comp.checklist.filter((c) => c.completed).length} / {comp.checklist.length} Tasks</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Accordion Trigger */}
                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-24 sm:w-32 bg-[#E6D8C7] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#69745E] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${comp.preparationProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#38251C]">
                          {comp.preparationProgress}%
                        </span>
                      </div>
                      <span className="text-[10px] text-[#82786F]">Prep Readiness</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => openEditCompanyModal(comp, e)}
                        className="p-1.5 rounded hover:bg-[#E6D8C7]/50 text-[#82786F] hover:text-[#171411]"
                        title="Edit Guide"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCompany(comp, e)}
                        className="p-1.5 rounded hover:bg-[#985F51]/10 text-[#82786F] hover:text-[#985F51]"
                        title="Delete Guide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setExpandedCompanyId(isExpanded ? null : comp.id)}
                        className="p-1.5 rounded hover:bg-[#E6D8C7]/50 text-[#38251C] transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand Details'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Company Preparation Dossier */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-[rgba(56,37,28,0.14)] space-y-4 text-xs animate-in fade-in-50 duration-150">
                    {/* Skills & Common DSA Topics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-[#EFE5D6]/50 border border-[rgba(56,37,28,0.1)]">
                        <span className="text-[10px] uppercase font-bold text-[#76533C] tracking-wider block mb-1">
                          Required Skill Set
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {comp.requiredSkills.map((sk, idx) => (
                            <span key={idx} className="font-medium text-[#171411]">
                              {sk}{idx < comp.requiredSkills.length - 1 ? ' · ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-[#EFE5D6]/50 border border-[rgba(56,37,28,0.1)]">
                        <span className="text-[10px] uppercase font-bold text-[#76533C] tracking-wider block mb-1">
                          High-Frequency Coding Topics
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {comp.commonCodingTopics.map((top, idx) => (
                            <span key={idx} className="font-medium text-[#171411]">
                              {top}{idx < comp.commonCodingTopics.length - 1 ? ' · ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Aptitude & OA Pattern */}
                    <div className="p-3 rounded-lg bg-[#EFE5D6]/50 border border-[rgba(56,37,28,0.1)]">
                      <span className="text-[10px] uppercase font-bold text-[#76533C] tracking-wider block mb-1">
                        Aptitude & Online Assessment Pattern
                      </span>
                      <p className="text-[#39332E] leading-relaxed">{comp.aptitudePattern}</p>
                    </div>

                    {/* Interview Rounds Flow */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#76533C] tracking-wider block mb-2">
                        Interview Rounds Architecture
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {comp.interviewRounds.map((rnd, rIdx) => (
                          <div
                            key={rIdx}
                            className="p-2.5 rounded bg-[#FBF8F2] border border-[rgba(56,37,28,0.14)] flex items-start gap-2"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#E6D8C7] text-[#38251C] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                              {rIdx + 1}
                            </span>
                            <span className="font-semibold text-[#171411] leading-tight">{rnd}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preparation Checklist */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold text-[#76533C] tracking-wider">
                          Target Preparation Checklist
                        </span>
                        <span className="text-[11px] text-[#82786F]">
                          Click items to toggle completion
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {comp.checklist.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleToggleChecklist(comp.id, item.id)}
                            className="w-full text-left p-2 rounded-md hover:bg-[#E6D8C7]/40 border border-[rgba(56,37,28,0.08)] flex items-center gap-2.5 transition-colors"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-[#69745E] shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#B5A99B] shrink-0" />
                            )}
                            <span
                              className={`text-xs ${
                                item.completed ? 'line-through text-[#82786F]' : 'text-[#171411] font-medium'
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {comp.notes && (
                      <div className="p-3 rounded-lg bg-[#E6D8C7]/40 border border-[rgba(56,37,28,0.12)]">
                        <span className="text-[10px] uppercase font-bold text-[#76533C] tracking-wider block mb-0.5">
                          Strategy & Interviewer Insights
                        </span>
                        <p className="text-[#39332E] leading-relaxed">{comp.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-[#82786F] bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)]">
            <Building2 className="w-10 h-10 mx-auto text-[#B5A99B] mb-2" />
            <h4 className="text-sm font-bold text-[#171411]">No companies found</h4>
            <p className="text-xs text-[#82786F] mt-1">Try a different search query or add a new target company.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/50 backdrop-blur-xs">
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.2)] max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(56,37,28,0.14)]">
              <h3 className="text-base font-bold text-[#171411]">
                {editingCompany ? `Edit ${editingCompany.name}` : 'Add Target Company Guide'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#82786F] hover:text-[#171411] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Uber"
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. SDE-1"
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="Java, Distributed Systems, Graph Algorithms"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Common Coding Topics (comma separated)
                </label>
                <input
                  type="text"
                  value={topicsStr}
                  onChange={(e) => setTopicsStr(e.target.value)}
                  placeholder="Trees, Dynamic Programming, Graphs"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Aptitude / OA Pattern
                </label>
                <input
                  type="text"
                  value={aptitudePattern}
                  onChange={(e) => setAptitudePattern(e.target.value)}
                  placeholder="e.g. 3 questions on HackerRank, 90 mins"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Interview Rounds (one per line)
                </label>
                <textarea
                  rows={3}
                  value={roundsStr}
                  onChange={(e) => setRoundsStr(e.target.value)}
                  placeholder="Online Assessment&#10;DSA Technical Round&#10;System Design & CS&#10;HR Round"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Preparation Notes & Strategy
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tips on questions, key culture expectations..."
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
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
                  {editingCompany ? 'Save Changes' : 'Create Company Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
