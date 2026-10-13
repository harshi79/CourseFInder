require('dotenv').config();
const { startTelegramBot } = require('./platforms/telegram');

(async () => {
  const status = await startTelegramBot();
  if (!status.connected) {
    console.error(`[Telegram Bot] Could not connect: ${status.lastError}`);
    console.error('Set TELEGRAM_BOT_TOKEN in .env (from @BotFather on Telegram) and try again.');
    process.exit(1);
  }
})();
