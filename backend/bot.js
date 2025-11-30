const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const vtKey = process.env.VIRUSTOTAL_API_KEY;

// Initialize Bot
const bot = new TelegramBot(token, { polling: true });
const VT_API_BASE = 'https://www.virustotal.com/api/v3';

// ------------------------------------------------------------------
// 1. VISUAL ASSETS (ASCII ART)
// ------------------------------------------------------------------
// Note: Backslashes are escaped (\\) for JS, and we will escape HTML later.

const ART = {
    SAFE: 
`  ______    ______   ________  ________ 
 /      \\  /      \\ /        |/        |
/$$$$$$  |/$$$$$$  |$$$$$$$$/ $$$$$$$$/ 
$$ \\__$$/ $$ |__$$ |$$ |__    $$ |__    
$$      \\ $$    $$ |$$    |   $$    |   
 $$$$$$  |$$$$$$$$ |$$$$$/    $$$$$/    
/  \\__$$ |$$ |  $$ |$$ |      $$ |_____ 
$$    $$/ $$ |  $$ |$$ |      $$       |
 $$$$$$/  $$/   $$/ $$/       $$$$$$$$/ `,

    THREAT: 
` _______    ______   __    __   ______   ________  _______  
/       \\  /      \\ /  \\  /  | /      \\ /        |/       \\ 
$$$$$$$  |/$$$$$$  |$$  \\ $$ |/$$$$$$  |$$$$$$$$/ $$$$$$$  |
$$ |  $$ |$$ |__$$ |$$$  \\$$ |$$ | _$$/ $$ |__    $$ |__$$ |
$$ |  $$ |$$    $$ |$$$$  $$ |$$ |/    |$$    |   $$    $$< 
$$ |  $$ |$$$$$$$$ |$$ $$ $$ |$$ |$$$$ |$$$$$/    $$$$$$$  |
$$ |__$$ |$$ |  $$ |$$ |$$$$ |$$ \\__$$ |$$ |_____ $$ |  $$ |
$$    $$/ $$ |  $$ |$$ | $$$ |$$    $$/ $$       |$$ |  $$ |
$$$$$$$/  $$/   $$/ $$/   $$/  $$$$$$/  $$$$$$$$/ $$/   $$/ `,

    UNKNOWN:
` __    __  __    __  __    __  __    __   ______   __       __  __    __ 
/  |  /  |/  \\  /  |/  |  /  |/  \\  /  | /      \\ /  |  _  /  |/  \\  /  |
$$ |  $$ |$$  \\ $$ |$$ | /$$/ $$  \\ $$ |/$$$$$$  |$$ | / \\ $$ |$$  \\ $$ |
$$ |  $$ |$$$  \\$$ |$$ |/$$/  $$$  \\$$ |$$ |  $$ |$$ |/$  \\$$ |$$$  \\$$ |
$$ |  $$ |$$$$  $$ |$$  $$<   $$$$  $$ |$$ |  $$ |$$ /$$$  $$ |$$$$  $$ |
$$ |  $$ |$$ $$ $$ |$$$$$  \\  $$ $$ $$ |$$ |  $$ |$$ $$/$$ $$ |$$ $$ $$ |
$$ \\__$$ |$$ |$$$$ |$$ |$$  \\ $$ |$$$$ |$$ \\__$$ |$$$$/  $$$$ |$$ |$$$$ |
$$    $$/ $$ | $$$ |$$ | $$  |$$ | $$$ |$$    $$/ $$$/    $$$ |$$ | $$$ |
 $$$$$$/  $$/   $$/ $$/   $$/ $$/   $$/  $$$$$$/  $$/      $$/ $$/   $$/ `
};

// ------------------------------------------------------------------
// 2. HELPER FUNCTIONS
// ------------------------------------------------------------------

// Escape HTML to prevent Telegram errors
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function isValidUrl(text) {
    try { new URL(text); return true; } catch { return false; }
}

function isValidHash(text) {
    return /^[a-fA-F0-9]{32}$/.test(text) || 
           /^[a-fA-F0-9]{40}$/.test(text) || 
           /^[a-fA-F0-9]{64}$/.test(text);
}

function getVTGuiLink(type, id) {
    if (type === 'url') return `https://www.virustotal.com/gui/url/${id}`;
    if (type === 'file') return `https://www.virustotal.com/gui/file/${id}`;
    return 'https://www.virustotal.com/gui/';
}

// Generates a visual progress bar: [████░░░░░░] 40%
function getProgressBar(value, total, length = 8) {
    const percentage = Math.min(Math.max(value / total, 0), 1);
    const fill = Math.round(length * percentage);
    const empty = length - fill;
    const bar = '█'.repeat(fill) + '░'.repeat(empty);
    return `[${bar}] ${Math.round(percentage * 100)}%`;
}

// ------------------------------------------------------------------
// 3. API HANDLER
// ------------------------------------------------------------------

async function getVirusTotalReport(query) {
    let url;
    
    // Determine if URL or Hash
    if (isValidUrl(query)) {
        const encodedUrl = Buffer.from(query).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
        url = `${VT_API_BASE}/urls/${encodedUrl}`;
    } else {
        url = `${VT_API_BASE}/files/${query}`;
    }

    try {
        const response = await axios.get(url, {
            headers: { 'x-apikey': vtKey }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return { error: error.response.data.error.message || 'Analysis not found.' };
        }
        return { error: error.message };
    }
}

// ------------------------------------------------------------------
// 4. FORMATTING LOGIC
// ------------------------------------------------------------------

function formatReportMessage(data) {
    // A. Handle Errors
    if (!data || data.error) {
        return {
            text: `<b>🚫 SYSTEM ERROR</b>\n<code>${escapeHtml(data.error)}</code>`,
            options: { parse_mode: 'HTML' }
        };
    }

    const attr = data.data.attributes;
    const stats = attr.last_analysis_stats || {};
    const type = data.data.type;
    const id = data.data.id;

    // B. Analyze Stats
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const totalEngines = (stats.harmless || 0) + (stats.undetected || 0) + malicious + suspicious;

    // C. Determine Theme (Safe vs Danger)
    let asciiArt = ART.SAFE;
    let headerText = "SYSTEM_SECURE";
    let statusIcon = "🟢"; 

    if (malicious > 0) {
        asciiArt = ART.THREAT;
        headerText = "THREAT_DETECTED";
        statusIcon = "🔴";
    } else if (suspicious > 0) {
        asciiArt = ART.UNKNOWN;
        headerText = "SUSPICIOUS_ACTIVITY";
        statusIcon = "🟠";
    }

    // D. Build the Message
    let msg = `<b>${statusIcon} SCAN COMPLETED: ${headerText}</b>\n`;
    
    // *** FIX IS HERE: We must escape the ASCII art too! ***
    msg += `<pre>${escapeHtml(asciiArt)}</pre>\n`;

    // Start the "Terminal Box"
    msg += `<code>┌──────────────────────────────</code>\n`;

    // 1. Target Details
    const targetName = type === 'url' ? 'URL' : 'FILE';
    msg += `<code>│ 🎯 TYPE    : </code><b>${targetName}</b>\n`;
    
    if (type === 'url') {
        const displayUrl = attr.url.length > 25 ? attr.url.substring(0, 22) + '...' : attr.url;
        msg += `<code>│ 🔗 LINK    : ${escapeHtml(displayUrl)}</code>\n`;
    } else {
        msg += `<code>│ 📁 HASH    : ${escapeHtml(attr.sha256.substring(0, 10))}...</code>\n`;
    }
    
    // 2. Detection Data
    const threatBar = getProgressBar(malicious, totalEngines || 1);
    msg += `<code>│</code>\n`;
    msg += `<code>│ 📊 RATIO   : ${malicious}/${totalEngines} Engines</code>\n`;
    msg += `<code>│ ☢️ THREAT  : ${threatBar}</code>\n`;
    
    // 3. Metadata
    const scanDate = attr.last_submission_date 
        ? new Date(attr.last_submission_date * 1000).toISOString().split('T')[0] 
        : 'N/A';
    msg += `<code>│</code>\n`;
    msg += `<code>│ 📅 DATE    : ${scanDate}</code>\n`;
    msg += `<code>└──────────────────────────────</code>\n\n`;

    // 4. MALICIOUS WARNING SECTION
    if (malicious > 0) {
        const results = attr.last_analysis_results || {};
        let threats = [];
        for (const [vendor, result] of Object.entries(results)) {
            if (result.category === 'malicious' || result.category === 'phishing') {
                threats.push(vendor);
            }
        }
        const topThreats = threats.slice(0, 3).join(', ');
        const extra = threats.length > 3 ? `(+${threats.length - 3})` : '';
        
        msg += `<b>⚠️ MALICIOUS THREATS DETECTED:</b>\n`;
        msg += `<i>This link has been confirmed as dangerous by ${malicious} security vendors. Do not click.</i>\n\n`;
        
        msg += `<b>🚩 DETECTED BY:</b>\n`;
        msg += `<code>> ${escapeHtml(topThreats)} ${extra}</code>\n\n`;
    }

    msg += `<i>Select an option below:</i>`;

    const options = {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🔍 View Full Analysis', url: getVTGuiLink(type, id) }
                ]
            ]
        }
    };

    return { text: msg, options: options };
}

// ------------------------------------------------------------------
// 5. BOT LISTENERS
// ------------------------------------------------------------------

bot.onText(/\/start/, (msg) => {
    const welcome = 
        `<code>[ SYSTEM ONLINE ]</code>\n\n` +
        `👋 <b>Welcome to VT Scanner.</b>\n` +
        `Send a <b>URL</b> or <b>File Hash</b> to initiate a threat scan.\n\n` +
        `<i>Powered by VirusTotal API</i>`;
    
    bot.sendMessage(msg.chat.id, welcome, { parse_mode: 'HTML' });
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();

    if (!text || text.startsWith('/')) return;

    if (!isValidUrl(text) && !isValidHash(text)) {
        return bot.sendMessage(chatId, '<code>[!] ERROR: Invalid Target. Send URL or Hash.</code>', { parse_mode: 'HTML' });
    }

    const loadingMsg = await bot.sendMessage(chatId, '<code>[ SYSTEM ] > INITIATING SCAN...</code>', { parse_mode: 'HTML' });

    const data = await getVirusTotalReport(text);
    const response = formatReportMessage(data);

    try {
        await bot.deleteMessage(chatId, loadingMsg.message_id);
    } catch (e) {
        // Ignored
    }

    bot.sendMessage(chatId, response.text, response.options);
});

console.log('🤖 Cyber-Security Bot Started...');