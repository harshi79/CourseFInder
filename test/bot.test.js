const test = require('node:test');
const assert = require('node:assert/strict');

const { handleBotMessage } = require('../src/bot/engine');
const { searchCourses } = require('../src/services/search');
const { getWatchlist, saveCourse, removeCourse } = require('../src/services/watchlist');

test('Bot welcome /start returns introduction, courses, and quickReplies', () => {
  const res = handleBotMessage('test:user1', '/start');
  assert.equal(res.type, 'welcome');
  assert.ok(res.markdown.includes('Welcome to CourseFinder Bot'));
  assert.ok(Array.isArray(res.courses) && res.courses.length > 0);
  assert.ok(Array.isArray(res.quickReplies) && res.quickReplies.length > 0);
});

test('Natural language query for Python with free certificate returns verified cert courses', () => {
  const res = handleBotMessage(
    'test:user1',
    'I want to learn Python from scratch with a free certificate'
  );
  assert.equal(res.type, 'search_results');
  assert.ok(res.courses.length > 0);
  assert.ok(res.courses.some((c) => c.hasFreeCertificate));
  assert.ok(res.directLinks.some((l) => l.url.includes('price=price-free')));
});

test('Udemy discussion or /udemy command returns Udemy free guide and price=price-free link', () => {
  const res = handleBotMessage('test:user1', 'where can I find free udemi courses on excel?');
  assert.equal(res.type, 'udemy_guide');
  assert.ok(res.markdown.includes('price=price-free'));
  assert.ok(res.courses.length > 0);
});

test('/roadmap command returns structured step-by-step free learning path', () => {
  const res = handleBotMessage('test:user1', '/roadmap web-dev');
  assert.equal(res.type, 'roadmap');
  assert.ok(res.roadmap);
  assert.equal(res.roadmap.id, 'web-dev');
  assert.ok(res.roadmap.steps.length >= 4);
});

test('/platforms and comparison commands explain where free courses are available', () => {
  const platRes = handleBotMessage('test:user1', '/platforms');
  assert.equal(platRes.type, 'platforms');
  assert.ok(platRes.platformGuides.length >= 6);

  const cmpRes = handleBotMessage('test:user1', 'Compare Udemy vs Coursera');
  assert.equal(cmpRes.type, 'comparison');
  assert.ok(cmpRes.markdown.includes('Udemy'));
  assert.ok(cmpRes.markdown.includes('Coursera'));
});

test('Watchlist save and unsave commands persist user bookmarks', () => {
  const testUser = 'test:watchlist_user';
  removeCourse(testUser, 'cs50x');

  const saveRes = handleBotMessage(testUser, '/save cs50x');
  assert.equal(saveRes.type, 'watchlist_updated');
  assert.ok(getWatchlist(testUser).some((i) => i.courseId === 'cs50x'));

  const listRes = handleBotMessage(testUser, '/saved');
  assert.equal(listRes.type, 'watchlist');
  assert.ok(listRes.markdown.includes('CS50'));

  const unsaveRes = handleBotMessage(testUser, '/unsave cs50x');
  assert.equal(unsaveRes.type, 'watchlist_updated');
  assert.ok(!getWatchlist(testUser).some((i) => i.courseId === 'cs50x'));
});

test('Fallback for ultra-niche topic generates pre-filtered free links across 7 platforms', () => {
  const res = handleBotMessage('test:user1', 'ukulele songwriting');
  assert.equal(res.type, 'live_links_only');
  assert.equal(res.directLinks.length, 7);
  assert.ok(res.directLinks[0].url.includes('udemy.com/courses/search/?price=price-free'));
});

test('searchCourses filters by platform and certificateOnly', () => {
  const udemyOnly = searchCourses('', { platform: 'Udemy' });
  assert.ok(udemyOnly.courses.length > 0);
  assert.ok(udemyOnly.courses.every((c) => c.platform.toLowerCase().includes('udemy')));

  const certOnly = searchCourses('python', { certificateOnly: true });
  assert.ok(certOnly.courses.length > 0);
  assert.ok(certOnly.courses.every((c) => c.hasFreeCertificate));
});
