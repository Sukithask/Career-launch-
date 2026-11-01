export type CodingTopic =
  | 'Arrays'
  | 'Strings'
  | 'Linked Lists'
  | 'Stacks and Queues'
  | 'Trees'
  | 'Graphs'
  | 'Dynamic Programming'
  | 'Recursion'
  | 'Searching'
  | 'Sorting'
  | 'SQL'
  | 'Other';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface CodingQuestion {
  id: string;
  title: string;
  topic: CodingTopic;
  difficulty: Difficulty;
  solved: boolean;
  sourceLink?: string;
  notes?: string;
  datePracticed?: string;
  createdAt: string;
}

export type AptitudeCategory =
  | 'Quantitative Aptitude'
  | 'Logical Reasoning'
  | 'Verbal Ability';

export interface AptitudeQuestion {
  id: string;
  category: AptitudeCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AptitudeAnswerRecord {
  questionId: string;
  questionText: string;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface AptitudeAttempt {
  id: string;
  category: AptitudeCategory | 'Comprehensive';
  totalQuestions: number;
  score: number;
  percentage: number;
  date: string;
  timeTakenSeconds: number;
  answers: AptitudeAnswerRecord[];
}

export interface CompanyChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Company {
  id: string;
  name: string;
  logoInitials: string;
  role: string;
  requiredSkills: string[];
  commonCodingTopics: string[];
  aptitudePattern: string;
  interviewRounds: string[];
  checklist: CompanyChecklistItem[];
  applicationDeadline?: string;
  preparationProgress: number; // 0 - 100
  notes?: string;
}

export type ApplicationStatus =
  | 'Interested'
  | 'Preparing'
  | 'Applied'
  | 'Online Test'
  | 'Technical Interview'
  | 'HR Interview'
  | 'Selected'
  | 'Rejected';

export interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  applicationDate: string;
  interviewDate?: string;
  salaryOrPackage: string;
  notes?: string;
  status: ApplicationStatus;
  location?: string;
}

export type InterviewCategory = 'Technical' | 'HR' | 'Behavioral' | 'General';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface InterviewQuestion {
  id: string;
  category: InterviewCategory;
  question: string;
  personalAnswer: string;
  notes?: string;
  practiced: boolean;
  confidenceLevel: ConfidenceLevel;
  dateAdded: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  score: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string;
  summary: string;
  bullets: string[];
  link?: string;
}

export interface InternshipItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeProfile {
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  objective: string;
  education: EducationItem[];
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  projects: ProjectItem[];
  internships: InternshipItem[];
  certifications: CertificationItem[];
  achievements: string[];
}

export interface PreparationActivityDay {
  date: string; // YYYY-MM-DD
  codingCount: number;
  aptitudeCount: number;
  interviewCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  graduationYear: string;
  targetRole: string;
  avatarText: string;
}

export interface UserSettings {
  dailyPreparationGoal: number; // e.g. 5 tasks
  preferredPreparationTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  notificationPreference: boolean;
  targetPlacementDate?: string;
}

export interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  passwordHashSimulated: string;
  college: string;
  graduationYear: string;
  createdAt: string;
}

export interface AuthenticationState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  rememberMe: boolean;
  token?: string;
}

export interface CareerLaunchData {
  version: string;
  profile: UserProfile | null;
  codingQuestions: CodingQuestion[];
  aptitudeAttempts: AptitudeAttempt[];
  companies: Company[];
  applications: JobApplication[];
  interviewQuestions: InterviewQuestion[];
  resumeProfile: ResumeProfile;
  preparationActivity: PreparationActivityDay[];
  settings: UserSettings;
  authenticationState: AuthenticationState;
  registeredUsers: StoredUserAccount[];
}

export type ActivePage =
  | 'dashboard'
  | 'coding'
  | 'aptitude'
  | 'applications'
  | 'companies'
  | 'interviews'
  | 'resume'
  | 'progress'
  | 'settings'
  | 'lab';
