const { Bot, InlineKeyboard } = require('grammy');
const { handleBotMessage } = require('../bot/engine');

let botInstance = null;
let botStatus = {
  connected: false,
  username: null,
  startedAt: null,
  lastError: null
};

const TELEGRAM_COMMANDS = [
  { command: 'start', description: 'Start CourseFinder Bot & view main menu' },
  { command: 'udemy', description: 'Find 100% Free Udemy courses & coupon guide (e.g. /udemy python)' },
  { command: 'search', description: 'Search free courses on any topic (e.g. /search react)' },
  { command: 'cert', description: 'Courses with 100% Free Verified Certificates' },
  { command: 'roadmap', description: 'Step-by-step $0 learning path (e.g. /roadmap web-dev)' },
  { command: 'platforms', description: 'Where free courses live & how to audit for $0' },
  { command: 'compare', description: 'Compare platforms (e.g. /compare udemy vs coursera)' },
  { command: 'saved', description: 'View your bookmarked free courses watchlist' },
  { command: 'random', description: 'Surprise me with a high-rated free course' }
];

/**
 * Converts our engine's courses + quickReplies into a grammY InlineKeyboard
 */
function buildTelegramKeyboard(response) {
  const keyboard = new InlineKeyboard();
  let hasButtons = false;

  // Add direct course URL + Save buttons for top 3 courses
  if (Array.isArray(response.courses) && response.courses.length > 0) {
    response.courses.slice(0, 3).forEach((course, idx) => {
      keyboard
        .url(`🔗 #${idx + 1}: ${course.title.slice(0, 26)}...`, course.url)
        .text(`🔖 Save #${idx + 1}`, `save:${course.id}`.slice(0, 64))
        .row();
      hasButtons = true;
    });
  }

  // Add quick action buttons (2 per row)
  if (Array.isArray(response.quickReplies) && response.quickReplies.length > 0) {
    response.quickReplies.slice(0, 4).forEach((qr, i) => {
      keyboard.text(qr.label, qr.action.slice(0, 64));
      hasButtons = true;
      if (i % 2 === 1) {
        keyboard.row();
      }
    });
  }

  return hasButtons ? keyboard : undefined;
}

async function sendFormattedReply(ctx, response) {
  const replyMarkup = buildTelegramKeyboard(response);
  try {
    await ctx.reply(response.markdown, {
      parse_mode: 'Markdown',
      link_preview_options: { is_disabled: true },
      reply_markup: replyMarkup
    });
  } catch (_err) {
    // Fallback to plain text if special characters in dynamic user text break Telegram Markdown v1
    await ctx.reply(response.markdown.replace(/[*_`]/g, ''), {
      link_preview_options: { is_disabled: true },
      reply_markup: replyMarkup
    });
  }
}

async function startTelegramBot(customToken) {
  const token = (
    customToken ||
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.TELEGRAM_TOKEN ||
    ''
  ).trim();

  if (!token) {
    botStatus = {
      connected: false,
      username: null,
      startedAt: null,
      lastError: 'TELEGRAM_BOT_TOKEN not set'
    };
    return botStatus;
  }

  if (botInstance) {
    await stopTelegramBot();
  }

  try {
    const bot = new Bot(token);

    // Verify token & register Telegram native "/" commands menu
    const me = await bot.api.getMe();
    await bot.api.setMyCommands(TELEGRAM_COMMANDS).catch(() => {});

    // Handle all text messages & commands (/start, /udemy, /search, or plain English chat)
    bot.on('message:text', async (ctx) => {
      const chatId = ctx.chat.id;
      const userId = `telegram:${chatId}`;
      const response = handleBotMessage(userId, ctx.message.text);
      await sendFormattedReply(ctx, response);
    });

    // Handle inline button clicks (Save, Roadmaps, Udemy filter, Free Certs, etc.)
    bot.on('callback_query:data', async (ctx) => {
      const chatId = ctx.chat?.id || ctx.from?.id;
      const data = ctx.callbackQuery.data;
      await ctx.answerCallbackQuery().catch(() => {});
      if (!chatId || !data) return;

      const userId = `telegram:${chatId}`;
      const response = handleBotMessage(userId, data);
      await sendFormattedReply(ctx, response);
    });

    bot.catch((err) => {
      botStatus.lastError = err.message;
      console.error('[Telegram Bot Error]', err.message);
    });

    // Start long polling in background (non-blocking)
    bot.start({
      onStart: (botInfo) => {
        console.log(`[Telegram Bot] Polling active as @${botInfo.username}`);
      }
    });

    botInstance = bot;
    botStatus = {
      connected: true,
      username: me.username ? `@${me.username}` : me.first_name,
      startedAt: new Date().toISOString(),
      lastError: null
    };
    console.log(`[Telegram Bot] Connected as ${botStatus.username}`);
    return botStatus;
  } catch (err) {
    botStatus = {
      connected: false,
      username: null,
      startedAt: null,
      lastError: err.message
    };
    return botStatus;
  }
}

async function stopTelegramBot() {
  if (botInstance) {
    try {
      await botInstance.stop();
    } catch (_err) {
      // ignore stop errors
    }
    botInstance = null;
  }
  botStatus.connected = false;
  return botStatus;
}

function getTelegramBotStatus() {
  return botStatus;
}

module.exports = {
  startTelegramBot,
  stopTelegramBot,
  getTelegramBotStatus
};
