const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const { COURSES } = require('../src/data/courses');
const { PLATFORM_GUIDES, buildDirectSearchLinks } = require('../src/data/platforms');
const { ROADMAPS } = require('../src/data/roadmaps');
const { getCourseById } = require('../src/services/search');
const { app } = require('../src/server');

const LEVELS = new Set(['Beginner', 'Intermediate', 'Advanced']);
const COURSE_FIELDS = [
  'id',
  'title',
  'platform',
  'category',
  'level',
  'duration',
  'durationHours',
  'rating',
  'hasFreeCertificate',
  'instructor',
  'summary',
  'howToGetFree',
  'tags',
  'url'
];

test('COURSES catalog is populated and every entry satisfies the schema', () => {
  assert.ok(COURSES.length >= 25, `expected a real catalog, got ${COURSES.length} courses`);

  for (const course of COURSES) {
    for (const field of COURSE_FIELDS) {
      assert.ok(
        course[field] !== undefined && course[field] !== null && course[field] !== '',
        `course "${course.id}" is missing field "${field}"`
      );
    }
    assert.equal(typeof course.id, 'string');
    assert.equal(typeof course.durationHours, 'number');
    assert.ok(course.durationHours > 0, `course "${course.id}" needs a positive durationHours`);
    assert.equal(typeof course.rating, 'number');
    assert.ok(course.rating >= 0 && course.rating <= 5, `course "${course.id}" rating out of range`);
    assert.ok(LEVELS.has(course.level), `course "${course.id}" has an invalid level`);
    assert.equal(typeof course.hasFreeCertificate, 'boolean');
    assert.ok(Array.isArray(course.tags) && course.tags.length > 0, `course "${course.id}" needs tags`);
    assert.ok(/^https:\/\//.test(course.url), `course "${course.id}" url must be https`);
  }
});

test('COURSES ids are unique and cover the searches the bot advertises', () => {
  const ids = COURSES.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate course ids found');

  // /save cs50x + the "/saved" reply must be able to show a CS50 course
  const cs50x = getCourseById('cs50x');
  assert.ok(cs50x, 'course id "cs50x" is referenced by the tests and must exist');
  assert.ok(cs50x.title.includes('CS50'));

  // The Udemy-specific branch filters on platform, so Udemy courses must exist
  assert.ok(COURSES.some((c) => c.platform.toLowerCase().includes('udemy')));

  // /cert and the certificate filter need courses with free certificates
  assert.ok(COURSES.filter((c) => c.hasFreeCertificate).length >= 10);

  // Regression guard: the niche-topic fallback test uses "ukulele songwriting"
  const niche = COURSES.filter((c) =>
    /ukulele|songwriting/i.test(`${c.title} ${c.tags.join(' ')} ${c.category}`)
  );
  assert.equal(niche.length, 0, 'the niche-topic fallback test needs this topic to stay unmatched');
});

test('every course platform has a matching platform guide', () => {
  const guideNames = new Set(PLATFORM_GUIDES.map((g) => g.name));
  for (const platform of new Set(COURSES.map((c) => c.platform))) {
    assert.ok(guideNames.has(platform), `no PLATFORM_GUIDES entry for platform "${platform}"`);
  }
});

test('PLATFORM_GUIDES entries are complete and include the Udemy playbook', () => {
  assert.ok(PLATFORM_GUIDES.length >= 6, 'the /platforms command promises at least 6 guides');

  const ids = PLATFORM_GUIDES.map((g) => g.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate guide ids found');

  for (const guide of PLATFORM_GUIDES) {
    for (const field of ['id', 'name', 'badge', 'bestFor', 'freeCertificates', 'proTip', 'portalUrl']) {
      assert.ok(guide[field], `platform guide "${guide.id}" is missing "${field}"`);
    }
    assert.ok(
      Array.isArray(guide.howItWorks) && guide.howItWorks.length >= 3,
      `platform guide "${guide.id}" needs at least 3 howItWorks steps`
    );
    assert.ok(guide.howItWorks.every((step) => typeof step === 'string' && step.length > 0));
    assert.ok(/^https:\/\//.test(guide.portalUrl));
  }

  // The /udemy command does PLATFORM_GUIDES.find(p => p.id === 'udemy')
  const udemy = PLATFORM_GUIDES.find((p) => p.id === 'udemy');
  assert.ok(udemy, 'the Udemy guide is required by the /udemy command');
  assert.ok(udemy.portalUrl.includes('udemy.com/courses/free'));
});

test('buildDirectSearchLinks returns the 7 pre-filtered $0 links', () => {
  const links = buildDirectSearchLinks('ukulele songwriting');
  assert.equal(links.length, 7, 'the fallback message and UI both promise 7 platform links');
  assert.ok(links[0].url.includes('udemy.com/courses/search/?price=price-free'));

  for (const link of links) {
    assert.ok(link.platform && link.label && link.note, 'each direct link needs platform/label/note');
    assert.ok(/^https:\/\//.test(link.url), `direct link for ${link.platform} must be https`);
    assert.ok(
      !link.url.includes('undefined') && !link.url.includes('[object'),
      `direct link for ${link.platform} did not encode its keyword`
    );
  }

  const encoded = buildDirectSearchLinks('c++ & python');
  assert.ok(encoded[0].url.includes(encodeURIComponent('c++ & python')));
  assert.equal(new Set(links.map((l) => l.url)).size, 7, 'direct links must be distinct');

  // Empty/blank keywords must still produce a usable, encoded set
  const fallback = buildDirectSearchLinks('   ');
  assert.equal(fallback.length, 7);
  assert.ok(fallback[0].url.includes('price=price-free'));
});

test('ROADMAPS reference real courses and cover the advertised paths', () => {
  const required = ['web-dev', 'python-ai', 'data-science', 'cybersecurity', 'ui-ux', 'business'];
  for (const id of required) {
    assert.ok(ROADMAPS.some((r) => r.id === id), `missing roadmap "${id}"`);
  }

  for (const roadmap of ROADMAPS) {
    assert.ok(['id', 'title', 'description', 'estimatedTime'].every((f) => roadmap[f]));
    assert.ok(Array.isArray(roadmap.keywords) && roadmap.keywords.length > 0);
    assert.ok(roadmap.steps.length >= 4, `roadmap "${roadmap.id}" needs at least 4 steps`);

    roadmap.steps.forEach((step, index) => {
      assert.equal(step.step, index + 1, `roadmap "${roadmap.id}" steps must be 1..n`);
      assert.ok(step.phase && step.why, `roadmap "${roadmap.id}" step ${step.step} needs phase + why`);
      const course = getCourseById(step.courseId);
      assert.ok(course, `roadmap "${roadmap.id}" step ${step.step} points at unknown course "${step.courseId}"`);
      assert.equal(
        step.courseTitle,
        course.title,
        `roadmap "${roadmap.id}" step ${step.step} title is out of sync with COURSES`
      );
    });
  }
});

test('the committed catalog is not gitignored (Botkeep deploys from GitHub)', () => {
  const repoRoot = path.join(__dirname, '..');
  try {
    execFileSync('git', ['check-ignore', '-q', 'src/data/courses.js'], { cwd: repoRoot });
    assert.fail(
      'src/data/courses.js is gitignored: keep the watchlist ignore rule as "/data/" so the catalog ships'
    );
  } catch (err) {
    // Exit code 1 = not ignored (good); 128 = not a git checkout (skip).
    if (err.status === 0) throw err;
  }
});

test('server boots and serves the health, catalog, platform and roadmap APIs', async () => {
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;

    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.ok, true);
    assert.equal(health.totalCuratedCourses, COURSES.length);
    assert.equal(health.totalPlatforms, PLATFORM_GUIDES.length);
    assert.equal(health.totalRoadmaps, ROADMAPS.length);

    const courses = await (await fetch(`${base}/api/courses?q=python`)).json();
    assert.equal(courses.ok, true);
    assert.ok(courses.courses.length > 0);
    assert.ok(courses.directLinks.some((l) => l.url.includes('price=price-free')));
    assert.ok(courses.meta.categories.length >= 5);

    const platforms = await (await fetch(`${base}/api/platforms?q=excel`)).json();
    assert.equal(platforms.platforms.length, PLATFORM_GUIDES.length);
    assert.equal(platforms.directLinks.length, 7);

    const roadmaps = await (await fetch(`${base}/api/roadmaps`)).json();
    assert.equal(roadmaps.roadmaps.length, ROADMAPS.length);
    assert.ok(
      roadmaps.roadmaps.every((rm) => rm.steps.every((step) => step.course)),
      'every roadmap step must hydrate a real course'
    );

    // The Botkeep entrypoint requires the chat endpoint to answer too
    const chat = await (
      await fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'test:http', message: '/start' })
      })
    ).json();
    assert.equal(chat.ok, true);
    assert.equal(chat.response.type, 'welcome');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
