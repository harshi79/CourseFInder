const { COURSES } = require('../data/courses');
const { PLATFORM_GUIDES, buildDirectSearchLinks } = require('../data/platforms');
const { ROADMAPS } = require('../data/roadmaps');
const { searchCourses, findRoadmap, getCourseById, findPlatformGuide } = require('../services/search');
const { getWatchlist, saveCourse, removeCourse, updateCourseStatus } = require('../services/watchlist');

// In-memory conversation context per userId (Telegram chat, Discord user, or Web session)
const sessions = new Map();

function getSession(userId = 'web:default') {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      lastTopic: 'python',
      lastCourses: COURSES.slice(0, 5),
      lastFilters: {},
      historyCount: 0
    });
  }
  return sessions.get(userId);
}

/**
 * Resolves a course reference like "1", "#2", or "cs50x" using the user's last shown courses
 */
function resolveCourseRef(ref, session) {
  if (!ref) return null;
  const cleaned = String(ref).trim().replace(/^#/, '');
  const num = parseInt(cleaned, 10);
  if (!Number.isNaN(num) && num >= 1 && session && Array.isArray(session.lastCourses)) {
    if (session.lastCourses[num - 1]) {
      return session.lastCourses[num - 1];
    }
  }
  const byId = getCourseById(cleaned);
  if (byId) return byId;

  // Partial title or id match
  const lower = cleaned.toLowerCase();
  return (
    COURSES.find(
      (c) =>
        c.id.toLowerCase().includes(lower) ||
        c.title.toLowerCase().includes(lower)
    ) || null
  );
}

/**
 * Formats a course list into clean Markdown for Telegram / Discord / Web
 */
function formatCourseListMarkdown(courses, limit = 5) {
  const slice = courses.slice(0, limit);
  return slice
    .map((c, idx) => {
      const certBadge = c.hasFreeCertificate ? '🏆 Free Certificate' : '🔓 100% Free Access';
      return (
        `*${idx + 1}. ${c.title}*\n` +
        `   🏫 *Platform:* ${c.platform}  |  ⏱ *${c.duration}*  |  ⭐ *${c.rating}*\n` +
        `   🏷 *Tier:* ${certBadge} (${c.level})\n` +
        `   💡 *Why take it:* ${c.summary}\n` +
        `   🔑 *How to get $0:* ${c.howToGetFree}\n` +
        `   🔗 [Open Free Course](${c.url})  _(ID: \`${c.id}\`)_`
      );
    })
    .join('\n\n');
}

/**
 * Builds platform comparison advice when user asks e.g. "Udemy vs Coursera"
 */
function buildComparisonResponse(input) {
  const lower = input.toLowerCase();
  const mentioned = PLATFORM_GUIDES.filter((p) => {
    const firstWord = p.name.split(' ')[0].toLowerCase();
    return lower.includes(p.id) || lower.includes(firstWord);
  });

  const pair = mentioned.length >= 2 ? mentioned.slice(0, 3) : [PLATFORM_GUIDES[0], PLATFORM_GUIDES[1], PLATFORM_GUIDES[3]];

  const lines = [
    `⚖️ **Platform Comparison — Where Should You Spend Your Time?**\n`,
    ...pair.map(
      (p) =>
        `🔹 **${p.name}**\n` +
        `• **Best For:** ${p.bestFor}\n` +
        `• **Free Certificate?** ${p.freeCertificates}\n` +
        `• **Time-Saving Trick:** ${p.proTip}\n` +
        `• **Direct Link:** ${p.portalUrl}`
    ),
    `\n💬 **Quick Verdict:**\n` +
      `• Pick **Udemy (Free Filter)** or **YouTube / Kaggle** if you want fast, practical 2–8 hour crash courses today.\n` +
      `• Pick **freeCodeCamp**, **Harvard CS50**, **Kaggle**, **Google Skillshop**, or **Cisco** if you want a **100% Free Verified Certificate** for your resume/LinkedIn.\n` +
      `• Pick **Coursera (Audit)** or **MIT OCW** if you want deep Stanford/MIT/Yale university lectures.`
  ];

  return {
    type: 'comparison',
    markdown: lines.join('\n\n'),
    platformGuides: pair,
    quickReplies: [
      { label: '🎯 Free Cert Courses', action: '/cert' },
      { label: '🟣 Udemy Free Trick', action: '/udemy' },
      { label: '🗺️ Learning Roadmaps', action: '/roadmap' }
    ]
  };
}

/**
 * Main conversational & command handler for Telegram, Discord, and Web Simulator
 */
function handleBotMessage(userId = 'web:default', rawMessage = '') {
  const session = getSession(userId);
  session.historyCount += 1;

  const text = String(rawMessage || '').trim();
  const lower = text.toLowerCase();

  // 1. Greeting / Start / Help
  if (
    !text ||
    /^(\/start|\/help|!help|!start|help|start|hi|hello|hey|menu|commands)$/i.test(lower)
  ) {
    const markdown =
      `👋 **Welcome to CourseFinder Bot!**\n` +
      `Stop wasting time hunting through paywalls or fake trials. Tell me what you want to learn in plain English, or use a quick command:\n\n` +
      `🔍 **Search & Describe Any Topic**\n` +
      `• Just type: _"I want to learn Python from scratch with a free certificate"_\n` +
      `• Or type: \`/search <keyword>\` (e.g. \`/search react\`, \`/search excel\`, \`/search graphic design\`)\n\n` +
      `🟣 **Udemy & Free Platform Shortcuts**\n` +
      `• \`/udemy <topic>\` — Instant highest-rated **100% Free Udemy** filter link + coupon guide\n` +
      `• \`/platforms\` — Where free courses live (Udemy, Coursera Audit, CS50, freeCodeCamp, Kaggle, MIT)\n` +
      `• \`/cert [topic]\` — Only courses with **100% Free Verified Certificates**\n` +
      `• \`/compare udemy vs coursera\` — Compare platforms side-by-side\n\n` +
      `🗺️ **Roadmaps & Saved Watchlist**\n` +
      `• \`/roadmap <topic>\` — Step-by-step $0 paths (\`web-dev\`, \`python-ai\`, \`data-science\`, \`cybersecurity\`, \`ui-ux\`, \`business\`)\n` +
      `• \`/save #1\` or \`/saved\` — Bookmark courses to your personal watchlist`;

    return {
      type: 'welcome',
      markdown,
      courses: COURSES.slice(0, 4),
      directLinks: buildDirectSearchLinks('python'),
      quickReplies: [
        { label: '🟣 Free Udemy Guide & Links', action: '/udemy python' },
        { label: '🏆 Free Certificate Courses', action: '/cert' },
        { label: '🗺️ Web Dev Roadmap', action: '/roadmap web-dev' },
        { label: '🤖 AI & Python Courses', action: '/search python ai' },
        { label: '🌐 Where Free Courses Are', action: '/platforms' }
      ]
    };
  }

  // 2. Callback-style or explicit action commands: save:<id>, unsave:<id>, detail:<id>, status:<id>:<state>
  if (lower.startsWith('save:') || /^(\/save|!save|save)\s+(.+)/i.test(text)) {
    const ref = lower.startsWith('save:')
      ? text.slice(5).trim()
      : text.replace(/^(\/save|!save|save)\s+/i, '').trim();
    const course = resolveCourseRef(ref, session);
    if (!course) {
      return {
        type: 'error',
        markdown: `⚠️ Couldn't find a course matching \`${ref}\`. Try \`/save #1\` (from your last search) or use a course ID like \`/save cs50x\`.`,
        quickReplies: [{ label: '🔖 View Watchlist', action: '/saved' }]
      };
    }
    const res = saveCourse(userId, course.id);
    const savedList = getWatchlist(userId);
    return {
      type: 'watchlist_updated',
      markdown: res.alreadySaved
        ? `✅ **${course.title}** is already in your Saved Watchlist! (${savedList.length} saved total)\n🔗 [Open Course](${course.url})`
        : `🔖 **Saved to your Watchlist!**\n\n**${course.title}** (${course.platform})\n💡 *How to get it free:* ${course.howToGetFree}\n🔗 [Start Course Now](${course.url})\n\nUse \`/saved\` anytime to view your ${savedList.length} bookmarked course(s).`,
      courses: [course],
      watchlist: savedList,
      quickReplies: [
        { label: `🔖 My Watchlist (${savedList.length})`, action: '/saved' },
        { label: '🔍 Find Similar Courses', action: `/search ${course.category}` }
      ]
    };
  }

  if (lower.startsWith('unsave:') || /^(\/unsave|!unsave|unsave|remove)\s+(.+)/i.test(text)) {
    const ref = lower.startsWith('unsave:')
      ? text.slice(7).trim()
      : text.replace(/^(\/unsave|!unsave|unsave|remove)\s+/i, '').trim();
    const course = resolveCourseRef(ref, session);
    const targetId = course ? course.id : ref;
    const res = removeCourse(userId, targetId);
    const savedList = getWatchlist(userId);
    return {
      type: 'watchlist_updated',
      markdown: res.removed
        ? `🗑️ Removed **${res.course ? res.course.title : targetId}** from your watchlist.`
        : `ℹ️ Course \`${ref}\` was not in your watchlist.`,
      watchlist: savedList,
      quickReplies: [{ label: `🔖 My Watchlist (${savedList.length})`, action: '/saved' }]
    };
  }

  // 3. View Watchlist (/saved, /watchlist, my courses)
  if (/^(\/saved|!saved|\/watchlist|!watchlist|\/bookmarks|saved|watchlist|my saved courses)$/i.test(lower)) {
    const savedList = getWatchlist(userId);
    if (savedList.length === 0) {
      return {
        type: 'watchlist',
        markdown:
          `🔖 **Your Saved Course Watchlist is currently empty.**\n\n` +
          `Whenever you search for courses, click **Save** or type \`/save #1\` to bookmark courses here so you never lose track of them!`,
        watchlist: [],
        quickReplies: [
          { label: '🏆 Top Free Cert Courses', action: '/cert' },
          { label: '🟣 Free Udemy Courses', action: '/udemy' },
          { label: '🎲 Surprise Me', action: '/random' }
        ]
      };
    }

    const lines = savedList.map(
      (item, idx) =>
        `*${idx + 1}. ${item.course.title}* (${item.course.platform})\n` +
        `   ⏱ ${item.course.duration} | 📌 Status: \`${item.status.toUpperCase()}\`\n` +
        `   🔑 ${item.course.howToGetFree}\n` +
        `   🔗 [Go to Course](${item.course.url})  |  Remove: \`/unsave ${item.course.id}\``
    );

    return {
      type: 'watchlist',
      markdown: `🔖 **Your Saved Free Course Watchlist (${savedList.length}):**\n\n${lines.join('\n\n')}`,
      courses: savedList.map((i) => i.course),
      watchlist: savedList,
      quickReplies: [
        { label: '🔍 Search More Courses', action: '/search python' },
        { label: '🗺️ View Roadmaps', action: '/roadmap' }
      ]
    };
  }

  // 4. Course Detail / "Tell me more about #1" / detail:<id>
  const detailMatch =
    lower.match(/^detail:(.+)$/i) ||
    lower.match(/^(\/detail|!detail|\/info)\s+(.+)$/i) ||
    lower.match(/(?:tell me more about|more info on|details on|how to get|explain)\s+(?:course\s+)?#?(\d+|[a-z0-9-]+)$/i);

  if (detailMatch) {
    const ref = detailMatch[detailMatch.length - 1].trim();
    const course = resolveCourseRef(ref, session);
    if (course) {
      const markdown =
        `📘 **${course.title}**\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🏫 **Platform:** ${course.platform}\n` +
        `👨‍🏫 **Instructor:** ${course.instructor}\n` +
        `📂 **Category:** ${course.category} (${course.level})\n` +
        `⏱ **Duration:** ${course.duration}  |  ⭐ **Rating:** ${course.rating}/5.0\n` +
        `🏅 **Free Certificate:** ${course.hasFreeCertificate ? '✅ Yes — Included for Free!' : '❌ No (Video/Content is 100% Free)'}\n\n` +
        `📝 **What You'll Learn:**\n${course.summary}\n\n` +
        `🔑 **How to Access for $0 (Zero Time Wasted):**\n${course.howToGetFree}\n\n` +
        `🔗 **Direct Link:** [Start "${course.title}" Now](${course.url})`;

      return {
        type: 'course_detail',
        markdown,
        courses: [course],
        quickReplies: [
          { label: `🔖 Save ${course.id}`, action: `save:${course.id}` },
          { label: `🔍 More ${course.category}`, action: `/search ${course.category}` },
          { label: '🗺️ Matching Roadmap', action: `/roadmap ${course.category}` }
        ]
      };
    }
  }

  // 5. Udemy Specific Guide & Search (/udemy [topic] or conversational questions about Udemy free courses/coupons)
  const isUdemyCommand = /^(\/udemy|!udemy)\b/i.test(lower);
  const isUdemyDiscussion =
    /\b(udemy|udemi|udemey)\b/i.test(lower) &&
    /\b(how|where|coupon|coupons|100%|free|find|trick|hack|get|available|work)\b/i.test(lower);

  if (isUdemyCommand || isUdemyDiscussion) {
    const topicRaw = text
      .replace(/^(\/udemy|!udemy)\s*/i, '')
      .replace(/\b(how|where|can|i|find|get|free|udemy|udemi|courses|course|coupons|coupon|on|for|to|in|available|work|100%|off)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const searchTopic = topicRaw || session.lastTopic || 'python';
    session.lastTopic = searchTopic;

    const udemyGuide = PLATFORM_GUIDES.find((p) => p.id === 'udemy');
    const udemyCourses = searchCourses(searchTopic, { platform: 'Udemy' }).courses;
    const displayCourses = udemyCourses.length > 0
      ? udemyCourses
      : COURSES.filter((c) => c.platform.toLowerCase().includes('udemy'));

    session.lastCourses = displayCourses;

    const q = encodeURIComponent(searchTopic);
    const udemyFreeSearchUrl = `https://www.udemy.com/courses/search/?price=price-free&q=${q}&sort=highest-rated`;
    const udemyFreePortalUrl = 'https://www.udemy.com/courses/free/';

    const markdown =
      `🟣 **Udemy Free Courses & 100%-Off Guide (Topic: "${searchTopic}")**\n\n` +
      `**How to Get Udemy Courses for $0 Without Wasting Time:**\n` +
      `${udemyGuide.howItWorks.join('\n')}\n\n` +
      `🚀 **Instant Pre-Filtered Udemy Free Links for "${searchTopic}":**\n` +
      `• 🔗 [Top-Rated FREE "${searchTopic}" Courses on Udemy (?price=price-free)](${udemyFreeSearchUrl})\n` +
      `• 🔗 [Official Udemy All Free Courses Portal](${udemyFreePortalUrl})\n\n` +
      `📚 **Featured Free Udemy Courses in Catalog:**\n\n` +
      formatCourseListMarkdown(displayCourses, 4);

    return {
      type: 'udemy_guide',
      markdown,
      courses: displayCourses.slice(0, 4),
      directLinks: buildDirectSearchLinks(searchTopic),
      platformGuides: [udemyGuide],
      quickReplies: [
        { label: '🟣 Udemy Python Free', action: '/udemy python' },
        { label: '🟣 Udemy Web Dev Free', action: '/udemy web development' },
        { label: '🟣 Udemy Excel Free', action: '/udemy excel' },
        { label: '🏆 Compare Udemy vs Coursera', action: '/compare udemy vs coursera' }
      ]
    };
  }

  // 6. Platform Guide ("Where are free courses available?" / /platforms)
  if (
    /^(\/platforms|!platforms|\/sources|\/hacks)\b/i.test(lower) ||
    /\b(where\s+(?:are|can i find|to find|to get)\s+free\s+courses|which\s+platforms|best\s+sites\s+for\s+free\s+courses|best\s+websites)\b/i.test(lower)
  ) {
    const guideSummary = PLATFORM_GUIDES.map(
      (p, i) =>
        `*${i + 1}. ${p.name}* — _${p.badge}_\n` +
        `   🎯 *Best for:* ${p.bestFor}\n` +
        `   🏅 *Free Certificate:* ${p.freeCertificates}\n` +
        `   ⚡ *Shortcut:* ${p.proTip}\n` +
        `   🔗 [Open Portal](${p.portalUrl})`
    ).join('\n\n');

    return {
      type: 'platforms',
      markdown:
        `🌐 **Where Free Courses Are Available (The No-Time-Wasted Directory)**\n` +
        `Here are the ${PLATFORM_GUIDES.length} best places online to learn anything for $0 and how to bypass paywalls legitimately:\n\n` +
        guideSummary,
      platformGuides: PLATFORM_GUIDES,
      quickReplies: [
        { label: '🟣 Udemy Free Guide', action: '/udemy' },
        { label: '🏆 Free Cert Courses Only', action: '/cert' },
        { label: '🗺️ Learning Roadmaps', action: '/roadmap' }
      ]
    };
  }

  // 7. Platform Comparisons (/compare or "X vs Y")
  if (/^(\/compare|!compare)\b/i.test(lower) || /\b(vs\.?|versus|compare)\b/i.test(lower)) {
    return buildComparisonResponse(text);
  }

  // 8. Learning Roadmaps (/roadmap [topic] or "roadmap for X" / "learning path for X")
  if (
    /^(\/roadmap|!roadmap|\/path|!path)\b/i.test(lower) ||
    /\b(roadmap|learning path|step by step|study plan|curriculum for|where do i start)\b/i.test(lower)
  ) {
    const query = text
      .replace(/^(\/roadmap|!roadmap|\/path|!path)\s*/i, '')
      .replace(/\b(roadmap|learning path|step by step|study plan|for|to|learn|give me a|show me)\b/gi, ' ')
      .trim();

    const roadmap = findRoadmap(query || session.lastTopic);
    const selectedRoadmap = roadmap || ROADMAPS[0];
    const stepCourses = selectedRoadmap.steps
      .map((s) => getCourseById(s.courseId))
      .filter(Boolean);

    session.lastCourses = stepCourses;

    const stepsMd = selectedRoadmap.steps
      .map((s) => {
        const c = getCourseById(s.courseId);
        const url = c ? c.url : '#';
        return (
          `*Step ${s.step}: ${s.phase}*\n` +
          `   📘 [${s.courseTitle}](${url})\n` +
          `   💡 _${s.why}_`
        );
      })
      .join('\n\n');

    return {
      type: 'roadmap',
      markdown:
        `🗺️ **${selectedRoadmap.title}**\n` +
        `⏱ *Estimated Time:* ${selectedRoadmap.estimatedTime}\n` +
        `📝 ${selectedRoadmap.description}\n\n` +
        `${stepsMd}\n\n` +
        `💬 *Tip:* Reply \`/save #1\` to bookmark Step 1 to your watchlist!`,
      roadmap: selectedRoadmap,
      courses: stepCourses,
      quickReplies: ROADMAPS.map((r) => ({
        label: `🗺️ ${r.title.split('(')[0].trim()}`,
        action: `/roadmap ${r.id}`
      }))
    };
  }

  // 9. Random Course (/random)
  if (/^(\/random|!random|surprise me|random)$/i.test(lower)) {
    const pick = COURSES[Math.floor(Math.random() * COURSES.length)];
    session.lastCourses = [pick];
    return {
      type: 'random',
      markdown:
        `🎲 **Random High-Rated Free Course Pick:**\n\n` +
        formatCourseListMarkdown([pick], 1),
      courses: [pick],
      quickReplies: [
        { label: `🔖 Save ${pick.id}`, action: `save:${pick.id}` },
        { label: '🎲 Another Random Pick', action: '/random' }
      ]
    };
  }

  // 10. Free Certificate Shortcut (/cert [topic])
  if (/^(\/cert|!cert|\/certificates)\b/i.test(lower)) {
    const certTopic = text.replace(/^(\/cert|!cert|\/certificates)\s*/i, '').trim();
    const effectiveQuery = certTopic || '';
    const result = searchCourses(effectiveQuery, { certificateOnly: true });
    const displayCourses = result.courses.length > 0
      ? result.courses
      : COURSES.filter((c) => c.hasFreeCertificate);

    session.lastCourses = displayCourses;
    if (certTopic) session.lastTopic = certTopic;

    return {
      type: 'search_results',
      markdown:
        `🏆 **100% Free Courses with Verified Certificates ${certTopic ? `(Topic: "${certTopic}")` : ''}**\n` +
        `Every course below gives you a verifiable certificate or digital badge at **$0 cost**:\n\n` +
        formatCourseListMarkdown(displayCourses, 5),
      courses: displayCourses.slice(0, 6),
      directLinks: buildDirectSearchLinks(certTopic || 'free certificate'),
      quickReplies: [
        { label: '🔖 Save #1', action: 'save:1' },
        { label: '🏆 Python Free Certs', action: '/cert python' },
        { label: '🏆 Web Dev Free Certs', action: '/cert web' },
        { label: '🏆 Cyber Free Certs', action: '/cert cybersecurity' }
      ]
    };
  }

  // 11. Conversational Follow-up Refinements (e.g. "only with certificate", "shorter ones", "on coursera")
  const isFollowUpCert = /^(only\s+)?(with\s+)?(free\s+)?(certificate|certificates|cert|certs)(\s+only)?$/i.test(lower);
  const isFollowUpShort = /^(shorter|short\s+ones|quick\s+ones|under\s+10\s+hours|faster)$/i.test(lower);

  let effectiveQuery = text.replace(/^(\/search|!search|\/find|!find|\/free|!free)\s+/i, '').trim();
  if (isFollowUpCert) {
    effectiveQuery = `${session.lastTopic} with free certificate`;
  } else if (isFollowUpShort) {
    effectiveQuery = `short ${session.lastTopic}`;
  }

  // 12. General Natural-Language Discussion & Keyword Search
  const searchResult = searchCourses(effectiveQuery);
  const { intent, directLinks } = searchResult;
  const cleanTopic = intent.cleanTopic || effectiveQuery;
  session.lastTopic = cleanTopic;

  if (searchResult.courses.length > 0) {
    session.lastCourses = searchResult.courses;

    const filterBadges = [];
    if (intent.platform) filterBadges.push(`Platform: **${intent.platform}**`);
    if (intent.wantsCertificate) filterBadges.push(`Filter: **🏆 Free Certificate**`);
    if (intent.wantsShort) filterBadges.push(`Filter: **⚡ Short/Crash Course**`);
    if (intent.level) filterBadges.push(`Level: **${intent.level}**`);

    const matchingRoadmap = findRoadmap(cleanTopic);

    const directLinksMd = directLinks
      .slice(0, 4)
      .map((l) => `• [${l.label}](${l.url}) — _${l.note}_`)
      .join('\n');

    const advisorNote = matchingRoadmap
      ? `\n\n🗺️ **Want a full step-by-step plan?** Type \`/roadmap ${matchingRoadmap.id}\` for our **${matchingRoadmap.title}**!`
      : '';

    const markdown =
      `🎯 **Top Free Courses for "${cleanTopic}"** ${filterBadges.length ? `(${filterBadges.join(' · ')})` : ''}\n` +
      `Found **${searchResult.totalMatches}** curated match(es) + live platform search links:\n\n` +
      formatCourseListMarkdown(searchResult.courses, 5) +
      `\n\n🌐 **Instant Pre-Filtered Free Search Links for "${cleanTopic}":**\n` +
      directLinksMd +
      advisorNote;

    return {
      type: 'search_results',
      markdown,
      courses: searchResult.courses.slice(0, 6),
      directLinks,
      roadmap: matchingRoadmap || null,
      quickReplies: [
        { label: '🔖 Save #1', action: 'save:1' },
        { label: `🟣 "${cleanTopic}" on Udemy Free`, action: `/udemy ${cleanTopic}` },
        { label: `🏆 "${cleanTopic}" Free Certs`, action: `/cert ${cleanTopic}` },
        ...(matchingRoadmap
          ? [{ label: `🗺️ ${matchingRoadmap.id} Roadmap`, action: `/roadmap ${matchingRoadmap.id}` }]
          : [])
      ]
    };
  }

  // 13. Fallback for any ultra-niche topic not in static catalog (e.g. "ukulele", "japanese calligraphy", "unreal engine", "rust")
  // Generates instant pre-filtered $0 search links across Udemy, Class Central, Coursera, edX, YouTube, MIT OCW!
  const directLinksMd = directLinks
    .map((l) => `• **${l.platform}:** [${l.label}](${l.url})\n  _${l.note}_`)
    .join('\n\n');

  return {
    type: 'live_links_only',
    markdown:
      `🔎 **Instant Free Course Finder for "${cleanTopic}"**\n\n` +
      `Even for specialized topics like **"${cleanTopic}"**, you don't need to waste time clicking through paid ads. Here are pre-filtered **100% Free** search links across all major platforms:\n\n` +
      `${directLinksMd}\n\n` +
      `💡 **Time-Saving Tip:**\n` +
      `• On **Udemy**, the link above already applies \`?price=price-free&sort=highest-rated\` so only $0 courses appear.\n` +
      `• On **Coursera & edX**, click any individual course and choose **"Audit the course"** at the bottom of the enroll popup to watch all lectures free!`,
    courses: [],
    directLinks,
    quickReplies: [
      { label: '🟣 How Udemy Free Works', action: '/udemy' },
      { label: '🌐 All Free Platforms', action: '/platforms' },
      { label: '🏆 Top Free Cert Courses', action: '/cert' }
    ]
  };
}

module.exports = {
  handleBotMessage,
  getSession
};
