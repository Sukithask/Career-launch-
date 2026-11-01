import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Sparkles,
  X
} from 'lucide-react';
import { ResumeProfile, CareerLaunchData, EducationItem, ProjectItem, InternshipItem, CertificationItem } from '../../types';
import { StorageService, INITIAL_DEMO_DATA } from '../../services/storage';
import { useToast } from '../Toast';
import { AppWatermark } from '../BrandLogo';
import { getAIResumeReview } from '../../services/aiService';

interface ResumeBuilderViewProps {
  data: CareerLaunchData;
  onUpdateData: (newData: CareerLaunchData) => void;
}

type EditorTab =
  | 'personal'
  | 'objective'
  | 'education'
  | 'skills'
  | 'projects'
  | 'internships'
  | 'certifications'
  | 'achievements';

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({
  data,
  onUpdateData
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<EditorTab>('personal');
  const [resume, setResume] = useState<ResumeProfile>(data.resumeProfile);
  const [isSaved, setIsSaved] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);

  // Sync and save changes
  const updateResume = (updated: ResumeProfile) => {
    setResume(updated);
    setIsSaved(false);
    const updatedData = { ...data, resumeProfile: updated };
    StorageService.saveData(updatedData);
    onUpdateData(updatedData);
    setIsSaved(true);
  };

  // Reset to default template
  const handleResetToTemplate = () => {
    if (confirm('Reset resume to the campus standard template? Custom edits will be replaced.')) {
      updateResume(INITIAL_DEMO_DATA.resumeProfile);
      showToast('Resume reset to standard template');
    }
  };

  // Trigger print dialog for PDF export
  const handlePrint = () => {
    window.print();
  };

  const [aiLoading, setAiLoading] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState<string | null>(null);

  const handleRequestAiReview = async () => {
    setAiLoading(true);
    setAiReviewResult(null);
    try {
      const res = await getAIResumeReview({
        resumeSummary: resume,
        targetRole: data.profile?.targetRole || 'Software Development Engineer',
      });
      if (res.feedback) {
        setAiReviewResult(res.feedback);
        showToast('AI Resume ATS recommendations ready!');
      } else if (res.error) {
        setAiReviewResult(`⚠️ Note: ${res.error}\n\nTo enable Gemini AI resume optimization, configure GEMINI_API_KEY in your .env file.`);
        showToast('Gemini API key is not configured in .env', 'danger');
      }
    } catch (err: any) {
      setAiReviewResult(`Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Sub-item helpers
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'University / Institute',
      degree: 'B.Tech',
      field: 'Computer Science',
      startYear: '2022',
      endYear: '2026',
      score: '8.5 CGPA'
    };
    updateResume({
      ...resume,
      education: [...resume.education, newItem]
    });
  };

  const removeEducation = (id: string) => {
    updateResume({
      ...resume,
      education: resume.education.filter((e) => e.id !== id)
    });
  };

  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Engineering Project',
      techStack: 'React, Node.js, PostgreSQL',
      summary: 'Developed fullstack application solving campus workflow inefficiencies.',
      bullets: [
        'Designed REST API microservices with sub-50ms latency.',
        'Integrated real-time database caching using Redis.'
      ]
    };
    updateResume({
      ...resume,
      projects: [...resume.projects, newItem]
    });
  };

  const removeProject = (id: string) => {
    updateResume({
      ...resume,
      projects: resume.projects.filter((p) => p.id !== id)
    });
  };

  const addInternship = () => {
    const newItem: InternshipItem = {
      id: `intern-${Date.now()}`,
      company: 'Tech Enterprise Corp',
      role: 'Software Development Intern',
      duration: 'May 2025 – July 2025',
      bullets: [
        'Built automated CI/CD deployment pipelines using GitHub Actions.',
        'Refactored legacy endpoints to modern TypeScript architectures.'
      ]
    };
    updateResume({
      ...resume,
      internships: [...resume.internships, newItem]
    });
  };

  const removeInternship = (id: string) => {
    updateResume({
      ...resume,
      internships: resume.internships.filter((i) => i.id !== id)
    });
  };

  const addCertification = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Cloud Developer Certification',
      issuer: 'AWS / Google Cloud',
      year: '2025'
    };
    updateResume({
      ...resume,
      certifications: [...resume.certifications, newItem]
    });
  };

  const removeCertification = (id: string) => {
    updateResume({
      ...resume,
      certifications: resume.certifications.filter((c) => c.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Header Banner */}
      <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[rgba(56,37,28,0.14)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs no-print">
        <div>
          <h3 className="text-sm font-bold text-[#171411]">Single-Page ATS Resume Studio</h3>
          <p className="text-xs text-[#82786F]">
            Edits update the live document below in real time. Saved locally.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setShowWatermark(!showWatermark);
              showToast(showWatermark ? 'Document watermark hidden' : 'Document watermark enabled');
            }}
            className={`px-3 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showWatermark
                ? 'bg-[#E6D8C7] border-[rgba(56,37,28,0.3)] text-[#38251C]'
                : 'border-[rgba(56,37,28,0.2)] text-[#82786F] hover:bg-[#E6D8C7]/30'
            }`}
            title="Toggle official CareerLaunch watermark on printable resume"
          >
            <span className={`w-2 h-2 rounded-full ${showWatermark ? 'bg-[#69745E]' : 'bg-[#B5A99B]'}`} />
            <span>Watermark: {showWatermark ? 'On' : 'Off'}</span>
          </button>

          <button
            onClick={handleRequestAiReview}
            disabled={aiLoading}
            className="px-3.5 py-1.5 rounded-md border border-[rgba(99,102,241,0.4)] bg-[#6366F1]/10 hover:bg-[#6366F1]/20 text-[#6366F1] text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
            title="Request AI ATS optimization suggestions via server-side Gemini API"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>{aiLoading ? 'Analyzing...' : 'AI ATS Review'}</span>
          </button>

          <button
            onClick={handleResetToTemplate}
            className="px-3 py-1.5 rounded-md border border-[rgba(56,37,28,0.2)] text-xs font-semibold text-[#39332E] hover:bg-[#E6D8C7]/50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#76533C]" />
            <span>Standard Template</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-md bg-[#38251C] hover:bg-[#171411] text-[#FBF8F2] text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#E6D8C7]" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* AI Review Banner/Card if present */}
      {aiReviewResult && (
        <div className="bg-[#6366F1]/10 border border-[#6366F1]/30 rounded-xl p-4 shadow-xs text-xs text-[#171411] space-y-2 no-print">
          <div className="flex items-center justify-between font-bold text-[#4F46E5]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI ATS Optimization Feedback (Server-Side)</span>
            </div>
            <button
              onClick={() => setAiReviewResult(null)}
              className="text-[#64748B] hover:text-[#0F172A] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="whitespace-pre-wrap leading-relaxed text-[#334155] font-sans">
            {aiReviewResult}
          </div>
        </div>
      )}

      {/* Main Split Interface: Editor Tabs on Left, Live Sheet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Structured Form Editor (Tabs) */}
        <div className="lg:col-span-5 bg-[#FBF8F2] rounded-xl border border-[rgba(56,37,28,0.14)] overflow-hidden shadow-xs no-print">
          {/* Editor Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-[rgba(56,37,28,0.14)] bg-[#EFE5D6]/40 p-1 text-xs">
            {[
              { id: 'personal', label: 'Contact' },
              { id: 'objective', label: 'Objective' },
              { id: 'education', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'internships', label: 'Experience' },
              { id: 'certifications', label: 'Certs' },
              { id: 'achievements', label: 'Honors' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as EditorTab)}
                className={`px-3 py-1.5 font-semibold whitespace-nowrap rounded transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FBF8F2] text-[#38251C] shadow-xs'
                    : 'text-[#82786F] hover:text-[#171411]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-5 max-h-[640px] overflow-y-auto space-y-4 text-xs">
            {/* PERSONAL TAB */}
            {activeTab === 'personal' && (
              <div className="space-y-3">
                <h4 className="font-bold text-[#171411] uppercase tracking-wider text-[11px]">
                  Personal & Contact Details
                </h4>

                <div>
                  <label className="block text-[#39332E] font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personalDetails.fullName}
                    onChange={(e) =>
                      updateResume({
                        ...resume,
                        personalDetails: { ...resume.personalDetails, fullName: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] focus:ring-1 focus:ring-[#76533C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#39332E] font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalDetails.email}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalDetails: { ...resume.personalDetails, email: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#39332E] font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalDetails.phone}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalDetails: { ...resume.personalDetails, phone: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#39332E] font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.personalDetails.location}
                    onChange={(e) =>
                      updateResume({
                        ...resume,
                        personalDetails: { ...resume.personalDetails, location: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#39332E] font-medium mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resume.personalDetails.linkedin}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalDetails: { ...resume.personalDetails, linkedin: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#39332E] font-medium mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={resume.personalDetails.github}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalDetails: { ...resume.personalDetails, github: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* OBJECTIVE TAB */}
            {activeTab === 'objective' && (
              <div className="space-y-3">
                <h4 className="font-bold text-[#171411] uppercase tracking-wider text-[11px]">
                  Placement Career Objective
                </h4>
                <p className="text-[11px] text-[#82786F]">
                  Write a concise, 2-3 sentence overview targeting software engineering or analytical roles.
                </p>
                <textarea
                  rows={6}
                  value={resume.objective}
                  onChange={(e) => updateResume({ ...resume, objective: e.target.value })}
                  className="w-full p-3 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2] text-[#171411] leading-relaxed"
                />
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === 'education' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#171411] uppercase tracking-wider text-[11px]">
                    Academic Qualifications
                  </h4>
                  <button
                    onClick={addEducation}
                    className="text-[#76533C] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {resume.education.map((edu, idx) => (
                  <div key={edu.id} className="p-3 rounded border border-[rgba(56,37,28,0.14)] bg-[#EFE5D6]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#38251C]">Degree #{idx + 1}</span>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-[#985F51] hover:text-[#985F51]/80"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Institution Name"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = resume.education.map((item) =>
                          item.id === edu.id ? { ...item, institution: e.target.value } : item
                        );
                        updateResume({ ...resume, education: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Degree / Major"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = resume.education.map((item) =>
                            item.id === edu.id ? { ...item, degree: e.target.value } : item
                          );
                          updateResume({ ...resume, education: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                      />
                      <input
                        type="text"
                        placeholder="GPA / Score"
                        value={edu.score}
                        onChange={(e) => {
                          const updated = resume.education.map((item) =>
                            item.id === edu.id ? { ...item, score: e.target.value } : item
                          );
                          updateResume({ ...resume, education: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-3">
                <h4 className="font-bold text-[#171411] uppercase tracking-wider text-[11px]">
                  Skills Inventory (Comma-separated)
                </h4>

                <div>
                  <label className="block text-[#39332E] font-medium mb-1">Languages & Frameworks</label>
                  <textarea
                    rows={3}
                    value={resume.skills.technical.join(', ')}
                    onChange={(e) =>
                      updateResume({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          technical: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        }
                      })
                    }
                    className="w-full p-2.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                  />
                </div>

                <div>
                  <label className="block text-[#39332E] font-medium mb-1">Developer Tools & Platforms</label>
                  <textarea
                    rows={2}
                    value={resume.skills.tools.join(', ')}
                    onChange={(e) =>
                      updateResume({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        }
                      })
                    }
                    className="w-full p-2.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                  />
                </div>

                <div>
                  <label className="block text-[#39332E] font-medium mb-1">Core Competencies & Soft Skills</label>
                  <textarea
                    rows={2}
                    value={resume.skills.soft.join(', ')}
                    onChange={(e) =>
                      updateResume({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          soft: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        }
                      })
                    }
                    className="w-full p-2.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                  />
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#171411] uppercase tracking-wider text-[11px]">
                    Technical Projects
                  </h4>
                  <button
                    onClick={addProject}
                    className="text-[#76533C] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                {resume.projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded border border-[rgba(56,37,28,0.14)] bg-[#EFE5D6]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#38251C]">{proj.title}</span>
                      <button onClick={() => removeProject(proj.id)} className="text-[#985F51]">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = resume.projects.map((p) =>
                          p.id === proj.id ? { ...p, title: e.target.value } : p
                        );
                        updateResume({ ...resume, projects: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                    />

                    <input
                      type="text"
                      placeholder="Tech Stack (e.g. React, Node, Redis)"
                      value={proj.techStack}
                      onChange={(e) => {
                        const updated = resume.projects.map((p) =>
                          p.id === proj.id ? { ...p, techStack: e.target.value } : p
                        );
                        updateResume({ ...resume, projects: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                    />

                    <textarea
                      rows={3}
                      placeholder="Bullet points (one per line)"
                      value={proj.bullets.join('\n')}
                      onChange={(e) => {
                        const updated = resume.projects.map((p) =>
                          p.id === proj.id
                            ? { ...p, bullets: e.target.value.split('\n').filter(Boolean) }
                            : p
                        );
                        updateResume({ ...resume, projects: updated });
                      }}
                      className="w-full p-2.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* INTERNSHIPS TAB */}
            {activeTab === 'internships' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#171411] uppercase tracking-wider text-[11px]">
                    Internship Experience
                  </h4>
                  <button
                    onClick={addInternship}
                    className="text-[#76533C] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </button>
                </div>

                {resume.internships.map((intern) => (
                  <div key={intern.id} className="p-3 rounded border border-[rgba(56,37,28,0.14)] bg-[#EFE5D6]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#38251C]">{intern.company}</span>
                      <button onClick={() => removeInternship(intern.id)} className="text-[#985F51]">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Company"
                        value={intern.company}
                        onChange={(e) => {
                          const updated = resume.internships.map((i) =>
                            i.id === intern.id ? { ...i, company: e.target.value } : i
                          );
                          updateResume({ ...resume, internships: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                      />
                      <input
                        type="text"
                        placeholder="Role / Title"
                        value={intern.role}
                        onChange={(e) => {
                          const updated = resume.internships.map((i) =>
                            i.id === intern.id ? { ...i, role: e.target.value } : i
                          );
                          updateResume({ ...resume, internships: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                      />
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Impact bullet points (one per line)"
                      value={intern.bullets.join('\n')}
                      onChange={(e) => {
                        const updated = resume.internships.map((i) =>
                          i.id === intern.id
                            ? { ...i, bullets: e.target.value.split('\n').filter(Boolean) }
                            : i
                        );
                        updateResume({ ...resume, internships: updated });
                      }}
                      className="w-full p-2.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* CERTS & HONORS TABS */}
            {(activeTab === 'certifications' || activeTab === 'achievements') && (
              <div className="space-y-3">
                <h4 className="font-bold text-[#171411] uppercase tracking-wider text-[11px]">
                  {activeTab === 'certifications' ? 'Certifications' : 'Honors & Achievements'}
                </h4>
                <textarea
                  rows={6}
                  placeholder="One item per line"
                  value={
                    activeTab === 'achievements'
                      ? resume.achievements.join('\n')
                      : resume.certifications.map((c) => `${c.name} (${c.issuer}, ${c.year})`).join('\n')
                  }
                  onChange={(e) => {
                    if (activeTab === 'achievements') {
                      updateResume({
                        ...resume,
                        achievements: e.target.value.split('\n').filter(Boolean)
                      });
                    } else {
                      const lines = e.target.value.split('\n').filter(Boolean);
                      const parsedCerts: CertificationItem[] = lines.map((l, idx) => ({
                        id: `c-${idx}`,
                        name: l,
                        issuer: 'Verified Credential',
                        year: '2025'
                      }));
                      updateResume({ ...resume, certifications: parsedCerts });
                    }
                  }}
                  className="w-full p-2.5 rounded border border-[rgba(56,37,28,0.2)] bg-[#FBF8F2]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live High-End Printable Resume Sheet */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="resume-sheet relative overflow-hidden w-full max-w-[800px] bg-white text-[#171411] p-8 sm:p-10 rounded-xl shadow-xl border border-[rgba(56,37,28,0.18)] font-sans">
            {/* Subtle Authentic Resume Watermark Stamp */}
            {showWatermark && (
              <div
                className="pointer-events-none select-none absolute inset-0 flex items-center justify-center opacity-[0.035] rotate-[-28deg] z-0"
                aria-hidden="true"
              >
                <div className="text-center border-4 border-[#38251C] px-10 py-4 rounded-2xl">
                  <span className="text-4xl font-black font-mono tracking-widest text-[#38251C] block">
                    CAREERLAUNCH
                  </span>
                  <span className="text-xs font-mono font-bold tracking-widest text-[#76533C] block mt-1">
                    VERIFIED CAMPUS PLACEMENT PROFILE
                  </span>
                </div>
              </div>
            )}

            {/* Header / Name / Contacts */}
            <div className="text-center border-b border-[#38251C]/20 pb-4 mb-4 relative z-10">
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#171411]">
                {resume.personalDetails.fullName || 'Student Name'}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-[#39332E] mt-2 font-medium">
                {resume.personalDetails.email && <span>{resume.personalDetails.email}</span>}
                {resume.personalDetails.phone && <span>· {resume.personalDetails.phone}</span>}
                {resume.personalDetails.location && <span>· {resume.personalDetails.location}</span>}
                {resume.personalDetails.linkedin && <span>· {resume.personalDetails.linkedin}</span>}
                {resume.personalDetails.github && <span>· {resume.personalDetails.github}</span>}
              </div>
            </div>

            {/* Objective */}
            {resume.objective && (
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#38251C] border-b border-[#38251C]/20 pb-0.5 mb-1.5">
                  Career Objective
                </h2>
                <p className="text-xs text-[#39332E] leading-relaxed">{resume.objective}</p>
              </div>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#38251C] border-b border-[#38251C]/20 pb-0.5 mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="flex justify-between font-bold text-[#171411]">
                        <span>{edu.institution}</span>
                        <span className="font-normal text-[#82786F]">
                          {edu.startYear} – {edu.endYear}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#39332E]">
                        <span>
                          {edu.degree} in {edu.field}
                        </span>
                        <span className="font-semibold">{edu.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {(resume.skills.technical.length > 0 || resume.skills.tools.length > 0) && (
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#38251C] border-b border-[#38251C]/20 pb-0.5 mb-2">
                  Technical Expertise
                </h2>
                <div className="text-xs space-y-1 text-[#39332E]">
                  {resume.skills.technical.length > 0 && (
                    <p>
                      <strong className="text-[#171411]">Languages & Frameworks:</strong>{' '}
                      {resume.skills.technical.join(', ')}
                    </p>
                  )}
                  {resume.skills.tools.length > 0 && (
                    <p>
                      <strong className="text-[#171411]">Developer Tools & Cloud:</strong>{' '}
                      {resume.skills.tools.join(', ')}
                    </p>
                  )}
                  {resume.skills.soft.length > 0 && (
                    <p>
                      <strong className="text-[#171411]">Core Competencies:</strong>{' '}
                      {resume.skills.soft.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#38251C] border-b border-[#38251C]/20 pb-0.5 mb-2">
                  Key Projects
                </h2>
                <div className="space-y-3">
                  {resume.projects.map((proj) => (
                    <div key={proj.id} className="text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[#171411]">{proj.title}</span>
                        <span className="text-[11px] font-mono text-[#76533C]">{proj.techStack}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[#39332E]">
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {resume.internships.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#38251C] border-b border-[#38251C]/20 pb-0.5 mb-2">
                  Professional Experience
                </h2>
                <div className="space-y-3">
                  {resume.internships.map((intern) => (
                    <div key={intern.id} className="text-xs">
                      <div className="flex justify-between font-bold text-[#171411]">
                        <span>
                          {intern.company} <span className="font-normal">· {intern.role}</span>
                        </span>
                        <span className="font-normal text-[#82786F]">{intern.duration}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[#39332E]">
                        {intern.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements & Certifications */}
            {(resume.achievements.length > 0 || resume.certifications.length > 0) && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#38251C] border-b border-[#38251C]/20 pb-0.5 mb-1.5">
                  Honors & Certifications
                </h2>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-[#39332E]">
                  {resume.achievements.map((ach, i) => (
                    <li key={`ach-${i}`}>{ach}</li>
                  ))}
                  {resume.certifications.map((c) => (
                    <li key={c.id}>
                      {c.name} ({c.issuer}, {c.year})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Document Watermark Footer */}
            {showWatermark && <AppWatermark variant="document" />}
          </div>
        </div>
      </div>
    </div>
  );
};
