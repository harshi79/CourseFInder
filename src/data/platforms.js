/**
 * Platform playbooks ("where free courses actually live") and the pre-filtered
 * $0 deep-link builder used by the bot, the REST API and the web UI.
 *
 * ⚠️ Keep this file committed: `.gitignore` used to ignore `data/` anywhere in
 * the tree, which silently dropped `src/data/` and crashed the Botkeep deploy.
 *
 * Guide schema — used by `src/bot/engine.js` and `public/app.js`:
 *   id               {string}  lowercase key, should match `PLATFORM_ALIASES`
 *                              in `src/services/search.js` so plain-English
 *                              queries like "free harvard courses" work
 *   name             {string}  must match `COURSES[].platform` values
 *   badge            {string}  short label, e.g. "University giant"
 *   bestFor          {string}
 *   freeCertificates {string}
 *   proTip           {string}  the time-saving shortcut
 *   howItWorks       {string[]} 3–5 concrete steps
 *   portalUrl        {string}
 */

const PLATFORM_GUIDES = [
  {
    id: 'udemy',
    name: 'Udemy',
    badge: 'Hidden free vault',
    bestFor: 'Fast, practical 2–10 hour skill courses you can finish this week.',
    freeCertificates:
      'No — free courses never include certificates (and any "free certificate" site asking for your card is a scam).',
    proTip:
      'Never browse the homepage. Go straight to udemy.com/courses/free/ or add ?price=price-free&sort=highest-rated to any search so only $0 courses show.',
    howItWorks: [
      'Open udemy.com/courses/search/?price=price-free&q=YOUR_TOPIC&sort=highest-rated — the price filter is already applied.',
      'Sort by Highest Rated and check the "Last updated" date so you are not learning a dead framework.',
      'Enrol with a normal free account — no card, no trial. Free courses stay in your library forever.',
      'Instructors also hand out 100%-off coupons on X/Twitter, LinkedIn and free coupon subreddits within 24–48 hours of launch.',
      'Ignore "Udemy free coupon" sites that ask you to install extensions or enter payment details — the official free catalogue is enough.',
    ],
    portalUrl: 'https://www.udemy.com/courses/free/'
  },
  {
    id: 'coursera',
    name: 'Coursera',
    badge: 'University giant',
    bestFor: 'Structured university and Google/IBM/Meta certificate content.',
    freeCertificates:
      'Certificate is paid (or free via financial aid), but 100% of the lecture videos are free in Audit mode.',
    proTip:
      'On the course page click "Enrol for free" then pick "Audit the course" at the very bottom of the popup — that unlocks every video and reading at $0.',
    howItWorks: [
      'Search the topic, then open an individual COURSE page (not the Specialization page — audit is hidden there).',
      'Click Enrol for free → Audit the course. You now have full lecture access for as long as you want.',
      'Need graded assignments too? Apply for Coursera Financial Aid — approval takes ~15 days and is genuinely free.',
      'Prefer always-free certificates? Use Coursera’s partners that link to free platforms (e.g. Google → Skillshop, DeepLearning.AI → their own site).',
      'Download the Coursera mobile app and download lectures while on Wi-Fi to save data.',
    ],
    portalUrl: 'https://www.coursera.org/'
  },
  {
    id: 'edx',
    name: 'edX',
    badge: 'Free audit, real universities',
    bestFor: 'MIT, Harvard, Berkeley and Linux Foundation courses with real problem sets.',
    freeCertificates:
      'Certificate is paid, but audit access to lectures, labs and readings is free forever.',
    proTip:
      'Every edX course has an Audit option at the bottom of the enrol dialog — you keep full access for the course duration (usually 1 year+).',
    howItWorks: [
      'Filter edX search to "Course" and check the "Free"/Audit availability note on each course page.',
      'Click Enroll, then choose Audit this course (not the Verified track).',
      'Some courses show a countdown — audit access stays open for the whole run plus a long grace period.',
      'For CS50 specifically, use cs50.harvard.edu instead: the same lectures, the problem sets, and a genuinely free certificate.',
      'Use the free edX mobile app to download videos for offline study.',
    ],
    portalUrl: 'https://www.edx.org/'
  },
  {
    id: 'harvard',
    name: 'Harvard CS50',
    badge: 'Free certificate',
    bestFor: 'The best-produced computer science courses on the internet (CS50x, CS50P, CS50W, CS50 AI, CS50 SQL).',
    freeCertificates:
      'YES — complete the problem sets and final project on cs50.harvard.edu and CS50 issues you a free certificate (edX verified certs are separate and paid).',
    proTip:
      'Skip edX entirely: watch and submit everything at cs50.harvard.edu to get the same lectures plus the free certificate.',
    howItWorks: [
      'Pick your course: cs50.harvard.edu/x (CS50x), /python (CS50P), /web (CS50W), /ai (CS50 AI), /sql (CS50 SQL).',
      'Use CS50.dev — the free cloud VS Code environment — so you need no local setup.',
      'Submit each problem set with check50/submit50 as you go; do not wait until the end.',
      'Finish the final project, then claim the free CS50 certificate from the course site.',
      'Stuck? CS50’s own AI duck debugger (cs50.ai) and the free Discord/Ed forums answer questions 24/7.',
    ],
    portalUrl: 'https://cs50.harvard.edu/x/'
  },
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp',
    badge: 'Free verified certificates',
    bestFor: 'Full certifications in web development, Python, data analysis, ML and information security.',
    freeCertificates:
      'YES — every certification is 100% free, verified, and shareable on LinkedIn.',
    proTip:
      'The 12 certifications are ~300 hours each; you can start the responsive-web-design certification today with zero setup because everything runs in the browser.',
    howItWorks: [
      'Create a free account at freecodecamp.org/learn (email or GitHub, no payment details).',
      'Work through the interactive lessons, then complete the 5 certification projects for each certificate.',
      'Submit project links (CodePen, GitHub Pages or Replit) — all three hosting options are free.',
      'Publish the certificate URL straight to your LinkedIn/resume as soon as it appears in your profile.',
      'Use freecodecamp.org/news and the YouTube channel for extra full-length courses at no cost.',
    ],
    portalUrl: 'https://www.freecodecamp.org/learn'
  },
  {
    id: 'mit ocw',
    name: 'MIT OCW',
    badge: 'Every lecture, no signup',
    bestFor: 'Deep computer science, math and engineering fundamentals — MIT problem sets included.',
    freeCertificates:
      'No certificates at all (MIT OCW gives no credit), but nothing is paywalled or time-limited either.',
    proTip:
      'Search ocw.mit.edu/search, open a course and use the "Download course" link to grab every lecture and PDF in one archive for offline study.',
    howItWorks: [
      'Go to ocw.mit.edu and search the subject (algorithms, linear algebra, Python, AI).',
      'Open the course, then use the left menu for Lecture Videos, Assignments and Exams — including solutions.',
      'No account, no enrolment, no expiry: materials are Creative Commons licensed.',
      'Pair with the free MIT textbooks/notes PDFs linked from each course page.',
      'Prefer video? The MIT OCW YouTube channel hosts thousands of the same lectures.',
    ],
    portalUrl: 'https://ocw.mit.edu/search/'
  },
  {
    id: 'kaggle',
    name: 'Kaggle Learn',
    badge: 'Certificates in hours',
    bestFor: 'Practical data science: Python, Pandas, SQL, machine learning and deep learning in 3–5 hour chunks.',
    freeCertificates:
      'YES — finish the notebooks and Kaggle instantly issues a free certificate/badge.',
    proTip:
      'Kaggle gives you free GPUs and TPUs for notebook training, so you can do real deep-learning work on a cheap laptop.',
    howItWorks: [
      'Sign in with a free Kaggle account (no payment details).',
      'Open kaggle.com/learn, pick a micro-course, and run every exercise notebook in the browser.',
      'Complete all lessons to unlock the free certificate — it appears on your Kaggle profile instantly.',
      'Then enter a Playground competition (Titanic, House Prices) to build portfolio proof at no cost.',
      'Download free datasets to practise on real-world data without paying for anything.',
    ],
    portalUrl: 'https://www.kaggle.com/learn'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    badge: 'Zero signup, infinite hours',
    bestFor: 'Full 4–20 hour courses and university lecture playlists you can start instantly.',
    freeCertificates:
      'No certificates, but it is the fastest way to learn a tool today with no account at all.',
    proTip:
      'Search "<topic> full course", then use Filters → Duration → Over 20 minutes and Sort by View count to skip the clickbait.',
    howItWorks: [
      'Search the topic plus "full course" or "crash course" and apply the Over 20 minutes duration filter.',
      'Subscribe to the reliable free educators: freeCodeCamp.org, Harvard CS50, MIT OpenCourseWare, Programming with Mosh, Traversy Media.',
      'Turn on captions and set playback speed to 1.5× once the material feels easy.',
      'Pair video learning with a free hands-on platform (freeCodeCamp, Kaggle, CS50.dev) so you actually build something.',
      'Use the free YouTube "Save to Watch Later" playlist as your own $0 course queue.',
    ],
    portalUrl: 'https://www.youtube.com/'
  },
  {
    id: 'cisco',
    name: 'Cisco NetAcad',
    badge: 'Free badges',
    bestFor: 'Cybersecurity and networking fundamentals plus Linux/Python entry paths.',
    freeCertificates:
      'YES — self-paced courses grant free Cisco digital badges; only the optional certification exams (e.g. CCNA, PCEP) cost money.',
    proTip:
      'Enrol in the self-paced (not instructor-led) version — it is open to everyone worldwide, free, and includes free lab environments.',
    howItWorks: [
      'Create a free Cisco NetAcad account at netacad.com.',
      'Choose a self-paced course: Introduction to Cybersecurity, Cybersecurity Essentials, Networking Basics or Python Essentials 1.',
      'Do the module quizzes and the final assessment in the browser (free Packet Tracer labs included).',
      'Claim your free Cisco digital badge and add it to LinkedIn.',
      'Continue with the Skills for All / CCNA pathway only if you want the paid industry certification.',
    ],
    portalUrl: 'https://www.netacad.com/'
  },
  {
    id: 'google',
    name: 'Google Skillshop',
    badge: 'Official Google certs',
    bestFor: 'Google Ads, Analytics (GA4) and digital-marketing credentials that employers recognise.',
    freeCertificates:
      'YES — Google’s own certificates are free, including the exam (renew every 12 months at no cost).',
    proTip:
      'You do not have to finish all study modules before taking the exam — practice the sample questions, then sit the assessment as soon as you score consistently above 80%.',
    howItWorks: [
      'Sign in to skillshop.withgoogle.com with a free Google account.',
      'Open the certification you want (Google Ads Search, Google Analytics/GA4, or the Digital Marketing fundamentals).',
      'Work through the free modules and practice assessments — no payment screen exists.',
      'Pass the final assessment and download the free certificate + badge from your profile.',
      'Pair it with the free HubSpot Academy certifications to cover organic (SEO/content) as well as paid channels.',
    ],
    portalUrl: 'https://skillshop.withgoogle.com/'
  },
  {
    id: 'hubspot academy',
    name: 'HubSpot Academy',
    badge: 'Free marketing certs',
    bestFor: 'Digital marketing, inbound/content marketing, SEO, social media and sales certifications.',
    freeCertificates:
      'YES — create a free account and every certification, quiz and badge is free.',
    proTip:
      'Certifications expire after 12–24 months, so start with the one that matches the job you are applying for this quarter instead of hoarding all of them.',
    howItWorks: [
      'Create a free HubSpot Academy account (academy.hubspot.com).',
      'Pick a certification course such as Digital Marketing, Inbound Marketing or Content Marketing.',
      'Watch the lessons and pass the quizzes — every lesson is unlocked at $0.',
      'Claim the free certificate and share it on LinkedIn from your HubSpot profile.',
      'Use the free HubSpot CRM sandbox that comes with the account to practise what you learn.',
    ],
    portalUrl: 'https://academy.hubspot.com/courses'
  },
  {
    id: 'the odin project',
    name: 'The Odin Project',
    badge: 'Open-source bootcamp',
    bestFor: 'Self-taught web development with real projects and a job-ready full-stack path.',
    freeCertificates:
      'No certificates (it is a curriculum, not a credential) but hiring managers in web dev value the portfolio it produces.',
    proTip:
      'Do the Foundations path first, then pick Full Stack JavaScript — every project deploys free on GitHub Pages, Netlify or Render.',
    howItWorks: [
      'Open theodinproject.com/paths and start with Foundations (no account required, but a GitHub login syncs your progress).',
      'Follow the lessons in order and build each project — the curriculum is a checklist, not a video marathon.',
      'Use the free VS Code editor and Git/GitHub for version control.',
      'Ask for help in the free Discord community whenever you get stuck for more than 30 minutes.',
      'Choose Full Stack JavaScript after Foundations and finish the portfolio project to become interview-ready.',
    ],
    portalUrl: 'https://www.theodinproject.com/paths'
  },
  {
    id: 'full stack open',
    name: 'Full Stack Open',
    badge: 'Free certificate',
    bestFor: 'Modern React + Node + GraphQL + TypeScript + Docker full-stack engineering.',
    freeCertificates:
      'YES — finish the required parts and the University of Helsinki issues a free certificate (ECTS credit is optional/paid).',
    proTip:
      'The exercises are auto-checked by the free course infrastructure, and you can submit your progress repo with GitHub to earn the certificate at $0.',
    howItWorks: [
      'Go to fullstackopen.com/en and read part 0 (it explains how the course works, free).',
      'Do parts 0–7 for the core certificate: React, Node, testing, GraphQL, TypeScript and CI/CD.',
      'Push every exercise to a GitHub repository as you go — it is your submission and your portfolio.',
      'Request the free certificate once you have completed the required exercises (no payment step).',
      'Optionally continue with the Docker, relational-database and React Native parts, all still free.',
    ],
    portalUrl: 'https://fullstackopen.com/en/'
  },
  {
    id: 'khan academy',
    name: 'Khan Academy',
    badge: 'Non-profit, always free',
    bestFor: 'Math foundations (algebra, calculus, linear algebra, statistics) that every data/ML course assumes.',
    freeCertificates:
      'No certificates, but it is a non-profit — content is free forever with no upsell.',
    proTip:
      'Use the unit mastery quizzes and the "Course Challenge" at the end of a unit to prove to yourself you are actually ready to move on.',
    howItWorks: [
      'Create a free Khan Academy account (or use it without one).',
      'Pick the exact gap you have: Algebra 1, Calculus 1, Linear Algebra, Statistics & Probability, or Personal Finance.',
      'Watch the short videos, then immediately do the practice exercises — accuracy matters more than watching.',
      'Use the Progress tab to spot weak units and revisit them.',
      'Continue to MIT OCW and Kaggle once the foundations are solid, so the harder courses stick.',
    ],
    portalUrl: 'https://www.khanacademy.org/'
  },
  {
    id: 'class central',
    name: 'Class Central',
    badge: '150,000+ MOOCs',
    bestFor: 'One search box across every MOOC provider — Coursera, edX, Udacity, FutureLearn, Swayam and more.',
    freeCertificates:
      'It is a search engine, so it lists what each provider offers — filter by "Free certificate" to see only $0 credential courses.',
    proTip:
      'Filter by Free course + With certificate + your level, then open the provider link to audit. It is the fastest way to compare the same topic across platforms.',
    howItWorks: [
      'Go to classcentral.com and search your topic.',
      'Use the left-hand filters: Free course, With certificate, Level, Duration (short courses first).',
      'Sort by highest rated to surface the 5,000+ courses with learner reviews.',
      'Click through to the provider page and choose the audit/free option (Class Central always links to the free route when one exists).',
      'Save favourites to a free Class Central account so you can track them in one list.',
    ],
    portalUrl: 'https://www.classcentral.com/'
  }
];

/**
 * Builds 7 instant, pre-filtered $0 search links for any keyword.
 * Every link is free to open, requires no payment details, and is safe to
 * share in Telegram (the platform copies the user's search term into the URL).
 */
function buildDirectSearchLinks(keyword = '') {
  const kw = String(keyword || '').replace(/[?#]/g, ' ').trim() || 'programming';
  const q = encodeURIComponent(kw);
  const qPlus = encodeURIComponent(kw.replace(/\s+/g, '+'));

  return [
    {
      platform: 'Udemy 100% Free Filter',
      label: `Highest-rated FREE "${kw}" courses on Udemy`,
      url: `https://www.udemy.com/courses/search/?price=price-free&q=${q}&sort=highest-rated`,
      note: 'The price=price-free filter is already applied — only $0 courses appear, no coupon sites needed.'
    },
    {
      platform: 'Class Central',
      label: `All free "${kw}" MOOCs (150,000+ courses)`,
      url: `https://www.classcentral.com/search?q=${q}`,
      note: 'Tick "Free course" + "With certificate" in the left filter to see only $0 credential courses.'
    },
    {
      platform: 'Coursera (Free Audit)',
      label: `"${kw}" university courses on Coursera`,
      url: `https://www.coursera.org/search?query=${q}`,
      note: 'Open a course → Enrol for free → "Audit the course" at the bottom of the popup for $0 access.'
    },
    {
      platform: 'edX (Free Audit)',
      label: `"${kw}" courses from MIT, Harvard & Berkeley on edX`,
      url: `https://www.edx.org/search?q=${q}`,
      note: 'Choose "Audit this course" instead of the Verified track — lectures and labs stay free.'
    },
    {
      platform: 'freeCodeCamp',
      label: `Free "${kw}" tutorials & full courses on freeCodeCamp`,
      url: `https://www.freecodecamp.org/news/search?query=${q}`,
      note: 'Written + video courses with no paywall, and the interactive curriculum is free with a free certificate.'
    },
    {
      platform: 'YouTube Full Courses',
      label: `"${kw}" full courses on YouTube`,
      url: `https://www.youtube.com/results?search_query=${qPlus}+full+course`,
      note: 'Use Filters → Duration → Over 20 minutes, then sort by view count to skip the clickbait.'
    },
    {
      platform: 'MIT OpenCourseWare',
      label: `MIT lectures & problem sets for "${kw}"`,
      url: `https://ocw.mit.edu/search/?q=${q}`,
      note: 'No signup and no paywall — use "Download course" to grab every lecture and PDF at once.'
    }
  ];
}

module.exports = {
  PLATFORM_GUIDES,
  buildDirectSearchLinks
};
