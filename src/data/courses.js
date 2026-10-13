/**
 * Curated catalog of 100% free (or 100% free-to-audit) courses.
 *
 * ⚠️ Keep this file committed: Botkeep deploys from GitHub, so anything that is
 * gitignored will be missing inside the container (`.gitignore` used to ignore
 * `data/` anywhere in the tree, which silently dropped `src/data/`).
 *
 * Schema — keep in sync with `src/services/search.js`, `src/bot/engine.js`
 * and `public/app.js`:
 *   id               {string}  stable slug used by /save, /detail, watchlist
 *   title            {string}
 *   platform         {string}  should match a `PLATFORM_GUIDES[].name`
 *   category         {string}  powers the Course Explorer category dropdown
 *   level            {'Beginner'|'Intermediate'|'Advanced'}
 *   duration         {string}  human readable, shown in cards/messages
 *   durationHours    {number}  used by the "short courses only" filter
 *   rating           {number}  0–5
 *   hasFreeCertificate {boolean} true only when the certificate/badge is $0
 *   instructor       {string}
 *   summary          {string}  "what you'll learn" one-liner
 *   howToGetFree     {string}  exactly how to access it for $0 (no fake trials)
 *   tags             {string[]} search keywords/synonyms
 *   url              {string}  https link straight to the free course
 */

const COURSES = [
  // ---------------------------------------------------------------------------
  // Harvard CS50 (free to audit + free CS50 certificate from cs50.harvard.edu)
  // ---------------------------------------------------------------------------
  {
    id: 'cs50x',
    title: 'CS50x: Introduction to Computer Science',
    platform: 'Harvard CS50',
    category: 'Programming',
    level: 'Beginner',
    duration: '11 weeks · 10–20 hrs/wk',
    durationHours: 120,
    rating: 4.9,
    hasFreeCertificate: true,
    instructor: 'Prof. David J. Malan (Harvard University)',
    summary:
      "Harvard's famous introduction to computer science: computational thinking, C, Python, SQL, HTML/CSS/JavaScript and algorithms — taught through real problem sets on cryptography, finance, forensics and gaming.",
    howToGetFree:
      'Take the full course free at cs50.harvard.edu/x (no edX payment needed) and claim a free CS50 certificate after submitting the problem sets and final project.',
    tags: ['cs50', 'computer science', 'c', 'python', 'sql', 'algorithms', 'harvard', 'programming', 'beginner'],
    url: 'https://cs50.harvard.edu/x/'
  },
  {
    id: 'cs50p',
    title: "CS50p: CS50's Introduction to Programming with Python",
    platform: 'Harvard CS50',
    category: 'Programming',
    level: 'Beginner',
    duration: '9 weeks · 6–9 hrs/wk',
    durationHours: 60,
    rating: 4.9,
    hasFreeCertificate: true,
    instructor: 'Prof. David J. Malan (Harvard University)',
    summary:
      'A complete, gentle-but-rigorous Python course: functions, exceptions, unit tests, file I/O, regular expressions, object-oriented programming and libraries, with ten hands-on problem sets.',
    howToGetFree:
      'All lectures, notes and problem sets are free at cs50.harvard.edu/python — the free CS50 certificate is issued for the course itself, not the paid edX verified track.',
    tags: ['python', 'cs50', 'programming', 'beginner', 'testing', 'regex', 'oop'],
    url: 'https://cs50.harvard.edu/python/'
  },
  {
    id: 'cs50ai',
    title: "CS50ai: CS50's Introduction to Artificial Intelligence with Python",
    platform: 'Harvard CS50',
    category: 'AI & Machine Learning',
    level: 'Intermediate',
    duration: '7 weeks · 10–15 hrs/wk',
    durationHours: 80,
    rating: 4.8,
    hasFreeCertificate: true,
    instructor: 'Brian Yu & Prof. David J. Malan (Harvard University)',
    summary:
      'Build real AI projects in Python: graph search, minimax (tic-tac-toe), knowledge representation, uncertainty/Bayesian networks, optimization, learning (neural nets) and natural language processing.',
    howToGetFree:
      'Watch all lectures and submit the seven projects for free at cs50.harvard.edu/ai to earn the free CS50 certificate.',
    tags: ['ai', 'artificial intelligence', 'machine learning', 'python', 'nltk', 'neural networks', 'search'],
    url: 'https://cs50.harvard.edu/ai/'
  },
  {
    id: 'cs50w',
    title: "CS50w: CS50's Web Programming with Python and JavaScript",
    platform: 'Harvard CS50',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '9 weeks · 6–9 hrs/wk',
    durationHours: 70,
    rating: 4.8,
    hasFreeCertificate: true,
    instructor: 'Brian Yu & Prof. David J. Malan (Harvard University)',
    summary:
      'Full-stack web development from the ground up: Django, SQL models and migrations, JavaScript and React-style interactivity, APIs, and deploying real apps with responsive mobile-friendly layouts.',
    howToGetFree:
      'Everything is free at cs50.harvard.edu/web — complete the projects there to claim the free CS50 certificate.',
    tags: ['web development', 'django', 'python', 'javascript', 'sql', 'fullstack', 'react', 'apis'],
    url: 'https://cs50.harvard.edu/web/'
  },
  {
    id: 'cs50sql',
    title: "CS50sql: CS50's Introduction to Databases with SQL",
    platform: 'Harvard CS50',
    category: 'Data Science',
    level: 'Beginner',
    duration: '7 weeks · 6–8 hrs/wk',
    durationHours: 50,
    rating: 4.8,
    hasFreeCertificate: true,
    instructor: 'Carter Zenke & Prof. David J. Malan (Harvard University)',
    summary:
      'Learn relational databases properly: designing schemas, SELECT queries, joins, indexes, views, transactions, and working with SQLite, PostgreSQL and MySQL.',
    howToGetFree:
      'Free lectures + problem sets at cs50.harvard.edu/sql, with a free CS50 certificate once the problem sets and final project are submitted.',
    tags: ['sql', 'database', 'sqlite', 'postgresql', 'mysql', 'data science', 'queries', 'cs50'],
    url: 'https://cs50.harvard.edu/sql/'
  },

  // ---------------------------------------------------------------------------
  // freeCodeCamp (free forever, free verified certifications)
  // ---------------------------------------------------------------------------
  {
    id: 'fcc-responsive-web-design',
    title: 'freeCodeCamp: Responsive Web Design Certification',
    platform: 'freeCodeCamp',
    category: 'Web Development',
    level: 'Beginner',
    duration: '~300 hours · self-paced',
    durationHours: 300,
    rating: 4.8,
    hasFreeCertificate: true,
    instructor: 'freeCodeCamp.org (Quincy Larson & community)',
    summary:
      'Build 20+ projects and 5 certification projects while learning HTML, CSS, Flexbox, CSS Grid, typography, accessibility and responsive design from scratch.',
    howToGetFree:
      'Open freecodecamp.org/learn, create a free account and complete the 5 certification projects — the Responsive Web Design certificate is 100% free and shareable.',
    tags: ['html', 'css', 'web development', 'responsive', 'flexbox', 'css grid', 'frontend', 'certificate'],
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'
  },
  {
    id: 'fcc-javascript',
    title: 'freeCodeCamp: JavaScript Algorithms and Data Structures Certification',
    platform: 'freeCodeCamp',
    category: 'Web Development',
    level: 'Beginner',
    duration: '~300 hours · self-paced',
    durationHours: 300,
    rating: 4.8,
    hasFreeCertificate: true,
    instructor: 'freeCodeCamp.org',
    summary:
      'Master JavaScript fundamentals — variables, arrays, objects, loops, functions, the DOM, OOP, functional programming and algorithms — then build five portfolio projects.',
    howToGetFree:
      'The whole curriculum and the certificate are free at freecodecamp.org/learn (JavaScript Certification) — no subscription, no trial.',
    tags: ['javascript', 'js', 'algorithms', 'data structures', 'dom', 'programming', 'certificate'],
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8'
  },
  {
    id: 'fcc-front-end-libraries',
    title: 'freeCodeCamp: Front End Development Libraries Certification',
    platform: 'freeCodeCamp',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '~300 hours · self-paced',
    durationHours: 300,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'freeCodeCamp.org',
    summary:
      'Learn Bootstrap, jQuery, Sass, React and Redux by building a random-quote machine, a Markdown previewer, a drum machine, a calculator and a pomodoro timer.',
    howToGetFree:
      'Free at freecodecamp.org/learn — finish the five React/Redux certification projects to unlock the free certificate.',
    tags: ['react', 'redux', 'bootstrap', 'sass', 'jquery', 'frontend', 'libraries', 'web development'],
    url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/'
  },
  {
    id: 'fcc-back-end-apis',
    title: 'freeCodeCamp: Back End Development and APIs Certification',
    platform: 'freeCodeCamp',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '~300 hours · self-paced',
    durationHours: 300,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'freeCodeCamp.org',
    summary:
      'Build servers and APIs with Node.js, Express and MongoDB: routing, middleware, REST endpoints, environment variables and database integration.',
    howToGetFree:
      'Free curriculum + free certificate at freecodecamp.org/learn (Back End Development and APIs) — projects are submitted through a free GitHub/Replit account.',
    tags: ['node', 'nodejs', 'express', 'mongodb', 'api', 'backend', 'rest', 'web development'],
    url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/'
  },
  {
    id: 'fcc-python',
    title: 'freeCodeCamp: Scientific Computing with Python Certification',
    platform: 'freeCodeCamp',
    category: 'Programming',
    level: 'Beginner',
    duration: '~300 hours · self-paced',
    durationHours: 300,
    rating: 4.8,
    hasFreeCertificate: true,
    instructor: 'freeCodeCamp.org',
    summary:
      'Learn Python by building a cipher, a Luhn checksum validator, an expense tracker, a case converter, a shortest-path solver, a Tower of Hanoi solver and more.',
    howToGetFree:
      'Everything (curriculum, projects, certificate) is free at freecodecamp.org/learn/scientific-computing-with-python.',
    tags: ['python', 'programming', 'certificate', 'algorithms', 'oop', 'data structures'],
    url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python'
  },
  {
    id: 'fcc-relational-database',
    title: 'freeCodeCamp: Relational Database Certification (Bash, SQL, PostgreSQL)',
    platform: 'freeCodeCamp',
    category: 'Data Science',
    level: 'Beginner',
    duration: '~300 hours · self-paced',
    durationHours: 300,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'freeCodeCamp.org',
    summary:
      'Learn Bash, Linux and SQL, then design real PostgreSQL databases — tables, keys, joins, aggregates — while building 5 certification projects.',
    howToGetFree:
      'Free at freecodecamp.org/learn (Relational Databases) — all projects run in a free browser-based Linux/PostgreSQL environment.',
    tags: ['sql', 'postgresql', 'database', 'bash', 'linux', 'relational', 'data'],
    url: 'https://www.freecodecamp.org/learn/relational-database/'
  },
  {
    id: 'fcc-data-analysis-python',
    title: 'freeCodeCamp: Data Analysis with Python Certification',
    platform: 'freeCodeCamp',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '~300 hours · self-paced',
    durationHours: 300,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'freeCodeCamp.org',
    summary:
      'Analyse real datasets with NumPy, Pandas, Matplotlib and Seaborn: cleaning, grouping, aggregating, visualising and computing statistics, ending in a demographic-data project.',
    howToGetFree:
      'Free curriculum + free certificate at freecodecamp.org/learn/data-analysis-with-python.',
    tags: ['data analysis', 'python', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'data science', 'statistics'],
    url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/'
  },
  {
    id: 'fcc-machine-learning-python',
    title: 'freeCodeCamp: Machine Learning with Python Certification',
    platform: 'freeCodeCamp',
    category: 'AI & Machine Learning',
    level: 'Advanced',
    duration: '~300 hours · self-paced',
    durationHours: 300,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'freeCodeCamp.org',
    summary:
      'Use TensorFlow and scikit-learn for neural networks, image classification, natural language processing, reinforcement learning and a linear-regression health-cost project.',
    howToGetFree:
      'Free at freecodecamp.org/learn/machine-learning-with-python — the certificate is issued by freeCodeCamp at no cost.',
    tags: ['machine learning', 'ml', 'tensorflow', 'keras', 'neural networks', 'nlp', 'python', 'ai'],
    url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/'
  },
  {
    id: 'fcc-information-security',
    title: 'freeCodeCamp: Information Security Certification',
    platform: 'freeCodeCamp',
    category: 'Cybersecurity',
    level: 'Intermediate',
    duration: '~300 hours · self-paced',
    durationHours: 300,
    rating: 4.6,
    hasFreeCertificate: true,
    instructor: 'freeCodeCamp.org',
    summary:
      'Learn how attackers think and how to defend systems: information security fundamentals, hashing, encryption, authentication, and five secure web-app projects.',
    howToGetFree:
      'Free at freecodecamp.org/learn/information-security — no paid tier exists.',
    tags: ['security', 'infosec', 'cybersecurity', 'encryption', 'hashing', 'authentication', 'ethical hacking'],
    url: 'https://www.freecodecamp.org/learn/information-security/'
  },

  // ---------------------------------------------------------------------------
  // MIT OpenCourseWare (free to audit forever, no signup for lectures)
  // ---------------------------------------------------------------------------
  {
    id: 'mit-6-0001',
    title: 'MIT 6.0001: Introduction to Computer Science and Programming in Python',
    platform: 'MIT OCW',
    category: 'Programming',
    level: 'Beginner',
    duration: '24 video lectures + problem sets',
    durationHours: 45,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Dr. Ana Bell, Prof. Eric Grimson, Prof. John Guttag (MIT)',
    summary:
      'MIT’s introductory programming course: computation, branching, iteration, strings, functions, recursion, testing, object-oriented programming and program efficiency — in Python.',
    howToGetFree:
      'All 24 lecture videos, slides and problem sets are downloadable free from ocw.mit.edu — MIT OCW never charges and requires no account.',
    tags: ['python', 'mit', 'computer science', 'programming', 'recursion', 'algorithms', 'ocw'],
    url: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/'
  },
  {
    id: 'mit-6-0002',
    title: 'MIT 6.0002: Introduction to Computational Thinking and Data Science',
    platform: 'MIT OCW',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '20 video lectures + problem sets',
    durationHours: 40,
    rating: 4.7,
    hasFreeCertificate: false,
    instructor: 'Dr. Ana Bell, Prof. Eric Grimson, Prof. John Guttag (MIT)',
    summary:
      'Optimisation and knapsack problems, graph models, random walks, Monte Carlo simulation, curve fitting, probability, statistics, machine learning and clustering.',
    howToGetFree:
      'Free lecture videos, slides and assignments on ocw.mit.edu — the course materials are openly licensed, no registration needed.',
    tags: ['data science', 'mit', 'python', 'simulation', 'statistics', 'machine learning', 'clustering', 'matplotlib'],
    url: 'https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/'
  },
  {
    id: 'mit-6-006',
    title: 'MIT 6.006: Introduction to Algorithms',
    platform: 'MIT OCW',
    category: 'Programming',
    level: 'Advanced',
    duration: '21 video lectures + problem sets',
    durationHours: 70,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Prof. Erik Demaine, Dr. Jason Ku, Prof. Justin Solomon (MIT)',
    summary:
      'The algorithmic backbone of interviews and CS degrees: hashing, sorting, binary search trees, heaps, BFS/DFS, shortest paths, dynamic programming and complexity.',
    howToGetFree:
      'Complete lectures, problem sets and quizzes are free on ocw.mit.edu — textbook is optional.',
    tags: ['algorithms', 'data structures', 'mit', 'dynamic programming', 'dijkstra', 'sorting', 'graphs'],
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/'
  },
  {
    id: 'mit-18-06',
    title: 'MIT 18.06: Linear Algebra (Gilbert Strang)',
    platform: 'MIT OCW',
    category: 'Math & Foundations',
    level: 'Intermediate',
    duration: '35 video lectures',
    durationHours: 50,
    rating: 4.9,
    hasFreeCertificate: false,
    instructor: 'Prof. Gilbert Strang (MIT)',
    summary:
      'The legendary linear algebra course: elimination, vector spaces, orthogonality, determinants, eigenvalues and positive-definite matrices — the math behind machine learning.',
    howToGetFree:
      'Every lecture, recitation and exam is free at ocw.mit.edu (the companion textbook from the MIT library is also available to read free online).',
    tags: ['linear algebra', 'math', 'matrices', 'eigenvalues', 'machine learning', 'mit', 'foundations'],
    url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/'
  },
  {
    id: 'mit-6-042j',
    title: 'MIT 6.042J: Mathematics for Computer Science',
    platform: 'MIT OCW',
    category: 'Math & Foundations',
    level: 'Intermediate',
    duration: '25 video lectures + problem sets',
    durationHours: 60,
    rating: 4.7,
    hasFreeCertificate: false,
    instructor: 'Prof. Tom Leighton, Dr. Marten van Dijk (MIT)',
    summary:
      'Discrete math every engineer needs: proofs, logic, sets, relations, graph theory, counting, probability and recurrence-solving — with the free MIT textbook.',
    howToGetFree:
      'Free lecture videos, notes and (with solutions) problem sets on ocw.mit.edu.',
    tags: ['math', 'discrete math', 'probability', 'graph theory', 'proofs', 'computer science', 'mit'],
    url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/'
  },
  {
    id: 'mit-6-034',
    title: 'MIT 6.034: Artificial Intelligence',
    platform: 'MIT OCW',
    category: 'AI & Machine Learning',
    level: 'Advanced',
    duration: '24 video lectures + projects',
    durationHours: 60,
    rating: 4.7,
    hasFreeCertificate: false,
    instructor: 'Prof. Patrick H. Winston (MIT)',
    summary:
      'Classic AI taught by Patrick Winston: search, games, constraints, learning (decision trees, neural nets, SVM), boosting, probabilistic models and object recognition.',
    howToGetFree:
      'Free lectures and assignments on ocw.mit.edu — Winston’s own tutorials and demos are included.',
    tags: ['ai', 'artificial intelligence', 'machine learning', 'neural networks', 'search', 'mit', 'svm'],
    url: 'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/'
  },

  // ---------------------------------------------------------------------------
  // Udemy permanent-free courses (filtered with ?price=price-free)
  // ---------------------------------------------------------------------------
  {
    id: 'udemy-python-intro',
    title: 'Introduction To Python Programming',
    platform: 'Udemy',
    category: 'Programming',
    level: 'Beginner',
    duration: '1.5 hours · 30 lectures',
    durationHours: 1.5,
    rating: 4.5,
    hasFreeCertificate: false,
    instructor: 'Aviral Bansal',
    summary:
      'The most-enrolled free Udemy course ever: Python fundamentals, syntax, logic, file handling and your first self-written scripts and functions.',
    howToGetFree:
      'Enrol free on Udemy (free courses have no certificate) or browse all $0 courses at udemy.com/courses/free — never pay for a "free coupon" site.',
    tags: ['python', 'programming', 'udemy', 'beginner', 'crash course', 'scripting'],
    url: 'https://www.udemy.com/course/pythonforbeginnersintro/'
  },
  {
    id: 'udemy-cpp',
    title: 'C++ Tutorial for Complete Beginners',
    platform: 'Udemy',
    category: 'Programming',
    level: 'Beginner',
    duration: '5 hours · 82 lectures',
    durationHours: 5,
    rating: 4.5,
    hasFreeCertificate: false,
    instructor: 'John Purcell',
    summary:
      'Set up an IDE and write real C++ programs: variables, loops, functions, pointers, references, classes and object-oriented programming, step by step.',
    howToGetFree:
      'Free enrolment on Udemy — the course is permanently $0 (Udemy free courses do not issue certificates).',
    tags: ['c++', 'cpp', 'programming', 'udemy', 'oop', 'pointers', 'beginner'],
    url: 'https://www.udemy.com/course/free-learn-c-tutorial-beginners/'
  },
  {
    id: 'udemy-javascript-essentials',
    title: 'Javascript Essentials',
    platform: 'Udemy',
    category: 'Web Development',
    level: 'Beginner',
    duration: '6 hours · 62 lectures',
    durationHours: 6,
    rating: 4.4,
    hasFreeCertificate: false,
    instructor: 'Lawrence Turton',
    summary:
      'Learn JavaScript the practical way: variables, functions, arrays, objects, the DOM and events, then wire it all together in small browser projects.',
    howToGetFree:
      'Permanently free on Udemy — use the "Free Courses" filter (?price=price-free) so you never land on a paid look-alike.',
    tags: ['javascript', 'js', 'web development', 'udemy', 'dom', 'frontend', 'beginner'],
    url: 'https://www.udemy.com/course/javascript-essentials/'
  },
  {
    id: 'udemy-git-github',
    title: 'Git & GitHub Crash Course: Create a Repository From Scratch!',
    platform: 'Udemy',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    duration: '1 hour · 14 lectures',
    durationHours: 1,
    rating: 4.4,
    hasFreeCertificate: false,
    instructor: 'Kalob Taulien',
    summary:
      'Version control without the confusion: install Git, commit, branch, merge and push your first project to a public GitHub repository.',
    howToGetFree:
      'Free on Udemy, and the GitHub account you will use is free forever too (unlimited public + private repos).',
    tags: ['git', 'github', 'version control', 'devops', 'udemy', 'crash course', 'beginner'],
    url: 'https://www.udemy.com/course/git-and-github-crash-course-creating-a-repository-from-scratch/'
  },
  {
    id: 'udemy-sql-querying',
    title: 'Introduction to Databases and SQL Querying',
    platform: 'Udemy',
    category: 'Data Science',
    level: 'Beginner',
    duration: '2.5 hours · 20 lectures',
    durationHours: 2.5,
    rating: 4.5,
    hasFreeCertificate: false,
    instructor: 'Rakesh Gopalakrishnan',
    summary:
      'Query real databases in SQL Server: SELECT, WHERE, GROUP BY, JOIN, sub-queries, views and stored procedures — enough to be productive with data fast.',
    howToGetFree:
      'Permanently free on Udemy; install the free SQL Server Express edition used in the course to follow along at $0.',
    tags: ['sql', 'database', 'data', 'udemy', 'queries', 'joins', 'data analysis'],
    url: 'https://www.udemy.com/course/introduction-to-databases-and-sql-querying/'
  },
  {
    id: 'udemy-excel-beginners',
    title: 'Useful Excel for Beginners',
    platform: 'Udemy',
    category: 'Data Science',
    level: 'Beginner',
    duration: '9.5 hours · 89 lectures',
    durationHours: 9.5,
    rating: 4.6,
    hasFreeCertificate: false,
    instructor: 'Dinesh Natarajan Mohan',
    summary:
      'The definitive free Excel starter: entering and formatting data, formulas, lookup and IF functions, charts, conditional formatting and PivotTables.',
    howToGetFree:
      'Free enrolment on Udemy with downloadable practice workbooks — no certificate, but 850k+ learners rate it as the best free Excel course.',
    tags: ['excel', 'spreadsheets', 'office', 'data analysis', 'pivot tables', 'udemy', 'productivity'],
    url: 'https://www.udemy.com/course/useful-excel-for-beginners/'
  },
  {
    id: 'udemy-web-design',
    title: 'Web Design for Web Developers: Build Beautiful Websites!',
    platform: 'Udemy',
    category: 'Design & UX',
    level: 'Beginner',
    duration: '4 hours · 45 lectures',
    durationHours: 4,
    rating: 4.5,
    hasFreeCertificate: false,
    instructor: 'Jonas Schmedtmann',
    summary:
      'The design rules developers usually skip: spacing and whitespace, colour theory, typography, imagery, icons, and how to design a landing page that converts.',
    howToGetFree:
      'Free on Udemy (one of the most popular $0 courses ever) — pair it with the free freeCodeCamp HTML/CSS curriculum to build what you design.',
    tags: ['design', 'web design', 'ui', 'ux', 'typography', 'css', 'udemy', 'landing page'],
    url: 'https://www.udemy.com/course/web-design-secrets/'
  },
  {
    id: 'udemy-cyber-security-beginners',
    title: 'Cyber Security Course for Beginners – Level 01',
    platform: 'Udemy',
    category: 'Cybersecurity',
    level: 'Beginner',
    duration: '2 hours · 24 lectures',
    durationHours: 2,
    rating: 4.4,
    hasFreeCertificate: false,
    instructor: 'Anand Rao Nednur',
    summary:
      'A calm, jargon-free introduction to security: threat landscape, malware, network attacks, cryptography basics, and how to protect yourself and your business.',
    howToGetFree:
      'Free on Udemy; follow it with the free Cisco Networking Academy "Introduction to Cybersecurity" badge course.',
    tags: ['cybersecurity', 'security', 'hacking', 'malware', 'networking', 'udemy', 'beginner'],
    url: 'https://www.udemy.com/course/certified-secure-netizen/'
  },
  {
    id: 'udemy-kali-ethical-hacking',
    title: 'Start Kali Linux, Ethical Hacking and Penetration Testing!',
    platform: 'Udemy',
    category: 'Cybersecurity',
    level: 'Intermediate',
    duration: '3 hours · 26 lectures',
    durationHours: 3,
    rating: 4.4,
    hasFreeCertificate: false,
    instructor: 'Bharath Ram',
    summary:
      'Spin up Kali Linux in a free VM and practise the penetration-testing workflow: reconnaissance, scanning, exploitation basics and reporting — ethically and legally.',
    howToGetFree:
      'Free on Udemy, and Kali Linux + VirtualBox are both free and open source — practise only on machines you own or CTF labs like TryHackMe’s free rooms.',
    tags: ['kali linux', 'ethical hacking', 'penetration testing', 'cybersecurity', 'linux', 'udemy'],
    url: 'https://www.udemy.com/course/ethical-hacker/'
  },
  {
    id: 'udemy-seo-beginners',
    title: 'SEO Tutorial for Beginners',
    platform: 'Udemy',
    category: 'Business & Marketing',
    level: 'Beginner',
    duration: '2 hours · 22 lectures',
    durationHours: 2,
    rating: 4.3,
    hasFreeCertificate: false,
    instructor: 'Varun Kumar',
    summary:
      'Get discovered on Google: keyword research, on-page SEO, content structure, link building basics, technical checks and free tooling.',
    howToGetFree:
      'Free on Udemy — you only need free tools (Google Search Console, Google Trends, Ubersuggest free tier).',
    tags: ['seo', 'marketing', 'business', 'google', 'content', 'udemy', 'digital marketing'],
    url: 'https://www.udemy.com/course/seo-tutorial/'
  },
  {
    id: 'udemy-cloud-computing',
    title: 'Introduction to Cloud Computing',
    platform: 'Udemy',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    duration: '1 hour · 12 lectures',
    durationHours: 1,
    rating: 4.4,
    hasFreeCertificate: false,
    instructor: 'Anand Rao Nednur',
    summary:
      'What "the cloud" really means: virtualisation, IaaS/PaaS/SaaS, containers, hypervisors and how AWS, Azure and Google Cloud differ — plus free tiers to practise on.',
    howToGetFree:
      'Free on Udemy; every major cloud provider also gives a permanent free tier with no credit card required for many services.',
    tags: ['cloud', 'cloud computing', 'aws', 'azure', 'devops', 'udemy', 'infrastructure'],
    url: 'https://www.udemy.com/course/introduction-to-cloud-computing/'
  },

  // ---------------------------------------------------------------------------
  // Coursera — free audit mode (lectures free, certificate optional/paid)
  // ---------------------------------------------------------------------------
  {
    id: 'coursera-python-everybody',
    title: 'Programming for Everybody (Getting Started with Python)',
    platform: 'Coursera',
    category: 'Programming',
    level: 'Beginner',
    duration: '7 weeks · 2–3 hrs/wk',
    durationHours: 20,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Dr. Chuck Severance (University of Michigan)',
    summary:
      'The friendliest Python on-ramp there is: what a program is, variables, conditional code, loops, functions — ending with your first working programs.',
    howToGetFree:
      'Click "Enrol for free", then choose "Audit the course" at the bottom of the popup to watch every lecture and read every chapter at $0. Dr. Chuck’s own site (py4e.com) hosts the same materials completely free, with a free certificate option.',
    tags: ['python', 'programming', 'coursera', 'beginner', 'audit', 'chuck'],
    url: 'https://www.coursera.org/learn/python'
  },
  {
    id: 'coursera-crash-course-python',
    title: 'Crash Course on Python (Google Career Certificates)',
    platform: 'Coursera',
    category: 'Programming',
    level: 'Beginner',
    duration: '6 weeks · 4–8 hrs/wk',
    durationHours: 30,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Google Career Certificates',
    summary:
      'Google’s fast-paced Python introduction built for people who want to automate work: strings, lists, dictionaries, loops, functions, classes and error handling.',
    howToGetFree:
      'Audit for free on Coursera (Enrol → "Audit the course"); all videos and readings are unlocked, you only skip graded quizzes/certificate.',
    tags: ['python', 'google', 'automation', 'programming', 'coursera', 'audit', 'crash course'],
    url: 'https://www.coursera.org/learn/python-crash-course'
  },
  {
    id: 'coursera-html-css-js',
    title: 'HTML, CSS, and Javascript for Web Developers (Johns Hopkins)',
    platform: 'Coursera',
    category: 'Web Development',
    level: 'Beginner',
    duration: '5 weeks · 4–6 hrs/wk',
    durationHours: 30,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Yaakov Chaikin (Johns Hopkins University)',
    summary:
      'A rigorous, tooling-first web course: HTML5 semantics, CSS layout (Flexbox/Grid), responsive design, JavaScript, Ajax and a real restaurant-site project.',
    howToGetFree:
      'Free audit mode on Coursera — click Enrol for free → Audit the course. All lecture videos and the full project brief are included.',
    tags: ['html', 'css', 'javascript', 'web development', 'responsive', 'coursera', 'audit', 'ajax'],
    url: 'https://www.coursera.org/learn/html-css-javascript-for-web-developers'
  },
  {
    id: 'coursera-ai-for-everyone',
    title: 'AI For Everyone (DeepLearning.AI)',
    platform: 'Coursera',
    category: 'AI & Machine Learning',
    level: 'Beginner',
    duration: '4 weeks · 2–3 hrs/wk',
    durationHours: 10,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Andrew Ng (DeepLearning.AI)',
    summary:
      'Non-technical AI literacy from Andrew Ng: what machine learning and data science can and cannot do, how to spot AI opportunities, and how to build an AI strategy.',
    howToGetFree:
      'Free audit mode on Coursera (Enrol → Audit the course) — non-technical, so no coding setup needed at all.',
    tags: ['ai', 'artificial intelligence', 'machine learning', 'data science', 'andrew ng', 'coursera', 'audit'],
    url: 'https://www.coursera.org/learn/ai-for-everyone'
  },
  {
    id: 'coursera-ml-specialization',
    title: 'Machine Learning Specialization (Stanford & DeepLearning.AI)',
    platform: 'Coursera',
    category: 'AI & Machine Learning',
    level: 'Beginner',
    duration: '3 courses · ~2 months at 10 hrs/wk',
    durationHours: 60,
    rating: 4.9,
    hasFreeCertificate: false,
    instructor: 'Andrew Ng (Stanford University / DeepLearning.AI)',
    summary:
      'The modern remake of the most famous ML course: supervised learning (regression, classification), advanced learning algorithms (neural nets, decision trees) and unsupervised learning with recommender systems.',
    howToGetFree:
      'Audit each course in the specialization separately for free (open the course, click Enrol → Audit the course) — that unlocks all lectures and labs such as the interactive Python notebooks.',
    tags: ['machine learning', 'ml', 'neural networks', 'deep learning', 'andrew ng', 'python', 'coursera'],
    url: 'https://www.coursera.org/specializations/machine-learning-introduction'
  },
  {
    id: 'coursera-excel-essentials',
    title: 'Excel Skills for Business: Essentials (Macquarie University)',
    platform: 'Coursera',
    category: 'Data Science',
    level: 'Beginner',
    duration: '6 weeks · 2–3 hrs/wk',
    durationHours: 25,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Nicky Bull & Dr Prashan S. M. Karunaratne (Macquarie University)',
    summary:
      'From spreadsheets to real skill: navigation shortcuts, formulas and functions (IF, VLOOKUP, COUNTIF), formatting, charts and PivotTables with downloadable practice workbooks.',
    howToGetFree:
      'Free audit mode on Coursera; Office 365 is free for students, and LibreOffice/Google Sheets are free alternatives that open the practice files.',
    tags: ['excel', 'spreadsheets', 'data analysis', 'pivot tables', 'coursera', 'audit', 'business'],
    url: 'https://www.coursera.org/learn/excel-essentials'
  },
  {
    id: 'coursera-google-ux-design',
    title: 'Google UX Design Professional Certificate',
    platform: 'Coursera',
    category: 'Design & UX',
    level: 'Beginner',
    duration: '7 courses · ~6 months at 10 hrs/wk',
    durationHours: 200,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Google Career Certificates',
    summary:
      'The full UX workflow: user research and personas, wireframes, low/high-fidelity Figma prototypes, usability testing, and portfolio case studies that get interviews.',
    howToGetFree:
      'Audit the individual courses free on Coursera (each course’s Enrol → Audit option). Figma’s free plan covers every design task in the certificate.',
    tags: ['ux', 'ui', 'design', 'figma', 'user research', 'prototyping', 'google', 'coursera', 'portfolio'],
    url: 'https://www.coursera.org/professional-certificates/google-ux-design'
  },
  {
    id: 'coursera-graphic-design',
    title: 'Graphic Design Specialization (CalArts)',
    platform: 'Coursera',
    category: 'Design & UX',
    level: 'Beginner',
    duration: '5 courses · ~5 months at 4 hrs/wk',
    durationHours: 90,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Michael Worthington (California Institute of the Arts)',
    summary:
      'Fundamentals of visual design and typography: image-making, colour and contrast, rhythm, layout systems, and how to give and use design critique.',
    howToGetFree:
      'Audit each course in the specialization free (Enrol → Audit the course). All assignments can be completed with free tools such as GIMP, Inkscape, Figma or Canva.',
    tags: ['graphic design', 'design', 'typography', 'layout', 'calarts', 'coursera', 'audit', 'visual'],
    url: 'https://www.coursera.org/specializations/graphic-design'
  },
  {
    id: 'coursera-introduction-cloud',
    title: 'Introduction to Cloud Computing (IBM)',
    platform: 'Coursera',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    duration: '4 weeks · 2–3 hrs/wk',
    durationHours: 12,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'IBM Skills Network',
    summary:
      'Cloud models, virtualisation, containers and orchestration, cloud storage, security and the differences between public, private and hybrid clouds.',
    howToGetFree:
      'Free audit mode (Enrol → Audit the course) plus a free IBM Skills Network account for the hands-on labs.',
    tags: ['cloud', 'cloud computing', 'devops', 'containers', 'ibm', 'coursera', 'audit', 'it'],
    url: 'https://www.coursera.org/learn/introduction-to-cloud'
  },
  {
    id: 'coursera-learning-how-to-learn',
    title: 'Learning How to Learn: Powerful mental tools',
    platform: 'Coursera',
    category: 'Career & Learning',
    level: 'Beginner',
    duration: '4 weeks · 3–4 hrs/wk',
    durationHours: 15,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Dr. Barbara Oakley & Dr. Terrence Sejnowski',
    summary:
      'The most popular online course ever: focused and diffuse thinking, chunking, memory techniques, procrastination fixes and test strategies — useful before every other course on this list.',
    howToGetFree:
      'Free audit mode on Coursera (Enrol → Audit the course); the companion site and podcast are free too.',
    tags: ['study skills', 'learning', 'productivity', 'memory', 'coursera', 'audit', 'career', 'learn'],
    url: 'https://www.coursera.org/learn/learning-how-to-learn'
  },
  {
    id: 'coursera-google-digital-marketing',
    title: 'Google Digital Marketing & E-commerce Professional Certificate',
    platform: 'Coursera',
    category: 'Business & Marketing',
    level: 'Beginner',
    duration: '7 courses · ~6 months at 10 hrs/wk',
    durationHours: 180,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Google Career Certificates',
    summary:
      'End-to-end digital marketing: email campaigns, social media, SEO/SEM, analytics, advertising and running a real e-commerce storefront project.',
    howToGetFree:
      'Audit the individual courses for free on Coursera — plus Google Skillshop gives free official Google Ads and Analytics certificates alongside it.',
    tags: ['digital marketing', 'marketing', 'e-commerce', 'seo', 'social media', 'google', 'business', 'coursera'],
    url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce'
  },

  // ---------------------------------------------------------------------------
  // Kaggle Learn (free, instant completion certificates/badges)
  // ---------------------------------------------------------------------------
  {
    id: 'kaggle-python',
    title: 'Kaggle Learn: Python',
    platform: 'Kaggle Learn',
    category: 'Programming',
    level: 'Beginner',
    duration: '5 hours · 7 lessons',
    durationHours: 5,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'Colin Morris (Kaggle / Google)',
    summary:
      'Learn Python by doing: a fast, browser-based tour of syntax, functions, booleans, conditionals, loops, lists, dictionaries and external libraries.',
    howToGetFree:
      'Sign in with a free Kaggle account and finish the exercises — you immediately get a free Kaggle certificate (and free notebooks + datasets).',
    tags: ['python', 'programming', 'kaggle', 'data science', 'certificate', 'beginner', 'exercises'],
    url: 'https://www.kaggle.com/learn/python'
  },
  {
    id: 'kaggle-pandas',
    title: 'Kaggle Learn: Pandas',
    platform: 'Kaggle Learn',
    category: 'Data Science',
    level: 'Beginner',
    duration: '4 hours · 6 lessons',
    durationHours: 4,
    rating: 4.8,
    hasFreeCertificate: true,
    instructor: 'Aleksey Bilogur (Kaggle / Google)',
    summary:
      'The single most useful data-science skill: creating, reading and selecting data, indexing, grouping, sorting, renaming and combining DataFrames.',
    howToGetFree:
      'Free Kaggle account → complete the interactive exercise notebooks → free certificate issued instantly.',
    tags: ['pandas', 'python', 'data science', 'dataframe', 'data analysis', 'kaggle', 'certificate'],
    url: 'https://www.kaggle.com/learn/pandas'
  },
  {
    id: 'kaggle-intro-to-sql',
    title: 'Kaggle Learn: Intro to SQL',
    platform: 'Kaggle Learn',
    category: 'Data Science',
    level: 'Beginner',
    duration: '3 hours · 6 lessons',
    durationHours: 3,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'Rachael Tatman (Kaggle / Google)',
    summary:
      'Go from zero to writing real queries on BigQuery: SELECT, WHERE, GROUP BY, HAVING, COUNT, AS, ORDER BY and dates — all in the browser.',
    howToGetFree:
      'Free with a Kaggle account — the BigQuery sandbox used in the course is also free for learners.',
    tags: ['sql', 'bigquery', 'database', 'data science', 'kaggle', 'certificate', 'queries'],
    url: 'https://www.kaggle.com/learn/intro-to-sql'
  },
  {
    id: 'kaggle-intro-to-machine-learning',
    title: 'Kaggle Learn: Intro to Machine Learning',
    platform: 'Kaggle Learn',
    category: 'AI & Machine Learning',
    level: 'Beginner',
    duration: '3 hours · 7 lessons',
    durationHours: 3,
    rating: 4.8,
    hasFreeCertificate: true,
    instructor: 'Dan Becker (Kaggle / Google)',
    summary:
      'Build your first models with scikit-learn: decision trees and random forests, train/validation split, overfitting and underfitting, and submitting to a Kaggle competition.',
    howToGetFree:
      'Free Kaggle account → finish the notebooks → free certificate, plus a real leaderboard submission for your portfolio.',
    tags: ['machine learning', 'ml', 'scikit-learn', 'random forest', 'kaggle', 'ai', 'certificate'],
    url: 'https://www.kaggle.com/learn/intro-to-machine-learning'
  },
  {
    id: 'kaggle-intro-to-deep-learning',
    title: 'Kaggle Learn: Intro to Deep Learning',
    platform: 'Kaggle Learn',
    category: 'AI & Machine Learning',
    level: 'Intermediate',
    duration: '4 hours · 6 lessons',
    durationHours: 4,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'Ryan Holbrook (Kaggle / Google)',
    summary:
      'Neural networks from first principles with Keras: layers, activation functions, stochastic gradient descent, overfitting/underfitting and dropout — trained on free GPU/TPU notebooks.',
    howToGetFree:
      'Free Kaggle account; the GPUs/TPUs used for training in the course are included free for the notebook exercises.',
    tags: ['deep learning', 'neural networks', 'keras', 'tensorflow', 'gpu', 'kaggle', 'certificate', 'ai'],
    url: 'https://www.kaggle.com/learn/intro-to-deep-learning'
  },

  // ---------------------------------------------------------------------------
  // Google Skillshop (official Google certificates, always free)
  // ---------------------------------------------------------------------------
  {
    id: 'skillshop-google-analytics',
    title: 'Google Analytics Certification (GA4)',
    platform: 'Google Skillshop',
    category: 'Business & Marketing',
    level: 'Beginner',
    duration: '~8 hours study + exam',
    durationHours: 8,
    rating: 4.6,
    hasFreeCertificate: true,
    instructor: 'Google',
    summary:
      'Learn GA4 measurement: properties and data streams, events and conversions, reports and explorations, audiences, and integrating Analytics with Google Ads.',
    howToGetFree:
      'Skillshop is Google’s own free training platform: study the modules and pass the exam with a Google account. The certificate is free (and renews every 12 months).',
    tags: ['google analytics', 'ga4', 'analytics', 'marketing', 'data', 'certificate', 'google', 'free certificate'],
    url: 'https://skillshop.withgoogle.com/googleanalytics'
  },
  {
    id: 'skillshop-google-ads-search',
    title: 'Google Ads Search Certification',
    platform: 'Google Skillshop',
    category: 'Business & Marketing',
    level: 'Beginner',
    duration: '~6 hours study + exam',
    durationHours: 6,
    rating: 4.6,
    hasFreeCertificate: true,
    instructor: 'Google',
    summary:
      'Run search campaigns properly: keyword and negative-keyword research, ad copy and assets, Quality Score, bidding strategies and measuring conversions.',
    howToGetFree:
      'Free official certification through Google Skillshop — no course fee and no exam fee, just a Google account.',
    tags: ['google ads', 'google adwords', 'ppc', 'marketing', 'certificate', 'google', 'advertising'],
    url: 'https://skillshop.withgoogle.com/google-ads/search'
  },

  // ---------------------------------------------------------------------------
  // HubSpot Academy (free courses + free certifications)
  // ---------------------------------------------------------------------------
  {
    id: 'hubspot-digital-marketing',
    title: 'HubSpot Digital Marketing Certification',
    platform: 'HubSpot Academy',
    category: 'Business & Marketing',
    level: 'Beginner',
    duration: '6 hours · 1 certification',
    durationHours: 6,
    rating: 4.6,
    hasFreeCertificate: true,
    instructor: 'HubSpot Academy',
    summary:
      'A full digital marketing foundation: content creation frameworks, SEO, social media, email and paid search campaigns — with worksheets to apply it to your own business.',
    howToGetFree:
      'Create a free HubSpot Academy account, complete the quizzes and claim the globally recognised free certificate for LinkedIn.',
    tags: ['digital marketing', 'marketing', 'seo', 'email marketing', 'social media', 'certificate', 'hubspot'],
    url: 'https://academy.hubspot.com/courses/digital-marketing'
  },
  {
    id: 'hubspot-inbound-marketing',
    title: 'Inbound Marketing Certification',
    platform: 'HubSpot Academy',
    category: 'Business & Marketing',
    level: 'Beginner',
    duration: '5 hours · 1 certification',
    durationHours: 5,
    rating: 4.6,
    hasFreeCertificate: true,
    instructor: 'HubSpot Academy',
    summary:
      'The inbound methodology: buyer personas and journeys, content that attracts instead of interrupts, lead nurturing, marketing automation and attribution reporting.',
    howToGetFree:
      'Free forever with a HubSpot Academy account — 100% of the lessons, quizzes and certificate are $0.',
    tags: ['marketing', 'inbound marketing', 'content marketing', 'lead generation', 'certificate', 'hubspot', 'business'],
    url: 'https://academy.hubspot.com/courses/inbound-marketing'
  },

  // ---------------------------------------------------------------------------
  // Cisco Networking Academy (free courses + free digital badges)
  // ---------------------------------------------------------------------------
  {
    id: 'cisco-introduction-cybersecurity',
    title: 'Introduction to Cybersecurity',
    platform: 'Cisco NetAcad',
    category: 'Cybersecurity',
    level: 'Beginner',
    duration: '6 hours · self-paced',
    durationHours: 6,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'Cisco Networking Academy',
    summary:
      'Understand today’s threat landscape: malware, phishing, network attacks, the CIA triad, and the security roles and certifications that exist in the industry.',
    howToGetFree:
      'Enrol free in Cisco Networking Academy’s self-paced course and earn a free Cisco digital badge you can share on LinkedIn.',
    tags: ['cybersecurity', 'security', 'cisco', 'networking', 'certificate', 'badge', 'beginner'],
    url: 'https://www.netacad.com/courses/introduction-to-cybersecurity'
  },
  {
    id: 'cisco-cybersecurity-essentials',
    title: 'Cybersecurity Essentials',
    platform: 'Cisco NetAcad',
    category: 'Cybersecurity',
    level: 'Intermediate',
    duration: '30 hours · self-paced',
    durationHours: 30,
    rating: 4.6,
    hasFreeCertificate: true,
    instructor: 'Cisco Networking Academy',
    summary:
      'Deeper defensive skills: cryptography and PKI, access control, firewalls, VPNs, endpoint and server hardening, and how security operations detect and respond to incidents.',
    howToGetFree:
      'Free self-paced enrolment on NetAcad with a free Cisco digital badge on completion.',
    tags: ['cybersecurity', 'security', 'cryptography', 'firewalls', 'networking', 'cisco', 'badge'],
    url: 'https://www.netacad.com/courses/cybersecurity-essentials'
  },
  {
    id: 'cisco-networking-basics',
    title: 'Networking Basics',
    platform: 'Cisco NetAcad',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    duration: '22 hours · self-paced',
    durationHours: 22,
    rating: 4.6,
    hasFreeCertificate: true,
    instructor: 'Cisco Networking Academy',
    summary:
      'How the internet actually works: network types and topologies, IPv4/IPv6 addressing, Ethernet and wireless, routers and switches, and basic troubleshooting.',
    howToGetFree:
      'Free self-paced course on Cisco NetAcad with free virtual lab environments and a shareable digital badge.',
    tags: ['networking', 'cisco', 'tcp/ip', 'ip addressing', 'routers', 'switches', 'badge', 'infrastructure'],
    url: 'https://www.netacad.com/courses/networking-basics'
  },
  {
    id: 'cisco-python-essentials-1',
    title: 'Python Essentials 1',
    platform: 'Cisco NetAcad',
    category: 'Programming',
    level: 'Beginner',
    duration: '40 hours · self-paced',
    durationHours: 40,
    rating: 4.7,
    hasFreeCertificate: true,
    instructor: 'Cisco Networking Academy & OpenEDG Python Institute',
    summary:
      'Structured Python foundations — data types, control flow, functions, collections and exception handling — aligned to the PCEP entry-level Python certification.',
    howToGetFree:
      'Self-paced enrolment is free on NetAcad and includes free labs plus a free digital badge (the optional PCEP exam voucher is what costs money).',
    tags: ['python', 'programming', 'cisco', 'pcep', 'badge', 'coding', 'beginner'],
    url: 'https://www.netacad.com/courses/python-essentials-1'
  },

  // ---------------------------------------------------------------------------
  // edX (free audit on every course)
  // ---------------------------------------------------------------------------
  {
    id: 'edx-introduction-to-linux',
    title: 'Introduction to Linux (LinuxFoundationX)',
    platform: 'edX',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    duration: '14 weeks · 5–8 hrs/wk',
    durationHours: 90,
    rating: 4.6,
    hasFreeCertificate: false,
    instructor: 'The Linux Foundation',
    summary:
      'The most in-demand DevOps prerequisite: the Linux file system, permissions, users and groups, processes, networking, package management and shell scripting.',
    howToGetFree:
      'Audit the course free on edX (audit access unlocks all videos and readings). Practise in a free Ubuntu VM or WSL, and use the free Linux Foundation training library for extra material.',
    tags: ['linux', 'devops', 'shell', 'bash', 'sysadmin', 'edx', 'audit', 'cloud'],
    url: 'https://www.edx.org/course/introduction-to-linux'
  },

  // ---------------------------------------------------------------------------
  // The Odin Project & Full Stack Open (complete, free, project-based)
  // ---------------------------------------------------------------------------
  {
    id: 'odin-foundations',
    title: 'The Odin Project: Foundations',
    platform: 'The Odin Project',
    category: 'Web Development',
    level: 'Beginner',
    duration: '~100–150 hours · self-paced',
    durationHours: 120,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'The Odin Project community',
    summary:
      'A hands-on start to web development: how the web works, Git and GitHub, HTML, CSS, Flexbox, JavaScript basics, DOM manipulation and your first deployed projects.',
    howToGetFree:
      'The entire curriculum is free and open source at theodinproject.com — you only need free tools (VS Code, Git, GitHub, GitHub Pages for hosting).',
    tags: ['web development', 'odin', 'html', 'css', 'javascript', 'git', 'foundations', 'beginner'],
    url: 'https://www.theodinproject.com/paths/foundations'
  },
  {
    id: 'odin-full-stack-javascript',
    title: 'The Odin Project: Full Stack JavaScript',
    platform: 'The Odin Project',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '~900 hours · self-paced',
    durationHours: 900,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'The Odin Project community',
    summary:
      'A complete job-ready JavaScript path: advanced JS, React, Node.js/Express, databases, REST and GraphQL APIs, testing, security and your own full-stack portfolio project.',
    howToGetFree:
      'Free curriculum at theodinproject.com; every tool and hosting choice in the path has a free tier, and the Discord community is free too.',
    tags: ['fullstack', 'javascript', 'node', 'express', 'react', 'portfolio', 'web development', 'odin'],
    url: 'https://www.theodinproject.com/paths/full-stack-javascript'
  },
  {
    id: 'full-stack-open',
    title: 'Full Stack Open (University of Helsinki)',
    platform: 'Full Stack Open',
    category: 'Web Development',
    level: 'Advanced',
    duration: '14 parts · 5–20 hrs per part',
    durationHours: 300,
    rating: 4.9,
    hasFreeCertificate: true,
    instructor: 'University of Helsinki (Prof. Matti Luukkainen & team)',
    summary:
      'Modern full-stack engineering: React, Node.js, Express, MongoDB, testing, GraphQL, TypeScript, CI/CD, containers and relational databases — the same materials as the university course.',
    howToGetFree:
      'Entirely free at fullstackopen.com/en, including automatic exercise checking, an active free Discord/Helsinki MOOC community, and a free certificate after you complete the required parts.',
    tags: ['fullstack', 'react', 'node', 'graphql', 'typescript', 'docker', 'devops', 'helsinki', 'certificate'],
    url: 'https://fullstackopen.com/en/'
  },

  // ---------------------------------------------------------------------------
  // Khan Academy (free math & finance foundations)
  // ---------------------------------------------------------------------------
  {
    id: 'khan-linear-algebra',
    title: 'Khan Academy: Linear Algebra',
    platform: 'Khan Academy',
    category: 'Math & Foundations',
    level: 'Beginner',
    duration: '~30 hours · self-paced',
    durationHours: 30,
    rating: 4.7,
    hasFreeCertificate: false,
    instructor: 'Khan Academy',
    summary:
      'Vectors, matrices, linear transformations, determinants, eigenvalues and eigenvectors explained visually — the intuition you need before studying machine learning.',
    howToGetFree:
      'Khan Academy is a non-profit: every video, exercise and mastery test is free with a free account, and always will be.',
    tags: ['linear algebra', 'math', 'vectors', 'matrices', 'machine learning', 'khan academy', 'foundations'],
    url: 'https://www.khanacademy.org/math/linear-algebra'
  },
  {
    id: 'khan-statistics-probability',
    title: 'Khan Academy: Statistics and Probability',
    platform: 'Khan Academy',
    category: 'Math & Foundations',
    level: 'Beginner',
    duration: '~40 hours · self-paced',
    durationHours: 40,
    rating: 4.7,
    hasFreeCertificate: false,
    instructor: 'Khan Academy',
    summary:
      'Statistics for data work: analysing categorical and quantitative data, probability distributions, sampling, confidence intervals, significance tests and inference.',
    howToGetFree:
      'Free forever at khanacademy.org — includes practice exercises with instant feedback and unit mastery tracking.',
    tags: ['statistics', 'probability', 'math', 'data science', 'hypothesis testing', 'khan academy'],
    url: 'https://www.khanacademy.org/math/statistics-probability'
  },
  {
    id: 'khan-calculus-1',
    title: 'Khan Academy: Calculus 1',
    platform: 'Khan Academy',
    category: 'Math & Foundations',
    level: 'Intermediate',
    duration: '~60 hours · self-paced',
    durationHours: 60,
    rating: 4.7,
    hasFreeCertificate: false,
    instructor: 'Khan Academy',
    summary:
      'Limits and continuity, derivatives and their applications, integrals and the fundamental theorem of calculus — the prerequisite for optimisation and deep learning math.',
    howToGetFree:
      'Free with a Khan Academy account, including full worked examples and the AP Calculus AB practice set.',
    tags: ['calculus', 'math', 'derivatives', 'integrals', 'limits', 'machine learning', 'khan academy'],
    url: 'https://www.khanacademy.org/math/calculus-1'
  },
  {
    id: 'khan-personal-finance',
    title: 'Khan Academy: Personal Finance',
    platform: 'Khan Academy',
    category: 'Business & Marketing',
    level: 'Beginner',
    duration: '~15 hours · self-paced',
    durationHours: 15,
    rating: 4.7,
    hasFreeCertificate: false,
    instructor: 'Khan Academy',
    summary:
      'Money that actually matters: budgeting and saving, interest and debt, investing basics including index funds, taxes, insurance and scams to avoid.',
    howToGetFree:
      'Free at khanacademy.org (in partnership with a non-profit financial education fund) — no paywall, no upsells.',
    tags: ['personal finance', 'money', 'investing', 'budgeting', 'finance', 'khan academy', 'business'],
    url: 'https://www.khanacademy.org/college-careers-more/personal-finance'
  },

  // ---------------------------------------------------------------------------
  // YouTube full courses (free forever, ad-supported)
  // ---------------------------------------------------------------------------
  {
    id: 'youtube-sql-full-course',
    title: 'SQL Tutorial – Full Database Course for Beginners',
    platform: 'YouTube',
    category: 'Data Science',
    level: 'Beginner',
    duration: '4.3 hours · single video',
    durationHours: 4.3,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'Mike Dane (freeCodeCamp.org channel)',
    summary:
      'A complete, watch-in-one-sitting SQL course: installing MySQL, creating tables, keys, functions, wildcards, unions, joins, nested queries and triggers.',
    howToGetFree:
      'Watch free on YouTube — MySQL, the database used throughout, is also completely free and open source.',
    tags: ['sql', 'mysql', 'database', 'youtube', 'freecodecamp', 'queries', 'data'],
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY'
  },
  {
    id: 'youtube-cs50-lectures',
    title: 'Harvard CS50 – Full Lectures on YouTube',
    platform: 'YouTube',
    category: 'Programming',
    level: 'Beginner',
    duration: 'Playlists · 25+ hours',
    durationHours: 25,
    rating: 4.9,
    hasFreeCertificate: false,
    instructor: 'Prof. David J. Malan (Harvard University)',
    summary:
      'Subscribe to CS50’s channel to watch the newest CS50x, CS50P, CS50W and CS50 AI lectures as they are published each year — the same lectures as the official course.',
    howToGetFree:
      'Free on YouTube with no account required; pair it with cs50.harvard.edu if you want the problem sets and the free certificate.',
    tags: ['cs50', 'harvard', 'computer science', 'youtube', 'lectures', 'python', 'programming'],
    url: 'https://www.youtube.com/@cs50'
  },
  {
    id: 'youtube-mit-ocw',
    title: 'MIT OpenCourseWare on YouTube',
    platform: 'YouTube',
    category: 'Math & Foundations',
    level: 'Advanced',
    duration: 'Thousands of free lectures',
    durationHours: 50,
    rating: 4.9,
    hasFreeCertificate: false,
    instructor: 'MIT faculty',
    summary:
      'The full catalogue of MIT lectures on YouTube — algorithms, linear algebra, calculus, physics, AI and more — often easier to browse than the OCW site.',
    howToGetFree:
      'Free on YouTube; ocw.mit.edu adds the problem sets and exams for each course at no cost.',
    tags: ['mit', 'ocw', 'lectures', 'math', 'algorithms', 'youtube', 'computer science'],
    url: 'https://www.youtube.com/@mitocw'
  },
  {
    id: 'youtube-freecodecamp',
    title: 'freeCodeCamp.org YouTube Channel – Full Courses',
    platform: 'YouTube',
    category: 'Programming',
    level: 'Beginner',
    duration: 'Hundreds of multi-hour courses',
    durationHours: 12,
    rating: 4.8,
    hasFreeCertificate: false,
    instructor: 'freeCodeCamp.org and guest instructors',
    summary:
      'Full-length free courses on Python, JavaScript, React, SQL, Docker, machine learning and more — typically 4–20 hours each, uploaded weekly.',
    howToGetFree:
      'Free on YouTube; freecodecamp.org/learn adds the interactive curriculum and the free certifications that go with it.',
    tags: ['freecodecamp', 'youtube', 'full course', 'python', 'javascript', 'programming', 'web development'],
    url: 'https://www.youtube.com/@freecodecamp'
  }
];

module.exports = { COURSES };
