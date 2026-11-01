import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Calendar,
  X,
  ExternalLink,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { JobApplication, ApplicationStatus, CareerLaunchData } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../Toast';

interface ApplicationsViewProps {
  data: CareerLaunchData;
  onUpdateData: (newData: CareerLaunchData) => void;
  initialAddModalOpen?: boolean;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'Interested',
  'Preparing',
  'Applied',
  'Online Test',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Rejected'
];

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  data,
  onUpdateData,
  initialAddModalOpen = false
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'appDate' | 'interviewDate' | 'company'>('appDate');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(initialAddModalOpen);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);

  // Form
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [interviewDate, setInterviewDate] = useState('');
  const [salaryOrPackage, setSalaryOrPackage] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');

  const openNewModal = () => {
    setEditingApplication(null);
    setCompanyName('');
    setPosition('Software Development Engineer');
    setApplicationDate(new Date().toISOString().split('T')[0]);
    setInterviewDate('');
    setSalaryOrPackage('$120,000 / ₹35 LPA');
    setLocation('San Jose / Bengaluru');
    setNotes('');
    setStatus('Applied');
    setIsModalOpen(true);
  };

  const openEditModal = (app: JobApplication) => {
    setEditingApplication(app);
    setCompanyName(app.companyName);
    setPosition(app.position);
    setApplicationDate(app.applicationDate);
    setInterviewDate(app.interviewDate || '');
    setSalaryOrPackage(app.salaryOrPackage);
    setLocation(app.location || '');
    setNotes(app.notes || '');
    setStatus(app.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      showToast('Please provide a company name.', 'danger');
      return;
    }

    if (editingApplication) {
      const updated = data.applications.map((app) =>
        app.id === editingApplication.id
          ? {
              ...app,
              companyName: companyName.trim(),
              position: position.trim(),
              applicationDate,
              interviewDate: interviewDate || undefined,
              salaryOrPackage: salaryOrPackage.trim(),
              location: location.trim() || undefined,
              notes: notes.trim() || undefined,
              status
            }
          : app
      );
      const updatedData = { ...data, applications: updated };
      StorageService.saveData(updatedData);
      onUpdateData(updatedData);
      showToast(`Updated application for ${companyName.trim()}`);
    } else {
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        companyName: companyName.trim(),
        position: position.trim() || 'Software Engineer',
        applicationDate,
        interviewDate: interviewDate || undefined,
        salaryOrPackage: salaryOrPackage.trim() || 'Competitive',
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        status
      };
      const updatedData = { ...data, applications: [newApp, ...data.applications] };
      StorageService.saveData(updatedData);
      onUpdateData(updatedData);
      showToast(`Logged application to ${companyName.trim()}`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove application record for ${name}?`)) {
      const updated = data.applications.filter((a) => a.id !== id);
      const updatedData = { ...data, applications: updated };
      StorageService.saveData(updatedData);
      onUpdateData(updatedData);
      showToast(`Removed ${name}`, 'info');
    }
  };

  // Status badge styling adhering strictly to palette
  const getStatusBadgeStyle = (st: ApplicationStatus) => {
    switch (st) {
      case 'Selected':
        return 'bg-[#69745E]/20 text-[#69745E] border-[#69745E]/30';
      case 'Rejected':
        return 'bg-[#985F51]/15 text-[#985F51] border-[#985F51]/30';
      case 'Technical Interview':
      case 'HR Interview':
        return 'bg-[#76533C]/20 text-[#38251C] border-[#76533C]/40 font-bold';
      case 'Online Test':
        return 'bg-[#E6D8C7] text-[#38251C] border-[rgba(56,37,28,0.2)]';
      default:
        return 'bg-[#EFE5D6] text-[#39332E] border-[rgba(56,37,28,0.14)]';
    }
  };

  // Filtered and sorted applications
  const filteredApplications = useMemo(() => {
    return data.applications
      .filter((app) => {
        const matchesSearch =
          app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'appDate') {
          return b.applicationDate.localeCompare(a.applicationDate);
        }
        if (sortBy === 'interviewDate') {
          return (b.interviewDate || '').localeCompare(a.interviewDate || '');
        }
        if (sortBy === 'company') {
          return a.companyName.localeCompare(b.companyName);
        }
        return 0;
      });
  }, [data.applications, searchQuery, selectedStatus, sortBy]);

  // Funnel counts
  const totalApps = data.applications.length;
  const inPipeline = data.applications.filter((a) => a.status !== 'Rejected' && a.status !== 'Selected').length;
  const inInterview = data.applications.filter((a) => a.status.includes('Interview')).length;
  const offers = data.applications.filter((a) => a.status === 'Selected').length;

  return (
    <div className="space-y-6">
      {/* Top metrics summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] shadow-xs">
        <div>
          <span className="text-xs text-[#82786F]">Total Applications</span>
          <p className="text-xl font-bold text-[#171411]">{totalApps}</p>
        </div>
        <div>
          <span className="text-xs text-[#76533C] font-medium">In Active Pipeline</span>
          <p className="text-xl font-bold text-[#171411]">{inPipeline}</p>
        </div>
        <div>
          <span className="text-xs text-[#38251C] font-medium">Interviews Scheduled</span>
          <p className="text-xl font-bold text-[#171411]">{inInterview}</p>
        </div>
        <div>
          <span className="text-xs text-[#69745E] font-medium">Offers Received</span>
          <p className="text-xl font-bold text-[#69745E]">{offers}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#82786F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, role, or notes..."
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
                <option value="appDate">Sort by Applied Date</option>
                <option value="interviewDate">Sort by Interview Date</option>
                <option value="company">Sort by Company</option>
              </select>
            </div>

            {/* Add Application Button */}
            <button
              onClick={openNewModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track Application</span>
            </button>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[rgba(56,37,28,0.1)] text-xs">
          <span className="text-[#82786F]">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2 py-1 rounded border border-[rgba(56,37,28,0.18)] bg-[#FBF8F2] text-[#171411] font-medium"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {(selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="text-[#985F51] hover:underline text-xs ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)] overflow-hidden shadow-xs">
        {filteredApplications.length > 0 ? (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(56,37,28,0.14)] text-[#82786F] font-semibold uppercase tracking-wider text-[10px] bg-[#EFE5D6]/30">
                <th className="py-3 px-4">Company & Position</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Package / CTC</th>
                <th className="py-3 px-4">Application Date</th>
                <th className="py-3 px-4">Interview Date</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(56,37,28,0.08)]">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-[#E6D8C7]/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#171411] text-sm">{app.companyName}</p>
                    <p className="text-xs text-[#82786F]">{app.position}</p>
                    {app.location && (
                      <span className="text-[10px] text-[#82786F] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#76533C]" /> {app.location}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs font-semibold border ${getStatusBadgeStyle(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#38251C]">
                    {app.salaryOrPackage}
                  </td>
                  <td className="py-3.5 px-4 text-[#82786F]">{app.applicationDate}</td>
                  <td className="py-3.5 px-4">
                    {app.interviewDate ? (
                      <span className="text-[#76533C] font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {app.interviewDate}
                      </span>
                    ) : (
                      <span className="text-[#B5A99B]">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#82786F] max-w-xs truncate" title={app.notes}>
                    {app.notes || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(app)}
                        className="p-1.5 rounded hover:bg-[#E6D8C7]/60 text-[#82786F] hover:text-[#171411]"
                        title="Edit Application"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id, app.companyName)}
                        className="p-1.5 rounded hover:bg-[#985F51]/10 text-[#82786F] hover:text-[#985F51]"
                        title="Delete Application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-[#82786F]">
            <Briefcase className="w-10 h-10 mx-auto text-[#B5A99B] mb-2" />
            <h4 className="text-sm font-bold text-[#171411]">No applications found</h4>
            <p className="text-xs text-[#82786F] mt-1">Start tracking your recruitment pipeline today.</p>
          </div>
        )}
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-3">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] space-y-2.5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#171411]">{app.companyName}</h4>
                  <p className="text-xs text-[#82786F]">{app.position}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadgeStyle(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>

              <div className="text-xs space-y-1 text-[#82786F] pt-1 border-t border-[rgba(56,37,28,0.08)]">
                <div className="flex items-center justify-between">
                  <span>Compensation:</span>
                  <span className="font-mono font-medium text-[#171411]">{app.salaryOrPackage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Applied On:</span>
                  <span>{app.applicationDate}</span>
                </div>
                {app.interviewDate && (
                  <div className="flex items-center justify-between text-[#76533C] font-semibold">
                    <span>Interview:</span>
                    <span>{app.interviewDate}</span>
                  </div>
                )}
                {app.notes && (
                  <p className="pt-1 text-[11px] text-[#39332E] italic">"{app.notes}"</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgba(56,37,28,0.1)]">
                <button
                  onClick={() => openEditModal(app)}
                  className="px-2.5 py-1 text-xs rounded border border-[rgba(56,37,28,0.18)] text-[#39332E] hover:bg-[#E6D8C7]/50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(app.id, app.companyName)}
                  className="px-2.5 py-1 text-xs rounded text-[#985F51] hover:bg-[#985F51]/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-[#82786F] bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)]">
            <Briefcase className="w-8 h-8 mx-auto text-[#B5A99B] mb-2" />
            <p className="text-xs">No applications match your filter.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/50 backdrop-blur-xs">
          <div className="bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.2)] max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(56,37,28,0.14)]">
              <h3 className="text-base font-bold text-[#171411]">
                {editingApplication ? 'Edit Application Details' : 'Track New Job Application'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#82786F] hover:text-[#171411] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Adobe"
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. SDE-1"
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Current Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Package / Stipend
                  </label>
                  <input
                    type="text"
                    value={salaryOrPackage}
                    onChange={(e) => setSalaryOrPackage(e.target.value)}
                    placeholder="e.g. ₹32 LPA or $125k"
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Application Date
                  </label>
                  <input
                    type="date"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                    Interview Date (if set)
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Location (Office / Remote)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore / Remote"
                  className="w-full px-3 py-2 rounded-md border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] text-xs focus:outline-none focus:ring-2 focus:ring-[#76533C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#39332E] uppercase tracking-wider mb-1">
                  Notes & Next Rounds
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Referral name, job ID, or upcoming round focus..."
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
                  {editingApplication ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
