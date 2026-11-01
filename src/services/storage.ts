import {
  CareerLaunchData,
  AptitudeQuestion,
  UserProfile,
  CodingQuestion,
  AptitudeAttempt,
  Company,
  JobApplication,
  InterviewQuestion,
  ResumeProfile,
  PreparationActivityDay,
  UserSettings
} from '../types';

export const STORAGE_KEY = 'careerLaunchData';

// Standard Aptitude Question Bank
export const APTITUDE_QUESTION_BANK: AptitudeQuestion[] = [
  // Quantitative Aptitude
  {
    id: 'quant-1',
    category: 'Quantitative Aptitude',
    question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    options: ['65 seconds', '89 seconds', '100 seconds', '75 seconds'],
    correctIndex: 1,
    explanation: 'Speed of train = Distance / Time = 240m / 24s = 10 m/s. Total distance to pass platform = 240m + 650m = 890m. Time taken = 890m / 10 m/s = 89 seconds.'
  },
  {
    id: 'quant-2',
    category: 'Quantitative Aptitude',
    question: 'A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?',
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'Cost price of 6 toffees = Re 1. Cost price of 1 toffee = 1/6. For 20% gain, Selling Price of 1 toffee = (1/6) * 1.20 = 1/5. Therefore, he must sell 5 toffees for a rupee.'
  },
  {
    id: 'quant-3',
    category: 'Quantitative Aptitude',
    question: 'If a worker completes 1/3 of a work in 5 days and another worker completes 2/5 of the work in 10 days, in how many days can both complete the work together?',
    options: ['9.37 days', '8.5 days', '10 days', '12 days'],
    correctIndex: 0,
    explanation: 'Worker A does full work in 5 * 3 = 15 days. Worker B does full work in 10 * (5/2) = 25 days. Combined 1 day work = 1/15 + 1/25 = 8/75. Days together = 75/8 = 9.375 days.'
  },
  {
    id: 'quant-4',
    category: 'Quantitative Aptitude',
    question: 'The average age of 30 students in a class is 14 years. If the teacher’s age is included, the average age becomes 15 years. What is the teacher’s age?',
    options: ['42 years', '45 years', '40 years', '44 years'],
    correctIndex: 1,
    explanation: 'Total age of 30 students = 30 * 14 = 420. Total age with teacher (31 people) = 31 * 15 = 465. Teacher age = 465 - 420 = 45 years.'
  },
  {
    id: 'quant-5',
    category: 'Quantitative Aptitude',
    question: 'In how many ways can the letters of the word "LEADER" be arranged?',
    options: ['720', '360', '180', '120'],
    correctIndex: 1,
    explanation: '"LEADER" has 6 letters where E appears twice. Ways = 6! / 2! = 720 / 2 = 360.'
  },

  // Logical Reasoning
  {
    id: 'logic-1',
    category: 'Logical Reasoning',
    question: 'Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?',
    options: ['7', '10', '12', '13'],
    correctIndex: 1,
    explanation: 'This is an alternating addition and subtraction series: +3, -2, +3, -2, +3, -2. 12 - 2 = 10.'
  },
  {
    id: 'logic-2',
    category: 'Logical Reasoning',
    question: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
    options: ['Brother', 'Uncle', 'Cousin', 'Father'],
    correctIndex: 3,
    explanation: 'The only son of Suresh\'s mother is Suresh himself. Therefore, the boy in the photograph is Suresh\'s son, making Suresh the father.'
  },
  {
    id: 'logic-3',
    category: 'Logical Reasoning',
    question: 'Statements: Some actors are singers. All singers are dancers. Conclusions: I. Some actors are dancers. II. No singer is actor.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows'],
    correctIndex: 0,
    explanation: 'Since some actors are singers and all singers are dancers, those actors who are singers are necessarily dancers. Hence conclusion I definitely follows.'
  },
  {
    id: 'logic-4',
    category: 'Logical Reasoning',
    question: 'If CLOCK is coded as KCOLC, how will WATCH be coded in that language?',
    options: ['HCTAW', 'HTCAW', 'HCAWT', 'HACTW'],
    correctIndex: 0,
    explanation: 'The letters of the word are reversed. WATCH reversed is HCTAW.'
  },
  {
    id: 'logic-5',
    category: 'Logical Reasoning',
    question: 'Five people A, B, C, D, and E are sitting in a row facing North. C is sitting between A and E. B is sitting immediately right of E. Who is in the middle?',
    options: ['A', 'C', 'E', 'B'],
    correctIndex: 1,
    explanation: 'Arrangement: A - C - E - B or similar row. Since C is between A and E, C sits centrally between them.'
  },

  // Verbal Ability
  {
    id: 'verbal-1',
    category: 'Verbal Ability',
    question: 'Choose the word most nearly opposite in meaning to CANDID:',
    options: ['Blunt', 'Guarded', 'Sincere', 'Frank'],
    correctIndex: 1,
    explanation: 'Candid means truthful, outspoken, or straightforward. The opposite is guarded, secretive, or deceptive.'
  },
  {
    id: 'verbal-2',
    category: 'Verbal Ability',
    question: 'Select the correctly punctuated and grammatically sound sentence:',
    options: [
      'Neither the manager nor the engineers was available for comment.',
      'Neither the manager nor the engineers were available for comment.',
      'Neither the manager or the engineers was available for comment.',
      'Neither of the engineers were available for comment.'
    ],
    correctIndex: 1,
    explanation: 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("engineers" -> plural verb "were").'
  },
  {
    id: 'verbal-3',
    category: 'Verbal Ability',
    question: 'Identify the synonym for "EPITOME":',
    options: ['Paradox', 'Embodiment', 'Extension', 'Rudiment'],
    correctIndex: 1,
    explanation: 'Epitome denotes a person or thing that is a quintessential example of a particular quality or type (embodiment).'
  },
  {
    id: 'verbal-4',
    category: 'Verbal Ability',
    question: 'Complete the sentence: "Despite several warnings, the driver ______ to obey the traffic signals."',
    options: ['neglected', 'refused', 'denied', 'prevented'],
    correctIndex: 1,
    explanation: '"Refused to obey" is idiomatic and accurately expresses deliberate non-compliance after warnings.'
  },
  {
    id: 'verbal-5',
    category: 'Verbal Ability',
    question: 'Find the correctly spelt word:',
    options: ['Accomodation', 'Accommodation', 'Acommodation', 'Accomadation'],
    correctIndex: 1,
    explanation: 'Accommodation has double "c" and double "m".'
  }
];

// Initial starter seed data
export const INITIAL_DEMO_DATA: CareerLaunchData = {
  version: '1.0.0',
  profile: {
    id: 'user-default-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    college: 'National Institute of Technology',
    graduationYear: '2026',
    targetRole: 'Software Development Engineer (SDE-1)',
    avatarText: 'AS'
  },
  codingQuestions: [
    {
      id: 'code-1',
      title: 'Two Sum',
      topic: 'Arrays',
      difficulty: 'Easy',
      solved: true,
      sourceLink: 'https://leetcode.com/problems/two-sum/',
      notes: 'Use a hash map to store complement (target - num). Time O(n), Space O(n).',
      datePracticed: '2026-10-25',
      createdAt: '2026-10-25T10:00:00.000Z'
    },
    {
      id: 'code-2',
      title: 'Longest Substring Without Repeating Characters',
      topic: 'Strings',
      difficulty: 'Medium',
      solved: true,
      sourceLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
      notes: 'Sliding window technique with left pointer and last seen index map.',
      datePracticed: '2026-10-26',
      createdAt: '2026-10-26T14:30:00.000Z'
    },
    {
      id: 'code-3',
      title: 'Reverse Linked List',
      topic: 'Linked Lists',
      difficulty: 'Easy',
      solved: true,
      sourceLink: 'https://leetcode.com/problems/reverse-linked-list/',
      notes: 'Iterative 3-pointer approach: prev, curr, next. Space O(1).',
      datePracticed: '2026-10-27',
      createdAt: '2026-10-27T09:15:00.000Z'
    },
    {
      id: 'code-4',
      title: 'Binary Tree Level Order Traversal',
      topic: 'Trees',
      difficulty: 'Medium',
      solved: true,
      sourceLink: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
      notes: 'BFS using a queue. Track level size at start of each iteration.',
      datePracticed: '2026-10-28',
      createdAt: '2026-10-28T16:00:00.000Z'
    },
    {
      id: 'code-5',
      title: 'Number of Islands',
      topic: 'Graphs',
      difficulty: 'Medium',
      solved: true,
      sourceLink: 'https://leetcode.com/problems/number-of-islands/',
      notes: 'Grid DFS/BFS sinking visited land from "1" to "0". Count components.',
      datePracticed: '2026-10-29',
      createdAt: '2026-10-29T11:20:00.000Z'
    },
    {
      id: 'code-6',
      title: 'Coin Change',
      topic: 'Dynamic Programming',
      difficulty: 'Medium',
      solved: false,
      sourceLink: 'https://leetcode.com/problems/coin-change/',
      notes: 'Bottom-up 1D DP array of size amount + 1. dp[i] = min(dp[i], dp[i - coin] + 1).',
      datePracticed: '2026-10-30',
      createdAt: '2026-10-30T17:45:00.000Z'
    },
    {
      id: 'code-7',
      title: 'Trapping Rain Water',
      topic: 'Arrays',
      difficulty: 'Hard',
      solved: false,
      sourceLink: 'https://leetcode.com/problems/trapping-rain-water/',
      notes: 'Two pointer approach with leftMax and rightMax, or monotonic stack.',
      datePracticed: '2026-10-31',
      createdAt: '2026-10-31T08:30:00.000Z'
    },
    {
      id: 'code-8',
      title: 'Valid Parentheses',
      topic: 'Stacks and Queues',
      difficulty: 'Easy',
      solved: true,
      sourceLink: 'https://leetcode.com/problems/valid-parentheses/',
      notes: 'Stack to match opening brackets with matching closing symbols.',
      datePracticed: '2026-10-24',
      createdAt: '2026-10-24T19:00:00.000Z'
    },
    {
      id: 'code-9',
      title: 'Top K Frequent Elements',
      topic: 'Sorting',
      difficulty: 'Medium',
      solved: true,
      sourceLink: 'https://leetcode.com/problems/top-k-frequent-elements/',
      notes: 'Bucket sort by frequency in O(n) time, or Min-Heap of size K.',
      datePracticed: '2026-10-27',
      createdAt: '2026-10-27T18:10:00.000Z'
    },
    {
      id: 'code-10',
      title: 'Department Top Three Salaries',
      topic: 'SQL',
      difficulty: 'Hard',
      solved: true,
      sourceLink: 'https://leetcode.com/problems/department-top-three-salaries/',
      notes: 'Use DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) in CTE.',
      datePracticed: '2026-10-29',
      createdAt: '2026-10-29T20:00:00.000Z'
    }
  ],
  aptitudeAttempts: [
    {
      id: 'att-1',
      category: 'Quantitative Aptitude',
      totalQuestions: 5,
      score: 4,
      percentage: 80,
      date: '2026-10-27',
      timeTakenSeconds: 320,
      answers: []
    },
    {
      id: 'att-2',
      category: 'Logical Reasoning',
      totalQuestions: 5,
      score: 5,
      percentage: 100,
      date: '2026-10-29',
      timeTakenSeconds: 240,
      answers: []
    },
    {
      id: 'att-3',
      category: 'Verbal Ability',
      totalQuestions: 5,
      score: 4,
      percentage: 80,
      date: '2026-10-31',
      timeTakenSeconds: 195,
      answers: []
    }
  ],
  companies: [
    {
      id: 'comp-1',
      name: 'Google',
      logoInitials: 'GO',
      role: 'Software Engineer (Early Career)',
      requiredSkills: ['Data Structures', 'Algorithms', 'System Design Basics', 'Clean Code'],
      commonCodingTopics: ['Graphs', 'Dynamic Programming', 'Trees', 'Recursion'],
      aptitudePattern: 'Direct online assessment on Google platform (2 medium/hard algorithmic problems in 90 mins).',
      interviewRounds: [
        'Online Coding Assessment (2 Problems)',
        'Technical Phone Screen (DSA Focus)',
        'Virtual Onsite Round 1 (Algorithms)',
        'Virtual Onsite Round 2 (Data Structures)',
        'Googliness & Leadership Fit'
      ],
      checklist: [
        { id: 'c1', label: 'Solve 50+ Medium LeetCode Graph and DP problems', completed: true },
        { id: 'c2', label: 'Revise amortized time complexities', completed: true },
        { id: 'c3', label: 'Prepare 3 STAR stories for Googliness', completed: false },
        { id: 'c4', label: 'Mock technical interview with a peer', completed: false }
      ],
      applicationDeadline: '2026-11-20',
      preparationProgress: 65,
      notes: 'High focus on optimal time & space complexity, edge cases, and articulate explanation while coding.'
    },
    {
      id: 'comp-2',
      name: 'Microsoft',
      logoInitials: 'MS',
      role: 'Software Development Engineer',
      requiredSkills: ['C++ / Java / Python', 'OOP Principles', 'OS & DBMS', 'Problem Solving'],
      commonCodingTopics: ['Linked Lists', 'Arrays', 'Strings', 'Binary Search'],
      aptitudePattern: 'Codility test: 3 problems in 75-90 minutes covering arrays, strings, and matrix processing.',
      interviewRounds: [
        'Codility Online Coding Test',
        'Technical Round 1 (DSA & Live Coding)',
        'Technical Round 2 (Design & Core CS)',
        'AA (As Appropriate) Director Round'
      ],
      checklist: [
        { id: 'c5', label: 'Master Trees and Linked List edge cases', completed: true },
        { id: 'c6', label: 'Revise OOP, Virtual Functions, and Multithreading', completed: true },
        { id: 'c7', label: 'Review final year project architecture', completed: true },
        { id: 'c8', label: 'Prepare questions for the Director', completed: false }
      ],
      applicationDeadline: '2026-11-15',
      preparationProgress: 80,
      notes: 'Values clean code structure, modularity, and understanding of memory management.'
    },
    {
      id: 'comp-3',
      name: 'Amazon',
      logoInitials: 'AM',
      role: 'SDE-1',
      requiredSkills: ['Java / C++', '16 Leadership Principles', 'Distributed Systems Basics', 'DSA'],
      commonCodingTopics: ['Trees', 'Graphs', 'Hash Tables', 'Stacks & Queues'],
      aptitudePattern: 'HackerRank test: 2 coding questions + Work Style Assessment (LP based situational test).',
      interviewRounds: [
        'OA 1: Coding Assessment',
        'OA 2: Work Simulation & LP Evaluation',
        'Technical Interview 1 (Algorithms + LP)',
        'Technical Interview 2 (Data Structures + LP)',
        'Bar Raiser Interview'
      ],
      checklist: [
        { id: 'c9', label: 'Draft 2 examples per Amazon Leadership Principle', completed: true },
        { id: 'c10', label: 'Practice Priority Queues & BFS/DFS on HackerRank', completed: true },
        { id: 'c11', label: 'Review Low-Level Object Oriented Design patterns', completed: false }
      ],
      applicationDeadline: '2026-11-30',
      preparationProgress: 70,
      notes: 'Crucial: Never underestimate Leadership Principles; every technical round includes 20 mins of LP.'
    },
    {
      id: 'comp-4',
      name: 'Goldman Sachs',
      logoInitials: 'GS',
      role: 'Analyst - Engineering',
      requiredSkills: ['Math & Probability', 'Algorithms', 'Data Structures', 'Core CS'],
      commonCodingTopics: ['Arrays', 'Math', 'Dynamic Programming', 'SQL'],
      aptitudePattern: 'Aptitude test: Numerical reasoning, logical comprehension, 2 coding problems + 1 math question.',
      interviewRounds: [
        'HackerRank Aptitude & Coding Assessment',
        'Technical Interview 1 (Math & Algorithms)',
        'Technical Interview 2 (System & DB)',
        'HR & Fitment Round'
      ],
      checklist: [
        { id: 'c12', label: 'Practice Speed Math & Probability problems', completed: true },
        { id: 'c13', label: 'Brush up Advanced SQL Joins & Window Functions', completed: true },
        { id: 'c14', label: 'Review Financial markets fundamentals', completed: false }
      ],
      applicationDeadline: '2026-12-05',
      preparationProgress: 55,
      notes: 'Emphasis on analytical speed, probability puzzles, and clean mathematical reasoning.'
    }
  ],
  applications: [
    {
      id: 'app-1',
      companyName: 'Microsoft',
      position: 'Software Development Engineer',
      applicationDate: '2026-10-15',
      interviewDate: '2026-11-08',
      salaryOrPackage: '$135,000 / ₹44 LPA',
      notes: 'Cleared Codility OA with 100% score. Technical Round 1 scheduled for Nov 8th.',
      status: 'Technical Interview',
      location: 'Redmond / Hyderabad'
    },
    {
      id: 'app-2',
      companyName: 'Google',
      position: 'Early Career Software Engineer',
      applicationDate: '2026-10-20',
      interviewDate: '2026-11-12',
      salaryOrPackage: '$150,000 / ₹52 LPA',
      notes: 'Application screened by campus recruiting. Online assessment link received.',
      status: 'Online Test',
      location: 'Mountain View / Bengaluru'
    },
    {
      id: 'app-3',
      companyName: 'Amazon',
      position: 'SDE-1',
      applicationDate: '2026-10-22',
      salaryOrPackage: '$140,000 / ₹45 LPA',
      notes: 'Submitted application on Amazon Jobs portal. Resume under review.',
      status: 'Applied',
      location: 'Seattle / Bengaluru'
    },
    {
      id: 'app-4',
      companyName: 'Goldman Sachs',
      position: 'Engineering Analyst',
      applicationDate: '2026-10-10',
      interviewDate: '2026-11-15',
      salaryOrPackage: '$125,000 / ₹36 LPA',
      notes: 'Passed initial quantitative screening round. Next round is technical DSA.',
      status: 'Technical Interview',
      location: 'New York / Bengaluru'
    },
    {
      id: 'app-5',
      companyName: 'Atlassian',
      position: 'Associate Product Engineer',
      applicationDate: '2026-10-05',
      salaryOrPackage: '$130,000 / ₹40 LPA',
      notes: 'Preparing custom resume and reviewing Jira/Confluence core architecture.',
      status: 'Preparing',
      location: 'San Francisco / Remote'
    },
    {
      id: 'app-6',
      companyName: 'Stripe',
      position: 'Software Engineer, University Grad',
      applicationDate: '2026-09-28',
      salaryOrPackage: '$155,000 / ₹50 LPA',
      notes: 'Interested in payment infrastructure team. Bookmark application for open requisition.',
      status: 'Interested',
      location: 'San Francisco, CA'
    }
  ],
  interviewQuestions: [
    {
      id: 'iq-1',
      category: 'General',
      question: 'Tell me about yourself.',
      personalAnswer: 'I am a final-year Computer Science student at NIT passionate about distributed backend systems and high-scale web platforms. Over the past 3 years, I have built production-grade fullstack web applications, contributed to open-source developer tooling, and interned as a software engineer at a fintech startup where I optimized payment API latencies by 35%. I love tackling algorithmic challenges, having solved over 300 problems across LeetCode, and I am excited to contribute to robust, user-centric engineering teams.',
      notes: 'Keep it within 90-120 seconds. Use the Past - Present - Future framework.',
      practiced: true,
      confidenceLevel: 'High',
      dateAdded: '2026-10-15'
    },
    {
      id: 'iq-2',
      category: 'Technical',
      question: 'Explain your final-year project.',
      personalAnswer: 'My capstone project is an event-driven collaborative code editor built with Node.js, WebSockets, and operational transformation algorithms. It enables multi-user real-time typing with conflict resolution and containerized code execution via Docker sandboxes. The key technical challenge was mitigating race conditions when multiple cursors edited the same syntax node; I solved this by implementing state vector versioning and optimistic local updates.',
      notes: 'Highlight architecture, trade-offs, metrics, and individual contributions.',
      practiced: true,
      confidenceLevel: 'High',
      dateAdded: '2026-10-16'
    },
    {
      id: 'iq-3',
      category: 'HR',
      question: 'What are your strengths?',
      personalAnswer: 'My core strength is disciplined problem-solving and rapid concept absorption. When tasked with unfamiliar technologies—like learning Rust for our high-throughput log processor—I systematically build prototypes, study memory safety models, and deliver production-ready code. Additionally, I communicate clearly across engineering and non-technical stakeholders.',
      notes: 'Always back claims with specific tangible examples from past projects.',
      practiced: true,
      confidenceLevel: 'High',
      dateAdded: '2026-10-17'
    },
    {
      id: 'iq-4',
      category: 'HR',
      question: 'What are your weaknesses?',
      personalAnswer: 'In the past, I sometimes struggled with premature optimization—spending hours tuning an algorithm before verifying whether the bottleneck was actually in database I/O or network serialization. To improve, I now follow a strict rule: instrument and profile with telemetry first, establish benchmarks, and only optimize when justified by profiling data.',
      notes: 'Mention a genuine weakness with an active, demonstrable correction strategy.',
      practiced: true,
      confidenceLevel: 'Medium',
      dateAdded: '2026-10-18'
    },
    {
      id: 'iq-5',
      category: 'Behavioral',
      question: 'Describe a difficult problem you solved.',
      personalAnswer: 'During my summer internship, our PostgreSQL database began experiencing connection pool exhaustion during flash sales, causing 504 gateway timeouts. I investigated connection lifecycle logs, identified idle lingering transactions in a third-party reporting webhook, decoupled the webhook into an asynchronous message queue with retry exponential backoff, and reduced peak DB connections from 180 to 24, eliminating timeouts completely.',
      notes: 'Use STAR method: Situation, Task, Action, Result with quantified outcome.',
      practiced: true,
      confidenceLevel: 'High',
      dateAdded: '2026-10-19'
    },
    {
      id: 'iq-6',
      category: 'HR',
      question: 'Why should we hire you?',
      personalAnswer: 'You should hire me because I combine strong computer science fundamentals with a bias for shipping pragmatic, clean code. I do not just write algorithms; I understand deployment, automated testing, API versioning, and developer experience. I am eager to learn, welcome code reviews, and am excited to bring energetic ownership to your team from day one.',
      notes: 'Focus on mutual value: what you bring to the team vs what they need.',
      practiced: false,
      confidenceLevel: 'Medium',
      dateAdded: '2026-10-20'
    },
    {
      id: 'iq-7',
      category: 'Technical',
      question: 'Explain the difference between TCP and UDP, and when you would choose each.',
      personalAnswer: 'TCP is connection-oriented, reliable, and guarantees in-order byte stream delivery via three-way handshakes, sequence numbers, checksums, and flow control. UDP is connectionless, lightweight, and transmits datagrams without delivery acknowledgment or retransmission overhead. Choose TCP for applications requiring data integrity like HTTP, banking transactions, and file transfers. Choose UDP where low latency is critical and dropped packets are acceptable, such as video streaming, online multiplayer gaming, and DNS lookups.',
      notes: 'Draw or explain packet header differences and congestion control.',
      practiced: true,
      confidenceLevel: 'High',
      dateAdded: '2026-10-21'
    },
    {
      id: 'iq-8',
      category: 'Behavioral',
      question: 'Tell me about a time you had a conflict with a team member.',
      personalAnswer: 'During a hackathon, a teammate wanted to use an experimental graph database while I proposed PostgreSQL with JSONB because of the strict 24-hour deadline and our team\'s familiarity. Instead of arguing, I proposed a 30-minute time-boxed spike: if we could stand up the schema and sample queries in 30 minutes, we would proceed; if not, we would use Postgres. We encountered driver incompatibility in 20 minutes and mutually agreed to use Postgres, successfully finishing 2nd place.',
      notes: 'Shows objective judgment, empathy, and collaborative conflict resolution.',
      practiced: true,
      confidenceLevel: 'Medium',
      dateAdded: '2026-10-22'
    }
  ],
  resumeProfile: {
    personalDetails: {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      phone: '+1 (555) 234-5678',
      location: 'San Jose, CA',
      linkedin: 'linkedin.com/in/aarav-sharma-eng',
      github: 'github.com/aarav-sharma',
      portfolio: 'aaravsharma.dev'
    },
    objective: 'Results-driven Computer Science senior seeking a Software Development Engineer role. Experienced in full-stack web architecture, distributed caching, and clean API design, with a demonstrated record of reducing API latency and delivering high-availability campus tools.',
    education: [
      {
        id: 'edu-1',
        institution: 'National Institute of Technology',
        degree: 'Bachelor of Technology',
        field: 'Computer Science and Engineering',
        startYear: '2022',
        endYear: '2026',
        score: '3.89 / 4.0 GPA (Dean’s Honor List)'
      },
      {
        id: 'edu-2',
        institution: 'St. Xavier Senior High School',
        degree: 'High School Diploma',
        field: 'Mathematics & Computer Science',
        startYear: '2020',
        endYear: '2022',
        score: '96.4% Aggregate'
      }
    ],
    skills: {
      technical: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'Java', 'C++', 'SQL', 'React', 'Node.js', 'Express', 'Tailwind CSS', 'Docker', 'Git'],
      soft: ['Analytical Thinking', 'Cross-Functional Collaboration', 'Clear Technical Writing', 'Agile / Scrum', 'Mentorship'],
      tools: ['VS Code', 'Postman', 'Linux / Bash', 'GitHub Actions', 'Figma', 'Webpack / Vite']
    },
    projects: [
      {
        id: 'proj-1',
        title: 'CareerLaunch - Placement Preparation Engine',
        techStack: 'React 19, TypeScript, Tailwind CSS, Local Storage',
        summary: 'Comprehensive all-in-one preparation suite for collegiate placement training.',
        bullets: [
          'Architected an offline-first modular dashboard tracking 300+ DSA problems, aptitude quizzes, and mock interview logs.',
          'Engineered lightweight SVG performance charting and client-side JSON export/import validation with zero external bloat.',
          'Adopted by 450+ campus peers, recording a 28% increase in weekly coding consistency.'
        ],
        link: 'https://careerlaunch.internal'
      },
      {
        id: 'proj-2',
        title: 'CollabCode - Real-time Collaborative Sandboxed Editor',
        techStack: 'Node.js, WebSockets, Docker, React, Redis',
        summary: 'Multi-tenant cloud IDE with sub-50ms peer synchronization.',
        bullets: [
          'Implemented Operational Transformation (OT) engine ensuring convergent document consistency across concurrent sessions.',
          'Spawned ephemeral isolated Docker containers with 512MB memory ceilings for secure C++, Python, and JS execution.',
          'Reduced container cold-boot spin-up latency from 1.4s to 220ms via pre-warmed snapshot pools.'
        ],
        link: 'https://github.com/aarav-sharma/collab-code'
      }
    ],
    internships: [
      {
        id: 'intern-1',
        company: 'FinTrack Technologies',
        role: 'Software Engineering Intern',
        duration: 'May 2025 – August 2025',
        bullets: [
          'Engineered asynchronous webhook queue handling 250,000+ daily financial events using Redis and Node.js.',
          'Eliminated database connection pool starvation by decomposing monolithic queries and adding indexed CTEs, saving 35% CPU.',
          'Authored 40+ unit and integration test suites boosting code coverage from 68% to 92%.'
        ]
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        year: '2025'
      },
      {
        id: 'cert-2',
        name: 'Meta Front-End Developer Specialization',
        issuer: 'Coursera / Meta',
        year: '2024'
      }
    ],
    achievements: [
      'Ranked in Top 2% across 14,000 participants in National Collegiate Hackathon 2025.',
      'Global Rank 842 in LeetCode Weekly Contest 392 (Knight Badge, Max Rating 1940+).',
      'President of Campus Open Source Software Society; organized 6 technical workshops for 300+ students.'
    ]
  },
  preparationActivity: [
    { date: '2026-10-22', codingCount: 2, aptitudeCount: 1, interviewCount: 1 },
    { date: '2026-10-23', codingCount: 3, aptitudeCount: 2, interviewCount: 0 },
    { date: '2026-10-24', codingCount: 4, aptitudeCount: 1, interviewCount: 2 },
    { date: '2026-10-25', codingCount: 3, aptitudeCount: 0, interviewCount: 1 },
    { date: '2026-10-26', codingCount: 5, aptitudeCount: 3, interviewCount: 2 },
    { date: '2026-10-27', codingCount: 4, aptitudeCount: 2, interviewCount: 1 },
    { date: '2026-10-28', codingCount: 2, aptitudeCount: 1, interviewCount: 3 },
    { date: '2026-10-29', codingCount: 6, aptitudeCount: 2, interviewCount: 2 },
    { date: '2026-10-30', codingCount: 3, aptitudeCount: 1, interviewCount: 1 },
    { date: '2026-10-31', codingCount: 5, aptitudeCount: 2, interviewCount: 2 }
  ],
  settings: {
    dailyPreparationGoal: 4,
    preferredPreparationTime: 'Evening',
    notificationPreference: true,
    targetPlacementDate: '2026-12-15'
  },
  authenticationState: {
    isAuthenticated: true,
    currentUser: {
      id: 'user-default-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      college: 'National Institute of Technology',
      graduationYear: '2026',
      targetRole: 'Software Development Engineer (SDE-1)',
      avatarText: 'AS'
    },
    rememberMe: true,
    token: 'local-dev-token-default-user'
  },
  registeredUsers: [
    {
      id: 'user-default-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      passwordHashSimulated: 'demoPass123!',
      college: 'National Institute of Technology',
      graduationYear: '2026',
      createdAt: '2026-10-01T00:00:00.000Z'
    }
  ]
};

// Storage Service with robust validation and error handling
export const StorageService = {
  loadData(): CareerLaunchData {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        this.saveData(INITIAL_DEMO_DATA);
        return INITIAL_DEMO_DATA;
      }
      const parsed = JSON.parse(serialized);
      // Validate structure basics
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.codingQuestions)) {
        console.warn('Malformed local data detected, reloading demo baseline.');
        this.saveData(INITIAL_DEMO_DATA);
        return INITIAL_DEMO_DATA;
      }
      return {
        ...INITIAL_DEMO_DATA,
        ...parsed,
        settings: { ...INITIAL_DEMO_DATA.settings, ...(parsed.settings || {}) },
        resumeProfile: { ...INITIAL_DEMO_DATA.resumeProfile, ...(parsed.resumeProfile || {}) },
        authenticationState: { ...INITIAL_DEMO_DATA.authenticationState, ...(parsed.authenticationState || {}) }
      };
    } catch (e) {
      console.error('Error loading data from localStorage, falling back to default:', e);
      return INITIAL_DEMO_DATA;
    }
  },

  saveData(data: CareerLaunchData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
    }
  },

  resetDemoData(): CareerLaunchData {
    this.saveData(INITIAL_DEMO_DATA);
    return INITIAL_DEMO_DATA;
  },

  clearLocalData(): CareerLaunchData {
    const blankData: CareerLaunchData = {
      version: '1.0.0',
      profile: null,
      codingQuestions: [],
      aptitudeAttempts: [],
      companies: [],
      applications: [],
      interviewQuestions: [],
      resumeProfile: {
        personalDetails: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
        objective: '',
        education: [],
        skills: { technical: [], soft: [], tools: [] },
        projects: [],
        internships: [],
        certifications: [],
        achievements: []
      },
      preparationActivity: [],
      settings: {
        dailyPreparationGoal: 3,
        preferredPreparationTime: 'Morning',
        notificationPreference: true
      },
      authenticationState: {
        isAuthenticated: false,
        currentUser: null,
        rememberMe: false
      },
      registeredUsers: []
    };
    this.saveData(blankData);
    return blankData;
  },

  exportJSON(data: CareerLaunchData): string {
    return JSON.stringify(data, null, 2);
  },

  validateAndImport(jsonString: string): { success: boolean; data?: CareerLaunchData; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON file format.' };
      }
      if (!Array.isArray(parsed.codingQuestions)) {
        return { success: false, error: 'Missing codingQuestions array in imported schema.' };
      }
      if (!Array.isArray(parsed.applications)) {
        return { success: false, error: 'Missing applications array in imported schema.' };
      }
      if (!parsed.resumeProfile || typeof parsed.resumeProfile !== 'object') {
        return { success: false, error: 'Missing resumeProfile object in imported schema.' };
      }

      const mergedData: CareerLaunchData = {
        ...INITIAL_DEMO_DATA,
        ...parsed,
        version: parsed.version || '1.0.0'
      };
      this.saveData(mergedData);
      return { success: true, data: mergedData };
    } catch (err: any) {
      return { success: false, error: err.message || 'Syntax error while parsing JSON.' };
    }
  },

  logActivity(data: CareerLaunchData, type: 'coding' | 'aptitude' | 'interview'): CareerLaunchData {
    const today = new Date().toISOString().split('T')[0];
    const activityIndex = data.preparationActivity.findIndex(a => a.date === today);

    let updatedActivity = [...data.preparationActivity];
    if (activityIndex >= 0) {
      const existing = updatedActivity[activityIndex];
      updatedActivity[activityIndex] = {
        ...existing,
        codingCount: existing.codingCount + (type === 'coding' ? 1 : 0),
        aptitudeCount: existing.aptitudeCount + (type === 'aptitude' ? 1 : 0),
        interviewCount: existing.interviewCount + (type === 'interview' ? 1 : 0)
      };
    } else {
      updatedActivity.push({
        date: today,
        codingCount: type === 'coding' ? 1 : 0,
        aptitudeCount: type === 'aptitude' ? 1 : 0,
        interviewCount: type === 'interview' ? 1 : 0
      });
    }

    const updatedData: CareerLaunchData = {
      ...data,
      preparationActivity: updatedActivity
    };
    this.saveData(updatedData);
    return updatedData;
  }
};
