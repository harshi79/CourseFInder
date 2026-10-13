const { COURSES } = require('../data/courses');
const { PLATFORM_GUIDES, buildDirectSearchLinks } = require('../data/platforms');
const { ROADMAPS } = require('../data/roadmaps');

const SYNONYMS = {
  js: ['javascript', 'web development', 'frontend', 'node'],
  javascript: ['js', 'web development', 'frontend', 'react', 'nodejs'],
  py: ['python', 'programming'],
  python: ['py', 'programming', 'data science', 'django'],
  ml: ['machine learning', 'ai', 'data science', 'scikit-learn'],
  ai: ['artificial intelligence', 'machine learning', 'deep learning', 'llm', 'generative ai'],
  'artificial intelligence': ['ai', 'machine learning', 'deep learning'],
  cyber: ['cybersecurity', 'security', 'ethical hacking', 'networking'],
  hacking: ['cybersecurity', 'ethical hacking', 'penetration testing', 'security'],
  security: ['cybersecurity', 'ethical hacking', 'infosec'],
  web: ['web development', 'html', 'css', 'javascript', 'frontend', 'fullstack'],
  frontend: ['web development', 'html', 'css', 'javascript', 'react', 'ui'],
  backend: ['nodejs', 'python', 'sql', 'database', 'django', 'c#', 'java'],
  fullstack: ['full stack', 'web development', 'react', 'nodejs', 'javascript'],
  design: ['ui/ux', 'figma', 'graphic design', 'ux', 'ui', 'blender'],
  ux: ['ui/ux', 'design', 'figma', 'user experience'],
  ui: ['ui/ux', 'design', 'figma', 'frontend'],
  data: ['data science', 'data analysis', 'sql', 'pandas', 'python', 'excel'],
  cloud: ['aws', 'devops', 'docker', 'kubernetes', 'linux'],
  devops: ['docker', 'kubernetes', 'linux', 'git', 'aws', 'cloud'],
  coding: ['programming', 'computer science', 'python', 'javascript', 'web development'],
  programming: ['coding', 'computer science', 'python', 'java', 'c#', 'javascript'],
  business: ['marketing', 'startup', 'management', 'finance', 'excel', 'entrepreneurship'],
  marketing: ['digital marketing', 'seo', 'social media', 'business'],
  math: ['linear algebra', 'calculus', 'statistics', 'probability'],
  money: ['finance', 'investing', 'personal finance', 'stock market']
};

const STOP_WORDS = new Set([
  'i', 'want', 'to', 'learn', 'find', 'me', 'a', 'an', 'the', 'free', 'course', 'courses',
  'on', 'about', 'for', 'in', 'with', 'how', 'can', 'get', 'best', 'good', 'top', 'any',
  'show', 'search', 'looking', 'need', 'please', 'recommend', 'suggest', 'where', 'is',
  'are', 'available', 'from', 'scratch', 'complete', 'online', 'tutorial', 'tutorials',
  'class', 'classes', 'without', 'paying', 'waste', 'time', 'like', 'just', 'describe'
]);

const PLATFORM_ALIASES = [
  { key: 'Udemy', patterns: ['udemy', 'udemi', 'udemey'] },
  { key: 'Coursera', patterns: ['coursera', 'corsera'] },
  { key: 'edX', patterns: ['edx', 'ed x'] },
  { key: 'Harvard', patterns: ['harvard', 'cs50'] },
  { key: 'freeCodeCamp', patterns: ['freecodecamp', 'fcc', 'free code camp'] },
  { key: 'MIT OCW', patterns: ['mit', 'ocw', 'opencourseware'] },
  { key: 'YouTube', patterns: ['youtube', 'yt'] },
  { key: 'Kaggle', patterns: ['kaggle'] },
  { key: 'Cisco', patterns: ['cisco', 'netacad'] },
  { key: 'Google', patterns: ['google', 'skillshop'] },
  { key: 'Khan Academy', patterns: ['khan', 'khan academy'] },
  { key: 'The Odin Project', patterns: ['odin', 'odin project'] },
  { key: 'Full Stack Open', patterns: ['full stack open', 'fullstack open', 'helsinki'] },
  { key: 'Saylor Academy', patterns: ['saylor'] },
  { key: 'HubSpot', patterns: ['hubspot'] }
];

/**
 * Parses a natural-language query or search string into structured filters & clean keywords
 */
function parseSearchIntent(rawInput = '') {
  const lower = String(rawInput || '').toLowerCase().trim();

  let detectedPlatform = null;
  for (const p of PLATFORM_ALIASES) {
    if (p.patterns.some((pat) => new RegExp(`\\b${pat}\\b`, 'i').test(lower))) {
      detectedPlatform = p.key;
      break;
    }
  }

  const wantsCertificate = /\b(certificate|certificates|certified|cert|certs|badge|badges|credential)\b/i.test(lower);
  const wantsShort = /\b(short|quick|fast|crash|weekend|under 10|few hours|1 hour|2 hour|3 hour)\b/i.test(lower);

  let detectedLevel = null;
  if (/\b(beginner|beginners|scratch|zero|starter|intro|introduction|basic|newbie)\b/i.test(lower)) {
    detectedLevel = 'Beginner';
  } else if (/\b(intermediate|mid)\b/i.test(lower)) {
    detectedLevel = 'Intermediate';
  } else if (/\b(advanced|expert)\b/i.test(lower)) {
    detectedLevel = 'Advanced';
  }

  // Extract meaningful topic tokens
  const cleanedTokens = lower
    .replace(/[^\w\s+#/-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
    .filter((t) => {
      // Remove pure filter words from topic keywords unless it's the only word
      if (['certificate', 'certificates', 'certified', 'cert', 'beginner', 'beginners', 'short', 'quick', 'crash', 'udemy', 'udemi', 'coursera', 'edx'].includes(t)) {
        return false;
      }
      return true;
    });

  const cleanTopic = cleanedTokens.join(' ').trim() || (detectedPlatform ? `${detectedPlatform} free courses` : 'popular');

  return {
    raw: rawInput,
    cleanTopic,
    tokens: cleanedTokens,
    platform: detectedPlatform,
    wantsCertificate,
    wantsShort,
    level: detectedLevel
  };
}

/**
 * Searches the curated course catalog with optional explicit filters + natural language intent
 */
function searchCourses(query = '', explicitFilters = {}) {
  const intent = parseSearchIntent(query);

  const platformFilter = explicitFilters.platform || intent.platform || null;
  const categoryFilter = explicitFilters.category || null;
  const levelFilter = explicitFilters.level || intent.level || null;
  const certificateOnly = explicitFilters.certificateOnly !== undefined
    ? Boolean(explicitFilters.certificateOnly)
    : intent.wantsCertificate;
  const maxHours = explicitFilters.maxHours || (intent.wantsShort ? 10 : null);

  // Expand tokens with synonyms
  const expandedTerms = new Set(intent.tokens);
  for (const token of intent.tokens) {
    if (SYNONYMS[token]) {
      SYNONYMS[token].forEach((s) => expandedTerms.add(s));
    }
  }
  const fullPhrase = intent.tokens.join(' ');
  if (SYNONYMS[fullPhrase]) {
    SYNONYMS[fullPhrase].forEach((s) => expandedTerms.add(s));
  }

  const scored = COURSES.map((course) => {
    let score = 0;
    const titleLower = course.title.toLowerCase();
    const summaryLower = course.summary.toLowerCase();
    const categoryLower = course.category.toLowerCase();
    const platformLower = course.platform.toLowerCase();
    const tagsLower = course.tags.map((t) => t.toLowerCase());

    // Hard filters if explicitly set in UI dropdowns
    if (explicitFilters.platform && !platformLower.includes(explicitFilters.platform.toLowerCase())) {
      return { course, score: -1 };
    }
    if (categoryFilter && categoryLower !== categoryFilter.toLowerCase()) {
      return { course, score: -1 };
    }
    if (explicitFilters.level && course.level.toLowerCase() !== explicitFilters.level.toLowerCase()) {
      return { course, score: -1 };
    }
    if (explicitFilters.certificateOnly && !course.hasFreeCertificate) {
      return { course, score: -1 };
    }
    if (explicitFilters.maxHours && course.durationHours > Number(explicitFilters.maxHours)) {
      return { course, score: -1 };
    }

    // Soft/Strong scoring from natural language query
    if (platformFilter) {
      if (platformLower.includes(platformFilter.toLowerCase())) {
        score += 25;
      } else if (intent.tokens.length === 0) {
        return { course, score: -1 };
      }
    }

    if (certificateOnly) {
      if (course.hasFreeCertificate) {
        score += 15;
      } else if (intent.tokens.length === 0) {
        return { course, score: -1 };
      } else {
        score -= 8;
      }
    }

    if (maxHours) {
      if (course.durationHours <= maxHours) {
        score += 12;
      } else {
        score -= 5;
      }
    }

    if (levelFilter && course.level === levelFilter) {
      score += 6;
    }

    if (intent.tokens.length === 0 && !platformFilter && !certificateOnly && !categoryFilter) {
      // Default browse mode: rank by rating & certificate availability
      score += course.rating * 5 + (course.hasFreeCertificate ? 3 : 0);
      return { course, score };
    }

    // Exact phrase match
    if (fullPhrase && fullPhrase.length > 2) {
      if (titleLower.includes(fullPhrase)) score += 35;
      if (tagsLower.includes(fullPhrase)) score += 30;
      if (categoryLower.includes(fullPhrase)) score += 20;
      if (summaryLower.includes(fullPhrase)) score += 15;
    }

    // Token and synonym matches
    for (const term of expandedTerms) {
      const isPrimaryToken = intent.tokens.includes(term);
      const weight = isPrimaryToken ? 1.0 : 0.55;

      if (titleLower.includes(term)) score += 18 * weight;
      if (tagsLower.some((tag) => tag === term || tag.includes(term))) score += 16 * weight;
      if (categoryLower.includes(term)) score += 12 * weight;
      if (summaryLower.includes(term)) score += 8 * weight;
      if (platformLower.includes(term)) score += 14 * weight;
    }

    // Slight quality tie-breaker
    if (score > 0) {
      score += (course.rating - 4.0) * 3;
    }

    return { course, score };
  });

  const matched = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.course);

  const linkKeyword = intent.tokens.length > 0 ? intent.tokens.join(' ') : (platformFilter || categoryFilter || 'programming');
  const directLinks = buildDirectSearchLinks(linkKeyword);

  return {
    courses: matched,
    totalMatches: matched.length,
    intent,
    directLinks
  };
}

/**
 * Finds the best matching learning roadmap for a query
 */
function findRoadmap(query = '') {
  const lower = String(query || '').toLowerCase().trim();
  if (!lower) return ROADMAPS[0];

  const byId = ROADMAPS.find((r) => r.id === lower);
  if (byId) return byId;

  let best = null;
  let bestScore = 0;
  for (const rm of ROADMAPS) {
    let s = 0;
    if (rm.title.toLowerCase().includes(lower)) s += 20;
    for (const kw of rm.keywords) {
      if (lower.includes(kw) || kw.includes(lower)) {
        s += 10;
      }
    }
    if (s > bestScore) {
      bestScore = s;
      best = rm;
    }
  }
  return best;
}

/**
 * Finds a specific course by ID or 1-based index from a recent list
 */
function getCourseById(id) {
  if (!id) return null;
  const norm = String(id).trim().toLowerCase();
  return COURSES.find((c) => c.id.toLowerCase() === norm) || null;
}

/**
 * Finds platform guide(s) matching a query
 */
function findPlatformGuide(query = '') {
  const lower = String(query || '').toLowerCase().trim();
  if (!lower) return PLATFORM_GUIDES;
  const matched = PLATFORM_GUIDES.filter(
    (p) =>
      p.id.includes(lower) ||
      p.name.toLowerCase().includes(lower) ||
      p.bestFor.toLowerCase().includes(lower)
  );
  return matched.length > 0 ? matched : PLATFORM_GUIDES;
}

module.exports = {
  parseSearchIntent,
  searchCourses,
  findRoadmap,
  getCourseById,
  findPlatformGuide
};
