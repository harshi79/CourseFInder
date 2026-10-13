/**
 * Step-by-step $0 learning roadmaps.
 *
 * Step `courseId` values are resolved against `src/data/courses.js` at load
 * time, so a roadmap can never point at a course that does not exist (and a
 * typo fails loudly in `npm test` instead of silently rendering a "#" link).
 *
 * Schema — used by `src/bot/engine.js`, `/api/roadmaps` and `public/app.js`:
 *   id            {string}    used by `/roadmap <id>`
 *   title         {string}
 *   description   {string}
 *   estimatedTime {string}
 *   keywords      {string[]}  extra matcher terms for natural-language queries
 *   steps         {object[]}  { step, phase, courseId, courseTitle, why }
 */

const { COURSES } = require('./courses');

/**
 * Turns [phase, courseId, why] tuples into fully hydrated roadmap steps.
 */
function buildSteps(entries) {
  return entries.map(([phase, courseId, why], index) => {
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) {
      throw new Error(
        `ROADMAPS is out of sync: courseId "${courseId}" (step ${index + 1}) is not in COURSES`
      );
    }
    return {
      step: index + 1,
      phase,
      courseId,
      courseTitle: course.title,
      why
    };
  });
}

const ROADMAPS = [
  {
    id: 'web-dev',
    title: 'Full-Stack Web Development (Zero to Job-Ready)',
    description:
      'The order to do things in: HTML/CSS → JavaScript → a front-end library → the back end and databases → a deployed portfolio. Every step is free, and you build real projects instead of watching endless tutorials.',
    estimatedTime: '9–12 months at 10 hrs/week',
    keywords: ['web', 'web development', 'webdev', 'frontend', 'front end', 'fullstack', 'full stack', 'html', 'css', 'javascript', 'react', 'node', 'website'],
    steps: buildSteps([
      [
        'Build your first real page',
        'fcc-responsive-web-design',
        'Learn HTML, CSS, Flexbox and Grid by shipping 5 graded projects — no setup, everything runs in the browser.'
      ],
      [
        'Learn JavaScript properly',
        'fcc-javascript',
        'This is the step most self-taught developers rush. Algorithms + DOM + OOP here make React easy later.'
      ],
      [
        'Follow a structured curriculum',
        'odin-foundations',
        'A project-based checklist that turns the pieces into real, deployed websites and teaches Git along the way.'
      ],
      [
        'Add React and modern tooling',
        'fcc-front-end-libraries',
        'Bootstrap, Sass, React and Redux — the exact stack most junior front-end job ads list.'
      ],
      [
        'Build the back end',
        'fcc-back-end-apis',
        'Node.js, Express, MongoDB and REST APIs: now you can build a complete full-stack app, not just a page.'
      ],
      [
        'Go deep and get the free certificate',
        'full-stack-open',
        'University-grade GraphQL, TypeScript, testing, CI/CD and Docker — plus a free certificate from the University of Helsinki.'
      ]
    ])
  },
  {
    id: 'python-ai',
    title: 'Python & AI/ML (From Scratch to Neural Networks)',
    description:
      'Start with Python fundamentals, move to real programming practice, then machine learning and finally deep learning — the same path a computer science degree takes, minus the tuition.',
    estimatedTime: '6–9 months at 8 hrs/week',
    keywords: ['python', 'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural networks', 'data science', 'automation', 'py'],
    steps: buildSteps([
      [
        'Get the syntax down fast',
        'udemy-python-intro',
        'A 90-minute free course that gets you writing scripts today so the real course feels comfortable.'
      ],
      [
        'Learn Python the rigorous way',
        'cs50p',
        'CS50P covers functions, exceptions, unit tests, regex, OOP and file I/O — and awards a free CS50 certificate.'
      ],
      [
        'Practise on graded problems',
        'fcc-python',
        'Ten build-along projects force you to actually write code instead of watching it, ending in a free certification.'
      ],
      [
        'Understand why models work',
        'cs50ai',
        'Real AI projects: search, minimax, Bayesian networks, optimisation and NLP — the theory behind the hype.'
      ],
      [
        'Train your first models',
        'kaggle-intro-to-machine-learning',
        'scikit-learn decision trees and random forests in 3 hours, with free GPU notebooks and a free badge.'
      ],
      [
        'Go deep with TensorFlow',
        'fcc-machine-learning-python',
        'Neural networks, image classification, NLP and reinforcement learning — finished with a free freeCodeCamp certificate.'
      ]
    ])
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics (Python, SQL, Statistics)',
    description:
      'The practical analyst/data-scientist toolkit: Python, Pandas, SQL, statistics and visualisation — with portfolio projects on real datasets you can host for free.',
    estimatedTime: '5–8 months at 8 hrs/week',
    keywords: ['data', 'data science', 'data analysis', 'analytics', 'sql', 'pandas', 'statistics', 'excel', 'business intelligence', 'bi'],
    steps: buildSteps([
      [
        'Spreadsheet fundamentals',
        'udemy-excel-beginners',
        'Most entry-level analyst jobs still run on Excel — PivotTables, lookups and charts in one 9.5-hour free course.'
      ],
      [
        'Python for data',
        'kaggle-python',
        'A 5-hour, exercise-first Python course designed specifically for data work, with an instant free certificate.'
      ],
      [
        'Query real databases',
        'udemy-sql-querying',
        'SQL is the single most requested analyst skill: SELECT, JOIN, GROUP BY and sub-queries from scratch.'
      ],
      [
        'Master Pandas',
        'kaggle-pandas',
        'DataFrames are where 90% of data analysis happens — indexing, grouping, merging and reshaping, free.'
      ],
      [
        'Statistics you can defend',
        'khan-statistics-probability',
        'Distributions, sampling, confidence intervals and significance testing so your conclusions survive a skeptical manager.'
      ],
      [
        'Prove it with a project',
        'fcc-data-analysis-python',
        'Clean, analyse and visualise real demographic data with NumPy, Pandas, Matplotlib and Seaborn, and claim the free certificate.'
      ]
    ])
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Ethical Hacking ($0 Path)',
    description:
      'Understand how attacks work, then how to defend against them: security fundamentals, networking, cryptography, secure development and legal hands-on practice.',
    estimatedTime: '6–10 months at 8 hrs/week',
    keywords: ['cybersecurity', 'cyber', 'security', 'hacking', 'ethical hacking', 'pentesting', 'penetration testing', 'networking', 'infosec', 'kali'],
    steps: buildSteps([
      [
        'Understand the threat landscape',
        'cisco-introduction-cybersecurity',
        'A free 6-hour Cisco NetAcad course with a shareable digital badge — the perfect day-one start.'
      ],
      [
        'Get the attacker mindset',
        'udemy-cyber-security-beginners',
        'Malware, phishing, network attacks and defensive basics explained without jargon.'
      ],
      [
        'Learn how networks actually work',
        'cisco-networking-basics',
        'You cannot secure what you do not understand: TCP/IP, addressing, routing, switching and free virtual labs.'
      ],
      [
        'Defensive security in depth',
        'cisco-cybersecurity-essentials',
        'Cryptography/PKI, access control, firewalls, VPNs, hardening and incident response — another free Cisco badge.'
      ],
      [
        'Learn to build secure apps',
        'fcc-information-security',
        'Hands-on secure web development: hashing, encryption, authentication and five security projects with a free certificate.'
      ],
      [
        'Legal hands-on practice',
        'udemy-kali-ethical-hacking',
        'Kali Linux and the pentest workflow in a free VM — practise on your own lab machines or free CTF rooms only.'
      ]
    ])
  },
  {
    id: 'ui-ux',
    title: 'UI/UX & Product Design ($0 Portfolio Path)',
    description:
      'Design skills that get you hired: visual design fundamentals, typography and layout, user research, Figma prototyping and usability testing — all free, all portfolio-based.',
    estimatedTime: '4–6 months at 8 hrs/week',
    keywords: ['design', 'ui', 'ux', 'ui/ux', 'product design', 'figma', 'graphic design', 'typography', 'user experience', 'web design', 'prototyping'],
    steps: buildSteps([
      [
        'The design rules developers skip',
        'udemy-web-design',
        'Spacing, colour, typography and layout from a best-selling instructor — 4 hours that instantly improve everything you build.'
      ],
      [
        'Build and ship real pages',
        'fcc-responsive-web-design',
        'Designers who can build their own ideas are far more employable; five free certification projects make it concrete.'
      ],
      [
        'Visual design foundations',
        'coursera-graphic-design',
        'CalArts’ image-making, colour, contrast, rhythm and layout systems, free in Coursera audit mode.'
      ],
      [
        'The full UX workflow',
        'coursera-google-ux-design',
        'Research, personas, wireframes, Figma prototypes, usability testing and portfolio case studies — audit each course free.'
      ],
      [
        'Add interactive UI skills',
        'fcc-front-end-libraries',
        'React, Bootstrap and Sass let you hand developers (or build yourself) responsive, animation-ready interfaces.'
      ]
    ])
  },
  {
    id: 'business',
    title: 'Digital Marketing & Business (Free Certifications)',
    description:
      'The marketing stack employers ask for: inbound and content marketing, SEO, paid ads and analytics — finished with official free certifications from Google and HubSpot.',
    estimatedTime: '3–5 months at 6 hrs/week',
    keywords: ['business', 'marketing', 'digital marketing', 'seo', 'content marketing', 'ads', 'analytics', 'entrepreneurship', 'startup', 'sales', 'ecommerce'],
    steps: buildSteps([
      [
        'Learn the inbound way',
        'hubspot-inbound-marketing',
        'Personas, buyer journeys and content that attracts customers — with a free, globally recognised certificate.'
      ],
      [
        'Cover the full marketing mix',
        'hubspot-digital-marketing',
        'Content, social, email and paid search in one certification, plus free worksheets to apply it to your own project.'
      ],
      [
        'Win organic traffic',
        'udemy-seo-beginners',
        'Keyword research, on-page SEO and technical basics using free tools only.'
      ],
      [
        'Measure what works',
        'skillshop-google-analytics',
        'GA4 is the measurement standard — Google’s own certification is free and employers list it by name.'
      ],
      [
        'Run profitable ads',
        'skillshop-google-ads-search',
        'Keyword and negative-keyword strategy, ad assets, Quality Score and conversion tracking — official Google certificate at $0.'
      ],
      [
        'Build a business skill stack',
        'khan-personal-finance',
        'Budgeting, interest, investing and tax basics so you can run your own thing or advise a company credibly.'
      ]
    ])
  }
];

module.exports = { ROADMAPS };
