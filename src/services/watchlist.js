const fs = require('fs');
const path = require('path');
const { getCourseById } = require('./search');

const DATA_DIR = path.join(__dirname, '../../data');
const WATCHLIST_FILE = path.join(DATA_DIR, 'watchlist.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(WATCHLIST_FILE)) {
    fs.writeFileSync(WATCHLIST_FILE, JSON.stringify({}, null, 2), 'utf8');
  }
}

function readAll() {
  ensureStore();
  try {
    const raw = fs.readFileSync(WATCHLIST_FILE, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (_err) {
    return {};
  }
}

function writeAll(data) {
  ensureStore();
  fs.writeFileSync(WATCHLIST_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getWatchlist(userId = 'web:default') {
  const all = readAll();
  const list = all[userId] || [];
  return list
    .map((entry) => {
      const course = getCourseById(entry.courseId);
      if (!course) return null;
      return {
        ...entry,
        course
      };
    })
    .filter(Boolean);
}

function saveCourse(userId = 'web:default', courseId) {
  const course = getCourseById(courseId);
  if (!course) {
    return { ok: false, reason: 'not_found' };
  }
  const all = readAll();
  const list = all[userId] || [];
  const existing = list.find((item) => item.courseId === course.id);
  if (existing) {
    return { ok: true, alreadySaved: true, course, item: existing };
  }
  const newItem = {
    courseId: course.id,
    status: 'saved',
    savedAt: new Date().toISOString()
  };
  list.unshift(newItem);
  all[userId] = list;
  writeAll(all);
  return { ok: true, alreadySaved: false, course, item: newItem };
}

function removeCourse(userId = 'web:default', courseId) {
  const all = readAll();
  const list = all[userId] || [];
  const before = list.length;
  const filtered = list.filter((item) => item.courseId !== courseId);
  all[userId] = filtered;
  writeAll(all);
  return {
    ok: true,
    removed: filtered.length < before,
    course: getCourseById(courseId)
  };
}

function updateCourseStatus(userId = 'web:default', courseId, status = 'in-progress') {
  const validStatuses = ['saved', 'in-progress', 'completed'];
  const normStatus = validStatuses.includes(status) ? status : 'saved';
  const all = readAll();
  const list = all[userId] || [];
  const item = list.find((entry) => entry.courseId === courseId);
  if (!item) {
    return { ok: false, reason: 'not_saved' };
  }
  item.status = normStatus;
  item.updatedAt = new Date().toISOString();
  all[userId] = list;
  writeAll(all);
  return { ok: true, item, course: getCourseById(courseId) };
}

module.exports = {
  getWatchlist,
  saveCourse,
  removeCourse,
  updateCourseStatus
};
