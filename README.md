# ✈️ CourseFinder Telegram Bot (`CourseFInder`)

An intelligent **Telegram Bot** and **Interactive Web Bot Simulator & Course Hub** that helps users find **100% Free Courses** across **Udemy, Coursera, edX, Harvard CS50, freeCodeCamp, MIT OpenCourseWare, Kaggle Learn, YouTube, Google Skillshop, Cisco NetAcad, The Odin Project, Full Stack Open, Saylor Academy, and Class Central** — without wasting time on paywalls or fake trials.

---

## ✨ Key Features

1. **Natural Language Chat & Course Discussion Advisor**
   - Describe what you want to learn in plain English on Telegram (e.g., *"I want to learn Python for data science from scratch with a free certificate"* or *"Where can I find free Udemy courses on Excel?"*).
   - Ask follow-up questions (*"Tell me more about #1"*, *"Only with free certificate"*, *"Compare Udemy vs Coursera"*).
2. **Instant Keyword Search & Pre-Filtered "100% Free" Deep Link Generator**
   - Searches a curated database of top-rated free courses **AND** generates instant pre-filtered `$0` search links for **any** keyword across:
     - **Udemy Free Filter** (`?price=price-free&sort=highest-rated`)
     - **Class Central** (150,000+ free university MOOCs)
     - **Coursera** (Free Audit mode)
     - **edX & Harvard CS50** (Free Audit + Free CS50 Certificates)
     - **YouTube** (Full ad-free bootcamps)
     - **freeCodeCamp & MIT OpenCourseWare**
3. **Udemy & Free Platform Playbook ("No Time Wasted" Guide)**
   - Step-by-step instructions on how to access Udemy's hidden Free Course portal (`udemy.com/courses/free/`), how 100%-off instructor coupon codes work, how to click Coursera's "Audit the course" link, and how to get free verified certificates from Harvard CS50 (`cs50.harvard.edu`), freeCodeCamp, Kaggle, Cisco, Google, and HubSpot.
4. **Step-by-Step $0 Learning Roadmaps**
   - Structured learning paths for **Full-Stack Web Dev**, **Python & AI/ML**, **Data Science & Analytics**, **Cybersecurity & Ethical Hacking**, **UI/UX & Product Design**, and **Digital Marketing & Business**.
5. **Saved Course Watchlist / Bookmarks**
   - Save courses with `/save #1` or 1-click Telegram inline buttons, track status (`Saved`, `In Progress`, `Completed`), and view anytime with `/saved`.

---

## ☁️ Deploying Your Telegram Bot on Botkeep (`https://botkeep.cloud/app`)

This project is pre-configured for **Botkeep's Node.js runtime** (`SERVER_PORT`, `0.0.0.0` binding, `TELEGRAM_BOT_TOKEN` secret, committed `package-lock.json`, and clean `SIGTERM` shutdown).

### Step 1: Get Your Free `TELEGRAM_BOT_TOKEN`
1. Open Telegram and search for **`@BotFather`**.
2. Send `/newbot`, choose a name (e.g. `CourseFinder Free Bot`) and a username ending in `bot` (e.g. `CourseFinderFree_bot`).
3. Copy the HTTP API token (`123456789:ABCdef...`).

### Step 2: Deploy on Botkeep (`https://botkeep.cloud/app`)

#### Option A: Deploy from GitHub
1. Sign in at **[https://botkeep.cloud/app](https://botkeep.cloud/app)**.
2. Click **Create / Deploy Workload** and select the **Node.js** runtime profile.
3. Choose **GitHub** as the source:
   - **Repository**: `harshi79/CourseFInder`
   - **Branch**: `main` (or the `arena/...` feature branch you are deploying from)
   - **Start command**: `npm start`
4. Open the **Environment** tab in Botkeep and add your secret:
   - `TELEGRAM_BOT_TOKEN` = *(paste your token from `@BotFather`)*
5. Allocate your RAM/CPU/Storage from your Botkeep pool (e.g. 512 MB RAM, 0.5 vCPU) and click **Start**.

#### Option B: Deploy from a Clean ZIP Archive
1. Create a clean ZIP with `package.json` and `package-lock.json` at the root:
   ```bash
   zip -r coursefinder-botkeep.zip package.json package-lock.json README.md src/ public/ test/
   ```
2. In **[https://botkeep.cloud/app](https://botkeep.cloud/app)**, choose **Node.js** &rarr; **ZIP upload**, upload `coursefinder-botkeep.zip`, confirm `npm start` as the start command, set `TELEGRAM_BOT_TOKEN` in **Environment**, and click **Start**.

> **ZIP deploys must include `src/data/`.** The catalog, platform playbooks and
> roadmaps are committed JavaScript modules — if they are missing the server
> crashes on boot with `Error: Cannot find module './data/courses'`.

---

## 🗂️ Project Layout

```text
src/
├── data/            # ✅ COMMITTED content modules (Botkeep deploys from GitHub)
│   ├── courses.js   #    67 curated 100% free / free-to-audit courses
│   ├── platforms.js #    15 platform playbooks + buildDirectSearchLinks() (7 $0 links)
│   └── roadmaps.js  #    6 step-by-step $0 learning paths
├── services/        #    search + synonym engine, watchlist persistence
├── bot/engine.js    #    conversational bot brain (Telegram + web simulator)
├── platforms/       #    grammY Telegram binding
└── server.js        #    Express API + static web hub (npm start)
data/                # ⛔ gitignored RUNTIME storage (data/watchlist.json)
```

⚠️ **Do not add `data/` to `.gitignore` without a leading slash.** A bare
`data/` rule ignores *any* directory named `data` — including `src/data/` —
which silently drops the content modules from every GitHub deploy. The rule is
intentionally `/data/` so only the root-level runtime store is ignored.
`npm test` fails if `src/data/courses.js` is ever gitignored again.

### ✅ Tests

```bash
npm test   # roster of bot conversations + catalog/schema/api integrity checks
```

The suite boots the real Express app, exercises every REST route, and validates
that each roadmap step points at a course that actually exists.

---

## 🤖 Telegram Bot Commands

| Command | Description |
| :--- | :--- |
| `/start` or `/help` | Show welcome menu, inline buttons, and command list |
| `/udemy <topic>` | Get highest-rated **100% Free Udemy** filter link + coupon playbook for `<topic>` |
| `/search <keyword>` | Find free courses + generate pre-filtered free links for `<keyword>` |
| `/cert [topic]` | Filter for courses that include a **100% Free Verified Certificate** |
| `/platforms` | Show the complete directory of where free courses live & how to bypass paywalls |
| `/roadmap <topic>` | Get a step-by-step $0 learning path (`web-dev`, `python-ai`, `data-science`, `cybersecurity`, `ui-ux`, `business`) |
| `/compare <A> vs <B>` | Compare platforms side-by-side (e.g. `/compare udemy vs coursera`) |
| `/save <# or id>` | Save a course to your personal watchlist (e.g. `/save #1` or `/save cs50x`) |
| `/saved` | View your bookmarked courses and progress status |
| `/random` | Get a random high-rated free course recommendation |
