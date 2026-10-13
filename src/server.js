require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const { COURSES } = require('./data/courses');
const { PLATFORM_GUIDES, buildDirectSearchLinks } = require('./data/platforms');
const { ROADMAPS } = require('./data/roadmaps');
const { searchCourses, getCourseById } = require('./services/search');
const { getWatchlist, saveCourse, removeCourse, updateCourseStatus } = require('./services/watchlist');
const { handleBotMessage } = require('./bot/engine');
const { startTelegramBot, stopTelegramBot, getTelegramBotStatus } = require('./platforms/telegram');

const app = express();
// Botkeep assigns SERVER_PORT (or PORT); default to 3000 locally
const PORT = Number(process.env.SERVER_PORT || process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'CourseFinder Telegram Bot & Hub',
    totalCuratedCourses: COURSES.length,
    totalPlatforms: PLATFORM_GUIDES.length,
    totalRoadmaps: ROADMAPS.length,
    telegram: getTelegramBotStatus()
  });
});

// Conversational / Command Bot endpoint (powers Telegram Simulator & Web Advisor)
app.post('/api/chat', (req, res) => {
  const { userId = 'web:default', message = '' } = req.body || {};
  const response = handleBotMessage(userId, message);
  const watchlist = getWatchlist(userId);
  res.json({
    ok: true,
    response,
    watchlistCount: watchlist.length,
    savedIds: watchlist.map((item) => item.courseId)
  });
});

// Search & Filter Courses + Live Direct Free Links
app.get('/api/courses', (req, res) => {
  const {
    q = '',
    platform = '',
    category = '',
    level = '',
    certificateOnly = '',
    maxHours = ''
  } = req.query;

  const filters = {};
  if (platform && platform !== 'all') filters.platform = platform;
  if (category && category !== 'all') filters.category = category;
  if (level && level !== 'all') filters.level = level;
  if (certificateOnly === 'true') filters.certificateOnly = true;
  if (maxHours && Number(maxHours) > 0) filters.maxHours = Number(maxHours);

  const result = searchCourses(String(q), filters);

  const categories = [...new Set(COURSES.map((c) => c.category))];
  const platforms = [...new Set(COURSES.map((c) => c.platform))];

  res.json({
    ok: true,
    query: q,
    filters,
    totalMatches: result.totalMatches,
    courses: result.courses,
    directLinks: result.directLinks,
    meta: {
      categories,
      platforms
    }
  });
});

// Single course detail
app.get('/api/courses/:id', (req, res) => {
  const course = getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ ok: false, error: 'Course not found' });
  }
  return res.json({ ok: true, course });
});

// Platform Playbooks & Direct Free Link Builder
app.get('/api/platforms', (req, res) => {
  const keyword = String(req.query.q || 'python');
  res.json({
    ok: true,
    platforms: PLATFORM_GUIDES,
    directLinks: buildDirectSearchLinks(keyword)
  });
});

// Learning Roadmaps
app.get('/api/roadmaps', (_req, res) => {
  const hydrated = ROADMAPS.map((rm) => ({
    ...rm,
    steps: rm.steps.map((s) => ({
      ...s,
      course: getCourseById(s.courseId)
    }))
  }));
  res.json({
    ok: true,
    roadmaps: hydrated
  });
});

// Watchlist APIs
app.get('/api/watchlist', (req, res) => {
  const userId = String(req.query.userId || 'web:default');
  const watchlist = getWatchlist(userId);
  res.json({
    ok: true,
    userId,
    watchlist
  });
});

app.post('/api/watchlist', (req, res) => {
  const { userId = 'web:default', courseId } = req.body || {};
  const result = saveCourse(userId, courseId);
  if (!result.ok) {
    return res.status(404).json({ ok: false, error: 'Course not found' });
  }
  const watchlist = getWatchlist(userId);
  return res.json({
    ok: true,
    ...result,
    watchlist
  });
});

app.patch('/api/watchlist/:courseId', (req, res) => {
  const { userId = 'web:default', status = 'in-progress' } = req.body || {};
  const result = updateCourseStatus(userId, req.params.courseId, status);
  if (!result.ok) {
    return res.status(404).json({ ok: false, error: 'Course not in watchlist' });
  }
  const watchlist = getWatchlist(userId);
  return res.json({
    ok: true,
    ...result,
    watchlist
  });
});

app.delete('/api/watchlist/:courseId', (req, res) => {
  const userId = String(req.query.userId || req.body?.userId || 'web:default');
  const result = removeCourse(userId, req.params.courseId);
  const watchlist = getWatchlist(userId);
  res.json({
    ok: true,
    ...result,
    watchlist
  });
});

// Telegram Bot status & live token connection endpoint
app.get('/api/bot-status', (_req, res) => {
  res.json({
    ok: true,
    telegram: getTelegramBotStatus()
  });
});

app.post('/api/bot-connect', async (req, res) => {
  const { token, action = 'connect' } = req.body || {};
  if (action === 'disconnect') {
    const status = await stopTelegramBot();
    return res.json({ ok: true, platform: 'telegram', status });
  }
  const status = await startTelegramBot(token);
  return res.json({ ok: status.connected, platform: 'telegram', status });
});

// SPA fallback for non-API GET routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, '../public/index.html'));
  }
  return next();
});

if (require.main === module) {
  const server = app.listen(PORT, HOST, async () => {
    console.log(`[CourseFinder] Server listening on http://${HOST}:${PORT}`);
    if (process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_TOKEN) {
      await startTelegramBot();
    } else {
      console.log(
        '[Telegram Bot] Set TELEGRAM_BOT_TOKEN in Botkeep Environment (or .env) to start live Telegram polling.'
      );
    }
  });

  // Clean shutdown for Botkeep runtime stop/restart signals
  const shutdown = async (signal) => {
    console.log(`[CourseFinder] Received ${signal}, shutting down cleanly...`);
    await stopTelegramBot();
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = { app };
