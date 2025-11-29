const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Replace with your own tokens from .env
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;

// Create bot instance
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Send a welcome message on /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const welcomeMessage =
    `👋 Hello! Welcome to the VirusTotal Scanner Bot.\n\n` +
    `🛡️ This bot scans URLs or file hashes (SHA256/MD5) using the VirusTotal API and returns threat detection details.\n\n` +
    // `👨‍💻 *Developer:* Adithyan G\n` +
    // `☕️ *Buy me a coffee:*kkk\n` +
    // `🌐 *Website:* ${process.env.WEBSITE_URL}\n\n` +
    `To use, just send me a URL or file hash, and I'll fetch the VirusTotal scan report for you!`;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});


// VirusTotal API base URL
const VT_API_BASE = 'https://www.virustotal.com/api/v3';

// Helper: Escape Markdown special characters for Telegram
function escapeMarkdown(text) {
  if (!text) return '';
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

// Helper to query VirusTotal API for URL or file hash
async function getVirusTotalReport(query) {
  let url;

  // Determine if query is a URL or a hash
  if (query.match(/^https?:\/\//i)) {
    // URL scan - Encode URL to base64url as per VT v3 spec
    const encodedUrl = Buffer.from(query)
      .toString('base64')
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    url = `${VT_API_BASE}/urls/${encodedUrl}`;
  } else {
    // Assume it's a file hash (SHA256, SHA1, MD5)
    url = `${VT_API_BASE}/files/${query}`;
  }

  try {
    const response = await axios.get(url, {
      headers: { 'x-apikey': VIRUSTOTAL_API_KEY },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return { error: error.response.data.error.message || 'API Error' };
    }
    return { error: error.message };
  }
}

function formatReportMessage(data) {
  if (!data || data.error) {
    return `Error fetching report: ${escapeMarkdown(data.error || 'Unknown error')}`;
  }

  const attr = data.data.attributes;
  const stats = attr.last_analysis_stats || {};
  const results = attr.last_analysis_results || {};

  let maliciousThreats = [];
  for (const [vendor, result] of Object.entries(results)) {
    if (result.category === 'malicious' || result.category === 'phishing') {
      maliciousThreats.push(`${vendor}: ${result.category} (${result.result || 'detected'})`);
    }
  }

  let communityScore = attr.reputation !== undefined ? attr.reputation : 'N/A';
  const servingIpAddress =
    attr.network_addresses
      ? attr.network_addresses.join(', ')
      : attr.serving_ips?.join(', ') || 'N/A';
  const bodySha256 = attr.sha256 || 'N/A';
  const server = attr.http_response_headers?.Server || 'N/A';
  const lastSubmitted = attr.last_submission_date
    ? new Date(attr.last_submission_date * 1000).toLocaleString()
    : 'N/A';

  let message = '';

  if (data.data.type === 'url') {
    message += `🔗 *URL:* ${escapeMarkdown(attr.url)}\n\n`;
  } else if (data.data.type === 'file') {
    message += `🗂️ *File Hash (SHA256):* ${escapeMarkdown(bodySha256)}\n\n`;
  }

  message += `*Detection Stats:*\n` +
    `  ┌───────────────┐\n` +
    `  │ Malicious   : ${stats.malicious || 0}\n` +
    `  │ Suspicious  : ${stats.suspicious || 0}\n` +
    `  │ Undetected  : ${stats.undetected || 0}\n` +
    `  │ Harmless    : ${stats.harmless || 0}\n` +
    `  └───────────────┘\n\n`;

  message += `*Community Score:* ${communityScore}\n\n`;

  if (maliciousThreats.length > 0) {
    message += `⚠️ *Warning:* This link has threats detected!\n\n`;
    message += `*Malicious Threats Detected:*\n`;
    message += maliciousThreats
      .map(t => `- 🔴 *${escapeMarkdown(t)}*`)
      .join('\n') + '\n\n';
  } else {
    message += `✅ *This link is safe to use. No threats detected.*\n\n`;
  }

  message += `*Additional Details:*\n` +
    `  - Serving IP Address : ${escapeMarkdown(servingIpAddress)}\n` +
    `  - Server Header     : ${escapeMarkdown(server)}\n` +
    `  - Last Submission   : ${escapeMarkdown(lastSubmitted)}\n`;

  return message;
}


// Telegram message handler
// Simple regex to validate URL
function isValidUrl(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

// Simple regex for hex hashes (MD5=32, SHA1=40, SHA256=64)
function isValidHash(text) {
  return /^[a-fA-F0-9]{32}$/.test(text) ||  // MD5
    /^[a-fA-F0-9]{40}$/.test(text) ||  // SHA1
    /^[a-fA-F0-9]{64}$/.test(text);    // SHA256
}

// Modify message handler:
// Add this inside your bot.on('message') handler

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (!text) return;

  // If message is a command (starts with '/'), handle separately
  if (text.startsWith('/')) {
    // /start is handled by bot.onText above, but we can keep a fallback here or remove it.
    // The previous code had it inside here, let's keep it consistent with the original working version.
    return;
  }

  // If not a command, validate input
  if (!isValidUrl(text) && !isValidHash(text)) {
    return bot.sendMessage(chatId, '❗ Please send a valid URL starting with http/https or a valid file hash (MD5, SHA1, or SHA256).');
  }

  await bot.sendMessage(chatId, '🔎 Scanning, please wait...');

  const report = await getVirusTotalReport(text);

  const replyMessage = formatReportMessage(report);

  bot.sendMessage(chatId, replyMessage, { parse_mode: 'Markdown' });
});

console.log('Telegram VirusTotal bot started...');
