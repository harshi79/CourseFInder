(() => {
  const USER_ID = 'web:default';
  let savedCourseIds = new Set();
  let roadmapsData = [];
  let activeRoadmapId = 'web-dev';
  let currentSkin = 'telegram';

  // DOM Elements
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const watchlistBadge = document.getElementById('watchlistBadge');

  const chatShell = document.getElementById('chatShell');
  const chatAvatar = document.getElementById('chatAvatar');
  const chatHeaderTitle = document.getElementById('chatHeaderTitle');
  const chatHeaderSub = document.getElementById('chatHeaderSub');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const stripTopicLabel = document.getElementById('stripTopicLabel');
  const stripLinksContainer = document.getElementById('stripLinksContainer');

  const explorerSearchInput = document.getElementById('explorerSearchInput');
  const explorerSearchBtn = document.getElementById('explorerSearchBtn');
  const filterPlatform = document.getElementById('filterPlatform');
  const filterCategory = document.getElementById('filterCategory');
  const filterLevel = document.getElementById('filterLevel');
  const filterCertOnly = document.getElementById('filterCertOnly');
  const filterShortOnly = document.getElementById('filterShortOnly');
  const explorerTopicLabel = document.getElementById('explorerTopicLabel');
  const explorerDirectLinksGrid = document.getElementById('explorerDirectLinksGrid');
  const explorerCountText = document.getElementById('explorerCountText');
  const explorerCourseGrid = document.getElementById('explorerCourseGrid');

  const udemyQuickTopicInput = document.getElementById('udemyQuickTopicInput');
  const udemyQuickLaunchBtn = document.getElementById('udemyQuickLaunchBtn');
  const platformGuidesGrid = document.getElementById('platformGuidesGrid');

  const roadmapSelector = document.getElementById('roadmapSelector');
  const roadmapDetailContainer = document.getElementById('roadmapDetailContainer');
  const watchlistContainer = document.getElementById('watchlistContainer');

  const openConnectModalBtn = document.getElementById('openConnectModalBtn');
  const closeConnectModalBtn = document.getElementById('closeConnectModalBtn');
  const connectModal = document.getElementById('connectModal');
  const botStatusDot = document.getElementById('botStatusDot');
  const botStatusLabel = document.getElementById('botStatusLabel');
  const tgModalStatus = document.getElementById('tgModalStatus');
  const tgTokenInput = document.getElementById('tgTokenInput');
  const connectTgBtn = document.getElementById('connectTgBtn');
  const tgFeedback = document.getElementById('tgFeedback');

  // Escape HTML safely
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Convert lightweight Bot Markdown to safe HTML
  function renderBotMarkdown(md) {
    let html = escapeHtml(md);
    // Links: [label](url)
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>'
    );
    // Bold **text** or *text*
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>');
    // Italic _text_
    html = html.replace(/_([^_\n]+)_/g, '<em>$1</em>');
    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Line breaks
    html = html.replace(/\n/g, '<br/>');
    return html;
  }

  // Switch active main tab
  function switchTab(tabId) {
    navTabs.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });
    if (tabId === 'watchlist') {
      loadWatchlist();
    }
  }

  navTabs.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Bot Skin Switcher (Telegram / Web Advisor)
  document.querySelectorAll('.skin-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentSkin = btn.dataset.skin;
      document.querySelectorAll('.skin-btn').forEach((b) => b.classList.toggle('active', b === btn));
      chatShell.className = `chat-shell skin-${currentSkin}`;

      if (currentSkin === 'telegram') {
        chatAvatar.textContent = '✈️';
        chatHeaderTitle.textContent = '@CourseFinderFreeBot (Telegram Mode)';
        chatHeaderSub.textContent = 'Online · Supports /udemy, /search, /roadmap, /cert & Natural Chat';
      } else {
        chatAvatar.textContent = '✨';
        chatHeaderTitle.textContent = 'CourseFinder AI & Free Course Advisor';
        chatHeaderSub.textContent = 'Describe what you want to learn — get $0 courses & roadmaps';
      }
    });
  });

  // Update bottom live search strip in chat
  function updateChatLiveStrip(directLinks = [], topic = 'python') {
    if (!Array.isArray(directLinks) || directLinks.length === 0) return;
    stripTopicLabel.textContent = topic;
    stripLinksContainer.innerHTML = directLinks
      .map((l) => {
        const isUdemy = l.platform.toLowerCase().includes('udemy');
        return `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="strip-pill ${isUdemy ? 'udemy-pill' : ''}" title="${escapeHtml(l.note)}">${escapeHtml(l.platform)} ↗</a>`;
      })
      .join('');
  }

  // Append a message to the Bot Chat window
  function appendChatMessage(role, payload) {
    const row = document.createElement('div');
    row.className = `msg-row ${role}`;

    if (role === 'user') {
      row.innerHTML = `<div class="msg-bubble">${escapeHtml(payload)}</div>`;
      chatMessages.appendChild(row);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return;
    }

    // Bot reply bubble + course cards + inline keyboard buttons
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = renderBotMarkdown(payload.markdown || '');
    row.appendChild(bubble);

    // Render interactive course cards if courses are returned
    if (Array.isArray(payload.courses) && payload.courses.length > 0) {
      const cardsWrap = document.createElement('div');
      cardsWrap.className = 'bot-course-cards';

      payload.courses.slice(0, 4).forEach((course, idx) => {
        const isSaved = savedCourseIds.has(course.id);
        const isUdemy = course.platform.toLowerCase().includes('udemy');
        const card = document.createElement('div');
        card.className = 'mini-course-card';
        card.innerHTML = `
          <div>
            <div class="mini-course-top">
              <span class="platform-tag ${isUdemy ? 'udemy' : ''}">#${idx + 1} · ${escapeHtml(course.platform)}</span>
              ${course.hasFreeCertificate ? '<span class="cert-tag">🏆 Free Cert</span>' : `<span style="color:#94a3b8">${escapeHtml(course.duration)}</span>`}
            </div>
            <div class="mini-course-title" style="margin:6px 0 4px;">${escapeHtml(course.title)}</div>
            <div class="mini-course-how">🔑 ${escapeHtml(course.howToGetFree)}</div>
          </div>
          <div class="mini-course-actions">
            <a href="${escapeHtml(course.url)}" target="_blank" rel="noopener noreferrer" class="btn-link-sm">Open Free ↗</a>
            <button class="btn-save-sm ${isSaved ? 'saved' : ''}" data-save-id="${escapeHtml(course.id)}">
              ${isSaved ? '✓ Saved' : '🔖 Save'}
            </button>
          </div>
        `;
        cardsWrap.appendChild(card);
      });
      row.appendChild(cardsWrap);
    }

    // Render Inline Keyboard buttons (Telegram / Discord style)
    if (Array.isArray(payload.quickReplies) && payload.quickReplies.length > 0) {
      const ik = document.createElement('div');
      ik.className = 'inline-keyboard';
      payload.quickReplies.forEach((qr) => {
        const btn = document.createElement('button');
        btn.className = 'ik-btn';
        btn.textContent = qr.label;
        btn.addEventListener('click', () => sendBotMessage(qr.action, qr.label));
        ik.appendChild(btn);
      });
      row.appendChild(ik);
    }

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Bind save buttons inside the newly added message
    row.querySelectorAll('[data-save-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const courseId = btn.getAttribute('data-save-id');
        await toggleSaveCourse(courseId, btn);
      });
    });

    if (payload.directLinks) {
      const topicGuess =
        (payload.directLinks[0]?.label || '').match(/"([^"]+)"/)?.[1] || 'python';
      updateChatLiveStrip(payload.directLinks, topicGuess);
    }
  }

  // Send a message to the Bot API
  async function sendBotMessage(messageText, displayLabel) {
    if (messageText) {
      appendChatMessage('user', displayLabel || messageText);
    }
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, message: messageText || '/start' })
      });
      const data = await res.json();
      if (data.ok) {
        if (Array.isArray(data.savedIds)) {
          savedCourseIds = new Set(data.savedIds);
          watchlistBadge.textContent = savedCourseIds.size;
        }
        appendChatMessage('bot', data.response);
      }
    } catch (_err) {
      appendChatMessage('bot', {
        markdown: '⚠️ Connection error talking to bot engine. Please try again.'
      });
    }
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = chatInput.value.trim();
    if (!val) return;
    chatInput.value = '';
    sendBotMessage(val);
  });

  clearChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    sendBotMessage('/start');
  });

  // Bind sidebar command chips & natural-language prompt buttons
  document.querySelectorAll('[data-msg]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-msg');
      switchTab('bot');
      sendBotMessage(msg);
    });
  });

  // Toggle Save / Unsave course
  async function toggleSaveCourse(courseId, btnEl) {
    const isAlreadySaved = savedCourseIds.has(courseId);
    if (isAlreadySaved) {
      const res = await fetch(`/api/watchlist/${encodeURIComponent(courseId)}?userId=${encodeURIComponent(USER_ID)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.ok) {
        savedCourseIds = new Set(data.watchlist.map((i) => i.courseId));
        watchlistBadge.textContent = savedCourseIds.size;
        if (btnEl) {
          btnEl.classList.remove('saved');
          btnEl.textContent = '🔖 Save';
        }
      }
    } else {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, courseId })
      });
      const data = await res.json();
      if (data.ok) {
        savedCourseIds = new Set(data.watchlist.map((i) => i.courseId));
        watchlistBadge.textContent = savedCourseIds.size;
        if (btnEl) {
          btnEl.classList.add('saved');
          btnEl.textContent = '✓ Saved';
        }
      }
    }
  }

  // ==================== TAB 2: COURSE EXPLORER ====================
  let categoriesPopulated = false;

  async function loadExplorerCourses() {
    const q = explorerSearchInput.value.trim();
    const platform = filterPlatform.value;
    const category = filterCategory.value;
    const level = filterLevel.value;
    const certificateOnly = filterCertOnly.checked ? 'true' : '';
    const maxHours = filterShortOnly.checked ? '10' : '';

    const params = new URLSearchParams({
      q,
      platform,
      category,
      level,
      certificateOnly,
      maxHours
    });

    const res = await fetch(`/api/courses?${params.toString()}`);
    const data = await res.json();
    if (!data.ok) return;

    // Populate category dropdown once
    if (!categoriesPopulated && data.meta?.categories) {
      data.meta.categories.forEach((cat) => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        filterCategory.appendChild(opt);
      });
      categoriesPopulated = true;
    }

    const displayTopic = q || (platform !== 'all' ? platform : category !== 'all' ? category : 'programming');
    explorerTopicLabel.textContent = displayTopic;

    // Render Live Multi-Platform Deep Links
    explorerDirectLinksGrid.innerHTML = (data.directLinks || [])
      .map(
        (link) => `
        <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="dg-card">
          <span class="dg-card-platform">${escapeHtml(link.platform)} ↗</span>
          <span style="font-size:12.5px;font-weight:600">${escapeHtml(link.label)}</span>
          <span class="dg-card-note">${escapeHtml(link.note)}</span>
        </a>
      `
      )
      .join('');

    explorerCountText.textContent = `Showing ${data.courses.length} curated free course(s) ${q ? `matching "${q}"` : ''}`;

    if (data.courses.length === 0) {
      explorerCourseGrid.innerHTML = `
        <div class="sidebar-card" style="grid-column: 1 / -1; text-align:center; padding: 28px;">
          <h3>No curated courses matched all filters — but check the Live Links above!</h3>
          <p class="muted-small" style="margin-top:6px;">
            Click any of the 7 pre-filtered platform cards above (like <strong>Udemy 100% Free Filter</strong> or <strong>Class Central</strong>) to immediately browse free "${escapeHtml(displayTopic)}" courses on those platforms.
          </p>
        </div>
      `;
      return;
    }

    explorerCourseGrid.innerHTML = data.courses
      .map((course) => {
        const isSaved = savedCourseIds.has(course.id);
        const isUdemy = course.platform.toLowerCase().includes('udemy');
        return `
          <div class="course-card">
            <div>
              <div class="course-badges">
                <span class="platform-tag ${isUdemy ? 'udemy' : ''}">${escapeHtml(course.platform)}</span>
                <span class="platform-tag" style="background:rgba(255,255,255,0.06);color:#cbd5e1">${escapeHtml(course.category)}</span>
                ${course.hasFreeCertificate ? '<span class="cert-tag">🏆 Free Certificate</span>' : ''}
              </div>
              <div class="course-title" style="margin-top:10px;">${escapeHtml(course.title)}</div>
              <div class="course-meta" style="margin:4px 0 8px;">
                👨‍🏫 ${escapeHtml(course.instructor)} &nbsp;·&nbsp; ⏱ ${escapeHtml(course.duration)} &nbsp;·&nbsp; ⭐ ${course.rating} (${escapeHtml(course.level)})
              </div>
              <div class="course-summary">${escapeHtml(course.summary)}</div>
            </div>
            <div>
              <div class="how-free-box" style="margin-bottom:10px;">
                <strong>🔑 How to get it $0:</strong> ${escapeHtml(course.howToGetFree)}
              </div>
              <div class="course-footer">
                <a href="${escapeHtml(course.url)}" target="_blank" rel="noopener noreferrer" class="btn-link-sm">Start Free Course ↗</a>
                <button class="btn-save-sm" data-ask-id="${escapeHtml(course.id)}">💬 Ask Bot</button>
                <button class="btn-save-sm ${isSaved ? 'saved' : ''}" data-exp-save="${escapeHtml(course.id)}">
                  ${isSaved ? '✓ Saved' : '🔖 Save'}
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    explorerCourseGrid.querySelectorAll('[data-exp-save]').forEach((btn) => {
      btn.addEventListener('click', () => toggleSaveCourse(btn.getAttribute('data-exp-save'), btn));
    });

    explorerCourseGrid.querySelectorAll('[data-ask-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cid = btn.getAttribute('data-ask-id');
        switchTab('bot');
        sendBotMessage(`detail:${cid}`, `Tell me more about ${cid}`);
      });
    });
  }

  explorerSearchBtn.addEventListener('click', loadExplorerCourses);
  explorerSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loadExplorerCourses();
  });
  [filterPlatform, filterCategory, filterLevel, filterCertOnly, filterShortOnly].forEach((el) => {
    el.addEventListener('change', loadExplorerCourses);
  });

  // ==================== TAB 3: UDEMY & FREE PLATFORMS PLAYBOOK ====================
  udemyQuickTopicInput.addEventListener('input', () => {
    const q = encodeURIComponent(udemyQuickTopicInput.value.trim() || 'python');
    udemyQuickLaunchBtn.href = `https://www.udemy.com/courses/search/?price=price-free&q=${q}&sort=highest-rated`;
  });

  async function loadPlatformGuides() {
    const res = await fetch('/api/platforms');
    const data = await res.json();
    if (!data.ok) return;

    platformGuidesGrid.innerHTML = data.platforms
      .map(
        (p) => `
        <div class="platform-guide-card">
          <div class="pg-top">
            <h3>${escapeHtml(p.name)}</h3>
            <span class="platform-tag">${escapeHtml(p.badge)}</span>
          </div>
          <div class="course-meta">
            🎯 <strong>Best For:</strong> ${escapeHtml(p.bestFor)}<br/>
            🏅 <strong>Free Certificate:</strong> ${escapeHtml(p.freeCertificates)}
          </div>
          <ul class="pg-steps">
            ${p.howItWorks.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
          </ul>
          <div class="pg-tip">
            ⚡ <strong>Time-Saving Shortcut:</strong> ${escapeHtml(p.proTip)}
          </div>
          <div style="margin-top:auto;padding-top:6px;display:flex;gap:8px;">
            <a href="${escapeHtml(p.portalUrl)}" target="_blank" rel="noopener noreferrer" class="btn-link-sm">Open ${escapeHtml(p.name.split(' ')[0])} Portal ↗</a>
            <button class="btn-save-sm" data-discuss-platform="${escapeHtml(p.id)}">💬 Discuss in Bot</button>
          </div>
        </div>
      `
      )
      .join('');

    platformGuidesGrid.querySelectorAll('[data-discuss-platform]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-discuss-platform');
        switchTab('bot');
        sendBotMessage(pid === 'udemy' ? '/udemy python' : `/search ${pid}`);
      });
    });
  }

  // ==================== TAB 4: $0 LEARNING ROADMAPS ====================
  async function loadRoadmaps() {
    const res = await fetch('/api/roadmaps');
    const data = await res.json();
    if (!data.ok) return;
    roadmapsData = data.roadmaps || [];
    renderRoadmapTabs();
    renderActiveRoadmap();
  }

  function renderRoadmapTabs() {
    roadmapSelector.innerHTML = roadmapsData
      .map(
        (rm) => `
        <button class="rm-tab-btn ${rm.id === activeRoadmapId ? 'active' : ''}" data-rm-id="${escapeHtml(rm.id)}">
          ${escapeHtml(rm.title.split('(')[0].trim())}
        </button>
      `
      )
      .join('');

    roadmapSelector.querySelectorAll('[data-rm-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeRoadmapId = btn.getAttribute('data-rm-id');
        renderRoadmapTabs();
        renderActiveRoadmap();
      });
    });
  }

  function renderActiveRoadmap() {
    const rm = roadmapsData.find((r) => r.id === activeRoadmapId) || roadmapsData[0];
    if (!rm) return;

    roadmapDetailContainer.innerHTML = `
      <div class="roadmap-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <h3>${escapeHtml(rm.title)}</h3>
            <p class="muted-small" style="margin:4px 0 0;">${escapeHtml(rm.description)}</p>
          </div>
          <span class="cert-tag">⏱ ${escapeHtml(rm.estimatedTime)}</span>
        </div>

        <div class="rm-steps-list">
          ${rm.steps
            .map((s) => {
              const c = s.course;
              const isSaved = c && savedCourseIds.has(c.id);
              return `
                <div class="rm-step-item">
                  <div style="flex:1;min-width:250px;">
                    <div>
                      <span class="rm-step-num">Step ${s.step}</span>
                      <strong>${escapeHtml(s.phase)}</strong>
                    </div>
                    <div style="margin-top:6px;font-weight:600;color:#a5b4fc;">
                      📘 ${escapeHtml(s.courseTitle)}
                    </div>
                    <div class="muted-small" style="margin:4px 0 0;">
                      💡 ${escapeHtml(s.why)}
                    </div>
                  </div>
                  ${
                    c
                      ? `<div style="display:flex;gap:8px;align-items:center;">
                          <a href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer" class="btn-link-sm" style="padding:8px 14px;">Open Free Course ↗</a>
                          <button class="btn-save-sm ${isSaved ? 'saved' : ''}" data-rm-save="${escapeHtml(c.id)}" style="padding:8px 14px;">
                            ${isSaved ? '✓ Saved' : '🔖 Save Step'}
                          </button>
                        </div>`
                      : ''
                  }
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;

    roadmapDetailContainer.querySelectorAll('[data-rm-save]').forEach((btn) => {
      btn.addEventListener('click', () => toggleSaveCourse(btn.getAttribute('data-rm-save'), btn));
    });
  }

  // ==================== TAB 5: WATCHLIST ====================
  async function loadWatchlist() {
    const res = await fetch(`/api/watchlist?userId=${encodeURIComponent(USER_ID)}`);
    const data = await res.json();
    if (!data.ok) return;

    const list = data.watchlist || [];
    savedCourseIds = new Set(list.map((i) => i.courseId));
    watchlistBadge.textContent = savedCourseIds.size;

    if (list.length === 0) {
      watchlistContainer.innerHTML = `
        <div class="sidebar-card" style="text-align:center;padding:36px;">
          <h3>🔖 Your Watchlist is Empty</h3>
          <p class="muted-small" style="margin:8px 0 16px;">
            Save courses from the Bot Chat, Course Explorer, or Roadmaps to track your free learning journey here.
          </p>
          <button class="btn-primary-sm" id="goExploreFromWatchlist">Browse Free Courses</button>
        </div>
      `;
      document.getElementById('goExploreFromWatchlist')?.addEventListener('click', () => switchTab('explorer'));
      return;
    }

    watchlistContainer.innerHTML = list
      .map(
        (item) => `
        <div class="watchlist-item">
          <div style="flex:1;min-width:260px;">
            <div class="course-badges" style="margin-bottom:6px;">
              <span class="platform-tag">${escapeHtml(item.course.platform)}</span>
              ${item.course.hasFreeCertificate ? '<span class="cert-tag">🏆 Free Certificate</span>' : ''}
              <span class="course-meta">⏱ ${escapeHtml(item.course.duration)}</span>
            </div>
            <div class="course-title">${escapeHtml(item.course.title)}</div>
            <div class="muted-small" style="margin:4px 0 0;">🔑 ${escapeHtml(item.course.howToGetFree)}</div>
          </div>

          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <select data-status-id="${escapeHtml(item.courseId)}" style="background:#0b0f19;color:#fff;border:1px solid #26334d;padding:7px 10px;border-radius:7px;font-size:12.5px;">
              <option value="saved" ${item.status === 'saved' ? 'selected' : ''}>📌 Saved</option>
              <option value="in-progress" ${item.status === 'in-progress' ? 'selected' : ''}>🔥 In Progress</option>
              <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>✅ Completed</option>
            </select>
            <a href="${escapeHtml(item.course.url)}" target="_blank" rel="noopener noreferrer" class="btn-link-sm" style="padding:8px 14px;">Start / Resume ↗</a>
            <button class="btn-ghost-sm" data-remove-id="${escapeHtml(item.courseId)}">🗑️ Remove</button>
          </div>
        </div>
      `
      )
      .join('');

    watchlistContainer.querySelectorAll('[data-status-id]').forEach((sel) => {
      sel.addEventListener('change', async () => {
        const cid = sel.getAttribute('data-status-id');
        await fetch(`/api/watchlist/${encodeURIComponent(cid)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: USER_ID, status: sel.value })
        });
      });
    });

    watchlistContainer.querySelectorAll('[data-remove-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const cid = btn.getAttribute('data-remove-id');
        await fetch(`/api/watchlist/${encodeURIComponent(cid)}?userId=${encodeURIComponent(USER_ID)}`, {
          method: 'DELETE'
        });
        loadWatchlist();
      });
    });
  }

  // ==================== MODAL: TELEGRAM BOT CONNECTION STATUS ====================
  async function refreshBotStatus() {
    try {
      const res = await fetch('/api/bot-status');
      const data = await res.json();
      if (!data.ok) return;

      const tg = data.telegram || {};
      const connected = Boolean(tg.connected);
      botStatusDot.classList.toggle('online', connected);

      if (connected) {
        botStatusLabel.textContent = `Telegram Live (${tg.username})`;
      } else {
        botStatusLabel.textContent = 'Telegram Bot Setup';
      }

      tgModalStatus.textContent = connected ? `Connected (${tg.username})` : 'Simulator Mode';
      tgModalStatus.classList.toggle('online', connected);
    } catch (_err) {
      // ignore
    }
  }

  openConnectModalBtn.addEventListener('click', () => {
    refreshBotStatus();
    connectModal.classList.remove('hidden');
  });

  closeConnectModalBtn.addEventListener('click', () => {
    connectModal.classList.add('hidden');
  });

  connectModal.addEventListener('click', (e) => {
    if (e.target === connectModal) connectModal.classList.add('hidden');
  });

  connectTgBtn.addEventListener('click', async () => {
    const token = tgTokenInput.value.trim();
    if (!token) {
      tgFeedback.textContent = 'Please paste a valid TELEGRAM_BOT_TOKEN from @BotFather.';
      return;
    }
    tgFeedback.textContent = 'Connecting to Telegram...';
    const res = await fetch('/api/bot-connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (data.status?.connected) {
      tgFeedback.textContent = `✅ Connected live as ${data.status.username}! Open Telegram and send /start.`;
    } else {
      tgFeedback.textContent = `❌ Failed: ${data.status?.lastError || 'Invalid token'}`;
    }
    refreshBotStatus();
  });

  // Initial Boot
  (async function init() {
    await loadWatchlist();
    await sendBotMessage('/start');
    loadExplorerCourses();
    loadPlatformGuides();
    loadRoadmaps();
    refreshBotStatus();
  })();
})();
